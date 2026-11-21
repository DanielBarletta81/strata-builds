# Reconciliation method

An evidence reconciliation concerns specific source records. The shared `src/features/evidence/reconciliation/` model keeps it separate from existing `SourceGap` and `ResearchGap` findings. This mission reviewed only near-surface B4-S sonde temperature in a six-slot window and Station II archive presence in four selected years.

1. **Pin the sources.** Use the archived product names, source versions, retrieval times, and byte-level SHA-256 hashes. Reject a different file before reading its rows. Record access limits separately for each product. A later capture needs a new receipt and a comparison against this release.
2. **Preserve the source labels.** Use original logger civil labels, workbook grid labels, and published year/week keys. A workbook's native Excel date system is part of the extraction. Keep other sources' time bases and station labels with their own records.
3. **Choose comparable records.** Match within the same station, variable, units, date, source file and bounded time scope. Use an exact source key or an offset justified by documented processing and independent anchors in the window. Record multiplicity, missing timestamps, and absent or inaccessible sources separately. No best-neighbor acceptance or silent UTC conversion.
4. **Keep values and interpretations separate.** The raw logger, edited workbook and corrected workbook retain distinct locators and display labels. “Calculated” is supported by the corrected workbook's own style and Notes tab. Edited exclusion markers are properties of that worksheet. A marker alone cannot establish a raw precursor or the reason it was excluded. The Station II projection exposes numeric presence and the published sentinel. It does not use archive numbers to estimate unobserved weeks.
5. **Assign a scoped outcome.** A matching key plus agreement resolves that record comparison. A confirmed step with missing provenance is partially resolved. Comparable records that disagree leave an unresolved source conflict. Missing or inaccessible files can leave a comparison unresolved due to missing records. Unverified compatibility or ambiguous keys make records not comparable. The interface states the remaining alternatives and names the evidence needed next.

## Reproduce the primary captures

The application and routine CI use tracked derived fixtures with zero upstream requests. Re-extraction requires Python 3 and `xlrd 2.0.2`, only for reading the pinned binary XLS workbooks and Excel dates. The revised XLSX is inspected directly as ZIP/XML without recalculation. Use an isolated Python environment for this audit.

```bash
audit_dir=$(mktemp -d)
python3 -m venv "$audit_dir/venv"
"$audit_dir/venv/bin/pip" install xlrd==2.0.2
curl -fL 'https://datadem.ri.gov/documents/bart/nbfsmn12.zip' -o "$audit_dir/nbfsmn12.zip"
curl -fL 'https://datadocs.bco-dmo.org/dataset/874956/file/5AAMkwXSglPxE4/nbpts_data_1959-2019_final.csv' -o "$audit_dir/nbpts_data_1959-2019_final.csv"
curl -fL 'https://www.narrbay.org/d_projects/plankton-tsv/d_data/d_physical/Temperature.zip' -o "$audit_dir/Temperature.zip"
"$audit_dir/venv/bin/python" scripts/extract-reconciliation.py \
  "$audit_dir/nbfsmn12.zip" "$audit_dir/nbpts_data_1959-2019_final.csv" \
  "$audit_dir/Temperature.zip" > "$audit_dir/primary.json"
cmp "$audit_dir/primary.json" src/features/evidence/reconciliation/data/primary.json
shasum -a 256 "$audit_dir/primary.json"
node --test test/reconciliation.test.mjs
```

A verified local copy can replace a download. The script reads the parent RIDEM archive once and opens only the three nested B4 products and two relevant metadata documents. No archive is expanded wholesale. It reads the surface exports and projects the stated time bounds plus two investigated clock anchors. It verifies and records all input and member digests. The full capture hash is `4ef410e37c41ef1186e31dfb61e20013d9beddc7b68526d5ee1d533dea430122`. A changed upstream hash stops reproduction and warrants a separate version audit.

For manual annotation on macOS, extract the two pinned DOC members to the audit directory and use `textutil -convert txt -stdout` on each. Use Notes rows 5–7 in both workbooks for QA conventions. Use the BCO-DMO Methods & Sampling text or pinned description PDF for the collection statement. [Bullock Reach source paths and locators](reconciliation/BULLOCK_REACH_2012.md) · [Station II source paths and locators](reconciliation/STATION_II_HISTORY.md)

## Data boundaries

The capture retains a six-slot table and two ancillary raw clock anchors with attribution, published Station II field states and row locations, and summary evidence from the legacy workbook. The original archives and restricted URI Fish Trawl rows remain with their providers. Auxiliary sources are reported as provenance leads with their own hashes and release boundaries. The route has no environmental gap filling, inferred sample dates, or program-wide claims from any single release.
