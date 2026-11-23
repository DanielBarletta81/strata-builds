import type { Metadata } from "next";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import ProjectCard from "../../components/ui/ProjectCard";
import ScientificPanel from "../../components/ui/ScientificPanel";
import DataReadout from "../../components/ui/DataReadout";
import EvidenceCard from "../../components/ui/EvidenceCard";
import SourceDisclosure from "../../components/ui/SourceDisclosure";
import StatusNotice from "../../components/ui/StatusNotice";
import SpecimenControls from "./SpecimenControls";
import styles from "./showcase.module.css";
export const metadata: Metadata = {
  title: "Design system | Strata Builds",
  robots: { index: false, follow: false },
};
export default function DesignSystem() {
  return (
    <main className={styles.showcase}>
      <div className={styles.inner}>
        <PageHeader
          eyebrow="STRATA / Design system"
          title="A shared language for evidence."
        >
          <p>
            Component specimens for the shared shell. Every value and scenario
            on this page is illustrative, not a scientific observation.
          </p>
        </PageHeader>
        <section>
          <h2>Typography &amp; actions</h2>
          <p>
            System typography keeps prose readable without downloading fonts.
            Numeric examples retain units and uncertainty.
          </p>
          <div className={styles.actions}>
            <Button href="#evidence">Inspect examples</Button>
            <Button secondary href="/">
              Return home
            </Button>
            <Button disabled>Unavailable example</Button>
          </div>
        </section>
        <section>
          <h2>Scientific panels &amp; readouts</h2>
          <ScientificPanel title="Illustrative measurement">
            <DataReadout
              label="Example temperature — synthetic value"
              value="12.4 ± 0.3"
              unit="°C"
              provenance="Invented only to demonstrate unit and uncertainty typography; no real station or dataset."
            />
            <SourceDisclosure summary="Inspect this example’s provenance">
              <p>
                No scientific source underlies this example. It is a UI
                specimen, not a published measurement.
              </p>
              <a href="https://github.com/DanielBarletta81/strata-builds/blob/main/docs/RESEARCH_PHILOSOPHY.md">
                Read the research philosophy
              </a>
            </SourceDisclosure>
          </ScientificPanel>
        </section>
        <section id="evidence">
          <h2>Evidence classes</h2>
          <p>
            Classification describes the evidence. It does not indicate success,
            certainty or data quality. The treatments below are illustrative
            examples.
          </p>
          <div className={styles.grid}>
            {(
              [
                "observed",
                "interpretation",
                "modeled",
                "synthetic",
                "unresolved",
              ] as const
            ).map((kind) => (
              <EvidenceCard kind={kind} key={kind}>
                <p>
                  {kind === "observed"
                    ? "Example treatment for recorded measurements; no measurement is supplied here."
                    : kind === "interpretation"
                      ? "Example treatment for an explanation supported by cited evidence."
                      : kind === "modeled"
                        ? "Example treatment for a calculation with stated inputs and validity limits."
                        : kind === "synthetic"
                          ? "Invented demonstration values must remain explicitly labeled."
                          : "An unavailable record or unresolved discrepancy must not silently become zero."}
                </p>
              </EvidenceCard>
            ))}
          </div>
        </section>
        <section>
          <h2>Selection &amp; feedback</h2>
          <SpecimenControls />
        </section>
        <section>
          <h2>Interface status</h2>
          <div className={styles.grid}>
            <StatusNotice kind="info" title="Loading example">
              Request pending. No value is presented yet.
            </StatusNotice>
            <StatusNotice kind="warning" title="Partial coverage example">
              Some records are absent; do not infer complete coverage.
            </StatusNotice>
            <StatusNotice kind="error" title="Source unavailable example">
              The request failed. An unavailable reading is not zero.
            </StatusNotice>
            <StatusNotice kind="success" title="Export complete example">
              A UI operation finished. This says nothing about scientific
              certainty.
            </StatusNotice>
            <StatusNotice kind="info" title="Empty result example">
              No matching records. Explain the scope before interpreting
              absence.
            </StatusNotice>
          </div>
        </section>
        <section>
          <h2>Instrument card</h2>
          <ProjectCard
            href="/atlas"
            title="Microsat Atlas"
            description="Explore a clearly labeled synthetic population demonstration."
            classification="Synthetic demonstration"
            index="01"
          />
        </section>
      </div>
    </main>
  );
}
