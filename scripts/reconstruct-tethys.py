"""Recreate the 111 Ma prototype from the EarthByte archives in sources.json."""

import argparse
from collections import Counter
from hashlib import sha256
import json
from math import degrees, radians
from pathlib import Path
from tempfile import TemporaryDirectory
from zipfile import ZipFile

import numpy
import pygplates as gp
import shapely
from shapely.geometry import LineString, Point, Polygon, box

DATA = Path(__file__).resolve().parents[1] / 'src/features/deep-time/tethys/data'
BOUNDARIES = {
    'gpml:MidOceanRidge': 'ridge',
    'gpml:SubductionZone': 'subduction',
    'gpml:Transform': 'transform',
    'gpml:ContinentalRift': 'rift',
}
# Representative modern lithosphere points, checked in each model before rotation.
# Entries use (latitude, longitude) here and export [longitude, latitude].
SITES = [
    ('adria', 'Adria', 307, 42.5, 15.7),
    ('apulia', 'Apulia', 3307, 41.1, 16.5),
    ('iberia', 'Iberia', 304, 39.5, -5.5),
    ('alcapa', 'AlCaPa / Pelso', 334, 48.5, 22.0),
    ('africa', 'Southern Africa', 701, -24.5, 27.0),
    ('south-america', 'South American craton', 201, -13.0, -43.0),
    ('madagascar', 'Madagascar', 702, -19.2, 47.0),
    ('india', 'India', 501, 21.0, 77.5),
]
BOUNDARY_SITES = [
    ('south-atlantic', 'South Atlantic ridge segment', 'GPlates-65325297-a528-4dc6-88e0-9a161d900522', (201, 701)),
    ('lhasa-back-arc', 'Tethyan–Lhasa back-arc boundary', 'GPlates-0ca88b3e-eaeb-4158-8393-d1a7f571d20f', (301, 528)),
    ('neotethys-ridge', 'Central NeoTethys ridge segment', 'GPlates-b0328fd2-ad62-48da-97a0-65420ff91b0a', (501, 53401)),
]


def verify_bytes(blob, expected, name):
    if sha256(blob).hexdigest() != expected:
        raise ValueError(f'SHA-256 mismatch: {name}')


def load_package(source_dir, temporary, model, anchor):
    by_kind = {}
    for archive in model['archives']:
        path = source_dir / model['directory'] / archive['name']
        verify_bytes(path.read_bytes(), archive['sha256'], path)
        with ZipFile(path) as zipped:
            for entry in archive['rightsAndProvenanceFiles']:
                verify_bytes(zipped.read(entry['path']), entry['sha256'], entry['path'])
            paths = []
            for entry in archive['requiredFiles']:
                contents = zipped.read(entry['path'])
                verify_bytes(contents, entry['sha256'], entry['path'])
                out = temporary / model['directory'] / entry['path']
                out.parent.mkdir(parents=True, exist_ok=True)
                out.write_bytes(contents)
                paths.append(out)
            by_kind[archive['kind']] = paths
    rotation = gp.RotationModel(str(by_kind['rotations'][0]), default_anchor_plate_id=anchor)
    lithosphere = gp.FeatureCollection(str(by_kind['lithosphere'][0]))
    topology = [feature for path in by_kind['topology'] for feature in gp.FeatureCollection(str(path))]
    return rotation, lithosphere, topology


def lon_lat(point, decimals):
    latitude, longitude = point.to_lat_lon()
    return [round(longitude, decimals), round(latitude, decimals)]


def angular_distance(a, b):
    return round(degrees(gp.PointOnSphere.distance(a, b)), 5)


def point_records(packages, age, anchor, relative_anchor, decimals):
    records = []
    for key, label, plate, lat, lon in SITES:
        modern = gp.PointOnSphere(lat, lon)
        modeled = []
        for rotation, lithosphere, _ in packages:
            matches = [
                f for f in lithosphere if f.get_reconstruction_plate_id() == plate
                and any(isinstance(g, gp.PolygonOnSphere) and g.is_point_in_polygon(modern)
                        for g in f.get_geometries())
            ]
            if len(matches) != 1:
                raise ValueError(f'{label}: expected one present-day source polygon')
            feature = matches[0]
            older, younger = feature.get_valid_time()
            if not younger <= age <= older:
                raise ValueError(f'{label}: source polygon is unavailable at {age} Ma')

            global_rotation = rotation.get_rotation(age, plate, anchor_plate_id=anchor,
                                                   use_identity_for_missing_plate_ids=False)
            relative_rotation = rotation.get_rotation(age, plate, anchor_plate_id=relative_anchor,
                                                     use_identity_for_missing_plate_ids=False)
            if global_rotation is None or relative_rotation is None:
                raise ValueError(f'{label}: missing plate rotation')
            position = global_rotation * modern

            # Check against the standard feature-reconstruction API, independent of
            # the explicit point rotation. Both APIs use the GPlates numerical core.
            check_feature = gp.Feature()
            check_feature.set_reconstruction_plate_id(plate)
            check_feature.set_geometry(modern)
            solutions = []
            gp.reconstruct([check_feature], rotation, solutions, age, anchor_plate_id=anchor)
            candidate = solutions[0].get_reconstructed_geometry()
            if gp.PointOnSphere.distance(position, candidate) > radians(1e-6):
                raise ValueError(f'{label}: feature and point reconstruction disagree')
            modeled.append((
                {
                    'sourceName': feature.get_name(), 'sourceId': str(feature.get_feature_id()),
                    'plateId': plate, 'position': lon_lat(position, decimals),
                    'africaFixedPosition': lon_lat(relative_rotation * modern, decimals),
                },
                position, relative_rotation * modern,
            ))
        primary, comparison = modeled
        records.append({
            'id': key, 'label': label, 'kind': 'lithosphere', 'modernPoint': lon_lat(modern, decimals),
            'primary': primary[0], 'comparison': comparison[0],
            'globalDifferenceDegrees': angular_distance(primary[1], comparison[1]),
            'africaFixedDifferenceDegrees': angular_distance(primary[2], comparison[2]),
        })
    return records


def snapshot(package, age):
    rotation, _, topology = package
    model = gp.TopologicalModel(topology, rotation)
    result = model.topological_snapshot(age)
    return (result.get_resolved_topologies(gp.ResolveTopologyType.boundary),
            result.get_resolved_topological_sections(gp.ResolveTopologyType.boundary))


def sharing_plates(segment):
    return sorted({region.get_feature().get_reconstruction_plate_id()
                   for region in segment.get_sharing_resolved_topologies()})


def boundary_points(results, decimals):
    records = []
    for key, label, source_id, neighbors in BOUNDARY_SITES:
        observations = []
        for _, sections in results:
            match = [
                (section.get_feature(), seg.get_resolved_geometry())
                for section in sections if str(section.get_feature().get_feature_id()) == source_id
                for seg in section.get_shared_sub_segments() if sharing_plates(seg) == list(neighbors)
            ]
            if not match:
                observations.append(None)
                continue
            feature, line = max(match, key=lambda pair: pair[1].get_arc_length())
            center = line.get_centroid()
            vertex = min(line.get_points(), key=lambda p: gp.PointOnSphere.distance(p, center))
            observations.append({
                'sourceName': feature.get_name(), 'sourceId': source_id,
                'plateId': feature.get_reconstruction_plate_id(), 'adjacentPlateIds': list(neighbors),
                'position': lon_lat(vertex, decimals), 'arcDegrees': round(degrees(line.get_arc_length()), 5),
                'type': BOUNDARIES[str(feature.get_feature_type())],
            })
        if not observations[0]:
            raise ValueError(f'{label}: primary boundary unavailable')
        records.append({
            'id': key, 'label': label, 'kind': 'boundary',
            'primary': observations[0], 'comparison': observations[1],
        })
    return records


def rounded_coords(coords, decimals):
    return [[round(x, decimals), round(y, decimals)] for x, y in coords]


def polygons(package, age, view, settings, anchor):
    rotation, features, _ = package
    wrapper = gp.DateLineWrapper()
    reconstructed = []
    # The dataset also contains a separately typed island-arc layer.
    continental = [f for f in features if str(f.get_feature_type()) == 'gpml:ClosedContinentalBoundary']
    gp.reconstruct(continental, rotation, reconstructed, age, anchor_plate_id=anchor)
    records, rejected = [], []
    for entry in reconstructed:
        feature = entry.get_feature()
        source_id = str(feature.get_feature_id())
        geometry = entry.get_reconstructed_geometry()
        for index, wrapped in enumerate(wrapper.wrap(geometry, settings['tessellationDegrees'])):
            outer = [lon_lat(p, 10) for p in wrapped.get_exterior_points()]
            holes = [[lon_lat(p, 10) for p in wrapped.get_interior_points(i)]
                     for i in range(wrapped.get_number_of_interior_rings())]
            polygon = Polygon(outer, holes)
            if polygon.is_empty or not polygon.intersects(view):
                continue
            if not polygon.is_valid:
                rejected.append({'sourceId': source_id, 'reason': shapely.is_valid_reason(polygon)})
                continue
            simplified = polygon.simplify(settings['simplificationDegrees'], preserve_topology=True)
            decimals = settings['coordinateDecimals']
            rings = [rounded_coords(simplified.exterior.coords, decimals)]
            rings += [rounded_coords(ring.coords, decimals) for ring in simplified.interiors]
            if not Polygon(rings[0], rings[1:]).is_valid:
                rejected.append({'sourceId': source_id, 'reason': 'Invalid after coordinate rounding'})
                continue
            records.append({
                'id': f'{source_id}:{index}', 'sourceId': source_id, 'name': feature.get_name(),
                'plateId': feature.get_reconstruction_plate_id(), 'rings': rings,
            })
    return records, rejected


def lines(sections, view, settings):
    wrapper = gp.DateLineWrapper()
    records = []
    for section in sections:
        feature = section.get_feature()
        boundary_type = BOUNDARIES.get(str(feature.get_feature_type()))
        if boundary_type is None:
            continue
        source_id = str(feature.get_feature_id())
        for segment in section.get_shared_sub_segments():
            geo = segment.get_resolved_geometry()
            for wrapped in wrapper.wrap(geo, settings['tessellationDegrees']):
                line = LineString([lon_lat(p, 10) for p in wrapped.get_points()])
                if not line.is_valid or not line.intersects(view):
                    continue
                simplified = line.simplify(settings['simplificationDegrees'], preserve_topology=True)
                coordinates = rounded_coords(simplified.coords, settings['coordinateDecimals'])
                if len({tuple(p) for p in coordinates}) < 2:
                    continue
                # The topology API can reorder equivalent subsegments. Use a
                # direction-independent ID for display lines without polarity.
                coordinates = min(coordinates, coordinates[::-1])
                neighbors = sharing_plates(segment)
                content = json.dumps([neighbors, coordinates], separators=(',', ':')).encode()
                records.append({
                    'id': f'{source_id}:{sha256(content).hexdigest()[:16]}', 'sourceId': source_id,
                    'name': feature.get_name(), 'plateId': feature.get_reconstruction_plate_id(),
                    'type': boundary_type, 'adjacentPlateIds': neighbors,
                    'coordinates': coordinates,
                })
    return records


def metrics(result):
    topologies, sections = result
    counts = Counter(str(section.get_feature().get_feature_type()).split(':')[-1] for section in sections)
    return {'rigidPlateTopologies': len(topologies), 'sectionTypes': dict(sorted(counts.items()))}


def check_export(continental, boundaries, checkpoints, view, tolerance):
    for checkpoint in checkpoints:
        source = checkpoint['primary']
        point = Point(source['position'])
        if not view.covers(point):
            raise ValueError(f"{checkpoint['id']}: checkpoint outside view")
        if checkpoint['kind'] == 'lithosphere':
            geometries = [Polygon(p['rings'][0], p['rings'][1:]) for p in continental
                          if p['sourceId'] == source['sourceId'] and p['plateId'] == source['plateId']]
        else:
            geometries = [LineString(line['coordinates']) for line in boundaries
                          if line['sourceId'] == source['sourceId']
                          and line['adjacentPlateIds'] == source['adjacentPlateIds']]
        if not any(geometry.distance(point) <= tolerance for geometry in geometries):
            raise ValueError(f"{checkpoint['id']}: checkpoint does not match retained geometry")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('sources', type=Path, help='Directory with EarthByte archives under 23/ and 20/')
    parser.add_argument('output', type=Path, help='Output directory for frozen products')
    parser.add_argument('--verify-only', action='store_true',
                        help='Use the pinned pyGPlates version to reproduce checkpoints, without GIS export')
    args = parser.parse_args()
    source_manifest = (DATA / 'sources.json').read_bytes()
    manifest = json.loads(source_manifest)
    pipeline = manifest['pipeline']
    if str(gp.Version.get_imported_version()) != pipeline['pygplates']:
        raise ValueError('Unexpected pyGPlates version')
    if not args.verify_only and (
        shapely.__version__ != pipeline['shapely'] or numpy.__version__ != pipeline['numpy']
    ):
        raise ValueError('Unexpected GIS export dependencies')
    age = manifest['ageMa']
    anchor = manifest['anchorPlate']
    relative_anchor = manifest['comparisonAnchorPlate']
    region = manifest['region']
    view = box(region['west'], region['south'], region['east'], region['north'])
    prefix = {'ageMa': age, 'anchorPlate': anchor, 'modelId': manifest['models'][0]['id']}
    args.output.mkdir(parents=True, exist_ok=True)

    with TemporaryDirectory() as work:
        packages = [load_package(args.sources, Path(work), model, anchor) for model in manifest['models']]
        resolved = [snapshot(package, age) for package in packages]
        validation = {
            **prefix,
            'comparisonModelId': manifest['models'][1]['id'],
            'comparisonAnchorPlate': relative_anchor,
            'topologies': {'primary': metrics(resolved[0]), 'comparison': metrics(resolved[1])},
            'checkpoints': point_records(packages, age, anchor, relative_anchor, pipeline['coordinateDecimals'])
            + boundary_points(resolved, pipeline['coordinateDecimals']),
        }
        validation_path = args.output / 'validation-111.json'
        write_json(validation_path, validation)
        if args.verify_only:
            return
        continental, rejected = polygons(packages[0], age, view, pipeline, anchor)
        boundaries = lines(resolved[0][1], view, pipeline)
        if not continental or not boundaries:
            raise ValueError('Reconstruction has no regional geometry')
        ids = [feature['id'] for feature in continental + boundaries]
        if len(set(ids)) != len(ids):
            raise ValueError('Duplicate geometry IDs')
        rotation = packages[0][0]
        plates = {feature['plateId'] for feature in continental + boundaries}
        missing = [plate for plate in sorted(plates)
                   if rotation.get_rotation(age, plate, use_identity_for_missing_plate_ids=False) is None]
        if missing:
            raise ValueError(f'No explicit rotation for displayed plate IDs: {missing}')
        check_export(continental, boundaries, validation['checkpoints'], view,
                     pipeline['simplificationDegrees'] + 0.00001)
        data = {
            **prefix, 'region': region,
            'continental': sorted(continental, key=lambda part: part['id']),
            'boundaries': sorted(boundaries, key=lambda part: part['id']),
            'rejectedPolygonParts': sorted(rejected, key=lambda part: (part['sourceId'], part['reason'])),
        }
        reconstruction_path = args.output / 'reconstruction-111.json'
        write_json(reconstruction_path, data)
        write_json(args.output / 'receipt-111.json', {
            **prefix,
            'sourceManifestSha256': sha256(source_manifest).hexdigest(),
            'products': {
                path.name: sha256(path.read_bytes()).hexdigest()
                for path in (reconstruction_path, validation_path)
            },
            'counts': {'lithosphereParts': len(continental), 'boundaryParts': len(boundaries),
                       'checkpoints': len(validation['checkpoints']), 'rejectedPolygonParts': len(rejected)},
        })


def write_json(path, value):
    path.write_text(json.dumps(value, separators=(',', ':'), ensure_ascii=False, allow_nan=False) + '\n',
                    encoding='utf-8')


if __name__ == '__main__':
    main()
