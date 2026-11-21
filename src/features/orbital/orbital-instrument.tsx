'use client';

import { useState } from 'react';
import type { CeresInstrument } from './ceres';
import { sampleMetrics, SAMPLE_STEP_DAYS } from './ephemeris';
import { OrbitPlot } from './orbit-plot';
import styles from './orbital.module.css';

const integer = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const decimal = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 3, maximumFractionDigits: 3, useGrouping: false,
});

export function OrbitalInstrument({ instrument }: { instrument: CeresInstrument }) {
  const { samples, epochJdTdb, initialIndex } = instrument;
  const [index, setIndex] = useState(initialIndex);
  const sample = samples[index];
  const { distanceAu, speedKmS, radialKmS } = sampleMetrics(sample);
  const end = samples.length - 1;

  return (
    <>
      <div className={styles.dashboard}>
        <section className={styles.instrument} aria-labelledby="orbit-title">
          <header className={styles.instrumentHead}>
            <h2 id="orbit-title">Heliocentric trajectory</h2>
            <p>J2000 ecliptic plane · NASA/JPL Horizons</p>
          </header>
          <OrbitPlot samples={samples} index={index} />
          <div className={styles.timeControls}>
            <div className={styles.timeHeader}>
              <label htmlFor="orbital-sample">Ephemeris sample</label>
              <output htmlFor="orbital-sample">{sample.dateTdb} · 00:00 TDB</output>
            </div>
            <input
              id="orbital-sample"
              type="range"
              min={0}
              max={end}
              step={1}
              value={index}
              aria-valuetext={sample.dateTdb + ' at midnight TDB, sample ' + (index + 1) + ' of ' + samples.length}
              aria-describedby="orbital-step"
              onChange={(event) => setIndex(Number(event.target.value))}
            />
            <div className={styles.timelineBounds} aria-hidden="true">
              <span>{samples[0].dateTdb}</span><span>{samples[end].dateTdb}</span>
            </div>
            <div className={styles.timeActions}>
              <button type="button" disabled={index === 0} onClick={() => setIndex(index - 1)}>Previous sample</button>
              <button type="button" disabled={index === end} onClick={() => setIndex(index + 1)}>Next sample</button>
              <p id="orbital-step">{SAMPLE_STEP_DAYS} TDB days per step</p>
            </div>
          </div>
        </section>
        <section className={styles.panel} aria-labelledby="orbital-inspection">
          <h2 id="orbital-inspection">State inspection</h2>
          <p className={styles.muted}>Modeled geometric state from JPL, relative to the Sun’s center.</p>
          <dl className={styles.selected}>
            <div><dt>Selected epoch</dt><dd>{sample.dateTdb} 00:00 TDB</dd></div>
            <div><dt>Julian date (TDB)</dt><dd>{sample.jdTdb.toFixed(1)}</dd></div>
            <div><dt>Sample</dt><dd>{index + 1} of {samples.length}</dd></div>
          </dl>
          <table className={styles.state} data-sample-jd={sample.jdTdb}>
            <caption>JPL state vector components</caption>
            <thead><tr><th scope="col">Axis</th><th scope="col">Position (km)</th><th scope="col">Velocity (km/s)</th></tr></thead>
            <tbody>
              {['X', 'Y', 'Z'].map((axis, component) => (
                <tr key={axis}>
                  <th scope="row">{axis}</th>
                  <td>{integer.format(sample.positionKm[component])}</td>
                  <td>{decimal.format(sample.velocityKmS[component])}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3 className={styles.calculations}>Calculated from the state vector</h3>
          <dl className={styles.selected}>
            <div><dt>Distance from Sun</dt><dd>{decimal.format(distanceAu)} au</dd></div>
            <div><dt>Speed relative to Sun</dt><dd>{decimal.format(speedKmS)} km/s</dd></div>
            <div><dt>Radial speed</dt><dd>{decimal.format(radialKmS)} km/s</dd></div>
            <div><dt>Days from solution epoch</dt><dd>{(sample.jdTdb - epochJdTdb).toFixed(1)} TDB days</dd></div>
          </dl>
        </section>
      </div>

      <section className={styles.panel} aria-labelledby="orbital-source">
        <h2 id="orbital-source">Source and time coverage</h2>
        <dl className={styles.source}>
          <div><dt>Object</dt><dd>{instrument.name} · {instrument.designation}</dd></div>
          <div><dt>JPL solution</dt><dd>#{instrument.solutionId}</dd></div>
          <div><dt>Solution element epoch</dt><dd>{instrument.epochCalendarTdb} TDB · JD {epochJdTdb}</dd></div>
          <div><dt>Orbit determination</dt><dd>{instrument.solutionDatePacific} Pacific local time</dd></div>
          <div><dt>Horizons response retrieved</dt><dd><time dateTime={instrument.horizons.retrievedAt}>{instrument.horizons.retrievedAt.replace('T', ' ').replace('Z', ' UTC')}</time></dd></div>
          <div><dt>SBDB response retrieved</dt><dd><time dateTime={instrument.sbdb.retrievedAt}>{instrument.sbdb.retrievedAt.replace('T', ' ').replace('Z', ' UTC')}</time></dd></div>
          <div><dt>Fit observation span</dt><dd>{instrument.firstObservation} through {instrument.lastObservation} · {integer.format(instrument.observationCount)} used</dd></div>
          <div><dt>Captured sample window</dt><dd>{samples[0].dateTdb} through {samples[end].dateTdb} TDB, inclusive</dd></div>
        </dl>
        <p className={styles.links}>
          <a href={instrument.horizons.url}>Reproduce the Horizons query</a>
          <a href={instrument.sbdb.url}>View Small-Body Database query</a>
        </p>
        <p className={styles.captureNote}>Running a source query again may return a newer orbit solution.</p>
      </section>

      <section className={styles.panel} aria-labelledby="orbital-evidence">
        <h2 id="orbital-evidence">Evidence gaps and limits</h2>
        <p className={styles.muted}>Each finding applies to the saved JPL sources and identifies what evidence could resolve it.</p>
        {instrument.findings.map((finding) => (
          <details key={finding.id} className={styles.finding}>
            <summary>{finding.title}</summary>
            <dl className={styles.findingContent}>
              <dt>Verification</dt><dd>{finding.verification}</dd>
              <dt>What the sources establish</dt><dd>{finding.directEvidence}</dd>
              <dt>What remains unresolved</dt><dd>{finding.limitation}</dd>
              <dt>Next evidence to check</dt><dd>{finding.nextAction}</dd>
            </dl>
            <p className={styles.findingSources}>Source records{' '}
              {finding.sources.map((name, index) => (
                <span key={name}>
                  {index > 0 && ' · '}
                  <a href={name === 'Horizons' ? instrument.horizons.url : instrument.sbdb.url}>{name}</a>
                </span>
              ))}
            </p>
          </details>
        ))}
      </section>

      <section className={styles.methods} aria-labelledby="orbital-method">
        <h2 id="orbital-method">Method and interpretation</h2>
        <p>
          Horizons generated geometric state vectors from JPL’s numerical ephemeris for solution #{instrument.solutionId},
          with the Sun’s center as the origin and the fixed ecliptic of J2000.0 as the reference plane.
          The Sun’s ephemeris is DE441. Geometric vectors use no light-time or stellar-aberration correction.
          The selected times and Julian dates are in Barycentric Dynamical Time (TDB). Retrieval timestamps are UTC.
        </p>
        <p>
          Strata computes distance and speed as the three-dimensional vector magnitudes. Radial speed is the component
          of velocity along the Sun-to-Ceres direction. One astronomical unit is exactly 149,597,870.7 km.
          The table rounds the displayed components. The source response retains their published precision.
        </p>
        <p>
          The plot uses the X and Y components, with positive X right and positive Y up.
          Lines connect successive samples for orientation. The Sun and selection symbols are sized for readability.
          Time inspection is limited to the published samples in this saved interval. The displayed path is unsuitable
          for determining apparent sky positions or planning spacecraft navigation.
        </p>
        <p className={styles.links}>
          <a href="https://ssd.jpl.nasa.gov/horizons/manual.html">JPL Horizons manual</a>
          <a href="https://ssd.jpl.nasa.gov/faq.html">JPL constants and units</a>
        </p>
      </section>
    </>
  );
}
