import { useState } from 'react';
import { cellLocator, clocks, coverage, day, profileAt, profiles, quantities, reading, sources, type ProfileRecord, type Quantity, type StationId } from './observations';
import styles from './oceanography.module.css';

function ConceptualSection() {
  return (
    <>
      <figure className={styles.concept}>
        <svg viewBox="0 0 440 155" role="img" aria-labelledby="concept-title concept-description">
          <title id="concept-title">Conceptual estuarine circulation</title>
          <desc id="concept-description">A fresh surface layer flows seaward over a denser saline layer that can move landward. Dashed marks indicate mixing between layers.</desc>
          <path d="M0 0H440V155H0Z" fill="#cceee9" />
          <path d="M0 120Q200 108 440 52V155H0Z" fill="#22708a" />
          <path d="M55 39H342L330 32M342 39L330 46" fill="none" stroke="#17474d" strokeWidth="3" />
          <path d="M380 115H246L258 108M246 115L258 122" fill="none" stroke="#f2fffb" strokeWidth="3" />
          <path d="M182 89L191 119M225 81L235 112M272 67L282 98" stroke="#183e4c" strokeWidth="2" strokeDasharray="4 3" />
          <text x="55" y="28" fill="#17474d">Fresher surface water → sea</text>
          <text x="240" y="144" fill="#f2fffb">Saline water → land</text>
        </svg>
        <figcaption>Educational schematic · arrows show possible motion. The shape and directions are conceptual.</figcaption>
      </figure>
      <p>Saltier water is generally denser at the same temperature. Freshwater can spread seaward over a denser saline layer moving inland. Tides, wind and river discharge change the balance between mixing and stratification. The Bay can range from relatively well mixed to strongly stratified.</p>
      <p>A density contrast can reduce oxygen exchange with deeper water while organisms and sediments consume oxygen. Establishing hypoxia and its causes requires oxygen measurements, the time and depth affected, and evidence about oxygen demand and circulation.</p>
    </>
  );
}

function ProfileValue({ station, record, quantity, duplicate }: { station: StationId; record?: ProfileRecord; quantity: Quantity; duplicate: boolean }) {
  const sample = reading(record, quantity);
  if (duplicate) return <>Duplicate rows</>;
  if (sample.value === null) return (
    <>
      <span className={styles.quiet}>{sample.status === 'blank' ? 'Blank in archive' : sample.status}</span>
      {record && <small>{cellLocator(station, record, quantity)}</small>}
    </>
  );

  return (
    <>
      <strong>{sample.value} {quantities[quantity].units}</strong>
      {sample.status !== 'recorded' && <small className={styles.warning}>{sample.status}</small>}
      {record && <small>{cellLocator(station, record, quantity)}</small>}
    </>
  );
}

export function SaltWedgeExplorer({ station, name }: { station: StationId; name: string }) {
  const [mode, setMode] = useState<'observed' | 'conceptual'>('observed');
  const [clock, setClock] = useState('12:00');
  const snapshot = profileAt(station, clock);
  const totals = coverage(station);
  const receipt = profiles[station];
  return (
    <section className={styles.panel} id="depth-explorer" aria-labelledby="salt-heading">
      <header className={styles.panelHeader}><h2 id="salt-heading">Salt-wedge explorer</h2></header>
      <fieldset className={styles.modes}>
        <legend>Water-column view</legend>
        <label><input type="radio" name="water-column-mode" checked={mode === 'observed'} onChange={() => setMode('observed')} /> Observed</label>
        <label><input type="radio" name="water-column-mode" checked={mode === 'conceptual'} onChange={() => setMode('conceptual')} /> Conceptual</label>
      </fieldset>
      {mode === 'conceptual' ? <ConceptualSection /> : (
        <>
          <p><strong>{name}</strong> · July 10, 2012 · edited quarter-hour grid in local standard time.</p>
          <div className={styles.clockChoice}>
            <label htmlFor="profile-time">Archive time</label>
            <select id="profile-time" value={clock} onChange={(event) => setClock(event.target.value)}>
              {clocks.map((time) => <option key={time}>{time}</option>)}
            </select>
          </div>
          <div className={styles.depths} aria-label={`${name}, ${day} at ${clock}`}>
            {snapshot.map(({ layer, record, duplicate }) => (
              <article key={layer}>
                <h3>{layer}</h3>
                <dl className={styles.readout}>
                  {Object.entries(quantities).map(([field, { label }]) => (
                    <div key={field}><dt>{label}</dt><dd><ProfileValue station={station} record={record} quantity={field as Quantity} duplicate={duplicate} /></dd></div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
          <p className={styles.quiet}>Readings represent separate sensor depths. They leave the boundary between layers and the flushing rate unresolved.</p>
          <details>
            <summary>Sampling coverage and gaps</summary>
            <table className={styles.table}>
              <caption>Usable readings by layer · 17 expected slots per instrument</caption>
              <thead><tr><th scope="col">Layer</th><th scope="col">Salinity</th><th scope="col">Oxygen</th><th scope="col">Temp.</th></tr></thead>
              <tbody>{totals.map(({ layer, salinity, oxygen, temperature, expected }) => (
                <tr key={layer}><th scope="row">{layer}</th><td>{salinity}/{expected}</td><td>{oxygen}/{expected}</td><td>{temperature}/{expected}</td></tr>
              ))}</tbody>
            </table>
            <p>Gaps include blank and flagged cells. Archive keys without rows: {totals.reduce((sum, row) => sum + row.missingRows, 0)}. Duplicate layer/time keys: {totals.reduce((sum, row) => sum + row.duplicates, 0)}.</p>
          </details>
          <details>
            <summary>Fixed-site workbook provenance</summary>
            <p>{receipt.file} · {receipt.sheet}. Published depth fields describe the sensors at each selected slot.</p>
            <p>Workbook SHA-256 <code>{receipt.sha256}</code></p>
            <p><a href={sources.ridem.url}>{sources.ridem.label}</a> · retrieved {sources.ridem.retrieved}.</p>
          </details>
        </>
      )}
    </section>
  );
}
