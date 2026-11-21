import Link from 'next/link';
import { bullockClaim, bullockRows, legacyEqual, stationClaim, stationMethodQuote, stationYears } from './cases';
import { outcomeLabels, type EvidenceRecord, type EvidenceSource, type ReconciliationClaim } from './model';
import { sources } from './sources';
import styles from './reconciliation.module.css';

function RecordValue({ record, rawNumber }: { record: EvidenceRecord | null; rawNumber?: number | null }) {
  if (!record) return <span className={styles.missing}>No row found</span>;

  if (record.status === 'derived') {
    return (
      <>
        <strong className={styles.derived}>{Number(record.originalValue).toFixed(2)} {record.unit}</strong>
        <small>Calculated · display rounded</small>
        <small>{record.locator}</small>
        <details className={styles.exactValue}>
          <summary aria-label={`Exact workbook value at ${record.locator}`}>Exact workbook value</summary>
          <small><code>{record.originalValue}</code> {record.unit}</small>
          {record.source.sha256 && <small>SHA-256 <code>{record.source.sha256}</code></small>}
        </details>
      </>
    );
  }

  return (
    <>
      <strong>{record.originalValue === null ? 'Blank' : `${record.originalValue} ${record.unit}`}</strong>
      {record.status === 'excluded' && <small>Edited exclusion marker</small>}
      <small>{record.locator}{rawNumber !== undefined && rawNumber !== null && ` · logger #${rawNumber}`}</small>
      {rawNumber !== undefined && <small>{record.time.split(' ')[1]} logger clock</small>}
    </>
  );
}

function SourceList({ entries }: { entries: { label: string; source: EvidenceSource }[] }) {
  return (
    <details className={styles.disclosure}>
      <summary>Source records and file fingerprints</summary>
      <ul className={styles.sources}>
        {entries.map(({ label, source }) => (
          <li key={label}>
            <a href={source.url}>{label}</a>
            <p>{source.provider} · {source.version}</p>
            {source.file && <p>{source.file}</p>}
            {source.sha256 && <p>SHA-256 <code>{source.sha256}</code></p>}
            {source.retrievedAt && <p>Retrieved <time dateTime={source.retrievedAt}>{source.retrievedAt}</time></p>}
            <p>{source.rights}</p>
          </li>
        ))}
      </ul>
    </details>
  );
}

function ClaimNotes({ claim }: { claim: ReconciliationClaim }) {
  return (
    <>
      <div className={styles.notes}>
        <section>
          <h3>Confirmed agreements</h3>
          <ul>{claim.supporting.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
        <section>
          <h3>Unresolved evidence</h3>
          <ul>{claim.conflicting.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
      </div>
      <details className={styles.disclosure}>
        <summary>Matching assumptions and open explanations</summary>
        <ul>{[...claim.assumptions, ...claim.alternatives].map((item) => <li key={item}>{item}</li>)}</ul>
      </details>
      <aside className={styles.next}>
        <h3>What evidence would settle this?</h3>
        <p>{claim.nextEvidence}</p>
      </aside>
    </>
  );
}

export function ReconciliationCaseFiles() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/frontier">Evidence Frontier</Link>
        <h1>Trace the missing measurements</h1>
        <p>Two Narragansett Bay case files. Follow records from collection through editing, correction, and publication.</p>
        <nav className={styles.jump} aria-label="Reconciliation cases">
          <a href="#bullock">Bullock Reach</a>
          <a href="#station-ii">Station II</a>
        </nav>
      </header>

      <article id="bullock" className={styles.caseFile} aria-labelledby="bullock-heading">
        <header className={styles.caseHeading}>
          <p>B4-S near-surface sonde · July 10, 2012</p>
          <h2 id="bullock-heading">Bullock Reach</h2>
          <span className={styles.status}>{outcomeLabels[bullockClaim.outcome]}</span>
          <p>{bullockClaim.question}</p>
        </header>
        <p className={styles.lede}>The corrected workbook contains calculated values for both blank cells. Neither reviewed raw export contains a matching temperature row for those slots.</p>

        <section aria-labelledby="bullock-trail">
          <h3 id="bullock-trail">Evidence trail</h3>
          <ol className={styles.trail}>
            <li><strong>09:16:04 logger</strong><span>Last reviewed raw row before the gap, record 20152.</span></li>
            <li><strong>09:30–09:45 field notes</strong><span>NBC lists the sonde as out of water. Deployment notes record retrieval at 09:30 and replacement at 09:35.</span></li>
            <li><strong>10:01:04 logger</strong><span>Next reviewed raw row, record 20153.</span></li>
            <li><strong>Edited and corrected releases</strong><span>Same grid cells have a blank in one product and a bold calculated value in the other.</span></li>
          </ol>
        </section>

        <section aria-labelledby="bullock-comparison">
          <h3 id="bullock-comparison">Raw → edited → corrected</h3>
          <p className={styles.context}>Grid labels use local standard time. Logger labels retain seconds and have no verified UTC offset. Temperatures are in °C.</p>
          <div className={styles.comparison}>
            {bullockRows.map(({ clock, raw, recordNumber, worksheet, edited, corrected, finding }) => (
              <section key={clock} className={edited.status === 'excluded' ? styles.target : styles.row} aria-label={`Grid slot ${clock}`}>
                <header>
                  <h4>{clock.slice(0, 5)}</h4>
                  <p>{finding}</p>
                </header>
                <dl>
                  <div><dt>Raw logger &amp; workbook</dt><dd>
                    <RecordValue record={raw} rawNumber={recordNumber} />
                    {worksheet && <small>{worksheet.locator}</small>}
                  </dd></div>
                  <div><dt>Edited</dt><dd><RecordValue record={edited} /></dd></div>
                  <div><dt>Corrected</dt><dd><RecordValue record={corrected} /></dd></div>
                </dl>
              </section>
            ))}
          </div>
          <p className={styles.context}>Adjacent rows match at a +64-second logger offset within this window. The edited-to-corrected match is direct for both target cells. Raw correspondence remains open beyond the reviewed exports.</p>
        </section>

        <ClaimNotes claim={bullockClaim} />
        <p className={styles.citations}><a href={sources.ridem.url}>RIDEM 2012 archive</a> · <a href={sources.nbcReport.url}>NBC methods and calibration report</a></p>
        <SourceList entries={[
          { label: 'Parent 2012 release', source: sources.ridem },
          { label: 'Bullock Reach raw logger text', source: sources.rawText },
          { label: 'Bullock Reach raw surface workbook', source: sources.rawWorkbook },
          { label: 'Edited workbook · BR and Notes', source: sources.edited },
          { label: 'Corrected workbook · BR and Notes', source: sources.corrected },
          { label: 'Surface deployment and QA notes', source: sources.field },
          { label: 'Network metadata · parameter code and production stages', source: sources.intro },
          { label: 'NBC report · methods, retrieval and calibration', source: sources.nbcReport },
        ]} />
      </article>

      <article id="station-ii" className={styles.caseFile} aria-labelledby="station-heading">
        <header className={styles.caseHeading}>
          <p>West Passage · BCO-DMO 874956 v1</p>
          <h2 id="station-heading">Station II</h2>
          <span className={styles.status}>{outcomeLabels[stationClaim.outcome]}</span>
          <p>{stationClaim.question}</p>
        </header>
        <p className={styles.lede}>The v1 archive has numeric temperatures in 1997 and 1999. The records confirm what was published. Their field provenance remains open.</p>

        <section aria-labelledby="station-trail">
          <h3 id="station-trail">Evidence trail</h3>
          <ol className={styles.trail}>
            <li><strong>1997 · Legacy workbook</strong><span>{legacyEqual} numeric values agree at the same 1997 year/week keys. Weeks 7 and 8 differ.</span></li>
            <li><strong>1999 · URI Physical Data</strong><span>Dated Station II entries give a separate lead for the values. A verified crosswalk to BCO-DMO is pending.</span></li>
            <li><strong>2022 · BCO-DMO v1 release</strong><span>The methodology lists the gaps alongside populated archive entries in two of the four years.</span></li>
            <li><strong>2025 · Latest date in URI copy</strong><span>The separate workbook includes Station II surface temperatures through January 13, 2025.</span></li>
          </ol>
        </section>

        <section aria-labelledby="station-comparison">
          <h3 id="station-comparison">Collection statement and archive presence</h3>
          <blockquote className={styles.quote}>
            <p>“{stationMethodQuote}”</p>
            <cite><a href={sources.stationMethods.url}>BCO-DMO v1, Methods &amp; Sampling</a></cite>
          </blockquote>
          <table className={styles.table}>
            <caption>Published Temperature_SURF fields by archive year</caption>
            <thead><tr><th scope="col">Year</th><th scope="col">Numeric / weeks</th><th scope="col">Relation to methods</th></tr></thead>
            <tbody>
              {stationYears.map(({ year, populated, total }) => (
                <tr key={year}><th scope="row">{year}</th><td>{populated} / {total}</td>
                  <td className={populated ? styles.derived : styles.missing}>{populated ? 'Presence conflicts' : 'All nd · agrees'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className={styles.context}>Counts use the original archive year and week labels. Numeric presence is verified. The collection date and origin of the disputed entries remain unverified.</p>
          {stationYears.map(({ year, records, populated }) => (
            <details key={year} className={styles.disclosure}>
              <summary>{year} week records · {populated} numeric of {records.length}</summary>
              <table className={styles.table}>
                <caption>{year} Temperature_SURF record locators</caption>
                <thead><tr><th scope="col">Week</th><th scope="col">CSV line</th><th scope="col">Field state</th></tr></thead>
                <tbody>
                  {records.map(({ row, week, field }) => (
                    <tr key={week}><th scope="row">{week}</th><td>{row}</td>
                      <td>{field === 'nd' ? 'nd · missing' : 'Numeric · origin unverified'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
          ))}
        </section>

        <ClaimNotes claim={stationClaim} />
        <p className={styles.citations}><a href={sources.stationCsv.url}>BCO-DMO v1 CSV</a> · <a href={sources.legacy.url}>Legacy temperature ZIP</a> · <a href="https://web.uri.edu/gso/research/plankton/data/">URI time-series data</a></p>
        <SourceList entries={[
          { label: 'BCO-DMO v1 dataset and collection statement', source: sources.stationMethods },
          { label: 'Captured v1 dataset description PDF', source: sources.stationDescription },
          { label: 'Published year/week archive', source: sources.stationCsv },
          { label: 'Legacy Station II temperature workbook', source: sources.legacy },
          { label: 'URI Physical Data workbook', source: sources.uriPhysical },
          { label: 'Thibodeau et al. 2024', source: sources.paper },
          { label: 'Companion publication input files', source: sources.analysis },
          { label: 'Brown ERDDAP representation', source: sources.brown },
        ]} />
      </article>
    </main>
  );
}
