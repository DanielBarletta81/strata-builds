export const targetMa = 111;

export const transectSources = {
  bariMap: {
    citation: 'Spalluto et al. · ISPRA Geological Map Sheet 438, Bari',
    url: 'https://www.isprambiente.gov.it/Media/carg/note_illustrative/438_Bari.pdf',
    access: 'Full survey notes',
    rights: 'Reviewed the survey notes. Cartography and figures stay with the publisher.',
  },
  bariStudy: {
    citation: 'Spalluto & Caffau (2010) · Italian Journal of Geosciences 129, 335–352',
    url: 'https://doi.org/10.3301/IJG.2010.18',
    access: 'Publisher abstract',
    rights: 'Citation and factual summary. Figure reuse rights are unverified.',
  },
  facies: {
    citation: 'Spalluto (2012) · Facies 58, 17–36',
    url: 'https://doi.org/10.1007/s10347-011-0266-0',
    access: 'Publisher abstract',
    rights: 'Citation and factual summary. Figure and log reuse rights are unverified.',
  },
  giovinazzo: {
    citation: 'Spalluto et al. (2025) · The Depositional Record 11, 328–353',
    url: 'https://doi.org/10.1002/dep2.305',
    access: 'Full publisher text',
    rights: 'Cited findings and section locators. Images and bed logs remain with the publisher.',
  },
  gargano: {
    citation: 'Zunino et al. (2012) · Geological Field Trips 4(1.2), Gargano',
    url: 'https://doi.org/10.3301/GFT.2012.02',
    access: 'Full geological field guide',
    rights: 'Reviewed the ISPRA-hosted field guide. Its geological maps, photographs and figures stay at source.',
  },
  margin: {
    citation: 'Graziano (2000) · Cretaceous Research 21, 107–126',
    url: 'https://doi.org/10.1006/cres.2000.0201',
    access: 'Publisher abstract',
    rights: 'Citation and factual summary. Figure rights are unverified.',
  },
  drowning: {
    citation: 'Graziano (1999) · Terra Nova 11, 245–250',
    url: 'https://doi.org/10.1046/j.1365-3121.1999.00256.x',
    access: 'Publisher abstract',
    rights: 'Citation and factual summary. Figure rights are unverified.',
  },
  section: {
    citation: 'Coccioni et al. (2014) · Stratigraphy 11, 245–282',
    url: 'https://www.micropress.org/microaccess/stratigraphy/issue-312/article-1907',
    access: 'Publisher abstract',
    rights: 'Citation and factual summary. Published stratigraphic logs stay at source.',
  },
  drill: {
    citation: 'Coccioni et al. (2012) · Scientific Drilling 13, 42–46',
    url: 'https://doi.org/10.2204/iodp.sd.13.07.2011',
    access: 'Full drill report',
    rights: 'CC BY 3.0 article. Cited descriptions only.',
  },
  ramos24: {
    citation: 'Ramos et al. (2024) · Paleoceanography and Paleoclimatology 39',
    url: 'https://doi.org/10.1029/2024PA004860',
    access: 'Full article and Table 3',
    rights: 'Article under Creative Commons Attribution. Selected reported ages are cited in text.',
  },
  ramos26: {
    citation: 'Ramos et al. (2026) · Scientific Reports 16, 5862',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12894972/',
    access: 'Full version of record and Tables 1–2',
    rights: 'CC BY-NC-ND 4.0 article. Cited factual age markers. No table, imagery or supplement reproduced.',
  },
  regional: {
    citation: 'van Hinsbergen et al. (2020) · Gondwana Research 81, 79–229',
    url: 'https://doi.org/10.1016/j.gr.2019.07.009',
    access: 'Full version of record',
    rights: 'CC BY 4.0 article. Its separate rotation package was reviewed numerically in Phase 3.',
  },
} as const;

export type FaciesSetting = 'interior' | 'margin' | 'basin';
export type TransectSource = keyof typeof transectSources;
export type RegionalRecordId = 'northern-murge' | 'southern-gargano' | 'poggio-le-guaine';

type AgeRange = { youngerMa: number; olderMa: number };
export type ReportedAge = {
  label: string;
  method: string;
  uncertainty: string;
} & (
  | { basis: 'bracket'; range: AgeRange }
  | { basis: 'conflicting-ranges'; ranges: readonly [AgeRange, AgeRange, ...AgeRange[]] }
  | { basis: 'broad' | 'outside-stage' | 'unresolved' }
);

type Reference = { source: TransectSource; locator: string };

export type TransectRecord = {
  id: string;
  name: string;
  setting: FaciesSetting;
  regionalRecord: RegionalRecordId;
  locality: string;
  unit: string;
  position: string;
  age: ReportedAge;
  observed: string;
  interpreted: string;
  unresolved: string;
  missing: string;
  placement: { status: 'unavailable'; requirement: string };
  references: readonly [Reference, ...Reference[]];
};

export const faciesSettings = [
  { id: 'interior', title: 'Platform interior', locality: 'Northern Murge', summary: 'A shallow marine area where carbonate mud and shells accumulated.' },
  { id: 'margin', title: 'Platform margin', locality: 'Southern Gargano', summary: 'The platform edge and adjoining slope, where loose sediment can move downslope.' },
  { id: 'basin', title: 'Marine basin', locality: 'Poggio le Guaine', summary: 'An open-water setting that preserves fine sediment and remains of plankton.' },
] as const;

const murgeRestoration = 'Restore the specific bed and outcrop through local faults and folds before tying it to the Apulia circuit.';
const garganoRestoration = 'Restore the faulted outcrop and slope geometry before validating the unit in the Apulia circuit.';
const basinRestoration = 'Restore the drilled section through Apennine deformation and validate its plate-circuit placement.';

export const transectEvidence: readonly TransectRecord[] = [
  {
    id: 'subtidal-limestone', name: 'Shell-rich limestone', setting: 'interior', regionalRecord: 'northern-murge',
    locality: 'Northern Murge · Bari geological sheet, southern Italy',
    unit: 'Calcare di Bari Formation',
    position: 'Lithofacies B recurs in the mapped composite succession.',
    age: {
      basis: 'broad', label: 'Albian in the lower and middle composite',
      method: 'Benthic-foraminifer assemblages and orbitolinids constrain the succession.',
      uncertainty: 'The repeated lithofacies lacks a single numerically dated bed at 111 Ma.',
    },
    observed: 'The survey reports limestone with broken bivalve shells, benthic foraminifera and locally burrowed beds. Some layers show shell fragments aligned in thin laminae.',
    interpreted: 'A generally low-energy shallow subtidal setting, with occasional stronger currents or waves that sorted shell debris.',
    unresolved: 'The exact water depth and extent of these beds at 111 Ma remain open.',
    missing: 'A marker bed and dated local section through the sampled facies.',
    placement: { status: 'unavailable', requirement: murgeRestoration },
    references: [{ source: 'bariMap', locator: '§2.1, p. 33, lithofacies B and Fig. 10' }, { source: 'bariStudy', locator: 'Abstract, composite section and age revision' }, { source: 'facies', locator: 'Abstract, open subtidal facies belt' }],
  },
  {
    id: 'tidal-microbial-laminae', name: 'Microbial tidal laminae', setting: 'interior', regionalRecord: 'northern-murge',
    locality: 'Giovinazzo sea cliff · northern Murge',
    unit: 'Calcare di Bari Formation',
    position: 'Microbial-bindstone facies in the logged sea-cliff succession.',
    age: {
      basis: 'broad', label: 'Early to late Albian section-level assignments',
      method: 'Benthic foraminifera and orbitolinids distinguish the lower and upper intervals.',
      uncertainty: 'The substage assignments are broad and the recurring facies has no numerical tie at 111 Ma.',
    },
    observed: 'Thin sections show wavy microbial laminae and small cavities in the limestone. The authors also report shrinkage cracks in some beds.',
    interpreted: 'The cavities have several possible origins. Where they occur with drying features, the authors infer deposition near the upper tidal zone.',
    unresolved: 'Tidal range, salinity and the 111 Ma extent of the tidal flats are unconstrained.',
    missing: 'Correlated facies logs and an independent, bed-level age tie.',
    placement: { status: 'unavailable', requirement: murgeRestoration },
    references: [{ source: 'giovinazzo', locator: '§4.2 and §4.3.2, Figs. 3 and 7B' }, { source: 'facies', locator: 'Abstract, protected peritidal facies belt' }],
  },
  {
    id: 'exposure-breccia', name: 'Brecciated paleosols', setting: 'interior', regionalRecord: 'northern-murge',
    locality: 'Giovinazzo sea cliff · northern Murge',
    unit: 'Calcare di Bari Formation',
    position: 'Three brecciated horizons in the lower studied succession, above the lower foraminiferal assemblage.',
    age: {
      basis: 'unresolved', label: 'Albian section · exposure age unresolved at 111 Ma',
      method: 'Benthic-foraminifer assemblages frame a tentative sequence correlation.',
      uncertainty: 'The paper discusses differently dated reference charts. The sequence correlation does not establish an absolute age for these exposures.',
    },
    observed: 'Three laterally traceable beds contain angular to rounded limestone fragments and signs of in-place alteration. The first has an erosive surface and a layer rich in black pebbles.',
    interpreted: 'The authors interpret the beds as old soils formed during local exposure, when carbonate deposition stopped.',
    unresolved: 'The duration of exposure and the extent of dry land at 111 Ma are unresolved.',
    missing: 'A dated exposure surface and matching records beyond the sea-cliff section.',
    placement: { status: 'unavailable', requirement: murgeRestoration },
    references: [{ source: 'giovinazzo', locator: '§§4.2, 4.3.1, 5.3 and 6, Figs. 3, 6 and 7A' }, { source: 'facies', locator: 'Abstract, terrestrial facies and sequence architecture' }],
  },
  {
    id: 'posta-megabreccia', name: 'Posta Manganaro megabreccia', setting: 'margin', regionalRecord: 'southern-gargano',
    locality: 'Posta Manganaro area · southern Gargano, near Manfredonia',
    unit: 'Posta Manganaro Megabreccias',
    position: 'Upper part of the unit at the field guide’s Stop 2 approach.',
    age: {
      basis: 'broad', label: 'Albian, in part, at the reviewed exposure',
      method: 'Regional stratigraphic correlations assign the upper part of the unit to part of the Albian.',
      uncertainty: 'A broad correlation gives no numerical bracket for the selected exposed deposits.',
    },
    observed: 'The field guide reports coarse lithic breccias and megabreccias in the road cut, mostly massive with weak bedding locally.',
    interpreted: 'Large broken rock fragments are consistent with gravity-driven transport from the platform margin into a fault-controlled basin.',
    unresolved: 'The ancient slope angle, basin depth and position of these deposits at 111 Ma remain unconstrained.',
    missing: 'A source-dated bed and a restored transect from the source margin into the deposit.',
    placement: { status: 'unavailable', requirement: garganoRestoration },
    references: [{ source: 'gargano', locator: 'Stop 2 approach, p. 76, Figs. 6–7' }, { source: 'margin', locator: 'Abstract, the Posta Manganaro succession and platform-to-basin transition' }, { source: 'regional', locator: '§5.3.1, regional platform and basin setting' }],
  },
  {
    id: 'mattinata-slope', name: 'Mattinata slope deposits', setting: 'margin', regionalRecord: 'southern-gargano',
    locality: 'Monte Sant’Angelo to Pulsano · southern Gargano',
    unit: 'Calcari di Mattinata',
    position: 'Upper part of the slope succession along the approach to Stop 4.',
    age: {
      basis: 'broad', label: 'Lower Cretaceous slope succession',
      method: 'Local stratigraphic correlation. The guide assigns the topmost setting of Fig. 72 to the late Albian.',
      uncertainty: 'This figure does not date the other deposits seen along the road at 111 Ma.',
    },
    observed: 'The guide describes chaotic channel fills, graded tabular megabreccia beds and faults draped by finer deposits.',
    interpreted: 'Channel geometry and changing grain sizes are consistent with sediment-gravity flows and episodes of slope instability.',
    unresolved: 'Flow pathways to a named distal basin and conditions at 111 Ma remain open.',
    missing: 'Coeval logs linking the deposits to a dated basin section and a recovered slope geometry.',
    placement: { status: 'unavailable', requirement: garganoRestoration },
    references: [{ source: 'gargano', locator: 'Approach to Stop 4, pp. 85–86 and Fig. 72' }, { source: 'margin', locator: 'Abstract, Upper Mattinata Bioclastic Limestones' }],
  },
  {
    id: 'aptian-drowning', name: 'Aptian drowning surface', setting: 'margin', regionalRecord: 'southern-gargano',
    locality: 'Gargano Promontory · Apulian platform margin',
    unit: 'Late early Aptian drowning unconformity',
    position: 'The younger of the two Early Cretaceous discontinuities in Graziano’s study.',
    age: {
      basis: 'outside-stage', label: 'Late early Aptian · older than 111 Ma',
      method: 'Biostratigraphy and sequence relationships constrain the reported drowning.',
      uncertainty: 'The published abstract gives a relative age and does not provide a numerical uncertainty for this surface.',
    },
    observed: 'The study reports a stratigraphic break within the exposed platform-to-basin transition.',
    interpreted: 'The author identifies it as a drowning unconformity, marking a change from a shallow carbonate platform setting.',
    unresolved: 'The amount of deepening and its geographical reach cannot be recovered from the reported surface alone.',
    missing: 'Continuous age-tied sections and independent depth indicators for the affected margin.',
    placement: { status: 'unavailable', requirement: garganoRestoration },
    references: [{ source: 'drowning', locator: 'Abstract, younger drowning unconformity' }, { source: 'gargano', locator: 'Regional sequence interpretation, p. 18, Figs. 6–7' }],
  },
  {
    id: 'pelagic-marl', name: 'Pelagic marl and limestone', setting: 'basin', regionalRecord: 'poggio-le-guaine',
    locality: 'Poggio le Guaine · Umbria–Marche Basin, central Italy',
    unit: 'Marne a Fucoidi Formation',
    position: 'Cored formation between the Maiolica and Scaglia Bianca transitions.',
    age: {
      basis: 'broad', label: 'Aptian–Albian core context',
      method: 'Planktonic foraminifera and calcareous nannofossils constrain the core succession.',
      uncertainty: 'The drill report describes recurring lithologies across the core. A specific marl bed is not assigned to 111 Ma here.',
    },
    observed: 'The drilling report logs marly limestone and marl, interspersed with organic-rich shale horizons.',
    interpreted: 'The fine sediment and planktonic microfossils document open-water deposition in a marine basin.',
    unresolved: 'Absolute water depth at 111 Ma and a specific pathway from Gargano to this section are unresolved.',
    missing: 'A restored basin position and dated, independently correlated beds between the basin and the platform margin.',
    placement: { status: 'unavailable', requirement: basinRestoration },
    references: [{ source: 'drill', locator: 'pp. 43–44, litho-, bio- and chronostratigraphy, Figs. 2 and 5' }, { source: 'section', locator: 'Abstract, pelagic section and microfossil constraints' }],
  },
  {
    id: 'rischi-biozone', name: 'Planktonic fossil zone', setting: 'basin', regionalRecord: 'poggio-le-guaine',
    locality: 'Poggio le Guaine core · Umbria–Marche Basin',
    unit: 'Microhedbergella rischi planktonic-foraminiferal zone',
    position: 'Between the M. rischi marker at 60.20 m and the overlying Ticinella primula marker at 50.03 m down-core.',
    age: {
      basis: 'bracket', range: { youngerMa: 110.70, olderMa: 112.80 }, label: '112.80–110.70 Ma in the published tuned model',
      method: 'Foraminiferal marker positions are mapped to the authors’ astronomically tuned core timescale. Table 2 also reports a nannofossil-zone framework.',
      uncertainty: 'The Table 2 note lists ±0.203 kyr. The discussion reports approximately ±0.203 Ma. The displayed ages are the nominal zone boundaries.',
    },
    observed: 'The authors report planktonic-foraminiferal zone markers at different positions in the core. The cited depths locate fossils in rock.',
    interpreted: 'The published age model places 111 Ma within this local marine interval.',
    unresolved: 'No individual fossil sample or lithology at exactly 111 Ma is identified here. Ancient water depth and connections to the platform remain unresolved.',
    missing: 'Independent age ties and local sample-level observations within the bracket, plus coeval records on the margin and platform.',
    placement: { status: 'unavailable', requirement: basinRestoration },
    references: [{ source: 'ramos26', locator: 'Table 2, M. rischi and T. primula rows; discussion of planktonic foraminifera' }, { source: 'drill', locator: 'Fig. 2, original litho- and biostratigraphic framework' }],
  },
  {
    id: 'leenhardt-shale', name: 'Leenhardt organic-rich shale', setting: 'basin', regionalRecord: 'poggio-le-guaine',
    locality: 'Poggio le Guaine core · Umbria–Marche Basin',
    unit: 'Leenhardt Level · OAE 1b',
    position: '52.97–53.26 m down-core in Ramos et al. (2026), Table 1.',
    age: {
      // Use the conclusions' central estimate plus/minus its quoted uncertainty and the separate Table 3 range.
      basis: 'conflicting-ranges', ranges: [{ youngerMa: 111.16, olderMa: 111.40 }, { youngerMa: 111.40, olderMa: 111.44 }],
      label: '2024 conclusions report 111.28 ± 0.12 Ma. Table 3 reports 111.40–111.44 Ma.',
      method: 'Astronomical tuning and stratigraphic correlation; the 2026 table also reports 111.40–111.44 Ma.',
      uncertainty: 'The conflicting estimates remain documented. Both reported alternatives are older than 111 Ma.',
    },
    observed: 'The core studies identify an organic-rich marker bed. The outcrop study reports multiple organic-rich horizons through the surrounding pelagic succession.',
    interpreted: 'The authors use Leenhardt as a stratigraphic marker within OAE 1b. Organic-rich sediment can motivate questions about preservation and oxygen availability.',
    unresolved: 'The exact age discrepancy, dissolved oxygen at 111 Ma and the spatial extent of low oxygen remain open.',
    missing: 'A clarified age calibration plus coeval redox proxies from multiple restored sections.',
    placement: { status: 'unavailable', requirement: basinRestoration },
    references: [{ source: 'ramos24', locator: 'Table 3 and conclusions, Leenhardt estimates' }, { source: 'ramos26', locator: 'Table 1, Leenhardt row' }, { source: 'section', locator: 'Abstract, organic-rich horizons and correlations' }],
  },
];
