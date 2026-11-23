import type { ReactNode } from "react";
import styles from "./ui.module.css";
export default function SourceDisclosure({
  summary,
  children,
}: {
  summary: string;
  children: ReactNode;
}) {
  return (
    <details className={styles.disclosure}>
      <summary>{summary}</summary>
      <div>{children}</div>
    </details>
  );
}
