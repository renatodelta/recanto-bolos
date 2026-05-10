from PIL import Image
import os

path = 'imgs/laranja.webp'
img = Image.open(path)
print(f'Tamanho original: {img.size}')

resized = img.resize((1264, 842), Image.LANCZOS)
resized.save(path, 'WEBP', quality=85, optimize=True)

size_kb = os.path.getsize(path) / 1024
print(f'Redimensionado para: {resized.size}')
print(f'Novo tamanho em disco: {size_kb:.0f} KB')
