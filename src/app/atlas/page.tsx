import { AtlasExplorer } from '@/features/atlas/atlas-explorer';
import { COAST_SOURCE_URL, createAtlasModel } from '@/features/atlas/model';
import styles from '@/features/atlas/atlas.module.css';

export default function AtlasPage() {
  const model = createAtlasModel();

  return (
    <main className={styles.atlas}>
      <header className={styles.pageHeading}>
        <h1>Microsat Atlas</h1>
        <p>Explore sample assignments from Buzzards Bay to Chesapeake Bay, then compare site composition along the coast.</p>
        <p className={styles.synthetic}>SYNTHETIC DEMONSTRATION DATA</p>
        <p>Sample locations and assignments are generated for this demonstration. They represent no measured genotypes.</p>
      </header>

      <AtlasExplorer model={model} />

      <section className={styles.methods} aria-labelledby="atlas-methods">
        <h2 id="atlas-methods">Method and sources</h2>
        <p>
          A dashed ring flags a sample when at least three of its five closest samples share the same
          different assignment. This neighborhood comparison is descriptive. Population boundaries,
          migration, and statistical significance require independent evidence.
        </p>
        <p>
          Distances use latitude-adjusted longitude on a local equirectangular projection.
          Site composition counts assignments in the displayed records, ordered by mean sample latitude.
        </p>
        <p>{model.points.length} records passed validation. {model.rejected.length} records were rejected.</p>
        {model.rejected.length > 0 && (
          <ul>
            {model.rejected.map(({ row, id, reason }) => (
              <li key={row}>Row {row}{id && ` (${id})`}: {reason.replace(/_/g, ' ')}</li>
            ))}
          </ul>
        )}
        <ul>
          <li>
            Sample generator and methodology adapted from the <a href={model.provenance.sourceUrl}>pinned Microsat Atlas source</a>.
          </li>
          <li>
            Coastal outlines derived from <a href={COAST_SOURCE_URL}>U.S. Census Bureau cartographic boundary files</a>
            {' '}(1:5,000,000), clipped and simplified in the upstream Atlas.
          </li>
        </ul>
      </section>
    </main>
  );
}
