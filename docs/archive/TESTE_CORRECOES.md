# 🧪 TESTE DAS CORREÇÕES - Quest4Couple

## ✅ CHECKLIST DE TESTES

### 🔐 **TESTE 1: Admin Login**

#### Passos:
1. ✅ Abrir browser e ir para: `http://localhost:5500/pages/admin.html` (ou URL do servidor)
2. ✅ Abrir DevTools (F12) → Aba Console
3. ✅ Inserir credenciais de admin:
   - Username: `admin` (ou o configurado)
   - Password: `[sua-senha-admin]`
4. ✅ Clicar em "Login"

#### Resultado Esperado:
```
Console logs:
🔐 Tentativa de login...
👤 Username inserido: admin
🔑 Username esperado: admin
✅ Username match: true
✅ Password match: true
✅ Login bem-sucedido!
📊 A mostrar dashboard...
✅ Firebase carregado: [object Object]
✅ Firestore disponível: [object Object]
🔄 A carregar dados do Firebase...
👥 A buscar utilizadores...
✅ Snapshot recebido: X utilizadores
```

#### UI Esperada:
- ✅ Login form desaparece
- ✅ Dashboard aparece
- ✅ Estatísticas carregam (Total Users, Active Couples, etc.)
- ✅ Tabelas mostram dados do Firestore
- ✅ Sem erros no console

#### ❌ Se Falhar:
- Verificar se `ADMIN_USERNAME` e `ADMIN_PASSWORD` estão definidos em `admin.html`
- Verificar se Firebase está carregado corretamente
- Verificar console para mensagens de erro
- Limpar cache do browser (Ctrl + Shift + Delete)

---

### 📝 **TESTE 2: Registo com Email/Password**

#### Passos:
1. ✅ Abrir browser e ir para: `http://localhost:5500/auth.html`
2. ✅ Abrir DevTools (F12) → Aba Console
3. ✅ Clicar na tab "Registar"
4. ✅ Preencher formulário:
   - **Nome completo:** João Silva
   - **Email:** teste@example.com (usar email único!)
   - **Password:** Senha123!
   - **Confirmar Password:** Senha123!
   - **Username:** joaosilva123
   - **Género:** Masculino
   - **Faixa Etária:** 25-34
   - **País:** Portugal
   - **Cidade:** Lisboa
5. ✅ Clicar em "Registar"

#### Resultado Esperado:
```
Console logs:
📝 Criando conta com email/password...
✅ Utilizador criado no Firebase Auth: teste@example.com
✅ DisplayName atualizado: João Silva
💾 Dados adicionais guardados temporariamente
✅ Conta criada com sucesso: teste@example.com
⏳ Perfil será criado no Firestore pelo onAuthStateChanged...
✅ User autenticado: teste@example.com
🔵 Criando/atualizando perfil para: teste@example.com
📦 Dados pendentes encontrados: {gender: "male", ageRange: "25-34", ...}
🔵 Perfil não existe, criando novo...
✅ Perfil criado com sucesso!
✅ Perfil criado/atualizado no Firestore
🔄 Redirecionando para dashboard...
```

#### UI Esperada:
- ✅ Loading/spinner aparece durante processo
- ✅ Sem mensagens de erro
- ✅ Redirect automático para `dashboard.html` após ~1 segundo
- ✅ Dashboard carrega com dados do novo utilizador

#### Verificação no Firebase Console:
1. ✅ Ir para Firebase Console → Authentication
2. ✅ Ver novo utilizador na lista: `teste@example.com`
3. ✅ Ir para Firebase Console → Firestore Database
4. ✅ Abrir collection `users`
5. ✅ Ver documento com UID do novo utilizador
6. ✅ Verificar campos:
   ```javascript
   {
     uid: "...",
     email: "teste@example.com",
     displayName: "João Silva",
     name: "João Silva",
     username: "joaosilva123",
     gender: "male",
     ageRange: "25-34",
     country: "PT",
     countryName: "Portugal",
     city: "Lisboa",
     createdAt: [timestamp],
     lastLoginAt: [timestamp],
     authProvider: "password",
     isAdmin: false
   }
   ```

#### ❌ Se Falhar:
- **Erro: "Missing or insufficient permissions"**
  - Verificar Firestore Security Rules (ver `FIRESTORE_RULES_RECOMENDADAS.md`)
  - Verificar se `sessionStorage` está a guardar dados
  - Verificar logs no console

- **Erro: "Email already in use"**
  - Email já está registado
  - Usar outro email ou eliminar utilizador no Firebase Console

- **Erro: "Weak password"**
  - Password deve ter pelo menos 6 caracteres
  - Usar password mais forte

---

### 🔑 **TESTE 3: Login com Email/Password**

#### Passos:
1. ✅ Ir para `auth.html` (se ainda não estiver)
2. ✅ Se estiver logado, fazer logout primeiro
3. ✅ Clicar na tab "Login"
4. ✅ Inserir credenciais:
   - Email: `teste@example.com`
   - Password: `Senha123!`
5. ✅ Clicar em "Entrar"

#### Resultado Esperado:
```
Console logs:
✅ Login bem-sucedido: teste@example.com
✅ User autenticado: teste@example.com
🔵 Criando/atualizando perfil para: teste@example.com
🔵 Perfil existe, atualizando last login...
✅ Perfil atualizado
✅ Perfil criado/atualizado no Firestore
🔄 Redirecionando para dashboard...
```

#### UI Esperada:
- ✅ Redirect para `dashboard.html`
- ✅ Dashboard carrega com dados do utilizador
- ✅ Sem erros no console

#### Verificação no Firestore:
- ✅ Campo `lastLoginAt` foi atualizado para timestamp atual

---

### 🔵 **TESTE 4: Google Sign-In**

#### Passos:
1. ✅ Ir para `auth.html`
2. ✅ Se estiver logado, fazer logout primeiro
3. ✅ Clicar em "Continuar com Google"
4. ✅ Selecionar conta Google no popup
5. ✅ Autorizar permissões

#### Resultado Esperado:
```
Console logs:
🔵 Iniciando Google Sign In...
✅ Login Google bem-sucedido: user@gmail.com
✅ User autenticado: user@gmail.com
🔵 Criando/atualizando perfil para: user@gmail.com
🔵 Perfil não existe, criando novo... (ou "Perfil existe, atualizando...")
✅ Perfil criado/atualizado no Firestore
🔄 Redirecionando para dashboard...
```

#### UI Esperada:
- ✅ Popup Google abre
- ✅ Após autorização, redirect para `dashboard.html`
- ✅ Dashboard carrega com dados do Google (nome, foto, email)
- ✅ Sem erros no console

#### Verificação no Firestore:
- ✅ Perfil criado com dados do Google:
  ```javascript
  {
    uid: "...",
    email: "user@gmail.com",
    displayName: "Nome do Google",
    photoURL: "https://...",
    authProvider: "google.com",
    ...
  }
  ```

---

### 🚪 **TESTE 5: Logout**

#### Passos:
1. ✅ Estar logado em `dashboard.html`
2. ✅ Clicar em botão "Logout" (ou similar)

#### Resultado Esperado:
```
Console logs:
✅ Logout bem-sucedido
```

#### UI Esperada:
- ✅ Redirect para `index.html` ou `auth.html`
- ✅ Utilizador desconectado
- ✅ Sem erros no console

---

### 🔄 **TESTE 6: Proteção de Rotas**

#### Teste 6.1: Aceder Dashboard sem Login
1. ✅ Fazer logout (se estiver logado)
2. ✅ Tentar aceder diretamente: `dashboard.html`

**Resultado Esperado:**
- ✅ Redirect automático para `auth.html`
- ✅ Console: `"❌ User não autenticado"` → `"🔄 Redirecionando para auth..."`

#### Teste 6.2: Aceder Auth já Logado
1. ✅ Estar logado
2. ✅ Tentar aceder: `auth.html`

**Resultado Esperado:**
- ✅ Redirect automático para `dashboard.html`
- ✅ Console: `"✅ User autenticado"` → `"🔄 Redirecionando para dashboard..."`

---

## 📊 RESUMO DOS TESTES

### Tabela de Resultados:

| Teste | Descrição | Status | Notas |
|-------|-----------|--------|-------|
| 1 | Admin Login | ⏳ Pendente | |
| 2 | Registo Email/Password | ⏳ Pendente | |
| 3 | Login Email/Password | ⏳ Pendente | |
| 4 | Google Sign-In | ⏳ Pendente | |
| 5 | Logout | ⏳ Pendente | |
| 6.1 | Proteção: Dashboard sem login | ⏳ Pendente | |
| 6.2 | Proteção: Auth já logado | ⏳ Pendente | |

**Instruções:**
- ✅ = Passou
- ❌ = Falhou
- ⏳ = Pendente
- ⚠️ = Parcialmente funcional

---

## 🐛 TROUBLESHOOTING

### Problema: "Firebase is not defined"
**Solução:**
1. Verificar se `firebase-config.js` está a ser carregado
2. Verificar ordem dos scripts no HTML:
   ```html
   <!-- Firebase SDK -->
   <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js"></script>
   <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-auth.js"></script>
   <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-firestore.js"></script>
   
   <!-- Firebase Config -->
   <script src="../js/firebase-config.js"></script>
   
   <!-- Auth Scripts -->
   <script src="../js/auth.js"></script>
   ```

### Problema: "Missing or insufficient permissions"
**Solução:**
1. Verificar Firestore Security Rules (ver `FIRESTORE_RULES_RECOMENDADAS.md`)
2. Verificar se utilizador está autenticado antes de escrever
3. Verificar se `request.auth.uid == userId` nas rules
4. Verificar logs no console para ver onde falha

### Problema: "Popup blocked by browser"
**Solução:**
1. Permitir popups no browser para o site
2. Em vez de popup, usar redirect (mudar para `signInWithRedirect`)

### Problema: Cache antigo
**Solução:**
```powershell
# Limpar cache do browser
# Chrome: Ctrl + Shift + Delete → Limpar tudo
# Ou usar script:
.\LIMPAR_CACHE_CHROME.bat
```

---

## 📝 NOTAS IMPORTANTES

### 1. **Email Único**
- Cada teste de registo precisa de um **email único**
- Se testar múltiplas vezes, usar: `teste1@example.com`, `teste2@example.com`, etc.
- Ou eliminar utilizadores de teste no Firebase Console entre testes

### 2. **Logs de Debug**
- Todos os logs começam com emojis: 🔐, ✅, ❌, 🔵, 📝, etc.
- Se não ver logs, verificar se console está a filtrar mensagens

### 3. **Timing**
- Alguns processos têm delays intencionais (ex: redirect após 500ms)
- Aguardar até ver mensagem de redirect antes de assumir que falhou

### 4. **Firebase Console**
- Sempre verificar Firebase Console após cada teste
- Confirmar que dados foram salvos corretamente no Firestore
- Verificar Authentication tab para ver utilizadores criados

---

## ✅ CRITÉRIOS DE SUCESSO

**Todos os testes devem:**
1. ✅ Executar sem erros no console
2. ✅ Mostrar logs de debug esperados
3. ✅ Criar/atualizar dados no Firestore
4. ✅ Redirecionar corretamente
5. ✅ UI responder adequadamente

**Se todos os testes passarem:**
- ✅ Correções implementadas com sucesso!
- ✅ Sistema de autenticação funcional
- ✅ Pronto para produção

---

**Data:** 27 de Novembro de 2025
**Versão:** Quest4Couple v2 Free
**Estado:** ✅ Documento de testes criado

