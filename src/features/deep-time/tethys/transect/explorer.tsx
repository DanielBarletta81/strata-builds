import { faciesSettings, targetMa, transectEvidence, transectSources, type TransectRecord } from './evidence';
import { ageCoverage, coverageLabels } from './model';
import styles from './transect.module.css';

function RecordInspector({ record }: { record: TransectRecord }) {
  const coverage = ageCoverage(record.age);
  const primary = transectSources[record.references[0].source];
  return (
    <article className={styles.inspector} aria-labelledby="transect-record-title" data-transect-record={record.id}>
      <header>
        <div className={styles.locality}>{record.locality}</div>
        <h5 id="transect-record-title">{record.name}</h5>
      </header>
      <dl className={styles.reasoning}>
        <div data-kind="observed"><dt>Observed in the source</dt><dd>{record.observed}</dd></div>
        <div data-kind="interpreted"><dt>Geological interpretation</dt><dd>{record.interpreted}</dd></div>
        <div data-kind="unresolved"><dt>Still unresolved</dt><dd>{record.unresolved}</dd></div>
      </dl>
      <div className={styles.age}>
        <p><strong data-coverage={coverage}>{coverageLabels[coverage]}</strong><span>{record.age.label}</span></p>
        <p><strong>Geographic restoration unavailable</strong><span>{record.missing}</span></p>
      </div>
      <p className={styles.cite}><a href={primary.url}>{primary.citation}</a><span>{record.references[0].locator}</span></p>
      <details key={record.id} className={styles.details}>
        <summary>Stratigraphy, dating and source rights</summary>
        <dl>
          <dt>Stratigraphic unit and position</dt><dd>{record.unit}. {record.position}</dd>
          <dt>Dating method</dt><dd>{record.age.method}</dd>
          <dt>Age uncertainty</dt><dd>{record.age.uncertainty}</dd>
          <dt>Restoration needed</dt><dd>{record.placement.requirement}</dd>
        </dl>
        <ul>
          {record.references.map(({ source, locator }) => {
            const { url, citation, access, rights } = transectSources[source];
            return <li key={source}><a href={url}>{citation}</a><span>{locator} · {access}. {rights}</span></li>;
          })}
        </ul>
      </details>
    </article>
  );
}

export function TransectExplorer({ record, onSelect }: { record: TransectRecord; onSelect: (record: TransectRecord) => void }) {
  const candidates = transectEvidence.filter(({ setting }) => setting === record.setting);
  const activeSetting = faciesSettings.find(({ id }) => id === record.setting);
  return (
    <section className={styles.transect} aria-labelledby="transect-heading">
      <header className={styles.intro}>
        <h4 id="transect-heading">Comparative facies transect</h4>
        <p>Compare three localities through the rocks they preserve. Their ages are checked against {targetMa} Ma. The illustrative textures show rock types. Column order expresses a conceptual relationship and carries no scale for distance, water depth or bed thickness.</p>
      </header>
      <div className={styles.settings} role="group" aria-label="Depositional environments">
        {faciesSettings.map((setting) => {
          const representative = transectEvidence.find(({ setting: id }) => id === setting.id);
          return (
            <button key={setting.id} type="button" aria-pressed={record.setting === setting.id} data-setting={setting.id}
              onClick={() => { if (representative && record.setting !== setting.id) onSelect(representative); }}>
              <span className={styles.swatch} aria-hidden="true" />
              <strong>{setting.title}</strong>
              <span>{setting.locality}</span>
            </button>
          );
        })}
      </div>
      <p className={styles.connections}><strong>Conceptual relationships</strong><span>Carbonate produced on a platform can feed slope deposits. Fine sediment and remains of plankton can settle in a basin. These localities have no demonstrated sediment pathway at {targetMa} Ma.</span></p>
      <div className={styles.workspace}>
        <aside className={styles.options} aria-label="Observations to inspect">
          <h5>{activeSetting?.title}</h5>
          <p>{activeSetting?.summary}</p>
          <div className={styles.records} role="group" aria-label="Reported observations">
            {candidates.map((entry) => (
              <button key={entry.id} type="button" aria-pressed={entry.id === record.id} onClick={() => onSelect(entry)}>{entry.name}</button>
            ))}
          </div>
        </aside>
        <RecordInspector record={record} />
      </div>
      <p role="status" className={styles.visuallyHidden}>{record.name} selected. {coverageLabels[ageCoverage(record.age)]}.</p>
    </section>
  );
}
