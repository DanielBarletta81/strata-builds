'use client';

import Link from 'next/link';
import { useState } from 'react';
import { NutrientInspector } from './nutrient-inspector';
import { profileAt, reading, sources, stations, type StationId } from './observations';
import { SaltWedgeExplorer } from './salt-wedge-explorer';
import { StationMap } from './station-map';
import styles from './oceanography.module.css';

export function Observatory() {
  const [selected, setSelected] = useState<StationId>('F4');
  const station = stations.find((entry) => entry.id === selected) ?? stations[0];
  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <p>Narragansett Bay · Rhode Island</p>
        <h1>Estuarine Gradient Observatory</h1>
        <p>Follow five stations from the Seekonk River to the lower West Passage. Compare nutrients and salinity from surface samples, then inspect how salinity, oxygen and temperature differ by depth.</p>
      </header>
      <p><Link href="/oceanography/pawtuxet">Inspect historical casts in the Pawtuxet Water Column Explorer</Link></p>
      <div className={styles.stationGrid}>
        <section className={styles.panel} aria-labelledby="locator-title">
          <header className={styles.panelHeader}><h2 id="locator-title">Station locator</h2></header>
          <StationMap selected={selected} />
        </section>
        <section className={styles.panel} aria-labelledby="station-title">
          <header className={styles.panelHeader}><h2 id="station-title">Explore the estuary</h2><p>Choose a station to inspect the records below.</p></header>
          <ol className={styles.stations}>
            {stations.map(({ id, name, region }, index) => (
              <li key={id}>
                <button type="button" aria-pressed={selected === id} onClick={() => setSelected(id)}>
                  <span className={styles.stationNumber}>{index + 1}</span>
                  <span><strong>{name}</strong><small>{region}</small></span>
                </button>
              </li>
            ))}
          </ol>
          <div className={styles.stationNote} aria-live="polite">
            <h3>{station.name}</h3>
            <p>{station.context}</p>
            <p>{station.latitude.toFixed(5)}° N · {Math.abs(station.longitude).toFixed(5)}° W</p>
            <p className={styles.quiet}>{station.coordinates}</p>
          </div>
        </section>
      </div>
      <div className={styles.dataGrid}>
        <NutrientInspector key={selected} station={selected} />
        <SaltWedgeExplorer station={selected} name={station.name} />
      </div>
      <section className={styles.panel} aria-labelledby="comparison-title">
        <header className={styles.panelHeader}><h2 id="comparison-title">From the rivers to the lower Bay</h2></header>
        <p>One archived slot, July 10, 2012 at 12:00 local standard time. These stations sample different portions of a branching estuary. The GSO dock row is mid-water and cannot stand in for a near-surface observation.</p>
        <table className={styles.table}>
          <caption>Near-surface salinity and dissolved oxygen at the archived slot</caption>
          <thead><tr><th scope="col">Station</th><th scope="col">Salinity (ppt)</th><th scope="col">Oxygen (mg/L)</th></tr></thead>
          <tbody>{stations.map(({ id, name }) => {
            const surface = profileAt(id, '12:00').find(({ layer }) => layer === 'Surface')?.record;
            const salinity = reading(surface, 'salinity');
            const oxygen = reading(surface, 'oxygen');
            return <tr key={id}><th scope="row">{name}</th><td colSpan={id === 'F7' ? 2 : 1}>{id === 'F7' ? 'Mid-depth sensor only' : salinity.status === 'recorded' ? salinity.value : 'Gap'}</td>{id !== 'F7' && <td>{oxygen.status === 'recorded' ? oxygen.value : 'Gap'}</td>}</tr>;
          })}</tbody>
        </table>
        <p className={styles.quiet}>The snapshot shows differences among sites and depths. Multiple tidal phases, discharge and circulation measurements, and biological rates would help distinguish their causes.</p>
      </section>
      <section className={styles.panel} aria-labelledby="source-title">
        <header className={styles.panelHeader}><h2 id="source-title">Sources and open questions</h2></header>
        <p>URI’s CHRP nutrient workbook contains no salinity column in the reviewed table and has an unresolved concentration-unit header. Pairing it with the fixed-site data would require a verified station, depth and sampling-time crosswalk. NBC and URI’s paired series use their own measurement units and sampling context.</p>
        <details>
          <summary>Source records and file fingerprints</summary>
          <ul className={styles.receipts}>{Object.values(sources).map((source) => (
            <li key={source.url}><a href={source.url}>{source.label}</a>
              {'hash' in source && <small>Retrieved {source.retrieved} · SHA-256 <code>{source.hash}</code></small>}
            </li>
          ))}</ul>
        </details>
      </section>
    </main>
  );
}
