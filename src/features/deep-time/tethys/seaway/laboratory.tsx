'use client';

import { useReducer } from 'react';
import TethysMap from '../map';
import { formatCoordinates } from '../model';
import { oaeEstimates, seawayEvidence, seawayQuestions, seawaySources } from './evidence';
import frameAudit from './frame-audit.json';
import { assessAge, initialInspection, inspect, type Evidence, type Layer } from './model';
import styles from './seaway.module.css';

const layers: { id: Layer; label: string }[] = [
  { id: 'plate', label: 'Plate Reconstruction' },
  { id: 'marine', label: 'Regional Marine Evidence' },
  { id: 'questions', label: 'Open Questions' },
];

function EvidenceSources({ record }: { record: Evidence }) {
  return (
    <details className={styles.sources}>
      <summary>Source locators and reuse rights</summary>
      <p>{record.locator}</p>
      <ul>
        {record.sources.map((id) => {
          const source = seawaySources[id];
          return (
            <li key={id}>
              <a href={source.url}>{source.citation}</a>
              <p>{source.rights} {'licenseUrl' in source && <a href={source.licenseUrl}>License text</a>}</p>
            </li>
          );
        })}
      </ul>
    </details>
  );
}

function AgeComparison({ ageMa }: { ageMa: number }) {
  const position = (age: number) => 100 * (112 - age) / (112 - 110.9);
  return (
    <figure className={styles.ageComparison}>
      <figcaption><strong>Two OAE 1b horizon estimates</strong> · Ramos et al. (2024), conclusions</figcaption>
      <div className={styles.ageChart} aria-hidden="true">
        <div className={styles.axisLabels}><span>112 Ma</span><span>110.9 Ma</span></div>
        <div className={styles.horizons}>{oaeEstimates.map(({ label }) => <span key={label}>{label}</span>)}</div>
        <div className={styles.ageAxis}>
          <div className={styles.snapshot} style={{ left: position(ageMa) + '%' }} />
          {oaeEstimates.map(({ label, ageMa: age, uncertaintyMa }) => {
            const older = position(age + uncertaintyMa);
            const younger = position(age - uncertaintyMa);
            return <div className={styles.ageTrack} key={label}><span className={styles.ageBar} style={{ left: older + '%', width: (younger - older) + '%' }} /></div>;
          })}
        </div>
      </div>
      <ul className={styles.values}>
        {oaeEstimates.map(({ label, ageMa, uncertaintyMa }) => <li key={label}>{label} <strong>{ageMa.toFixed(2)} ± {uncertaintyMa.toFixed(2)} Ma</strong></li>)}
        <li className={styles.mapAge}>Map snapshot <strong>{ageMa} Ma</strong></li>
      </ul>
      <p>The bars show the authors’ quoted age uncertainty. Their Table 3 gives different Leenhardt estimates, 111.40–111.44 Ma. The difference remains unresolved here.</p>
    </figure>
  );
}

function EvidenceTable({ record, select }: { record: Evidence; select: (record: Evidence) => void }) {
  return (
    <div className={styles.registry}>
      <h4 id="seaway-registry">Regional records</h4>
      <table aria-labelledby="seaway-registry">
        <thead><tr><th scope="col">Locality or model</th><th scope="col">Published age coverage</th></tr></thead>
        <tbody>
          {seawayEvidence.map((entry) => (
            <tr key={entry.id} data-selected={entry.id === record.id}>
              <th scope="row"><button type="button" aria-pressed={entry.id === record.id} onClick={() => select(entry)}>{entry.name}</button></th>
              <td>{entry.age.label}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <a className={styles.jump} href="#seaway-readout">Read selected evidence ↓</a>
    </div>
  );
}

function MarineInspector({ record, ageMa }: { record: Evidence; ageMa: number }) {
  const context = record.mapContext === 'apulia' ? 'Apulia' : 'Adria';
  return (
    <article className={styles.panel}>
      <div id="seaway-readout" className={styles.readout} tabIndex={-1} data-seaway-record={record.id} data-age-coverage={assessAge(record, ageMa)}>
        <h4>{record.name}</h4>
        <p className={styles.locality}>{record.frame}</p>
        <dl className={styles.findings}>
          <div data-kind="observation"><dt>Reported evidence</dt><dd>{record.observation}</dd></div>
          <div data-kind="interpretation"><dt>Geological interpretation</dt><dd>{record.interpretation}</dd></div>
          <div data-kind="unknown"><dt>Age and location limits</dt><dd>{record.ageLimit} {record.placement.reason}</dd></div>
        </dl>
        <p className={styles.modelContext}><strong>Plate model comparison</strong> {record.mapContext
          ? `The ${context} checkpoint gives regional tectonic context. Its coordinates belong to the model feature. The locality remains unplaced.`
          : 'The Phase 2 map has no verified checkpoint for this section. The locality remains unplaced.'}</p>
        {record.id === 'poggio-le-guaine' && <AgeComparison ageMa={ageMa} />}
        {record.id === 'greater-adria' && (
          <div className={styles.ageComparison}>
            <p><strong>Apulia checkpoint in both Africa-fixed frames</strong></p>
            <p>At {frameAudit.ageMa} Ma, anchor plate {frameAudit.anchorPlate}. One shared present-day model test point separates by <strong>{frameAudit.separationDegrees.toFixed(2)}°</strong>.</p>
            <ul className={styles.values}>
              <li>Phase 2 · {formatCoordinates(frameAudit.phase2AfricaFixedLonLat)}</li>
              <li>Regional · {formatCoordinates(frameAudit.regionalAfricaFixedLonLat)}</li>
            </ul>
            <p>This difference applies to one modeled checkpoint. Shoreline position and the locations of geological records remain unresolved. <a href={frameAudit.regionalArchive.url}>Regional model source archive</a></p>
          </div>
        )}
      </div>
      <EvidenceSources key={record.id} record={record} />
    </article>
  );
}

function OpenQuestions({ record }: { record: Evidence }) {
  return (
    <article className={styles.panel}>
      <div id="seaway-readout" className={styles.readout} tabIndex={-1} data-seaway-record={record.id}>
        <h4>{record.name}</h4>
        <p className={styles.next}><strong>Evidence to seek</strong> {record.next}</p>
      </div>
      <dl className={styles.questions}>
        {seawayQuestions.map(({ title, needed }) => <div key={title}><dt>{title}</dt><dd>{needed}</dd></div>)}
      </dl>
      <EvidenceSources key={record.id} record={record} />
      <details className={styles.sources}>
        <summary>How restricted basins can change</summary>
        <p>A shallow sill can limit exchange. Density stratification can slow vertical mixing, and oxygen can fall when respiration consumes it faster than renewal supplies it.</p>
        <p>Water exchange and bottom oxygen affect sediment preservation. Light, water chemistry and sediment supply influence carbonate production. Passage geometry and currents can also affect dispersal between marine habitats.</p>
        <p>These are general mechanisms. Regional currents, temperatures, salinities, oxygen concentrations and water depths at 111 Ma remain unconstrained here.</p>
        <ul>
          {[seawaySources.renewal, seawaySources.sediment, seawaySources.facies].map((source) => <li key={source.url}><a href={source.url}>{source.citation}</a></li>)}
        </ul>
      </details>
    </article>
  );
}

export default function SeawayLaboratory({ ageMa }: { ageMa: number }) {
  const [inspection, dispatch] = useReducer(inspect, initialInspection);
  const { layer, checkpoint, evidence } = inspection;
  const select = (record: Evidence) => dispatch({ type: 'evidence', evidence: record });

  return (
    <section className={styles.laboratory} aria-labelledby="seaway-heading">
      <header>
        <h3 id="seaway-heading">Ancient Seaway Laboratory</h3>
        <p>Adria–Apulia · What do the rocks reveal about the water between these fragments?</p>
      </header>
      <div className={styles.layers} role="group" aria-label="Seaway evidence layers">
        {layers.map(({ id, label }) => (
          <button key={id} type="button" aria-pressed={layer === id} onClick={() => dispatch({ type: 'layer', layer: id })}>{label}</button>
        ))}
      </div>
      {layer === 'plate' ? (
        <TethysMap id={checkpoint} select={(id) => dispatch({ type: 'checkpoint', id })} />
      ) : (
        <>
          <p className={styles.coverage}>Regional evidence is displayed by published locality. No 111 Ma shoreline, basin-depth layer or restored locality markers have been validated.</p>
          <div className={styles.layout}>
            <EvidenceTable record={evidence} select={select} />
            {layer === 'marine' ? <MarineInspector record={evidence} ageMa={ageMa} /> : <OpenQuestions record={evidence} />}
          </div>
          <p role="status" className={styles.srOnly}>Selected regional evidence: {evidence.name}.</p>
        </>
      )}
    </section>
  );
}
