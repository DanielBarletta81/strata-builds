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
        <nav style={{ display: 'flex', flexWrap: 'wrap', columnGap: 'clamp(0.65rem, 3vw, 2rem)', padding: '1rem', borderBottom: '1px solid #ccc' }}>
          <Link href="/" style={{ fontWeight: 'bold' }}>
            Strata Builds
          </Link>
          <Link href="/studio">
            Studio
          </Link>
          <Link href="/atlas">Atlas</Link>
          <Link href="/signals">Signals</Link>
          <Link href="/orbital">Orbital</Link>
          <Link href="/frontier">Frontier</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
