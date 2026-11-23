"""Check the proposed token pairs; run from the repository root."""
from pathlib import Path
import re, json
p = Path(__file__).parent
tokens = dict(re.findall(r"--([\w-]+):\s*(#[a-fA-F0-9]{6})", (p / "review.css").read_text()))
def luminance(h):
    channels = [int(h[i:i+2], 16) / 255 for i in (1, 3, 5)]
    return sum(w * (c / 12.92 if c <= .04045 else ((c + .055) / 1.055) ** 2.4) for w, c in zip([.2126, .7152, .0722], channels))
def ratio(a, b):
    a, b = sorted([luminance(tokens[a]), luminance(tokens[b])], reverse=True)
    return (a + .05) / (b + .05)
pairs = [(fg, bg, 4.5) for fg in ["text", "secondary", "subdued", "accent", "observed", "interpretation", "uncertain", "synthetic", "success", "warning", "error", "info"] for bg in ["bg", "surface", "surface-secondary", "surface-raised"]]
pairs += [("bg", bg, 4.5) for bg in ["accent", "hover", "pressed"]]
pairs += [(fg, bg, 3) for fg in ["focus", "control-border"] for bg in ["bg", "surface", "surface-raised", "selected"]]
pairs += [("text", "selected", 4.5)]
rows = [dict(foreground=a, background=b, ratio=round(ratio(a,b),2), minimum=minimum, passAA=ratio(a,b)>=minimum) for a,b,minimum in pairs]
(p / "contrast.json").write_text(json.dumps(rows, indent=2) + "\n")
assert all(row["passAA"] for row in rows), [row for row in rows if not row["passAA"]]
print(f"{len(rows)} token contrast pairs passed")
