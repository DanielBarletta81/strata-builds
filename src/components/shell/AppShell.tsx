import type { ReactNode } from "react";
import BrandLockup from "../brand/BrandLockup";
import PrimaryNavigation from "./PrimaryNavigation";
import Footer from "./Footer";
import styles from "./shell.module.css";
export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a className={styles.skip} href="#main-content">
        Skip to content
      </a>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <BrandLockup />
          <PrimaryNavigation />
        </div>
      </header>
      <div id="main-content" tabIndex={-1} className={styles.content}>
        {children}
      </div>
      <Footer />
    </>
  );
}
