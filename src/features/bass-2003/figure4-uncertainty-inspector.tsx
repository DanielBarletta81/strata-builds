import type { Figure4Audit } from './figure4-audit';
import styles from './bass.module.css';

export function Figure4UncertaintyInspector({ audit }: { audit: Figure4Audit }) {
  return (
    <details className={styles.disclosure}>
      <summary>Inspect Figure 4 source quality</summary>
      <p>The {audit.dimensions[0]} × {audit.dimensions[1]} px photograph verifies the caption and annotation. Its quality review records printed ticks and visible marks. No plot coordinates are available.</p>
      <table className={`${styles.sourceTable} ${styles.figure4Table}`}>
        <caption>Figure 4 source-quality checks</caption>
        <thead><tr><th scope="col">Source feature</th><th scope="col">What the photograph supports</th></tr></thead>
        <tbody>
          {audit.findings.map(({ label, note }) => (
            <tr key={label}>
              <th scope="row">{label}</th>
              <td>{note}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>A flat, uncropped scan showing both axes, every plotted symbol, the regression line, and the caption would enable independent readings.</p>
    </details>
  );
}
