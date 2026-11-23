import styles from "./ui.module.css";
export default function DataReadout({
  label,
  value,
  unit,
  provenance,
}: {
  label: string;
  value: string;
  unit: string;
  provenance: string;
}) {
  return (
    <div className={styles.readout}>
      <p>{label}</p>
      <p className={styles.value}>
        {value} <span>{unit}</span>
      </p>
      <p className={styles.support}>{provenance}</p>
    </div>
  );
}
