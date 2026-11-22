'use client';

import Link from 'next/link';
import { useState } from 'react';
import { chronology, type GeologicalEvent } from './chronology';
import { EvidenceLabel, SourceLinks } from './evidence';
import { axisLabel, initialSelection, position, scales, selectEvent, setZoom, timeWindow, visibleEvents, zoomLimit, type Selection, type TimeWindow } from './time';
import styles from './deep-time.module.css';

const guideChapters = [
  { id: 'liquid-water', label: 'Primordial Ocean' },
  { id: 'great-oxidation', label: 'Oxygenation' },
  { id: 'tethys', label: 'Tethys' },
  { id: 'modern-earth', label: 'Modern Earth' },
];

const chapterLinks = {
  'primordial-ocean': 'Explore Primordial Ocean',
  oxygenation: 'Explore oxygenation',
  tethys: 'Read the Tethys model review',
} as const;

function Ruler({ selection, window }: { selection: Selection; window: TimeWindow }) {
  const records = visibleEvents(window);
  const ticks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className={styles.ruler} data-scale={scales[selection.level].id} aria-hidden="true">
      <div className={styles.rail}>
        {ticks.map((tick) => <i key={tick} className={styles.tick} style={{ left: `${tick * 100}%` }} />)}
        {records.map(({ event, range }) => {
          const start = position(Math.min(window.older, range.older), window);
          const end = position(Math.max(window.younger, range.younger), window);
          const active = event.id === selection.id;
          return range.older === range.younger ? (
            <i key={event.id} className={styles.pin} style={{ left: `${start}%` }} data-marker={event.id} data-active={active} />
          ) : (
            <i key={event.id} className={styles.interval} style={{ left: `${start}%`, width: `${end - start}%` }} data-marker={event.id} data-active={active} />
          );
        })}
      </div>
      <div className={styles.tickLabels}>
        {ticks.map((tick) => <span key={tick} style={{ left: `${tick * 100}%` }}>
          {axisLabel(window.older - tick * (window.older - window.younger), selection.level)}
        </span>)}
      </div>
    </div>
  );
}

export function TimeEngine() {
  const [selection, setSelection] = useState(initialSelection);
  const currentIndex = chronology.findIndex(({ id }) => selection.id === id);
  const active = chronology[currentIndex];
  const window = timeWindow(selection);
  const count = visibleEvents(window).length;
  const availableZoom = zoomLimit(selection.anchorAge);

  function choose(event: GeologicalEvent) {
    setSelection((prior) => selectEvent(prior, event));
  }

  function chooseId(id: string) {
    const event = chronology.find((record) => record.id === id);
    if (event) choose(event);
  }

  return (
    <section id="chronology" className={styles.engine} aria-labelledby="deep-time-engine-heading">
      <div className={styles.sectionHeading}>
        <div><p className={styles.eyebrow}>Geological time engine</p><h2 id="deep-time-engine-heading">Read the geological record</h2></div>
        <p>Choose an event, then narrow the time window around it. Ga, Ma and ka mean billions, millions and thousands of years ago.</p>
      </div>

      <div className={styles.controls}>
        <div>
          <label htmlFor="deep-time-event">Selected event</label>
          <select id="deep-time-event" value={active.id} onChange={(event) => chooseId(event.target.value)}>
            {chronology.map((event) => <option key={event.id} value={event.id}>{event.title}</option>)}
          </select>
        </div>
        <div className={styles.stepButtons}>
          <button type="button" disabled={!currentIndex} onClick={() => choose(chronology[currentIndex - 1])} aria-label="Previous event">← Older</button>
          <button type="button" disabled={currentIndex === chronology.length - 1} onClick={() => choose(chronology[currentIndex + 1])} aria-label="Next event">Newer →</button>
        </div>
      </div>
      <div className={styles.scaleChoices} role="group" aria-label="Time scale" aria-describedby="deep-time-scale-note">
        {scales.map((scale, level) => (
          <button key={scale.id} type="button" aria-pressed={level === selection.level} disabled={level > availableZoom}
            onClick={() => setSelection((prior) => setZoom(prior, level))}>
            {scale.label}
          </button>
        ))}
      </div>
      <p id="deep-time-scale-note" className={styles.smallText}>{availableZoom === 4
        ? 'The historical scale uses whole calendar years. Exact dates appear in the selected record.'
        : 'Select a recent event to unlock finer scales.'}</p>

      <div className={styles.plot}>
        <p className={styles.windowLabel}><strong>Visible window</strong> {axisLabel(window.older, selection.level)} – {axisLabel(window.younger, selection.level)}</p>
        <Ruler selection={selection} window={window} />
        <p className={styles.smallText}>{count} dated {count === 1 ? 'entry' : 'entries'} in view. Dots mark dated entries. Bars show published intervals.</p>
        {active.when.kind === 'unresolved' && <p className={styles.undated} data-undated>This event has no assigned date. The ruler stays at the previous dated selection.</p>}
      </div>

      <div className={styles.quickChoices} role="group" aria-label="Jump to a chapter">
        {guideChapters.map(({ id, label }) => (
          <button key={id} type="button" onClick={() => chooseId(id)}>{label}</button>
        ))}
      </div>

      <div className={styles.selectedGrid}>
        <article className={styles.featured} aria-labelledby="deep-time-current">
          <div aria-live="polite" aria-atomic="true">
            <p className={styles.eyebrow}>{active.theme} · {active.when.label}</p>
            <h3 id="deep-time-current" data-selected-event={active.id}>{active.title}</h3>
          </div>
          <EvidenceLabel classification={active.classification} />
          <p>{active.supported}</p>
          {active.chapter && <a href={`#${active.chapter}`}>{chapterLinks[active.chapter]} ↓</a>}
          {active.when.kind === 'historical' && <Link href="/orbital/voyager">Explore the Voyager timeline →</Link>}
        </article>
        <aside className={styles.evidence} aria-labelledby="deep-time-evidence-heading">
          <h3 id="deep-time-evidence-heading">Evidence inspector</h3>
          <dl>
            <div><dt>What remains unresolved</dt><dd>{active.unresolved}</dd></div>
            <div><dt>Evidence to look for</dt><dd>{active.next}</dd></div>
          </dl>
          <SourceLinks references={active.sources} />
        </aside>
      </div>

      <details className={styles.chronologyTable}>
        <summary>Browse the full chronology table</summary>
        <table>
          <caption>Geological ages, historical dates and undated chapters. Select an event to inspect it.</caption>
          <thead><tr><th scope="col">Event</th><th scope="col">Age or date</th><th scope="col">Evidence</th></tr></thead>
          <tbody>{chronology.map((event) => (
            <tr key={event.id} data-current={event.id === active.id}>
              <th scope="row"><button type="button" aria-pressed={event.id === active.id} onClick={() => choose(event)}>{event.title}</button></th>
              <td>{event.when.label}</td>
              <td><EvidenceLabel classification={event.classification} /></td>
            </tr>
          ))}</tbody>
        </table>
      </details>
    </section>
  );
}
