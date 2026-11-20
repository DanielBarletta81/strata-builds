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
        <div className="project-grid">
          <ProjectCard
            title="Studio"
            description="Engineering studio portfolio. Full-stack product work, scientific interfaces, and systems that hold under load."
            href="/studio"
          />
          <ProjectCard
            title="Atlas"
            description="Explore synthetic population assignments on an interactive coastal map and compare sample composition by site."
            href="/atlas"
          />
        </div>
      </section>
    </main>
  );
}

function ProjectCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <a className="project-card" href={href}>
      <h3>{title}</h3>
      <p style={{ color: '#666' }}>{description}</p>
    </a>
  );
}
