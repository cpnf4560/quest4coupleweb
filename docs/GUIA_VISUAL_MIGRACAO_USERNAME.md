# 🎯 GUIA VISUAL - MIGRAÇÃO DE USERNAMES

## 📸 PASSO-A-PASSO COM SCREENSHOTS

---

### 🔴 PASSO 1: Aceder ao Admin BackOffice

```
URL: https://quest4couple.pt/pages/admin.html
```

**O que verás:**
```
┌─────────────────────────────────────┐
│  🔐 Admin BackOffice - Quest4Couple │
│                                     │
│  📧 Email: [admin@email.com]       │
│  🔒 Password: [********]            │
│                                     │
│  [      Entrar      ]              │
└─────────────────────────────────────┘
```

**Ação:** Fazer login com credenciais de admin

---

### 🟡 PASSO 2: Ir para Tab "Utilizadores"

**O que verás após login:**
```
┌─────────────────────────────────────────────────────┐
│  📊 Dashboard | 👥 Utilizadores | 📈 Relatórios ...  │
└─────────────────────────────────────────────────────┘
                     ↑
              CLICAR AQUI
```

**Ação:** Clicar no tab "👥 Utilizadores"

---

### 🟠 PASSO 3: Verificar Alerta

**O que verás se há utilizadores sem username:**
```
┌─────────────────────────────────────────────────────┐
│  👥 Utilizadores Registados                          │
│  [📥 Exportar CSV] [🔧 Migrar Usernames]             │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  ⚠️  Utilizadores sem username: 5                    │
│                                                      │
│  Alguns utilizadores ainda não têm username         │
│  definido. Clique em "Migrar Usernames" para        │
│  adicionar automaticamente.                          │
└─────────────────────────────────────────────────────┘
              ↑
    SE VIRES ISTO, PRECISAS MIGRAR!
```

---

### 🟢 PASSO 4: Clicar no Botão "Migrar Usernames"

**O que verás:**
```
┌─────────────────────────────────────────────────────┐
│  👥 Utilizadores Registados                          │
│  [📥 Exportar CSV] [🔧 Migrar Usernames] ← CLICAR   │
└─────────────────────────────────────────────────────┘
```

**Popup de confirmação:**
```
┌─────────────────────────────────────────────────────┐
│  ⚠️ Atenção!                                         │
│                                                      │
│  Esta operação vai adicionar automaticamente um     │
│  username a todos os utilizadores que ainda não     │
│  têm um definido.                                    │
│                                                      │
│  Os usernames serão gerados com base no nome ou     │
│  email do utilizador.                                │
│                                                      │
│  Desejas continuar?                                  │
│                                                      │
│  [    Cancelar    ]  [      OK      ]                │
└─────────────────────────────────────────────────────┘
```

**Ação:** Clicar em "OK"

---

### 🔵 PASSO 5: Aguardar Processamento

**O que verás na consola do browser (F12):**
```
Console:
🔄 Migrando 5 utilizadores...
✅ carlos@example.com -> @carloscorreia
✅ anairi@example.com -> @anairiscandeiasreis
✅ user1@example.com -> @user1
✅ user2@example.com -> @user2
✅ user3@example.com -> @user3
```

**Tempo:** ~5-10 segundos para 5 utilizadores

---

### 🟢 PASSO 6: Ver Resultado

**Popup de sucesso:**
```
┌─────────────────────────────────────────────────────┐
│  📊 MIGRAÇÃO CONCLUÍDA                               │
│                                                      │
│  ✅ Sucesso: 5 utilizadores                          │
│  ❌ Erros: 0 utilizadores                            │
│                                                      │
│  🎉 Todos os usernames foram adicionados com         │
│     sucesso!                                         │
│                                                      │
│  [             OK             ]                      │
└─────────────────────────────────────────────────────┘
```

**Ação:** Clicar em "OK"

---

### ✅ PASSO 7: Verificar Tabela

**O que verás na tabela atualizada:**
```
┌──────────────────────────────────────────────────────────────┐
│  Email              │ Nome    │ Username           │ Sexo ... │
├──────────────────────────────────────────────────────────────┤
│  carlos@email.com   │ Carlos  │ @carloscorreia     │ ♂️  ... │
│  anairi@email.com   │ Anaíris │ @anairiscandeiasreis │ ♀️  ... │
│  user1@email.com    │ User 1  │ @user1             │ ♂️  ... │
│  user2@email.com    │ User 2  │ @user2             │ ♀️  ... │
│  user3@email.com    │ User 3  │ @user3             │ ⚧️  ... │
└──────────────────────────────────────────────────────────────┘

✅ TODOS COM USERNAME!
```

**E o alerta desaparece:**
```
┌─────────────────────────────────────────────────────┐
│  👥 Utilizadores Registados                          │
│  [📥 Exportar CSV] [🔧 Migrar Usernames]             │
└─────────────────────────────────────────────────────┘

(SEM ALERTA AMARELO - Tudo OK!)
```

---

### 🎯 PASSO 8: Testar Funcionalidade

**Teste 1: Procurar Parceiro**
```
1. Ir para: /relatorio.html
2. Clicar em "➕ Adicionar" (ao lado do dropdown de parceiro)
3. Modal abre:

┌─────────────────────────────────────────────────────┐
│  ➕ Adicionar Parceiro                               │
│                                                      │
│  🔍 Procurar por username:                           │
│  [@anairiscandeiasreis          ]                    │
│                                   [Procurar]         │
│                                                      │
│  ┌─────────────────────────────────────────────┐    │
│  │  ✅ Encontrado!                              │    │
│  │  👩 Anaíris Reis                             │    │
│  │  @anairiscandeiasreis                        │    │
│  │  [➕ Adicionar como Parceiro]                │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

**Resultado Esperado:** ✅ Parceiro encontrado!

---

## 📊 ANTES vs DEPOIS

### ❌ ANTES (Problema)
```
Firebase Console → users collection:

{
  "uid": "ABC123",
  "email": "carlos@example.com",
  "name": "Carlos",
  "username": null  ← ❌ NÃO EXISTE
}

Pesquisa: @carloscorreia
Resultado: ❌ "Utilizador não encontrado"
```

### ✅ DEPOIS (Corrigido)
```
Firebase Console → users collection:

{
  "uid": "ABC123",
  "email": "carlos@example.com",
  "name": "Carlos",
  "username": "carloscorreia"  ← ✅ EXISTE!
}

Pesquisa: @carloscorreia
Resultado: ✅ "Utilizador encontrado!"
```

---

## 🎉 SUCESSO!

```
╔═══════════════════════════════════════════════════╗
║                                                   ║
║  ✅ Migração Completa!                            ║
║                                                   ║
║  📊 5 utilizadores migrados                       ║
║  🎯 100% sucesso                                  ║
║  ⏱️ Tempo: 10 segundos                            ║
║                                                   ║
║  Agora podes:                                     ║
║  ✅ Fazer commit das alterações                   ║
║  ✅ Adicionar parceiros funciona                  ║
║  ✅ Novos registos incluem username               ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
```

---

## 🚀 PRÓXIMOS PASSOS

### 1. Commit das alterações:
```powershell
git add .
git commit -m "fix: Adicionar campo username obrigatório no registo + migração automática"
git push origin main
```

### 2. Testar em produção:
```
✅ Login como @carloscorreia
✅ Adicionar @anairiscandeiasreis como parceira
✅ Gerar relatório de compatibilidade
✅ Ver que tudo funciona! 🎉
```

---

## ❓ RESOLUÇÃO DE PROBLEMAS

### Problema: Alerta amarelo não aparece
```
Causa: Todos os utilizadores já têm username
Solução: ✅ Está tudo OK! Pode fazer commit.
```

### Problema: Erro na migração
```
Causa: Problema de conexão Firebase ou permissões
Solução: 
1. Verificar consola (F12) para erro específico
2. Verificar credenciais Firebase
3. Tentar novamente
```

### Problema: Username duplicado
```
Causa: Dois utilizadores com mesmo nome/email
Solução: Sistema adiciona número automaticamente
Exemplo: carlos → carlos1, carlos2, etc.
```

---

**Tempo Total:** ~2-5 minutos  
**Dificuldade:** 🟢 Fácil  
**Requer:** Acesso admin ao BackOffice  
**Reversível:** Não (mas não há problema)

---

**Criado:** 20 Novembro 2025  
**Última Atualização:** 20 Novembro 2025

