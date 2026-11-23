'use client';

import reconstruction from './data/reconstruction-111.json';
import validation from './data/validation-111.json';
import { formatCoordinates, tethysSources } from './model';
import styles from './tethys.module.css';

type Checkpoint = typeof validation.checkpoints[number];
const { region, ageMa, continental, boundaries } = reconstruction;
const { checkpoints } = validation;
const scale = 5;
const width = (region.east - region.west) * scale;
const height = (region.north - region.south) * scale;
const longitudes = [-60, -30, 0, 30, 60, 90];
const latitudes = [-60, -30, 0, 30];

const mapLabels: Record<string, { text: string; dx: number; dy: number; mobile?: boolean }> = {
  'south-america': { text: 'South America', dx: -12, dy: 24, mobile: true },
  africa: { text: 'Africa', dx: -21, dy: 25, mobile: true },
  india: { text: 'India', dx: -11, dy: 27, mobile: true },
  madagascar: { text: 'Madagascar', dx: -38, dy: 23 },
  adria: { text: 'Adria', dx: 15, dy: 10 },
  apulia: { text: 'Apulia', dx: -47, dy: 27 },
  iberia: { text: 'Iberia', dx: -31, dy: -12 },
  alcapa: { text: 'AlCaPa', dx: 16, dy: -12 },
  'lhasa-back-arc': { text: 'Lhasa back-arc', dx: 10, dy: -11 },
  'neotethys-ridge': { text: 'NeoTethys ridge', dx: 10, dy: 20 },
};

function project([lon, lat]: readonly number[]) {
  return [(lon - region.west) * scale, (region.north - lat) * scale];
}

function svgPath(points: readonly number[][], close = false) {
  return 'M' + points.map((point) => project(point).map((value) => value.toFixed(2)).join(',')).join('L') + (close ? 'Z' : '');
}

const crustPaths = continental.map(({ id, rings }) => ({ id, d: rings.map((ring) => svgPath(ring, true)).join('') }));
const boundaryPaths = boundaries.map(({ id, type, coordinates }) => ({ id, type, d: svgPath(coordinates) }));

function ReconstructionFigure({ selected }: { selected: Checkpoint }) {
  return (
    <figure className={styles.figure}>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby="tethys-map-title tethys-map-description">
        <title id="tethys-map-title">The Tethys region reconstructed at 111 million years ago</title>
        <desc id="tethys-map-description">Reconstructed lithosphere and resolved plate boundary lines in model longitude and latitude. The selected checkpoint is {selected.label}. A complete description of the named checkpoints follows the map.</desc>
        <defs><clipPath id="tethys-viewport"><rect width={width} height={height} /></clipPath></defs>
        <g clipPath="url(#tethys-viewport)">
          <g className={styles.grid} aria-hidden="true">
            {longitudes.map((lon) => <path key={lon} d={svgPath([[lon, region.south], [lon, region.north]])} />)}
            {latitudes.map((lat) => <path key={lat} d={svgPath([[region.west, lat], [region.east, lat]])} />)}
          </g>
          <g className={styles.crust} fillRule="evenodd">
            {crustPaths.map(({ id, d }) => <path key={id} d={d} />)}
          </g>
          <g className={styles.boundaries} fill="none">
            {boundaryPaths.map(({ id, d, type }) => <path key={id} data-type={type} d={d} />)}
          </g>
          {checkpoints.map((checkpoint) => {
            const chosen = selected.id === checkpoint.id;
            const [x, y] = project(checkpoint.primary.position);
            const label = mapLabels[checkpoint.id];
            return (
              <g key={checkpoint.id} data-map-checkpoint={checkpoint.id} data-selected={chosen} className={styles.checkpoint}>
                {chosen && <circle className={styles.halo} cx={x} cy={y} r="11" />}
                <circle className={styles.dot} cx={x} cy={y} r={chosen ? '5' : '3.4'} />
                {label && <text className={styles.label} data-mobile={label.mobile ?? false} x={x + label.dx} y={y + label.dy}>{label.text}</text>}
              </g>
            );
          })}
          <g className={styles.axes} aria-hidden="true">
            {longitudes.map((lon) => <text key={lon} x={project([lon, 0])[0]} y="22" textAnchor="middle">{Math.abs(lon)}°{lon < 0 ? 'W' : lon > 0 ? 'E' : ''}</text>)}
            {latitudes.map((lat) => <text key={lat} x="8" y={project([0, lat])[1] - 6}>{Math.abs(lat)}°{lat < 0 ? 'S' : lat > 0 ? 'N' : ''}</text>)}
          </g>
        </g>
      </svg>
      <figcaption><strong>Selected checkpoint · {selected.label}.</strong> Regional equirectangular view · Anchor plate 0. Blue shading is illustrative. The extent of water, dry land, and shorelines requires separate evidence.</figcaption>
    </figure>
  );
}

function MapLegend() {
  return (
    <ul className={styles.legend} aria-label="Reconstruction legend">
      <li><i data-key="crust" aria-hidden="true" />Reconstructed lithosphere</li>
      <li><i data-key="ridge" aria-hidden="true" />Spreading ridge</li>
      <li><i data-key="subduction" aria-hidden="true" />Subduction</li>
      <li><i data-key="transform" aria-hidden="true" />Transform</li>
      <li><i data-key="rift" aria-hidden="true" />Continental rift</li>
      <li><i data-key="point" aria-hidden="true" />Selected checkpoint</li>
    </ul>
  );
}

function Comparison({ checkpoint }: { checkpoint: Checkpoint }) {
  const { comparison, globalDifferenceDegrees, africaFixedDifferenceDegrees } = checkpoint;
  if (!comparison) return <p>No matching feature ID and adjacent plate pair was resolved in Matthews at 111 Ma.</p>;

  return (
    <>
      <p>Matthews model, plate 0 · {formatCoordinates(comparison.position)}</p>
      {globalDifferenceDegrees !== undefined && africaFixedDifferenceDegrees !== undefined ? (
        <p>Model separation · {globalDifferenceDegrees.toFixed(2)}° in published frames, {africaFixedDifferenceDegrees.toFixed(2)}° with both fixed to Africa.</p>
      ) : (
        <p>Matched boundary ID and neighboring plates. The locator is a representative vertex for each model’s segment. Arc length is {checkpoint.primary.arcDegrees?.toFixed(1)}° in the primary model and {comparison.arcDegrees?.toFixed(1)}° in Matthews.</p>
      )}
    </>
  );
}

export default function TethysMap({ id, select }: { id: string; select: (id: string) => void }) {
  const selected = checkpoints.find((checkpoint) => checkpoint.id === id) ?? checkpoints[0];
  const carrier = selected.primary.adjacentPlateIds?.join(' / ') ?? selected.primary.plateId;

  return (
    <div data-tethys-map data-age-ma={ageMa}>
      <div className={styles.mapLayout}>
        <div className={styles.mapColumn}>
          <ReconstructionFigure selected={selected} />
          <MapLegend />
          <p className={styles.credit}>EarthByte Group · Müller, Young, Cao and Torsvik model inputs. Adapted and projected for Strata. <a href={tethysSources.models[0].license.url}>CC BY 3.0 Unported ↗</a></p>
        </div>
        <div className={styles.inspector}>
          <label htmlFor="tethys-checkpoint">Inspect a model checkpoint</label>
          <select id="tethys-checkpoint" value={id} onChange={(event) => select(event.target.value)}>
            {checkpoints.map((checkpoint) => <option key={checkpoint.id} value={checkpoint.id}>{checkpoint.label}</option>)}
          </select>
          <div className={styles.readout} aria-live="polite" aria-atomic="true" data-tethys-inspection={id}>
            <h3>{selected.label}</h3>
            <p className={styles.coords}>{formatCoordinates(selected.primary.position)}</p>
            <dl>
              <div><dt>{selected.kind === 'boundary' ? 'Adjacent model plates' : 'Model plate ID'}</dt><dd>{carrier}</dd></div>
              <div><dt>Source feature</dt><dd>{selected.primary.sourceName}</dd></div>
            </dl>
            <Comparison checkpoint={selected} />
          </div>
        </div>
      </div>
      <details className={styles.records}>
        <summary>Checkpoint table and feature IDs</summary>
        <table>
          <caption>Named checkpoints at 111 Ma. Coordinates use the primary model’s published frame.</caption>
          <thead><tr><th scope="col">Feature</th><th scope="col">Model coordinates and IDs</th></tr></thead>
          <tbody>
            {checkpoints.map((checkpoint) => (
              <tr key={checkpoint.id} data-current={id === checkpoint.id}>
                <th scope="row"><button type="button" aria-pressed={id === checkpoint.id} onClick={() => select(checkpoint.id)}>{checkpoint.label}</button></th>
                <td>
                  {formatCoordinates(checkpoint.primary.position)}
                  <small>Plates {checkpoint.primary.adjacentPlateIds?.join(' / ') ?? checkpoint.primary.plateId}</small>
                  <code>{checkpoint.primary.sourceId}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
