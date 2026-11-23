import { contiguousObservations, HOUR_MS, type SignalsSnapshot } from './observations';
import { formatTemperature, formatUtc } from './display';
import styles from './signals.module.css';

const WIDTH = 720;
const HEIGHT = 224;
const PAD = 10;

export function TemperatureChart({ snapshot, selectedObservationAt, onSelectObservation }: { snapshot: SignalsSnapshot; selectedObservationAt: string | null; onSelectObservation: (at: string | null) => void }) {
  const { window, observations, coverage, summary } = snapshot;
  if (!summary) return null;

  const handleChartKeyDown = (e: React.KeyboardEvent<SVGSVGElement>) => {
    if (!observations.length) return;
    const selectedIndex = observations.findIndex(obs => obs.observedAt === selectedObservationAt);

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (selectedIndex + 1) % observations.length;
      onSelectObservation(observations[nextIndex].observedAt);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = selectedIndex <= 0 ? observations.length - 1 : selectedIndex - 1;
      onSelectObservation(observations[prevIndex].observedAt);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onSelectObservation(null);
    }
  };

  const start = Date.parse(window.startUtc);
  const step = WIDTH / window.hours;
  const min = summary.min;
  const max = summary.max;
  const scale = Math.max(1, Math.abs(min), Math.abs(max));
  const scaledRange = max / scale - min / scale;
  const middle = min / 2 + max / 2;
  const x = (time: string) => ((Date.parse(time) - start) / HOUR_MS + 0.5) * step;
  const y = (value: number) => min === max || scaledRange === 0
    ? HEIGHT / 2
    : HEIGHT - PAD - (value / scale - min / scale) / scaledRange * (HEIGHT - PAD * 2);
  const segments = contiguousObservations(observations);
  const missing = snapshot.gaps.filter((gap) => gap.type === 'observation_gap');
  const ticks = min === max ? [min] : [max, middle, min];

  return (
    <figure className={styles.figure}>
      <div className={styles.plot}>
        <div className={styles.yAxis} aria-hidden="true">
          {ticks.map((value, index) => (
            <span key={index} style={{ top: y(value) / HEIGHT * 100 + '%' }}>{formatTemperature(value)}</span>
          ))}
        </div>
        <svg
          className={styles.svg}
          viewBox={'0 0 ' + WIDTH + ' ' + HEIGHT}
          preserveAspectRatio="none"
          role="img"
          aria-labelledby="signals-chart-title signals-chart-description"
          tabIndex={0}
          onKeyDown={handleChartKeyDown}
          aria-label={selectedObservationAt ? `Chart with selection. Use arrow keys to navigate, Escape to deselect.` : `Chart. Use arrow keys to select observations.`}
        >
          <title id="signals-chart-title">Hourly water temperature in degrees Celsius</title>
          <desc id="signals-chart-description">
            {summary.count} accepted observations from {formatUtc(window.startUtc)} to {formatUtc(window.endUtcExclusive)} (exclusive).
            Values ranged from {formatTemperature(min)} to {formatTemperature(max)} degrees Celsius.
            {' '}{coverage.missingHours} expected hours have no accepted value. Marked gaps have no connecting line.
            The observation table provides exact timestamps, values, and flags.
          </desc>
          <defs>
            <pattern id="signals-gap-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
              <line x1="0" y1="0" x2="0" y2="8" className={styles.hatch} />
            </pattern>
          </defs>
          {ticks.map((value, index) => (
            <line key={index} x1="0" y1={y(value)} x2={WIDTH} y2={y(value)} className={styles.gridLine} />
          ))}
          {missing.map((gap) => gap.interval && (
            <rect key={gap.id} x={x(gap.interval.startUtc) - step / 2} width={step} height={HEIGHT} fill="url(#signals-gap-hatch)" />
          ))}
          {segments.filter((segment) => segment.length > 1).map((segment) => (
            <polyline
              key={segment[0].observedAt}
              points={segment.map((point) => x(point.observedAt) + ',' + y(point.value)).join(' ')}
              className={styles.series}
            />
          ))}
          {observations.map((point) => (
            <circle
              key={point.observedAt}
              data-observation={point.observedAt}
              cx={x(point.observedAt)}
              cy={y(point.value)}
              r="2"
              aria-current={selectedObservationAt === point.observedAt ? 'true' : 'false'}
              className={styles.point}
              onClick={() => onSelectObservation(selectedObservationAt === point.observedAt ? null : point.observedAt)}
              aria-label={`${formatTemperature(point.value)}°C at ${formatUtc(point.observedAt)}`}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </svg>
      </div>
      <div className={styles.xAxis} aria-hidden="true">
        <span>{formatUtc(window.startUtc)}</span>
        {window.hours > 1 && <span>{formatUtc(new Date(Date.parse(window.endUtcExclusive) - HOUR_MS).toISOString())}</span>}
      </div>
      <figcaption className={styles.chartCaption}>
        <span><i className={styles.obsKey} aria-hidden="true" /> Accepted observation</span>
        <span><i className={styles.gapKey} aria-hidden="true" /> No accepted value</span>
        <a href="#signals-observations">Inspect exact values</a>
      </figcaption>
    </figure>
  );
}
