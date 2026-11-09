export default function Home() {
  return (
    <main style={{ padding: '2rem' }}>
      <section style={{ marginBottom: '4rem' }}>
        <h1>Strata Builds</h1>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>
          Software, science, and structure — built in layers.
        </p>
        <p>
          A collection of digital products and scientific visualizations,
          each built to respect the data, the user, and the problem domain.
        </p>
      </section>

      <section>
        <h2>Featured Projects</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <ProjectCard
            title="Studio"
            description="Engineering studio portfolio. Full-stack product work, scientific interfaces, and systems that hold under load."
            href="/studio"
          />
          <ProjectCard
            title="Atlas"
            description="Population genetics on an interactive map. Load microsatellite data and read structure as geography."
            href="/atlas"
          />
        </div>
      </section>
    </main>
  );
}

function ProjectCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <a
      href={href}
      style={{
        display: 'block',
        padding: '1.5rem',
        border: '1px solid #ddd',
        borderRadius: '8px',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'border-color 0.2s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = '#999';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = '#ddd';
      }}
    >
      <h3>{title}</h3>
      <p style={{ color: '#666' }}>{description}</p>
    </a>
  );
}
