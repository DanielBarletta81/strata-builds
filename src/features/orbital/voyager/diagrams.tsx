'use client';

import { useState } from 'react';
import { KM_PER_AU } from '../ephemeris';
import type { VoyagerSample } from './capture';
import { voyagerEvents, type EarthEvent } from './events';
import { HOURS_PER_DAY, LIGHT_DAY_KM, ROUND_TRIP_HOURS, signalAt } from './light';
import { formatDate, timeFraction } from './timeline';
import styles from './voyager.module.css';

const decades = ['1977-09-05', '1990-01-01', '2000-01-01', '2012-01-01', '2026-11-18'];
const percent = (date: string) => `${timeFraction(date) * 100}%`;

export function TimelineTracks({ selected, earth }: { selected: string; earth: readonly EarthEvent[] }) {
  return (
    <div className={styles.tracks} aria-hidden="true">
      <div className={styles.track}><span>Voyager</span><div className={styles.lane}>
        <svg viewBox="0 0 100 24" preserveAspectRatio="none"><path d="M0 12H100" vectorEffect="non-scaling-stroke" /></svg>
        {voyagerEvents.map(({ date }) => <i key={date} data-current={date === selected} style={{ left: percent(date) }} />)}
        <b className={styles.cursor} style={{ left: percent(selected) }} />
      </div></div>
      <div className={styles.track}><span>Earth</span><div className={styles.lane}>
        <svg viewBox="0 0 100 24" preserveAspectRatio="none"><path d="M0 12H100" vectorEffect="non-scaling-stroke" /></svg>
        {earth.map(({ date, through }) => <i key={date} data-current={date <= selected && selected <= (through ?? date)} style={{ left: percent(date) }} />)}
      </div></div>
      <div className={styles.track}><span /><div className={styles.years}>
        {decades.map((year) => <span key={year} style={{ left: percent(year) }}>{year.slice(0, 4)}</span>)}
      </div></div>
    </div>
  );
}

const scale = 1.14;
const xAt = (au: number) => 150 + au * scale;
const yAt = (au: number) => 34 - au * scale;

export function Trajectory({ samples, date }: { samples: readonly VoyagerSample[]; date: string }) {
  return (
    <figure className={styles.trajectory} aria-labelledby="voyager-geometry-caption">
      <svg viewBox="0 0 300 262" role="img" aria-labelledby="voyager-vector-title voyager-vector-description">
        <title id="voyager-vector-title">Sun-centered Voyager 1 model samples</title>
        <desc id="voyager-vector-description">Eight discrete positions projected onto the ICRF X–Y plane. The Sun marks the origin. Numerical coordinates are available below.</desc>
        <defs>
          <radialGradient id="voyager-plot-glow"><stop stopColor="#1c2540" /><stop offset="1" stopColor="#0a1120" /></radialGradient>
        </defs>
        <rect x="0" y="0" width="300" height="262" rx="8" fill="url(#voyager-plot-glow)" />
        {[-100, -50, 0, 50, 100].map((au) => <line key={au} x1={xAt(au)} x2={xAt(au)} y1="19" y2="232" className={styles.gridLine} />)}
        {[0, -50, -100, -150].map((au) => <line key={au} x1="22" x2="278" y1={yAt(au)} y2={yAt(au)} className={styles.gridLine} />)}
        <circle cx={xAt(0)} cy={yAt(0)} r="5" fill="#ffa96b" />
        <text x="162" y="24">Sun</text>
        {samples.map((sample) => {
          const [x, y] = sample.sunPositionKm;
          const selected = sample.date === date;
          const cx = xAt(x / KM_PER_AU);
          const cy = yAt(y / KM_PER_AU);
          return <g key={sample.date} data-sample-date={sample.date} data-selected={selected}>
            <circle cx={cx} cy={cy} r={selected ? 4.7 : 3} className={selected ? styles.selectedPoint : styles.modelPoint} />
            {selected && <circle cx={cx} cy={cy} r="8.5" className={styles.pointRing} />}
          </g>;
        })}
        <path d="M210 213v5h57v-5" className={styles.scaleLine} />
        <text x="238.5" y="235" textAnchor="middle">50 AU</text>
        <text x="22" y="244">ICRF X–Y</text>
      </svg>
      <figcaption id="voyager-geometry-caption">Eight modeled Sun-centered states. Equal X and Y scales. Z is omitted from the plot.</figcaption>
    </figure>
  );
}

const hoursLabel = (hours: number) => `${hours} ${hours === 1 ? 'hour' : 'hours'}`;

export function SignalDemo() {
  const [elapsed, setElapsed] = useState(HOURS_PER_DAY);
  const { hour, fraction, leg } = signalAt(elapsed);
  const progress = (10 + fraction * 80) + '%';
  const status = hour === 0 ? 'A hypothetical pulse leaves Earth.'
    : hour === HOURS_PER_DAY ? 'The pulse reaches Voyager. The return leg begins.'
    : hour === ROUND_TRIP_HOURS ? 'The hypothetical reply reaches Earth.'
    : leg === 'outbound' ? 'The pulse is traveling toward Voyager.' : 'The hypothetical reply is traveling toward Earth.';
  return (
    <section className={styles.signal} aria-labelledby="voyager-signal">
      <div className={styles.signalIntro}>
        <p className={styles.eyebrow}>The light-day experiment</p>
        <h2 id="voyager-signal">One day out. One day back.</h2>
        <p>At the milestone separation, light travels {LIGHT_DAY_KM.toLocaleString('en-US', { maximumFractionDigits: 1 })} km in 24 hours. Move the clock to follow a hypothetical pulse.</p>
      </div>
      <div className={styles.signalInterior}>
        <div className={styles.signalField} aria-hidden="true">
          <svg viewBox="0 0 100 36" preserveAspectRatio="none"><path d="M10 18h80" vectorEffect="non-scaling-stroke" /></svg>
          <span className={styles.earthIcon} /><span className={styles.probeIcon} />
          <span className={styles.pulse} style={{ left: progress }} />
          <span className={styles.earthText}>Earth</span><span className={styles.probeText}>Voyager 1</span>
        </div>
        <label htmlFor="voyager-signal-time">Simulated elapsed time <strong>{hoursLabel(hour)}</strong></label>
        <input id="voyager-signal-time" type="range" min={0} max={ROUND_TRIP_HOURS} step={1} value={hour}
          aria-valuetext={hoursLabel(hour)} onChange={(event) => setElapsed(Number(event.target.value))} />
        <div className={styles.signalSteps}>
          {[[0, 'Send'], [HOURS_PER_DAY, 'One-way'], [ROUND_TRIP_HOURS, 'Round trip']].map(([value, label]) => (
            <button type="button" key={value} onClick={() => setElapsed(Number(value))}>
              <strong>{value} h</strong><span>{label}</span>
            </button>
          ))}
        </div>
        <p className={styles.signalStatus} aria-live="polite">{status}</p>
      </div>
      <p className={styles.caption}>Illustrative signal at fixed separation in vacuum with an immediate reply. The 48-hour round trip is idealized.</p>
    </section>
  );
}

export function ModelRows({ samples }: { samples: readonly VoyagerSample[] }) {
  return (
    <details className={styles.modelDisclosure}>
      <summary>Modeled positions and ranges</summary>
      <table className={styles.table}>
        <caption>JPL ephemeris samples. Position is Sun-centered in ICRF.</caption>
        <thead><tr><th scope="col">Epoch (TDB)</th><th scope="col">Distances (AU)</th><th scope="col">Position (AU)</th></tr></thead>
        <tbody>{samples.map((sample) => (
          <tr key={sample.date}>
            <th scope="row"><time dateTime={sample.date}>{formatDate(sample.date)}</time><small>{sample.clockTdb} TDB</small></th>
            <td><span>Earth {(sample.earthRangeKm / KM_PER_AU).toFixed(3)}</span><span>Sun {(sample.sunRangeKm / KM_PER_AU).toFixed(3)}</span></td>
            <td>{sample.sunPositionKm.map((value, index) => <span key={index}>{'XYZ'[index]} {(value / KM_PER_AU).toFixed(3)}</span>)}</td>
          </tr>
        ))}</tbody>
      </table>
    </details>
  );
}
