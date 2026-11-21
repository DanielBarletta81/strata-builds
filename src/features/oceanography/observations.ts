import capture from './data/records.json' with { type: 'json' };

export const stations = [
  { id: 'F4', name: 'Phillipsdale Landing', region: 'Seekonk River', latitude: 41.84175, longitude: -71.3722,
    coordinates: '2012 network metadata and PD Notes, 41°50.505′ N, 71°22.332′ W', source: 'RIDEM',
    context: 'Fixed dock sensors. NBC’s later nutrient collection can be at the dock or a nearby boat site.' },
  { id: 'B4', name: 'Bullock Reach', region: 'Providence River', latitude: 41.7324, longitude: -71.3702333333,
    coordinates: 'NBC 2012 report, 41°43.944′ N, 71°22.214′ W', source: 'NBC 2012',
    context: 'Buoy in the lower Providence River. The 2025 samples refer to the buoy area and actual placement can vary.' },
  { id: 'B3', name: 'Conimicut Point', region: 'Upper Bay', latitude: 41.7117666667, longitude: -71.3434833333,
    coordinates: '2012 CP Notes, 41°42.706′ N, 71°20.609′ W', source: 'RIDEM',
    context: 'Fixed station near the Providence River mouth. NBC’s Conimicut Point West nutrient station has different coordinates.' },
  { id: 'F3', name: 'T-Wharf', region: 'Middle Bay', latitude: 41.5783333333, longitude: -71.3211,
    coordinates: '2012 TW Notes, 41°34.700′ N, 71°19.266′ W', source: 'RIDEM',
    context: 'Southern Prudence Island. The estuary divides into passages around nearby islands.' },
  { id: 'F7', name: 'GSO Dock', region: 'Lower Bay · West Passage', latitude: 41.49225, longitude: -71.41895,
    coordinates: 'RIDEM station report, 41°29.535′ N, 71°25.137′ W, corroborated by NOAA IOOS', source: 'RIDEM station report',
    context: 'Lower-Bay reference site. One fixed sensor is available alongside a separate surface-grab program in the dock vicinity.' },
] as const;

export type StationId = typeof stations[number]['id'];
export const { day, clocks, profiles } = capture;
export type ProfileRecord = typeof profiles[StationId]['records'][number];
export type NutrientRecord = {
  row: number;
  date: string;
  clock: string | null;
  sample: string | null;
  blankId: string | null;
  site: string;
  depth: number | null;
  salinity: number | null;
  nutrient: number | string | null;
  note: string | null;
  calculated: boolean;
};

export const sources = {
  ridem: { label: 'RIDEM / NBFSMN 2012 edited archive', url: 'https://datadem.ri.gov/documents/bart/nbfsmn12.zip', retrieved: '2026-11-21T00:28:32Z', hash: capture.inputHashes.ridem },
  nbc: { label: 'NBC River and Bay Nutrient Results, 2025', url: 'https://www.narrabay.com/wp-content/uploads/2026/01/2025-NBC-River-and-Bay-Nutrient-Results.xlsx', retrieved: '2026-11-21T02:45:53Z', hash: capture.inputHashes.nbc },
  nbcSites: { label: 'NBC station list and placement notes', url: 'https://www.narrabay.com/wp-content/uploads/2024/04/NBC-Monitoring-Locations.xlsx', retrieved: '2026-11-21T02:45:53Z', hash: 'd4f4d24864aeb5f1b7fbe60532a49df7243d5c5e1fc1b467824addb3a2b81b82' },
  tank: { label: 'URI MERL Tank-98 dock workbook', url: 'https://web.uri.edu/gso/wp-content/uploads/sites/916/T-98-GSO-dock-grab-sample-to-share.xlsx', retrieved: '2026-11-21T02:45:53Z', hash: capture.inputHashes.tank },
  chrp: { label: 'URI MERL CHRP nutrient workbook, 2025 update', url: 'https://web.uri.edu/gso/wp-content/uploads/sites/916/MERL_CHRP-Nutrients-to-share_2025.xlsx', retrieved: '2026-11-21T02:45:53Z', hash: '4d4045dee0ad9bbd06f37eacc6b6a2a61aec5486194a9236407371128033acf9' },
  nbc2012: { label: 'NBC 2012 report, fixed-site deployments', url: 'https://www.narrabay.com/wp-content/uploads/2022/08/2012_EMDA_Data_Report.pdf', retrieved: '2026-11-21T01:15:07Z', hash: 'e8308afe30480e83ae69b5be340f814d8e8b8799c69161f9d45a130c7cf341c9' },
  nbcMethods: { label: 'NBC 2022 report, nutrient sampling methods', url: 'https://www.narrabay.com/wp-content/uploads/2024/07/2022_EM_Data_Report.pdf', retrieved: '2026-11-21T02:45:53Z', hash: '34d3d1bf46db49f74aa55fd4b04ef58d889561850bf6a9d70f4b0b42e3793233' },
  ioos: { label: 'NOAA IOOS asset inventory, GSO Dock', url: 'https://ioos.github.io/ioos_metrics/asset_inventory.html', retrieved: '2026-11-21T02:48:15Z', hash: 'ead2df605f85579ed43bb6f708d591964159ad772e1e6e6116f78d1e1858b546' },
  ridemReport: { label: 'RIDEM network station and sampling characteristics', url: 'https://dem.ri.gov/media/2836/download' },
} as const;

export function getNutrients(station: StationId): readonly NutrientRecord[] {
  return station in capture.nutrients ? capture.nutrients[station as keyof typeof capture.nutrients] : [];
}

export function pairStatus(row: NutrientRecord) {
  if (row.note) return 'Review flag';
  if (row.calculated) return 'Calculated field';
  if (typeof row.nutrient === 'string' && row.nutrient.startsWith('<')) return 'Below reporting limit';
  if (typeof row.nutrient !== 'number' || row.salinity === null) return 'Missing field';
  return 'Paired';
}

export function pairedSamples(records: readonly NutrientRecord[]) {
  const keys = new Set<string>();
  const duplicates = new Set<string>();
  for (const { sample, date } of records) {
    const key = sample ?? date;
    if (keys.has(key)) duplicates.add(key);
    keys.add(key);
  }

  return records.flatMap((row) => {
    if (duplicates.has(row.sample ?? row.date) || pairStatus(row) !== 'Paired' || typeof row.nutrient !== 'number' || row.salinity === null) return [];
    return [{ ...row, nutrient: row.nutrient, salinity: row.salinity }];
  });
}

export const quantities = {
  depth: { label: 'Depth', units: 'm' },
  salinity: { label: 'Salinity', units: 'ppt' },
  oxygen: { label: 'Dissolved oxygen', units: 'mg/L' },
  temperature: { label: 'Temperature', units: '°C' },
} as const;

export type Quantity = keyof typeof quantities;

export function reading(record: ProfileRecord | undefined, field: Quantity) {
  const [value, status] = record?.[field] ?? [null, 'no row'];
  return { value, status };
}

export function profileAt(station: StationId, clock: string) {
  const profile = profiles[station];

  return Object.keys(profile.columns).map((layer) => {
    const matches = profile.records.filter((row) => row.clock === clock && row.layer === layer);
    return { layer, record: matches.length === 1 ? matches[0] : undefined, duplicate: matches.length > 1 };
  });
}

export function coverage(station: StationId) {
  return Object.keys(profiles[station].columns).map((layer) => {
    const slots = clocks.map((clock) => profileAt(station, clock).find((entry) => entry.layer === layer));
    const count = (field: Quantity) => slots.filter((slot) => reading(slot?.record, field).status === 'recorded').length;

    return { layer, expected: slots.length, salinity: count('salinity'), oxygen: count('oxygen'), temperature: count('temperature'),
      missingRows: slots.filter((slot) => !slot?.record && !slot?.duplicate).length,
      duplicates: slots.filter((slot) => slot?.duplicate).length };
  });
}

export function cellLocator(station: StationId, row: ProfileRecord, field: Quantity) {
  const profile = profiles[station];
  const columns = profile.columns as Record<string, Record<Quantity, number>>;
  const index = columns[row.layer][field];
  const column = index < 26 ? String.fromCharCode(65 + index) : `A${String.fromCharCode(65 + index - 26)}`;
  return `${profile.sheet}!${column}${row.row}`;
}
