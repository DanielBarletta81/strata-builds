"""Reproduce a single Apulia model comparison without importing regional geometry."""

import argparse
import hashlib
import json
import math
from pathlib import Path
from tempfile import TemporaryDirectory
from zipfile import ZipFile

import pygplates as gp

ROOT = Path(__file__).resolve().parents[1]
FROZEN = ROOT / 'src/features/deep-time/tethys/data/validation-111.json'
REGISTER = ROOT / 'src/features/deep-time/tethys/seaway/frame-audit.json'


def verify(data, expected, name):
    if hashlib.sha256(data).hexdigest() != expected:
        raise ValueError(f'SHA-256 mismatch for {name}')


def compare(archive):
    audit = json.loads(REGISTER.read_text())
    source = audit['regionalArchive']
    verify(archive.read_bytes(), source['sha256'], archive.name)
    verify(FROZEN.read_bytes(), audit['phase2ValidationSha256'], FROZEN.name)
    baseline = json.loads(FROZEN.read_text())
    age, anchor = baseline['ageMa'], baseline['comparisonAnchorPlate']
    checkpoint = next(record for record in baseline['checkpoints'] if record['id'] == 'apulia')
    point = gp.PointOnSphere(*reversed(checkpoint['modernPoint']))
    with TemporaryDirectory() as work, ZipFile(archive) as package:
        paths = {}
        for file in source['files']:
            data = package.read(file['name'])
            verify(data, file['sha256'], file['name'])
            path = Path(work) / file['name']
            path.write_bytes(data)
            paths[file['role']] = path
        polygons = gp.FeatureCollection(str(paths['lithosphere']))
        matches = [feature for feature in polygons
                   if feature.get_valid_time()[1] <= age <= feature.get_valid_time()[0]
                   and any(isinstance(shape, gp.PolygonOnSphere) and shape.is_point_in_polygon(point)
                           for shape in feature.get_geometries())]
        plate_ids = {feature.get_reconstruction_plate_id() for feature in matches}
        if plate_ids != {audit['regionalPlate']}:
            raise ValueError(f'Expected only the regional Apulia plate at the test point, got {plate_ids}')
        plate = plate_ids.pop()
        model = gp.RotationModel(str(paths['rotation']))
        rotation = model.get_rotation(age, plate, anchor_plate_id=anchor, use_identity_for_missing_plate_ids=False)
        if rotation is None:
            raise ValueError('Missing Africa-fixed regional plate rotation')
        restored = rotation * point
        feature = gp.Feature()
        feature.set_reconstruction_plate_id(plate)
        feature.set_geometry(point)
        solutions = []
        gp.reconstruct([feature], model, solutions, age, anchor_plate_id=anchor)
        difference = gp.PointOnSphere.distance(restored, solutions[0].get_reconstructed_geometry())
        if difference > math.radians(0.000001):
            raise ValueError('Point rotation and feature reconstruction disagree')
        released = gp.PointOnSphere(*reversed(checkpoint['primary']['africaFixedPosition']))
        regional_lon_lat = [round(value, 5) for value in reversed(restored.to_lat_lon())]
        return {
            'ageMa': age,
            'anchorPlate': anchor,
            'checkpoint': checkpoint['id'],
            'modernLonLat': checkpoint['modernPoint'],
            'phase2Plate': checkpoint['primary']['plateId'],
            'regionalPlate': plate,
            'phase2AfricaFixedLonLat': checkpoint['primary']['africaFixedPosition'],
            'regionalAfricaFixedLonLat': regional_lon_lat,
            'separationDegrees': round(math.degrees(gp.PointOnSphere.distance(restored, released)), 5),
        }


if __name__ == '__main__':
    args = argparse.ArgumentParser(description=__doc__)
    args.add_argument('archive', type=Path)
    result = compare(args.parse_args().archive)
    audit = json.loads(REGISTER.read_text())
    expected = {key: audit[key] for key in result}
    if result != expected:
        raise SystemExit(f'Africa-fixed diagnostic differs from the recorded result: {result}')
    print(json.dumps(result, indent=2))
