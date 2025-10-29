#!/python3

# rights reserve to Efrat Haster
from pathlib import Path
import base64
import re
import base64
from io import BytesIO
from PIL import Image, ImageOps


def img_to_base64_resizedi_00(img_path, size=(80,80)):
    with Image.open(img_path) as img:
        img = img.resize(size, Image.ANTIALIAS)
        buffered = BytesIO()
        img.save(buffered, format="JPEG")
        return base64.b64encode(buffered.getvalue()).decode("utf-8")


def img_to_base64_crop(img_path, size=(80, 80)):
    with Image.open(img_path) as img:
        img = ImageOps.exif_transpose(img)
        # Crop the largest square from the center
        min_side = min(img.width, img.height)
        left = (img.width - min_side)//2
        top = (img.height - min_side)//2
        right = left + min_side
        bottom = top + min_side
        img = img.crop((left, top, right, bottom))
        img = img.resize(size, Image.Resampling.LANCZOS)
        buffered = BytesIO()
        img.save(buffered, format="JPEG")
        return base64.b64encode(buffered.getvalue()).decode("utf-8")
    
def img_to_base64_resized(img_path, size=(80,80)):
    with Image.open(img_path) as img:
        # Resize using new Pillow syntax
        img = img.resize(size, Image.Resampling.LANCZOS)
        buffered = BytesIO()
        img.save(buffered, format="JPEG")
        return base64.b64encode(buffered.getvalue()).decode("utf-8")
    
# --- CONFIG ---
INPUT_HTML = "contacts.html"
OUTPUT_HTML = "contacts2.html"
IMAGES_FOLDER = Path("pics")  # folder where images are stored

# --- Read the existing HTML ---
with open(INPUT_HTML, "r", encoding="utf-8") as f:
    html_content = f.read()

# --- Find all <img src="..."> tags pointing to pics/ ---
img_tags = re.findall(r'<img\s+[^>]*src="([^"]+)"', html_content)

# --- Replace each image with Base64 ---
for img_src in img_tags:
    if img_src.startswith("pics/"):
        img_path = IMAGES_FOLDER / Path(img_src).name
        if img_path.exists():
            with open(img_path, "rb") as img_file:
                img_base64 = base64.b64encode(img_file.read()).decode("utf-8")
            # img_base64 = img_to_base64_crop(img_path)
            # Determine mime type from extension
            ext = img_path.suffix.lower()
            if ext in [".jpg", ".jpeg"]:
                mime = "image/jpeg"
            elif ext == ".png":
                mime = "image/png"
            elif ext == ".gif":
                mime = "image/gif"
            else:
                mime = "application/octet-stream"
            # Replace src with base64 data
            html_content = html_content.replace(img_src, f"data:{mime};base64,{img_base64}")
        else:
            print(f"Warning: {img_path} not found, skipping.")

# --- Write new HTML ---
with open(OUTPUT_HTML, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Standalone HTML with Base64 images saved as {OUTPUT_HTML}")
