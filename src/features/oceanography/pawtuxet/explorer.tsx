'use client';

import Link from 'next/link';
import { useState } from 'react';
import { castEndpoints, castKey, casts, cellLocator, depthCounts, fields, isNumber, lowOxygenRows, oxygenReference, profileProgram, station, workbookHashes, workbookUrl, type DepthRecord, type Metric } from './casts';
import { ProfilePlot } from './profile-plot';
import common from '../oceanography.module.css';
import styles from './pawtuxet.module.css';

const metrics: Metric[] = ['oxygen', 'salinity', 'temperature', 'density'];
const initialCast = '2016-07-20 10:00:00';
const publishedCount = casts.filter((entry) => entry.records.length > 0).length;

function showValue(value: DepthRecord['salinity'] | undefined) {
  return value === null || value === undefined ? 'Missing' : String(value);
}

function contrast(shallow: DepthRecord | undefined, deep: DepthRecord | undefined, field: Metric) {
  const a = shallow?.[field] ?? null;
  const b = deep?.[field] ?? null;
  return isNumber(a) && isNumber(b) ? `${(b - a).toFixed(4)} ${fields[field].units}` : 'Unavailable';
}

export function PawtuxetExplorer() {
  const [eventKey, setEventKey] = useState(initialCast);
  const [metric, setMetric] = useState<Metric>('oxygen');
  const [rowNumber, setRowNumber] = useState<number>();
  const cast = casts.find((entry) => castKey(entry) === eventKey) ?? casts[0];
  const { shallow, deep } = castEndpoints(cast.records);
  const depths = depthCounts(cast.records);
  const lowRows = lowOxygenRows(cast.records);
  const oxygenAssessable = cast.records.some(({ depth, oxygen }) => isNumber(depth) && depths.get(depth) === 1 && isNumber(oxygen));
  const selected = cast.records.find(({ row }) => row === rowNumber) ?? deep ?? cast.records[0];
  const repeated = [...depths.values()].some((count) => count > 1);
  const meta = `${cast.year} Metadata!J${cast.metadataRow}`;

  return (
    <main className={`${common.page} ${styles.page}`}>
      <header className={common.hero}>
        <p><Link className={styles.back} href="/oceanography">Estuarine Gradient Observatory</Link></p>
        <h1>Pawtuxet Water Column Explorer</h1>
        <p>Inspect discrete salinity, oxygen, temperature and density values from NBC profiler casts at Pawtuxet Cove.</p>
      </header>

      <section className={`${common.panel} ${styles.section}`} aria-labelledby="cast-heading">
        <header className={common.panelHeader}>
          <h2 id="cast-heading">Choose a sampling date</h2>
          <p>{publishedCount} published casts from 2014 and 2016 · {casts.length - publishedCount} metadata-only visit</p>
        </header>
        <label htmlFor="pawtuxet-date">Sampling date · source clock</label>
        <select id="pawtuxet-date" value={eventKey} onChange={(event) => {
          setEventKey(event.target.value);
          setRowNumber(undefined);
        }}>
          {casts.map((entry) => (
            <option key={castKey(entry)} value={castKey(entry)}>{`${entry.date} · ${entry.clock ?? 'metadata only'}`}</option>
          ))}
        </select>
        <p className={common.quiet}>{station} · {cast.clock ? 'Workbook clock. UTC offset unverified.' : 'Workbook metadata gives the date only.'}</p>
        {cast.note && <p className={styles.archiveNote}>NBC metadata · {cast.note} ({meta})</p>}
        {!cast.records.length && <p className={common.notice}>NBC lists a visit on this date. The public data sheet provides no depth readings for it.</p>}
      </section>

      {!!cast.records.length && <>
        <div className={styles.grid}>
          <section className={common.panel} aria-labelledby="profile-heading">
            <header className={common.panelHeader}><h2 id="profile-heading">Published water-column readings</h2></header>
            <div>
              <label htmlFor="pawtuxet-metric">Plot measurement</label>
              <select id="pawtuxet-metric" value={metric} onChange={(event) => setMetric(event.target.value as Metric)}>
                {metrics.map((item) => <option key={item} value={item}>{fields[item].label}</option>)}
              </select>
            </div>
            <ProfilePlot records={cast.records} metric={metric} selectedRow={selected?.row} lowRows={lowRows} />
            {repeated && <p className={styles.archiveNote}>Repeated depth labels are retained as separate source rows. A repeated endpoint is excluded from the depth comparison.</p>}
            {lowRows.length > 0
              ? <p className={styles.archiveNote}><strong>{lowRows.length} published depth readings below 3 mg/L</strong> · {lowRows.map(({ depth }) => depth).join(', ')} m.</p>
              : <p className={common.quiet}>{oxygenAssessable ? 'No unique-depth reading in this cast falls below 3 mg/L.' : 'Oxygen screening is unavailable for this cast.'}</p>}
            <p className={common.quiet}><a href={oxygenReference}>RIDEM’s 3 mg/L reporting threshold</a> is used as a screening reference. A cast leaves duration, spatial extent and species-specific exposure unresolved.</p>
          </section>

          <section className={common.panel} aria-labelledby="pair-heading">
            <header className={common.panelHeader}><h2 id="pair-heading">Compare sampled depths</h2></header>
            <table className={common.table}>
              <caption>Shallowest and deepest published depth bins of the same cast</caption>
              <thead><tr><th scope="col">Measure</th><th scope="col">Shallow</th><th scope="col">Deep</th></tr></thead>
              <tbody>
                {(['depth', ...metrics] as const).map((field) => (
                  <tr key={field}><th scope="row">{`${fields[field].label} (${fields[field].units})`}</th>
                    <td>{shallow ? showValue(shallow[field]) : 'Ambiguous'}</td>
                    <td>{deep ? showValue(deep[field]) : 'Ambiguous'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <dl className={common.readout}>
              <div><dt>Salinity difference · deep minus shallow</dt><dd>{contrast(shallow, deep, 'salinity')}</dd></div>
              <div><dt>Published density difference · deep minus shallow</dt><dd>{contrast(shallow, deep, 'density')}</dd></div>
            </dl>
            <p className={common.quiet}>Salinity contrast describes salt content. Density evidence here comes from NBC’s separate density column. The comparison covers sampled bins within one cast, with no inferred boundary.</p>
          </section>
        </div>

        <section className={`${common.panel} ${styles.section}`} aria-labelledby="record-heading">
          <header className={common.panelHeader}><h2 id="record-heading">Inspect a source record</h2></header>
          <label htmlFor="pawtuxet-row">Workbook data row</label>
          <select id="pawtuxet-row" value={selected?.row} onChange={(event) => setRowNumber(Number(event.target.value))}>
            {cast.records.map(({ row, depth }) => <option key={row} value={row}>{`Row ${row} · ${depth === null ? 'depth missing' : `${depth} m`}`}</option>)}
          </select>
          {selected && <dl className={`${common.readout} ${styles.recordValues}`}>
            {(['depth', ...metrics] as const).map((field) => (
              <div key={field}>
                <dt>{`${fields[field].label} (${fields[field].units})`}</dt>
                <dd>{showValue(selected[field])}<small>{cellLocator(cast.year, selected.row, field)}</small></dd>
              </div>
            ))}
          </dl>}
          {selected && <p className={common.quiet}>Station, date and source clock · {cast.year} Data!A{selected.row}:C{selected.row}</p>}
          <details>
            <summary>All published depth rows for this metric</summary>
            <table className={common.table}>
              <caption>{fields[metric].label} in source row order</caption>
              <thead><tr><th scope="col">Row</th><th scope="col">Depth (m)</th><th scope="col">{fields[metric].units}</th><th scope="col">Row notes</th></tr></thead>
              <tbody>{cast.records.map((record) => (
                <tr key={record.row}>
                  <th scope="row">{record.row}</th><td>{showValue(record.depth)}</td><td>{showValue(record[metric])}</td>
                  <td>{lowRows.includes(record) && 'Below 3 mg/L'}{isNumber(record.depth) && (depths.get(record.depth) ?? 0) > 1 && 'Repeated depth'}</td>
                </tr>
              ))}</tbody>
            </table>
          </details>
        </section>
      </>}

      <section className={`${common.panel} ${styles.section}`} aria-labelledby="sources-heading">
        <header className={common.panelHeader}><h2 id="sources-heading">Source and site limits</h2></header>
        <p>The NBC cove casts may not represent conditions at the oyster-bearing rocks beneath the bridge. The researcher’s retrospective 2016 oyster observation is a separate record. It is outside the water-quality evidence shown here.</p>
        <details>
          <summary>Workbook provenance and quality information</summary>
          <p><a href={workbookUrl(cast.year)}>{cast.year} NBC Water Column Profile Data</a> · {meta} has the station visit mark <strong>{cast.mark}</strong>.</p>
          <p>Workbook SHA-256 <code>{workbookHashes[cast.year]}</code></p>
          <p>{cast.records.length ? 'The reviewed measurement columns contain no per-reading quality flags. Repeated depth labels are noted as archive ambiguities.' : 'The sampling metadata is the available source for this visit.'}</p>
          <p>The profiler program can average readings into depth bins. The workbook leaves the density calculation and reference basis unspecified. The nutrient workbooks are separate sampling records. <a href={profileProgram}>NBC profiler methods</a></p>
        </details>
      </section>
    </main>
  );
}
