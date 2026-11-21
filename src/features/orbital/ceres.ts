import type { EvidenceGap } from '../evidence/model.ts';
import horizons from './data/ceres-horizons.json' with { type: 'json' };
import sbdb from './data/ceres-sbdb.json' with { type: 'json' };
import receipt from './data/ceres-receipt.json' with { type: 'json' };
import { closestSampleIndex, parseCeresHorizons, type StateSample } from './ephemeris.ts';

type CaptureSource = typeof receipt.horizons;

type OrbitalFinding = Pick<EvidenceGap, 'id' | 'directEvidence' | 'limitation' | 'nextAction'> & {
  title: string;
  verification: 'Confirmed within source scope' | 'Cannot determine from available records';
  sources: ('Horizons' | 'Small-Body Database')[];
};

export type CeresInstrument = {
  name: string;
  designation: string;
  solutionId: string;
  epochJdTdb: number;
  epochCalendarTdb: string;
  solutionDatePacific: string;
  firstObservation: string;
  lastObservation: string;
  observationCount: number;
  horizons: CaptureSource;
  sbdb: CaptureSource;
  samples: StateSample[];
  initialIndex: number;
  findings: OrbitalFinding[];
};

export function loadCeres(): CeresInstrument {
  const captured = parseCeresHorizons(horizons);
  const { object, orbit } = sbdb;
  if (
    sbdb.signature.version !== '1.3' || receipt.sbdb.version !== sbdb.signature.version ||
    receipt.horizons.version !== horizons.signature.version ||
    object.des !== '1' || object.fullname !== '1 Ceres (A801 AA)' || object.spkid !== '20000001' ||
    orbit.source !== 'JPL' || object.orbit_id !== captured.solutionId || orbit.orbit_id !== captured.solutionId ||
    Number(orbit.epoch) !== captured.epochJdTdb || !orbit.epoch_cd ||
    !orbit.first_obs || !orbit.last_obs || !orbit.soln_date || !orbit.n_obs_used || !orbit.sb_used || !orbit.rms
  ) throw new Error('Ceres identity, solution epoch, or required source metadata do not match');

  // Start near the midpoint of the captured interval using only JDTDB.
  const first = captured.samples[0];
  const last = captured.samples[captured.samples.length - 1];
  const initialIndex = closestSampleIndex(captured.samples, (first.jdTdb + last.jdTdb) / 2);

  const findings: OrbitalFinding[] = [
    {
      id: 'ceres-jpl48-epoch',
      title: 'Source epoch and subsequent tracking',
      verification: 'Cannot determine from available records',
      sources: ['Horizons', 'Small-Body Database'],
      directEvidence: 'The two captures identify JPL solution ' + captured.solutionId + '. The solution elements are referenced to ' +
        orbit.epoch_cd + ' TDB. The database lists ' + orbit.n_obs_used + ' observations from ' + orbit.first_obs + ' through ' + orbit.last_obs + '.',
      limitation: 'The element epoch dates the orbital state used as a reference. This capture cannot establish which newer observations exist, whether they were incorporated elsewhere, or whether the fitted orbit needs revision.',
      nextAction: 'Compare a newer published orbit solution and its observation arc with the one pinned here.',
    },
    {
      id: 'ceres-jpl48-interval',
      title: 'Sample coverage and horizon',
      verification: 'Confirmed within source scope',
      sources: ['Horizons'],
      directEvidence: 'The saved table contains ' + captured.samples.length + ' states at seven-day intervals, from ' +
        first.dateTdb + ' through ' + last.dateTdb + ' TDB, inclusive.',
      limitation: 'The table supplies no state between samples or beyond its endpoints. The display cannot establish an accuracy horizon for the dynamical solution.',
      nextAction: 'Request matching Horizons vectors for the additional epochs or a denser sampling grid.',
    },
    {
      id: 'ceres-jpl48-model',
      title: 'Model and fit metadata differ',
      verification: 'Cannot determine from available records',
      sources: ['Horizons', 'Small-Body Database'],
      directEvidence: 'Horizons lists ' + captured.perturbers + ' for its small perturbers and residual RMS ' + captured.residualRms +
        '. The Small-Body Database lists ' + orbit.sb_used + ' as its small-body ephemeris and RMS ' + orbit.rms + '.',
      limitation: 'The fields may describe different stages of orbit fitting and ephemeris generation. This capture cannot establish that the RMS values use the same residual definition or weighting.',
      nextAction: 'Check JPL model and fit documentation before comparing those fields or combining model outputs.',
    },
    {
      id: 'ceres-jpl48-uncertainty',
      title: 'State uncertainty and observation detail',
      verification: 'Cannot determine from available records',
      sources: ['Horizons', 'Small-Body Database'],
      directEvidence: 'Horizons supplies geometric state vectors. The database supplies orbit-fit metadata and an observation span.',
      limitation: 'The selected responses omit a per-state covariance or uncertainty envelope and the individual observation records. Coverage within the stated observation span is unresolved.',
      nextAction: 'Obtain the underlying astrometry and request a compatible covariance solution before quantifying prediction uncertainty.',
    },
  ];

  return {
    name: object.shortname, designation: 'A801 AA', solutionId: captured.solutionId,
    epochJdTdb: captured.epochJdTdb, epochCalendarTdb: orbit.epoch_cd,
    solutionDatePacific: orbit.soln_date, firstObservation: orbit.first_obs, lastObservation: orbit.last_obs,
    observationCount: orbit.n_obs_used, horizons: receipt.horizons, sbdb: receipt.sbdb,
    samples: captured.samples, initialIndex, findings,
  };
}
