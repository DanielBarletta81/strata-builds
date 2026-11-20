'use client';

import { useEffect, useState } from 'react';
import { REUSE_MINUTES, signalsStatus, type SignalsApiError, type SignalsDelivery, type SignalsResponse } from './delivery';
import { EvidenceInspector } from './evidence-inspector';
import { TemperatureChart } from './temperature-chart';
import {
  DEFAULT_HOURS, MAX_HOURS, NOAA_SCHEMA, STATION,
  hasUninterpretedQuality, qualityLabel, type SignalsSnapshot,
} from './observations';
import { formatFullUtc, formatRaw, formatTemperature, formatUtc } from './display';
import styles from './signals.module.css';

const availableHours = Array.from({ length: MAX_HOURS }, (_, index) => index + 1);

type Result = { requestId: number; error: string | null; failedDelivery?: SignalsDelivery };

export function SignalsInstrument() {
  const [draftHours, setDraftHours] = useState(DEFAULT_HOURS);
  const [request, setRequest] = useState({ hours: DEFAULT_HOURS, id: 0 });
  const [result, setResult] = useState<Result | null>(null);
  const [lastSnapshot, setLastSnapshot] = useState<SignalsResponse | null>(null);
  const [clock, setClock] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      const fallback = 'Observations are temporarily unavailable. Try again.';
      try {
        const response = await fetch('/api/signals?range=' + request.hours, {
          signal: AbortSignal.any([controller.signal, AbortSignal.timeout(12_000)]), cache: 'no-store',
        });
        if (!response.ok) {
          const body = await response.json() as SignalsApiError;
          if (!controller.signal.aborted) {
            setClock(Date.now());
            setResult({ requestId: request.id, error: body.error?.message || fallback, failedDelivery: body.delivery });
          }
          return;
        }
        const data = await response.json() as SignalsResponse;
        if (controller.signal.aborted) return;
        setLastSnapshot(data);
        setClock(Date.now());
        setResult({ requestId: request.id, error: null });
      } catch {
        if (controller.signal.aborted) return;
        setResult({ requestId: request.id, error: fallback });
      }
    };
    void load();
    return () => controller.abort();
  }, [request]);

  useEffect(() => {
    if (!result && !lastSnapshot) return;
    const tick = window.setInterval(() => setClock(Date.now()), 15_000);
    return () => window.clearInterval(tick);
  }, [result, lastSnapshot]);

  const snapshot = lastSnapshot?.window.hours === request.hours ? lastSnapshot : null;
  const pending = result?.requestId !== request.id;
  const error = pending ? null : result.error;
  const failedDelivery = pending ? undefined : result.failedDelivery;
  const status = signalsStatus({ response: snapshot, nowMs: clock, pending, error, failedDelivery });
  const nextCheckAt = (error ? failedDelivery : snapshot?.delivery)?.nextCheckAt;

  return (
    <>
      <div className={styles.controls}>
        <form className={styles.form} onSubmit={(event) => {
          event.preventDefault();
          setRequest(({ id }) => ({ hours: draftHours, id: id + 1 }));
        }}>
          <label htmlFor="signals-hours">Observation window</label>
          <div className={styles.actions}>
            <select id="signals-hours" name="range" value={draftHours} onChange={(event) => setDraftHours(Number(event.target.value))}>
              {availableHours.map((hours) => <option key={hours} value={hours}>{hours} {hours === 1 ? 'hour' : 'hours'}</option>)}
            </select>
            <button type="submit">{draftHours === request.hours ? 'Refresh data' : 'Apply window'}</button>
          </div>
        </form>
        <div className={styles.checkStatus}>
          <p className={styles.status} role="status" aria-atomic="true" data-state={error || status.stale ? 'attention' : snapshot?.status}>
            {status.text}
          </p>
          <p className={styles.cachePolicy}>
            Refresh checks the shared cache. Equivalent requests can reuse a response or failure within each {REUSE_MINUTES}-minute UTC slot.
            {nextCheckAt && clock < Date.parse(nextCheckAt) && (
              <> Next cache slot starts at <time dateTime={nextCheckAt}>{formatUtc(nextCheckAt)}</time>.</>
            )}
          </p>
        </div>
      </div>
      {error && !snapshot && (
        <section className={styles.panel} aria-labelledby="signals-error">
          <h2 id="signals-error">Could not load the observation window</h2>
          <a href={STATION.url}>Check the NOAA station page</a>
        </section>
      )}
      {snapshot && <SnapshotView snapshot={snapshot} stale={status.stale} />}
    </>
  );
}

function SnapshotView({ snapshot, stale }: { snapshot: SignalsSnapshot; stale: boolean }) {
  const { summary, window, coverage, receivedRows, exclusions } = snapshot;
  const flagged = snapshot.observations.filter(({ flags }) => hasUninterpretedQuality(flags)).length;

  return (
    <>
      <div className={styles.dashboard}>
        <section className={styles.instrument} aria-labelledby="signals-water-temperature">
          <div className={styles.instrumentHead}>
            <div>
              <h2 id="signals-water-temperature">Water temperature</h2>
              <p>NOAA hourly observations · °C</p>
            </div>
            {stale && <span className={styles.stale}>Stale response</span>}
          </div>
          {summary ? (
            <>
              <div className={styles.readout}>
                <p className={styles.latest}>
                  <span>Latest accepted</span>
                  <strong>{formatTemperature(summary.latest.value)} <small>°C</small></strong>
                  <time dateTime={summary.latest.observedAt}>{formatUtc(summary.latest.observedAt)}</time>
                </p>
                <dl className={styles.stats}>
                  <div><dt>Minimum</dt><dd>{formatTemperature(summary.min)} °C</dd></div>
                  <div><dt>Maximum</dt><dd>{formatTemperature(summary.max)} °C</dd></div>
                  <div><dt>Mean</dt><dd>{formatTemperature(summary.mean)} °C</dd></div>
                  <div><dt>Accepted</dt><dd>{summary.count}</dd></div>
                </dl>
              </div>
              <TemperatureChart snapshot={snapshot} />
            </>
          ) : (
            <p className={styles.empty}>No accepted temperatures are available for this response. Inspect coverage and raw-row findings below.</p>
          )}
        </section>
        <section className={styles.panel} aria-labelledby="signals-coverage">
          <h2 id="signals-coverage">Window coverage</h2>
          <p className={styles.coverageValue}>
            {coverage.applicable ? <><strong>{coverage.acceptedHours}/{coverage.expectedHours}</strong> hours accepted</> : <strong>Unknown</strong>}
          </p>
          <dl className={styles.coverageDetails}>
            <div><dt>Window start</dt><dd><time dateTime={window.startUtc}>{formatFullUtc(window.startUtc)}</time></dd></div>
            <div><dt>End (exclusive)</dt><dd><time dateTime={window.endUtcExclusive}>{formatFullUtc(window.endUtcExclusive)}</time></dd></div>
            <div><dt>Retrieved</dt><dd><time dateTime={snapshot.retrievedAt}>{formatFullUtc(snapshot.retrievedAt)}</time></dd></div>
            <div><dt>Received rows</dt><dd>{coverage.applicable ? receivedRows : 'Unavailable'}</dd></div>
            <div><dt>Excluded rows</dt><dd>{coverage.applicable ? exclusions.length : 'Unavailable'}</dd></div>
            <div><dt>Hours without an accepted value</dt><dd>{coverage.missingHours ?? 'Unknown'}</dd></div>
            <div><dt>Accepted hours with quality fields to review</dt><dd>{coverage.applicable ? flagged : 'Unavailable'}</dd></div>
          </dl>
          <p className={styles.sourceLinks}>
            <a href={snapshot.sourceUrl}>Open NOAA source response</a>
            <a href={STATION.url}>Station metadata</a>
            <a href="#signals-evidence">Inspect evidence gaps</a>
          </p>
        </section>
      </div>
      <EvidenceInspector snapshot={snapshot} />
      <section className={styles.panel} id="signals-observations" aria-labelledby="signals-records-heading">
        <h2 id="signals-records-heading">Observation table</h2>
        {snapshot.observations.length ? (
          <div className={styles.tableViewport} role="region" aria-label="Scrollable water temperature records" tabIndex={0}>
            <table className={styles.table}>
              <caption>Accepted hourly readings · {snapshot.observations.length} records</caption>
              <thead>
                <tr><th scope="col">Observed (UTC)</th><th scope="col">Temp. (°C)</th><th scope="col">Raw value</th><th scope="col">NOAA flags</th></tr>
              </thead>
              <tbody>
                {snapshot.observations.map((row) => (
                  <tr key={row.observedAt} data-observation={row.observedAt}>
                    <th scope="row"><time dateTime={row.observedAt}>{formatFullUtc(row.observedAt).replace(' UTC', '')}</time></th>
                    <td>{formatTemperature(row.value)}</td>
                    <td>{formatRaw(row.rawValue)}</td>
                    <td>{qualityLabel(row.flags)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p>There are no accepted rows to list for this response.</p>}
      </section>
      <section className={styles.methods} aria-labelledby="signals-method-heading">
        <h2 id="signals-method-heading">Method and limitations</h2>
        <p>Strata requests hourly readings from NOAA CO-OPS in metric units and GMT, then renders times in UTC. Each completed hour is counted once. If multiple valid rows share a time, the first in source order is used. The statistics describe the accepted readings at this station in this window. Assessing outages, causes, or research gaps requires further evidence.</p>
        <p>Raw values and NOAA quality metadata are preserved. Strata uses structural validation and leaves quality flags available for interpretation. A response is shown as stale after 15 minutes, when its selected hourly window rolls forward, or when a refresh fails. <a href={NOAA_SCHEMA}>NOAA response field definitions</a></p>
      </section>
    </>
  );
}
