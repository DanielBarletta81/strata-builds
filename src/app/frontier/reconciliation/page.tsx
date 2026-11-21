import type { Metadata } from 'next';
import { ReconciliationCaseFiles } from '@/features/evidence/reconciliation/case-files';

export const metadata: Metadata = {
  title: 'Evidence Reconciliation | Strata Builds',
  description: 'Trace two historical Narragansett Bay surface temperature discrepancies through original records.',
};

export default function ReconciliationPage() {
  return <ReconciliationCaseFiles />;
}
