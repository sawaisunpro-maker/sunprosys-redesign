"""Download about page employee photos and remove backgrounds."""
import os
import sys
import urllib.request
from pathlib import Path
from rembg import remove
from PIL import Image
import io

OUT_DIR = Path(__file__).parent / "assets" / "img" / "people"
OUT_DIR.mkdir(parents=True, exist_ok=True)

BASE = "https://sunprosys.co.jp/cont/wp-content/themes/sunpro_theme/img/about/"
# Header images for each voice (01_01 = voice 1 header, etc.)
TARGETS = [
    "about01_image01_01.jpg",
    "about01_image02_01.jpg",
    "about01_image03_01.jpg",
    "about01_image04_01.jpg",
    "about01_image05_01.jpg",
]

for name in TARGETS:
    url = BASE + name
    out = OUT_DIR / (name.replace(".jpg", ".png"))
    if out.exists():
        print(f"skip {out.name}")
        continue
    print(f"download {name}...")
    try:
        with urllib.request.urlopen(url, timeout=30) as r:
            data = r.read()
    except Exception as e:
        print(f"  ERROR download: {e}")
        continue
    print(f"  removing bg...")
    try:
        out_data = remove(data)
        with open(out, "wb") as f:
            f.write(out_data)
        print(f"  saved {out.name} ({len(out_data)//1024}KB)")
    except Exception as e:
        print(f"  ERROR rembg: {e}")
print("DONE")
