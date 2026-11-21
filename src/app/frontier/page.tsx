import type { Metadata } from 'next';
import { FrontierInstrument } from '@/features/frontier/frontier-instrument';
import { loadInvestigation } from '@/features/frontier/investigation';
import styles from '@/features/frontier/frontier.module.css';

export const metadata: Metadata = {
  title: 'Evidence Frontier | Strata Builds',
  description: 'Inspect documented monitoring gaps and source coverage for surface water temperature in Narragansett Bay.',
};

export default function FrontierPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.kicker}>Evidence Frontier · Narragansett Bay</p>
        <h1>Where does the record break?</h1>
        <p>Inspect 2012 surface temperature coverage and distinguish seasonal schedules, blank records, and unresolved availability.</p>
      </header>
      <FrontierInstrument data={loadInvestigation()} />
    </main>
  );
}
