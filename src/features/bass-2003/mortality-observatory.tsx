'use client';

import { useState } from 'react';
import { comparisonSeries, methodsReferences, mortality, mortalityMetrics, mortalityRecord, periodsFor, recordsForPeriod, report, type MortalityMetric, type MortalityRow } from './report';
import styles from './bass.module.css';

const unstockedPeriods = periodsFor('Unstocked');
const stockedPeriods = periodsFor('Stocked');
const metrics = ['z', 's', 'a'] as const;
const firstRecord = mortalityRecord('1999', 'Electrofishing') ?? mortality.rows[0];

export function MortalityObservatory() {
  const [selected, setSelected] = useState<MortalityRow>(firstRecord);
  const [metric, setMetric] = useState<MortalityMetric>('z');
  const options = recordsForPeriod(selected.period);
  const series = comparisonSeries(selected);
  const currentMetric = mortalityMetrics[metric];

  return (
    <section className={styles.panel} id="mortality" aria-labelledby="mortality-title">
      <header className={styles.sectionHeader}>
        <p className={styles.kicker}>Table 1 · reported estimates</p>
        <h2 id="mortality-title">Mortality Observatory</h2>
        <p>Inspect a reported estimate and compare it with the annual and pooled rows from the same pond group, season and sampling method.</p>
      </header>
      <div className={styles.instrument}>
        <div className={styles.controls}>
          <div>
            <label htmlFor="bass-period">Sampling period</label>
            <select id="bass-period" value={selected.period} onChange={(event) => {
              const period = event.target.value;
              const next = mortalityRecord(period, selected.method) ?? recordsForPeriod(period)[0];
              if (next) setSelected(next);
            }}>
              <optgroup label="Unstocked · spring">
                {unstockedPeriods.map((period) => <option key={period}>{period}</option>)}
              </optgroup>
              <optgroup label="Stocked · fall">
                {stockedPeriods.map((period) => <option key={period}>{period}</option>)}
              </optgroup>
            </select>
          </div>
          <div>
            <label htmlFor="bass-method">Sampling method</label>
            <select id="bass-method" value={selected.method} onChange={(event) => {
              const next = mortalityRecord(selected.period, event.target.value);
              if (next) setSelected(next);
            }}>
              {options.map(({ method }) => <option key={method}>{method}</option>)}
            </select>
          </div>
        </div>

        <div aria-live="polite" aria-atomic="true">
          <p className={styles.context}>{selected.period} · {selected.group} systems · {selected.season} · {selected.method} · {selected.scope} estimate</p>
          <dl className={styles.estimates}>
            {metrics.map((key) => (
              <div key={key}>
                <dt>{mortalityMetrics[key].label} <span>({mortalityMetrics[key].symbol})</span></dt>
                <dd>{selected[key]}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className={styles.comparison}>
          <div className={styles.comparisonHeader}>
            <div>
              <h3>Compare within this sampling series</h3>
              <p>{selected.group} systems · {selected.season} · {selected.method}</p>
            </div>
            <div>
              <label htmlFor="bass-metric">Plot measurement</label>
              <select id="bass-metric" value={metric} onChange={(event) => setMetric(event.target.value as MortalityMetric)}>
                {metrics.map((key) => <option key={key} value={key}>{`${mortalityMetrics[key].symbol} · ${mortalityMetrics[key].label}`}</option>)}
              </select>
            </div>
          </div>
          <figure className={styles.plot}>
            <figcaption>{currentMetric.symbol} · {currentMetric.scale}</figcaption>
            <div className={styles.scale} aria-hidden="true">
              <span>0</span>
              <span>0.25</span>
              <span>0.50</span>
              <span>0.75</span>
              <span>1.00</span>
            </div>
            <ul>
              {series.map((row) => (
                <li key={row.period}>
                  <button className={styles.plotRow} type="button" aria-pressed={row === selected}
                    aria-label={`${row.period} · ${currentMetric.symbol} ${row[metric]}`} onClick={() => setSelected(row)}>
                    <span>{row.period}</span>
                    <span className={styles.track} aria-hidden="true">
                      <span className={row.scope === 'Pooled' ? styles.pooledBar : styles.bar} style={{ inlineSize: `${Number(row[metric]) * 100}%` }} />
                    </span>
                    <strong>{row[metric]}</strong>
                  </button>
                </li>
              ))}
            </ul>
          </figure>
          <p className={styles.note}>Pooled estimates are separate published rows for the period. Each plotted value retains its season, method and pond group. The stocked and unstocked rows differ in those sampling contexts.</p>
        </div>
      </div>

      <details className={styles.disclosure}>
        <summary>Selected estimate provenance</summary>
        <p>{report.reference} · {mortality.locator} · {selected.period} · {selected.season} · {selected.method} · {selected.group} systems.</p>
        <p>The two-decimal values come from the researcher-supplied transcription. The original page and its page number await direct verification.</p>
        <p>The report used ages 3–10 for the catch curve. In this method, the decline in observed numbers across ages can also be sensitive to recruitment and how well the gear samples those ages. <a href={methodsReferences.mortality}>FAO background on mortality estimates</a></p>
      </details>

      <table className={styles.sourceTable}>
        <caption>Table 1 · all reported mortality estimates</caption>
        <thead><tr><th scope="col">Period and group</th><th scope="col">Season and method</th>
          <th scope="col" aria-label="Instantaneous mortality Z">Z</th>
          <th scope="col" aria-label="Annual survival S">S</th>
          <th scope="col" aria-label="Annual mortality A">A</th>
        </tr></thead>
        <tbody>
          {mortality.rows.map((row) => (
            <tr key={`${row.period}-${row.method}`} aria-current={row === selected ? 'true' : undefined}>
              <th scope="row">{row.period}<small>{row.group} systems</small></th>
              <td>{row.season}<small>{row.method}</small></td>
              <td>{row.z}</td><td>{row.s}</td><td>{row.a}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
