'use client';

import { useState } from 'react';
import { catchCurveAudit, catchCurveTableRecord, photoReceipts, printedFitAges, selectedCatchCurve, type CatchCurveFigure } from './catch-curves';
import { figure4AuditFor } from './figure4-audit';
import { Figure4UncertaintyInspector } from './figure4-uncertainty-inspector';
import { methodsReferences, mortalityRowId, report } from './report';
import styles from './bass.module.css';

export function CatchCurveLaboratory({ figures }: { figures: readonly CatchCurveFigure[] }) {
  const [selectedId, setSelectedId] = useState(figures[0]?.id ?? '');
  const figure = selectedCatchCurve(figures, selectedId);
  const pilot = figure && figure4AuditFor(figure);

  return (
    <section className={styles.panel} id="catch-curves" aria-labelledby="catch-title">
      <header className={styles.sectionHeader}>
        <p className={styles.kicker}>Historical figures · reported estimates</p>
        <h2 id="catch-title">Catch Curve Laboratory</h2>
        <p>Compare the printed mortality annotations from the 2003 report with their Table 1 estimates.</p>
      </header>
      {figure ? (
        <>
          <div className={styles.instrument}>
            <div className={styles.figureControl}>
              <label htmlFor="bass-catch-figure">Catch-curve figure</label>
              <select id="bass-catch-figure" value={figure.id} onChange={(event) => setSelectedId(event.target.value)}>
                {figures.map(({ period, method, id }) => (
                  <option key={id} value={id}>{period} · {method}</option>
                ))}
              </select>
            </div>
            <CatchCurveReadout figure={figure} />
          </div>
          {pilot && <Figure4UncertaintyInspector audit={pilot} />}
          <CatchCurveProvenance figure={figure} />
        </>
      ) : <p className={styles.notice} role="status">No verified catch-curve figures are available. The historical Table 1 estimates remain available above.</p>}
      <details className={styles.disclosure}>
        <summary>How to read a catch curve</summary>
        <p>A catch curve plots the natural log of catch frequency against age. Younger fish can be underrepresented until they become vulnerable to the sampling gear. The fitted descending ages should be well represented by the gear and have broadly comparable recruitment across year classes.</p>
        <p>The Results specifies ages 3–10. The photographed text gives no justification for those endpoints. Under a constant annual mortality rate, the negative fitted slope estimates instantaneous mortality Z for the fitted ages. Annual survival is S = exp(−Z), and annual mortality is A = 1 − S. Table 1 supplies the printed survival and mortality estimates.</p>
        <p>Differences in season, gear, recruitment and sampled ponds can change the apparent slope. A stocking effect would require a comparable design and evidence about changes in legal-size abundance. <a href={methodsReferences.mortality}>FAO background on catch curves</a></p>
        <p>Which original age-frequency tables and records of sampling effort by pond, season and gear would let us recalculate mortality and quantify its uncertainty? <a href="https://github.com/DanielBarletta81/strata-builds/blob/main/docs/RESEARCH_PHILOSOPHY.md">Strata research philosophy</a></p>
      </details>
    </section>
  );
}

function CatchCurveReadout({ figure }: { figure: CatchCurveFigure }) {
  const table = catchCurveTableRecord(figure);
  const ageRange = `${figure.ageTicks.join('–')} years`;

  return (
    <>
      <div aria-live="polite" aria-atomic="true" className={styles.figureSelection}>
        <h3>{figure.title}</h3>
        <p className={styles.context}>{figure.scope} estimate · {figure.season} · {figure.group} systems</p>
        <dl className={`${styles.estimates} ${styles.figureEstimates}`}>
          <div><dt>Figure annotation Z</dt><dd>{figure.printedZ}</dd></div>
          <div><dt>Table 1 estimate Z</dt><dd>{table?.z ?? '—'}</dd></div>
          <div><dt>Printed fit ages</dt><dd>{printedFitAges.join('–')}</dd></div>
        </dl>
      </div>
      {table ? (
        <p className={styles.note}><a href={`#${mortalityRowId(table)}`}>Inspect the corresponding Table 1 row</a></p>
      ) : <p className={styles.note}>The Table 1 match needs review.</p>}
      <dl className={styles.axisRanges}>
        <div><dt>Age ticks</dt><dd>{ageRange}{figure.ageUpperBoundCropped && ' visible. Upper bound cropped.'}</dd></div>
        <div><dt>ln frequency ticks</dt><dd>{figure.lnFrequencyTicks.join('–')}</dd></div>
      </dl>
      <p className={styles.notice}>Figure metadata verified. Plot reconstruction awaits independent coordinate extraction and validation.{table && ' The figure prints Z to three decimals and Table 1 to two. Whether they come from the same fit remains unverified.'}</p>
    </>
  );
}

function CatchCurveProvenance({ figure }: { figure: CatchCurveFigure }) {
  const receipt = photoReceipts[figure.sourceFile];

  return (
    <details className={styles.disclosure}>
      <summary>Catch-curve source inspector</summary>
      <dl className={styles.figureSource}>
        <div><dt>Report</dt><dd>{report.reference} · {report.publicationDate}</dd></div>
        <div><dt>Photograph</dt><dd>{figure.sourceFile} · Original kept in the private archive</dd></div>
        <div><dt>SHA-256</dt><dd><code>{receipt.sha256}</code></dd></div>
        <div><dt>Plot locator</dt><dd>{figure.captionNumber && `${figure.captionNumber}. `}{figure.locator}</dd></div>
        <div><dt>Audit</dt><dd>Metadata verified <time dateTime={catchCurveAudit.reviewDate}>{catchCurveAudit.reviewDate}</time>. Photograph reuse rights remain unresolved.</dd></div>
        <div><dt>Digitization review</dt><dd>{figure.legibility}</dd></div>
        <div><dt>Method used here</dt><dd>Direct transcription from the verified photograph. Point extraction requires perspective correction, labeled tick calibration and an independent reading.</dd></div>
      </dl>
    </details>
  );
}
