'use client';

import { useState } from 'react';
import { CoastMap, MapSymbol } from './coast-map.tsx';
import type { AtlasModel, AtlasPoint } from './model.ts';
import styles from './atlas.module.css';

function coordinate(value: number, positive: string, negative: string) {
  return `${Math.abs(value).toFixed(4)}° ${value < 0 ? negative : positive}`;
}

function SiteComposition({ model, selectedSite }: { model: AtlasModel; selectedSite: string | null }) {
  return (
    <section className={styles.composition} aria-labelledby="atlas-composition">
      <header>
        <h2 id="atlas-composition">Site composition</h2>
        <p>North to south · {model.sites.length} sites</p>
      </header>
      <ul className={styles.siteList}>
        {model.sites.map(site => (
          <li key={site.site ?? ''} className={site.site === selectedSite ? styles.selectedSite : undefined}>
            <div className={styles.siteHeading}>
              <strong>{site.site ?? 'Site unspecified'}</strong>
              <span>{site.total} samples</span>
            </div>
            <div className={styles.compositionBar} aria-hidden="true">
              {model.legend.filter(entry => site.counts[entry.assignment] > 0).map(({ assignment, color }) => (
                <span key={assignment} style={{ flexGrow: site.counts[assignment], backgroundColor: color }} />
              ))}
            </div>
            <ul className={styles.siteCounts}>
              {model.legend.map(({ assignment }) => (
                <li key={assignment}>{assignment} {site.counts[assignment]}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SelectedSample({ sample }: { sample: AtlasPoint }) {
  return (
    <div className={styles.readout} aria-live="polite" aria-atomic="true">
      <dl>
        <div><dt>Assignment</dt><dd>{sample.assignment}</dd></div>
        <div><dt>Site</dt><dd>{sample.site ?? 'Site unspecified'}</dd></div>
        <div>
          <dt>Coordinates</dt>
          <dd>{coordinate(sample.lat, 'N', 'S')}, {coordinate(sample.lon, 'E', 'W')}</dd>
        </div>
        <div>
          <dt>Neighborhood</dt>
          <dd>{sample.neighborAssignment ? `Flag · nearby majority: ${sample.neighborAssignment}` : 'Unflagged'}</dd>
        </div>
      </dl>
    </div>
  );
}

function SampleTable({ points, selectedId }: { points: AtlasPoint[]; selectedId: string }) {
  return (
    <section className={styles.records} aria-labelledby="atlas-records">
      <h2 id="atlas-records" tabIndex={-1}>Sample records</h2>
      <div className={styles.tableScroll} role="region" aria-labelledby="atlas-records" tabIndex={0}>
        <table className={styles.table}>
          <caption>All {points.length} plotted synthetic records</caption>
          <thead>
            <tr>
              <th scope="col">Sample</th>
              <th scope="col">Site</th>
              <th scope="col">Assignment</th>
              <th scope="col">Coordinates</th>
            </tr>
          </thead>
          <tbody>
            {points.map(point => (
              <tr key={point.id} data-record-sample={point.id} data-selected={point.id === selectedId || undefined}>
                <th scope="row">
                  {point.id}
                  {point.id === selectedId && <small>Selected</small>}
                </th>
                <td>{point.site ?? 'Site unspecified'}</td>
                <td>
                  {point.assignment}
                  {point.neighborAssignment && <small>Flag: {point.neighborAssignment} majority</small>}
                </td>
                <td className={styles.coordinates}>
                  <span>{coordinate(point.lat, 'N', 'S')}</span>
                  <span>{coordinate(point.lon, 'E', 'W')}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function AtlasExplorer({ model }: { model: AtlasModel }) {
  const [selectedId, setSelectedId] = useState(model.points[0]?.id ?? '');
  const selected = model.points.find(point => point.id === selectedId);

  if (!selected) return <p>No valid demonstration samples are available.</p>;

  return (
    <>
      <div className={styles.instrument}>
        <div className={styles.mapColumn}>
          <section className={styles.mapPanel} aria-labelledby="atlas-map">
            <header className={styles.mapHeading}>
              <h2 id="atlas-map">Coastal sample map</h2>
              <p>{model.points.length} samples · {model.flaggedCount} neighborhood flags</p>
            </header>
            <CoastMap model={model} selectedId={selectedId} onSelect={setSelectedId} />
            <p id="atlas-map-help" className={styles.mapHelp}>
              Tap a marker, or use the arrow keys and Enter or Space when the map has focus.
            </p>
            <div className={styles.mapKey}>
              <h3>Assignment legend</h3>
              <ul>
                {model.legend.map(entry => (
                  <li key={entry.assignment}>
                    <svg viewBox="-8 -8 16 16" aria-hidden="true"><MapSymbol {...entry} /></svg>
                    {entry.assignment} <span>{entry.count}</span>
                  </li>
                ))}
                <li><span className={styles.flagKey} aria-hidden="true" />Neighborhood flag</li>
                <li><span className={styles.selectedKey} aria-hidden="true" />Selected sample</li>
              </ul>
            </div>
          </section>

          <section className={styles.inspector} aria-labelledby="atlas-inspector">
            <div className={styles.inspectorHeading}>
              <h2 id="atlas-inspector">Inspect a sample</h2>
              <a href="#atlas-records">Browse sample records</a>
            </div>
            <label htmlFor="atlas-sample">Sample</label>
            <select id="atlas-sample" value={selectedId} onChange={event => setSelectedId(event.target.value)}>
              {model.points.map(point => (
                <option key={point.id} value={point.id}>
                  {point.id} · {point.site ?? 'Site unspecified'}
                </option>
              ))}
            </select>
            <SelectedSample sample={selected} />
          </section>
        </div>
        <SiteComposition model={model} selectedSite={selected.site} />
      </div>
      <SampleTable points={model.points} selectedId={selectedId} />
    </>
  );
}
