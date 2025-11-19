# 🚀 SCRIPT DE DEPLOY - QUEST4COUPLE
# Automatiza preparação e deploy do projeto

Write-Host "🎯 Quest4Couple - Deploy Automation" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se está na pasta correta
$currentPath = Get-Location
Write-Host "📁 Pasta atual: $currentPath" -ForegroundColor Yellow
Write-Host ""

# Menu de opções
Write-Host "Escolha o método de deploy:" -ForegroundColor Green
Write-Host "1. 🌐 Netlify (Recomendado)"
Write-Host "2. 🔥 Firebase Hosting"
Write-Host "3. 📦 GitHub Pages"
Write-Host "4. ⚡ Vercel"
Write-Host "5. 🧪 Testar localmente"
Write-Host "6. 📋 Criar ZIP para upload manual"
Write-Host "0. ❌ Cancelar"
Write-Host ""

$choice = Read-Host "Digite sua escolha (0-6)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "🌐 DEPLOY VIA NETLIFY" -ForegroundColor Cyan
        Write-Host "=====================" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Opções:" -ForegroundColor Yellow
        Write-Host "A. Deploy via Git (automático)"
        Write-Host "B. Deploy via Netlify Drop (manual)"
        Write-Host ""
        
        $netlifyChoice = Read-Host "Escolha (A/B)"
        
        if ($netlifyChoice -eq "A") {
            Write-Host ""
            Write-Host "📦 Preparando repositório Git..." -ForegroundColor Yellow
            
            # Verificar se git está instalado
            try {
                git --version | Out-Null
                Write-Host "✅ Git instalado" -ForegroundColor Green
            } catch {
                Write-Host "❌ Git não encontrado. Instale em: https://git-scm.com/" -ForegroundColor Red
                exit
            }
            
            # Inicializar Git se necessário
            if (-not (Test-Path ".git")) {
                Write-Host "🔧 Inicializando repositório Git..." -ForegroundColor Yellow
                git init
                git add .
                git commit -m "Deploy inicial Quest4Couple v2"
                Write-Host "✅ Repositório criado" -ForegroundColor Green
            } else {
                Write-Host "✅ Repositório Git já existe" -ForegroundColor Green
            }
            
            Write-Host ""
            Write-Host "📝 Próximos passos:" -ForegroundColor Cyan
            Write-Host "1. Crie um repositório no GitHub: https://github.com/new"
            Write-Host "2. Execute os comandos:"
            Write-Host ""
            Write-Host "   git remote add origin https://github.com/SEU_USUARIO/quest4couple.git" -ForegroundColor Yellow
            Write-Host "   git branch -M main" -ForegroundColor Yellow
            Write-Host "   git push -u origin main" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "3. No Netlify (https://app.netlify.com/):"
            Write-Host "   - Add new site → Import from Git"
            Write-Host "   - Conecte seu GitHub e selecione o repo"
            Write-Host "   - Deploy!" -ForegroundColor Green
            
        } elseif ($netlifyChoice -eq "B") {
            Write-Host ""
            Write-Host "📦 NETLIFY DROP - Deploy Manual" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "1. Acesse: https://app.netlify.com/drop" -ForegroundColor Yellow
            Write-Host "2. Faça login (GitHub recomendado)" -ForegroundColor Yellow
            Write-Host "3. ARRASTE ESTA PASTA para o navegador" -ForegroundColor Yellow
            Write-Host "4. Aguarde o deploy (1-2 minutos)" -ForegroundColor Yellow
            Write-Host "5. Site online! 🎉" -ForegroundColor Green
            Write-Host ""
            Write-Host "📁 Pasta para arrastar: $currentPath" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "Pressione qualquer tecla para abrir o Netlify Drop..."
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
            Start-Process "https://app.netlify.com/drop"
        }
    }
    
    "2" {
        Write-Host ""
        Write-Host "🔥 DEPLOY VIA FIREBASE" -ForegroundColor Cyan
        Write-Host "======================" -ForegroundColor Cyan
        Write-Host ""
        
        # Verificar se Firebase CLI está instalado
        try {
            firebase --version | Out-Null
            Write-Host "✅ Firebase CLI instalado" -ForegroundColor Green
        } catch {
            Write-Host "❌ Firebase CLI não encontrado" -ForegroundColor Red
            Write-Host ""
            Write-Host "Instalando Firebase CLI..." -ForegroundColor Yellow
            npm install -g firebase-tools
        }
        
        Write-Host ""
        Write-Host "🔑 Fazendo login no Firebase..." -ForegroundColor Yellow
        firebase login
        
        Write-Host ""
        Write-Host "🚀 Iniciando deploy..." -ForegroundColor Yellow
        firebase deploy --only hosting
        
        Write-Host ""
        Write-Host "✅ Deploy concluído!" -ForegroundColor Green
    }
    
    "3" {
        Write-Host ""
        Write-Host "📦 DEPLOY VIA GITHUB PAGES" -ForegroundColor Cyan
        Write-Host "===========================" -ForegroundColor Cyan
        Write-Host ""
        
        # Verificar Git
        try {
            git --version | Out-Null
            Write-Host "✅ Git instalado" -ForegroundColor Green
        } catch {
            Write-Host "❌ Git não encontrado. Instale em: https://git-scm.com/" -ForegroundColor Red
            exit
        }
        
        Write-Host ""
        Write-Host "📝 Criando repositório..." -ForegroundColor Yellow
        
        if (-not (Test-Path ".git")) {
            git init
            git add .
            git commit -m "Deploy Quest4Couple para GitHub Pages"
            Write-Host "✅ Repositório criado" -ForegroundColor Green
        }
        
        Write-Host ""
        Write-Host "📝 Próximos passos:" -ForegroundColor Cyan
        Write-Host "1. Crie um repositório PÚBLICO no GitHub: https://github.com/new"
        Write-Host "2. Execute:"
        Write-Host ""
        Write-Host "   git remote add origin https://github.com/SEU_USUARIO/quest4couple.git" -ForegroundColor Yellow
        Write-Host "   git branch -M main" -ForegroundColor Yellow
        Write-Host "   git push -u origin main" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "3. No GitHub:"
        Write-Host "   - Settings → Pages"
        Write-Host "   - Source: main branch"
        Write-Host "   - Folder: / (root)"
        Write-Host "   - Save" -ForegroundColor Green
        Write-Host ""
        Write-Host "4. Site disponível em: https://SEU_USUARIO.github.io/quest4couple/" -ForegroundColor Cyan
    }
    
    "4" {
        Write-Host ""
        Write-Host "⚡ DEPLOY VIA VERCEL" -ForegroundColor Cyan
        Write-Host "====================" -ForegroundColor Cyan
        Write-Host ""
        
        # Verificar Vercel CLI
        try {
            vercel --version | Out-Null
            Write-Host "✅ Vercel CLI instalado" -ForegroundColor Green
        } catch {
            Write-Host "❌ Vercel CLI não encontrado" -ForegroundColor Red
            Write-Host ""
            Write-Host "Instalando Vercel CLI..." -ForegroundColor Yellow
            npm install -g vercel
        }
        
        Write-Host ""
        Write-Host "🚀 Iniciando deploy..." -ForegroundColor Yellow
        vercel
        
        Write-Host ""
        Write-Host "✅ Deploy concluído!" -ForegroundColor Green
    }
    
    "5" {
        Write-Host ""
        Write-Host "🧪 TESTE LOCAL" -ForegroundColor Cyan
        Write-Host "===============" -ForegroundColor Cyan
        Write-Host ""
        
        # Verificar se http-server está instalado
        try {
            http-server --version | Out-Null
            Write-Host "✅ http-server instalado" -ForegroundColor Green
        } catch {
            Write-Host "❌ http-server não encontrado" -ForegroundColor Red
            Write-Host ""
            Write-Host "Instalando http-server..." -ForegroundColor Yellow
            npm install -g http-server
        }
        
        Write-Host ""
        Write-Host "🌐 Iniciando servidor local na porta 8080..." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Acesse: http://localhost:8080" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Pressione Ctrl+C para parar o servidor" -ForegroundColor Yellow
        Write-Host ""
        
        http-server -p 8080 -o
    }
    
    "6" {
        Write-Host ""
        Write-Host "📋 CRIAR ZIP PARA UPLOAD" -ForegroundColor Cyan
        Write-Host "=========================" -ForegroundColor Cyan
        Write-Host ""
        
        $zipName = "quest4couple_deploy_$(Get-Date -Format 'yyyyMMdd_HHmmss').zip"
        
        Write-Host "📦 Criando arquivo ZIP..." -ForegroundColor Yellow
        
        # Arquivos a excluir
        $exclude = @(
            "*.md",
            "*.py",
            ".git",
            ".gitignore",
            "node_modules",
            "*.log",
            "*.ps1",
            "*.zip"
        )
        
        # Criar ZIP
        $files = Get-ChildItem -Exclude $exclude -Recurse | Where-Object { !$_.PSIsContainer }
        Compress-Archive -Path $files.FullName -DestinationPath $zipName -Force
        
        Write-Host ""
        Write-Host "✅ ZIP criado: $zipName" -ForegroundColor Green
        Write-Host ""
        Write-Host "📤 Use este ZIP para upload em:" -ForegroundColor Cyan
        Write-Host "- Netlify Drop: https://app.netlify.com/drop" -ForegroundColor Yellow
        Write-Host "- Qualquer hospedagem que aceite sites estáticos" -ForegroundColor Yellow
    }
    
    "0" {
        Write-Host ""
        Write-Host "❌ Deploy cancelado" -ForegroundColor Red
        exit
    }
    
    default {
        Write-Host ""
        Write-Host "❌ Opção inválida" -ForegroundColor Red
        exit
    }
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "🎉 Processo concluído!" -ForegroundColor Green
Write-Host ""
Write-Host "📚 Consulte DEPLOY_ONLINE_AGORA.md para mais detalhes" -ForegroundColor Yellow
Write-Host ""
