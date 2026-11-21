"""Reproduce the two frozen coverage inputs. Run with xlrd==2.0.2 for the legacy XLS."""
import csv
import datetime as dt
import hashlib
import io
import json
import math
from pathlib import Path
import sys
from zipfile import ZipFile

import xlrd

archive_path, plankton_path = map(Path, sys.argv[1:])
output = Path(__file__).resolve().parents[1] / "src/features/frontier/data"
archive_hash = "faa31c9b5bc784cd1971807fa873d4f7242f87bb662798374bbc837e1a48e8e4"
workbook_hash = "b801a00f9c73810a90fcae3830194133dfda4a9cc044e936fe390cdad3b4d0be"
plankton_hash = "4b3a66d2e6aeead290bbd148d03aee727112b6be461366196fc32360cdf2f252"


def check_hash(data, expected):
    if hashlib.sha256(data).hexdigest() != expected:
        raise ValueError("Source bytes differ from the audited capture")


with archive_path.open("rb") as archive_file:
    check_hash(archive_file.read(), archive_hash)
    archive_file.seek(0)
    with ZipFile(archive_file) as archive:
        edited = archive.read("nbfsmn12/B4.NBC.Bullock Reach/B4.nbcBR2012.editted.zip")
with ZipFile(io.BytesIO(edited)) as child:
    workbook_bytes = child.read("B4.nbcBR2012.editted.xls")
check_hash(workbook_bytes, workbook_hash)
book = xlrd.open_workbook(file_contents=workbook_bytes, formatting_info=True)
sheet = book.sheet_by_name("BR")
if [sheet.cell_value(5, c).strip() for c in (0, 2, 3, 5)] != ["Site", "Date", "Time", "Temp"] or sheet.cell_value(6, 5) != "C":
    raise ValueError("Unexpected B4 worksheet headers")
start, end = "2012-05-17", "2012-11-26"
daily = {}
for r in range(7, sheet.nrows):
    if not any(sheet.row_values(r, 0, 6)):
        continue
    if sheet.cell_value(r, 0) != "B4-S":
        raise ValueError("Unexpected station code")
    date = xlrd.xldate_as_datetime(sheet.cell_value(r, 2), book.datemode).date().isoformat()
    slot = sheet.cell_value(r, 3) * 96
    minute = round(slot) * 15
    if not start <= date <= end or not 0 <= minute < 1440 or abs(slot - round(slot)) > 0.00001:
        raise ValueError("Unexpected date or slot outside the worksheet grid")
    bucket = daily.setdefault(date, {})
    if minute in bucket:
        raise ValueError("Duplicate grid slot")
    cell = sheet.cell(r, 5)
    if cell.ctype == xlrd.XL_CELL_NUMBER and math.isfinite(cell.value):
        font = book.font_list[book.xf_list[cell.xf_index].font_index]
        if font.bold:
            raise ValueError("Temperature cell marked calculated")
        bucket[minute] = None
    elif cell.value == "":
        bucket[minute] = r + 1
    else:
        raise ValueError("Unexpected surface-temperature cell")
days = []
for date, bucket in sorted(daily.items()):
    if len(bucket) != 96:
        raise ValueError("Incomplete worksheet grid")
    blanks = [{"time": f"{minute//60:02d}:{minute%60:02d}", "row": row}
              for minute, row in sorted(bucket.items()) if row is not None]
    days.append({"date": date, "slots": len(bucket), "reported": len(bucket) - len(blanks), "blanks": blanks})
(output / "bullock-2012.json").write_text("[\n" + ",\n".join(json.dumps(day) for day in days) + "\n]\n")

plankton = plankton_path.read_bytes()
check_hash(plankton, plankton_hash)
reader = csv.DictReader(io.StringIO(plankton.decode("utf-8")))
if reader.fieldnames != ["year", "week", "light", "PO4", "NH4", "NO3_2", "SiO4", "Precip", "Secchi_depth", "Salinity", "Temperature_SURF", "ChlA"]:
    raise ValueError("Unexpected plankton source headers")
weeks = []
for row in reader:
    if row["year"] in {"1997", "1998", "1999", "2011", "2012", "2013"}:
        number = row["Temperature_SURF"]
        present = number != "nd"
        if present and not math.isfinite(float(number)):
            raise ValueError("Unexpected plankton temperature cell")
        weeks.append({"year": int(row["year"]), "week": int(row["week"]), "temperaturePresent": present})
(output / "station-ii-weeks.json").write_text("[\n" + ",\n".join(json.dumps(week) for week in weeks) + "\n]\n")
