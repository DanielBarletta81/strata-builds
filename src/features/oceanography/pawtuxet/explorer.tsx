'use client';

import Link from 'next/link';
import { useReducer, type KeyboardEvent } from 'react';
import { castKey, casts, fields, isNumber, station } from './casts';
import { CastComparison, DepthTable, Investigate, MeasurementContext, Reading, SourceQuality } from './evidence-panels';
import { changeSelection, evidenceTabs, initialSelection, metrics, selectedObservation, tabForKey, type EvidenceTab } from './explorer-model';
import { ProfilePlot } from './profile-plot';
import styles from './pawtuxet.module.css';

const publishedCount = casts.filter(({ records }) => records.length > 0).length;
const depthRowCount = casts.reduce((sum, { records }) => sum + records.length, 0);

export function PawtuxetExplorer() {
  const [selection, dispatch] = useReducer(changeSelection, initialSelection);
  const { metric, tab } = selection;
  const view = selectedObservation(selection);
  const { cast, ordered, row } = view;
  const position = ordered.findIndex((record) => record.row === row?.row);
  const previous = ordered[position - 1];
  const next = ordered[position + 1];
  const selectRow = (value: number) => dispatch({ type: 'row', value });

  function moveTab(event: KeyboardEvent<HTMLButtonElement>, current: EvidenceTab) {
    const nextTab = tabForKey(current, event.key);
    if (nextTab === undefined) return;
    event.preventDefault();
    event.currentTarget.parentElement?.querySelector<HTMLButtonElement>(`#pawtuxet-tab-${nextTab}`)?.focus();
  }

  return (
    <main className={styles.observatory}>
      <div className={styles.page}>
        <header className={styles.hero}>
          <div>
            <p className={styles.back}><Link href="/oceanography">← Estuarine Gradient Observatory</Link></p>
            <p className={styles.kicker}>{station} · NBC profiles · 2014 &amp; 2016</p>
            <h1>The Living Water Column</h1>
            <p className={styles.intro}>Descend through recorded depths in Pawtuxet Cove. Select a measurement to compare it with other published bins and trace it back to the original workbook.</p>
          </div>
          <dl className={styles.archiveStats}>
            <div><dt>Published casts</dt><dd>{publishedCount}</dd></div>
            <div><dt>Depth rows</dt><dd>{depthRowCount}</dd></div>
          </dl>
        </header>

        <section className={styles.instrument} aria-labelledby="pawtuxet-instrument">
          <div className={styles.instrumentHeader}>
            <div>
              <h2 id="pawtuxet-instrument">Cast explorer</h2>
              <p className={styles.muted}>{ordered.length ? `${ordered.length} published depth rows in this cast` : 'Metadata-only visit'}</p>
            </div>
          </div>
          <div className={styles.controls}>
            <div>
              <label htmlFor="pawtuxet-date">Sampling date · source clock</label>
              <select id="pawtuxet-date" value={castKey(cast)} onChange={(event) => dispatch({ type: 'cast', value: event.target.value })}>
                {casts.map((entry) => (
                  <option key={castKey(entry)} value={castKey(entry)}>{`${entry.date} · ${entry.clock ?? 'metadata only'}`}</option>
                ))}
              </select>
              <p className={styles.controlNote}>{cast.clock ? 'Workbook clock · UTC offset unverified' : 'Workbook metadata gives the date only'}</p>
            </div>
            <div>
              <label htmlFor="pawtuxet-metric">Measurement lens</label>
              <select id="pawtuxet-metric" value={metric} onChange={(event) => {
                const value = metrics.find((candidate) => candidate === event.target.value);
                if (value) dispatch({ type: 'metric', value });
              }}>
                {metrics.map((item) => <option key={item} value={item}>{fields[item].label}</option>)}
              </select>
              <p className={styles.controlNote}>Published units · {fields[metric].units}</p>
            </div>
            <div>
              <label htmlFor="pawtuxet-row">Depth reading</label>
              <select id="pawtuxet-row" value={row?.row ?? ''} disabled={!row} onChange={(event) => selectRow(Number(event.target.value))}>
                {!row && <option value="">No published depth rows</option>}
                {ordered.map(({ row: workbookRow, depth }) => (
                  <option key={workbookRow} value={workbookRow}>{isNumber(depth) ? `${depth} m` : 'Depth unavailable'} · row {workbookRow}</option>
                ))}
              </select>
              <div className={styles.steps}>
                <button type="button" disabled={!previous} onClick={() => previous && selectRow(previous.row)}>↑ Previous row</button>
                <button type="button" disabled={!next} onClick={() => next && selectRow(next.row)}>↓ Next row</button>
              </div>
            </div>
          </div>
          {cast.note && <p className={styles.caution}>NBC metadata · {cast.note} ({cast.year} Metadata!J{cast.metadataRow})</p>}

          <div className={styles.tabs} role="tablist" aria-label="Water-column evidence layers">
            {evidenceTabs.map(({ id, label }) => (
              <button key={id} id={`pawtuxet-tab-${id}`} type="button" role="tab" aria-selected={tab === id} aria-controls={`pawtuxet-panel-${id}`}
                tabIndex={tab === id ? 0 : -1} onFocus={() => dispatch({ type: 'tab', value: id })}
                onClick={() => dispatch({ type: 'tab', value: id })} onKeyDown={(event) => moveTab(event, id)}>
                {label}
              </button>
            ))}
          </div>

          {evidenceTabs.map(({ id }) => (
            <div className={styles.tabPanel} key={id} id={`pawtuxet-panel-${id}`} role="tabpanel" aria-labelledby={`pawtuxet-tab-${id}`} tabIndex={0} hidden={tab !== id}>
              {tab === id && id === 'observed' && (row ? (
                <div className={styles.observedGrid}>
                  <Reading view={view} metric={metric} />
                  <div className={`${styles.card} ${styles.plotCard}`}>
                    <ProfilePlot view={view} metric={metric} onSelect={selectRow} />
                    <DepthTable view={view} metric={metric} onSelect={selectRow} />
                  </div>
                  <div className={`${styles.card} ${styles.contextCard}`}>
                    <CastComparison view={view} metric={metric} />
                    <MeasurementContext view={view} metric={metric} />
                  </div>
                </div>
              ) : <p className={styles.caution} role="status">NBC lists a visit on this date. The public data sheet provides no depth readings for it. See Source &amp; Quality for the metadata locator.</p>)}
              {tab === id && id === 'source' && <SourceQuality view={view} metric={metric} />}
              {tab === id && id === 'investigate' && <Investigate view={view} metric={metric} />}
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
