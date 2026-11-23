import type { ReactNode } from "react";
import styles from "./ui.module.css";
const labels = {
  observed: "Observed",
  interpretation: "Scientific interpretation",
  modeled: "Modeled",
  synthetic: "Synthetic demonstration",
  unresolved: "Still unresolved",
};
export default function EvidenceCard({
  kind,
  children,
}: {
  kind: keyof typeof labels;
  children: ReactNode;
}) {
  return (
    <div className={`${styles.evidence} ${styles[kind]}`}>
      <h3>{labels[kind]}</h3>
      {children}
    </div>
  );
}
