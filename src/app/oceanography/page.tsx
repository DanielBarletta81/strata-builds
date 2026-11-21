import type { Metadata } from 'next';
import { Observatory } from '@/features/oceanography/observatory';

export const metadata: Metadata = {
  title: 'Estuarine Gradient Observatory | Strata Builds',
  description: 'Inspect verified Narragansett Bay nutrients, salinity, dissolved oxygen and depth records from the Seekonk River to the West Passage.',
};

export default function OceanographyPage() {
  return <Observatory />;
}
