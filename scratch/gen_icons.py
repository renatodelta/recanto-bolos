from PIL import Image
import os

src = os.path.join(os.path.dirname(__file__), '..', 'imgs', 'logo.jpeg')
out = os.path.join(os.path.dirname(__file__), '..')

img = Image.open(src).convert('RGBA')

# Make it square by adding padding with the brand brown background color
bg_color = (74, 55, 40, 255)  # #4a3728 with full alpha
size = max(img.size)
square = Image.new('RGBA', (size, size), bg_color)
offset = ((size - img.size[0]) // 2, (size - img.size[1]) // 2)
square.paste(img, offset, img)

# Generate all icons
icons = {
    'favicon-96x96.png': 96,
    'apple-touch-icon.png': 180,
    'web-app-manifest-192x192.png': 192,
    'web-app-manifest-512x512.png': 512,
}

for filename, px in icons.items():
    resized = square.resize((px, px), Image.LANCZOS)
    out_path = os.path.join(out, filename)
    resized.save(out_path, 'PNG', optimize=True)
    print(f'Generated: {filename} ({px}x{px}px)')

# Generate favicon.ico (multi-size: 16, 32, 48)
ico_path = os.path.join(out, 'favicon.ico')
ico_img = square.resize((48, 48), Image.LANCZOS)
ico_img.save(ico_path, format='ICO', sizes=[(16,16),(32,32),(48,48)])
print('Generated: favicon.ico (16x16, 32x32, 48x48)')

print('\nAll icons generated successfully!')
