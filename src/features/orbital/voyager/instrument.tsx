'use client';

import { useState } from 'react';
import { KM_PER_AU } from '../ephemeris';
import type { VoyagerSample } from './capture';
import { ModelRows, SignalDemo, TimelineTracks, Trajectory } from './diagrams';
import { earthEvents, earthLenses, milestone, nasaInterruption, voyagerEvents, type EarthLens, type EvidenceSource } from './events';
import { lightHours } from './light';
import { compareDate, earthDateLabel, eventsForLens, formatDate, stepDate, timelineDates } from './timeline';
import styles from './voyager.module.css';

const lenses = ['All events', ...earthLenses] as const;
const kmFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const auFormat = new Intl.NumberFormat('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
const eventDates = new Map([...voyagerEvents, ...earthEvents].map((event) => [event.date, event.short]));

function SourceLink({ source }: { source: EvidenceSource }) {
  return <a className={styles.sourceLink} href={source.url}>{source.name} <span aria-hidden="true">↗</span></a>;
}

function distanceLightTime(rangeKm: number) {
  const hours = lightHours(rangeKm);
  return hours < 1 ? `${(hours * 3600).toFixed(2)} s` : `${hours.toFixed(2)} h`;
}

function Distances({ sample }: { sample: VoyagerSample }) {
  return (
    <div className={styles.readouts} data-testid="voyager-distances">
      <h3>Modeled distances</h3>
      <dl>
        <div><dt>From Earth’s center</dt><dd>{auFormat.format(sample.earthRangeKm / KM_PER_AU)} <small>AU</small><span>{kmFormat.format(sample.earthRangeKm)} km</span></dd></div>
        <div><dt>From the Sun’s center</dt><dd>{auFormat.format(sample.sunRangeKm / KM_PER_AU)} <small>AU</small><span>{kmFormat.format(sample.sunRangeKm)} km</span></dd></div>
        <div><dt>One-way light time from Earth</dt><dd>{distanceLightTime(sample.earthRangeKm)}<span>Calculated from geometric range ÷ c</span></dd></div>
      </dl>
      <p className={styles.caption}>
        Model sample <time dateTime={sample.date}>{formatDate(sample.date)}</time> · {sample.clockTdb} TDB
      </p>
    </div>
  );
}

export function VoyagerInstrument({ samples }: { samples: readonly VoyagerSample[] }) {
  const [date, setDate] = useState(milestone);
  const [lens, setLens] = useState<EarthLens>('All events');
  const { mission, earth } = compareDate(date, lens);
  const earthInLens = eventsForLens(lens);
  const currentSample = samples.find((sample) => sample.date === date);

  return (
    <div className={styles.instrument}>
      <section className={styles.chronology} aria-labelledby="voyager-chronology">
        <div className={styles.sectionHeading}>
          <div><p className={styles.eyebrow}>1977–2026</p><h2 id="voyager-chronology">Two journeys, one clock</h2></div>
          <p>Browse documented dates. The Earth track changes with the lens. The shared date stays selected.</p>
        </div>
        <div className={styles.controls}>
          <div className={styles.dateControl}>
            <label htmlFor="voyager-date">Shared timeline date</label>
            <select id="voyager-date" value={date} onChange={(event) => setDate(event.target.value)}>
              {timelineDates.map((day) => <option key={day} value={day}>{formatDate(day)} · {eventDates.get(day)}</option>)}
            </select>
          </div>
          <div className={styles.stepControls}>
            <button type="button" aria-label="Previous timeline date" disabled={date === timelineDates[0]} onClick={() => setDate(stepDate(date, -1))}>←<span> Earlier</span></button>
            <button type="button" aria-label="Next timeline date" disabled={date === milestone} onClick={() => setDate(stepDate(date, 1))}><span>Later </span>→</button>
          </div>
          <div className={styles.lensControl}>
            <label htmlFor="earth-lens">Earth lens</label>
            <select id="earth-lens" value={lens} onChange={(event) => {
              const nextLens = lenses.find((item) => item === event.target.value);
              if (nextLens) setLens(nextLens);
            }}>
              {lenses.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
        </div>
        <TimelineTracks selected={date} earth={earthInLens} />
        <div className={styles.compareHeading}>
          <p className={styles.eyebrow}>Compare on the same date</p>
          <time dateTime={date} aria-live="polite" data-selected-date={date}>{formatDate(date)}</time>
        </div>
        <div className={styles.comparison}>
          <article className={styles.spaceCard}>
            <p className={styles.eyebrow}>Voyager 1</p>
            {mission ? <><h3>{mission.title}</h3><p>{mission.description}</p><SourceLink source={mission.source} /></> :
              <><h3>Between mission milestones</h3><p>There is no Voyager event or modeled position in this capture for the selected date.</p></>}
          </article>
          <article className={styles.earthCard}>
            <p className={styles.eyebrow}>Earth · {earth?.event.category ?? lens}</p>
            {earth && <>
              <h3>{earth.event.title}</h3>
              <p className={styles.contextDate} data-earth-offset={earth.offset}>
                {earthDateLabel(earth.event)}
                {' · '}
                {earth.offset === 0 ? (earth.event.through ? 'During the selected date' : 'On the selected date')
                  : `Closest event in this lens · ${Math.abs(earth.offset)} ${Math.abs(earth.offset) === 1 ? 'day' : 'days'} ${earth.offset > 0 ? 'after' : 'before'}`}
              </p>
              <p>{earth.event.description}</p>
              <SourceLink source={earth.event.source} />
            </>}
          </article>
        </div>
        <details className={styles.eventDisclosure}>
          <summary>Browse and select dated events</summary>
          <table className={styles.table}>
            <caption>Voyager milestones and Earth events in the selected lens</caption>
            <thead><tr><th scope="col">Date and track</th><th scope="col">Event</th><th scope="col">Source</th></tr></thead>
            <tbody>{[
              ...voyagerEvents.map((event) => ({ ...event, track: 'Voyager' })),
              ...earthInLens.map((event) => ({ ...event, track: event.category })),
            ].sort((a, b) => a.date.localeCompare(b.date)).map((event) => (
              <tr key={event.date} data-current={event.date === date}>
                <th scope="row"><time dateTime={event.date}>{formatDate(event.date)}</time><small>{event.track}</small></th>
                <td><button type="button" aria-pressed={event.date === date} onClick={() => setDate(event.date)}>{event.title}</button></td>
                <td><a href={event.source.url} aria-label={event.source.name + ' for ' + event.title}>Source ↗</a></td>
              </tr>
            ))}</tbody>
          </table>
        </details>
      </section>

      <section className={styles.distance} aria-labelledby="voyager-distance">
        <div className={styles.sectionHeading}>
          <div><p className={styles.eyebrow}>JPL Horizons ephemeris</p><h2 id="voyager-distance">How far away?</h2></div>
          <p>The heliocentric view and the Earth-centered range use the same stored epoch and different origins.</p>
        </div>
        <div className={styles.distanceGrid}>
          <Trajectory samples={samples} date={date} />
          {currentSample ? <Distances sample={currentSample} /> : <div className={styles.readouts}>
            <h3>Distance unavailable</h3>
            <p>The capture has no ephemeris sample for {formatDate(date)}. The plot shows the eight supported states without a selected marker.</p>
          </div>}
        </div>
        <ModelRows samples={samples} />
      </section>

      <SignalDemo />
      <aside className={styles.notice} aria-labelledby="voyager-interruption">
        <h2 id="voyager-interruption">A carrier signal during a data interruption</h2>
        <p>NASA reported a carrier without usable science or engineering data beginning November 14, 2026. The milestone confirmation used that carrier and trajectory calculations. This exhibit uses saved records.</p>
        <SourceLink source={nasaInterruption} />
      </aside>
    </div>
  );
}
