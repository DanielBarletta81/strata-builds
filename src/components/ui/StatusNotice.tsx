import type { ReactNode } from "react";
import styles from "./ui.module.css";
export default function StatusNotice({
  kind,
  title,
  children,
}: {
  kind: "info" | "success" | "warning" | "error";
  title: string;
  children: ReactNode;
}) {
  return (
    <div className={`${styles.notice} ${styles[kind]}`}>
      <strong>{title}</strong>
      <div>{children}</div>
    </div>
  );
}
