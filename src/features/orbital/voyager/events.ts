export type EvidenceSource = { name: string; url: string };

export const nasaMission = {
  name: 'NASA Voyager 1 mission history',
  url: 'https://science.nasa.gov/mission/voyager/voyager-1/',
};

export const nasaMilestone = {
  name: 'NASA milestone confirmation',
  url: 'https://www.nasa.gov/news-release/nasas-voyager-1-makes-history-reaching-one-light-day-from-earth/',
};

export const nasaInterruption = {
  name: 'NASA November 18 engineering update',
  url: 'https://science.nasa.gov/blogs/voyager/2026/11/18/voyager-1-engineers-analyze-data-issue-ready-to-confirm-light-day/',
};

export const paleBlueDot = {
  name: 'NASA/JPL-Caltech · PIA23645',
  url: 'https://science.nasa.gov/resource/voyager-pale-blue-dot-download/',
};

export type DatedEvent = {
  date: string;
  title: string;
  short: string;
  description: string;
  source: EvidenceSource;
};

export const milestone = '2026-11-18';

export const voyagerEvents: readonly DatedEvent[] = [
  { date: '1977-09-05', title: 'Voyager 1 launches', short: 'Launch', description: 'Voyager 1 lifted off at 12:56:01 UT on its way to Jupiter and Saturn. The selected model sample is several hours after liftoff.', source: nasaMission },
  { date: '1979-03-05', title: 'Jupiter flyby', short: 'Jupiter', description: 'Voyager 1 made its closest approach to Jupiter. Images from the encounter showed active volcanism on Io.', source: nasaMission },
  { date: '1980-11-12', title: 'Saturn flyby', short: 'Saturn', description: 'The Saturn encounter included a close pass of Titan. The gravity assist sent Voyager 1 out of the plane of the planets.', source: nasaMission },
  { date: '1990-02-14', title: 'Pale Blue Dot', short: 'Pale Blue Dot', description: 'Voyager 1 turned its camera toward the inner solar system and photographed Earth at 04:48 GMT. The tiny point in the sunbeam is Earth.', source: { name: 'NASA Pale Blue Dot image history', url: 'https://science.nasa.gov/mission/voyager/voyager-1s-pale-blue-dot/' } },
  { date: '1998-02-17', title: 'Voyager 1 overtakes Pioneer 10', short: 'Passes Pioneer 10', description: 'NASA records Voyager 1 becoming the most distant human-made object. It was then about 69.4 AU from the Sun.', source: nasaMission },
  { date: '2006-08-16', title: '100 AU from the Sun', short: '100 AU from Sun', description: 'Voyager 1 reached a heliocentric distance of 100 astronomical units. The Earth-centered distance at this date has a different value.', source: nasaMission },
  { date: '2012-08-25', title: 'Voyager 1 crosses the heliopause', short: 'Heliopause', description: 'The spacecraft crossed the boundary between the solar wind and the interstellar environment. NASA dates the crossing to August 25, 2012.', source: nasaMission },
  { date: milestone, title: 'One light-day from Earth', short: 'One light-day', description: 'Voyager 1 reached the milestone around 10:16 UTC on November 18. NASA confirmed it on November 19 using the carrier signal and trajectory calculations.', source: nasaMilestone },
];

export const earthLenses = ['Science', 'Computing', 'Environment', 'Human history'] as const;
export type EarthLens = typeof earthLenses[number] | 'All events';
export type EarthEvent = DatedEvent & { category: typeof earthLenses[number]; through?: string };

export const earthEvents: readonly EarthEvent[] = [
  { date: '1977-10-26', title: 'Last known naturally acquired smallpox case', short: 'Smallpox milestone', category: 'Human history', description: 'A WHO report dates symptom onset in the last known naturally acquired case to October 26 in Somalia. WHO certified global eradication in 1980.', source: { name: 'WHO World Health Assembly report', url: 'https://iris.who.int/bitstream/handle/10665/149778/WHA31_20_eng.pdf?sequence=1' } },
  { date: '1981-08-12', title: 'IBM introduces its Personal Computer', short: 'IBM PC', category: 'Computing', description: 'IBM unveiled the 5150 in New York. Its architecture helped establish a broad market for compatible components and software.', source: { name: 'IBM history of the PC', url: 'https://www.ibm.com/history/personal-computer' } },
  { date: '1987-09-16', title: 'Montreal Protocol adopted', short: 'Montreal Protocol', category: 'Environment', description: 'Governments adopted an agreement to control chemicals that deplete the ozone layer. The date marks a policy decision.', source: { name: 'UNEP Ozone Secretariat', url: 'https://ozone.unep.org/ozone-timeline' } },
  { date: '1989-11-09', title: 'Berlin Wall crossings open', short: 'Berlin Wall opens', category: 'Human history', description: 'Border guards opened crossings between East and West Berlin after an announcement about travel rules drew crowds to the checkpoints.', source: { name: 'German Federal Government historical archive', url: 'https://www.bundesregierung.de/breg-de/schwerpunkte/deutsche-einheit/die-mauer-ist-offen--403858' } },
  { date: '1993-04-30', title: 'CERN releases Web software to the public domain', short: 'Web released', category: 'Computing', description: 'CERN released its basic Web client, server and shared code library, letting others develop and use the software freely.', source: { name: 'CERN Web licensing history', url: 'https://home.cern/science/computing/the-birth-of-the-web/licensing-web/' } },
  { date: '2000-06-26', title: 'Human genome working draft announced', short: 'Genome draft', category: 'Science', description: 'The International Human Genome Sequencing Consortium announced a working draft. Its sequencing and assembly work continued after the announcement.', source: { name: 'NHGRI Human Genome Project timeline', url: 'https://www.genome.gov/human-genome-project/timeline' } },
  { date: '2012-07-04', title: 'CERN announces a Higgs-like particle', short: 'Higgs announcement', category: 'Science', description: 'The ATLAS and CMS teams announced preliminary results consistent with the Higgs boson. Further analysis was needed to establish its properties.', source: { name: 'CERN announcement', url: 'https://home.cern/cern-experiments-observe-particle-consistent-with-long-sought-higgs-boson/' } },
  { date: '2015-12-12', title: 'Paris Agreement adopted', short: 'Paris Agreement', category: 'Environment', description: 'Parties to the UN climate convention adopted the Paris Agreement at COP21. It entered into force in November 2016.', source: { name: 'UNFCCC Paris Agreement', url: 'https://unfccc.int/process-and-meetings/the-paris-agreement' } },
  { date: '2019-04-10', title: 'First black hole image unveiled', short: 'First black hole image', category: 'Science', description: 'The Event Horizon Telescope collaboration released an image of the shadow and surrounding emission of the black hole in Messier 87.', source: { name: 'ESO and Event Horizon Telescope release', url: 'https://www.eso.org/public/news/eso1907/' } },
  { date: '2022-07-12', title: 'Webb’s first full-color image set released', short: 'Webb first images', category: 'Science', description: 'NASA and its partners shared the first full-color image set and spectra from the James Webb Space Telescope.', source: { name: 'NASA Webb image release', url: 'https://www.nasa.gov/news-release/nasa-reveals-webb-telescopes-first-images-of-unseen-universe/' } },
  { date: '2026-04-10', title: 'Artemis II returns to Earth', short: 'Artemis II returns', category: 'Human history', description: 'Four astronauts splashed down in the Pacific after a crewed test flight around the Moon.', source: { name: 'NASA Artemis II mission release', url: 'https://www.nasa.gov/news-release/nasa-welcomes-record-setting-artemis-ii-moonfarers-back-to-earth/' } },
  { date: '2026-11-09', through: '2026-11-20', title: 'COP31 convenes in Antalya', short: 'COP31', category: 'Environment', description: 'The UN climate conference took place in Antalya, Türkiye, from November 9 to 20. Voyager’s milestone falls within the documented conference dates.', source: { name: 'UNFCCC COP31 conference record', url: 'https://unfccc.int/cop31' } },
];

export const sourcesReviewedOn = '2026-11-22';
