import type { EvidenceClass, SourceId } from './sources.ts';

type ChapterNote = {
  id: string;
  title: string;
  classification: EvidenceClass;
  text: string;
  sources: readonly [SourceId, ...SourceId[]];
};

export const settings: readonly ChapterNote[] = [
  {
    id: 'vents', title: 'Chemical gradients at vents', classification: 'hypothesis',
    text: 'At some modern vents, alkaline fluids meet seawater across mineral surfaces, creating pH and chemical gradients. Origin models ask whether similar early settings could have supplied energy and concentrated reactants. Their historical role remains unresolved.',
    sources: ['ventEnergy'],
  },
  {
    id: 'springs', title: 'Pools and wet–dry cycles', classification: 'hypothesis',
    text: 'A terrestrial hot-spring hypothesis emphasizes cycles of wetting and drying, which can concentrate solutes and bring molecules together. The availability and importance of such settings on early Earth remain uncertain.',
    sources: ['springs', 'zircon'],
  },
  {
    id: 'bennu', title: 'Organics beyond Earth', classification: 'documented',
    text: 'Returned asteroid Bennu samples contain organic compounds, including amino acids and nucleobases. Organic delivery to early Earth is plausible. The samples do not establish how much arrived or whether these inputs contributed to life’s origin.',
    sources: ['bennu'],
  },
  {
    id: 'anoxic', title: 'An origin without free oxygen', classification: 'interpretation',
    text: 'The early atmosphere had little free oxygen. Origin hypotheses can draw on chemical gradients and reactions that require no free molecular oxygen. Biological oxygen production and its later buildup in the atmosphere are separate questions.',
    sources: ['ventEnergy', 'oxygen'],
  },
];

export const originHypotheses: readonly ChapterNote[] = [
  {
    id: 'rna', title: 'RNA-first', classification: 'hypothesis',
    text: 'Information storage and catalysis could have come together in RNA-like molecules. Experiments show selected RNA enzymes can support replication under laboratory conditions. How such systems arose and persisted on early Earth remains uncertain.',
    sources: ['rna'],
  },
  {
    id: 'metabolism', title: 'Metabolism-first', classification: 'hypothesis',
    text: 'Energy-driven chemical networks may have preceded genetic inheritance. Experiments show that minerals can support some relevant carbon reactions. The emergence of a sustained, heritable network remains unresolved.',
    sources: ['metabolism', 'ventEnergy'],
  },
  {
    id: 'protocell', title: 'Protocell-first', classification: 'hypothesis',
    text: 'Compartments could have kept molecules together before modern cells existed. Model vesicles demonstrate some compatible functions in the laboratory. The order in which boundaries, energy use and inheritance appeared remains open.',
    sources: ['protocell'],
  },
  {
    id: 'coevolution', title: 'Co-evolution', classification: 'hypothesis',
    text: 'Information, metabolism and compartments may have developed together. Experiments show that some molecular building blocks can share precursors. A self-sustaining origin sequence remains unverified.',
    sources: ['coevolution', 'protocell'],
  },
];

type OxygenPhase = {
  id: string;
  name: string;
  takeaway: string;
  atmosphere: string;
  oceans: string;
  proxies: string;
  sources: readonly [SourceId, ...SourceId[]];
};

export const oxygenPhases: readonly OxygenPhase[] = [
  {
    id: 'oxygen-poor', name: 'Oxygen-poor Earth',
    takeaway: 'Rock chemistry supports a long interval with very little free atmospheric oxygen.',
    atmosphere: 'Low free oxygen is inferred for much of the Archean.',
    oceans: 'Conditions varied. Many ancient waters contained dissolved iron in its reduced form.',
    proxies: 'Unusual sulfur isotope patterns in sedimentary rocks are evidence for atmospheric chemistry under low oxygen.',
    sources: ['sulphur', 'oxygen'],
  },
  {
    id: 'sources-sinks', name: 'Production and sinks',
    takeaway: 'Photosynthesis can produce oxygen while reactions consume it.',
    atmosphere: 'Reduced volcanic gases and reactions with rocks can consume oxygen. Burial of organic carbon can help oxygen accumulate over time.',
    oceans: 'Oxygen-producing microbes can oxygenate local water. Dissolved reduced iron and other reactions can remove the oxygen they release.',
    proxies: 'Local redox signatures can reflect oxygen in some waters while the atmosphere remains oxygen-poor. The first origin of oxygenic photosynthesis remains undated here.',
    sources: ['oxygen', 'oxygenTiming'],
  },
  {
    id: 'atmospheric-turn', name: 'Atmospheric transition',
    takeaway: 'Around 2.4 Ga, sulfur isotope records change as atmospheric chemistry shifts.',
    atmosphere: 'Atmospheric oxygen became more persistent over a prolonged transition. Some strata support reversals back to low-oxygen conditions.',
    oceans: 'An atmospheric transition can coexist with oxygen-poor deeper waters. Ocean chemistry depends on circulation and local consumption.',
    proxies: 'Loss and recurrence of distinctive sulfur isotope signals constrain timing. The proxy provides no direct oxygen concentration.',
    sources: ['sulphur', 'oxygenTiming', 'oxygen'],
  },
  {
    id: 'uneven-oceans', name: 'Uneven ocean oxygenation',
    takeaway: 'Ocean oxygenation was geographically uneven and continued long after the atmospheric transition.',
    atmosphere: 'Atmospheric oxygen history and the redox history of any one basin require distinct evidence.',
    oceans: 'Oxygenated surface waters could overlie deeper water with little oxygen. The extent and persistence varied across basins and time.',
    proxies: 'Iron speciation and redox-sensitive elements help constrain local water chemistry. Independent sections are needed to infer wider patterns.',
    sources: ['oxygen', 'oxygenTiming'],
  },
];
