'use client';

import { lazy, Suspense, useRef } from 'react';
import type { GeologicalEvent } from '../chronology';
import { EvidenceLabel } from '../evidence';
import { hasTethysReconstruction, tethysSources } from './model';
import styles from './tethys.module.css';

const TethysMap = lazy(() => import('./map'));

function SourceInspector() {
  const { ageMa, anchorPlate, comparisonAnchorPlate, models, citations, pipeline } = tethysSources;

  return (
    <details className={styles.methods}>
      <summary>Sources, methods and attribution</summary>
      <p>EarthByte source geometry was reconstructed at {ageMa} Ma using pyGPlates {pipeline.pygplates}. The map uses a regional equirectangular projection of model longitude and latitude. Display paths are simplified at {pipeline.simplificationDegrees}° after spherical tessellation and antimeridian splitting. The view crops the geometry to the regional map frame.</p>
      <p>Plate {anchorPlate} is the displayed anchor. Lithosphere checkpoints compare both published frames and the common Africa-fixed anchor ({comparisonAnchorPlate}). Shared boundary segments retain their source feature and adjacent plate IDs.</p>
      <div className={styles.sourceModels}>
        {models.map((model) => (
          <section key={model.id} aria-label={model.role + ' model'}>
            <h3>{model.version}</h3>
            <p><strong>{model.id}</strong> · {model.referenceFrame}</p>
            <p><a href={model.packagePage}>{model.publisher} package and documentation ↗</a></p>
            <p>{model.license.evidence} <a href={model.license.url}>{model.license.name} ↗</a></p>
            <details>
              <summary>Pinned archive files and SHA-256</summary>
              <ul className={styles.archiveList}>
                {model.archives.map((archive) => (
                  <li key={archive.kind}>
                    <a href={archive.url}>{archive.name} ↗</a>
                    <code>{archive.sha256}</code>
                    <ul>{archive.requiredFiles.map((file) => <li key={file.path}>{file.path}<code>{file.sha256}</code></li>)}</ul>
                  </li>
                ))}
              </ul>
            </details>
          </section>
        ))}
      </div>
      <p>The displayed reconstruction adapts the primary EarthByte rotation, lithosphere and topology datasets. The comparison uses its own compatible Matthews layers. Gaps, overlaps, and model differences reflect reconstruction and representation choices. Poorly preserved oceanic crust limits what can be constrained.</p>
      <ul className={styles.citations}>
        {Object.entries(citations).map(([id, citation]) => <li key={id}><a href={citation.url}>{citation.title} ↗</a></li>)}
      </ul>
    </details>
  );
}

export function TethysChapter({ active, onSelect }: { active: GeologicalEvent; onSelect: () => void }) {
  const available = hasTethysReconstruction(active.when);
  const { models, ageMa } = tethysSources;
  const heading = useRef<HTMLHeadingElement>(null);

  return (
    <section id="tethys" className={styles.chapter} aria-labelledby="deep-time-tethys-heading">
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Albian · Early Cretaceous</p>
          <h2 id="deep-time-tethys-heading" tabIndex={-1} ref={heading}>The Tethys Ocean · {ageMa} Ma</h2>
          <p>{models[0].id} · {models[0].version}</p>
        </div>
        <EvidenceLabel classification="modeled" />
      </header>
      <p>The plate model places fragments around the Tethys as Gondwana separated. Locating those fragments is a first step toward asking when seaways connected and how marine environments changed.</p>
      <p className={styles.limit}>This reconstruction depicts ancient Earth. The fictional <em>World of Tethys</em> is a separate setting.</p>

      {available ? (
        <Suspense fallback={<p className={styles.status} role="status">Preparing the {ageMa} Ma model…</p>}>
          <TethysMap />
        </Suspense>
      ) : (
        <div className={styles.status} data-tethys-unavailable>
          <h3>Reconstruction unavailable for the selected event</h3>
          <p><strong>{active.title}</strong> · {active.when.label}. This instrument has a verified reconstruction for {ageMa} Ma.</p>
          <button type="button" onClick={() => {
            onSelect();
            heading.current?.focus();
          }}>Select {ageMa} Ma in the timeline</button>
        </div>
      )}

      <SourceInspector />
    </section>
  );
}
