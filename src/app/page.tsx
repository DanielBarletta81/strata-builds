import Image from "next/image";
import PageHeader from "../components/ui/PageHeader";
import ProjectCard from "../components/ui/ProjectCard";
import Button from "../components/ui/Button";
import styles from "./home.module.css";
const projects = [
  {
    href: "/deep-time",
    title: "Deep Time Observatory",
    classification: "Published evidence & modeled reconstruction",
    description:
      "Explore geological chronology, changing oceans and atmosphere, and the Ancient Seaway Laboratory at 111 Ma.",
  },
  {
    href: "/signals",
    title: "NOAA Signals Lab",
    classification: "Observed · NOAA CO-OPS",
    description:
      "Inspect Providence water temperatures, quality flags and missing intervals. Follow each observation back to its source.",
  },
  {
    href: "/oceanography",
    title: "Oceanography",
    classification: "Observed · published records",
    description:
      "Compare Narragansett Bay nutrient, salinity and depth observations, with source coverage and sampling limits in view.",
  },
  {
    href: "/atlas",
    title: "Microsat Atlas",
    classification: "Synthetic demonstration",
    description:
      "Explore synthetic population assignments on a coastal map. This demonstration does not represent measured genetic data.",
  },
  {
    href: "/orbital",
    title: "Orbital Observatory",
    classification: "Modeled · NASA/JPL states",
    description:
      "Inspect captured Ceres ephemerides and Voyager light-time. Model epochs, reference frames and approximations stay visible.",
  },
  {
    href: "/frontier",
    title: "Evidence Frontier",
    classification: "Observed records & unresolved questions",
    description:
      "Trace Narragansett Bay monitoring gaps and conflicting records to the sources, methods and next useful investigation.",
  },
];
export default function Home() {
  return (
    <main className={styles.home}>
      <div className={styles.inner}>
        <section className={styles.hero}>
          <div>
            <PageHeader
              eyebrow="Field research meets computational exploration"
              title={
                <>
                  Evidence first.
                  <br />
                  Questions next.
                  <br />
                  <span className={styles.accent}>Conclusions earned.</span>
                </>
              }
            >
              <p>
                STRATA is a platform for exploring scientific evidence. Inspect
                the record, understand its limits, and find the next useful
                question.
              </p>
            </PageHeader>
            <div className={styles.actions}>
              <Button href="#instruments">Explore the instruments ↓</Button>
              <Button secondary href="#approach">
                Our approach
              </Button>
            </div>
          </div>
          <div className={styles.heroMark}>
            <Image
              src="/brand/strata-symbol.svg"
              alt=""
              width={320}
              height={320}
              unoptimized
            />
            <p>
              Layers of evidence.
              <br />A shared reference, never a shortcut to certainty.
            </p>
          </div>
        </section>
        <section id="instruments" className={styles.section}>
          <div className={styles.sectionHeading}>
            <h2>
              Choose a question.
              <br />
              Open an instrument.
            </h2>
            <p>
              Different records. Different methods. Sources and limitations stay
              close to the view.
            </p>
          </div>
          <div className={styles.projects}>
            {projects.map((project, index) => (
              <ProjectCard
                key={project.href}
                {...project}
                index={String(index + 1).padStart(2, "0")}
              />
            ))}
          </div>
        </section>
        <section id="approach" className={styles.approach}>
          <p className={styles.eyebrow}>How we work</p>
          <h2>
            Trust comes from
            <br />
            what you can inspect.
          </h2>
          <div className={styles.principles}>
            <article>
              <span>01 / Trace the source</span>
              <h3>Start with the record.</h3>
              <p>
                Sources, methods and attribution belong beside the data. An
                observed measurement, a model and a synthetic example are
                different kinds of evidence.
              </p>
            </article>
            <article>
              <span>02 / Keep the limits</span>
              <h3>Make uncertainty visible.</h3>
              <p>
                Missing observations, conflicting records and model assumptions
                are part of the story. They should remain inspectable.
              </p>
            </article>
            <article>
              <span>03 / Ask what follows</span>
              <h3>Leave room for questions.</h3>
              <p>
                A gap is a reason to investigate. It is not evidence for an
                unsupported conclusion.
              </p>
            </article>
          </div>
          <Button secondary href="/studio">
            Explore the engineering studio ↗
          </Button>
        </section>
      </div>
    </main>
  );
}
