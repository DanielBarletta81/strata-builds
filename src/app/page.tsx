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
          <ProjectCard
            title="NOAA Signals Lab"
            description="Inspect hourly water temperature at Providence and trace gaps, exclusions, and NOAA quality flags to the source."
            href="/signals"
          />
          <ProjectCard
            title="Orbital Observatory"
            description="Inspect modeled states of the dwarf planet 1 Ceres in a captured NASA/JPL ephemeris."
            href="/orbital"
          />
          <ProjectCard
            title="Estuarine Gradient Observatory"
            description="Compare verified nutrients, salinity and depth observations across Narragansett Bay."
            href="/oceanography"
          />
          <ProjectCard
            title="Evidence Frontier"
            description="Trace documented gaps in Narragansett Bay monitoring to source records, schedules, and the next useful investigation."
            href="/frontier"
          />
          <ProjectCard
            title="Deep Time Observatory"
            description="Explore the geology behind Earth’s changing oceans, atmosphere, continents and biosphere."
            href="/deep-time"
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
