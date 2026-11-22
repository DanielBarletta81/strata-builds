'use client';

import { useState, type KeyboardEvent } from 'react';
import { catchCurveSourceStates, evidenceLayerForKey, evidenceLayers, type EvidenceLayer } from './catch-curve-evidence';
import { catchCurveAudit, catchCurveTableRecord, photoReceipts, printedFitAges, selectedCatchCurve, type CatchCurveFigure } from './catch-curves';
import { figure4AuditFor } from './figure4-audit';
import { Figure4UncertaintyInspector } from './figure4-uncertainty-inspector';
import { methodsReferences, mortalityRowId, report } from './report';
import styles from './bass.module.css';

const researchPhilosophy = 'https://github.com/DanielBarletta81/strata-builds/blob/main/docs/RESEARCH_PHILOSOPHY.md';

export function CatchCurveLaboratory({ figures }: { figures: readonly CatchCurveFigure[] }) {
  const [selectedId, setSelectedId] = useState(figures[0]?.id ?? '');
  const [activeLayer, setActiveLayer] = useState<EvidenceLayer>('published');
  const figure = selectedCatchCurve(figures, selectedId);

  function moveLayer(event: KeyboardEvent<HTMLButtonElement>, current: EvidenceLayer) {
    const next = evidenceLayerForKey(current, event.key);
    if (next === undefined) return;

    event.preventDefault();
    event.currentTarget.parentElement?.querySelector<HTMLButtonElement>(`#bass-tab-${next}`)?.focus();
  }

  return (
    <section className={`${styles.panel} ${styles.laboratory}`} id="catch-curves" aria-labelledby="catch-title">
      <header className={styles.labHeader}>
        <h2 id="catch-title">Catch Curve Laboratory</h2>
        <p>Compare published mortality estimates and inspect the evidence behind them.</p>
      </header>
      {figure ? (
        <div className={styles.labLayout}>
          <aside className={styles.figureRegister} aria-label="Figure register">
            <label htmlFor="bass-catch-figure">Catch-curve figure</label>
            <select id="bass-catch-figure" value={figure.id} onChange={(event) => setSelectedId(event.target.value)}>
              {figures.map(({ period, method, id }) => (
                <option key={id} value={id}>{period} · {method}</option>
              ))}
            </select>
            <dl className={styles.registerFields}>
              <div><dt>Sampling group</dt><dd>{figure.group} systems</dd></div>
              <div><dt>Estimate</dt><dd>{figure.scope} · {figure.season}</dd></div>
              <div><dt>Source photograph</dt><dd>{figure.sourceFile}</dd></div>
            </dl>
          </aside>

          <div className={styles.labWorkspace}>
            <div className={styles.layerTabs} role="tablist" aria-label="Evidence layers">
              {evidenceLayers.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  id={`bass-tab-${id}`}
                  role="tab"
                  aria-selected={activeLayer === id}
                  aria-controls={`bass-layer-${id}`}
                  tabIndex={activeLayer === id ? 0 : -1}
                  onFocus={() => setActiveLayer(id)}
                  onClick={() => setActiveLayer(id)}
                  onKeyDown={(event) => moveLayer(event, id)}
                >
                  {label}
                </button>
              ))}
            </div>
            {evidenceLayers.map(({ id }) => (
              <div
                key={id}
                className={styles.layerPanel}
                id={`bass-layer-${id}`}
                role="tabpanel"
                aria-labelledby={`bass-tab-${id}`}
                tabIndex={0}
                hidden={activeLayer !== id}
              >
                {id === 'published' && <CatchCurveReadout figure={figure} />}
                {id === 'source-quality' && <CatchCurveSourceQuality figure={figure} />}
                {id === 'open-questions' && <CatchCurveQuestions figure={figure} />}
              </div>
            ))}
            <CatchCurveProvenance figure={figure} />
            <CatchCurveMethod />
          </div>
        </div>
      ) : <p className={styles.notice} role="status">No verified catch-curve figures are available. The historical Table 1 estimates are available in the Mortality Observatory.</p>}
    </section>
  );
}

function CatchCurveReadout({ figure }: { figure: CatchCurveFigure }) {
  const table = catchCurveTableRecord(figure);

  return (
    <div className={styles.layerGrid}>
      <div className={styles.evidenceCard}>
        <div aria-live="polite" aria-atomic="true">
          <h3>{figure.title}</h3>
          <p className={styles.context}>{figure.scope} estimate · {figure.season} · {figure.group} systems</p>
          <dl className={styles.evidenceReadings}>
            <div><dt>Figure annotation Z</dt><dd>{figure.printedZ}</dd></div>
            <div><dt>Table 1 estimate Z</dt><dd>{table?.z ?? '—'}</dd></div>
            <div><dt>Printed fit ages</dt><dd>{printedFitAges.join('–')} <small>years</small></dd></div>
          </dl>
        </div>
        <p className={styles.readoutNote}>Z is the instantaneous mortality rate estimated by the catch curve, expressed per year.</p>
        {table ? (
          <p className={styles.recordLink}><a href={`#${mortalityRowId(table)}`}>Inspect the corresponding Table 1 row</a></p>
        ) : <p className={styles.readoutNote}>The Table 1 match needs review.</p>}
      </div>
      <aside className={styles.contextCard} aria-labelledby="bass-printed-record">
        <h3 id="bass-printed-record">Printed record</h3>
        <p>{report.reference}<br />{report.publicationDate}</p>
        <p>{figure.captionNumber && `${figure.captionNumber}. `}{figure.locator}</p>
        {table && <p className={styles.caution}>The two values retain their printed precision. Whether they come from the same fit remains unverified.</p>}
      </aside>
    </div>
  );
}

function CatchCurveSourceQuality({ figure }: { figure: CatchCurveFigure }) {
  const pilot = figure4AuditFor(figure);
  const ageRange = `${figure.ageTicks.join('–')} years`;

  return (
    <>
      <div className={styles.layerGrid}>
        <div className={styles.evidenceCard}>
          <h3>What the photograph supports</h3>
          <p className={styles.context}>{figure.title}</p>
          <dl className={styles.sourceStates}>
            {catchCurveSourceStates(figure).map(({ label, status }) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd className={styles.sourceBadge} data-status={status}>{status}</dd>
              </div>
            ))}
          </dl>
        </div>
        <aside className={`${styles.contextCard} ${styles.coordinateLimit}`} aria-labelledby="bass-coordinate-limit">
          <h3 id="bass-coordinate-limit">Coordinates withheld</h3>
          <p>{pilot
            ? 'Page curvature and marks touching the zero axis prevent repeatable coordinate extraction from the available photograph.'
            : figure.legibility}</p>
          <dl className={styles.printedAxes}>
            <div><dt>Age ticks</dt><dd>{ageRange}{figure.ageUpperBoundCropped && ' visible. Upper bound cropped.'}</dd></div>
            <div><dt>ln frequency ticks</dt><dd>{figure.lnFrequencyTicks.join('–')}</dd></div>
          </dl>
          <p className={styles.context}>Independent coordinate readings are needed before a plot can be shown.</p>
        </aside>
      </div>
      {pilot && <Figure4UncertaintyInspector audit={pilot} />}
    </>
  );
}

function CatchCurveQuestions({ figure }: { figure: CatchCurveFigure }) {
  const pilot = figure4AuditFor(figure);

  return (
    <div className={styles.layerGrid}>
      <div className={styles.evidenceCard}>
        <h3>What remains unresolved?</h3>
        <p className={styles.context}>{figure.title}</p>
        <dl className={styles.evidenceQuestions}>
          <div>
            <dt>Do the figure annotation and Table 1 estimate come from the same fit?</dt>
            <dd>The original regression records would establish how each value was calculated.</dd>
          </div>
          <div>
            <dt>What are the original age frequencies?</dt>
            <dd>Age counts with their sampling records would allow a check against the printed figure.</dd>
          </div>
          <div>
            <dt>How might gear selectivity affect the slope?</dt>
            <dd>Comparable age and effort records by gear, season, and pond could help distinguish sampling effects.</dd>
          </div>
        </dl>
      </div>
      <aside className={styles.contextCard} aria-labelledby="bass-next-evidence">
        <h3 id="bass-next-evidence">Next evidence to look for</h3>
        {pilot ? (
          <><p><strong>Could a flat scan support repeatable extraction?</strong></p><p>Figure 4 needs an uncropped scan showing both axes, every plotted symbol, the regression line, and the caption. Two independent readings could then be compared.</p></>
        ) : <p>Locate the age-frequency and sampling-effort records for this period and gear.</p>}
        <p className={styles.recordLink}><a href={researchPhilosophy}>Strata research philosophy</a></p>
      </aside>
    </div>
  );
}

function CatchCurveMethod() {
  return (
    <details className={styles.disclosure}>
      <summary>How to read a catch curve</summary>
      <p>A catch curve plots the natural log of catch frequency against age. Younger fish can be underrepresented until they become vulnerable to the sampling gear. The fitted descending ages should be well represented by the gear and have broadly comparable recruitment across year classes.</p>
      <p>The Results specifies ages 3–10. The photographed text gives no justification for those endpoints. Under a constant annual mortality rate, the negative fitted slope estimates instantaneous mortality Z for the fitted ages. Annual survival is S = exp(−Z), and annual mortality is A = 1 − S. Table 1 supplies the printed survival and mortality estimates.</p>
      <p>Differences in season, gear, recruitment and sampled ponds can change the apparent slope. A stocking effect would require a comparable design and evidence about changes in legal-size abundance. <a href={methodsReferences.mortality}>FAO background on catch curves</a></p>
    </details>
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
