# ✅ Checklist de Testes - Quest4Couple v2

**Data:** 27 de Novembro de 2025  
**Versão:** v2.0 - Correções Completas

---

## 📋 TESTE 1: Sistema de Relatórios

### Pré-requisitos:
- [ ] Ter 2 ficheiros `.q4c` de teste (ou gerar com `gerar_ficheiro_teste.html`)

### Passos:
1. [ ] Abrir `gerar_ficheiro_teste.html`
2. [ ] Clicar em "Gerar Ficheiro Pessoa 1"
3. [ ] Salvar como `teste1.q4c`
4. [ ] Clicar em "Gerar Ficheiro Pessoa 2"
5. [ ] Salvar como `teste2.q4c`
6. [ ] Abrir `relatorio.html`
7. [ ] Fazer upload de `teste1.q4c` no primeiro campo
8. [ ] Fazer upload de `teste2.q4c` no segundo campo
9. [ ] Clicar em "🚀 Gerar Relatório"

### Validações:
- [ ] ✅ Relatório é gerado sem erros
- [ ] ✅ Compatibilidade está entre 40-60%
- [ ] ✅ Aparecem "Super Matches" (⭐)
- [ ] ✅ Aparecem "Matches" (💚)
- [ ] ✅ Aparecem "Mismatches" (😐)
- [ ] ✅ Total de questões = 300
- [ ] ✅ Questões estão organizadas por pack
- [ ] ✅ Respostas aparecem corretamente

### Valores Esperados:
```
📊 Estatísticas Esperadas:
├─ Compatibilidade: ~45-55%
├─ Super Matches: ~30-50
├─ Matches: ~80-120
├─ Mismatches: ~100-150
└─ Total Questões: 300
```

**Status:** [ ] PASSOU | [ ] FALHOU

---

## 🔄 TESTE 2: Invert Matches

### Pré-requisitos:
- [ ] Ter relatório gerado (do Teste 1)

### Passos:
1. [ ] No relatório, rolar até encontrar perguntas do **Pack Poliamor** ou **Fetiches**
2. [ ] Procurar por questões que tenham a palavra "dar" ou "receber"

### Validações:
- [ ] ✅ Banner "🔄 MATCHING INVERTIDO" aparece
- [ ] ✅ Labels especiais são mostrados:
  - [ ] "✋ DAR" para o primeiro utilizador
  - [ ] "👐 RECEBER" para o segundo utilizador
- [ ] ✅ Descrição da dinâmica invertida aparece
- [ ] ✅ Background especial (gradiente roxo/azul)

### Exemplo de Questão Invert:
```
Pack Poliamor - "Gostas de dar ordens?"
├─ 🔄 MATCHING INVERTIDO
├─ ✋ DAR: "yup" (Pessoa 1)
├─ 👐 RECEBER: "yup" (Pessoa 2)
└─ Descrição: "Quando uma pessoa gosta de DAR e a outra de RECEBER..."
```

### Console Logs Esperados:
```javascript
📦 A carregar configuração de Invert Matching...
✅ Configuração carregada: OK
🔄 Invert Match encontrado: poliamor / Gostas de dar ordens?
```

**Status:** [ ] PASSOU | [ ] FALHOU

---

## 📋 TESTE 3: Admin Dashboard - Log de Atividade

### Pré-requisitos:
- [ ] Acesso admin (email/password)
- [ ] Dados de teste no Firebase

### Passos:
1. [ ] Abrir `pages/admin.html`
2. [ ] Fazer login com credenciais de admin
3. [ ] Clicar no separador "📋 Log de Atividade"
4. [ ] Aguardar carregamento

### Validações:
- [ ] ✅ Log carrega sem erros
- [ ] ✅ Aparecem atividades de **4 tipos**:
  - [ ] 📝 Registos (`"Novo registo: [nome]"`)
  - [ ] 🔐 Logins (`"Login: [nome]"`)
  - [ ] ✅ Respostas (`"Respondeu a X perguntas do pack [pack]"`)
  - [ ] 📊 Relatórios (`"Gerou relatório com [parceiro]"`)
  - [ ] 🤝 Conexões (`"Conectou-se com [parceiro]"`)
- [ ] ✅ Atividades estão ordenadas por data (mais recente primeiro)
- [ ] ✅ Máximo de 100 atividades mostradas

### Console Logs Esperados:
```javascript
📋 Carregando log de atividade...
✅ Log carregado: X atividades
```

**Status:** [ ] PASSOU | [ ] FALHOU

---

## 📊 TESTE 4: Admin Dashboard - Análise de Questões

### Pré-requisitos:
- [ ] Acesso admin (email/password)
- [ ] Respostas de utilizadores no Firebase

### Passos:
1. [ ] No admin dashboard
2. [ ] Clicar no separador "📊 Análise de Questões"
3. [ ] Aguardar carregamento

### Validações:
- [ ] ✅ Lista de questões carrega
- [ ] ✅ Cada questão mostra:
  - [ ] Número da questão (#1, #2, etc.)
  - [ ] Nome do pack
  - [ ] Texto da questão
  - [ ] Total de respostas
  - [ ] **Distribuição Geral:**
    - [ ] 😍 Por favor! (% e número)
    - [ ] 👍 Yup (% e número)
    - [ ] 🤷 Talvez (% e número)
    - [ ] 😑 Meh... (% e número)
  - [ ] **Por Género:**
    - [ ] 👨 Homens (% e total)
    - [ ] 👩 Mulheres (% e total)
  - [ ] **Por Faixa Etária:**
    - [ ] 18-25
    - [ ] 26-35
    - [ ] 36-45
    - [ ] 46-55
    - [ ] 56+
  - [ ] Botão "📊 Exportar Dados"
- [ ] ✅ Badge "🔄 INVERT" para questões com matching invertido

### Console Logs Esperados:
```javascript
📊 Buscando analytics de questões... Todos os packs
📝 Documentos de respostas encontrados: X
📊 Questões agregadas: Y
✅ Analytics carregados: Z questões
```

### Teste de Exportação CSV:
1. [ ] Clicar em "📊 Exportar Dados" numa questão
2. [ ] Verificar se ficheiro CSV é descarregado
3. [ ] Abrir CSV e validar:
   - [ ] Header correto (Métrica, Valor)
   - [ ] Dados da questão (texto, pack, total)
   - [ ] Distribuição de respostas (Por favor!, Yup, Talvez, Meh)
   - [ ] Percentagens corretas

**Status:** [ ] PASSOU | [ ] FALHOU

---

## 🧪 TESTE 5: Valores Consistentes

### Validação de Valores em Todos os Componentes:

#### 1. Gerador de Ficheiros (`gerar_ficheiro_teste.html`):
```javascript
✅ getRandomAnswer() retorna: 'yup', 'meh', 'talvez', 'porfavor'
✅ Comentários usam chaves: 'yup', 'meh', 'talvez', 'porfavor'
```

#### 2. Validador de Relatórios (`js/comparison.js`):
```javascript
✅ Espera valores: 'yup', 'meh', 'talvez', 'porfavor'
✅ Matches são detectados corretamente
```

#### 3. Analytics (`js/admin-analytics.js`):
```javascript
✅ Agrega por: 'yup', 'meh', 'talvez', 'porfavor'
✅ Renderiza com: pctYup, pctMeh, pctTalvez, pctPorfavor
✅ Exporta com: 'yup', 'meh', 'talvez', 'porfavor'
```

### Checklist de Valores:
- [ ] ❌ Nenhuma referência a `'Yup'` (maiúscula)
- [ ] ❌ Nenhuma referência a `'Meh...'` (com pontos)
- [ ] ❌ Nenhuma referência a `'Por favor!'` (maiúscula)
- [ ] ❌ Nenhuma referência a `'OK'`
- [ ] ❌ Nenhuma referência a `'Não'`
- [ ] ✅ Todas as referências são minúsculas
- [ ] ✅ Todos os componentes usam os mesmos valores

**Status:** [ ] PASSOU | [ ] FALHOU

---

## 🔍 TESTE 6: Logs de Debug

### Console Logs Esperados:

#### Relatório (relatorio.html):
```javascript
📦 A carregar configuração de Invert Matching...
✅ Configuração carregada: OK
🔍 Verificando invert matching para: [packId] / [questionText]
🔄 Invert Match encontrado: [packId] / [questionText]
```

#### Admin - Log de Atividade (pages/admin.html):
```javascript
📋 Carregando log de atividade...
✅ Log carregado: X atividades
```

#### Admin - Analytics (js/admin-analytics.js):
```javascript
📊 Buscando analytics de questões... Pack: [packId]
📝 Documentos de respostas encontrados: X
📊 Questões agregadas: Y
✅ Analytics carregados: Z questões
```

### Validações:
- [ ] ✅ Nenhum erro no console
- [ ] ✅ Nenhum warning (exceto deprecation notices do Firebase)
- [ ] ✅ Logs de debug aparecem corretamente
- [ ] ✅ Nenhuma mensagem de "undefined" ou "null"

**Status:** [ ] PASSOU | [ ] FALHOU

---

## 📈 TESTE 7: Performance

### Métricas Esperadas:

#### Geração de Relatório:
- [ ] Tempo < 2 segundos para 300 questões
- [ ] Sem travamentos no browser
- [ ] Scroll suave

#### Admin Dashboard - Log:
- [ ] Carregamento < 3 segundos para 100 atividades
- [ ] Renderização sem lag

#### Admin Dashboard - Analytics:
- [ ] Carregamento < 5 segundos para todas as questões
- [ ] Renderização progressiva (se muitas questões)

**Status:** [ ] PASSOU | [ ] FALHOU

---

## 🎯 TESTE 8: Compatibilidade

### Browsers:
- [ ] Chrome/Edge (últimas 2 versões)
- [ ] Firefox (últimas 2 versões)
- [ ] Safari (última versão)

### Dispositivos:
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

### Validações:
- [ ] ✅ Layout responsivo
- [ ] ✅ Botões clicáveis
- [ ] ✅ Texto legível
- [ ] ✅ Scroll funciona

**Status:** [ ] PASSOU | [ ] FALHOU

---

## ✅ RESUMO FINAL

### Testes Obrigatórios:
| Teste | Status | Notas |
|-------|--------|-------|
| 1. Sistema de Relatórios | [ ] | |
| 2. Invert Matches | [ ] | |
| 3. Log de Atividade | [ ] | |
| 4. Análise de Questões | [ ] | |
| 5. Valores Consistentes | [ ] | |
| 6. Logs de Debug | [ ] | |
| 7. Performance | [ ] | |
| 8. Compatibilidade | [ ] | |

### Critérios de Aceitação:
- [ ] Todos os 8 testes passaram
- [ ] Nenhum erro crítico no console
- [ ] Performance aceitável
- [ ] Funciona em todos os browsers testados

---

## 🐛 Relatório de Bugs (se houver)

### Bug #1:
- **Descrição:**
- **Passos para Reproduzir:**
- **Comportamento Esperado:**
- **Comportamento Atual:**
- **Severidade:** [ ] Crítico | [ ] Alto | [ ] Médio | [ ] Baixo

---

## 📝 Notas Adicionais

- Data do Teste:
- Testador:
- Ambiente:
- Versão do Browser:

---

**🎉 Checklist criado em: 27 de Novembro de 2025**  
**Projeto:** Quest4Couple v2 Free

