# 🚨 TROUBLESHOOTING GOOGLE AUTH - Quest4Couple

## 🎯 PROBLEMA: Pop-up fecha imediatamente

### ✅ SOLUÇÃO RÁPIDA (FAÇA ISTO PRIMEIRO!)

#### 1. Autorizar Domínios no Firebase

1. Vai a: **https://console.firebase.google.com/project/quest4couple/authentication/settings**
2. Scroll até **"Authorized domains"**
3. **VERIFICA se tens:**
   - ✅ `localhost`
   - ✅ `127.0.0.1`

4. **Se NÃO tiver**, clica **"Add domain"** e adiciona:
   ```
   localhost
   ```
   
5. Clica **"Add domain"** novamente e adiciona:
   ```
   127.0.0.1
   ```

6. **GUARDA**

#### 2. Configurar Email de Suporte

1. Vai a: **https://console.firebase.google.com/project/quest4couple/authentication/providers**
2. Clica em **"Google"**
3. **Verifica se tem:**
   - ✅ Toggle ATIVADO (azul)
   - ✅ Email de suporte preenchido
   - ✅ Nome público do projeto preenchido

4. Se falta alguma coisa:
   - Email de suporte: **[teu email]**
   - Nome público: **Quest4Couple**
   
5. Clica **"Save"**

#### 3. Limpar Cache e Testar

```powershell
# 1. Fecha TODAS as tabs do browser
# 2. Limpa cache: Ctrl + Shift + Delete
# 3. Reabre o browser
# 4. Abre: http://localhost:8000/test_firebase.html
```

---

## 🔍 DEBUG PASSO-A-PASSO

### Passo 1: Testar Firebase

1. Abre: `http://localhost:8000/test_firebase.html`
2. Verifica os 4 checks:
   - ✅ Firebase SDK carregado
   - ✅ Firebase Auth inicializado
   - ✅ Firestore inicializado
   - ✅ Google Provider configurado

**Se algum estiver ❌, há problema no firebase-config.js**

### Passo 2: Testar Google Login

1. No `test_firebase.html`, clica **"Testar Google Login"**
2. **Vê o que acontece:**

#### Cenário A: Popup abre e funciona ✅
```
→ Seleciona conta Google
→ Login bem-sucedido
→ Mostra email e UID
```
**SOLUÇÃO:** Tudo OK! Volta para auth.html e tenta lá.

#### Cenário B: Popup fecha imediatamente ❌
```
→ Console mostra: "auth/unauthorized-domain"
```
**SOLUÇÃO:** Adiciona localhost aos domínios autorizados (ver acima)

#### Cenário C: Erro "popup blocked" ❌
```
→ Browser bloqueou popup
```
**SOLUÇÃO:** 
- Permite popups para localhost
- Ou usa outro browser (Chrome recomendado)

#### Cenário D: Erro "cancelled-popup-request" ❌
```
→ Múltiplos cliques
```
**SOLUÇÃO:** Espera 2-3 segundos entre cliques

---

## 🔧 CORREÇÕES ESPECÍFICAS

### Erro: "auth/unauthorized-domain"

```bash
Causa: Domínio não autorizado no Firebase
```

**Solução:**
1. Firebase Console > Authentication > Settings
2. Authorized domains > Add domain
3. Adiciona: `localhost` e `127.0.0.1`

### Erro: "auth/operation-not-allowed"

```bash
Causa: Google OAuth não está ativado
```

**Solução:**
1. Firebase Console > Authentication > Sign-in method
2. Google > Ativar toggle
3. Define email de suporte
4. Save

### Erro: "auth/popup-closed-by-user"

```bash
Causa: Fechaste o popup manualmente
```

**Solução:** Normal, tenta novamente

### Erro: "Firebase not defined"

```bash
Causa: Scripts do Firebase não carregaram
```

**Solução:**
1. Verifica internet
2. Verifica se scripts estão em auth.html:
```html
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>
```

---

## 🎯 CHECKLIST COMPLETA

Execute na ordem:

- [ ] **1. Domínios Autorizados**
  - [ ] localhost adicionado
  - [ ] 127.0.0.1 adicionado

- [ ] **2. Google OAuth Configurado**
  - [ ] Toggle ativado
  - [ ] Email de suporte definido
  - [ ] Nome público definido

- [ ] **3. Servidor Local Rodando**
  - [ ] `python -m http.server 8000` OU
  - [ ] Live Server VS Code OU
  - [ ] `npx http-server -p 8000`

- [ ] **4. Cache Limpo**
  - [ ] Ctrl+Shift+Delete
  - [ ] Limpar cookies
  - [ ] Recarregar página

- [ ] **5. Testar test_firebase.html**
  - [ ] Todos os checks ✅
  - [ ] Botão "Testar Google Login" funciona

- [ ] **6. Testar auth.html**
  - [ ] Botão "Continuar com Google" funciona
  - [ ] Redireciona para dashboard

---

## 💡 DICAS PRO

### Use Chrome
```
Chrome tem melhor suporte para Firebase Auth
Edge e Firefox às vezes dão problemas com popups
```

### Use Live Server (VS Code)
```
1. Instala extensão "Live Server"
2. Right-click auth.html > "Open with Live Server"
3. URL será: http://127.0.0.1:5500/auth.html
```

### Abre DevTools ANTES de clicar
```
1. F12 (abre DevTools)
2. Console tab
3. DEPOIS clica "Continuar com Google"
4. Vê os logs em tempo real
```

---

## 📞 AINDA NÃO FUNCIONA?

### Copia isto e envia-me:

1. **Console Output** (F12 > Console):
   ```
   [Cola aqui os erros que aparecem]
   ```

2. **Firebase Console - Authorized Domains**:
   ```
   [Lista dos domínios que tens autorizados]
   ```

3. **Firebase Console - Google Provider**:
   ```
   [Toggle ativado? Sim/Não]
   [Email de suporte: _____]
   ```

4. **Browser e URL**:
   ```
   Browser: [Chrome/Edge/Firefox]
   URL: [http://localhost:8000/auth.html ou outro]
   ```

5. **test_firebase.html Results**:
   ```
   Check 1: [✅/❌]
   Check 2: [✅/❌]
   Check 3: [✅/❌]
   Check 4: [✅/❌]
   ```

---

## ✅ SOLUÇÃO ALTERNATIVA (Funciona 100%)

Enquanto fixes o Google OAuth, **USA EMAIL/PASSWORD**:

1. `auth.html` > Tab **"Registar"**
2. Nome: "Teste User"
3. Email: "teste@example.com"
4. Password: "teste123"
5. Clica "Criar Conta"

**Isto deve funcionar imediatamente!**

Se Email/Password funciona mas Google não, é 100% problema de configuração do Google OAuth no Firebase.

---

## 🎯 PRÓXIMO PASSO

**Abre agora:** `test_firebase.html` e diz-me o que aparece! 🔍
