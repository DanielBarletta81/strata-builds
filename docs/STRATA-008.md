# STRATA-008 · Estuarine Gradient Observatory

The first `/oceanography` route tracks the Seekonk and Providence Rivers through the Upper Bay and Prudence Island reach to a lower West Passage reference. Five verified station markers and corresponding native buttons control the geographic, nutrient, and fixed-site views. The homepage links to the route.

## Scientific scope

- **Paired surface chemistry.** NBC’s 2025 Phillipsdale and Bullock Reach rows contribute nine and five same-row nitrate + nitrite and salinity pairs. The modern Tank-98 dock subset contributes 20 pairs in its own units. Samples, reporting-limit tokens, missing fields and review notes are available in the record inspector.
- **Water column.** Change the archive time within a four-hour edited RIDEM window, with exact station, worksheet, depth, salinity, dissolved oxygen and temperature locators. The north-to-south table compares near-surface values at one archive slot. GSO Dock has a mid-depth reading only. The conceptual salt-wedge diagram is explicitly educational. Observed readings are shown as discrete sensor samples.
- **Research limitations.** Co-sampled measurements establish numerical pairs, and the archived snapshots support a selected-time depth comparison. The inspected fields leave the role of freshwater discharge, mixing, circulation and oxygen demand unresolved. The lower Bay reference does not establish an offshore endmember. CHRP pairing needs a provider-confirmed location/depth/time crosswalk and unit clarification.
- **Pawtuxet Cove.** The unpublished retrospective case stub was prepared separately for the author. Field observations, attributed correspondence and unpublished records are outside the public route and repository.

[Source audit, site evidence, methods and rights](ESTUARINE_GRADIENT_SOURCE_AUDIT.md)

## Reproduce the fixture

Use the source audit URLs and hashes. Put the original files in a temporary directory as `nbfsmn12.zip`, `nbc2025.xlsx`, `tank.xlsx`, and `water001.zip`, `water003.zip`, `water005.zip`, `water007.zip`, `water009.zip`. A previously hash-verified archive copy is sufficient. Use an isolated Python environment. The script validates byte-level source hashes, verifies field units and projects only the needed fields. Production and routine CI read tracked captures.

```sh
python3 -m venv /tmp/strata-008-audit-env
/tmp/strata-008-audit-env/bin/pip install xlrd==2.0.2 openpyxl==3.1.5 pyshp==2.3.1 shapely==2.0.7
mkdir -p /tmp/strata-008-reproduction
/tmp/strata-008-audit-env/bin/python scripts/extract-oceanography.py /path/to/pinned-inputs /tmp/strata-008-reproduction
diff -rq /tmp/strata-008-reproduction src/features/oceanography/data
```

## Next evidence

Obtain same-event, tide-stamped nutrients, surface-to-bottom salinity and oxygen profiles, and independent river discharge or current records along both main Bay passages. Confirm the CHRP station keys, sample depths, clock provenance and concentration units before considering a crosswalk. These steps would help distinguish along-channel changes from tidal phase, freshwater inflow, and oxygen production or consumption.

## Verification

Node 24.22.3 and npm 11.19.1. Lint, typecheck, 43 unit tests, production build and 18 route smoke tests passed. Both data fixtures reproduced byte for byte. Chromium checks at 375, 768 and 1440 px exercised all station selections, the observed/conceptual switch, the time and source-row controls, focus outlines and disclosures. The page fit at each width with disclosures open and had no hydration errors. [Desktop screenshot](review/strata-008-desktop.png) · [Mobile screenshot](review/strata-008-mobile.png)
