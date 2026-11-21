import { KM_PER_AU, type StateSample } from './ephemeris';
import styles from './orbital.module.css';

const span = 420;
const origin = span / 2;
const pixelsPerAu = 60;
const grid = [-3, -2, -1, 0, 1, 2, 3];

function coordinate(index: number, axis: 'x' | 'y') {
  return origin + index * pixelsPerAu * (axis === 'x' ? 1 : -1);
}

function project(sample: StateSample) {
  const [x, y] = sample.positionKm;
  return [coordinate(x / KM_PER_AU, 'x'), coordinate(y / KM_PER_AU, 'y')];
}

function pathString(positions: number[][]) {
  return positions.map((position) => position.map((component) => component.toFixed(2)).join(',')).join(' ');
}

export function OrbitPlot({ samples, index }: { samples: StateSample[]; index: number }) {
  const points = samples.map(project);
  const [x, y] = points[index];
  return (
    <figure className={styles.figure}>
      <svg viewBox={'0 0 ' + span + ' ' + span} role="img" aria-labelledby="orbit-svg-title orbit-svg-desc">
        <title id="orbit-svg-title">Sun-centered projection of the modeled Ceres trajectory</title>
        <desc id="orbit-svg-desc">
          J2000 ecliptic projection, in astronomical units. Positive X is right and positive Y is up.
          The selected marker is the modeled state on {samples[index].dateTdb} at midnight TDB.
          The velocity and three-dimensional position are in the numerical state table.
        </desc>
        <g aria-hidden="true">
          {[1, 2, 3].map((value) => (
            <circle key={value} cx={origin} cy={origin} r={value * pixelsPerAu} className={styles.guide} />
          ))}
          <line x1="24" y1={origin} x2="396" y2={origin} className={styles.axis} />
          <line x1={origin} y1="24" x2={origin} y2="396" className={styles.axis} />
          {grid.filter((value) => value !== 0).map((value) => (
            <g key={value}>
              <path d={'M' + coordinate(value, 'x') + ' 207v6 M207 ' + coordinate(value, 'y') + 'h6'} className={styles.axis} />
              <text x={coordinate(value, 'x')} y="227" textAnchor="middle">{value}</text>
              <text x="201" y={coordinate(value, 'y')} textAnchor="end" dominantBaseline="middle">{value}</text>
            </g>
          ))}
          <text x="396" y="198" textAnchor="end">X (au)</text>
          <text x="220" y="25">Y (au)</text>

          <polyline className={styles.orbitAhead} points={pathString(points.slice(index))} />
          <polyline className={styles.orbitComplete} points={pathString(points.slice(0, index + 1))} />
          <circle cx={origin} cy={origin} r="4.5" className={styles.sun} />
          <text className={styles.sunLabel} x="221" y="199">Sun</text>
          <circle data-sample-jd={samples[index].jdTdb} cx={x} cy={y} r="6.5" className={styles.marker} />
        </g>
      </svg>
      <figcaption>
        <span><i className={styles.markerKey} aria-hidden="true" /> Selected state</span>
        <span><i className={styles.lineKey} aria-hidden="true" /> Earlier samples</span>
        <span><i className={styles.dashKey} aria-hidden="true" /> Later samples</span>
      </figcaption>
    </figure>
  );
}
