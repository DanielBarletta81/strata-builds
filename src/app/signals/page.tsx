import type { Metadata } from 'next';
import { SignalsInstrument } from '@/features/signals/signals-instrument';
import { STATION } from '@/features/signals/observations';
import styles from '@/features/signals/signals.module.css';

export const metadata: Metadata = {
  title: 'NOAA Signals Lab | Strata Builds',
  description: 'Inspect hourly NOAA water temperature observations, coverage, and evidence gaps for Providence, Rhode Island.',
};

export default function SignalsPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.station}>NOAA CO-OPS · Station {STATION.id}</p>
        <h1>NOAA Signals Lab</h1>
        <p>Hourly coastal observations from {STATION.name}, with the source, coverage, and quality available for inspection.</p>
      </header>
      <SignalsInstrument />
    </main>
  );
}
