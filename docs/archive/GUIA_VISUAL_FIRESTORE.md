# 📸 GUIA VISUAL - Criar Admin no Firestore

## 🎯 PASSO A PASSO COM DETALHES

### 1️⃣ Abrir Firestore Database

```
Firebase Console → Firestore Database → Data
```

---

### 2️⃣ Ir para Collection "users"

- Se a collection `users` **JÁ EXISTE:**
  → Clicar na collection `users`
  
- Se **NÃO EXISTE:**
  → Clicar "Start collection"
  → Collection ID: `users`
  → Clicar "Next"

---

### 3️⃣ Adicionar Documento Admin

#### Opção A: Se collection já existe
```
1. Dentro da collection "users"
2. Clicar: "Add document"
3. Document ID: [COLAR O UID COPIADO do Authentication]
   Exemplo: sK3mP9xYz2AbC8dEfGhI
```

#### Opção B: Se está a criar collection agora
```
1. Document ID: [COLAR O UID COPIADO]
2. (Os campos serão adicionados a seguir)
```

---

### 4️⃣ Adicionar Campos (UM POR UM)

#### Campo 1: uid
```
┌─────────────────────────────────────┐
│ Field                               │
│ ┌───────────────┐ ┌──────────────┐ │
│ │ Field name    │ │ Field type   │ │
│ │ uid           │ │ string       │ │
│ └───────────────┘ └──────────────┘ │
│ ┌───────────────────────────────┐  │
│ │ Field value                   │  │
│ │ sK3mP9xYz2AbC8dEfGhI         │  │ ← COLAR UID copiado
│ └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

**Instruções:**
1. Clicar: "Add field" (botão verde/azul)
2. Field name: digitar `uid`
3. Field type: selecionar `string` (dropdown)
4. Field value: COLAR o UID que copiou do Authentication
5. Clicar ✓ ou Enter

---

#### Campo 2: email
```
┌─────────────────────────────────────┐
│ Field                               │
│ ┌───────────────┐ ┌──────────────┐ │
│ │ Field name    │ │ Field type   │ │
│ │ email         │ │ string       │ │
│ └───────────────┘ └──────────────┘ │
│ ┌───────────────────────────────┐  │
│ │ Field value                   │  │
│ │ admin@quest4couple.com        │  │
│ └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

**Instruções:**
1. Clicar: "Add field"
2. Field name: digitar `email`
3. Field type: selecionar `string`
4. Field value: digitar `admin@quest4couple.com`
5. Clicar ✓

---

#### Campo 3: displayName
```
┌─────────────────────────────────────┐
│ Field                               │
│ ┌───────────────┐ ┌──────────────┐ │
│ │ Field name    │ │ Field type   │ │
│ │ displayName   │ │ string       │ │
│ └───────────────┘ └──────────────┘ │
│ ┌───────────────────────────────┐  │
│ │ Field value                   │  │
│ │ Admin Quest4Couple            │  │
│ └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

**Instruções:**
1. Clicar: "Add field"
2. Field name: digitar `displayName`
3. Field type: selecionar `string`
4. Field value: digitar `Admin Quest4Couple`
5. Clicar ✓

---

#### Campo 4: isAdmin ⭐ **MAIS IMPORTANTE!**
```
┌─────────────────────────────────────┐
│ Field                               │
│ ┌───────────────┐ ┌──────────────┐ │
│ │ Field name    │ │ Field type   │ │
│ │ isAdmin       │ │ boolean      │ │
│ └───────────────┘ └──────────────┘ │
│ ┌───────────────────────────────┐  │
│ │ Field value                   │  │
│ │ ☑ true   ☐ false              │  │ ← MARCAR "true"
│ └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

**Instruções:**
1. Clicar: "Add field"
2. Field name: digitar `isAdmin`
3. Field type: selecionar `boolean` (dropdown)
4. Field value: **MARCAR** o checkbox/toggle para `true`
   - Pode aparecer como: ☑ true / ☐ false
   - Ou como toggle: ON/OFF
   - **CERTIFIQUE-SE** que está `true` / ON / checked
5. Clicar ✓

---

#### Campo 5: createdAt (OPCIONAL)
```
┌─────────────────────────────────────┐
│ Field                               │
│ ┌───────────────┐ ┌──────────────┐ │
│ │ Field name    │ │ Field type   │ │
│ │ createdAt     │ │ timestamp    │ │
│ └───────────────┘ └──────────────┘ │
│ ┌───────────────────────────────┐  │
│ │ Field value                   │  │
│ │ 📅 27/11/2025 14:30:00        │  │ ← Clicar calendário
│ └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

**Instruções:**
1. Clicar: "Add field"
2. Field name: digitar `createdAt`
3. Field type: selecionar `timestamp` (dropdown)
4. Field value: 
   - Clicar no ícone de **calendário** 📅
   - Selecionar data/hora atual
   - OU se não aparecer "now", escolher data manualmente
5. Clicar ✓

**💡 ALTERNATIVA:** Se não conseguir adicionar timestamp, pode **pular este campo**. Ele será criado automaticamente no primeiro login.

---

#### Campo 6: authProvider
```
┌─────────────────────────────────────┐
│ Field                               │
│ ┌───────────────┐ ┌──────────────┐ │
│ │ Field name    │ │ Field type   │ │
│ │ authProvider  │ │ string       │ │
│ └───────────────┘ └──────────────┘ │
│ ┌───────────────────────────────┐  │
│ │ Field value                   │  │
│ │ password                      │  │ ← A PALAVRA "password"
│ └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

**Instruções:**
1. Clicar: "Add field"
2. Field name: digitar `authProvider`
3. Field type: selecionar `string`
4. Field value: digitar `password` (a palavra "password", não a senha!)
5. Clicar ✓

**⚠️ ATENÇÃO:** 
- Este campo indica o **método de autenticação**
- `password` = login com email/password
- **NÃO** colocar a senha `rzq7xgq8` aqui!
- A senha já está no Firebase Authentication

---

### 5️⃣ Salvar Documento

```
Depois de adicionar TODOS os campos:
1. Verificar se todos estão corretos (ver lista abaixo)
2. Clicar no botão: "Save" (verde/azul)
3. Aguardar confirmação
```

---

## ✅ VERIFICAÇÃO FINAL

Antes de clicar "Save", confirmar:

```
Document ID: sK3mP9xYz2AbC8dEfGhI (o UID copiado)
├─ uid: "sK3mP9xYz2AbC8dEfGhI" (string)
├─ email: "admin@quest4couple.com" (string)
├─ displayName: "Admin Quest4Couple" (string)
├─ isAdmin: true (boolean) ← ✅ DEVE SER TRUE!
├─ createdAt: 27/11/2025 14:30:00 (timestamp) [opcional]
└─ authProvider: "password" (string)
```

**Se tudo estiver correto:** Clicar "Save"

---

## 🎯 CAMPOS OBRIGATÓRIOS vs OPCIONAIS

### ✅ OBRIGATÓRIOS (SEM ESTES NÃO FUNCIONA):
- ✅ `uid` (string)
- ✅ `email` (string)
- ✅ `displayName` (string)
- ✅ `isAdmin: true` (boolean) ← **CRÍTICO!**

### 📝 OPCIONAIS (podem ser adicionados depois):
- 📝 `createdAt` (timestamp) - será adicionado automaticamente
- 📝 `authProvider` (string) - bom ter, mas não crítico

---

## 🐛 PROBLEMAS COMUNS

### ❌ Problema: "Não vejo opção 'now' no timestamp"
**Solução:** 
- Clicar no ícone de calendário 📅
- Selecionar data/hora manualmente
- OU pular o campo `createdAt` (será adicionado automaticamente)

### ❌ Problema: "isAdmin está 'false' em vez de 'true'"
**Solução:**
- Deletar o campo `isAdmin`
- Adicionar novamente
- **MARCAR** o checkbox/toggle para `true`
- Verificar que mostra ☑ true ou ON

### ❌ Problema: "Coloquei rzq7xgq8 no authProvider"
**Solução:**
- **ERRADO!** Isso é a senha do admin
- `authProvider` deve ser a palavra `password`
- Significa: "este utilizador usa email+password para login"

---

## 📞 RESUMO RÁPIDO

```
Campo          | Tipo      | Valor
---------------|-----------|----------------------------------
uid            | string    | [UID copiado do Authentication]
email          | string    | admin@quest4couple.com
displayName    | string    | Admin Quest4Couple
isAdmin        | boolean   | true ✅
createdAt      | timestamp | [data atual] (opcional)
authProvider   | string    | password (a palavra, não a senha!)
```

---

**Data:** 27 de Novembro de 2025  
**Dificuldade:** ⭐⭐ Médio  
**Tempo:** 5 minutos  
**Mais importante:** `isAdmin: true` ✅
