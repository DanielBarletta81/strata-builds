import Link from 'next/link';
import { CatchCurveLaboratory } from './catch-curve-laboratory';
import { catchCurves } from './catch-curves';
import { MortalityObservatory } from './mortality-observatory';
import { growth, growthUnits, methodsReferences, report } from './report';
import styles from './bass.module.css';

const [titleBeforeSpecies, titleAfterSpecies] = report.title.split('Micropterus salmoides');

function GrowthObservatory() {
  return (
    <section className={styles.panel} id="growth" aria-labelledby="growth-title">
      <header className={styles.sectionHeader}>
        <p className={styles.kicker}>Table 2 · fitted parameters</p>
        <h2 id="growth-title">Growth Observatory</h2>
        <p>The Methods cites Ricker (1975) and Ford–Walford plots for fitting a von Bertalanffy growth model. Table 2 reports one pooled unstocked fit and one fit labeled for stocked systems in 2002.</p>
      </header>
      <div className={styles.growthComparison}>
        {growth.rows.map((row) => (
          <article key={row.group} className={styles.growthFit}>
            <h3>{row.group}</h3>
            <p>{row.period}</p>
            <dl className={styles.estimates}>
              <div><dt>L∞</dt><dd>{row.asymptoteMm} <small>{growthUnits.asymptoteMm}</small></dd></div>
              <div><dt>t₀ as reported</dt><dd>{row.t0Years} <small>{growthUnits.t0Years}</small></dd></div>
              <div><dt>K</dt><dd>{row.k}</dd></div>
            </dl>
          </article>
        ))}
      </div>
      <dl className={styles.definitions}>
        <div><dt>L∞ · asymptotic length</dt><dd>The length the fitted growth model approaches. It describes the model rather than an individual catch record.</dd></div>
        <div><dt>K · growth coefficient</dt><dd>Controls how quickly the model approaches its length asymptote. The transcription supplies no unit for K.</dd></div>
        <div><dt>t₀ · model age offset</dt><dd>Conventionally the theoretical age at zero modeled length. The report’s sign and equation convention await verification.</dd></div>
      </dl>
      <p className={styles.notice}>Table 2 labels the stocked fit <strong>Stocked Systems (2002)**</strong>. The Results describes pooled 1999–2002 data for Figure 17. The relationship between those records and the equation’s t₀ sign remain unresolved, so this view shows the printed parameters only.</p>
      <details className={styles.disclosure}>
        <summary>Growth parameter provenance</summary>
        <p>{report.reference} · {growth.locator} · IMG_3953.jpg. All six printed values retain their two decimal places. The footnote identifies five stocked ponds but leaves the Figure 17 relationship unresolved.</p>
        <p>The growth photograph shows Actual and Predicted series. Its figure number is outside the crop. The recovered Methods page names the fitting method, and the complete fitted equation is still needed. <a href={methodsReferences.growth}>FAO guide to Ford–Walford growth estimates</a></p>
      </details>
    </section>
  );
}

export function BassObservatory() {
  return (
    <main className={styles.observatory}>
      <div className={styles.page}>
        <header className={styles.hero}>
          <p className={styles.back}><Link href="/studio">Strata Studio</Link></p>
          <p className={styles.eyebrow}>Rhode Island freshwater fisheries · {report.publicationDate}</p>
          <h1>Bass Population Observatory</h1>
          <p className={styles.reportTitle}>{titleBeforeSpecies}<i>Micropterus salmoides</i>{titleAfterSpecies}</p>
          <p className={styles.authors}>{report.authors.join(', ')}</p>
          <p className={styles.publisher}>{report.publisher} · {report.reference}</p>
          <p className={styles.sourceStatus}>Values checked against recovered report photographs</p>
          <nav aria-label="On this page" className={styles.contents}>
            <a href="#catch-curves">Catch curves</a>
            <a href="#study">The study</a>
            <a href="#mortality">Mortality</a>
            <a href="#growth">Growth</a>
            <a href="#open-questions">Open questions</a>
            <a href="#fish-scale-laboratory">Fish scales</a>
          </nav>
        </header>

        <CatchCurveLaboratory figures={catchCurves} />

        <section className={styles.panel} id="study" aria-labelledby="study-title">
          <header className={styles.sectionHeader}>
            <h2 id="study-title">The study</h2>
            <p>Rhode Island’s 1999 management initiative asked whether supplemental stocking increased the number of legal-size largemouth bass per acre. The appendix reports estimates of age structure, mortality and growth. Establishing the stocking objective would require comparable estimates of legal-size abundance per acre.</p>
          </header>
          <div className={styles.studyGroups}>
            <article>
              <h3>1995–1998 · Unstocked systems</h3>
              <p>Alan Libby previously collected the baseline samples. Table 1 reports spring electrofishing, with annual and pooled estimates.</p>
            </article>
            <article>
              <h3>1999–2002 · Stocked systems</h3>
              <p>The study sampled five selected systems. Table 1 reports fall electrofishing and angling as separate series.</p>
            </article>
          </div>
          <p className={styles.note}>Fish were measured for length and aged from scales. The catch curves used ages 3–10 to estimate instantaneous mortality Z. Table 1 also reports annual survival S and annual mortality A.</p>
        </section>

        <MortalityObservatory />
        <GrowthObservatory />

        <section className={styles.panel} id="open-questions" aria-labelledby="questions-title">
          <header className={styles.sectionHeader}><h2 id="questions-title">Open research questions</h2></header>
          <div className={styles.studyGroups}>
            <article>
              <h3>2003 interpretation</h3>
              <p>The authors discussed competition and limited forage as possible explanations for differences in age and growth. They also considered gear selectivity when comparing mortality estimates. The discussion leaves the strength of these explanations in individual ponds open.</p>
            </article>
            <article>
              <h3>2026 research questions</h3>
              <p>Would matched seasons, gears and effort give comparable age distributions and mortality estimates? Can prey abundance and fish density distinguish forage limits from competition? Which original records could quantify legal-size bass per acre?</p>
            </article>
          </div>
        </section>

        <section className={`${styles.panel} ${styles.scalePreview}`} id="fish-scale-laboratory" aria-labelledby="fish-scale-title">
          <header className={styles.sectionHeader}>
            <p className={styles.kicker}>Coming next</p>
            <h2 id="fish-scale-title">Fish Scale Laboratory</h2>
          </header>
          <p>Researchers can estimate a fish’s age by identifying annuli, the marks left by annual changes in growth. Documented age readings help describe a population’s age composition and support analyses such as catch curves.</p>
          <p className={styles.context}>Specimen analysis awaits verified scale micrographs and individual fish records. <a href="https://www.fisheries.noaa.gov/new-england-mid-atlantic/science-data/equipment-and-techniques-age-determination-methods-northwest">NOAA Fisheries age-determination methods</a></p>
        </section>
      </div>
    </main>
  );
}
