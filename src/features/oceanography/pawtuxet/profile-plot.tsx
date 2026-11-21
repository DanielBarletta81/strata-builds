import { fields, isNumber, lowOxygenLimit, type DepthRecord, type Metric } from './casts';
import styles from './pawtuxet.module.css';

const scales: Record<Metric, number[]> = {
  salinity: [0, 8, 16, 24, 32],
  oxygen: [0, 4, 8, 12, 16],
  temperature: [0, 8, 16, 24, 32],
  density: [1000, 1006, 1012, 1018, 1024],
};

export function ProfilePlot({ records, metric, selectedRow, lowRows }: {
  records: readonly DepthRecord[];
  metric: Metric;
  selectedRow?: number;
  lowRows: readonly DepthRecord[];
}) {
  const title = fields[metric];
  const ticks = scales[metric];
  const left = 55;
  const right = 379;
  const top = 48;
  const bottom = 263;
  const x = (value: number) => left + (value - ticks[0]) / (ticks[ticks.length - 1] - ticks[0]) * (right - left);
  const y = (depth: number) => top + depth / 6 * (bottom - top);
  const selected = records.find(({ row }) => row === selectedRow);
  const selectedDepth = selected?.depth ?? null;
  const selectedValue = selected?.[metric] ?? null;

  return (
    <figure className={styles.plot}>
      <svg viewBox="0 0 404 287" role="img" aria-labelledby="pawtuxet-plot-title pawtuxet-plot-description">
        <title id="pawtuxet-plot-title">{`${title.label} by published depth`}</title>
        <desc id="pawtuxet-plot-description">
          {`Separate points represent published depth bins. Depth increases downward. A ring marks the selected reading. ${metric === 'oxygen' ? 'Diamonds mark readings below 3 mg/L. ' : ''}Use the source record selector and depth table for the values.`}
        </desc>
        <text x="108" y="17">{`${title.label} (${title.units})`}</text>
        <text x="4" y="17">Depth (m)</text>
        {ticks.map((tick) => (
          <g key={tick}>
            <line x1={x(tick)} x2={x(tick)} y1={top} y2={bottom} />
            <text x={x(tick)} y="36" textAnchor="middle">{tick}</text>
          </g>
        ))}
        {[0, 1, 2, 3, 4, 5, 6].map((depth) => (
          <g key={depth}>
            <line x1={left} x2={right} y1={y(depth)} y2={y(depth)} />
            <text x={left - 13} y={y(depth) + 4} textAnchor="end">{depth}</text>
          </g>
        ))}
        {metric === 'oxygen' && <line className={styles.threshold} x1={x(lowOxygenLimit)} x2={x(lowOxygenLimit)} y1={top} y2={bottom} />}
        {records.map((record) => {
          const value = record[metric];
          if (!isNumber(record.depth) || !isNumber(value)) return null;
          const low = metric === 'oxygen' && lowRows.includes(record);
          const pointX = x(value);
          const pointY = y(record.depth);
          return (
            <g key={record.row} data-reading-row={record.row}>
              <title>{`Row ${record.row} · ${value} ${title.units} at ${record.depth} m`}</title>
              {low
                ? <path d={`M ${pointX} ${pointY - 5} l 5 5 -5 5 -5 -5 Z`} className={styles.lowPoint} />
                : <circle cx={pointX} cy={pointY} r="4.5" className={styles.point} />}
            </g>
          );
        })}
        {isNumber(selectedDepth) && isNumber(selectedValue) && (
          <circle cx={x(selectedValue)} cy={y(selectedDepth)} r="8" className={styles.selectedPoint} aria-hidden="true" />
        )}
      </svg>
      <figcaption>
        Points show published bins. {metric === 'oxygen' && 'Dashed line marks 3 mg/L. '}The plot leaves gaps between bins.
        <ul className={styles.plotKey}>
          <li><span className={styles.selectedKey} aria-hidden="true" />Selected reading</li>
          {metric === 'oxygen' && <li><span className={styles.lowKey} aria-hidden="true" />Below 3 mg/L</li>}
        </ul>
      </figcaption>
    </figure>
  );
}
