import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Strata Builds',
  description: 'Design, data, structure — visualizations and digital products',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
          <Link href="/" style={{ marginRight: '2rem', fontWeight: 'bold' }}>
            Strata Builds
          </Link>
          <Link href="/studio" style={{ marginRight: '2rem' }}>
            Studio
          </Link>
          <Link href="/atlas">Atlas</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
