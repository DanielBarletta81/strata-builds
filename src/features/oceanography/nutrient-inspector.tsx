import { useState } from 'react';
import { getNutrients, pairedSamples, pairStatus, sources, type StationId } from './observations';
import styles from './oceanography.module.css';

const plot = { width: 440, height: 264, left: 50, right: 420, top: 18, bottom: 216 };

export function NutrientInspector({ station }: { station: StationId }) {
  const records = getNutrients(station);
  const pairs = pairedSamples(records);
  const [selected, setSelected] = useState<number | null>(null);
  const tank = station === 'F7';
  const workbook = tank ? sources.tank : sources.nbc;
  const salUnit = tank ? 'psu' : 'ppt';
  const nutrientUnit = tank ? 'µM' : 'ppb-N';
  const row = records.find((record) => record.row === selected) ?? pairs[0] ?? records[0];
  const yMaximum = tank ? 3 : 1000;
  const xTicks = tank ? [29, 30, 31, 32, 33] : [0, 10, 20, 30, 40];
  const yTicks = tank ? [0, 1, 2, 3] : [0, 250, 500, 750, 1000];
  const xMinimum = xTicks[0];
  const xRange = xTicks[xTicks.length - 1] - xMinimum;
  const x = (value: number) => plot.left + ((value - xMinimum) / xRange) * (plot.right - plot.left);
  const y = (value: number) => plot.bottom - (value / yMaximum) * (plot.bottom - plot.top);

  return (
    <section className={styles.panel} aria-labelledby="nutrient-heading">
      <header className={styles.panelHeader}>
        <h2 id="nutrient-heading">Nitrate + nitrite and salinity</h2>
        {records.length > 0 && <p>{workbook.label} · surface samples</p>}
      </header>
      {!row ? (
        <p className={styles.notice}>This station has fixed-site readings in the slice. No co-sampled nutrient and salinity records were verified here. The sonde data remain available in the depth explorer.</p>
      ) : (
        <>
          <p>{pairs.length} of {records.length} reviewed surface rows supply numeric pairs. Each plotted point uses both fields from the same row. These concentrations alone cannot distinguish water-mass mixing from nutrient inputs or biological uptake.</p>
          {pairs.length > 0 && <figure className={styles.chart}>
            <svg viewBox={`0 0 ${plot.width} ${plot.height}`} role="img" aria-labelledby="nutrient-title nutrient-description">
              <title id="nutrient-title">Nitrate plus nitrite versus salinity</title>
              <desc id="nutrient-description">Same-row numerical pairs only. Choose a sample below to inspect its original values. The current sample is outlined if it qualifies for the plot.</desc>
              {yTicks.map((tick) => <g key={tick}>
                <line x1={plot.left} x2={plot.right} y1={y(tick)} y2={y(tick)} />
                <text x={plot.left - 8} y={y(tick) + 4} textAnchor="end">{tick}</text>
              </g>)}
              {xTicks.map((tick) => <text key={tick} x={x(tick)} y={plot.bottom + 19} textAnchor="middle">{tick}</text>)}
              <text x="237" y="259" textAnchor="middle">{`Salinity (${salUnit})`}</text>
              <text x="50" y="13">{`NO₃ + NO₂ (${nutrientUnit})`}</text>
              {pairs.map((sample) => <circle key={sample.row} cx={x(sample.salinity)} cy={y(sample.nutrient)} r={row.row === sample.row ? 7 : 4.5} className={row.row === sample.row ? styles.activePoint : styles.point}>
                <title>{`${sample.date} · ${sample.salinity} ${salUnit} · ${sample.nutrient} ${nutrientUnit}`}</title>
              </circle>)}
            </svg>
            <figcaption>{tank ? 'The dock series uses psu and µM. The NBC series uses ppt and ppb-N and appears on its own axes.' : 'NBC panels use common axes. Reported limits, missing fields and review flags are listed in the records and omitted from the plot.'}</figcaption>
          </figure>}
          <div className={styles.record}>
            <label htmlFor="nutrient-sample">Inspect a source row</label>
            <select id="nutrient-sample" value={row.row} onChange={(event) => setSelected(Number(event.target.value))}>
              {records.map((record) => <option key={record.row} value={record.row}>{`${record.date} · row ${record.row} · ${pairStatus(record)}`}</option>)}
            </select>
            <dl className={styles.readout}>
              <div><dt>Salinity</dt><dd>{row.salinity === null ? 'Missing' : `${row.salinity} ${salUnit}`}</dd></div>
              <div><dt>Nitrate + nitrite</dt><dd>{row.nutrient === null ? 'Missing' : `${row.nutrient} ${nutrientUnit}`}</dd></div>
              <div><dt>Sample depth</dt><dd>{row.depth !== null ? `${row.depth} m` : tank ? 'Surface grab · depth unreported' : 'Surface label · depth field missing'}</dd></div>
              <div><dt>Quality</dt><dd>{pairStatus(row)}</dd></div>
            </dl>
            <p>{row.date}{row.clock ? ` ${row.clock} (source clock, offset unverified)` : ' (date only)'} · {row.site}</p>
            <p>{tank ? `Sheet1!E${row.row}, H${row.row}` : `2025!H${row.row}, K${row.row} · sample ${row.sample} · blank ${row.blankId ?? 'unlisted'}`}</p>
            {row.note && <p>{row.note}</p>}
            <p><a href={workbook.url}>{workbook.label}</a></p>
          </div>
        </>
      )}
    </section>
  );
}
