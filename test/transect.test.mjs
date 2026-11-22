import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { URL } from 'node:url';
import { seawayEvidence, oaeEstimates } from '../src/features/deep-time/tethys/seaway/evidence.ts';
import { faciesSettings, targetMa, transectEvidence, transectSources } from '../src/features/deep-time/tethys/transect/evidence.ts';
import { ageCoverage, initialLaboratory, inspectLaboratory } from '../src/features/deep-time/tethys/transect/model.ts';

const byId = (id) => transectEvidence.find((record) => record.id === id);

test('every observation identifies a source locator, access and rights without a restored location', () => {
  assert.equal(new Set(transectEvidence.map(({ id }) => id)).size, 9);
  for (const setting of faciesSettings) {
    assert.equal(transectEvidence.filter((record) => record.setting === setting.id).length, 3);
  }
  for (const record of transectEvidence) {
    assert.ok(record.locality && record.unit && record.position);
    assert.ok(record.observed && record.interpreted && record.unresolved && record.missing);
    assert.notEqual(record.observed, record.interpreted);
    assert.ok(record.age.method && record.age.uncertainty && record.age.label);
    assert.deepEqual(Object.keys(record.placement).sort(), ['requirement', 'status']);
    assert.equal(record.placement.status, 'unavailable');
    assert.ok(seawayEvidence.some(({ id }) => id === record.regionalRecord));
    for (const forbidden of ['geometry', 'depthMeters', 'thickness', 'coordinates', 'elevation', 'latitude', 'longitude']) {
      assert.ok(!(forbidden in record));
    }
    for (const { source, locator } of record.references) {
      const entry = transectSources[source];
      assert.ok(locator && entry.rights && entry.access && entry.citation);
      assert.equal(new URL(entry.url).protocol, 'https:');
    }
  }
  assert.match(transectSources.ramos26.rights, /CC BY-NC-ND 4\.0/);
  assert.match(transectSources.gargano.access, /Full/);
  assert.match(transectSources.drowning.access, /abstract/);
});

test('111 Ma gate distinguishes a source bracket, broad coverage, older and unresolved evidence', () => {
  assert.equal(targetMa, 111);
  const fossilZone = byId('rischi-biozone');
  assert.deepEqual(fossilZone.age.range, { youngerMa: 110.70, olderMa: 112.80 });
  assert.equal(ageCoverage(fossilZone.age), 'verified');
  assert.ok(fossilZone.age.uncertainty.includes('kyr') && fossilZone.age.uncertainty.includes('Ma'));
  assert.equal(ageCoverage(byId('subtidal-limestone').age), 'broad');
  assert.equal(ageCoverage(byId('aptian-drowning').age), 'outside');
  assert.equal(ageCoverage(byId('exposure-breccia').age), 'unresolved');
  assert.equal(ageCoverage({ ...fossilZone.age, range: { youngerMa: 108, olderMa: 109 } }), 'outside');
  assert.equal(fossilZone.placement.status, 'unavailable');
});

test('conflicting age ranges remain separate and only rule out an age from the same side', () => {
  const age = byId('leenhardt-shale').age;
  assert.equal(age.basis, 'conflicting-ranges');
  assert.match(age.label, /111\.28 ± 0\.12 Ma.*111\.40–111\.44 Ma/);
  assert.equal(ageCoverage(age), 'outside');
  assert.equal(ageCoverage({ ...age, ranges: [{ youngerMa: 110.50, olderMa: 111.44 }, age.ranges[1]] }), 'unresolved');
  assert.equal(ageCoverage({ ...age, ranges: [{ youngerMa: 105, olderMa: 106 }, age.ranges[1]] }), 'unresolved');
  assert.deepEqual(oaeEstimates.map(({ ageMa, uncertaintyMa }) => [ageMa, uncertaintyMa]), [[111.70, 0.12], [111.28, 0.12]]);
});

test('transect observations retain their selection across layers and synchronize contextual checkpoints', () => {
  let state = inspectLaboratory(initialLaboratory, { type: 'layer', layer: 'transect' });
  assert.equal(state.record.id, 'subtidal-limestone');
  assert.equal(state.inspection.checkpoint, 'adria');
  state = inspectLaboratory(state, { type: 'transect-record', record: byId('posta-megabreccia') });
  assert.equal(state.inspection.evidence.id, 'southern-gargano');
  assert.equal(state.inspection.checkpoint, 'apulia');
  state = inspectLaboratory(state, { type: 'layer', layer: 'questions' });
  state = inspectLaboratory(state, { type: 'checkpoint', id: 'apulia' });
  assert.equal(state.record.id, 'posta-megabreccia');
  state = inspectLaboratory(state, { type: 'evidence', evidence: seawayEvidence[2] });
  assert.equal(state.record.id, 'pelagic-marl');
  state = inspectLaboratory(state, { type: 'transect-record', record: byId('rischi-biozone') });
  assert.equal(state.inspection.evidence.id, 'poggio-le-guaine');
  assert.equal(state.inspection.checkpoint, 'apulia');
  state = inspectLaboratory(state, { type: 'layer', layer: 'transect' });
  assert.equal(state.record.id, 'rischi-biozone');
});

test('Phase 2 reconstruction and Phase 3 evidence bytes match the reviewed baseline', async () => {
  const frozen = {
    'data/receipt-111.json': 'c0aef497080db9a7da533b8aa33ef431e664a7d83bb9a880fabe1d3358dd21d4',
    'data/reconstruction-111.json': 'dd80304146d4538f7f8ed4aed903f2c41b18c6f7d1546123e64b8f2989a036cb',
    'data/sources.json': 'bf8164b19feeebc85445b47eab84f313d2c36290cd3e0b6176362b5a700a0373',
    'data/validation-111.json': 'd628733dd1afccd5a7f1d83b9bb8ea49bfb044810a0dd1d73b5656a97d484e98',
    'seaway/evidence.ts': '118a19e314c9b0d82b19f864144cea9b1249dd9fa40b28770b6b6e4d1c5898e7',
    'seaway/frame-audit.json': 'd36452066e6560b49132221f7f305ca0cbbfa7c80813b9eff715ce132e8125db',
  };
  for (const [path, expected] of Object.entries(frozen)) {
    const bytes = await readFile(new URL('../src/features/deep-time/tethys/' + path, import.meta.url));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), expected, path);
  }
});
