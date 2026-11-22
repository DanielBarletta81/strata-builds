import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { loadVoyager, trajectorySolution, trajectorySources } from '@/features/orbital/voyager/capture';
import { nasaMilestone, paleBlueDot, sourcesReviewedOn } from '@/features/orbital/voyager/events';
import { VoyagerInstrument } from '@/features/orbital/voyager/instrument';
import styles from '@/features/orbital/voyager/voyager.module.css';

export const metadata: Metadata = {
  title: 'Voyager 1 · One Light-Day | Strata Builds',
  description: 'Follow Voyager 1 from launch to one light-day from Earth and explore a parallel timeline of discoveries and events at home.',
};

export default function VoyagerPage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <Link className={styles.back} href="/orbital">← Orbital Observatory</Link>
        <header className={styles.hero}>
          <div className={styles.heroImage}>
            <Image src="/voyager/pale-blue-dot.webp" alt="Earth is a tiny pale blue point in a diagonal sunbeam, photographed by Voyager 1 in 1990."
              fill preload sizes="(max-width: 680px) 95vw, 670px" />
          </div>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>Voyager 1 · Parallel Earth timeline</p>
            <h1>One light-day.<br />One changing Earth.</h1>
            <p>From launch in 1977 to a full day of signal travel in 2026, follow Voyager 1 and the changes and discoveries on the planet it left behind.</p>
            <a className={styles.heroDate} href={nasaMilestone.url}><time dateTime="2026-11-18">November 18, 2026</time> <span>· Milestone confirmed by NASA ↗</span></a>
          </div>
          <p className={styles.imageCredit}><a href={paleBlueDot.url}>Pale Blue Dot, 1990 · NASA/JPL-Caltech ↗</a></p>
        </header>

        <VoyagerInstrument samples={loadVoyager()} />

        <section className={styles.sources} aria-labelledby="voyager-sources">
          <p className={styles.eyebrow}>Evidence and limits</p>
          <h2 id="voyager-sources">Where the numbers come from</h2>
          <p>NASA’s event dates and the Horizons model epochs identify different things. The saved vectors use TDB, geometric ICRF coordinates, kilometres and seconds. Earth and Sun body-center requests are stored separately. The milestone report gives civil time.</p>
          <details>
            <summary>Open the model and source receipts</summary>
            <p>JPL target −31 · {trajectorySolution}. Horizons describes a patched-conic mission-design reconstruction through 1980, and a 2022 refit and prediction based on tracking from 1981–1992. This capture does not supply a per-sample range uncertainty. The geometry shows the stored samples only.</p>
            <ul>
              {Object.entries(trajectorySources).map(([origin, receipt]) => (
                <li key={origin}><a href={receipt.url}>Horizons {origin === 'earth' ? 'Earth-centered' : 'Sun-centered'} request</a>
                  {' · retrieved '}<time dateTime={receipt.retrievedAt}>{receipt.retrievedAt}</time>
                  <br />SHA-256 <code>{receipt.sha256}</code>
                </li>
              ))}
            </ul>
            <p>Event sources reviewed <time dateTime={sourcesReviewedOn}>{sourcesReviewedOn}</time>. <a href="https://ssd-api.jpl.nasa.gov/doc/horizons.html">Horizons API contract</a> · <a href="https://physics.nist.gov/cgi-bin/cuu/Value?c">NIST speed of light</a></p>
          </details>
        </section>

        <section id="deep-time" className={styles.gateway} aria-labelledby="voyager-deep-time">
          <p className={styles.eyebrow}>Planned observatory · <code>/deep-time</code></p>
          <h2 id="voyager-deep-time">Earth on a deeper clock</h2>
          <p>Deep Time will explore how Earth’s continents, oceans, atmosphere, and biosphere have changed. An approximately 111 Ma Tethys Ocean chapter would begin with an attributed plate reconstruction and its evidence limits.</p>
          <a href="https://www.earthbyte.org/gplates-2-3-software-and-data-sets/">Explore the candidate EarthByte model ↗</a>
        </section>
      </div>
    </main>
  );
}
