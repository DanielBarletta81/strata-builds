import type { Metadata } from 'next';
import Image from 'next/image';
import { TimeEngine } from '@/features/deep-time/engine';
import { Oxygenation } from '@/features/deep-time/oxygen';
import { PrimordialOcean } from '@/features/deep-time/sections';
import { SourceLinks } from '@/features/deep-time/evidence';
import { sourceReviewDate, sources, type SourceId } from '@/features/deep-time/sources';
import styles from '@/features/deep-time/deep-time.module.css';

export const metadata: Metadata = {
  title: 'Deep Time Observatory | Strata Builds',
  description: 'Explore Earth’s changing oceans, atmosphere, continents and biosphere through a sourced geological timeline.',
};

export default function DeepTimePage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.hero}>
          <figure className={styles.artwork}>
            <Image src="/deep-time/primordial-ocean.webp" alt="Illustrated blue-green water above a dark rocky seafloor with suspended material."
              fill preload sizes="(max-width: 640px) 96vw, 1180px" />
            <figcaption>Concept illustration of an early ocean · AI-generated</figcaption>
          </figure>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Deep Time Observatory</p>
            <h1>The planet was<br />never still.</h1>
            <p>Explore the rocks, fossils and chemical traces that tell us how Earth’s oceans, atmosphere, continents and biosphere changed over 4.54 billion years.</p>
            <a className={styles.heroAction} href="#chronology">Explore the chronology <span aria-hidden="true">↓</span></a>
          </div>
        </header>

        <TimeEngine>
          <PrimordialOcean />
          <Oxygenation />
        </TimeEngine>

        <section id="sources" className={styles.sourceRegister} aria-labelledby="deep-time-sources">
          <p className={styles.eyebrow}>Provenance</p>
          <h2 id="deep-time-sources">Scientific source register</h2>
          <p>Geological ages and period bounds are approximate unless a source identifies a formal boundary. Historical positions use calendar years, with 2026 CE as the display reference. Event labels retain the source convention.</p>
          <details>
            <summary>Review primary evidence and model references</summary>
            <p>Sources reviewed <time dateTime={sourceReviewDate}>November 22, 2026</time>.</p>
            <SourceLinks references={Object.keys(sources) as SourceId[]} />
          </details>
        </section>
      </div>
    </main>
  );
}
