import type { ReactNode } from "react";
import styles from "./legacy-light-canvas.module.css";
export default function LegacyLightCanvas({
  children,
}: {
  children: ReactNode;
}) {
  return <div className={styles.canvas}>{children}</div>;
}
