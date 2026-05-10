from PIL import Image, ImageDraw

def make_circular(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    
    # Create a circular mask
    mask = Image.new('L', (width, height), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, width, height), fill=255)
    
    # Apply the mask
    result = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    result.paste(img, (0, 0), mask=mask)
    
    # Save the result
    result.save(output_path, "PNG")
    print(f"Circular icon saved to {output_path}")

# Process favicons
icons = [
    "favicon-96x96.png",
    "apple-touch-icon.png",
    "android-chrome-192x192.png",
    "android-chrome-512x512.png"
]

base_dir = r"c:\xampp\htdocs\recantoformoso\bolos"
import os

for icon in icons:
    path = os.path.join(base_dir, icon)
    if os.path.exists(path):
        make_circular(path, path)
