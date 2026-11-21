import Link from 'next/link';
import { MortalityObservatory } from './mortality-observatory';
import { figureArchive, growth, growthUnits, methodsReferences, report } from './report';
import styles from './bass.module.css';

const [titleBeforeSpecies, titleAfterSpecies] = report.title.split('Micropterus salmoides');

function GrowthObservatory() {
  return (
    <section className={styles.panel} id="growth" aria-labelledby="growth-title">
      <header className={styles.sectionHeader}>
        <p className={styles.kicker}>Table 2 · fitted parameters</p>
        <h2 id="growth-title">Growth Observatory</h2>
        <p>The report fitted a von Bertalanffy model using Ford–Walford plots. The transcribed table supplies one pooled unstocked fit and one 2002 stocked fit.</p>
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
      <p className={styles.notice}>A growth trajectory requires the original equation convention. Actual and predicted length-at-age figures also await verification. The published fits describe different sampling periods and pond groups, leaving causal stocking effects unresolved.</p>
      <details className={styles.disclosure}>
        <summary>Growth parameter provenance</summary>
        <p>{report.reference} · {growth.locator}. All six values retain the transcription’s two decimal places. Group-specific season and gear are unconfirmed for this table.</p>
        <p>The FAO reference describes the general model and Ford–Walford method. The original report page is needed to verify this study’s equation. <a href={methodsReferences.growth}>FAO guide to Ford–Walford growth estimates</a></p>
      </details>
    </section>
  );
}

function CatchCurveArchive() {
  return (
    <section className={styles.panel} id="catch-curves" aria-labelledby="catch-title">
      <header className={styles.sectionHeader}>
        <p className={styles.kicker}>Figure register</p>
        <h2 id="catch-title">Catch Curve Archive</h2>
        <p>The researcher reports photographs of individual-year and pooled curves. Figure pages, identities and plotted values await local verification.</p>
      </header>
      <ul className={styles.archive}>
        {figureArchive.typesReportedByResearcher.map((type) => (
          <li key={type}><strong>{type}</strong><span>Original page pending</span></li>
        ))}
      </ul>
      <p className={styles.note}>Some figure annotations reportedly give Z to {figureArchive.annotationDecimalPlacesReportedByResearcher} decimal places. Table 1 uses two. When the pages are available, each figure annotation will have its own locator and printed precision. The fish counts behind the curves remain unavailable.</p>
    </section>
  );
}

export function BassObservatory() {
  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.back}><Link href="/studio">Strata Studio</Link></p>
        <p className={styles.eyebrow}>Rhode Island freshwater fisheries · {report.publicationDate}</p>
        <h1>Bass Population Observatory</h1>
        <p className={styles.reportTitle}>{titleBeforeSpecies}<i>Micropterus salmoides</i>{titleAfterSpecies}</p>
        <p className={styles.authors}>{report.authors.join(', ')}</p>
        <p className={styles.publisher}>{report.publisher} · {report.reference}</p>
        <p className={styles.sourceStatus}>Researcher-supplied transcriptions · original pages pending verification</p>
        <nav aria-label="On this page" className={styles.contents}>
          <a href="#study">The study</a>
          <a href="#mortality">Mortality</a>
          <a href="#growth">Growth</a>
          <a href="#catch-curves">Catch curves</a>
          <a href="#open-questions">Open questions</a>
        </nav>
      </header>

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
      <CatchCurveArchive />

      <section className={styles.panel} id="open-questions" aria-labelledby="questions-title">
        <header className={styles.sectionHeader}><h2 id="questions-title">Open research questions</h2></header>
        <div className={styles.studyGroups}>
          <article>
            <h3>2003 interpretation</h3>
            <p>The research brief identifies competition and limited forage as hypotheses considered by the authors. Age distributions, sampling selectivity and mortality are also part of that discussion. The original discussion pages are needed to verify how the authors connected those explanations to individual ponds and results.</p>
          </article>
          <article>
            <h3>2026 research questions</h3>
            <p>Would matched seasons, gears and effort give comparable age distributions and mortality estimates? Can prey abundance and fish density distinguish forage limits from competition? Which original records could quantify legal-size bass per acre?</p>
          </article>
        </div>
      </section>
    </main>
  );
}
