import water from './data/water.json' with { type: 'json' };
import { stations, type StationId } from './observations';
import styles from './oceanography.module.css';

const width = 416;
const height = 520;
const [west, south, east, north] = water.bounds;
function project(longitude: number, latitude: number) {
  return [((longitude - west) / (east - west)) * width, ((north - latitude) / (north - south)) * height];
}

const shoreline = water.polygons.map((polygon) => polygon.map((ring) => (
  ring.map(([longitude, latitude], index) => {
    const [x, y] = project(longitude, latitude);
    return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join('') + 'Z'
)).join('')).join('');

export function StationMap({ selected }: { selected: StationId }) {
  return (
    <figure className={styles.map}>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby="bay-map-title bay-map-desc">
        <title id="bay-map-title">Narragansett Bay station locator</title>
        <desc id="bay-map-desc">North is up. Five numbered locations run from the Seekonk River to the lower West Passage. Select their matching names in the station list.</desc>
        <rect width={width} height={height} className={styles.land} />
        <path d={shoreline} fillRule="evenodd" className={styles.water} />
        <text x="28" y="35" className={styles.mapLabel}>↑ N</text>
        <text x="294" y="462" className={styles.mapLabel}>Narragansett</text>
        <text x="294" y="482" className={styles.mapLabel}>Bay</text>
        {stations.map(({ id, name, longitude, latitude }, index) => {
          const [x, y] = project(longitude, latitude);
          return (
            <g key={id} transform={`translate(${x} ${y})`} className={id === selected ? styles.selectedPin : styles.pin}>
              <title>{name}</title>
              <circle r="13" />
              <text y="1" textAnchor="middle" dominantBaseline="middle">{index + 1}</text>
            </g>
          );
        })}
      </svg>
      <figcaption>Station locations over U.S. Census TIGER/Line 2024 area hydrography. North up.</figcaption>
    </figure>
  );
}
