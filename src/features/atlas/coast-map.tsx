import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { MAP_HEIGHT, MAP_WIDTH } from './geography.ts';
import type { AtlasLegendEntry, AtlasModel } from './model.ts';
import { mapPointIndex } from './map-keyboard.ts';
import styles from './atlas.module.css';

export function MapSymbol({ shape, color, x = 0, y = 0 }: Pick<AtlasLegendEntry, 'shape' | 'color'> & { x?: number; y?: number }) {
  if (shape === 'square') return <rect x={x - 4.5} y={y - 4.5} width={9} height={9} fill={color} />;
  if (shape === 'diamond') return <path d={`M${x} ${y - 6}l6 6-6 6-6-6z`} fill={color} />;
  return <circle cx={x} cy={y} r={5} fill={color} />;
}

type CoastMapProps = {
  model: AtlasModel;
  selectedId: string;
  onSelect: (id: string) => void;
};

export function CoastMap({ model, selectedId, onSelect }: CoastMapProps) {
  const { points, legend, coastline, meridians, parallels, scaleWidth } = model;
  const titleId = useId();
  const descriptionId = useId();
  const markers = useRef(new Map<string, SVGGElement>());
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const symbols = new Map(legend.map(entry => [entry.assignment, entry]));
  const scaleX = MAP_WIDTH - scaleWidth - 36;
  const scaleY = MAP_HEIGHT - 54;

  function handlePointKey(event: KeyboardEvent<SVGGElement>, index: number) {
    const target = mapPointIndex(event.key, index, points.length);
    if (target !== null) {
      event.preventDefault();
      markers.current.get(points[target].id)?.focus();
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(points[index].id);
    }
  }

  return (
    <svg
      className={styles.map}
      viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
      role="group"
      aria-labelledby={titleId}
      aria-describedby={`${descriptionId} atlas-map-help`}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocusedId(null);
      }}
    >
      <title id={titleId}>Atlantic coastal map of synthetic striped bass assignments</title>
      <desc id={descriptionId}>
        {points.length} synthetic samples from Buzzards Bay to Chesapeake Bay.
      </desc>
      <g aria-hidden="true">
        {meridians.map(({ x, label }) => (
          <g key={label}>
            <path className={styles.gridLine} d={`M${x} 0V${MAP_HEIGHT}`} />
            {x >= 42 && x <= MAP_WIDTH - 42 && (
              <text className={styles.mapLabel} x={x} y={MAP_HEIGHT - 9} textAnchor="middle">{label}</text>
            )}
          </g>
        ))}
        {parallels.map(({ y, label }) => (
          <g key={label}>
            <path className={styles.gridLine} d={`M0 ${y}H${MAP_WIDTH}`} />
            {y >= 32 && (
              <text className={styles.mapLabel} x={9} y={y - 7}>{label}</text>
            )}
          </g>
        ))}
        {coastline.map((d, index) => <path key={index} className={styles.coastline} d={d} />)}
        <path className={styles.scale} d={`M${scaleX} ${scaleY}h${scaleWidth}`} />
        <text className={styles.mapLabel} x={scaleX} y={scaleY - 9}>50 km</text>
      </g>

      {points.map((point, index) => {
        const { id, x, y, site, assignment, neighborAssignment } = point;
        const symbol = symbols.get(assignment);
        if (!symbol) throw new Error(`Missing assignment symbol for ${assignment}`);

        return (
          <g
            key={id}
            ref={element => {
              if (element) markers.current.set(id, element);
              else markers.current.delete(id);
            }}
            className={styles.marker}
            data-map-sample={id}
            role="button"
            aria-label={`${id}, ${site ?? 'Site unspecified'}, ${assignment}${neighborAssignment ? ', neighborhood flag' : ''}`}
            aria-pressed={id === selectedId}
            tabIndex={id === (focusedId ?? selectedId) ? 0 : -1}
            onFocus={() => setFocusedId(id)}
            onKeyDown={event => handlePointKey(event, index)}
            onClick={() => onSelect(id)}
          >
            <circle className={styles.hitArea} cx={x} cy={y} r={12} />
            {neighborAssignment && <circle className={styles.flagRing} cx={x} cy={y} r={9.5} />}
            <MapSymbol {...symbol} x={x} y={y} />
            <circle className={styles.focusRing} cx={x} cy={y} r={14} />
          </g>
        );
      })}
      {points.filter(point => point.id === selectedId).map(({ id, x, y }) => (
        <circle key={id} aria-hidden="true" className={styles.selectionRing} cx={x} cy={y} r={11} />
      ))}
    </svg>
  );
}
