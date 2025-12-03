# ✅ Checklist de Validação - Quest4Couple v2.0

## 🎯 VALIDAÇÃO RÁPIDA DAS MELHORIAS

### 1️⃣ LOGIN ADMIN

- [ ] Abrir `http://localhost:8080/pages/admin.html`
- [ ] Inserir username: `carlos.sousacorreia`
- [ ] Inserir password: `[PASSWORD_REMOVIDA]`
- [ ] Clicar em "Entrar no BackOffice"
- [ ] ✅ **Dashboard deve aparecer**
- [ ] Verificar se mostra "5 Packs Disponíveis" (não 7)
- [ ] Verificar se mostra número correto de utilizadores

### 2️⃣ ANALYTICS ANÓNIMO

#### Testar com Dados de Teste:
- [ ] Abrir `http://localhost:8080/tests/test_analytics.html`
- [ ] Clicar em "📊 Adicionar 10 Respostas"
- [ ] ✅ **Deve mostrar mensagem de sucesso**
- [ ] Clicar em "📈 Ver Estatísticas"
- [ ] ✅ **Deve mostrar resumo dos 5 packs**

#### Testar no Admin:
- [ ] Abrir admin → "📊 Analytics Anónimo"
- [ ] Selecionar "❤️ Pack Romântico" no dropdown
- [ ] ✅ **Deve mostrar tabela com estatísticas**
- [ ] Verificar colunas: #, Pergunta, Por favor!, Yup, Meh..., Talvez, Comentários
- [ ] Verificar percentagens calculadas corretamente
- [ ] Clicar em "📥 Exportar CSV"
- [ ] ✅ **Deve fazer download do arquivo CSV**
- [ ] Abrir CSV e verificar formato correto

#### Privacidade:
- [ ] Verificar que NÃO aparecem nomes de utilizadores
- [ ] Verificar que NÃO aparecem textos de comentários
- [ ] Verificar que apenas estatísticas agregadas são mostradas
- [ ] ✅ **Privacidade 100% garantida**

### 3️⃣ BOTÕES COMPACTOS

#### Desktop:
- [ ] Abrir `http://localhost:8080/app.html`
- [ ] Login (se necessário)
- [ ] Scroll até ver os botões abaixo dos packs
- [ ] ✅ **Todos os 6 botões devem estar numa linha**
- [ ] Botões: Guardar, Carregar, Importar, Comparar, PDF, Email
- [ ] Verificar tamanho reduzido mas legível

#### Mobile:
- [ ] Redimensionar janela para < 768px
- [ ] ✅ **Botões devem empilhar verticalmente**
- [ ] Verificar que ficam centralizados
- [ ] Verificar que ocupam largura adequada

### 4️⃣ LOGIN REDDIT

#### Página de Login:
- [ ] Abrir `http://localhost:8080/auth.html`
- [ ] Verificar botão "Continuar com Reddit" visível
- [ ] Verificar cor laranja (#FF4500)
- [ ] Verificar ícone do Reddit (Snoo)
- [ ] Clicar no botão
- [ ] ✅ **Deve mostrar alert informativo**
- [ ] Alert deve explicar que requer backend

#### Página de Registo:
- [ ] Clicar tab "Registar"
- [ ] Verificar botão "Continuar com Reddit" visível
- [ ] Clicar no botão
- [ ] ✅ **Deve mostrar alert informativo**

### 5️⃣ COMPATIBILIDADE

#### Navegadores:
- [ ] Testar no Chrome
- [ ] Testar no Firefox
- [ ] Testar no Edge
- [ ] Testar no Safari (se disponível)
- [ ] ✅ **Tudo deve funcionar igual**

#### Dispositivos:
- [ ] Testar em desktop (1920x1080)
- [ ] Testar em tablet (768x1024)
- [ ] Testar em mobile (375x667)
- [ ] ✅ **Design deve ser responsivo**

---

## 🔧 RESOLUÇÃO DE PROBLEMAS

### ❌ Problema: Admin não aceita login

**Soluções:**
1. Verificar se está em `pages/admin.html` (não `admin.html`)
2. Verificar console do navegador (F12)
3. Verificar se `auth.js` está sendo carregado (Network tab)
4. Limpar cache e cookies (`Ctrl+Shift+Del`)
5. Tentar em modo incógnito

### ❌ Problema: Analytics não mostra dados

**Soluções:**
1. Primeiro popular dados com `test_analytics.html`
2. Verificar localStorage no DevTools (F12 → Application → Local Storage)
3. Procurar chave `q4c_analytics`
4. Se não existir, usar test para popular
5. Refresh na página admin

### ❌ Problema: Botões não cabem numa linha

**Soluções:**
1. Verificar se está em `app.html` (não outra página)
2. Verificar largura da janela (mínimo 900px)
3. Verificar se CSS `main.css` está carregado
4. Procurar por `.controls-bottom` no CSS
5. Limpar cache do navegador

### ❌ Problema: Botão Reddit não aparece

**Soluções:**
1. Verificar se está em `auth.html` atualizado
2. Verificar se `auth.css` tem estilos `.btn-reddit`
3. Limpar cache (Ctrl+F5)
4. Verificar console por erros
5. Verificar se `auth-ui.js` está carregado

---

## 📊 MÉTRICAS DE SUCESSO

### Performance:
- [ ] Admin carrega em < 2 segundos
- [ ] Analytics mostra dados em < 1 segundo
- [ ] Botões respondem imediatamente
- [ ] Sem erros no console

### Usabilidade:
- [ ] Login admin é intuitivo
- [ ] Analytics é fácil de entender
- [ ] Botões são claros e acessíveis
- [ ] Reddit button tem explicação clara

### Código:
- [ ] Sem erros no console
- [ ] Sem warnings no console
- [ ] CSS validado
- [ ] JavaScript sem bugs

---

## 🎉 CRITÉRIOS DE ACEITAÇÃO

✅ **APROVADO** se:
- Login admin funciona com credenciais corretas
- Analytics mostra dados anónimos corretamente
- Botões cabem numa linha em desktop
- Botão Reddit mostra mensagem informativa
- Tudo funciona sem erros

❌ **REPROVAR** se:
- Login admin não funciona
- Analytics mostra dados de utilizadores identificados
- Botões não se ajustam ao tamanho da tela
- Há erros no console
- Funcionalidades não respondem

---

## 📝 NOTAS FINAIS

### Credenciais Admin:
```
Username: carlos.sousacorreia
Password: [PASSWORD_REMOVIDA]
```

### URLs de Teste:
```
Admin:     http://localhost:8080/pages/admin.html
Analytics: http://localhost:8080/tests/test_analytics.html
App:       http://localhost:8080/app.html
Auth:      http://localhost:8080/auth.html
```

### Atalhos Úteis:
```
F12                  - DevTools
Ctrl+Shift+I        - Inspect Element
Ctrl+Shift+Del      - Limpar cache
Ctrl+F5             - Hard refresh
Ctrl+Shift+C        - Element picker
```

---

**Data:** 19 de novembro de 2025
**Versão:** Quest4Couple v2.0 Free
**Status:** Pronto para validação ✅

