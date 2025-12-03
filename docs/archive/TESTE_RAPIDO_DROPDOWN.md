# 🎯 TESTE RÁPIDO - Dropdown Parceiros

## ✅ O QUE FOI CORRIGIDO

**Problema:** Dropdown mostrava "Nenhum parceiro conectado ainda"  
**Causa:** 3 funções JavaScript em falta  
**Solução:** Funções criadas e conectadas ✅

---

## 🧪 COMO TESTAR (5 MINUTOS)

### 1. **Abrir Relatório**
```
1. Abrir: relatorio.html
2. Fazer login com tua conta
3. Abrir Console (F12)
```

### 2. **Verificar Console**
Deves ver:
```
✅ Utilizador autenticado: user@email.com
✅ Carregados 1 parceiros
```

### 3. **Verificar Dropdown**
```
Secção "☁️ Relatório Cloud":
  ├─ Dropdown deve mostrar: "Ana Reis (@anairiscandeiasreis)"
  └─ Se vazio: "Nenhum parceiro conectado ainda"
```

### 4. **Gerar Relatório**
```
1. Escolher parceiro no dropdown
2. Clicar "☁️ Gerar Relatório pela Cloud"
3. Aguardar carregamento
4. Relatório deve aparecer abaixo
5. Scroll automático para resultado
```

---

## ❌ SE NÃO FUNCIONAR

### Erro: "Nenhum parceiro conectado ainda"

**Verificar Firestore:**
```
Firebase Console → Firestore Database → connections

Deve ter documento:
{
  userId: "teu_uid",
  partnerId: "partner_uid",
  partnerName: "Ana Reis",
  partnerUsername: "anairiscandeiasreis"
}
```

**Se não existir:** Adicionar parceiro novamente

---

### Erro: "Ainda não respondeste aos questionários"

**Solução:**
```
1. Ir para: app.html
2. Responder pelo menos 1 pack
3. Guardar respostas
4. Voltar ao relatorio.html
```

---

### Erro: Console mostra erro

**Copiar erro e partilhar:**
```
F12 → Console → Copiar mensagem de erro
```

---

## 📊 ESPERADO vs REAL

| Item | Esperado | Real |
|------|----------|------|
| Console log | ✅ Autenticado + Carregados X parceiros | ? |
| Dropdown | Lista de parceiros | ? |
| Botão Cloud | Gera relatório | ? |
| Scroll | Automático para resultado | ? |

---

## 🚀 SE FUNCIONAR

**Commit Git:**
```powershell
git add relatorio.html CORRECAO_DROPDOWN_PARCEIROS.md TESTE_RAPIDO_DROPDOWN.md
git commit -m "✅ Fix: Dropdown parceiros + Relatório Cloud completo"
git push origin main
```

---

**Status:** ⏳ Aguardando testes  
**Tempo estimado:** 5 minutos

