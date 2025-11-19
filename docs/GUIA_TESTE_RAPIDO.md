# 🧪 GUIA RÁPIDO DE TESTE - Quest4Couple v2.0

## 🚀 INICIAR SERVIDOR

### Opção 1: Python
```powershell
cd "g:\O meu disco\Formação JAVA - Projetos\Quest4Couple_v2_free"
python -m http.server 8000
```

### Opção 2: Batch File
```powershell
.\START_SERVER.bat
```

**URL:** http://localhost:8000

---

## ✅ TESTE 1: INDEX.HTML - Sem Login

### Passos:
1. Abrir: http://localhost:8000/index.html
2. **Verificar header:**
   - ✅ Logo "Quest4Couple"
   - ✅ Botão "Entrar"
   - ✅ Botão "Criar Conta"
3. **Tentar aceder app.html diretamente:**
   - Ir para: http://localhost:8000/app.html
   - ✅ Deve mostrar alert: "⚠️ Precisa fazer login..."
   - ✅ Deve redirecionar para auth.html

### ✅ PASSOU | ❌ FALHOU

---

## ✅ TESTE 2: CRIAR CONTA & LOGIN

### Passos:
1. Clicar "Criar Conta" no index.html
2. Preencher:
   - Nome: "Teste User"
   - Email: "teste@quest4couple.com"
   - Password: "123456"
   - Confirmar: "123456"
3. Clicar "Criar Conta"
4. **Verificar:**
   - ✅ Mensagem de sucesso
   - ✅ Redirecionamento para dashboard.html

### ✅ PASSOU | ❌ FALHOU

---

## ✅ TESTE 3: DASHBOARD - Botão Início

### Passos:
1. Estar no dashboard.html (após login)
2. **Verificar header:**
   - ✅ Botão "🏠 Início" (visível)
   - ✅ Nome do user: "Teste User"
   - ✅ Botão "Sair"
3. Clicar "🏠 Início"
4. **Verificar:**
   - ✅ Redireciona para index.html
   - ✅ Header do index mostra "📊 Dashboard" (não "Entrar")

### ✅ PASSOU | ❌ FALHOU

---

## ✅ TESTE 4: INDEX.HTML - Com Login

### Passos:
1. Estar logado
2. Ir para: http://localhost:8000/index.html
3. **Verificar header:**
   - ✅ "👤 Teste User"
   - ✅ Botão "📊 Dashboard"
   - ✅ Botão "Sair"
   - ❌ NÃO deve mostrar "Entrar" ou "Criar Conta"
4. Clicar "📊 Dashboard"
5. **Verificar:**
   - ✅ Redireciona para dashboard.html

### ✅ PASSOU | ❌ FALHOU

---

## ✅ TESTE 5: APP.HTML - Autenticação

### Passos:
1. Estar no dashboard.html
2. Clicar em qualquer pack (ex: "Pack Romântico")
3. **Verificar:**
   - ✅ Redireciona para app.html
   - ✅ Header mostra "👤 Teste User"
   - ✅ Botão "📊 Dashboard" visível
   - ✅ Botão "🚪 Sair" visível
4. **Abrir Console do Browser** (F12)
5. **Verificar logs:**
   - ✅ "✅ User autenticado: teste@quest4couple.com"

### ✅ PASSOU | ❌ FALHOU

---

## ✅ TESTE 6: AUTOSAVE - Respostas

### Passos:
1. Estar no app.html
2. Abrir pack "Romântico"
3. **Responder pergunta 1:**
   - Clicar "Sim"
4. **Verificar Console:**
   - ✅ Mensagem: `💾 Autosave: romantico/q1 = sim`
5. **Responder pergunta 2:**
   - Clicar "Não"
6. **Verificar Console:**
   - ✅ Mensagem: `💾 Autosave: romantico/q2 = nao`
7. **Adicionar comentário na pergunta 1:**
   - Escrever: "Teste de comentário"
   - Esperar 1-2 segundos
8. **Verificar Console:**
   - ✅ Mensagem: `💾 Autosave comment: romantico/q1`

### ✅ PASSOU | ❌ FALHOU

---

## ✅ TESTE 7: CARREGAMENTO DE RESPOSTAS

### Passos:
1. **Ter respostas salvas** (do teste anterior)
2. Voltar aos temas (clicar "← Voltar aos Temas")
3. Abrir novamente pack "Romântico"
4. **Verificar Console:**
   - ✅ Mensagem: `📥 Carregando respostas salvas para romantico`
5. **Verificar perguntas:**
   - ✅ Pergunta 1 está marcada como "Sim"
   - ✅ Pergunta 2 está marcada como "Não"
   - ✅ Comentário da pergunta 1 aparece: "Teste de comentário"
6. **Verificar barra de progresso:**
   - ✅ Mostra "2/30 respondidas"

### ✅ PASSOU | ❌ FALHOU

---

## ✅ TESTE 8: LOGOUT

### Passos:
1. Estar no app.html
2. Clicar botão "🚪 Sair"
3. **Verificar:**
   - ✅ Aparece confirmação: "Tem certeza que deseja sair?"
   - Clicar "OK"
   - ✅ Redireciona para auth.html
4. Tentar aceder: http://localhost:8000/app.html
5. **Verificar:**
   - ✅ Alert: "⚠️ Precisa fazer login..."
   - ✅ Redireciona para auth.html

### ✅ PASSOU | ❌ FALHOU

---

## ✅ TESTE 9: FLUXO COMPLETO

### Passos:
1. **Login:**
   - index.html → "Entrar" → Login → Dashboard
2. **Navegação:**
   - Dashboard → "🏠 Início" → Index (com botão Dashboard)
   - Index → "📊 Dashboard" → Dashboard
3. **Questionários:**
   - Dashboard → "Pack Romântico" → App.html
   - Responder 5 perguntas
   - Verificar autosave no console
4. **Voltar:**
   - App → "📊 Dashboard" → Dashboard
5. **Reabrir pack:**
   - Dashboard → "Pack Romântico"
   - Verificar respostas carregadas
6. **Logout:**
   - App → "🚪 Sair" → Auth.html

### ✅ PASSOU | ❌ FALHOU

---

## ✅ TESTE 10: FIRESTORE (Opcional)

### Verificar dados no Firebase Console:

1. Ir para: https://console.firebase.google.com
2. Selecionar projeto "quest4couple"
3. Ir para: **Firestore Database**
4. Navegar até: `users/{userId}/answers/all`
5. **Verificar estrutura:**
   ```
   all/
     romantico/
       q1: { answer: "sim", comment: "...", timestamp: ... }
       q2: { answer: "nao", comment: "", timestamp: ... }
   ```

### ✅ PASSOU | ❌ FALHOU

---

## 🐛 TROUBLESHOOTING

### ❌ Erro: "auth is not defined"
**Solução:**
1. Verificar se `firebase-config.js` existe
2. Verificar se está carregado no HTML antes de outros scripts

### ❌ Erro: "Cannot read property 'currentUser' of undefined"
**Solução:**
1. Verificar ordem dos scripts no HTML:
   ```html
   <script src="firebase-config.js"></script>
   <script src="firestore-sync.js"></script>
   <script src="app.js"></script>
   ```

### ❌ Autosave não funciona
**Solução:**
1. Abrir Console (F12)
2. Verificar erros
3. Verificar se `saveAnswerToFirestore` existe
4. Testar manualmente: `saveAnswerToFirestore('romantico', 'q1', {answer: 'sim', comment: ''})`

### ❌ Respostas não carregam
**Solução:**
1. Verificar se user está autenticado
2. Verificar Firestore rules (permitir read/write)
3. Verificar Console para erros

---

## 📊 RESULTADO FINAL

| Teste | Status | Notas |
|-------|--------|-------|
| 1. Index sem login | ☐ | |
| 2. Criar conta | ☐ | |
| 3. Dashboard botão início | ☐ | |
| 4. Index com login | ☐ | |
| 5. App autenticação | ☐ | |
| 6. Autosave respostas | ☐ | |
| 7. Carregamento respostas | ☐ | |
| 8. Logout | ☐ | |
| 9. Fluxo completo | ☐ | |
| 10. Firestore (opcional) | ☐ | |

**Total: __ / 10**

---

## ✅ CRITÉRIOS DE APROVAÇÃO

### Mínimo para produção:
- ✅ Testes 1-5: **OBRIGATÓRIOS** (Autenticação básica)
- ✅ Testes 6-8: **RECOMENDADOS** (Autosave)
- ⚪ Teste 9: **IDEAL** (Fluxo completo)
- ⚪ Teste 10: **OPCIONAL** (Verificação manual Firestore)

**SE TODOS OS TESTES 1-8 PASSAREM:**
🎉 **PRONTO PARA PRODUÇÃO!**

---

**Data:** 19 NOV 2025  
**Versão:** Quest4Couple v2.0  
**Status:** 🧪 Em Teste
