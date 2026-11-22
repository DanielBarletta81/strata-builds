import { evidenceClasses, sources, type EvidenceClass, type SourceId } from './sources';
import styles from './deep-time.module.css';

export function EvidenceLabel({ classification }: { classification: EvidenceClass }) {
  return <span className={styles.evidenceLabel} data-evidence={classification}>{evidenceClasses[classification]}</span>;
}

export function SourceLinks({ references }: { references: readonly SourceId[] }) {
  return (
    <ul className={styles.sourceLinks}>{references.map((id) => (
      <li key={id}><a href={sources[id].url}>{sources[id].label} <span aria-hidden="true">↗</span></a></li>
    ))}</ul>
  );
}
