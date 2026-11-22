import { originHypotheses, settings } from './chapters';
import { EvidenceLabel, SourceLinks } from './evidence';
import styles from './deep-time.module.css';

export function PrimordialOcean() {
  return (
    <section id="primordial-ocean" className={styles.chapter} aria-labelledby="deep-time-ocean-heading">
      <div className={styles.sectionHeading}>
        <div><p className={styles.eyebrow}>Oceans and the early biosphere</p><h2 id="deep-time-ocean-heading">Primordial Ocean</h2></div>
        <p>Ancient minerals constrain when liquid water was present. Experiments explore what might have happened in early environments.</p>
      </div>
      <div className={styles.materialGrid}>
        {settings.map((note) => (
          <article key={note.id}><EvidenceLabel classification={note.classification} /><h3>{note.title}</h3><p>{note.text}</p><SourceLinks references={note.sources} /></article>
        ))}
      </div>
      <h3 className={styles.hypothesesHeading}>Four hypotheses about life’s origins</h3>
      <p className={styles.smallText}>Several ideas can be compatible. The place, date, and sequence of life’s origin remain unresolved.</p>
      <div className={styles.hypothesisGrid}>
        {originHypotheses.map((note) => (
          <details key={note.id} className={styles.hypothesis}>
            <summary>{note.title} <EvidenceLabel classification={note.classification} /></summary>
            <p>{note.text}</p><SourceLinks references={note.sources} />
          </details>
        ))}
      </div>
    </section>
  );
}
