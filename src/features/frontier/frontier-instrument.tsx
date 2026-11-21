import type { CoverageFinding } from '../evidence/model';
import { loadInvestigation } from './investigation';
import { sourceLinks, sources, stations } from './sources';
import styles from './frontier.module.css';

type Investigation = ReturnType<typeof loadInvestigation>;
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const count = new Intl.NumberFormat('en-US');
const verification: Record<CoverageFinding['verification'], string> = {
  confirmed_within_source_scope: 'Confirmed within source scope',
  apparent_requires_investigation: 'Apparent · requires review',
  cannot_determine: 'Cannot determine from available records',
};
const categories: Record<CoverageFinding['type'], string> = {
  confirmed_missing_observation: 'Missing in the source',
  planned_seasonal_non_sampling: 'Outside the planned season',
  source_not_yet_inspected: 'Source awaiting inspection',
  known_dataset_inaccessible: 'Records inaccessible',
  uncertain_monitoring_continuation: 'Continuation unknown',
  incompatible_sampling_methods: 'Incompatible methods',
  conflicting_records: 'Conflicting source records',
  potentially_outdated_findings: 'Replication assessment',
};

function CoverageTimeline({ data }: { data: Investigation }) {
  return (
    <section className={styles.timeline} aria-labelledby="frontier-coverage">
      <h2 id="frontier-coverage">Surface temperature coverage</h2>
      <div className={styles.series}>
        <h3>Station II · archive weeks</h3>
        <p>Nominally weekly surface bucket samples. Values count archive weeks with a reported temperature.</p>
        <ol className={styles.years} aria-label="Station II archive week counts">
          {data.years.map(({ year, published, reported }) => (
            <li key={year} data-status={reported === 0 ? 'gap' : 'reported'}>
              <span>{year}</span>
              <strong>{reported ?? 'Unknown'} / {published}</strong>
              <small>{reported === 0 ? 'Temperature gap' : 'Weeks with a value'}</small>
            </li>
          ))}
        </ol>
      </div>
      <div className={styles.series}>
        <h3>Bullock Reach · 2012 deployment</h3>
        <p>May 17–November 26. The in-season count uses full days from May 18 through November 25.</p>
        <ol className={styles.months} aria-label="Bullock Reach 2012 monthly coverage">
          {data.months.map((month) => {
            const status = month.unknownSlots ? 'unknown' : month.blanks.length ? 'gap' : month.expected ? 'reported' : 'outside';
            return (
              <li key={month.month} data-status={status}>
                <abbr title={months[month.month - 1]}>{months[month.month - 1].slice(0, 3)}</abbr>
                <span>
                  {status === 'outside' ? 'Off season' : status === 'unknown' ? 'Unknown' :
                    month.blanks.length ? month.blanks.length + (month.blanks.length === 1 ? ' blank' : ' blanks') : 'Reported'}
                </span>
              </li>
            );
          })}
        </ol>
        <p className={styles.total}><strong>{count.format(data.reported)} / {count.format(data.expected)}</strong> full-day grid slots report temperature.</p>
        <details className={styles.monthCounts}>
          <summary>Inspect monthly counts</summary>
          <table className={styles.gridTable}>
            <caption>Bullock Reach surface temperature, full deployment days</caption>
            <thead><tr><th scope="col">Month</th><th scope="col">Expected</th><th scope="col">Reported</th><th scope="col">Blank</th></tr></thead>
            <tbody>
              {data.months.map((month) => (
                <tr key={month.month}>
                  <th scope="row">{months[month.month - 1]}</th>
                  <td>{month.expected ? count.format(month.expected) : '—'}</td>
                  <td>{month.expected && !month.unknownSlots ? count.format(month.reported) : '—'}</td>
                  <td>{month.expected && !month.unknownSlots ? month.blanks.length : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>Off-season months have no expected slots in this review.</p>
        </details>
      </div>
    </section>
  );
}

function Locator() {
  const plotted = [stations.bullock, stations.plankton];
  const x = (lon: number) => 32 + (lon + 71.57) * 520;
  const y = (lat: number) => 25 + (41.78 - lat) * 575;

  return (
    <section className={styles.panel} aria-labelledby="frontier-locator">
      <h2 id="frontier-locator">Study sites</h2>
      <figure className={styles.locator}>
        <svg viewBox="0 0 320 210" role="img" aria-labelledby="frontier-map-title frontier-map-description">
          <title id="frontier-map-title">Locator for the two Narragansett Bay sources</title>
          <desc id="frontier-map-description">Bullock Reach is in the upper bay, north of Station II in the West Passage. The plotted positions use the reference records listed below.</desc>
          <g aria-hidden="true">
            {[41.75, 41.65, 41.55].map((lat) => (
              <line key={lat} x1="42" x2="281" y1={y(lat)} y2={y(lat)} className={styles.mapGrid} />
            ))}
            {[-71.5, -71.4, -71.3, -71.2].map((lon) => (
              <g key={lon}>
                <line x1={x(lon)} x2={x(lon)} y1="23" y2="176" className={styles.mapGrid} />
                <text x={x(lon)} y="194" textAnchor="middle">{Math.abs(lon)}° W</text>
              </g>
            ))}
            <text x="239" y="19">North ↑</text>
            {plotted.map((station, index) => (
              <g key={station.id} data-site-id={station.id}>
                <circle cx={x(station.lon)} cy={y(station.lat)} r="6" className={index ? styles.stationII : styles.bullock} />
                <text x={x(station.lon) + 14} y={y(station.lat) + 4}>{station.name}</text>
              </g>
            ))}
          </g>
        </svg>
        <figcaption>Schematic locator in decimal degrees. The source datum is unconfirmed.</figcaption>
      </figure>
      <dl className={styles.sites}>
        {plotted.map(({ id, name, lat, lon }) => (
          <div key={id}>
            <dt>{name}</dt><dd>{lat.toFixed(5)}° N · {Math.abs(lon).toFixed(5)}° W</dd>
          </div>
        ))}
      </dl>
      <p className={styles.small}>The Bullock Reach pin uses the archive workbook position. <a href="#location-conflict">Review the reported coordinate difference</a>.</p>
      <div className={styles.compatibility}>
        <h3>Same variable, different methods</h3>
        <p>Both report °C. A fixed near-surface sonde and a weekly surface bucket at a different site support separate coverage reviews.</p>
        <a href="#unequal-methods">Inspect the comparison limits</a>
      </div>
    </section>
  );
}

function Findings({ data }: { data: Investigation }) {
  return (
    <section className={styles.panel} aria-labelledby="frontier-findings">
      <h2 id="frontier-findings">Evidence findings</h2>
      {data.findings.map((finding) => (
        <details className={styles.disclosure} id={finding.id} key={finding.id}>
          <summary>
            <span>{finding.title}</span>
            <small>{categories[finding.type]} · {verification[finding.verification]}</small>
          </summary>
          <dl className={styles.findingDetails}>
            <dt>Scope</dt><dd>{finding.scope.station} · {finding.scope.location} · {finding.scope.period.start}
              {finding.scope.period.endInclusive !== finding.scope.period.start && ' to ' + finding.scope.period.endInclusive}</dd>
            <dt>Direct evidence</dt><dd>{finding.directEvidence}</dd>
            <dt>Detection rule</dt><dd>{finding.detection} {finding.coverageBasis}</dd>
            <dt>Assumptions</dt><dd>{finding.assumptions}</dd>
            <dt>What remains unresolved</dt><dd>{finding.limitation}</dd>
            <dt>Candidate explanations or alternatives</dt><dd>{finding.alternatives}</dd>
            <dt>Next evidence to check</dt><dd>{finding.nextAction}</dd>
          </dl>
          {finding.id === 'bullock-in-season' && (
            <table className={styles.gridTable}>
              <caption>Blank surface-temperature cells in the edited workbook</caption>
              <thead><tr><th scope="col">Workbook date</th><th scope="col">Time</th><th scope="col">BR sheet row</th></tr></thead>
              <tbody>
                {data.blanks.map(({ date, time, row }) => (
                  <tr key={row}><th scope="row">{date}</th><td>{time}</td><td>{row}</td></tr>
                ))}
              </tbody>
            </table>
          )}
          <ul className={styles.recordLinks}>
            {finding.sources.map((record) => (
              <li key={record.url}>
                <a href={record.url}>{record.url === sourceLinks.archive ? 'RIDEM 2012 archive' :
                  record.url === sourceLinks.report ? 'NBC 2012 monitoring report' :
                  record.url === sourceLinks.planktonFile ? 'Station II source CSV' :
                  record.url === sourceLinks.planktonProject ? 'URI series site' : 'BCO-DMO dataset metadata'}</a>
                {record.retrievedAt && <span> · retrieved <time dateTime={record.retrievedAt}>{record.retrievedAt.slice(0, 10)} UTC</time></span>}
              </li>
            ))}
          </ul>
        </details>
      ))}
    </section>
  );
}

export function FrontierInstrument({ data }: { data: Investigation }) {
  return (
    <>
      <div className={styles.dashboard}><CoverageTimeline data={data} /><Locator /></div>
      <Findings data={data} />
      <section className={styles.panel} aria-labelledby="frontier-next">
        <h2 id="frontier-next">What would resolve this?</h2>
        <dl className={styles.questions}>
          <dt>What is known?</dt>
          <dd>Station II’s provider documents a 2012 temperature gap. The edited Bullock Reach worksheet has {data.blanks.length} in-season blank cells, with out-of-water notes on the affected dates.</dd>
          <dt>What evidence is missing?</dt>
          <dd>The source of each B4 blank needs a raw-file and edit-log check. Station II’s temperature gap still needs a dated field or project record explaining the collection history.</dd>
          <dt>Hypotheses to test</dt>
          <dd>The B4 cells could be blank during retrieval or because values were excluded in editing. The notes support the first explanation at the date level. The scope of the Station II gap could differ across accessions.</dd>
          <dt>What evidence would distinguish them?</dt>
          <dd>Match raw timestamps to the field log and edited cells. Check for a Station II release with collection dates, method and depth before using any replacement series.</dd>
          <dt>Smallest next investigation</dt>
          <dd>Reconcile the two July 10 B4 surface slots at 09:30 and 09:45 with the same-day sonde log and the corresponding raw and edited files. Record the reason for each blank separately.</dd>
        </dl>
      </section>
      <section className={styles.panel} aria-labelledby="frontier-sources">
        <h2 id="frontier-sources">Source inventory</h2>
        <p className={styles.small}>The timeline uses the RIDEM workbook and the Station II CSV. Other inspected channels provide scope, methods or context.</p>
        {sources.map((source) => (
          <details key={source.name} className={styles.disclosure}>
            <summary><span>{source.name}</span><small>{source.status}</small></summary>
            <p><strong>{source.scope}</strong></p>
            <p>{source.details}</p>
            <p>{source.rights}</p>
            <ul className={styles.recordLinks}>{source.links.map(({ text, url }) => <li key={url}><a href={url}>{text}</a></li>)}</ul>
          </details>
        ))}
        <p className={styles.small}>Published coverage counts are derived from captured source files. Missing cells do not establish pollution, loss of monitoring, or a cause.</p>
      </section>
    </>
  );
}
