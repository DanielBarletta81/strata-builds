"""Derive bounded audit manifests from the pinned RIDEM ZIP and BCO-DMO CSV."""
import argparse
import csv
from dataclasses import dataclass
from decimal import Decimal
from hashlib import sha256
from io import BytesIO, StringIO
import json
from pathlib import Path
from xml.etree import ElementTree as ET
from zipfile import ZipFile

import xlrd


B4_DIRECTORY = "nbfsmn12/B4.NBC.Bullock Reach/"
DAY = "2012-07-10"
WINDOW = ("09:00:00", "10:16:59")
YEARS = {"1997", "1998", "1999", "2012"}
XML = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"


@dataclass(frozen=True)
class SourceFile:
    key: str
    path: str
    digest: str


RIDEM = SourceFile("ridem", "nbfsmn12.zip", "faa31c9b5bc784cd1971807fa873d4f7242f87bb662798374bbc837e1a48e8e4")
STATION = SourceFile("station", "nbpts_data_1959-2019_final.csv", "4b3a66d2e6aeead290bbd148d03aee727112b6be461366196fc32360cdf2f252")
RAW_ZIP = SourceFile("rawArchive", B4_DIRECTORY + "B4.nbc.Bullock Reach 2012 Raw Files.zip", "ebf0c24f61233114a9fa2a1b201af1d7e7eb2e2f5d11bb5564a438e2fd091fc0")
RAW_DIRECTORY = "B4.nbc.Bullock Reach 2012 Raw Files/B4.nbc.Bullock Reach Surface Raw Files 2012/"
RAW_TEXT = SourceFile("rawText", RAW_DIRECTORY + "BullocksReach_Surface.txt", "84103ccb372e3d89dbc8fec632d3db0737196627c09aaaf73984b53046caca35")
RAW_BOOK = SourceFile("rawWorkbook", RAW_DIRECTORY + "BR_2012_Surface.xls", "66930d8a0ac5ec25d4c05d1204f9cfb951845279d3fe221522f4e2ad312d580c")
EDIT_ZIP = SourceFile("editedArchive", B4_DIRECTORY + "B4.nbcBR2012.editted.zip", "7db9af65c133b831e7298f1865959f5a05729df32e7eeb36641c9700a39f3cd1")
EDIT_BOOK = SourceFile("edited", "B4.nbcBR2012.editted.xls", "b801a00f9c73810a90fcae3830194133dfda4a9cc044e936fe390cdad3b4d0be")
FIX_ZIP = SourceFile("correctedArchive", B4_DIRECTORY + "B4.nbcBR2012.corrected.zip", "6bcd5641605745bf4633699fbf78002f7ebd33142649de9bfba7b2aef19663fa")
FIX_BOOK = SourceFile("corrected", "B4.nbcBR2012.corrected..xlsx", "b670816f7d53de5f783edb4db0f0de1bf490283afc04948b8865fb3f6e68fd83")
FIELD = SourceFile("field", B4_DIRECTORY + "Bullock's Reach Surface  Metadata 2012.doc", "983522956961d44658e3c977b1605f27f7eb05ec4db16bdd4a66f67dacd408f2")
LEGACY_ZIP = SourceFile("legacyArchive", "Temperature.zip", "18795da2d309b6efbaccf887525c272b3db59fce25dc497bdf4d2ceb75efec3a")
LEGACY_BOOK = SourceFile("legacy", "Temperature.xls", "d0130bb3b5951ca38ff2e28edac3d801f83a29e67d780fb37ec9643ff7a887a9")
INTRO = SourceFile("intro", "nbfsmn12/MetadataIntro2012.doc", "205292321f8f80f8c4c3cfda684a16d87e953a16bde0fb4c77b4f134658a994e")


def verified(data, file):
    digest = sha256(data).hexdigest()
    if digest != file.digest:
        raise ValueError(f"{file.path}: expected {file.digest}, got {digest}")
    return data


def nested(archive, file):
    return verified(archive.read(file.path), file)


def local_date(serial, datemode):
    return xlrd.xldate_as_datetime(float(serial), datemode).date().isoformat()


def local_clock(serial, datemode):
    return xlrd.xldate_as_datetime(float(serial), datemode).strftime("%H:%M:%S")


def window_row(date, clock):
    return date == DAY and WINDOW[0] <= clock <= WINDOW[1]


def read_logger(data):
    rows = csv.reader(StringIO(data.decode("ascii")))
    if next(rows) != ["TOACI1", "BR BUOY", "Sonde1Data"]:
        raise ValueError("Unexpected logger identity")
    if next(rows)[:3] != ["TMSTAMP", "RECNBR", "snd1Parms(1)"]:
        raise ValueError("Unexpected logger columns")
    window, offset_checks = [], []
    for number, row in enumerate(rows, 3):
        date, clock = row[0].split()
        record = {"row": number, "recordNumber": int(row[1]), "date": date, "clock": clock, "value": row[2]}
        if window_row(date, clock):
            window.append(record)
        if (date, clock) in {("2012-09-06", "07:31:04"), ("2012-10-31", "07:31:04")}:
            offset_checks.append(record)
    return window, offset_checks


def read_xls(data, name, edited):
    book = xlrd.open_workbook(file_contents=data, formatting_info=True)
    sheet = book.sheet_by_name(name)
    date_col, clock_col, value_col, start = (2, 3, 5, 7) if edited else (0, 1, 2, 2)
    expected = "Temp" if edited else "Surf_Temp"
    if sheet.cell_value(start - 2, value_col) != expected or sheet.cell_value(start - 1, value_col) != "C":
        raise ValueError(f"Unexpected {name} temperature field")
    window, offset_checks = [], []
    for index in range(start, sheet.nrows):
        if edited and sheet.cell_value(index, 0) != "B4-S":
            continue
        date = local_date(sheet.cell_value(index, date_col), book.datemode)
        clock = local_clock(sheet.cell_value(index, clock_col), book.datemode)
        if not window_row(date, clock) and (date, clock) not in {
            ("2012-09-06", "07:30:00"), ("2012-10-31", "07:30:00")
        }:
            continue
        cell = sheet.cell(index, value_col)
        font = book.font_list[book.xf_list[cell.xf_index].font_index]
        record = {"row": index + 1, "date": date, "clock": clock, "value": str(cell.value) if cell.ctype == xlrd.XL_CELL_NUMBER else None, "bold": bool(font.bold)}
        if window_row(date, clock):
            window.append(record)
        else:
            offset_checks.append(record)
    if edited:
        notes = book.sheet_by_name("Notes")
        if notes.cell_value(4, 2) != "indicates deleted and calculated data" or "Blanks indicated deleted data" not in notes.cell_value(6, 2):
            raise ValueError("Unexpected edited workbook quality legend")
    return window, offset_checks


def read_corrected(data):
    with ZipFile(BytesIO(data)) as book:
        workbook = ET.fromstring(book.read("xl/workbook.xml"))
        if workbook.find(f"{XML}sheets")[0].get("name") != "BR":
            raise ValueError("Unexpected corrected worksheet name")
        if workbook.find(f"{XML}workbookPr").get("date1904") not in (None, "0", "false"):
            raise ValueError("Unexpected corrected date basis")
        styles = ET.fromstring(book.read("xl/styles.xml"))
        layout = styles.find(f"{XML}cellXfs")
        fonts = styles.find(f"{XML}fonts")
        strings = ["".join(t.text or "" for t in item.iter(f"{XML}t")) for item in ET.fromstring(book.read("xl/sharedStrings.xml"))]
        sheet = ET.fromstring(book.read("xl/worksheets/sheet1.xml"))
        result = []
        for row in sheet.find(f"{XML}sheetData"):
            index = int(row.get("r"))
            cells = {cell.get("r").rstrip("0123456789"): cell for cell in row}

            def value(column):
                cell = cells.get(column)
                if cell is None:
                    return None
                token = cell.findtext(f"{XML}v")
                return strings[int(token)] if token is not None and cell.get("t") == "s" else token

            if (index == 6 and value("F") != "Temp") or (index == 7 and value("F") != "C"):
                raise ValueError("Unexpected corrected temperature field")
            if index < 8 or value("A") != "B4-S":
                continue
            date, clock = local_date(value("C"), 0), local_clock(value("D"), 0)
            if not window_row(date, clock):
                continue
            temperature = cells.get("F")
            font_id = int(layout[int(temperature.get("s", "0"))].get("fontId")) if temperature is not None else 0
            bold = fonts[font_id].find(f"{XML}b")
            result.append({
                "row": index, "date": date, "clock": clock, "value": value("F"),
                "bold": bold is not None and bold.get("val") not in ("0", "false"),
                "formula": temperature.findtext(f"{XML}f") if temperature is not None else None,
            })
        return result


def read_legacy(data, station_rows):
    book = xlrd.open_workbook(file_contents=data)
    sheet = book.sheet_by_name("1 column")
    if sheet.row_values(0)[1:5] != ["Year", "Week", "Sample Date", "Temperature, Surface ('C)"]:
        raise ValueError("Unexpected legacy temperature field")
    result = []
    for index in range(1, sheet.nrows):
        year, week, date, raw = sheet.row_values(index)[1:5]
        if year != 1997:
            continue
        current = station_rows[(int(year), int(week))]
        status = "same_numeric" if current != "nd" and Decimal(current) == Decimal(str(raw)) else (
            "both_missing" if current == "nd" and raw == -999 else "different"
        )
        result.append({"row": index + 1, "week": int(week), "legacyDate": local_date(date, book.datemode), "relation": status})
    return result


def read_station(data):
    result = []
    values = {}
    reader = csv.DictReader(StringIO(data.decode("utf-8")))
    if not {"year", "week", "Temperature_SURF"} <= set(reader.fieldnames or []):
        raise ValueError("Unexpected Station II schema")
    for row in reader:
        if row["year"] not in YEARS:
            continue
        key = (int(row["year"]), int(row["week"]))
        if key in values or not 1 <= key[1] <= 53:
            raise ValueError(f"Duplicate or invalid archive week {key}")
        token = row["Temperature_SURF"]
        if token != "nd" and not Decimal(token).is_finite():
            raise ValueError(f"Unrecognized temperature field at line {reader.line_num}")
        values[key] = token
        result.append({"row": reader.line_num, "year": key[0], "week": key[1], "field": "nd" if token == "nd" else "numeric"})
    return result, values


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("ridem", type=Path)
    parser.add_argument("station", type=Path)
    parser.add_argument("legacy", type=Path)
    args = parser.parse_args()
    station_data = verified(args.station.read_bytes(), STATION)
    station, station_values = read_station(station_data)
    with ZipFile(BytesIO(verified(args.legacy.read_bytes(), LEGACY_ZIP))) as legacy:
        legacy_1997 = read_legacy(nested(legacy, LEGACY_BOOK), station_values)
    ridem_data = verified(args.ridem.read_bytes(), RIDEM)
    with ZipFile(BytesIO(ridem_data)) as archive:
        for document in (FIELD, INTRO):
            nested(archive, document)
        with ZipFile(BytesIO(nested(archive, RAW_ZIP))) as raw:
            raw_text, raw_clock_checks = read_logger(nested(raw, RAW_TEXT))
            raw_book, _ = read_xls(nested(raw, RAW_BOOK), "BullocksReach_Surface", False)
        with ZipFile(BytesIO(nested(archive, EDIT_ZIP))) as edited:
            edit_book, edited_clock_checks = read_xls(nested(edited, EDIT_BOOK), "BR", True)
        with ZipFile(BytesIO(nested(archive, FIX_ZIP))) as corrected:
            corrected_book = read_corrected(nested(corrected, FIX_BOOK))
    files = (RIDEM, RAW_ZIP, RAW_TEXT, RAW_BOOK, EDIT_ZIP, EDIT_BOOK, FIX_ZIP, FIX_BOOK, FIELD, INTRO, STATION, LEGACY_ZIP, LEGACY_BOOK)
    print(json.dumps({
        "schemaVersion": 1,
        "files": {source.key: {"file": source.path, "sha256": source.digest} for source in files},
        "bullock": {"rawText": raw_text, "rawWorkbook": raw_book, "edited": edit_book, "corrected": corrected_book, "clockChecks": {"rawText": raw_clock_checks, "edited": edited_clock_checks}},
        "station": station,
        "legacy1997": legacy_1997,
    }, indent=2))


if __name__ == "__main__":
    main()
