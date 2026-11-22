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

export function TethysGateway() {
  return (
    <section id="tethys" className={styles.tethys} aria-labelledby="deep-time-tethys-heading">
      <div className={styles.tethysLead}>
        <div><p className={styles.eyebrow}>Albian · Early Cretaceous</p><h2 id="deep-time-tethys-heading">Ancient Tethys Ocean</h2></div>
        <p className={styles.tethysTime}>≈ 111 <span>Ma</span></p>
      </div>
      <EvidenceLabel classification="modeled" />
      <p>This chapter concerns ancient Earth. The fictional <em>World of Tethys</em> is a separate creative setting. A plate model can guide a future reconstruction of the Tethyan region at this time.</p>
      <div className={styles.modelGrid}>
        <article>
          <h3>Selected model for validation</h3>
          <p>EarthByte’s GPlates 2.3 GeoData pairs the <code>Muller2019-Young2019-Cao2020</code> rotation model with matching plate topologies. The underlying Müller et al. model spans 250 million years.</p>
          <SourceLinks references={['earthbyte', 'muller']} />
        </article>
        <article>
          <h3>Comparison model</h3>
          <p>GPlates 2.0 packages the Matthews et al. (2016) rotation and polygon compilation. EarthByte lists its own data under CC BY 3.0 and specifies layer citations.</p>
          <SourceLinks references={['matthews', 'ics']} />
        </article>
      </div>
      <p className={styles.modelStatus}><strong>Reconstruction pending.</strong> File-level rights, a fixed reference frame and an independently checked 111 Ma export are required before drawing coastlines or plate boundaries.</p>
    </section>
  );
}
