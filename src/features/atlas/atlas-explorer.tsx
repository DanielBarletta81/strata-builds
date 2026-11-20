'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import { CoastMap, MapSymbol } from './coast-map.tsx';
import { mapPointIndex as sampleFocusIndex } from './map-keyboard.ts';
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
          <li key={site.site ?? ''} aria-current={site.site === selectedSite || undefined}>
            <div className={styles.siteHeading}>
              <div>
                <strong>{site.site ?? 'Site unspecified'}</strong>
                {site.site === selectedSite && <small aria-hidden="true">Selected site</small>}
              </div>
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

function SampleTable({ points, selectedId, onSelect }: {
  points: AtlasPoint[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const [focusedId, setFocusedId] = useState<string | null>(null);

  function moveFocus(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const target = sampleFocusIndex(event.key, index, points.length);
    if (target === null) return;

    event.preventDefault();
    buttons.current.get(points[target].id)?.focus();
  }

  return (
    <section className={styles.records} aria-labelledby="atlas-records">
      <h2 id="atlas-records" tabIndex={-1}>Sample records</h2>
      <p id="atlas-records-help" className={styles.recordsHelp}>
        Select a sample ID. Use arrow keys to move between IDs, then Enter or Space to select.
      </p>
      <div
        className={styles.tableScroll}
        role="region"
        aria-labelledby="atlas-records"
        aria-describedby="atlas-records-help"
        tabIndex={0}
      >
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
          <tbody onBlur={event => {
            if (!event.currentTarget.contains(event.relatedTarget)) setFocusedId(null);
          }}>
            {points.map((point, index) => (
              <tr key={point.id} data-record-sample={point.id} data-selected={point.id === selectedId || undefined}>
                <th scope="row">
                  <button
                    type="button"
                    className={styles.recordButton}
                    aria-label={`Select sample ${point.id}`}
                    aria-pressed={point.id === selectedId}
                    tabIndex={point.id === (focusedId ?? selectedId) ? 0 : -1}
                    ref={element => {
                      if (element) buttons.current.set(point.id, element);
                      else buttons.current.delete(point.id);
                    }}
                    onFocus={() => setFocusedId(point.id)}
                    onKeyDown={event => moveFocus(event, index)}
                    onClick={() => onSelect(point.id)}
                  >
                    {point.id}
                  </button>
                  {point.id === selectedId && <small aria-hidden="true">Selected</small>}
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

  const siteSamples = model.points.filter(point => point.site === selected.site);

  function selectSite(value: string) {
    const sample = model.points.find(point => point.site === (value || null));
    if (sample) setSelectedId(sample.id);
  }

  return (
    <>
      <div className={styles.instrument}>
        <div className={styles.mapColumn}>
          <section className={styles.mapPanel} aria-labelledby="atlas-map">
            <header className={styles.mapHeading}>
              <h2 id="atlas-map">Coastal sample map</h2>
              <p>{model.points.length} samples · {model.flaggedCount} neighborhood flags</p>
              <p className={styles.mapSelection}>
                Selected <strong>{selectedId}</strong> · {selected.site ?? 'Site unspecified'}
              </p>
            </header>
            <CoastMap model={model} selectedId={selectedId} onSelect={setSelectedId} />
            <div className={styles.mapHelp}>
              <p id="atlas-map-help">Select a marker with the pointer or use the arrow keys and Enter or Space.</p>
              <a className={styles.mapPickerLink} href="#atlas-inspector">Choose a site or sample</a>
            </div>
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
              <h2 id="atlas-inspector" tabIndex={-1}>Inspect a sample</h2>
              <a href="#atlas-records">Browse sample records</a>
            </div>
            <div className={styles.samplePicker}>
              <div>
                <label htmlFor="atlas-site">Site</label>
                <select id="atlas-site" value={selected.site ?? ''} onChange={event => selectSite(event.target.value)}>
                  {model.sites.map(({ site }) => (
                    <option key={site ?? ''} value={site ?? ''}>{site ?? 'Site unspecified'}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="atlas-sample">Sample</label>
                <select id="atlas-sample" value={selectedId} onChange={event => setSelectedId(event.target.value)}>
                  {siteSamples.map(point => <option key={point.id} value={point.id}>{point.id}</option>)}
                </select>
              </div>
            </div>
            <SelectedSample sample={selected} />
          </section>
        </div>
        <SiteComposition model={model} selectedSite={selected.site} />
      </div>
      <SampleTable points={model.points} selectedId={selectedId} onSelect={setSelectedId} />
    </>
  );
}
