import { cellLocator, fields, isNumber, oxygenReference, profileProgram, station, workbookHashes, workbookUrl, type DepthRecord, type Metric } from './casts';
import { metrics, type CastView } from './explorer-model';
import styles from './pawtuxet.module.css';

export function sourceValue(value: DepthRecord['depth'] | undefined) {
  return value === null || value === undefined || value === '' ? 'Missing' : String(value);
}

const lensNotes = {
  oxygen: {
    reading: 'The screen flags numeric oxygen values below 3 mg/L at unique depths. Duration, spatial extent, and species response remain unresolved.',
    question: 'How long do low-oxygen conditions persist?',
    evidence: 'Repeated or continuous oxygen measurements at known depths, with verified clocks and tide timing, could distinguish a brief reading from sustained exposure.',
  },
  salinity: {
    reading: 'Differences between sampled bins show how salt content varied with depth in this cast. A salinity contrast may contribute to density stratification. Use the separate published density lens to inspect density evidence.',
    question: 'Does the depth contrast persist across a tide?',
    evidence: 'Tide-stamped repeat casts and co-located current and freshwater-discharge records could distinguish persistent layering from tidal movement and mixing.',
  },
  temperature: {
    reading: 'The sampled temperatures show vertical differences at this source clock. Seasonal and tidal effects require measurements on other dates and tide stages with comparable coverage.',
    question: 'Does the temperature difference recur at the same tide stage or season?',
    evidence: 'Repeated casts at comparable depths, a verified clock offset and tidal records would support that comparison.',
  },
  density: {
    reading: 'Published density describes mass per volume at the sampled bins. The workbook leaves the density equation and reference basis unspecified, and the spacing leaves the shape of any stratification unresolved.',
    question: 'Would the published density contrast persist between casts?',
    evidence: 'The profiler method, density calculation and reference pressure, plus repeated co-sampled temperature and salinity profiles, would clarify the density comparison.',
  },
} satisfies Record<Metric, { reading: string; question: string; evidence: string }>;

export function Reading({ view, metric }: { view: CastView; metric: Metric }) {
  const { cast, row } = view;
  const field = fields[metric];
  const value = row?.[metric] ?? null;

  return (
    <div className={styles.reading} aria-live="polite" aria-atomic="true">
      <h3>Selected reading</h3>
      <p className={styles.metricName}>{field.label}</p>
      <p className={styles.value} data-selected-value>{sourceValue(value)}{isNumber(value) && <> <span>{field.units}</span></>}</p>
      {row ? (
        <>
          <p className={styles.readingDepth} data-selected-depth>
            {isNumber(row.depth) ? `Depth ${row.depth} m` : 'Depth unavailable'} · Workbook row {row.row}
          </p>
          <p className={styles.locator} data-selected-cell>{cellLocator(cast.year, row.row, metric)}</p>
          {isNumber(row.depth) && (view.depthGroups.get(row.depth) ?? 0) > 1 && <p className={styles.caution}>Repeated depth. Each workbook row remains selectable.</p>}
          {!isNumber(value) && <p className={styles.caution}>This row has no numeric {field.label.toLowerCase()} value to plot.</p>}
          {metric === 'oxygen' && view.lowRows.has(row.row) && <p className={styles.caution}>Below the 3 mg/L screening reference.</p>}
        </>
      ) : <p className={styles.muted}>Depth readings are unavailable for this visit.</p>}
    </div>
  );
}

export function MeasurementContext({ view, metric }: { view: CastView; metric: Metric }) {
  const { cast, lowRows, oxygenAssessable } = view;
  const lowDepths = cast.records.filter(({ row }) => lowRows.has(row)).map(({ depth }) => depth);

  return (
    <section className={styles.context}>
      <h3>{fields[metric].label} in this cast</h3>
      {metric === 'oxygen' && (
        <p className={lowRows.size ? styles.caution : styles.muted}>
          {lowRows.size
            ? <><strong>{lowRows.size} published readings below 3 mg/L</strong> in one cast on <time dateTime={cast.date}>{cast.date}</time> at depths {lowDepths.join(', ')} m.</>
            : oxygenAssessable ? 'No unique-depth reading in this cast falls below 3 mg/L.' : 'Oxygen screening is unavailable for this cast.'}
        </p>
      )}
      <p>{lensNotes[metric].reading}</p>
      {metric === 'oxygen' && <p><a href={oxygenReference}>RIDEM’s 3 mg/L reporting reference</a></p>}
      <p><strong>Open question</strong> · {lensNotes[metric].question}</p>
    </section>
  );
}

export function CastComparison({ view, metric }: { view: CastView; metric: Metric }) {
  const { shallow, deep, difference } = view;
  const field = fields[metric];
  const endpoints = [
    { label: 'Shallowest bin', row: shallow },
    { label: 'Deepest bin', row: deep },
  ];
  return (
    <section className={styles.context}>
      <h3>Compare sampled depths</h3>
      <dl className={styles.endpoints}>
        {endpoints.map(({ label, row }) => (
          <div key={label}><dt>{label}</dt>
            <dd>{row ? <>{sourceValue(row[metric])}{isNumber(row[metric]) ? ` ${field.units}` : ''}<small>{row.depth} m · row {row.row}</small></> : 'Unavailable'}</dd>
          </div>
        ))}
      </dl>
      <p className={styles.difference}><strong>{difference === null ? 'Unavailable' : `${difference > 0 ? '+' : ''}${difference.toFixed(4)} ${field.units}`}</strong><br />
        {difference === null ? 'The comparison requires two unique endpoints with numeric values.' : 'Deep minus shallow · calculated and rounded to four decimal places'}</p>
      <p className={styles.muted}>The endpoints describe the published bins in one cast. Their distances from the surface and bed are unknown.</p>
    </section>
  );
}

export function DepthTable({ view, metric, onSelect }: {
  view: CastView;
  metric: Metric;
  onSelect: (row: number) => void;
}) {
  return (
    <details className={styles.disclosure}>
      <summary>Numerical depth table</summary>
      <table className={styles.table}>
        <caption>{fields[metric].label} by depth and workbook row</caption>
        <thead><tr><th scope="col">Row</th><th scope="col">Depth (m)</th><th scope="col">{fields[metric].units}</th><th scope="col">Notes</th></tr></thead>
        <tbody>
          {view.ordered.map((record) => {
            const repeated = isNumber(record.depth) && (view.depthGroups.get(record.depth) ?? 0) > 1;
            return (
              <tr key={record.row} data-selected={record.row === view.row?.row}>
                <th scope="row"><button type="button" className={styles.rowButton} aria-label={`Select workbook row ${record.row}`} aria-pressed={record.row === view.row?.row} onClick={() => onSelect(record.row)}>{record.row}</button></th>
                <td className={styles.numeric}>{sourceValue(record.depth)}</td>
                <td className={styles.numeric}>{sourceValue(record[metric])}</td>
                <td>{[
                  repeated && 'Repeated depth',
                  view.lowRows.has(record.row) && 'Oxygen below 3 mg/L',
                  !isNumber(record[metric]) && 'Numeric value unavailable',
                  !isNumber(record.depth) && 'Depth unavailable',
                ].filter(Boolean).join(' · ') || '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </details>
  );
}

export function SourceQuality({ view, metric }: { view: CastView; metric: Metric }) {
  const { cast, row, depthGroups } = view;
  const meta = `${cast.year} Metadata!J${cast.metadataRow}`;
  const repeated = Array.from(depthGroups.values()).filter((count) => count > 1).length;
  return (
    <div className={styles.evidenceGrid}>
      <section className={styles.card}>
        <h2>Workbook evidence</h2>
        {row ? (
          <>
            <p>Station, date and source clock · <code>{cast.year} Data!A{row.row}:C{row.row}</code></p>
            <table className={styles.table}>
              <caption>Published values for workbook row {row.row}</caption>
              <thead><tr><th scope="col">Measurement</th><th scope="col">Source value</th><th scope="col">Workbook cell</th></tr></thead>
              <tbody>
                {(['depth', ...metrics] as const).map((field) => (
                  <tr key={field} data-selected={field === metric}>
                    <th scope="row">{fields[field].label}</th>
                    <td>{sourceValue(row[field])}{isNumber(row[field]) ? ` ${fields[field].units}` : ''}</td>
                    <td><code>{cellLocator(cast.year, row.row, field)}</code></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : <p className={styles.caution}>The public data sheet provides no depth readings for this visit.</p>}
        <details className={styles.disclosure}>
          <summary>Workbook provenance and quality information</summary>
          <p><a href={workbookUrl(cast.year)}>{cast.year} NBC Water Column Profile Data</a></p>
          <p>Workbook SHA-256 <code className={styles.hash}>{workbookHashes[cast.year]}</code></p>
          <p><code>{meta}</code> records the visit mark <strong>{cast.mark}</strong>. {cast.note}</p>
          <p>{cast.clock ? 'The workbook gives a source clock. The UTC offset is unverified.' : 'The workbook metadata gives the date only.'}</p>
        </details>
      </section>
      <section className={styles.card}>
        <h2>Source and site limits</h2>
        {repeated > 0 && <p className={styles.caution}>{repeated} repeated depth {repeated === 1 ? 'group' : 'groups'} in this cast. Repeated endpoints are excluded from the comparison.</p>}
        <p>{row ? 'Per-reading quality flags are absent from the reviewed columns.' : 'The sampling metadata is the available record for this visit.'} NBC can average downcast readings within depth intervals. The nutrient workbooks are separate sampling records.</p>
        <p>The workbook leaves the density calculation and reference basis unspecified. <a href={profileProgram}>NBC profiler methods</a></p>
        <p>The NBC station may sample different water from the oyster-bearing rocks beneath the bridge. The retrospective 2016 oyster observation is a separate record with no verified sample-event crosswalk.</p>
      </section>
    </div>
  );
}

export function Investigate({ view, metric }: { view: CastView; metric: Metric }) {
  const { cast, row } = view;
  const { question, evidence } = lensNotes[metric];

  return (
    <div className={styles.evidenceGrid}>
      <section className={styles.card}>
        <p className={styles.kicker}>Open question · {fields[metric].label}</p>
        <h2>{question}</h2>
        {row ? <p className={styles.muted}>{station} · {cast.date} · {isNumber(row.depth) ? `${row.depth} m` : 'Depth unavailable'} · row {row.row}</p> : <p className={styles.caution}>This visit provides metadata only. Investigating its conditions first requires the source measurements.</p>}
        <h3>Evidence to request</h3>
        <p>{evidence}</p>
      </section>
      <section className={styles.card}>
        <h2>Where this evidence applies</h2>
        <p>Published bins describe the selected NBC station and cast. Conditions at the oyster-bearing rocks beneath the bridge, oyster survival, and restoration outcomes require separate evidence.</p>
        <p>A verified station-and-event crosswalk would be needed to compare these measurements with the retrospective 2016 oyster observation.</p>
      </section>
    </div>
  );
}
