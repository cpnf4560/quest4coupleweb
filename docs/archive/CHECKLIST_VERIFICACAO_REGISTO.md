# ✅ CHECKLIST DE VERIFICAÇÃO - CORREÇÃO REGISTO EMAIL

**Use esta checklist para confirmar que tudo está OK**

---

## 📋 PRÉ-REQUISITOS

### Firebase Configuration
- [ ] Firebase projeto criado
- [ ] **Authentication** → Email/Password habilitado
- [ ] **Firestore Database** criado (modo produção ou teste)
- [ ] **Firestore Rules** publicadas:
  ```javascript
  match /users/{userId} {
    allow create: if request.auth != null && request.auth.uid == userId;
    allow read, update: if request.auth != null && request.auth.uid == userId;
  }
  ```

### Ficheiros Locais
- [ ] `js/firebase-config.js` com configuração correta
- [ ] `js/auth.js` modificado (onAuthStateChanged com `firestoreSuccess`)
- [ ] `js/auth-ui.js` modificado (timeout de 5s)
- [ ] Todos os ficheiros carregam sem erros (verificar DevTools)

---

## 🧪 TESTES FUNCIONAIS

### ✅ Teste 1: Registo Normal (Caminho Feliz)

#### 1.1 Preparação
- [ ] Abrir browser em modo privado/incógnito
- [ ] Abrir DevTools (F12)
- [ ] Ir para tab **Console**
- [ ] Navegar para `auth.html`

#### 1.2 Preenchimento
- [ ] Clicar em tab **"Registar"**
- [ ] Preencher **Nome**: `Teste User`
- [ ] Preencher **Username**: `testeuser123` (minúsculas, único)
- [ ] Preencher **Email**: `teste@example.com` (único)
- [ ] Preencher **Password**: `Test123456` (mín. 6 caracteres)
- [ ] Selecionar **Sexo**: `Masculino` ou `Feminino`
- [ ] Selecionar **Faixa Etária**: qualquer
- [ ] Selecionar **País**: `Portugal` ou outro
- [ ] Preencher **Cidade**: `Lisboa` ou outra
- [ ] ✅ Marcar checkbox **"Aceito os Termos..."**

#### 1.3 Submissão
- [ ] Clicar **"Criar Conta"**
- [ ] Loading spinner aparece
- [ ] **Console mostra:**
  ```
  ✅ User autenticado: teste@example.com
  🔍 User UID: [algum UID]
  🔵 Chamando createOrUpdateUserProfile...
  📦 Dados pendentes encontrados: {...}
  💾 Executando userRef.set()...
  ✅ Perfil criado com sucesso!
  🔄 Redirecionando para dashboard...
  ⏳ Aguardando 2 segundos...
  ✅ Redirecionando agora...
  ```

#### 1.4 Verificação
- [ ] **Após ~2 segundos:** Redirect para `dashboard.html`
- [ ] Dashboard carrega sem erros
- [ ] Nome do utilizador aparece no dashboard
- [ ] **Firebase Console → Authentication:**
  - [ ] Utilizador aparece na lista
  - [ ] Email correto
- [ ] **Firebase Console → Firestore → users:**
  - [ ] Documento com UID do utilizador existe
  - [ ] Campos presentes:
    - [ ] `uid`
    - [ ] `email`
    - [ ] `displayName`
    - [ ] `name`
    - [ ] `username`
    - [ ] `gender`
    - [ ] `ageRange`
    - [ ] `country`
    - [ ] `countryName`
    - [ ] `city`
    - [ ] `createdAt` (timestamp)
    - [ ] `lastLoginAt` (timestamp)
    - [ ] `authProvider: "password"`
    - [ ] `isAdmin: false`

✅ **Se todos os itens acima OK → Teste 1 PASSOU!**

---

### ❌ Teste 2: Registo com Erro (Firestore Rules Bloqueadas)

#### 2.1 Preparação
- [ ] **Firebase Console → Firestore → Rules**
- [ ] Modificar temporariamente:
  ```javascript
  match /users/{userId} {
    allow create: if false; // ❌ BLOQUEIA (apenas teste!)
    allow read, update: if request.auth != null && request.auth.uid == userId;
  }
  ```
- [ ] **Publicar rules**
- [ ] Aguardar 1-2 minutos (propagação)
- [ ] Abrir browser em modo privado
- [ ] Abrir DevTools → Console

#### 2.2 Preenchimento
- [ ] Ir para `auth.html` → tab "Registar"
- [ ] Preencher com dados **DIFERENTES** do Teste 1:
  - [ ] Email: `teste2@example.com` (diferente!)
  - [ ] Username: `testeuser456` (diferente!)
  - [ ] (resto dos campos normalmente)

#### 2.3 Submissão
- [ ] Clicar **"Criar Conta"**
- [ ] Loading spinner aparece
- [ ] **Console mostra:**
  ```
  ✅ User autenticado: teste2@example.com
  🔵 Chamando createOrUpdateUserProfile...
  💾 Executando userRef.set()...
  ❌ ========================================
  ❌ ERRO AO CRIAR/ATUALIZAR PERFIL NO FIRESTORE
  ❌ Error code: permission-denied
  ❌ Error message: Missing or insufficient permissions
  🔴 NÃO REDIRECIONAR - Perfil não foi criado!
  ```

#### 2.4 Verificação (Após 5 segundos)
- [ ] Loading spinner **desaparece**
- [ ] Mensagem de erro **aparece** (vermelha):
  ```
  ⚠️ Conta criada mas houve erro ao guardar dados.
  Por favor contacta suporte ou tenta fazer login novamente.
  ```
- [ ] Utilizador **FICA em auth.html** (não redireciona)
- [ ] **Console mostra:**
  ```
  🔴 Timeout: Perfil não foi criado no Firestore após 5 segundos
  ```

#### 2.5 Verificação Firebase
- [ ] **Firebase Console → Authentication:**
  - [ ] Utilizador `teste2@example.com` **EXISTE** ✅
  - [ ] (Conta foi criada no Auth)
- [ ] **Firebase Console → Firestore → users:**
  - [ ] Documento **NÃO EXISTE** ❌
  - [ ] (Como esperado - rules bloquearam)

#### 2.6 Limpeza
- [ ] **IMPORTANTE:** Reverter Firestore Rules para o normal:
  ```javascript
  match /users/{userId} {
    allow create: if request.auth != null && request.auth.uid == userId;
    allow read, update: if request.auth != null && request.auth.uid == userId;
  }
  ```
- [ ] **Publicar rules**
- [ ] **Firebase Console → Authentication:**
  - [ ] Apagar utilizador `teste2@example.com` (não tem perfil)

✅ **Se todos os itens acima OK → Teste 2 PASSOU!**

---

### 🔄 Teste 3: Login Após Registo

#### 3.1 Preparação
- [ ] Garantir que Teste 1 foi concluído com sucesso
- [ ] Utilizador `teste@example.com` existe
- [ ] Fazer **Logout** do dashboard

#### 3.2 Login
- [ ] Ir para `auth.html`
- [ ] Tab **"Login"** (não Registar)
- [ ] Preencher:
  - [ ] Email: `teste@example.com`
  - [ ] Password: `Test123456`
- [ ] Clicar **"Entrar"**

#### 3.3 Verificação
- [ ] Loading spinner aparece
- [ ] **Console mostra:**
  ```
  ✅ Login bem-sucedido: teste@example.com
  ✅ User autenticado: teste@example.com
  🔵 Perfil existe, atualizando last login...
  ✅ Perfil atualizado
  ```
- [ ] Redirect para `dashboard.html` (após 2s)
- [ ] Dashboard carrega com dados do utilizador
- [ ] **Firestore Console:**
  - [ ] Campo `lastLoginAt` foi atualizado (timestamp recente)

✅ **Se todos os itens acima OK → Teste 3 PASSOU!**

---

## 🐛 TESTES DE EDGE CASES

### Edge Case 1: Username Duplicado
- [ ] Tentar registar com username já existente
- [ ] Deve mostrar erro: "Username já está em uso"
- [ ] Não cria conta no Firebase Auth

### Edge Case 2: Email Duplicado
- [ ] Tentar registar com email já existente
- [ ] Deve mostrar erro: "Este email já está registado"
- [ ] Não cria conta no Firebase Auth

### Edge Case 3: Campos Vazios
- [ ] Tentar submeter formulário com campos vazios
- [ ] Deve mostrar erro: "Por favor preenche todos os campos obrigatórios"
- [ ] HTML5 validation deve prevenir submit

### Edge Case 4: Password Fraca
- [ ] Tentar registar com password < 6 caracteres
- [ ] Deve mostrar erro: "Password muito fraca (mínimo 6 caracteres)"

### Edge Case 5: Username Inválido
- [ ] Tentar username com letras maiúsculas: `TestUser`
- [ ] Deve mostrar erro: "Username inválido. Use apenas minúsculas..."
- [ ] Tentar username com espaços: `test user`
- [ ] Deve mostrar erro: "Username inválido..."
- [ ] Tentar username < 3 caracteres: `ab`
- [ ] Deve mostrar erro: "O username deve ter pelo menos 3 caracteres"

---

## 📊 RESUMO FINAL

### ✅ Todos os Testes Passaram?

**Marque com ✅ ou ❌:**

- [ ] **Teste 1:** Registo normal funciona
- [ ] **Teste 2:** Erro mostra mensagem ao utilizador
- [ ] **Teste 3:** Login após registo funciona
- [ ] **Edge Case 1:** Username duplicado bloqueado
- [ ] **Edge Case 2:** Email duplicado bloqueado
- [ ] **Edge Case 3:** Validação de campos vazios OK
- [ ] **Edge Case 4:** Password fraca bloqueada
- [ ] **Edge Case 5:** Username inválido bloqueado

---

### 🎉 Se TODOS ✅:
**PARABÉNS! Sistema está 100% funcional!**

### 📝 Documentação de Referência:
- `CORRECAO_REGISTO_EMAIL_FINAL.md` - Documentação técnica
- `TESTAR_REGISTO_EMAIL.md` - Guia de testes
- `FLUXO_REGISTO_COMPARACAO.md` - Diagramas antes/depois

---

### ⚠️ Se algum ❌:
1. Verificar **Console logs** para erro específico
2. Verificar **Firestore Rules** no Firebase Console
3. Verificar **Authentication** está habilitado
4. Limpar cache do browser (Ctrl+Shift+Delete)
5. Hard reload (Ctrl+F5)
6. Testar em modo incógnito

---

## 📞 SUPORTE

Se encontrares problemas não cobertos aqui:
1. Verificar `DEBUG_FIRESTORE_PERMISSIONS.md`
2. Verificar `DEBUG_REGISTO_AGORA.md`
3. Procurar no console por mensagens de erro específicas
4. Verificar Network tab no DevTools (requests falhados?)

---

**Boa sorte! 🚀**

