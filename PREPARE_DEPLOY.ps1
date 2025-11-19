# Script para preparar deploy do Quest4Couple
# Cria pasta limpa com apenas ficheiros necessários para produção

Write-Host "🚀 Preparando Quest4Couple para Deploy..." -ForegroundColor Cyan
Write-Host ""

# Verificar se pasta deploy_temp já existe
if (Test-Path "deploy_temp") {
    Write-Host "⚠️  Pasta deploy_temp já existe. A remover..." -ForegroundColor Yellow
    Remove-Item -Path "deploy_temp" -Recurse -Force
}

# Criar pasta temporária
Write-Host "📁 A criar pasta deploy_temp..." -ForegroundColor Green
New-Item -ItemType Directory -Force -Path "deploy_temp" | Out-Null

# Copiar ficheiros HTML
Write-Host "📄 A copiar ficheiros HTML..." -ForegroundColor Green
Copy-Item -Path "index.html" -Destination "deploy_temp\" -ErrorAction SilentlyContinue
Copy-Item -Path "app.html" -Destination "deploy_temp\" -ErrorAction SilentlyContinue
Copy-Item -Path "auth.html" -Destination "deploy_temp\" -ErrorAction SilentlyContinue
Copy-Item -Path "dashboard.html" -Destination "deploy_temp\" -ErrorAction SilentlyContinue
Copy-Item -Path "tutorial.html" -Destination "deploy_temp\" -ErrorAction SilentlyContinue

# Copiar pastas essenciais
Write-Host "📂 A copiar CSS..." -ForegroundColor Green
Copy-Item -Path "css" -Destination "deploy_temp\" -Recurse -ErrorAction SilentlyContinue

Write-Host "📂 A copiar JavaScript..." -ForegroundColor Green
Copy-Item -Path "js" -Destination "deploy_temp\" -Recurse -ErrorAction SilentlyContinue

Write-Host "📂 A copiar Assets..." -ForegroundColor Green
Copy-Item -Path "assets" -Destination "deploy_temp\" -Recurse -ErrorAction SilentlyContinue

Write-Host "📂 A copiar Data..." -ForegroundColor Green
Copy-Item -Path "data" -Destination "deploy_temp\" -Recurse -ErrorAction SilentlyContinue

Write-Host "📂 A copiar Pages..." -ForegroundColor Green
Copy-Item -Path "pages" -Destination "deploy_temp\" -Recurse -ErrorAction SilentlyContinue

# Copiar favicons
Write-Host "🎨 A copiar favicons..." -ForegroundColor Green
Copy-Item -Path "favicon.ico" -Destination "deploy_temp\" -ErrorAction SilentlyContinue
Copy-Item -Path "favicon-16x16.png" -Destination "deploy_temp\" -ErrorAction SilentlyContinue
Copy-Item -Path "favicon-32x32.png" -Destination "deploy_temp\" -ErrorAction SilentlyContinue
Copy-Item -Path "apple-touch-icon.png" -Destination "deploy_temp\" -ErrorAction SilentlyContinue

# Copiar netlify.toml
Write-Host "⚙️  A copiar netlify.toml..." -ForegroundColor Green
Copy-Item -Path "netlify.toml" -Destination "deploy_temp\" -ErrorAction SilentlyContinue

# Contar ficheiros
$fileCount = (Get-ChildItem -Path "deploy_temp" -Recurse -File).Count
$folderCount = (Get-ChildItem -Path "deploy_temp" -Recurse -Directory).Count

Write-Host ""
Write-Host "✅ Preparação concluída!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Estatísticas:" -ForegroundColor Cyan
Write-Host "   • Ficheiros: $fileCount" -ForegroundColor White
Write-Host "   • Pastas: $folderCount" -ForegroundColor White
Write-Host ""

# Perguntar se quer criar ZIP
$createZip = Read-Host "Criar arquivo ZIP para deploy? (S/N)"

if ($createZip -eq "S" -or $createZip -eq "s") {
    Write-Host ""
    Write-Host "📦 A criar quest4couple_deploy.zip..." -ForegroundColor Cyan
    
    # Remover ZIP antigo se existir
    if (Test-Path "quest4couple_deploy.zip") {
        Remove-Item -Path "quest4couple_deploy.zip" -Force
    }
    
    # Criar ZIP
    Compress-Archive -Path "deploy_temp\*" -DestinationPath "quest4couple_deploy.zip" -Force
    
    $zipSize = [math]::Round((Get-Item "quest4couple_deploy.zip").Length / 1MB, 2)
    
    Write-Host ""
    Write-Host "✅ ZIP criado com sucesso!" -ForegroundColor Green
    Write-Host "   • Tamanho: $zipSize MB" -ForegroundColor White
    Write-Host "   • Localização: quest4couple_deploy.zip" -ForegroundColor White
    Write-Host ""
    Write-Host "🚀 Próximos passos:" -ForegroundColor Cyan
    Write-Host "   1. Vai a https://app.netlify.com/drop" -ForegroundColor White
    Write-Host "   2. Arrasta quest4couple_deploy.zip" -ForegroundColor White
    Write-Host "   3. Aguarda o deploy" -ForegroundColor White
    Write-Host "   4. Configura o domínio quest4couple.pt" -ForegroundColor White
    Write-Host ""
}

Write-Host "📖 Lê o guia completo em: docs/DEPLOY_QUEST4COUPLE_PT.md" -ForegroundColor Yellow
Write-Host ""

# Perguntar se quer abrir a pasta
$openFolder = Read-Host "Abrir pasta deploy_temp? (S/N)"

if ($openFolder -eq "S" -or $openFolder -eq "s") {
    explorer.exe "deploy_temp"
}

Write-Host ""
Write-Host "💕 Quest4Couple pronto para deploy!" -ForegroundColor Magenta
Write-Host ""
