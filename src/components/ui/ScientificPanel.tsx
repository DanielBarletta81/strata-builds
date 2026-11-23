import type { ReactNode } from "react";
import styles from "./ui.module.css";
export default function ScientificPanel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className={styles.panel} aria-label={title}>
      <h3>{title}</h3>
      {children}
    </section>
  );
}
