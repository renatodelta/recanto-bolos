import os
from PIL import Image

def compress_image(input_path, output_path, max_size=(800, 800), quality=80):
    try:
        with Image.open(input_path) as img:
            # Handle orientation if present
            if hasattr(img, '_getexif'):
                exif = img._getexif()
                if exif:
                    orientation = exif.get(0x0112)
                    if orientation == 3: img = img.rotate(180, expand=True)
                    elif orientation == 6: img = img.rotate(270, expand=True)
                    elif orientation == 8: img = img.rotate(90, expand=True)
            
            # Resize
            img.thumbnail(max_size, Image.Resampling.LANCZOS)
            
            # Save as WebP
            img.save(output_path, "WEBP", quality=quality)
            print(f"Compressed: {os.path.basename(input_path)} -> {os.path.basename(output_path)} ({os.path.getsize(output_path) / 1024:.1f} KB)")
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

img_dir = r"c:\xampp\htdocs\recantoformoso\bolos\imgs"
images = {
    "bia.jpg": "bia.webp",
    "cenoura.jpg": "cenoura.webp",
    "churros.jpg": "churros.webp",
    "fubá.jpg": "fuba.webp",
    "limão.jpg": "limao.webp",
    "maçã-canela.jpg": "maca-canela.webp"
}

# Handle potential encoding issues in filenames
for filename in os.listdir(img_dir):
    # Try to match based on partial names if exact match fails due to encoding
    matched_key = None
    if filename in images:
        matched_key = filename
    else:
        # Simple fuzzy match for special characters
        for key in images.keys():
            # Check if key without accents matches filename without accents (or just partial)
            if key.replace('á', '').replace('ã', '').replace('ç', '') in filename:
                matched_key = key
                break
    
    if matched_key:
        input_p = os.path.join(img_dir, filename)
        output_p = os.path.join(img_dir, images[matched_key])
        compress_image(input_p, output_p)
