export const sourceReviewDate = '2026-11-22';

export const sources = {
  earthAge: { label: 'USGS · Age of the Earth', url: 'https://pubs.usgs.gov/gip/geotime/age.html' },
  zircon: { label: 'Wilde et al. (2001) · Jack Hills zircons', url: 'https://pubmed.ncbi.nlm.nih.gov/11196637/' },
  stromatolites: { label: 'Allwood et al. (2006) · Strelley Pool stromatolites', url: 'https://doi.org/10.1038/nature04764' },
  ventEnergy: { label: 'Lane & Martin (2012) · Membrane bioenergetics', url: 'https://doi.org/10.1016/j.cell.2012.11.050' },
  springs: { label: 'Damer & Deamer (2020) · Hot spring hypothesis', url: 'https://doi.org/10.1089/ast.2019.2045' },
  bennu: { label: 'NASA · Organic compounds in Bennu samples', url: 'https://www.nasa.gov/news-release/nasas-asteroid-bennu-sample-reveals-mix-of-lifes-ingredients/' },
  rna: { label: 'Lincoln & Joyce (2009) · RNA enzyme replication', url: 'https://pubmed.ncbi.nlm.nih.gov/19131595/' },
  metabolism: { label: 'Huber & Wächtershäuser (1997) · Mineral-associated carbon chemistry', url: 'https://doi.org/10.1126/science.276.5310.245' },
  protocell: { label: 'Mansy et al. (2008) · Model protocells', url: 'https://doi.org/10.1038/nature07018' },
  coevolution: { label: 'Patel et al. (2015) · Common molecular precursors', url: 'https://pubmed.ncbi.nlm.nih.gov/25803468/' },
  oxygen: { label: 'Lyons et al. (2014) · Ocean and atmospheric oxygenation', url: 'https://doi.org/10.1038/nature13068' },
  sulphur: { label: 'Farquhar et al. (2000) · Sulfur-isotope proxy', url: 'https://pubmed.ncbi.nlm.nih.gov/10926533/' },
  oxygenTiming: { label: 'Poulton et al. (2021) · Permanent atmospheric oxygenation', url: 'https://doi.org/10.1038/s41586-021-03393-7' },
  eukaryotes: { label: 'Miao et al. (2024) · Chuanlinggou microfossils', url: 'https://pubmed.ncbi.nlm.nih.gov/38266082/' },
  ics: { label: 'ICS · International Chronostratigraphic Chart (2026/06)', url: 'https://stratigraphy.org/ICSchart/ChronostratChart2026-06.pdf' },
  cryogenian: { label: 'Hoffman et al. (2017) · Cryogenian geology and climate', url: 'https://pubmed.ncbi.nlm.nih.gov/29134193/' },
  ediacaran: { label: 'Matthews et al. (2021) · Mistaken Point chronology', url: 'https://ora.ox.ac.uk/objects/uuid:8891e6c5-3fef-459e-a45d-3a8ab82d4cae' },
  cambrian: { label: 'Yang et al. (2018) · Chengjiang biota geochronology', url: 'https://nora.nerc.ac.uk/id/eprint/521412/' },
  ordovician: { label: 'Trotter et al. (2008) · Ordovician biodiversity and cooling', url: 'https://pubmed.ncbi.nlm.nih.gov/18653889/' },
  tetrapods: { label: 'Daeschler et al. (2006) · Devonian tetrapod-like fish', url: 'https://doi.org/10.1038/nature04639' },
  earthbyte: { label: 'EarthByte · GPlates 2.3 data and terms', url: 'https://www.earthbyte.org/gplates-2-3-software-and-data-sets/' },
  muller: { label: 'Müller et al. (2019) · Global plate model', url: 'https://doi.org/10.1029/2018TC005462' },
  matthews: { label: 'EarthByte · GPlates 2.0 data and terms', url: 'https://www.earthbyte.org/gplates-2-0-software-and-data-sets/' },
  chicxulub: { label: 'Schulte et al. (2010) · Chicxulub and the K–Pg boundary', url: 'https://pubmed.ncbi.nlm.nih.gov/20203042/' },
  glacial: { label: 'Clark et al. (2009) · Last Glacial Maximum', url: 'https://pubmed.ncbi.nlm.nih.gov/19661421/' },
  holocene: { label: 'Walker et al. (2009) · Holocene boundary in Greenland ice', url: 'https://stratigraphy.org/gssps/files/holocene.pdf' },
  voyagerLaunch: { label: 'NASA · Voyager 1 mission history', url: 'https://science.nasa.gov/mission/voyager/voyager-1/' },
  voyagerMilestone: { label: 'NASA · One-light-day milestone confirmation', url: 'https://www.nasa.gov/news-release/nasas-voyager-1-makes-history-reaching-one-light-day-from-earth/' },
} as const;

export type SourceId = keyof typeof sources;

export const evidenceClasses = {
  documented: 'Observed or documented',
  interpretation: 'Geological interpretation',
  modeled: 'Modeled reconstruction',
  hypothesis: 'Hypothesis',
} as const;

export type EvidenceClass = keyof typeof evidenceClasses;

export type Evidence = {
  classification: EvidenceClass;
  supported: string;
  unresolved: string;
  next: string;
  sources: readonly [SourceId, ...SourceId[]];
};
