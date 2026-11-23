import Link from "next/link";
import styles from "./ui.module.css";
export default function ProjectCard({
  href,
  title,
  description,
  classification,
  index,
}: {
  href: string;
  title: string;
  description: string;
  classification: string;
  index: string;
}) {
  return (
    <Link className={styles.projectCard} href={href}>
      <span className={styles.eyebrow}>
        {index} / {classification}
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
      <span className={styles.cardAction}>
        Open instrument <span aria-hidden="true">↗</span>
      </span>
    </Link>
  );
}
