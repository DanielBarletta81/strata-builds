# NOAA response fixtures

The three JSON files retain the contents of the NOAA Signals Lab fixtures at [037ad9ac03a8e7d1366e42c81b57eea7aa75fbe4](https://github.com/DanielBarletta81/noaa-signals-lab/tree/037ad9ac03a8e7d1366e42c81b57eea7aa75fbe4/server/test/fixtures). NOAA CO-OPS supplied the responses. Capture dates follow the upstream provenance log.

| File | NOAA request and response |
| --- | --- |
| `providence-hourly.json` | Providence `8454000`, `water_temperature`, GMT, metric, hourly, 24 hours. Captured 2026-11-13 to approximately 00:00 UTC on 2026-11-14. Contains 24 original rows and the station metadata. |
| `ambiguous-no-data.json` | Same station and product, requested 2030-01-01 to 2030-01-02 GMT. Captured 2026-11-13, HTTP 200 with an ambiguous no-data error object. |
| `invalid-station.json` | Invalid station `0000000`, captured 2026-11-13, HTTP 400 with an error object. |

Unit tests modify copies for validation and chart-gap cases. The production-route test starts a child process with `fetch-stub.mjs` to replay NOAA-shaped complete, partial, ambiguous, and failed responses. That stub adjusts timestamps to the requested window and intentionally introduces validation and flag cases. These replays are test inputs. The deployed application obtains observations from the NOAA source URL.
