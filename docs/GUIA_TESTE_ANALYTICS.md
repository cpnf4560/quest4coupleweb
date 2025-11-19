# 🚀 Guia Rápido de Teste - Analytics Anónimo

## ⏱️ Teste Rápido (5 minutos)

### Passo 1: Popular Dados (1 min)
1. Abrir `tests/test_analytics.html` no browser
2. Clicar em **"📊 Adicionar 10 Respostas"**
3. Verificar mensagem de sucesso ✅

### Passo 2: Verificar Analytics no Admin (3 min)
1. Clicar em **"🔐 Abrir BackOffice Admin"**
2. Login: `carlos.sousacorreia` / `rzq7xgq8`
3. Ir para **"📊 Analytics Anónimo"** no menu lateral
4. Selecionar um pack (ex: ❤️ Pack Romântico)
5. Verificar tabela com estatísticas

### Passo 3: Exportar CSV (1 min)
1. Clicar em **"📥 Exportar CSV"**
2. Ficheiro baixado automaticamente
3. Abrir em Excel/Google Sheets

---

## 🔍 O Que Verificar

### ✅ Checklist de Validação:

#### No test_analytics.html:
- [ ] Página carrega sem erros
- [ ] Botão "Adicionar 10 Respostas" funciona
- [ ] Mensagem de sucesso aparece
- [ ] "Ver Analytics" mostra dados JSON
- [ ] "Ver Estatísticas" mostra resumo

#### No admin.html:
- [ ] Login funciona com credenciais corretas
- [ ] Dashboard mostra **5 packs** (não 7)
- [ ] Menu "📊 Analytics Anónimo" existe
- [ ] Dropdown de packs funciona
- [ ] Tabela carrega com dados
- [ ] Percentagens calculadas corretamente
- [ ] Botão exportar CSV funciona
- [ ] Ficheiro CSV baixado contém dados corretos

#### Privacidade:
- [ ] Aviso de privacidade visível
- [ ] Nenhum nome de utilizador nas estatísticas
- [ ] Apenas números agregados mostrados
- [ ] Comentários não revelam conteúdo

---

## 🧪 Cenários de Teste

### Cenário 1: Dados Vazios
**Ação:** Acessar analytics sem popular dados  
**Esperado:** Mensagem "Ainda não há respostas anónimas"

### Cenário 2: Popular Poucos Dados
**Ação:** Adicionar 10 respostas  
**Esperado:** Estatísticas aparecem, percentagens fazem sentido

### Cenário 3: Popular Muitos Dados
**Ação:** Adicionar 100 respostas  
**Esperado:** Performance OK, dados agregados corretamente

### Cenário 4: Exportar CSV
**Ação:** Exportar para CSV  
**Esperado:** Ficheiro baixado, formato correto, dados precisos

### Cenário 5: Limpar Dados
**Ação:** Limpar analytics  
**Esperado:** Confirmação, dados removidos, mensagem "sem dados"

---

## 🐛 Problemas Comuns

### "Nenhum dado encontrado"
**Solução:** Popular dados primeiro usando test_analytics.html

### "Credenciais inválidas"
**Solução:** Verificar username e password:
- Username: `carlos.sousacorreia`
- Password: `rzq7xgq8`

### Tabela não carrega
**Solução:** 
1. Verificar console (F12)
2. Verificar localStorage: `localStorage.getItem('q4c_analytics')`
3. Popular dados novamente

### CSV vazio
**Solução:** Selecionar um pack no dropdown primeiro

---

## 📊 Exemplo de Dados Esperados

### No Analytics:
```
Pack Romântico
Total de respostas anónimas: 10

#   Pergunta                          ✅ Sim    ⭐ Talvez    ❌ Não    📝 Com.
1   Massagem sensual com óleos        7 (70%)   2 (20%)    1 (10%)    3
2   Fazer amor com óleos              5 (50%)   3 (30%)    2 (20%)    2
...
```

### No CSV:
```csv
Questão,Pergunta,Total Respostas,Sim,Sim %,Talvez,Talvez %,Não,Não %,Comentários
1,"Massagem sensual com óleos",10,7,70%,2,20%,1,10%,3
2,"Fazer amor com óleos",10,5,50%,3,30%,2,20%,2
```

---

## ⚡ Comandos Rápidos (Console)

### Ver Analytics:
```javascript
console.log(JSON.parse(localStorage.getItem('q4c_analytics')));
```

### Ver Total de Respostas:
```javascript
const analytics = JSON.parse(localStorage.getItem('q4c_analytics'));
Object.keys(analytics).forEach(pack => {
  console.log(`${pack}: ${analytics[pack].totalResponses} respostas`);
});
```

### Limpar Tudo:
```javascript
localStorage.removeItem('q4c_analytics');
console.log('✅ Limpo!');
```

### Popular Manual:
```javascript
const testData = {
  answers: {
    romantico: {
      q1: { answer: 'sim', comment: 'teste' },
      q2: { answer: 'talvez', comment: '' }
    }
  }
};
saveAnonymousAnalytics(testData);
```

---

## 📈 Métricas de Sucesso

### ✅ Teste Passou Se:
1. Dados populam sem erros
2. Admin mostra estatísticas corretas
3. Percentagens somam 100%
4. CSV exporta com formato correto
5. Privacidade mantida (sem identificação)
6. Performance OK (< 2 segundos para carregar)

### ❌ Teste Falhou Se:
1. Erros no console
2. Dados não aparecem no admin
3. Percentagens erradas
4. CSV vazio ou corrompido
5. Nomes de utilizadores aparecem
6. Performance lenta (> 5 segundos)

---

## 🔄 Reset Completo

Se precisar começar do zero:

1. Abrir `test_analytics.html`
2. Clicar **"⚠️ Limpar TUDO"**
3. Confirmar ação
4. Recarregar páginas

---

## 📞 Suporte

### Logs Úteis:
```javascript
// Ver se analytics existe
console.log('Analytics:', localStorage.getItem('q4c_analytics'));

// Ver tamanho
console.log('Tamanho:', localStorage.getItem('q4c_analytics')?.length, 'chars');

// Ver utilizadores (para debug)
console.log('Users:', localStorage.getItem('q4c_users'));
```

### Verificar Integridade:
```javascript
try {
  const analytics = JSON.parse(localStorage.getItem('q4c_analytics') || '{}');
  console.log('✅ Analytics válidos');
  console.log('Packs:', Object.keys(analytics));
} catch (e) {
  console.error('❌ Analytics corrompidos:', e);
}
```

---

## ✅ Conclusão

Se todos os passos funcionarem:
- ✅ Sistema de analytics anónimo está funcional
- ✅ Privacidade garantida
- ✅ Admin pode ver estatísticas
- ✅ Exportação funciona

**Status:** 🟢 Sistema Operacional

---

**Criado:** 19 de novembro de 2025  
**Versão:** Quest4Couple v2.0 Free  
**Tempo estimado:** 5-10 minutos
