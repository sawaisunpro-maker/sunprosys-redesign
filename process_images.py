"""Re-process about page employee photos with human-specific model for sharper cutouts."""
import urllib.request
from pathlib import Path
from rembg import remove, new_session
from PIL import Image, ImageFilter
import io

OUT_DIR = Path(__file__).parent / "assets" / "img" / "people"
OUT_DIR.mkdir(parents=True, exist_ok=True)

BASE = "https://sunprosys.co.jp/cont/wp-content/themes/sunpro_theme/img/about/"
TARGETS = [
    "about01_image01_01.jpg",
    "about01_image02_01.jpg",
    "about01_image03_01.jpg",
    "about01_image04_01.jpg",
    "about01_image05_01.jpg",
]

# Use human-specific segmentation model for cleaner edges on people
session = new_session("u2net_human_seg")

for name in TARGETS:
    url = BASE + name
    out = OUT_DIR / (name.replace(".jpg", ".png"))
    print(f"download {name}...")
    try:
        with urllib.request.urlopen(url, timeout=30) as r:
            data = r.read()
    except Exception as e:
        print(f"  ERROR download: {e}")
        continue

    print(f"  removing bg (u2net_human_seg, alpha_matting)...")
    try:
        # Alpha matting smooths edges; high erode size = cleaner, less halo
        out_data = remove(
            data,
            session=session,
            alpha_matting=True,
            alpha_matting_foreground_threshold=240,
            alpha_matting_background_threshold=15,
            alpha_matting_erode_size=8,
            post_process_mask=True,
        )
        # Sharpen the result with PIL (UnsharpMask) to crispen details
        img = Image.open(io.BytesIO(out_data)).convert("RGBA")
        # Separate RGB and Alpha to sharpen only color channels
        r, g, b, a = img.split()
        rgb = Image.merge("RGB", (r, g, b))
        rgb = rgb.filter(ImageFilter.UnsharpMask(radius=1.2, percent=180, threshold=2))
        sharp = Image.merge("RGBA", (*rgb.split(), a))
        sharp.save(out, optimize=True)
        print(f"  saved {out.name} ({out.stat().st_size//1024}KB)")
    except Exception as e:
        print(f"  ERROR rembg: {e}")
print("DONE")
