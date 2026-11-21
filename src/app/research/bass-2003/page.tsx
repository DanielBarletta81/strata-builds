import type { Metadata } from 'next';
import { BassObservatory } from '@/features/bass-2003/bass-observatory';

export const metadata: Metadata = {
  title: 'Bass Population Observatory | Strata Builds',
  description: 'Inspect transcribed mortality and growth estimates from the 2003 Rhode Island largemouth bass research report.',
};

export default function Bass2003Page() {
  return <BassObservatory />;
}
