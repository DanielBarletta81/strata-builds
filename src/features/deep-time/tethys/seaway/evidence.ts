export const seawaySources = {
  stratigraphy: {
    citation: 'Spalluto & Caffau (2010) · Italian Journal of Geosciences 129, 335–352',
    url: 'https://doi.org/10.3301/IJG.2010.18',
    rights: 'Publisher abstract reviewed. Figure and map reuse rights unverified. Citation and factual summary only.',
  },
  facies: {
    citation: 'Spalluto (2012) · Facies 58, 17–36',
    url: 'https://doi.org/10.1007/s10347-011-0266-0',
    rights: 'Publisher abstract reviewed. Figure and log reuse rights unverified. Citation and factual summary only.',
  },
  margin: {
    citation: 'Graziano (2000) · Cretaceous Research 21, 107–126',
    url: 'https://doi.org/10.1006/cres.2000.0201',
    rights: 'Publisher abstract reviewed. Figure and map reuse rights unverified. Citation and factual summary only.',
  },
  drowning: {
    citation: 'Graziano (1999) · Terra Nova 11, 245–250',
    url: 'https://doi.org/10.1046/j.1365-3121.1999.00256.x',
    rights: 'Publisher abstract reviewed. Figure reuse rights unverified. Citation and factual summary only.',
  },
  section: {
    citation: 'Coccioni et al. (2014) · Stratigraphy 11, 245–282',
    url: 'https://www.micropress.org/microaccess/stratigraphy/issue-312/article-1907',
    rights: 'Publisher abstract reviewed. Figures and section logs stay with the publisher.',
  },
  calibration: {
    citation: 'Ramos et al. (2024) · Paleoceanography and Paleoclimatology 39, e2024PA004860',
    url: 'https://doi.org/10.1029/2024PA004860',
    rights: 'Article under Creative Commons Attribution. Strata plots two reported estimates in its own graphic.',
  },
  proxyData: {
    citation: 'Ramos (2024) · PLG OAE 1b MS, Fe and Ti data, Zenodo record 10557295',
    url: 'https://zenodo.org/records/10557295',
    rights: 'CC BY 4.0. Companion core series linked at source. No raw series distributed in this prototype.',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  },
  regional: {
    citation: 'van Hinsbergen et al. (2020) · Gondwana Research 81, 79–229',
    url: 'https://doi.org/10.1016/j.gr.2019.07.009',
    rights: 'Version of record CC BY 4.0. The author’s separate GPlates archive has its own attribution and file-level rights to check. No figure or geometry imported.',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  },
  renewal: {
    citation: 'Soetaert, Hamme & Raftery (2022) · Frontiers in Marine Science 9, 1001146',
    url: 'https://doi.org/10.3389/fmars.2022.1001146',
    rights: 'CC BY. Modern field study cited for the mechanism. No measurements or figures transferred.',
  },
  sediment: {
    citation: 'Middelburg & Levin (2009) · Biogeosciences 6, 1273–1293',
    url: 'https://doi.org/10.5194/bg-6-1273-2009',
    rights: 'Open-access synthesis cited as process context. No figures or values imported.',
  },
} as const;

type SourceId = keyof typeof seawaySources;
type CheckpointContext = 'adria' | 'apulia';

type AgeCoverage =
  | { kind: 'stage'; label: string }
  | { kind: 'approximate-interval'; youngerMa: number; olderMa: number; label: string }
  | { kind: 'model'; inspectedAtMa: number; label: string };

type EvidenceRecord = {
  id: string;
  name: string;
  age: AgeCoverage;
  locator: string;
  observation: string;
  interpretation: string;
  frame: string;
  sources: readonly [SourceId, ...SourceId[]];
  mapContext: CheckpointContext | null;
  placement: { kind: 'unavailable'; reason: string };
  ageLimit: string;
  next: string;
};

export const seawayEvidence = [
  {
    id: 'northern-murge',
    name: 'Northern Murge',
    age: { kind: 'stage', label: 'Albian in the lower and middle succession' },
    locator: 'Calcare di Bari Formation · Bari Sheet 438 · Spalluto & Caffau (2010), abstract and pp. 335–352.',
    observation: 'Discontinuous outcrops were correlated into a 470 m composite of predominantly mud-supported limestone and dolomite. Fossils used for dating include orbitolinid foraminifera.',
    interpretation: 'Facies analysis distinguishes protected tidal flats, open shallow-marine settings, and episodes of local exposure recorded by paleosols or collapse breccias.',
    frame: 'Named present-day outcrops in Apulia, southern Italy.',
    sources: ['stratigraphy', 'facies'],
    mapContext: 'apulia',
    placement: { kind: 'unavailable', reason: 'The composite combines several outcrops. No bed-specific point and verified mapping into the Phase 2 Apulia plate circuit are available.' },
    ageLimit: 'The fossil-based Albian assignment is broader than the map snapshot. The facies recur up-section and do not pin the shoreline at 111 Ma.',
    next: 'Find a bed-level facies log with a dated tie point and restored outcrop positions to test which settings coexisted.',
  },
  {
    id: 'southern-gargano',
    name: 'Southern Gargano margin',
    age: { kind: 'stage', label: 'Aptian–Albian margin succession' },
    locator: 'Southern Gargano Promontory · Upper Mattinata Bioclastic Limestones · Graziano (2000), pp. 107–126.',
    observation: 'Graziano described a megabreccia and carbonate deposits along the exposed platform margin.',
    interpretation: 'The margin deposits document sediment transport toward a neighboring basin. The available dating includes earlier drowning surfaces in the early Valanginian and late early Aptian.',
    frame: 'Present-day exposures in the Gargano Promontory, southern Italy.',
    sources: ['margin', 'drowning'],
    mapContext: 'apulia',
    placement: { kind: 'unavailable', reason: 'The source constrains an exposed stratigraphic transition. A restored, age-matched margin line suitable for the display frame is missing.' },
    ageLimit: 'Earlier drowning surfaces and the wider succession cannot date an individual land–water boundary at 111 Ma.',
    next: 'Correlate coeval beds across a restored platform-to-basin transect and look for independent relief or sill-depth constraints.',
  },
  {
    id: 'poggio-le-guaine',
    name: 'Poggio le Guaine',
    age: { kind: 'approximate-interval', olderMa: 114, youngerMa: 109, label: '≈114–109 Ma study interval (Coccioni et al.)' },
    locator: 'Umbria–Marche Basin, central Italy · Coccioni et al. outcrop and Ramos et al. core · Ramos et al. §§3.3–3.4, Table 3 and conclusions.',
    observation: 'The pelagic section contains several organic-rich shale horizons. The studies report planktonic microfossils, carbonate and organic-carbon proxies, and core magnetic susceptibility and Fe/Ti series.',
    interpretation: 'Correlated black-shale beds and an astronomically tuned core yield estimated ages for individual OAE 1b horizons. They provide a nearby marine record for comparison with the carbonate platform.',
    frame: 'Present-day section and core in the Apennines. Logs are indexed by stratigraphic position or core depth.',
    sources: ['section', 'calibration', 'proxyData'],
    mapContext: null,
    placement: { kind: 'unavailable', reason: 'The local section needs an independently tested restoration of Apennine deformation and a compatible plate circuit before it can be plotted.' },
    ageLimit: 'The study interval encompasses 111 Ma. The two quoted horizon estimates are older than the snapshot. Paleoredox proxies do not give dissolved oxygen at 111 Ma.',
    next: 'Correlate the same dated horizons across sections before testing whether low-oxygen conditions were widespread or locally controlled.',
  },
  {
    id: 'greater-adria',
    name: 'Greater Adria restoration',
    age: { kind: 'model', inspectedAtMa: 111, label: 'Triassic–present kinematic reconstruction' },
    locator: 'Greater Adriatic domain · van Hinsbergen et al. (2020), §5.3.1 and Figs. 1, 4, 23.',
    observation: 'The research compiles mapped structures, paleomagnetic constraints and magnetic-anomaly reconstructions to restore Mediterranean blocks.',
    interpretation: 'The regional reconstruction places the Apulian platform beside the hemipelagic Adriatic Basin. This supplies a regional setting for the facies comparison, with modeled relationships between units.',
    frame: 'Study-specific restored blocks in GPlates. Its Apulian reference unit is 3089, distinct from Strata’s Phase 2 plate identifiers.',
    sources: ['regional'],
    mapContext: 'adria',
    placement: { kind: 'unavailable', reason: 'The independent restoration has a different circuit. One common-frame model checkpoint leaves the unit crosswalk and restored positions of field records unresolved.' },
    ageLimit: 'The restoration spans the target epoch but provides neither a bed-level tie nor a measured 111 Ma shoreline, depth or path for water exchange.',
    next: 'Match additional stable points, quantify their residuals in the Africa-fixed frame, and validate a restoration for each field locality.',
  },
] as const satisfies readonly EvidenceRecord[];

export const oaeEstimates = [
  { label: 'Urbino', ageMa: 111.70, uncertaintyMa: 0.12 },
  { label: 'Leenhardt', ageMa: 111.28, uncertaintyMa: 0.12 },
] as const;

export const seawayQuestions = [
  { title: 'Where was the shore?', needed: 'Correlated exposure surfaces and tidal facies dated to the same interval, with restored local positions.' },
  { title: 'How deep were the basins and sills?', needed: 'Dated facies transects, restored sections and independently constrained relief and subsidence.' },
  { title: 'Which basins exchanged water?', needed: 'A dated passage and sill geometry, then independently correlated sedimentary, fossil or geochemical records on both sides.' },
  { title: 'How far did low oxygen extend?', needed: 'Multiple dated sections with complementary redox proxies and checks for local preservation and reworking.' },
  { title: 'How different are the model frames?', needed: 'Equivalent restored sites in each model, matched rotations and residuals in a common reference frame.' },
] as const;
