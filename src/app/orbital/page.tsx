import type { Metadata } from 'next';
import { loadCeres } from '@/features/orbital/ceres';
import { OrbitalInstrument } from '@/features/orbital/orbital-instrument';
import styles from '@/features/orbital/orbital.module.css';

export const metadata: Metadata = {
  title: 'Orbital Observatory | Strata Builds',
  description: 'Inspect the modeled heliocentric states of dwarf planet 1 Ceres from a saved JPL Horizons ephemeris.',
};

export default function OrbitalPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Orbital Observatory</p>
        <h1>1 Ceres</h1>
        <p>Inspect a dwarf planet’s heliocentric trajectory through 262 modeled state vectors from a saved NASA/JPL Horizons ephemeris.</p>
      </header>
      <OrbitalInstrument instrument={loadCeres()} />
    </main>
  );
}
