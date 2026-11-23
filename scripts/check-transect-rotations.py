"""Verify three pinned 111 Ma separations with quaternion math and no pyGPlates."""

import argparse
from hashlib import sha256
import json
from math import atan2, cos, degrees, hypot, radians, sin, acos, fsum
from pathlib import Path
from zipfile import ZipFile

DATA = Path(__file__).resolve().parents[1] / 'src/features/deep-time/tethys'

def multiply(a, b):
    w, x, y, z = a
    W, X, Y, Z = b
    return (w*W-x*X-y*Y-z*Z, w*X+x*W+y*Z-z*Y, w*Y-x*Z+y*W+z*X, w*Z+x*Y-y*X+z*W)

def unit(lon, lat):
    lon, lat = map(radians, (lon, lat))
    return cos(lat)*cos(lon), cos(lat)*sin(lon), sin(lat)

def pole(lat, lon, angle):
    half = radians(angle) / 2
    return cos(half), *(component*sin(half) for component in unit(lon, lat))

def conjugate(q):
    return q[0], *(-component for component in q[1:])

def dot(a, b):
    return fsum(x*y for x,y in zip(a,b))

def interpolate(a, b, fraction):
    d = dot(a,b)
    if d < 0:
        b, d = tuple(-x for x in b), -d
    if d > 1 - 1e-14:
        return a
    arc = acos(d)
    return tuple((sin((1-fraction)*arc)*x+sin(fraction*arc)*y)/sin(arc) for x,y in zip(a,b))

def read_poles(data):
    pairs = {}
    for line in data.decode('utf-8', errors='replace').splitlines():
        fields = line.split('!', 1)[0].split()
        if len(fields) != 6:
            continue
        try:
            moving, age, lat, lon, angle, fixed = map(float, fields)
        except ValueError:
            continue
        pairs.setdefault((int(moving), int(fixed)), {})[age] = pole(lat, lon, angle)
    return pairs

def restore(data, circuit, position, age):
    pairs = read_poles(data)
    q = (1.0, 0.0, 0.0, 0.0)
    for edge in zip(circuit, circuit[1:]):
        samples = pairs[edge]
        lo = max(t for t in samples if t <= age)
        hi = min(t for t in samples if t >= age)
        step = samples[lo] if hi == lo else interpolate(samples[lo], samples[hi], (age-lo)/(hi-lo))
        q = multiply(step, q)
    _, x, y, z = multiply(multiply(q,(0.0,*unit(*position))),conjugate(q))
    return degrees(atan2(y,x)), degrees(atan2(z,hypot(x,y)))

def separation(a, b):
    return degrees(acos(min(1.0,max(-1.0,dot(unit(*a),unit(*b))))))

def checked_member(archive, archive_hash, member, member_hash):
    if sha256(archive.read_bytes()).hexdigest() != archive_hash:
        raise ValueError(f'Archive checksum failed: {archive.name}')
    with ZipFile(archive) as source:
        data = source.read(member)
    if sha256(data).hexdigest() != member_hash:
        raise ValueError(f'File checksum failed: {member}')
    return data


def phase2_inputs(root):
    manifest = json.loads((DATA / 'data/sources.json').read_text())
    for model in manifest['models']:
        archive = next(source for source in model['archives'] if source['kind'] == 'rotations')
        member = archive['requiredFiles'][0]
        yield checked_member(root / model['directory'] / archive['name'], archive['sha256'],
                             member['path'], member['sha256'])


def verify(phase2_root, regional_archive):
    baseline = json.loads((DATA / 'data/validation-111.json').read_text())
    audit = json.loads((DATA / 'seaway/frame-audit.json').read_text())
    adria = next(entry for entry in baseline['checkpoints'] if entry['id'] == 'adria')
    primary, matthews = phase2_inputs(phase2_root)
    manifest = audit['regionalArchive']
    member = next(entry for entry in manifest['files'] if entry['role'] == 'rotation')
    regional = checked_member(regional_archive, manifest['sha256'], member['name'], member['sha256'])
    primary_route = (307, 3307, 715, 701)
    cases = [
        ('Apulia, Africa-fixed circuits', primary, regional, audit['modernLonLat'],
         (3307, 715, 701), (3089, 715, 701), audit['separationDegrees']),
        ('Adria, Africa-fixed circuits', primary, matthews, adria['modernPoint'],
         primary_route, primary_route, adria['africaFixedDifferenceDegrees']),
        ('Adria, published circuits', primary, matthews, adria['modernPoint'],
         (*primary_route, 0), (*primary_route, 70, 4, 1, 0), adria['globalDifferenceDegrees']),
    ]
    for title, first, second, point, first_path, second_path, expected in cases:
        first_position = restore(first, first_path, point, baseline['ageMa'])
        second_position = restore(second, second_path, point, baseline['ageMa'])
        difference = round(separation(first_position, second_position), 5)
        if difference != expected:
            raise ValueError(f'{title}: got {difference} degrees, expected {expected}')
        print(f'{title}: {difference:.5f}°')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('earthbyte_root', type=Path)
    parser.add_argument('regional_archive', type=Path)
    args = parser.parse_args()
    verify(args.earthbyte_root, args.regional_archive)
