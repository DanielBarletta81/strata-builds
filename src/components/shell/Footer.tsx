import Link from "next/link";
import styles from "./shell.module.css";
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div>
          <p className={styles.signature}>STRATA BUILDS</p>
          <p>Scientific data, made explorable.</p>
          <p className={styles.credit}>
            By D. C. Barletta. Source attribution and research limitations
            remain with each instrument.
          </p>
        </div>
        <nav aria-label="Footer">
          <Link href="/studio">Studio</Link>
          <Link href="/design-system">Design system</Link>
          <a href="https://github.com/DanielBarletta81/strata-builds">
            Source repository
          </a>
        </nav>
      </div>
    </footer>
  );
}
