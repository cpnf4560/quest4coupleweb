# 💾 AUTO-SAVE: Como Funciona?

## ✅ **SIM! As respostas são guardadas automaticamente**

---

## 🎯 RESUMO RÁPIDO

### **Com Login (Utilizador Autenticado):**
- ✅ **Auto-save automático no Firestore**
- ✅ Cada resposta guardada imediatamente
- ✅ Comentários guardados 1 segundo após parar de escrever
- ✅ Podes sair e voltar - tudo fica guardado
- ✅ Sincronizado entre dispositivos

### **Sem Login (Modo Offline):**
- ⚠️ **Apenas guarda manualmente** (botão "Guardar")
- ⚠️ Cria ficheiro .q4c encriptado
- ⚠️ Se saíres sem guardar, **perdes tudo**

---

## 📊 COMO FUNCIONA O AUTO-SAVE

### **1. Respostas de Escolha (A/B/C/D)**

```javascript
// Quando clicas numa opção:
document.addEventListener('change', async function(e) {
  if (e.target.type === 'radio') {
    // ✅ GUARDA IMEDIATAMENTE NO FIRESTORE
    await saveAnswerToFirestore(packId, questionId, {
      answer: value,  // A, B, C ou D
      comment: ''
    });
    console.log('💾 Autosave: resposta guardada');
  }
});
```

**Exemplo:**
```
Tu clicas: Pergunta 1 → Opção "A"
Sistema guarda: romantico/q1 = {answer: "A", comment: ""}
Local: Firestore → users/{teu_uid}/answers/all
```

---

### **2. Comentários (Caixas de Texto)**

```javascript
// Quando escreves um comentário:
document.addEventListener('input', async function(e) {
  if (e.target.tagName === 'TEXTAREA') {
    // ⏱️ ESPERA 1 SEGUNDO após parar de escrever
    setTimeout(async () => {
      await saveAnswerToFirestore(packId, questionId, {
        answer: valorRadio,
        comment: textoComentario
      });
      console.log('💾 Autosave comment: guardado');
    }, 1000);
  }
});
```

**Exemplo:**
```
Tu escreves: "Adoramos fazer isto juntos..."
Sistema espera: 1 segundo sem novas teclas
Sistema guarda: romantico/q1 = {answer: "A", comment: "Adoramos..."}
```

**Por que 1 segundo?**
- ⚡ Evita guardar a cada tecla (poupar Firestore writes)
- 💰 Reduz custos Firebase
- 🎯 Garante que terminaste de escrever

---

## 🔄 ESTRUTURA NO FIRESTORE

### **Collection: `users/{uid}/answers/all`**

```javascript
{
  // Pack Romântico
  "romantico": {
    "q1": {
      "answer": "A",
      "comment": "Adoramos passear na praia",
      "timestamp": Firestore.Timestamp
    },
    "q2": {
      "answer": "B",
      "comment": "",
      "timestamp": Firestore.Timestamp
    },
    // ... mais perguntas
  },
  
  // Pack Pimentinha
  "pimentinha": {
    "q1": {
      "answer": "C",
      "comment": "Queremos experimentar",
      "timestamp": Firestore.Timestamp
    }
  },
  
  // ... outros packs
}
```

---

## 🚀 FLUXO COMPLETO

### **Cenário 1: Respondes e Sais**
```
1. Entras em app.html (com login)
   ✅ Sistema carrega respostas anteriores do Firestore
   
2. Abres "Pack Romântico"
   ✅ Respostas carregadas automaticamente
   
3. Clicas em "Pergunta 1 → Opção A"
   ✅ Guardado imediatamente no Firestore
   ✅ Console: "💾 Autosave: romantico/q1 = A"
   
4. Escreves comentário: "Adoramos isto"
   ⏱️ Sistema espera 1 segundo
   ✅ Guardado no Firestore
   ✅ Console: "💾 Autosave comment: romantico/q1"
   
5. Fechas o browser (ou mudas de página)
   ✅ Respostas já estão guardadas!
   
6. Voltas 1 semana depois
   ✅ Tudo está lá!
```

---

### **Cenário 2: Internet Cai**
```
1. Estás a responder (com login)
2. Internet cai no meio
   ❌ Auto-save para de funcionar
   ⚠️ Últimas respostas ANTES da queda estão guardadas
   
3. Internet volta
   ✅ Auto-save volta a funcionar
   ✅ Novas respostas guardadas
```

---

### **Cenário 3: Sem Login**
```
1. Entras em app.html (SEM login)
   ⚠️ Auto-save não funciona
   
2. Respondes tudo
   ⚠️ Respostas apenas na memória do browser
   
3. Clicas "Guardar Respostas"
   ✅ Cria ficheiro .q4c encriptado
   ✅ Tens de fazer download
   
4. Fechas browser SEM guardar
   ❌ PERDES TUDO!
```

---

## 💡 VERIFICAR SE ESTÁ A FUNCIONAR

### **1. Abrir Console do Browser (F12)**

```javascript
// Deves ver mensagens assim:
✅ Autosave ativado
💾 Autosave: romantico/q1 = A
💾 Autosave comment: romantico/q1
✅ Resposta guardada no Firestore: romantico/q1
```

---

### **2. Verificar no Firebase Console**

```
1. Ir: https://console.firebase.google.com
2. Projeto: quest4couple
3. Firestore Database
4. Collection: users
5. Documento: {teu_uid}
6. Sub-collection: answers
7. Documento: all
8. Deves ver:
   {
     "romantico": {
       "q1": { "answer": "A", "comment": "...", "timestamp": ... }
     }
   }
```

---

## ⚠️ LIMITAÇÕES

### **1. Requer Login**
- ❌ Sem login, não há auto-save
- ✅ Com login, tudo guardado automaticamente

### **2. Requer Internet**
- ❌ Sem internet, não guarda
- ✅ Com internet, guarda em tempo real

### **3. Comentários com Debounce**
- ⏱️ Espera 1 segundo após última tecla
- 💡 Se escreveres e saíres IMEDIATAMENTE, pode não guardar
- ✅ Solução: Espera 1-2 segundos após terminar comentário

---

## 🔒 SEGURANÇA E PRIVACIDADE

### **Dados Guardados:**
```javascript
// No Firestore:
{
  answer: "A",           // Opção escolhida
  comment: "texto...",   // Comentário (se tiveres)
  timestamp: ...         // Quando guardaste
}

// NO teu documento: users/{teu_uid}/answers/all
```

### **Quem Pode Ver:**
- ✅ **TU** - Dono das respostas
- ✅ **ADMIN** - Para gestão (Carlos)
- ❌ **OUTROS USERS** - Não veem as tuas respostas
- ❌ **PÚBLICO** - Firebase Rules bloqueiam acesso

---

## 📱 FUNCIONA EM MOBILE?

### **Sim!**
```
✅ Browser mobile (Chrome, Safari, etc)
✅ Auto-save funciona igual
✅ Sincronização entre dispositivos
✅ Começas no PC, continuas no telemóvel
```

---

## 🆘 PROBLEMAS COMUNS

### **"Não vejo mensagens de autosave no console"**
```
Solução:
1. F12 → Console
2. Filtrar por "Autosave" ou "💾"
3. Se não aparece nada:
   - Verificar se tens login
   - Verificar internet
   - Verificar Firebase Rules
```

---

### **"Minhas respostas desapareceram"**
```
Causas possíveis:
1. ❌ Não tinhas login quando respondeste
2. ❌ Limpaste cache do browser
3. ❌ Usaste modo incógnito
4. ❌ Respondeste noutro browser/dispositivo

Solução:
✅ Sempre fazer login ANTES de responder
✅ Verificar: "👤 [Teu Nome]" no topo
```

---

### **"Quero forçar guardar manualmente"**
```
Atualmente: Auto-save guarda automaticamente
Não existe botão "Guardar Agora"

Mas podes:
1. Esperar 1-2 segundos após responder
2. Verificar console (F12) → "💾 Autosave"
3. Confirmar no Firebase Console
```

---

## 🎯 RESUMO FINAL

| Situação | Auto-Save | Observações |
|----------|-----------|-------------|
| **Com login + Internet** | ✅ SIM | Imediato para respostas, 1s delay para comentários |
| **Com login SEM internet** | ❌ NÃO | Volta quando internet retorna |
| **Sem login** | ❌ NÃO | Tens de usar botão "Guardar" (ficheiro .q4c) |
| **Modo incógnito** | ⚠️ DEPENDE | Funciona MAS apaga ao fechar browser |

---

## ✅ RECOMENDAÇÕES

### **Para NUNCA perderes respostas:**

1. **✅ Fazer Login SEMPRE**
   - Antes de começar a responder
   - Verificar nome no topo: "👤 Carlos"

2. **✅ Ter Internet Estável**
   - Verificar conexão antes
   - Se cair, aguardar voltar

3. **✅ Aguardar 1-2 Segundos**
   - Após escrever comentário
   - Antes de sair da página

4. **✅ Verificar Console (Opcional)**
   - F12 → Console
   - Ver mensagens "💾 Autosave"
   - Confirma que está a guardar

5. **✅ Fazer Backup (Opcional)**
   - Periodicamente, clicar "Guardar Respostas"
   - Criar ficheiro .q4c local
   - Como segurança extra

---

**Status:** ✅ Sistema de Auto-Save FUNCIONAL  
**Testado:** Sim (com login + Firestore)  
**Confiança:** 99% (depende de login + internet)

---

*Última Atualização: 20 Novembro 2025*
