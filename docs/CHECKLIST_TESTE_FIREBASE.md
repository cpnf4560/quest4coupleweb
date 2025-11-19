# ✅ CHECKLIST DE TESTE - Quest4Couple Firebase

## 📋 PREPARAÇÃO

### Antes de Testar:
- [ ] Firebase projeto criado
- [ ] Configuração colada em `js/firebase-config.js`
- [ ] Authentication ativada (Email + Google)
- [ ] Firestore Database criada
- [ ] Regras de segurança publicadas
- [ ] Aplicação a correr num servidor (Live Server, http-server, etc.)

---

## 🔐 TESTES DE AUTENTICAÇÃO

### Sign Up com Email/Password
- [ ] Abrir `auth.html`
- [ ] Ir para tab "Registar"
- [ ] Preencher nome: "João Teste"
- [ ] Preencher email: "joao.teste@example.com"
- [ ] Preencher password: "teste123"
- [ ] Confirmar password: "teste123"
- [ ] Clicar "Criar Conta"
- [ ] **Resultado esperado:**
  - Loading overlay aparece
  - Conta criada com sucesso
  - Redireciona para `dashboard.html`
  - Console: "✅ User autenticado"

### Validações de Sign Up
- [ ] Password < 6 caracteres → Mostra erro
- [ ] Passwords não coincidem → Mostra erro
- [ ] Email já existe → Mostra erro "Email já em uso"
- [ ] Campos vazios → Mostra erro

### Sign In com Email/Password
- [ ] Logout do dashboard
- [ ] Voltar a `auth.html`
- [ ] Tab "Login"
- [ ] Email: "joao.teste@example.com"
- [ ] Password: "teste123"
- [ ] Clicar "Entrar"
- [ ] **Resultado esperado:**
  - Login bem-sucedido
  - Redireciona para dashboard

### Validações de Login
- [ ] Email errado → Mostra erro
- [ ] Password errada → Mostra erro
- [ ] Campos vazios → Mostra erro

### Sign In com Google
- [ ] Clicar botão "Continuar com Google"
- [ ] Popup abre
- [ ] Selecionar conta Google
- [ ] **Resultado esperado:**
  - Login bem-sucedido
  - Popup fecha
  - Redireciona para dashboard

### Reset Password
- [ ] Tab "Login"
- [ ] Clicar "Esqueci-me da password"
- [ ] Form de reset aparece
- [ ] Email: "joao.teste@example.com"
- [ ] Clicar "Enviar Email de Recuperação"
- [ ] **Resultado esperado:**
  - Mensagem "Email enviado"
  - Verifica inbox do email
  - Email de reset recebido

### Logout
- [ ] No dashboard, clicar "Sair"
- [ ] **Resultado esperado:**
  - Redireciona para `auth.html`
  - Não consegue aceder dashboard diretamente

---

## 📊 TESTES DO DASHBOARD

### Carregar Dashboard
- [ ] Fazer login
- [ ] Dashboard carrega
- [ ] **Verificar:**
  - Nome do user aparece no header
  - Estatísticas iniciais (0/0/0/0)
  - Packs aparecem com cores corretas
  - Cada pack mostra "0 de X respostas"
  - Botão "Começar" em cada pack
  - Empty state em "Conexões"

### Estatísticas
- [ ] Verifica cada card de stat:
  - 📝 Respostas: Mostra número total
  - 🎯 Packs Completos: 0 inicialmente
  - ❤️ Conexões: 0 inicialmente
  - 📊 Relatórios: 0 inicialmente

### Packs
- [ ] **Pack Romântico:**
  - Cor rosa (#ff6b9d)
  - Ícone ❤️
  - Descrição correta
  - Barra de progresso vazia
  - Botão "Começar"

- [ ] **Pack Experiência:**
  - Cor azul (#4ea8de)
  - Ícone 🔥
  - Descrição correta

- [ ] **Pack Pimentinha:**
  - Cor laranja (#ff6b35)
  - Ícone 🌶️
  - Descrição correta

- [ ] **Pack Poliamor:**
  - Cor roxo (#9b59b6)
  - Ícone 💕
  - Descrição correta

- [ ] **Pack Fetiches:**
  - Cor preto (#2d3436)
  - Ícone 🔒
  - Descrição correta

### Hover Effects
- [ ] Hover em stat card → Levanta
- [ ] Hover em pack card → Levanta + shadow
- [ ] Botões mudam de cor no hover

---

## 🔗 TESTES DE CONEXÕES

### Adicionar Parceiro - Fluxo Completo
1. [ ] Clicar "+ Adicionar Parceiro"
2. [ ] Modal abre
3. [ ] Campo de search aparece
4. [ ] **Criar segundo user primeiro:**
   - Abrir janela privada/incognito
   - Ir a `auth.html`
   - Criar conta "Maria Teste" / "maria.teste@example.com"
   - Anota o username gerado (aparece no dashboard)
   - Ex: "maria_teste_abc123"

5. [ ] Voltar à primeira janela
6. [ ] No modal, procurar por: "maria_teste_abc123"
7. [ ] Clicar "Procurar"
8. [ ] **Resultado esperado:**
   - User encontrado aparece
   - Nome "Maria Teste"
   - Username correto
   - Botão "Conectar"

9. [ ] Clicar "Conectar"
10. [ ] **Resultado esperado:**
    - Loading overlay
    - "✅ Conectado com Maria Teste"
    - Modal fecha
    - Parceiro aparece na lista de conexões
    - Stats atualizadas: Conexões = 1

### Validações de Procura
- [ ] Username inexistente → "Utilizador não encontrado"
- [ ] Procurar por si próprio → "Não podes conectar contigo próprio"
- [ ] Conectar duas vezes com o mesmo → "Já estás conectado"

### Lista de Conexões
- [ ] Conexão aparece com:
  - Avatar (iniciais)
  - Nome do parceiro
  - Username
  - Botão "Partilhar"
  - (Sem botão "Ver Relatório" ainda)

---

## 📤 TESTES DE PARTILHA

### Pré-requisito: Responder a um Pack
1. [ ] No dashboard, clicar "Começar" no Pack Romântico
2. [ ] Redireciona para `app.html?pack=romantico`
3. [ ] Responder a pelo menos 5 perguntas
4. [ ] Voltar ao dashboard
5. [ ] **Verificar:**
   - Barra de progresso atualizada
   - "5 de 30 respondidas"
   - Botão mudou para "Continuar"
   - Aparece botão "Ver Respostas"

### Partilhar Pack
1. [ ] Na lista de conexões, clicar "Partilhar" (Maria Teste)
2. [ ] Modal "Partilhar com Maria Teste" abre
3. [ ] **Verificar:**
   - Lista de packs com respostas
   - Pack Romântico aparece com "5 de 30 respondidas"
   - Checkbox ao lado
   - Outros packs não aparecem (sem respostas)

4. [ ] Selecionar checkbox "Romântico"
5. [ ] Clicar "Partilhar Selecionados"
6. [ ] **Resultado esperado:**
   - Loading overlay
   - "✅ Packs partilhados com sucesso"
   - Modal fecha

### Verificar Firestore
- [ ] Firebase Console > Firestore
- [ ] Navegar para `connections/{id}`
- [ ] Verificar campo `sharedPacks`:
  - Array com: ["romantico"]

---

## 🔥 TESTES FIRESTORE

### User Profile
1. [ ] Firebase Console > Firestore > `users/{userId}`
2. [ ] **Verificar campos:**
   - `name`: "João Teste" (string)
   - `username`: "joao_teste_xxxx" (string único)
   - `email`: "joao.teste@example.com" (string)
   - `createdAt`: Timestamp

### User Answers
1. [ ] Navegar para `users/{userId}/answers/all`
2. [ ] **Verificar estrutura:**
   ```
   romantico: {
     q1: {answer: 2, timestamp: ...},
     q2: {answer: 1, timestamp: ...},
     ...
   }
   ```

### Connections
1. [ ] Navegar para `connections/{connectionId}`
2. [ ] **Verificar campos:**
   - `users`: [userId1, userId2] (array)
   - `sharedPacks`: ["romantico"] (array)
   - `report`: null
   - `createdAt`: Timestamp

---

## 🔄 TESTES DE SYNC

### Multi-Device
1. [ ] Login no desktop
2. [ ] Responder a 5 perguntas no Pack Romântico
3. [ ] Abrir `dashboard.html` no telemóvel (mesmo user)
4. [ ] **Verificar:**
   - Pack mostra "5 de 30 respondidas"
   - Barra de progresso igual
   - Stats atualizadas

### Real-Time (Opcional)
- [ ] Duas janelas abertas com mesmo user
- [ ] Responder em uma janela
- [ ] Refresh na outra → Dados atualizados

---

## 🚨 TESTES DE ERROS

### Sem Internet
- [ ] Desligar WiFi
- [ ] Tentar login → Erro apropriado
- [ ] Tentar carregar dashboard → Timeout ou erro

### Firestore Down
- [ ] Firebase Console > Firestore > Regras
- [ ] Mudar para: `allow read, write: if false;`
- [ ] Tentar guardar resposta → "Permission denied"
- [ ] Reverter regras

### Token Expirado
- [ ] Login
- [ ] Esperar 1 hora (token expira)
- [ ] Tentar ação → Auto-refresh ou redirect para login

---

## 📱 TESTES RESPONSIVE

### Mobile (375px)
- [ ] Abrir DevTools > Toggle device toolbar
- [ ] iPhone SE (375x667)
- [ ] **auth.html:**
  - Form ocupa 90% da largura
  - Botões stack verticalmente
  - Tudo legível

- [ ] **dashboard.html:**
  - Header: Logo + nome stack verticalmente
  - Stats: 2 colunas (2x2 grid)
  - Packs: 1 coluna
  - Conexões: Botões stack verticalmente
  - Modals: 95% da largura

### Tablet (768px)
- [ ] iPad (768x1024)
- [ ] Dashboard:
  - Stats: 2 ou 4 colunas
  - Packs: 2 colunas
  - Tudo legível e espaçado

### Desktop (1920px)
- [ ] Monitor grande
- [ ] Dashboard:
  - Max-width: 1200px (centralizado)
  - Stats: 4 colunas
  - Packs: 3-4 por linha
  - Espaçamento generoso

---

## ⚡ TESTES DE PERFORMANCE

### Tempo de Carregamento
- [ ] `auth.html` carrega em < 2s
- [ ] Login completa em < 3s
- [ ] Dashboard carrega em < 2s
- [ ] Packs carregam em < 1s
- [ ] Modal abre instantaneamente

### Console
- [ ] 0 erros no console
- [ ] 0 warnings relevantes
- [ ] Logs informativos aparecem:
  - "🔥 Firebase inicializado"
  - "✅ User autenticado"
  - "✅ Dashboard inicializado"

---

## 🎨 TESTES VISUAIS

### Cores
- [ ] Gradiente roxo/rosa consistente
- [ ] Packs com cores corretas
- [ ] Botões primários: Gradiente
- [ ] Botões secundários: Cinza/Roxo outline
- [ ] Hover effects suaves

### Animações
- [ ] Auth page: Slide up ao carregar
- [ ] Loading overlay: Spinner roda
- [ ] Modais: Slide up ao abrir
- [ ] Cards: Levantam no hover
- [ ] Transições suaves (0.3s)

### Tipografia
- [ ] Títulos grandes: 28-32px
- [ ] Texto normal: 14-16px
- [ ] Tudo legível
- [ ] Hierarquia clara

---

## ✅ RESULTADO FINAL

### Passou em TODOS os testes?
- [ ] **SIM** → 🎉 **APLICAÇÃO PRONTA PARA USO!**
- [ ] **NÃO** → Anota os erros e reporta

### Erros Encontrados:
```
[Anota aqui qualquer erro encontrado]

Exemplo:
- Modal de partilha não fecha ao clicar fora
- Stats não atualizam após conectar
- etc.
```

---

## 📊 MÉTRICAS DE SUCESSO

Aplicação aprovada se:
- ✅ 100% dos testes de autenticação passam
- ✅ Dashboard carrega corretamente
- ✅ Conexões funcionam
- ✅ Partilha funciona
- ✅ Firestore guarda dados
- ✅ 0 erros críticos de console
- ✅ Responsive em todos os breakpoints
- ✅ Performance aceitável (< 3s)

---

**Data do teste:** __________  
**Testado por:** __________  
**Resultado:** [ ] PASS [ ] FAIL  
**Notas adicionais:** ________________________________
