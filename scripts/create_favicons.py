from PIL import Image
import os

print("🎨 Gerando favicons...")

# Abrir logo
logo = Image.open('assets/logo.png')
print(f"✅ Logo: {logo.size}")

# Converter para RGBA
logo = logo.convert('RGBA')

# Gerar tamanhos
sizes = [
    (16, 'favicon-16x16.png'),
    (32, 'favicon-32x32.png'),
    (180, 'apple-touch-icon.png'),
    (192, 'android-chrome-192x192.png'),
    (512, 'android-chrome-512x512.png'),
]

for size, name in sizes:
    img = logo.resize((size, size), Image.Resampling.LANCZOS)
    img.save(name, 'PNG', optimize=True)
    print(f"✅ {name}")

# Criar favicon.ico
ico_img = logo.resize((32, 32), Image.Resampling.LANCZOS)
ico_img.save('favicon.ico', format='ICO')
print("✅ favicon.ico")

print("\n🎉 CONCLUÍDO!")
