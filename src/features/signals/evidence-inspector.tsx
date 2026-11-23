import type { SourceGap } from '../evidence/model';
import { EXCLUSIONS, NOAA_SCHEMA, qualityLabel, type SignalsSnapshot } from './observations';
import { formatFullUtc, formatRaw, formatUtc } from './display';
import styles from './signals.module.css';

const verificationLabels: Record<SourceGap['verification'], string> = {
  confirmed_within_source_scope: 'Confirmed within source scope',
  apparent_requires_investigation: 'Apparent, requires investigation',
  cannot_determine: 'Cannot determine from available records',
};

function GapExplanation({ gap }: { gap: SourceGap }) {
  return (
    <dl className={styles.explanation}>
      <dt>Verification</dt><dd>{verificationLabels[gap.verification]}</dd>
      <dt>What the response establishes</dt><dd>{gap.directEvidence}</dd>
      <dt>What remains open</dt><dd>{gap.limitation} {gap.alternatives}</dd>
      <dt>Next evidence to check</dt><dd>{gap.nextAction}</dd>
    </dl>
  );
}

export function EvidenceInspector({ snapshot, selectedObservationAt }: { snapshot: SignalsSnapshot; selectedObservationAt: string | null }) {
  const missing = snapshot.gaps.filter((gap) => gap.type === 'observation_gap');
  const unknown = snapshot.gaps.find((gap) => gap.type === 'source_coverage_unknown');
  const exclusions = snapshot.gaps.filter((gap) => gap.type === 'excluded_observation');
  const quality = snapshot.gaps.filter((gap) => gap.type === 'uninterpreted_quality');

  return (
    <section className={styles.panel} id="signals-evidence" aria-labelledby="signals-evidence-heading">
      <h2 id="signals-evidence-heading">Evidence gaps</h2>
      <p className={styles.muted}>
        One completed UTC hour is one expected slot in this review. A gap describes the available NOAA response within the selected window.
      </p>
      {unknown && (
        <div className={styles.finding}>
          <h3>Hourly coverage cannot be determined</h3>
          <GapExplanation gap={unknown} />
        </div>
      )}
      {missing.length > 0 && (
        <details className={styles.disclosure} open={selectedObservationAt ? missing.some((gap) => gap.interval?.startUtc === selectedObservationAt) : undefined}>
          <summary>Expected hours without an accepted value <strong>{missing.length}</strong></summary>
          <p className={styles.muted}>Choose an hour to inspect the evidence and what might resolve it.</p>
          <ul className={styles.gapList}>
            {missing.map((gap) => gap.interval && (
              <li key={gap.id}>
                <details className={styles.hour} open={selectedObservationAt === gap.interval?.startUtc}>
                  <summary>
                    <time dateTime={gap.interval.startUtc}>{formatUtc(gap.interval.startUtc)}</time>
                    <span>{gap.sources[0].rowIndexes?.length ? 'Raw rows excluded' : 'No matching row'}</span>
                  </summary>
                  <GapExplanation gap={gap} />
                </details>
              </li>
            ))}
          </ul>
        </details>
      )}
      {exclusions.length > 0 && (
        <details className={styles.disclosure}>
          <summary>Excluded raw rows <strong>{exclusions.length}</strong></summary>
          <p className={styles.muted}>Row numbers follow the original source order. A row with an invalid time cannot be assigned to an expected hour.</p>
          <ul className={styles.gapList}>
            {snapshot.exclusions.map((row, index) => (
              <li key={row.rowIndex}>
                <details className={styles.hour}>
                  <summary>Row {row.rowIndex + 1}<span>{EXCLUSIONS[row.reason]}</span></summary>
                  <dl className={styles.explanation}>
                    <dt>Raw GMT time</dt><dd>{formatRaw(row.rawTimestamp)}</dd>
                    <dt>Raw value</dt><dd>{formatRaw(row.rawValue)}</dd>
                    <dt>NOAA quality metadata</dt><dd>{qualityLabel(row.flags)}</dd>
                  </dl>
                  <GapExplanation gap={exclusions[index]} />
                </details>
              </li>
            ))}
          </ul>
        </details>
      )}
      {quality.length > 0 && (
        <details className={styles.disclosure}>
          <summary>Accepted hours with quality fields to review <strong>{quality.length}</strong></summary>
          <GapExplanation gap={quality[0]} />
          <ul className={styles.qualityList}>
            {snapshot.observations.filter(({ rowIndex }) => quality.some(({ sources }) => sources[0].rowIndexes?.includes(rowIndex))).map((row) => (
              <li key={row.observedAt}>
                <time dateTime={row.observedAt}>{formatFullUtc(row.observedAt)}</time> · {qualityLabel(row.flags)}
              </li>
            ))}
          </ul>
          <a href={NOAA_SCHEMA}>Read NOAA’s field definitions</a>
        </details>
      )}
      {!snapshot.gaps.length && (
        <p className={styles.clear}>This response includes an accepted observation for every expected hour. There are no excluded rows or quality fields flagged for review by this instrument.</p>
      )}
    </section>
  );
}
