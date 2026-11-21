export const sourceLinks = {
  ridem: 'https://dem.ri.gov/environmental-protection-bureau/water-resources/research-monitoring/narraganset-bay-assessment-data',
  archive: 'https://datadem.ri.gov/documents/bart/nbfsmn12.zip',
  nbc: 'https://www.narrabay.com/programs-and-initiatives/environmental-monitoring/',
  report: 'https://www.narrabay.com/wp-content/uploads/2022/08/2012_EMDA_Data_Report.pdf',
  snapshot: 'https://www.narrabay.com/snapshot-of-the-bay/',
  trawl: 'https://web.uri.edu/gso/research/fish-trawl/data/',
  trawlMethods: 'https://web.uri.edu/gso/research/fish-trawl/methods/',
  trawlPolicy: 'https://web.uri.edu/wp-content/uploads/sites/916/fish-trawl-data-use-policy-letter.pdf',
  plankton: 'https://www.bco-dmo.org/dataset/874956',
  planktonFile: 'https://datadocs.bco-dmo.org/dataset/874956/file/5AAMkwXSglPxE4/nbpts_data_1959-2019_final.csv',
  planktonProject: 'https://web.uri.edu/gso/research/plankton/data/',
  brown: 'https://riddc.brown.edu/datasets/rhode-island-buoys',
  brownErddap: 'https://erddap.riddc.brown.edu/erddap/tabledap/combined_e784_bee5_492e.html',
};

export const stations = {
  bullock: { name: 'Bullock Reach', id: 'B4-S', lat: 41 + 44.434 / 60, lon: -(71 + 22.480 / 60) },
  plankton: { name: 'Station II', id: 'BCO-DMO 874956', lat: 41.56861, lon: -71.39194 },
};

export const sources = [
  {
    name: 'RIDEM Fixed-Site Monitoring Network',
    status: 'Edited workbook inspected',
    scope: 'Bullock Reach B4-S, 2012 edited archive',
    details: 'Temperature in °C at nominal 15-minute intervals. The reviewed worksheet covers May 17–November 26, 2012, using its printed civil dates. Site-specific edited and corrected products have different meanings.',
    rights: 'Cite the Narragansett Bay Fixed-Site Monitoring Network, 2012 Datasets, RIDEM Office of Water Resources. Strata includes derived coverage counts and slot references.',
    links: [
      { text: 'Network archive and citation', url: sourceLinks.ridem },
      { text: '2012 ZIP, 129 MiB', url: sourceLinks.archive },
    ],
  },
  {
    name: 'Narragansett Bay Commission',
    status: 'Deployment records inspected',
    scope: 'NBC 2012 report and Bullock Reach surface field notes',
    details: 'The 2012 report documents the B4 season, 0.5–1 m surface sonde and 15-minute design. NBC operates B4 for the fixed-site network. Its report and the RIDEM archive describe the same buoy program.',
    rights: 'Use the report as cited evidence. A reusable export for NBC’s separate weekly river-mapping series was not verified in this audit.',
    links: [
      { text: 'Environmental monitoring program', url: sourceLinks.nbc },
      { text: '2012 report, section 5', url: sourceLinks.report },
      { text: 'Snapshot portal', url: sourceLinks.snapshot },
    ],
  },
  {
    name: 'URI Fish Trawl Survey',
    status: 'Workbook inspected · redistribution restricted',
    scope: 'Fox Island and Whale Rock surface and bottom water temperature',
    details: 'Weekly daytime station visits are planned year-round. The linked workbook contains date, station, and surface and bottom temperature columns. Date rows observed span January 1959–December 2024, and values can be absent or replaced in documented periods.',
    rights: 'The provider’s policy requests URI-GSO and RIDEM attribution and restricts third-party distribution. The workbook stays with the provider.',
    links: [
      { text: 'URI downloads', url: sourceLinks.trawl },
      { text: 'Methods and locations', url: sourceLinks.trawlMethods },
      { text: 'Data use policy', url: sourceLinks.trawlPolicy },
    ],
  },
  {
    name: 'URI Long-Term Plankton Time Series',
    status: 'Validated temperature CSV inspected',
    scope: 'Station II · BCO-DMO 874956 v1',
    details: 'Surface bucket temperature in °C, nominally weekly. The archive supplies year and week keys from 1959–2019. The reviewed version records no temperature in 2012.',
    rights: 'Credit Tatiana Rynearson, Patricia Thibodeau, URI-GSO and BCO-DMO, DOI 10.26008/1912/bco-dmo.874956.1, CC BY 4.0. This view shows counts derived from the source.',
    links: [
      { text: 'Dataset, methods and download', url: sourceLinks.plankton },
      { text: 'URI time series', url: sourceLinks.planktonProject },
      { text: 'CC BY 4.0', url: 'https://creativecommons.org/licenses/by/4.0/' },
    ],
  },
  {
    name: 'Brown Narragansett Bay Data Explorer',
    status: 'ERDDAP records inspected',
    scope: 'RI Buoy Data · combined_e784_bee5_492e',
    details: 'A July 1, 2012 test query returned UTC timestamps, station code bid5, geographic coordinates and surface temperature in °C. Brown compiles RIDEM network records. No code crosswalk was verified for substitution against the selected B4 archive.',
    rights: 'The ERDDAP record permits free reuse and asks readers to respect accuracy limits. The Explorer also requests original network citations.',
    links: [
      { text: 'Brown RI Buoys explorer', url: sourceLinks.brown },
      { text: 'ERDDAP metadata and API', url: sourceLinks.brownErddap },
    ],
  },
];
