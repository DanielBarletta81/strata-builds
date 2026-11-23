"""Measure the original polygon construction and mark/background pairings."""
from pathlib import Path
import json
import math
import re
import xml.etree.ElementTree as ET
p = Path(__file__).parent
root = ET.parse(p / 'assets/concept-e.svg').getroot()
paths = root.findall('{http://www.w3.org/2000/svg}path')
assert len(paths) == 2
polys = []
for node in paths:
    nums = [float(n) for n in re.findall(r'[\d.]+', node.attrib['d'])]
    polys.append(list(zip(nums[::2], nums[1::2])))
a, b = polys
assert b == [(48-x, 48-y) for x, y in a]
def area(poly):
    return abs(sum(x*v-y*u for (x,y),(u,v) in zip(poly, poly[1:]+poly[:1])))/2
assert area(a) == area(b)
def distance(point, start, end):
    x,y=point; sx,sy=start; ex,ey=end
    dx,dy=ex-sx,ey-sy
    t=max(0,min(1,((x-sx)*dx+(y-sy)*dy)/(dx*dx+dy*dy)))
    return math.hypot(x-sx-t*dx,y-sy-t*dy)
gap = min(distance(pt,s,e) for first,second in [(a,b),(b,a)] for pt in first for s,e in zip(second,second[1:]+second[:1]))
assert gap >= 4
for mode in ['light','dark']:
    nodes=ET.parse(p/f'assets/stone-mono-{mode}.svg').getroot().findall('{http://www.w3.org/2000/svg}path')
    assert len(nodes)==2 and len({n.attrib['fill'] for n in nodes})==1
    assert [n.attrib['d'] for n in nodes]==[n.attrib['d'] for n in paths]
def lum(h):
    cs=[int(h[i:i+2],16)/255 for i in (1,3,5)]
    return sum(w*(c/12.92 if c<=.04045 else ((c+.055)/1.055)**2.4) for w,c in zip([.2126,.7152,.0722],cs))
def contrast(fg,bg):
    high,low=sorted([lum(fg),lum(bg)],reverse=True)
    return (high+.05)/(low+.05)
pairs=[('#d6d0c2','#07131a'),('#afb9b8','#07131a'),('#eaf5f3','#07131a'),('#07131a','#eaf5f3'),('#55d6c2','#07131a'),('#809da7','#07131a')]
rows=[dict(foreground=f,background=b,ratio=round(contrast(f,b),2),minimum=3,passed=contrast(f,b)>=3) for f,b in pairs]
assert all(r['passed'] for r in rows)
(p/'proposals/final-geometry-results.json').write_text(json.dumps(dict(slabAreas=[area(a),area(b)],rotationDegrees=180,minimumGapUnits=gap,minimumGapAt16px=gap/3,horizontalGapAt16px=2,singleColorPathsVerified=True,contrast=rows,limitation='Geometric/raster support, not a human recognition test.'),indent=2)+'\n')
print(f'Equal slab areas {area(a)}; minimum gap {gap:.3f}/48 units ({gap/3:.3f}px at 16px); six contrast pairs passed; true monochrome paths match.')
