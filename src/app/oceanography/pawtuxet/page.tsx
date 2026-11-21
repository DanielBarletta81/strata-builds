import type { Metadata } from 'next';
import { PawtuxetExplorer } from '@/features/oceanography/pawtuxet/explorer';

export const metadata: Metadata = {
  title: 'Pawtuxet Water Column Explorer | Strata Builds',
  description: 'Inspect verified NBC Pawtuxet Cove profile readings by cast and depth in 2014 and 2016.',
};

export default function PawtuxetPage() {
  return <PawtuxetExplorer />;
}
