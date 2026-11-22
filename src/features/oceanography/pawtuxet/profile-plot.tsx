import type { KeyboardEvent } from 'react';
import { fields, isNumber, lowOxygenLimit, type Metric } from './casts';
import { depthPosition, depthTicks, metricPosition, metricTicks, profilePoints, type CastView } from './explorer-model';
import styles from './pawtuxet.module.css';

export function ProfilePlot({ view, metric, onSelect }: {
  view: CastView;
  metric: Metric;
  onSelect: (row: number) => void;
}) {
  const field = fields[metric];
  const points = profilePoints(view.ordered, metric);
  const selected = view.row;
  const keyboardPoint = points.find(({ row }) => row === selected?.row) ?? points[0];
  const selectionDepth = selected?.depth ?? null;
  const reticleY = isNumber(selectionDepth) ? depthPosition(selectionDepth) : undefined;
  const oxygen = metric === 'oxygen';

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const steps: Partial<Record<string, number>> = {
      ArrowUp: index - 1,
      ArrowDown: index + 1,
      Home: 0,
      End: points.length - 1,
    };
    const next = steps[event.key];
    if (next === undefined) return;
    event.preventDefault();

    const point = points[next];
    if (point) {
      onSelect(point.row);
      event.currentTarget.parentElement?.querySelector<HTMLButtonElement>(`[data-reading-row="${point.row}"]`)?.focus();
    }
  }

  return (
    <figure className={styles.plot} aria-labelledby="pawtuxet-plot-title" aria-describedby="pawtuxet-plot-caption">
      <div className={styles.axisLabels}>
        <span>Depth (m) ↓</span>
        <h3 id="pawtuxet-plot-title">{field.label} ({field.units})</h3>
      </div>
      <div className={styles.tickBand} aria-hidden="true">
        <div className={styles.metricTicks}>
          {metricTicks[metric].map((tick) => (
            <span key={tick} style={{ left: `${metricPosition(tick, metric)}%` }}>{tick}</span>
          ))}
        </div>
      </div>
      <div className={styles.plotFrame}>
        <div className={styles.depthRuler} aria-hidden="true">
          {depthTicks.map((depth) => (
            <span key={depth} style={{ top: `${depthPosition(depth)}%` }}>{depth}</span>
          ))}
        </div>
        <div className={styles.plotArea} role="group" aria-label="Plotted readings">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {depthTicks.map((depth) => {
              const y = depthPosition(depth);
              return <line key={depth} x1="0" x2="100" y1={y} y2={y} vectorEffect="non-scaling-stroke" />;
            })}
            {metricTicks[metric].map((tick) => {
              const x = metricPosition(tick, metric);
              return <line key={tick} x1={x} x2={x} y1="0" y2="100" vectorEffect="non-scaling-stroke" />;
            })}
            {oxygen && <line className={styles.threshold} x1={metricPosition(lowOxygenLimit, metric)} x2={metricPosition(lowOxygenLimit, metric)} y1="0" y2="100" vectorEffect="non-scaling-stroke" />}
          </svg>
          {reticleY !== undefined && reticleY >= 0 && reticleY <= 100 && <span className={styles.reticle} style={{ top: `${reticleY}%` }} aria-hidden="true" />}
          {points.map(({ row, depth, value, x, y }, index) => (
            <button
              className={styles.marker}
              key={row}
              type="button"
              style={{ left: `${x}%`, top: `${y}%` }}
              data-reading-row={row}
              data-low={oxygen && view.lowRows.has(row) ? 'true' : undefined}
              aria-label={`${depth} m · ${value} ${field.units} · workbook row ${row}`}
              aria-pressed={row === selected?.row}
              tabIndex={row === keyboardPoint?.row ? 0 : -1}
              onClick={() => onSelect(row)}
              onKeyDown={(event) => navigate(event, index)}
            />
          ))}
        </div>
      </div>
      <figcaption id="pawtuxet-plot-caption">
        <ul className={styles.plotKey}>
          <li><span className={styles.binKey} aria-hidden="true" />Published bin</li>
          <li><span className={styles.selectedKey} aria-hidden="true" />Selected depth</li>
          {oxygen && <li><span className={styles.lowKey} aria-hidden="true" />Below 3 mg/L</li>}
        </ul>
        {oxygen && 'The dashed line marks the 3 mg/L screen. '}Select a marker or step through the published rows. With a marker focused, Up and Down move between bins. Spaces between bins have no published value. Water lighting is illustrative.
      </figcaption>
    </figure>
  );
}
