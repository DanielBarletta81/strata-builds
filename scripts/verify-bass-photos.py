#!/usr/bin/env python3
"""Verify the private source archive against the checked-in receipt."""

import argparse
import hashlib
import json
from pathlib import Path
import re
from zipfile import ZipFile


MANIFEST = "STRATA009_PHOTO_SOURCE_MANIFEST.md"
REGISTRY = (
    Path(__file__).resolve().parents[1]
    / "src/features/bass-2003/photo-registry.json"
)


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def verify(name, data, expected):
    if sha256(data) != expected:
        raise SystemExit(f"SHA-256 mismatch: {name}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("archive", type=Path)
    parser.add_argument("--extracted", type=Path, help="Optional extracted archive directory")
    args = parser.parse_args()
    registry = json.loads(REGISTRY.read_text())
    expected_photos = {name: record["sha256"] for name, record in registry["photos"].items()}

    verify(args.archive.name, args.archive.read_bytes(), registry["archiveSha256"])
    with ZipFile(args.archive) as archive:
        manifest = archive.read(MANIFEST)
        verify(MANIFEST, manifest, registry["manifestSha256"])
        if args.extracted:
            verify(f"extracted {MANIFEST}", (args.extracted / MANIFEST).read_bytes(), registry["manifestSha256"])
        entries = dict(re.findall(
            r"^\| `(IMG_\d+\.jpe?g)` \| .*? \| `([a-f0-9]{64})` \|$",
            manifest.decode(),
            re.MULTILINE,
        ))
        if entries != expected_photos:
            raise SystemExit("Manifest entries differ from the photo registry")

        for filename, expected in entries.items():
            member = f"originals/{filename}"
            verify(member, archive.read(member), expected)
            if args.extracted:
                verify(f"extracted {member}", (args.extracted / member).read_bytes(), expected)

    print(f"Verified {len(entries)} photographs, the manifest and the pinned archive.")


if __name__ == "__main__":
    main()
