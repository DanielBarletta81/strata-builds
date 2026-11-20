export const ASSIGNMENTS = ['Hudson', 'Chesapeake', 'Delaware'] as const;
export type Assignment = (typeof ASSIGNMENTS)[number];

export type AtlasProvenance = {
  datasetId: string;
  classification: 'synthetic';
  sourceUrl: string;
  revision: string;
  seed: number;
};

export type AtlasSample = {
  id: string;
  lat: number;
  lon: number;
  assignment: Assignment;
  site: string | null;
  classification: 'synthetic';
  datasetId: string;
};

type SampleInput = {
  id?: unknown;
  lat?: unknown;
  lon?: unknown;
  assignment?: unknown;
  site?: unknown;
};

type RejectionReason =
  | 'invalid_record'
  | 'invalid_id'
  | 'duplicate_id'
  | 'invalid_latitude'
  | 'invalid_longitude'
  | 'invalid_assignment'
  | 'invalid_site';

export type AtlasRejection = {
  row: number;
  id: string | null;
  reason: RejectionReason;
};

function isCoordinate(value: unknown, limit: number): value is number {
  return typeof value === 'number' && Number.isFinite(value) && Math.abs(value) <= limit;
}

function isAssignment(value: unknown): value is Assignment {
  return ASSIGNMENTS.some(assignment => assignment === value);
}

export function validateSamples(rows: readonly unknown[], provenance: AtlasProvenance) {
  const samples: AtlasSample[] = [];
  const rejected: AtlasRejection[] = [];
  const acceptedIds = new Set<string>();

  rows.forEach((row, index) => {
    if (row == null || typeof row !== 'object' || Array.isArray(row)) {
      rejected.push({ row: index + 1, id: null, reason: 'invalid_record' });
      return;
    }

    const { id: rawId, lat, lon, assignment, site } = row as SampleInput;
    const id = typeof rawId === 'string' ? rawId.trim() : '';
    const reject = (reason: RejectionReason) => rejected.push({ row: index + 1, id: id || null, reason });

    if (!id) return reject('invalid_id');
    if (acceptedIds.has(id)) return reject('duplicate_id');
    if (!isCoordinate(lat, 90)) return reject('invalid_latitude');
    if (!isCoordinate(lon, 180)) return reject('invalid_longitude');
    if (!isAssignment(assignment)) return reject('invalid_assignment');
    if (site != null && (typeof site !== 'string' || !site.trim())) return reject('invalid_site');

    acceptedIds.add(id);
    samples.push({
      id, lat, lon, assignment, site: site?.trim() ?? null,
      classification: provenance.classification,
      datasetId: provenance.datasetId,
    });
  });

  return { samples, rejected, provenance };
}

type AssignmentCounts = Record<Assignment, number>;

function emptyCounts(): AssignmentCounts {
  return { Hudson: 0, Chesapeake: 0, Delaware: 0 };
}

export function summarizeAssignments(samples: readonly AtlasSample[]) {
  const totals = emptyCounts();
  const groups = new Map<string | null, { latitudeSum: number; total: number; counts: AssignmentCounts }>();

  for (const sample of samples) {
    totals[sample.assignment] += 1;
    let site = groups.get(sample.site);
    if (!site) {
      site = { latitudeSum: 0, total: 0, counts: emptyCounts() };
      groups.set(sample.site, site);
    }
    site.latitudeSum += sample.lat;
    site.total += 1;
    site.counts[sample.assignment] += 1;
  }

  const sites = Array.from(groups, ([site, { latitudeSum, total, counts }]) => ({
    site, latitude: latitudeSum / total, total, counts,
  })).sort((a, b) => b.latitude - a.latitude);

  return { totals, sites };
}
