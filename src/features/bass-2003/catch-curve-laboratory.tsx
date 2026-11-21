'use client';

import { useState } from 'react';
import { catchCurveTableRecord, catchCurves, photoReceipts, printedFitAges } from './catch-curves';
import { methodsReferences, mortalityRowId } from './report';
import styles from './bass.module.css';

export function CatchCurveLaboratory() {
  const [selectedFile, setSelectedFile] = useState(catchCurves[0].sourceFile);
  const figure = catchCurves.find((record) => record.sourceFile === selectedFile) ?? catchCurves[0];
  const table = catchCurveTableRecord(figure);
  const receipt = photoReceipts[figure.sourceFile];
  const ageRange = `${figure.ageTicks.join('–')} years`;

  return (
    <section className={styles.panel} id="catch-curves" aria-labelledby="catch-title">
      <header className={styles.sectionHeader}>
        <p className={styles.kicker}>Historical figures · reported estimates</p>
        <h2 id="catch-title">Catch Curve Laboratory</h2>
        <p>Inspect seven figures from the 2003 report and compare each printed mortality annotation with its Table 1 estimate.</p>
      </header>
      <div className={`${styles.instrument} ${styles.catchInstrument}`}>
        <div className={styles.figureControl}>
          <label htmlFor="bass-catch-figure">Catch-curve figure</label>
          <select id="bass-catch-figure" value={selectedFile} onChange={(event) => setSelectedFile(event.target.value)}>
            {catchCurves.map(({ period, method, sourceFile }) => (
              <option key={sourceFile} value={sourceFile}>{period} · {method}</option>
            ))}
          </select>
        </div>
        <div aria-live="polite" aria-atomic="true" className={styles.figureSelection}>
          <h3>{figure.title}</h3>
          <p className={styles.context}>
            {figure.scope} estimate · {table?.season} · {table?.group} systems
          </p>
          <dl className={`${styles.estimates} ${styles.figureEstimates}`}>
            <div><dt>Figure annotation Z</dt><dd>{figure.printedZ}</dd></div>
            <div><dt>Table 1 estimate Z</dt><dd>{table?.z ?? 'Unavailable'}</dd></div>
            <div><dt>Printed fit ages</dt><dd>{printedFitAges.join('–')}</dd></div>
          </dl>
        </div>
        {table && <p className={styles.note}><a href={`#${mortalityRowId(table)}`}>Inspect the corresponding Table 1 row</a></p>}
        <dl className={styles.axisRanges}>
          <div><dt>Age ticks</dt><dd>{ageRange}{figure.ageUpperBoundCropped && ' visible. Upper bound cropped.'}</dd></div>
          <div><dt>ln frequency ticks</dt><dd>{figure.lnFrequencyTicks.join('–')}</dd></div>
        </dl>
        <p className={styles.notice}>Digitized points and a traced regression line await independent validation. The figure annotation and Table 1 estimate retain their own printed precision.</p>
      </div>

      <details className={styles.disclosure}>
        <summary>Catch-curve source inspector</summary>
        <dl className={styles.figureSource}>
          <div><dt>Photograph</dt><dd>{figure.sourceFile}</dd></div>
          <div><dt>SHA-256</dt><dd><code>{receipt.sha256}</code></dd></div>
          <div><dt>Plot locator</dt><dd>{figure.captionNumber && `${figure.captionNumber}. `}{figure.locator}</dd></div>
          <div><dt>Digitization review</dt><dd>{figure.legibility}</dd></div>
          <div><dt>Method used here</dt><dd>Direct transcription from the verified photograph. Point extraction requires perspective correction, labeled tick calibration and an independent reading.</dd></div>
        </dl>
      </details>
      <details className={styles.disclosure}>
        <summary>How to read a catch curve</summary>
        <p>A catch curve plots the natural log of catch frequency against age. Younger fish can be underrepresented until they become vulnerable to the sampling gear. The fitted descending ages should be well represented by the gear and have broadly comparable recruitment across year classes.</p>
        <p>The Results and these seven figures specify ages 3–10. The photographed text gives no justification for those particular endpoints. Under a constant annual mortality rate, the negative fitted slope estimates Z, annual survival is S = exp(−Z), and annual mortality is A = 1 − S. Table 1 supplies the printed survival and mortality estimates.</p>
        <p>Differences in season, gear, recruitment and sampled ponds can change the apparent slope. A stocking effect would require a comparable design and evidence about changes in legal-size abundance. <a href={methodsReferences.mortality}>FAO background on catch curves</a></p>
      </details>
    </section>
  );
}
