"""Build the bounded oceanography fixtures from byte-pinned local source files."""
import argparse
from datetime import datetime
from hashlib import sha256
from io import BytesIO
import json
from math import isfinite
from pathlib import Path
from zipfile import ZipFile

from openpyxl import load_workbook
import shapefile
from shapely.geometry import box, shape
from shapely.ops import unary_union
import xlrd

ARCHIVE = "faa31c9b5bc784cd1971807fa873d4f7242f87bb662798374bbc837e1a48e8e4"
NBC = "a9e35a8f558f1a8171f742c198f06b87512bde13e9f6ae96bcc9150709ac1de8"
TANK = "b8df8b953715adf997295c258b6db6f26fd8c330e6cf3be69756edf7b2c83977"
DAY = "2012-07-10"
CLOCKS = [f"{m // 60:02d}:{m % 60:02d}" for m in range(480, 721, 15)]
FIELDS = {"temperature": 5, "salinity": 7, "oxygen": 9, "depth": 10}
# Workbook layout is pinned to the named worksheets in the 2012 archive.
BOOKS = {
    "F4": ("F4.NBC.Phillipsdale/F4.nbcPD2012.editted.xls", "PD", [("Surface", 0), ("Bottom", 15)], 7, "ed5412ace2d1698b8842a12bd5617aec706b3e50b64abff86f437e63976a015d"),
    "B4": ("B4.NBC.Bullock Reach/B4.nbcBR2012.editted.zip", "BR", [("Surface", 0), ("Mid-depth", 15), ("Bottom", 30)], 7, "b801a00f9c73810a90fcae3830194133dfda4a9cc044e936fe390cdad3b4d0be"),
    "B3": ("B3.gso.Conimicut Point/B3.gsoCP2012.editted.zip", "CP", [("Surface", 0), ("Bottom", 15)], 7, "6930922888cc08a9d05499bd6955226f24f380d7307672c3ccff3bdf45c6e151"),
    "F3": ("F3.nar.T Wharf/F3.narTW2012.editted.xls", "TW", [("Surface", 0), ("Bottom", 15)], 7, "eefb74c6785dfedd5d09ef515805bf52b4fefdb6ea4b1c36564ec1a9e881abb7"),
    "F7": ("F7.gsoGSO Dock/F7.gsoGD2012.editted.xls", "2012GD", [("Mid-depth", 0)], 6, "9cbe7b384a3f72df79197a8d6c8cf9044e78a29817b01f3e6a0ab8cd490a2dcb"),
}

WATER = {
    "001": "edda0ca2bf15a8453724ac803f25f65c6e96f2e17e5f50c2eabb3f4d4c639140",
    "003": "91625ff53ab57424a1865ef5ecfdac9c222ec70b30d53ac563ca4fd66b4e9150",
    "005": "e0981f48ed49aa4a788d6050b88a652436c414fef8b7affe575c8e861829b6c6",
    "007": "3e4bd9cfe184ee07940e7ff3354b821feb257f317db9eccf73625aa8ea138c00",
    "009": "2b260226bcfd5110e2737dd84bfc277b0122c4bc21f5e11cb5e438a949c925de",
}
BOUNDS = [-71.59, 41.438, -71.11, 41.89]


def checked(blob, expected, name):
    if sha256(blob).hexdigest() != expected:
        raise ValueError(f"Hash mismatch: {name}")
    return blob


def number(value):
    return value if isinstance(value, (int, float)) and not isinstance(value, bool) and isfinite(value) else None


def archived_value(book, cell):
    value = number(cell.value)
    if value is None:
        return [None, "blank" if cell.value == "" else "unrecognized"]
    style = book.xf_list[cell.xf_index]
    fill = style.background
    if fill.fill_pattern and fill.pattern_colour_index == 43:
        return [value, "suspect"]
    if book.font_list[style.font_index].bold:
        return [value, "calculated"]
    return [value, "recorded"]


def extract_station(archive, station, layout):
    member, sheet_name, layers, start, digest = layout
    raw = archive.read("nbfsmn12/" + member)
    filename = member.rsplit("/", 1)[-1]
    if member.endswith(".zip"):
        with ZipFile(BytesIO(raw)) as nested:
            filename = next(name for name in nested.namelist() if name.endswith(".xls"))
            raw = nested.read(filename)
    book = xlrd.open_workbook(file_contents=checked(raw, digest, filename), formatting_info=True)
    sheet = book.sheet_by_name(sheet_name)
    expected_units = ["C", "ppt", "mg/L", "m"]
    serial = xlrd.xldate.xldate_from_date_tuple((2012, 7, 10), book.datemode)
    records = []
    for label, offset in layers:
        if [sheet.cell_value(start - 1, offset + col).strip() for col in FIELDS.values()] != expected_units:
            raise ValueError(f"Unexpected units for {station} {label}")
        for row in range(start, sheet.nrows):
            if sheet.cell_value(row, 2 + offset) != serial:
                continue
            timestamp = xlrd.xldate_as_datetime(sheet.cell_value(row, 3 + offset), book.datemode).strftime("%H:%M:%S")
            clock = timestamp[:5]
            if clock not in CLOCKS or not timestamp.endswith(":00"):
                continue
            values = {name: archived_value(book, sheet.cell(row, col + offset)) for name, col in FIELDS.items()}
            records.append({"row": row + 1, "clock": clock, "layer": label, **values})
    return {"file": filename, "member": member, "sheet": sheet_name, "sha256": digest,
            "columns": {label: {name: col + offset for name, col in FIELDS.items()} for label, offset in layers},
            "records": records}


def extract_nbc(blob):
    workbook = load_workbook(BytesIO(checked(blob, NBC, "NBC 2025")), data_only=True)
    sheet = workbook["2025"]
    calculated_fill = workbook["Legend"]["A3"].fill
    rows = [row for row in list(sheet.rows)[1:] if isinstance(row[0].value, datetime)]
    if (sheet["H1"].value, sheet["K1"].value) != ("Salinity (ppt)", "NO3+NO2 (ppb-N)"):
        raise ValueError("Unexpected NBC 2025 fields")
    station_keys = {"Phillipsdale Landing Surface": "F4", "Bullock Reach Buoy Surface": "B4"}
    associated = {}
    for row in rows:
        if row[4].value:
            related = associated.setdefault((row[0].value, row[4].value), set())
            if row[3].value.startswith("Conimicut Point"):
                related.add("boat")
            if row[5].value == "RIVER" and row[3].value.strip() != "Nutrient Blank":
                related.add("dock")
    records = {key: [] for key in station_keys.values()}
    for row in rows:
        name = row[3].value
        if name not in station_keys:
            continue
        calculated = any(cell.fill == calculated_fill for cell in (row[7], row[10]))
        site = "buoy area"
        if station_keys[name] == "F4":
            matches = associated.get((row[0].value, row[4].value), set())
            site = next(iter(matches)) if len(matches) == 1 else "dock or boat unresolved"
        records[station_keys[name]].append({
            "row": row[0].row, "date": row[0].value.date().isoformat(),
            "clock": row[1].value.isoformat(timespec="minutes") if row[1].value else None,
            "sample": row[2].value, "blankId": row[4].value, "site": site,
            "depth": number(row[6].value), "salinity": number(row[7].value),
            "nutrient": row[10].value, "note": row[21].value,
            "calculated": calculated,
        })
    return records


def extract_tank(blob):
    sheet = load_workbook(BytesIO(checked(blob, TANK, "Tank-98")), data_only=True)["Sheet1"]
    if tuple(sheet[c].value for c in ("E2", "E3", "H2", "H3")) != ("SAL", "psu", "NO2+NO3", "uM"):
        raise ValueError("Unexpected Tank-98 fields")
    records = []
    for row in sheet.iter_rows(min_row=2493, max_row=2513, max_col=17):
        records.append({"row": row[0].row, "date": row[0].value.date().isoformat(),
                        "clock": None, "sample": None, "blankId": None, "site": "GSO dock vicinity",
                        "depth": None, "salinity": number(row[4].value), "nutrient": row[7].value,
                        "note": row[16].value, "calculated": False})
    return records


def extract_map(folder):
    viewport = box(*BOUNDS)
    polygons = []
    for code, digest in WATER.items():
        path = folder / f"water{code}.zip"
        with ZipFile(BytesIO(checked(path.read_bytes(), digest, path.name))) as archive:
            basename = f"tl_2024_44{code}_areawater"
            reader = shapefile.Reader(shp=BytesIO(archive.read(basename + ".shp")), shx=BytesIO(archive.read(basename + ".shx")))
            for record in reader.iterShapes():
                geometry = shape(record.__geo_interface__)
                if geometry.is_valid and viewport.intersects(geometry):
                    clipped = geometry.intersection(viewport)
                    if clipped.area > .000001:
                        polygons.append(clipped)
    combined = unary_union(polygons).simplify(.00025, preserve_topology=True)
    return {"bounds": BOUNDS, "polygons": [
        [[(round(x, 5), round(y, 5)) for x, y in ring.coords] for ring in [p.exterior, *p.interiors]]
        for p in combined.geoms if p.geom_type == "Polygon"
    ]}


def main():
    command = argparse.ArgumentParser(description=__doc__)
    command.add_argument("input", type=Path)
    command.add_argument("output", type=Path)
    args = command.parse_args()
    folder = args.input
    path = folder / "nbfsmn12.zip"
    with ZipFile(BytesIO(checked(path.read_bytes(), ARCHIVE, path.name))) as archive:
        profiles = {key: extract_station(archive, key, value) for key, value in BOOKS.items()}
    nutrient = extract_nbc((folder / "nbc2025.xlsx").read_bytes())
    nutrient["F7"] = extract_tank((folder / "tank.xlsx").read_bytes())
    captured = {"schemaVersion": 1, "day": DAY, "clocks": CLOCKS,
                "inputHashes": {"ridem": ARCHIVE, "nbc": NBC, "tank": TANK},
                "profiles": profiles, "nutrients": nutrient}
    for name, data in (("records", captured), ("water", extract_map(folder))):
        (args.output / f"{name}.json").write_text(json.dumps(data, separators=(",", ":")) + "\n")


if __name__ == "__main__":
    main()
