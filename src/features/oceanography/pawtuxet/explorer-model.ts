import { castEndpoints, castKey, casts, depthCounts, isNumber, lowOxygenRows, type Cast, type DepthRecord, type Metric } from './casts.ts';

export const metrics = ['oxygen', 'salinity', 'temperature', 'density'] as const;
export const evidenceTabs = [
  { id: 'observed', label: 'Observed Profile' },
  { id: 'source', label: 'Source & Quality' },
  { id: 'investigate', label: 'Investigate' },
] as const;
export type EvidenceTab = typeof evidenceTabs[number]['id'];

export type ExplorerSelection = {
  cast: string;
  metric: Metric;
  row: number | null;
  tab: EvidenceTab;
};

export const initialSelection: ExplorerSelection = {
  cast: '2016-07-20 10:00:00',
  metric: 'oxygen',
  row: null,
  tab: 'observed',
};

type SelectionAction =
  | { type: 'cast'; value: string }
  | { type: 'metric'; value: Metric }
  | { type: 'row'; value: number }
  | { type: 'tab'; value: EvidenceTab };

export function changeSelection(state: ExplorerSelection, action: SelectionAction): ExplorerSelection {
  return action.type === 'cast'
    ? { ...state, cast: action.value, row: null }
    : { ...state, [action.type]: action.value };
}

export function tabForKey(current: EvidenceTab, key: string) {
  const index = evidenceTabs.findIndex(({ id }) => id === current);
  switch (key) {
    case 'ArrowLeft': return evidenceTabs[(index + evidenceTabs.length - 1) % evidenceTabs.length].id;
    case 'ArrowRight': return evidenceTabs[(index + 1) % evidenceTabs.length].id;
    case 'Home': return evidenceTabs[0].id;
    case 'End': return evidenceTabs[evidenceTabs.length - 1].id;
  }
}

export function recordsByDepth(records: readonly DepthRecord[]) {
  const sortableDepth = ({ depth }: DepthRecord) => isNumber(depth) ? depth : Infinity;
  return [...records].sort((a, b) => (sortableDepth(a) - sortableDepth(b)) || a.row - b.row);
}

export function readCast(cast: Cast, rowNumber: number | null, metric: Metric) {
  const { shallow, deep } = castEndpoints(cast.records);
  const ordered = recordsByDepth(cast.records);
  const row = cast.records.find((record) => record.row === rowNumber) ?? deep ?? ordered[0];
  const depthGroups = depthCounts(cast.records);
  const lowRows = new Set(lowOxygenRows(cast.records).map(({ row }) => row));
  const oxygenAssessable = cast.records.some(({ depth, oxygen }) => isNumber(depth) && depthGroups.get(depth) === 1 && isNumber(oxygen));
  const a = shallow?.[metric] ?? null;
  const b = deep?.[metric] ?? null;

  return {
    cast, ordered, row, depthGroups, lowRows, oxygenAssessable, shallow, deep,
    difference: isNumber(a) && isNumber(b) ? b - a : null,
  };
}

export function selectedObservation(selection: ExplorerSelection) {
  const cast = casts.find((entry) => castKey(entry) === selection.cast) ?? casts[0];
  return readCast(cast, selection.row, selection.metric);
}

export type CastView = ReturnType<typeof readCast>;

export const depthTicks = [0, 1, 2, 3, 4, 5, 6] as const;

const standardTicks = [0, 8, 16, 24, 32] as const;
export const metricTicks = {
  salinity: standardTicks,
  temperature: standardTicks,
  oxygen: [0, 4, 8, 12, 16],
  density: [1000, 1006, 1012, 1018, 1024],
} as const satisfies Record<Metric, readonly number[]>;

export function metricPosition(value: number, metric: Metric) {
  const ticks = metricTicks[metric];
  return (value - ticks[0]) / (ticks[ticks.length - 1] - ticks[0]) * 100;
}

export function depthPosition(depth: number) {
  return depth / depthTicks[depthTicks.length - 1] * 100;
}

export function profilePoints(records: readonly DepthRecord[], metric: Metric) {
  return records.flatMap(({ row, depth, [metric]: value }) => {
    if (!isNumber(depth) || !isNumber(value)) return [];
    const x = metricPosition(value, metric);
    const y = depthPosition(depth);
    return x >= 0 && x <= 100 && y >= 0 && y <= 100 ? [{ row, depth, value, x, y }] : [];
  });
}
