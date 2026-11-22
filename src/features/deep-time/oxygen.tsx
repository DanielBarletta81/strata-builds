'use client';

import { useState } from 'react';
import { oxygenPhases } from './chapters';
import { EvidenceLabel, SourceLinks } from './evidence';
import styles from './deep-time.module.css';

export function Oxygenation() {
  const [selected, select] = useState(0);
  const phase = oxygenPhases[selected];

  return (
    <section id="oxygenation" className={styles.oxygen} aria-labelledby="deep-time-oxygen-heading">
      <div className={styles.sectionHeading}>
        <div><p className={styles.eyebrow}>Atmosphere and oceans</p><h2 id="deep-time-oxygen-heading">How oxygen accumulated</h2></div>
        <p>Explore a qualitative model of the Great Oxidation Event. These processes overlap and have different timing across the atmosphere and oceans.</p>
      </div>
      <div className={styles.phases} role="group" aria-label="Oxygenation concepts">
        {oxygenPhases.map(({ id, name }, index) => (
          <button key={id} type="button" aria-pressed={index === selected} onClick={() => select(index)}>{name}</button>
        ))}
      </div>
      <div className={styles.phaseContent} data-phase={phase.id}>
        <EvidenceLabel classification="interpretation" />
        <h3 aria-live="polite" aria-atomic="true">{phase.takeaway}</h3>
        <dl className={styles.layers}>
          <div><dt>Atmosphere</dt><dd>{phase.atmosphere}</dd></div>
          <div><dt>Ocean waters</dt><dd>{phase.oceans}</dd></div>
          <div><dt>Rock and sediment proxies</dt><dd>{phase.proxies}</dd></div>
        </dl>
        <SourceLinks references={phase.sources} />
      </div>
    </section>
  );
}
