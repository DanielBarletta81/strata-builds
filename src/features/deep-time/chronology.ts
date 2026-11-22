import type { Evidence } from './sources.ts';

type DateEvidence =
  | { kind: 'approximate'; years: number; label: string }
  | { kind: 'interval'; older: number; younger: number; label: string }
  | { kind: 'historical'; date: string; label: string }
  | { kind: 'unresolved'; label: string };

export type GeologicalEvent = Evidence & {
  id: string;
  title: string;
  theme: 'Planet' | 'Oceans' | 'Atmosphere' | 'Biosphere' | 'Continents';
  when: DateEvidence;
  chapter?: 'primordial-ocean' | 'oxygenation' | 'tethys';
};

export const chronology: readonly GeologicalEvent[] = [
  {
    id: 'formation', title: 'Earth takes shape', theme: 'Planet',
    when: { kind: 'approximate', years: 4_540_000_000, label: '≈ 4.54 Ga' },
    classification: 'interpretation',
    supported: 'Radiometric ages and lead isotope ratios in meteorites place Earth’s formation about 4.54 billion years ago.',
    unresolved: 'Formation took time. The estimate does not identify a single day when the planet formed.',
    next: 'Compare independent isotope systems and models of the timing of accretion and core formation.',
    sources: ['earthAge'],
  },
  {
    id: 'liquid-water', title: 'Early evidence of liquid water', theme: 'Oceans', chapter: 'primordial-ocean',
    when: { kind: 'approximate', years: 4_400_000_000, label: '≈ 4.4 Ga' },
    classification: 'interpretation',
    supported: 'Oxygen isotopes in ancient Jack Hills zircons are consistent with crust that interacted with liquid water before the crystals formed.',
    unresolved: 'The surviving crystals do not establish the size, chemistry, continuity or first appearance of an ocean.',
    next: 'Compare dated, well-preserved minerals and independent indicators of water–rock interaction.',
    sources: ['zircon'],
  },
  {
    id: 'origins', title: 'Prebiotic environments and life’s origins', theme: 'Biosphere', chapter: 'primordial-ocean',
    when: { kind: 'unresolved', label: 'Date unresolved' },
    classification: 'hypothesis',
    supported: 'Submarine vents and terrestrial hot springs are among the proposed settings. Experiments test parts of several origin scenarios.',
    unresolved: 'The first location, date and sequence of events remain unknown, including whether several environments contributed.',
    next: 'Test whether proposed steps can work together under compatible conditions and compare them with geological constraints.',
    sources: ['ventEnergy', 'springs', 'coevolution'],
  },
  {
    id: 'microbial-reefs', title: 'Evidence of an early microbial biosphere', theme: 'Biosphere',
    when: { kind: 'approximate', years: 3_430_000_000, label: '≈ 3.43 Ga' },
    classification: 'interpretation',
    supported: 'Layered structures at Strelley Pool in Western Australia have been interpreted as stromatolites formed by microbial communities.',
    unresolved: 'The interpretation depends on shape and geological setting. The first life may be older than these rocks.',
    next: 'Test biological and abiotic explanations against preserved textures, chemistry and depositional setting.',
    sources: ['stromatolites'],
  },
  {
    id: 'oxygen-production', title: 'Oxygen-producing photosynthesis', theme: 'Atmosphere', chapter: 'oxygenation',
    when: { kind: 'unresolved', label: 'Origin date unresolved' },
    classification: 'interpretation',
    supported: 'Oxygenic photosynthesis releases oxygen by using water as an electron source. Biological production can precede sustained accumulation in air.',
    unresolved: 'The evolutionary origin of oxygen production and its geographic spread remain incompletely constrained.',
    next: 'Compare independently dated evidence for local oxygenation with evidence for the evolution of photosynthesis.',
    sources: ['oxygen', 'oxygenTiming'],
  },
  {
    id: 'great-oxidation', title: 'The Great Oxidation Event', theme: 'Atmosphere', chapter: 'oxygenation',
    when: { kind: 'approximate', years: 2_400_000_000, label: '≈ 2.4 Ga · onset near this time' },
    classification: 'interpretation',
    supported: 'Changes in rock sulfur isotopes indicate a transition from an oxygen-poor atmosphere. Some records suggest recurrent low-oxygen conditions before oxygen persisted.',
    unresolved: 'The timing of persistent atmospheric oxygen and the oxygen history of individual ocean basins remain distinct questions.',
    next: 'Compare well-dated sedimentary sections and multiple independent redox proxies across basins.',
    sources: ['sulphur', 'oxygenTiming', 'oxygen'],
  },
  {
    id: 'eukaryotes', title: 'Fossils interpreted as early eukaryotes', theme: 'Biosphere',
    when: { kind: 'approximate', years: 1_630_000_000, label: '≈ 1.63 Ga · fossil evidence' },
    classification: 'interpretation',
    supported: 'Filamentous microfossils from the Chuanlinggou Formation in North China have been interpreted as multicellular eukaryotes.',
    unresolved: 'The fossil age constrains when the inferred organisms existed. The evolutionary origin of eukaryotic cells may be older.',
    next: 'Compare cell morphology, preserved chemistry and the stratigraphy of independent fossil assemblages.',
    sources: ['eukaryotes'],
  },
  {
    id: 'cryogenian', title: 'Cryogenian glaciations', theme: 'Oceans',
    when: { kind: 'interval', older: 720_000_000, younger: 635_000_000, label: '≈ 720–635 Ma · Cryogenian' },
    classification: 'interpretation',
    supported: 'Glacial deposits and associated rocks record two major Cryogenian glaciations. Some deposits formed at low paleolatitudes.',
    unresolved: 'Ice extent, open-water refuges and regional conditions remain subjects of geological interpretation and modeling.',
    next: 'Combine dated deposits, paleomagnetic evidence and climate model comparisons.',
    sources: ['ics', 'cryogenian'],
  },
  {
    id: 'ediacaran', title: 'Ediacaran ecosystems', theme: 'Biosphere',
    when: { kind: 'approximate', years: 574_000_000, label: '≈ 574 Ma · dated fossil beds' },
    classification: 'interpretation',
    supported: 'Fossil-bearing surfaces in Newfoundland preserve impressions of soft-bodied organisms. Volcanic ash layers help date the assemblages.',
    unresolved: 'The relationships of many forms to later animals, and the representativeness of individual fossil surfaces, remain uncertain.',
    next: 'Compare fossil communities, preservation and dated surfaces from multiple sites.',
    sources: ['ediacaran', 'ics'],
  },
  {
    id: 'cambrian', title: 'Cambrian marine diversification', theme: 'Biosphere',
    when: { kind: 'approximate', years: 518_000_000, label: '≈ 518 Ma · Chengjiang fossil record' },
    classification: 'interpretation',
    supported: 'The Chengjiang fossil assemblage preserves diverse early Cambrian marine organisms, including soft tissues rarely preserved elsewhere.',
    unresolved: 'An exceptional fossil deposit captures part of a broader diversification, with its own environmental and preservation biases.',
    next: 'Compare dated assemblages and sampling across different marine environments.',
    sources: ['cambrian', 'ics'],
  },
  {
    id: 'ordovician', title: 'Ordovician marine diversification', theme: 'Biosphere',
    when: { kind: 'interval', older: 486_900_000, younger: 443_100_000, label: '≈ 487–443 Ma · Ordovician' },
    classification: 'interpretation',
    supported: 'Marine fossil assemblages record increases in diversity across the Ordovician, with timing and extent varying by group and region.',
    unresolved: 'Cooling has been proposed as a contributing factor. Its importance relative to other drivers is unresolved.',
    next: 'Compare fossil abundance and preservation with independent temperature records across regions.',
    sources: ['ordovician', 'ics'],
  },
  {
    id: 'tetrapods', title: 'From water toward land', theme: 'Biosphere',
    when: { kind: 'approximate', years: 375_000_000, label: '≈ 375 Ma · Devonian fossils' },
    classification: 'interpretation',
    supported: 'Tiktaalik fossils combine fish features with a mobile neck and jointed fin bones relevant to the evolution of limbed vertebrates.',
    unresolved: 'A fossil with transitional traits does not establish a direct ancestor or a single date for vertebrate life on land.',
    next: 'Compare fossil anatomy and trackways in independently dated settings.',
    sources: ['tetrapods'],
  },
  {
    id: 'tethys', title: 'Ancient Tethys Ocean', theme: 'Continents', chapter: 'tethys',
    when: { kind: 'approximate', years: 111_000_000, label: '≈ 111 Ma · Albian chapter' },
    classification: 'modeled',
    supported: 'The 111 Ma reconstruction projects the EarthByte model’s lithosphere and resolved plate boundaries for this Albian time slice.',
    unresolved: 'The geometry depends on the rotation model, reference frame and preservation of geological evidence. Seaway depth and shoreline position need separate evidence.',
    next: 'Compare dated regional structural and stratigraphic records against alternate tectonic models and independently constrained paleoshorelines.',
    sources: ['ics', 'earthbyte', 'muller'],
  },
  {
    id: 'chicxulub', title: 'Chicxulub impact and end-Cretaceous extinction', theme: 'Planet',
    when: { kind: 'approximate', years: 66_000_000, label: '66 Ma · Cretaceous–Paleogene boundary' },
    classification: 'interpretation',
    supported: 'The crater and widely distributed impact ejecta coincide with the extinction boundary. Their association supports the impact as the principal trigger.',
    unresolved: 'Ecosystem responses varied, and the relative roles of pre-impact stresses and different extinction mechanisms remain active research.',
    next: 'Compare the timing of ejecta, ecosystem changes and recovery in high-resolution stratigraphic records.',
    sources: ['chicxulub', 'ics'],
  },
  {
    id: 'glacial-maximum', title: 'Last Glacial Maximum', theme: 'Oceans',
    when: { kind: 'interval', older: 26_500, younger: 19_000, label: '≈ 26.5–19 ka' },
    classification: 'interpretation',
    supported: 'A dated synthesis places the maximum extent of most ice sheets within this interval, when much more water was locked up in land ice.',
    unresolved: 'Individual glaciers reached maximum extent and retreated at different times.',
    next: 'Compare regional ice-margin chronologies, marine records and evidence for changing sea level.',
    sources: ['glacial'],
  },
  {
    id: 'holocene', title: 'The Holocene begins', theme: 'Planet',
    when: { kind: 'approximate', years: 11_700, label: '11.7 ka before 2000 CE · formal boundary' },
    classification: 'documented',
    supported: 'The formal Holocene boundary is defined in a Greenland ice core by a transition following the Younger Dryas cold interval.',
    unresolved: 'The reference boundary provides a common time marker. Regional climates did not all change at the same rate.',
    next: 'Compare independently dated regional records across the reference boundary.',
    sources: ['holocene', 'ics'],
  },
  {
    id: 'voyager-launch', title: 'The Voyager era begins', theme: 'Planet',
    when: { kind: 'historical', date: '1977-09-05', label: 'September 5, 1977' },
    classification: 'documented',
    supported: 'Voyager 1 launched from Earth on its way to Jupiter and Saturn. The mission provides a familiar reference point for the historical scale.',
    unresolved: 'This is one historical marker in a curated chronology of much longer planetary change.',
    next: 'Follow the mission dates and source epochs in the Voyager observatory.',
    sources: ['voyagerLaunch'],
  },
  {
    id: 'modern-earth', title: 'Modern Earth · one light-day', theme: 'Planet',
    when: { kind: 'historical', date: '2026-11-18', label: 'November 18, 2026' },
    classification: 'documented',
    supported: 'NASA dated Voyager 1’s one-light-day milestone to November 18, 2026. This is the reference year at the recent end of this timeline.',
    unresolved: 'Historical dates represent a thin span of geological time. They are shown at a navigable scale.',
    next: 'Compare Earth events and the Voyager record in the parallel timeline.',
    sources: ['voyagerMilestone'],
  },
];
