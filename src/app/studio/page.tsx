import Link from 'next/link';

export default function StudioPage() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Studio</h1>
      <p>
        Engineering studio portfolio. Full-stack product work, scientific interfaces,
        and systems that hold under load.
      </p>
      <section aria-labelledby="studio-research">
        <h2 id="studio-research">Research</h2>
        <Link className="project-card" href="/research/bass-2003">
          <h3>Bass Population Observatory</h3>
          <p>Explore reported mortality and growth estimates from Rhode Island’s 2003 largemouth bass study.</p>
        </Link>
      </section>
      <p style={{ marginTop: '2rem', color: '#666' }}>
        [Strata Works portfolio coming soon]
      </p>
    </main>
  );
}
