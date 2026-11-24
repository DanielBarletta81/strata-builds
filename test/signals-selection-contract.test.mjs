import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { URL } from 'node:url';

const read = (path) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('Signals selection wiring keeps chart, table, and inspector on one selected observation state', () => {
  const instrument = read('src/features/signals/signals-instrument.tsx');

  assert.match(instrument, /const \[selectedObservationAt, setSelectedObservationAt\] = useState<string \| null>\(null\)/);
  assert.match(instrument, /<TemperatureChart[\s\S]*selectedObservationAt=\{selectedObservationAt\}[\s\S]*onSelectObservation=\{onSelectObservation\}/);
  assert.match(instrument, /const selected = selectedObservationAt[\s\S]*snapshot\.observations\.find/);
  assert.match(instrument, /<section className=\{styles\.selectionInspector\}/);
  assert.match(instrument, /<button[\s\S]*className=\{styles\.rowSelect\}[\s\S]*aria-pressed=\{selectedObservationAt === row\.observedAt\}/);
  assert.match(instrument, /toggleObservationSelection\(selectedObservationAt, row\.observedAt\)/);
});

test('Temperature chart exposes keyboard and pointer selection interactions', () => {
  const chart = read('src/features/signals/temperature-chart.tsx');

  assert.match(chart, /onKeyDown=\{handleChartKeyDown\}/);
  assert.match(chart, /moveObservationSelection\(observations, selectedObservationAt, 'next'\)/);
  assert.match(chart, /moveObservationSelection\(observations, selectedObservationAt, 'previous'\)/);
  assert.match(chart, /onClick=\{\(\) => onSelectObservation\(toggleObservationSelection\(selectedObservationAt, point\.observedAt\)\)\}/);
  assert.match(chart, /aria-current=\{selectedObservationAt === point\.observedAt \? 'true' : 'false'\}/);
});
