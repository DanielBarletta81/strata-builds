"""Extract the Pawtuxet Cove subset of the pinned NBC profiler workbooks."""

import argparse
from collections import defaultdict
from datetime import datetime, time
from hashlib import sha256
from io import BytesIO
import json
from pathlib import Path

from openpyxl import load_workbook

STATION = "Pawtuxet Cove"
WORKBOOKS = {
    2014: "7bdd16823a2d46199e6a4eb0939067b4b20d7a1d1a2858443779a10c20ddeaed",
    2016: "9a6e14530f83ef7eece531a45ffc3a41053681cc5421d1db1157155dcdb51086",
}
FIELDS = {
    "depth": ("E", "Depth (m)"),
    "temperature": ("F", "Temperature (C)"),
    "oxygen": ("J", "Oxygen (mg/L)"),
    "density": ("L", "Density (kg/m3)"),
    "salinity": ("M", "Salinity (psu)"),
}


def extract(year, path):
    original = path.read_bytes()
    if sha256(original).hexdigest() != WORKBOOKS[year]:
        raise ValueError(f"Workbook hash changed: {path.name}")

    book = load_workbook(BytesIO(original), read_only=True, data_only=True)
    data = book[f"{year} Data"]
    metadata = book[f"{year} Metadata"]
    if [data[f"{column}2"].value for column, _ in FIELDS.values()] != [label for _, label in FIELDS.values()]:
        raise ValueError(f"Unexpected field names or units in {data.title}")
    if metadata["J1"].value != STATION:
        raise ValueError(f"Unexpected metadata station in {metadata.title}")

    visits = {}
    for row, cells in enumerate(metadata.iter_rows(min_row=3, max_col=13, values_only=True), 3):
        day, mark, note = cells[0], cells[9], cells[12]
        if not isinstance(day, datetime) or not mark:
            continue
        date = day.date().isoformat()
        if date in visits:
            raise ValueError(f"Duplicate metadata date: {date}")
        visits[date] = {"date": date, "metadataRow": row, "mark": mark, "note": note}

    casts = defaultdict(list)
    for row, cells in enumerate(data.iter_rows(min_row=3, max_col=13, values_only=True), 3):
        if cells[0] != STATION:
            continue
        date, clock = cells[1:3]
        if not isinstance(date, datetime) or not isinstance(clock, time):
            raise ValueError(f"Unresolved source clock at {data.title}!B{row}:C{row}")
        cast = (date.date().isoformat(), clock.isoformat(timespec="seconds"))
        record = {field: cells[ord(col) - ord("A")] for field, (col, _) in FIELDS.items()}
        casts[cast].append({"row": row, **record})

    available = {date for date, _ in casts}
    if available - visits.keys():
        raise ValueError("Published cast has no matching station date in the metadata")
    events = [
        {**visits[date], "year": year, "clock": clock, "records": rows}
        for (date, clock), rows in casts.items()
    ]
    events.extend(
        {**visit, "year": year, "clock": None, "records": []}
        for date, visit in visits.items()
        if date not in available
    )
    return sorted(events, key=lambda event: (event["date"], event["clock"] or ""))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path)
    args = parser.parse_args()
    events = [
        event
        for year in WORKBOOKS
        for event in extract(year, args.input / f"{year}-Water-Column-Profile-Data.xlsx")
    ]
    print(json.dumps({"station": STATION, "hashes": WORKBOOKS, "events": events}, indent=2, allow_nan=False))


if __name__ == "__main__":
    main()
