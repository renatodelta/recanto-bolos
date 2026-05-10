from PIL import Image, ImageDraw
import os

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

base_dir = r"c:\xampp\htdocs\recantoformoso\bolos"
logo_path = os.path.join(base_dir, "imgs", "logo-recanto-fundo-out.png")

if os.path.exists(logo_path):
    make_circular(logo_path, logo_path)
else:
    print(f"File not found: {logo_path}")
