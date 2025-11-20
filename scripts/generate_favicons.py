"""
Script para gerar favicons profissionais a partir do logo.png
Cria todos os tamanhos necessários: 16x16, 32x32, 180x180 (Apple), e favicon.ico
"""

from PIL import Image
import os

def generate_favicons():
    print("🎨 Gerando favicons profissionais...")
    
    # Paths
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    logo_path = os.path.join(project_root, 'assets', 'logo.png')
    
    # Verificar se logo existe
    if not os.path.exists(logo_path):
        print(f"❌ ERRO: Logo não encontrado em {logo_path}")
        return False
    
    print(f"✅ Logo encontrado: {logo_path}")
    
    # Abrir logo original
    try:
        logo = Image.open(logo_path)
        print(f"✅ Logo carregado: {logo.size[0]}x{logo.size[1]}px")
    except Exception as e:
        print(f"❌ ERRO ao abrir logo: {e}")
        return False
    
    # Converter para RGBA se necessário
    if logo.mode != 'RGBA':
        logo = logo.convert('RGBA')
        print("🔄 Convertido para RGBA")
    
    # Definir tamanhos necessários
    sizes = [
        (16, 16, 'favicon-16x16.png'),
        (32, 32, 'favicon-32x32.png'),
        (180, 180, 'apple-touch-icon.png'),
        (192, 192, 'android-chrome-192x192.png'),
        (512, 512, 'android-chrome-512x512.png'),
    ]
    
    print("\n📦 Gerando ficheiros:")
    
    # Gerar cada tamanho
    for width, height, filename in sizes:
        try:
            # Redimensionar com alta qualidade
            resized = logo.resize((width, height), Image.Resampling.LANCZOS)
            
            # Salvar PNG
            output_path = os.path.join(project_root, filename)
            resized.save(output_path, 'PNG', optimize=True)
            
            file_size = os.path.getsize(output_path)
            print(f"   ✅ {filename} ({width}x{height}) - {file_size/1024:.1f}KB")
            
        except Exception as e:
            print(f"   ❌ ERRO ao gerar {filename}: {e}")
            return False
    
    # Gerar favicon.ico (múltiplos tamanhos dentro do mesmo arquivo)
    print("\n🔧 Gerando favicon.ico multi-tamanho...")
    try:
        ico_sizes = [(16, 16), (32, 32), (48, 48)]
        ico_images = []
        
        for size in ico_sizes:
            resized = logo.resize(size, Image.Resampling.LANCZOS)
            ico_images.append(resized)
        
        ico_path = os.path.join(project_root, 'favicon.ico')
        ico_images[0].save(
            ico_path,
            format='ICO',
            sizes=[img.size for img in ico_images],
            append_images=ico_images[1:]
        )
        
        file_size = os.path.getsize(ico_path)
        print(f"   ✅ favicon.ico (multi-tamanho) - {file_size/1024:.1f}KB")
        
    except Exception as e:
        print(f"   ❌ ERRO ao gerar favicon.ico: {e}")
        return False
    
    print("\n🎉 SUCESSO! Todos os favicons foram gerados!")
    print(f"📁 Localização: {project_root}")
    print("\n📋 Ficheiros criados:")
    print("   • favicon.ico (16x16, 32x32, 48x48)")
    print("   • favicon-16x16.png")
    print("   • favicon-32x32.png")
    print("   • apple-touch-icon.png (180x180)")
    print("   • android-chrome-192x192.png")
    print("   • android-chrome-512x512.png")
    
    return True

if __name__ == '__main__':
    try:
        success = generate_favicons()
        if success:
            print("\n✨ Próximos passos:")
            print("   1. Os favicons já estão na raiz do projeto")
            print("   2. Abrir qualquer página HTML no browser")
            print("   3. Verificar ícone na tab do browser")
            print("   4. Limpar cache se necessário (Ctrl+Shift+R)")
        else:
            print("\n⚠️ Houve problemas. Verificar mensagens acima.")
    except Exception as e:
        print(f"\n💥 ERRO CRÍTICO: {e}")
        import traceback
        traceback.print_exc()
