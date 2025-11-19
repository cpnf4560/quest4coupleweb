# 🚀 COMEÇAR AGORA - Analytics Anónimo

## ⚡ Setup Ultra-Rápido (2 minutos)

### 1. Testar o Sistema 🧪
```
1. Abrir: tests/test_analytics.html
2. Clicar: "Adicionar 10 Respostas"
3. Clicar: "Abrir BackOffice Admin"
```

### 2. Fazer Login 🔐
```
Username: carlos.sousacorreia
Password: rzq7xgq8
```

### 3. Ver Analytics 📊
```
Menu Lateral → "📊 Analytics Anónimo"
Dropdown → Selecionar pack
Pronto! ✅
```

---

## 💡 Usar no Dia-a-Dia

### Para Utilizadores:
1. Responder questionários normalmente em `app.html`
2. Clicar **"Guardar"** quando terminar
3. ✅ Analytics salvos automaticamente (anónimo!)

### Para Admin:
1. Aceder `pages/admin.html`
2. Login com credenciais
3. Ir para "Analytics Anónimo"
4. Selecionar pack desejado
5. Ver estatísticas
6. Exportar CSV se necessário

---

## 📋 Atalhos Úteis

### Acesso Direto:
- **Admin:** `http://localhost:8080/pages/admin.html`
- **Teste:** `http://localhost:8080/tests/test_analytics.html`
- **App:** `http://localhost:8080/app.html`

### Console Rápido (F12):
```javascript
// Ver analytics
JSON.parse(localStorage.getItem('q4c_analytics'))

// Limpar
localStorage.removeItem('q4c_analytics')
```

---

## ❓ FAQ Rápido

**P: Onde ficam salvos os dados?**  
R: localStorage do browser (local, não vai para servidor)

**P: Os dados são anónimos mesmo?**  
R: Sim! Apenas contadores agregados, sem identificação

**P: Posso exportar os dados?**  
R: Sim! Botão "Exportar CSV" no admin

**P: Como limpar dados de teste?**  
R: test_analytics.html → "Limpar Analytics"

**P: Funciona em produção?**  
R: Sim! Pronto para usar

---

## ✅ Tudo Pronto!

**Sistema operacional e documentado.**

📚 **Docs completas em:** `docs/SISTEMA_ANALYTICS_ANONIMO.md`

---

**Quest4Couple v2.0 Free** - Ready to use! 🚀
