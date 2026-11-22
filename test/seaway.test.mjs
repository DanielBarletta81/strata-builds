import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { URL } from 'node:url';
import validation from '../src/features/deep-time/tethys/data/validation-111.json' with { type: 'json' };
import frameAudit from '../src/features/deep-time/tethys/seaway/frame-audit.json' with { type: 'json' };
import { oaeEstimates, seawayEvidence, seawaySources } from '../src/features/deep-time/tethys/seaway/evidence.ts';
import { assessAge, initialInspection, inspect } from '../src/features/deep-time/tethys/seaway/model.ts';

test('regional records retain traceable sources, rights and placement decisions', () => {
  assert.equal(new Set(seawayEvidence.map(({ id }) => id)).size, seawayEvidence.length);
  for (const record of seawayEvidence) {
    assert.ok(record.locator && record.observation && record.interpretation && record.frame && record.next);
    assert.deepEqual(Object.keys(record.placement).sort(), ['kind', 'reason']);
    assert.equal(record.placement.kind, 'unavailable');
    assert.ok(record.placement.reason && record.ageLimit);
    for (const id of record.sources) {
      const source = seawaySources[id];
      assert.ok(source.citation && source.rights);
      assert.equal(new URL(source.url).protocol, 'https:');
    }
  }
  assert.equal(seawaySources.proxyData.url, 'https://zenodo.org/records/10557295');
  assert.equal(seawaySources.proxyData.licenseUrl, 'https://creativecommons.org/licenses/by/4.0/');
  assert.match(frameAudit.regionalArchive.rights, /no file-level reuse license/);
  assert.match(frameAudit.regionalArchive.sha256, /^[a-f0-9]{64}$/);
  for (const file of frameAudit.regionalArchive.files) assert.match(file.sha256, /^[a-f0-9]{64}$/);
});

test('age coverage stays independent of placement and preserves geological estimates', () => {
  const [murge, gargano, poggio, adria] = seawayEvidence;
  assert.equal(assessAge(murge, 111), 'stage-only');
  assert.equal(assessAge(gargano, 111), 'stage-only');
  assert.equal(assessAge(adria, 111), 'model-epoch');
  assert.equal(assessAge(adria, 110), 'outside-verified-epoch');
  assert.equal(assessAge(poggio, 108), 'outside-study');
  assert.equal(assessAge(poggio, 111), 'study-interval');
  assert.equal(poggio.placement.kind, 'unavailable');
  assert.deepEqual(oaeEstimates.map(({ ageMa, uncertaintyMa }) => [ageMa, uncertaintyMa]), [[111.70, 0.12], [111.28, 0.12]]);
  assert.ok(oaeEstimates.every(({ ageMa, uncertaintyMa }) => ageMa - uncertaintyMa > frameAudit.ageMa));
});

test('Africa-fixed diagnostic is pinned to the Phase 2 point and a separate regional circuit', async () => {
  const frozen = await readFile(new URL('../src/features/deep-time/tethys/data/validation-111.json', import.meta.url));
  assert.equal(createHash('sha256').update(frozen).digest('hex'), frameAudit.phase2ValidationSha256);
  const apulia = validation.checkpoints.find(({ id }) => id === frameAudit.checkpoint);
  assert.equal(frameAudit.ageMa, validation.ageMa);
  assert.equal(frameAudit.anchorPlate, validation.comparisonAnchorPlate);
  assert.deepEqual(frameAudit.modernLonLat, apulia.modernPoint);
  assert.deepEqual(frameAudit.phase2AfricaFixedLonLat, apulia.primary.africaFixedPosition);
  assert.equal(frameAudit.phase2Plate, apulia.primary.plateId);
  assert.equal(frameAudit.regionalPlate, 3089);
  assert.notEqual(frameAudit.phase2Plate, frameAudit.regionalPlate);
  const [[lon1, lat1], [lon2, lat2]] = [frameAudit.phase2AfricaFixedLonLat, frameAudit.regionalAfricaFixedLonLat]
    .map((point) => point.map((degrees) => degrees * Math.PI / 180));
  const dot = Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
  assert.ok(Math.abs(Math.acos(dot) * 180 / Math.PI - frameAudit.separationDegrees) < 0.00001);
});

test('layer changes retain the record and only synchronize contextual checkpoints', () => {
  const [murge, gargano, poggio, adria] = seawayEvidence;
  let state = inspect(initialInspection, { type: 'checkpoint', id: 'apulia' });
  assert.equal(state.evidence, murge);
  state = inspect(state, { type: 'evidence', evidence: gargano });
  state = inspect(state, { type: 'layer', layer: 'questions' });
  state = inspect(state, { type: 'checkpoint', id: 'apulia' });
  assert.equal(state.evidence, gargano);
  state = inspect(state, { type: 'checkpoint', id: 'neotethys-ridge' });
  state = inspect(state, { type: 'evidence', evidence: poggio });
  state = inspect(state, { type: 'layer', layer: 'marine' });
  assert.equal(state.evidence, poggio);
  assert.equal(state.checkpoint, 'neotethys-ridge');
  assert.equal(poggio.mapContext, null);
  state = inspect(state, { type: 'checkpoint', id: 'adria' });
  assert.equal(state.evidence, adria);
});
