# 🌍 Implementação de País e Cidade + Credenciais Admin - 19/11/2025

## 📋 RESUMO DAS ALTERAÇÕES

### 1. ✅ CREDENCIAIS ADMIN ATUALIZADAS

**Arquivo:** `auth.js` (já estava correto)
- **Username:** `carlos`
- **Password:** `rzq7xgq8`
- **Hash SHA-256:** `4effc02996e897cf24f0869b35d39ccff710cd90fcc9c0820ec52803b07aa382`

**Arquivo:** `pages/admin.html`
- Placeholder atualizado para `carlos`

---

### 2. ✅ DADOS DEMOGRÁFICOS OBRIGATÓRIOS NO REGISTO

**Arquivo:** `auth.html`

#### Formulário de Registo por Email:
```html
<div class="form-group">
  <label for="signupGender">Sexo *</label>
  <select id="signupGender" required>
    <option value="">Selecione o sexo</option>
    <option value="M">Masculino</option>
    <option value="F">Feminino</option>
    <option value="outro">Outro</option>
  </select>
</div>

<div class="form-group">
  <label for="signupAgeRange">Faixa Etária *</label>
  <select id="signupAgeRange" required>
    <option value="">Selecione a faixa etária</option>
    <option value="18-23">18-23 anos</option>
    <option value="24-29">24-29 anos</option>
    <option value="30-35">30-35 anos</option>
    <option value="36-40">36-40 anos</option>
    <option value="41-49">41-49 anos</option>
    <option value="50+">+50 anos</option>
  </select>
</div>

<div class="form-group">
  <label for="signupCountry">País *</label>
  <select id="signupCountry" required>
    <option value="">Selecione o país</option>
  </select>
</div>

<div class="form-group">
  <label for="signupCity">Cidade *</label>
  <input type="text" id="signupCity" list="citySuggestions" required 
         placeholder="Escolha ou escreva a cidade" autocomplete="off">
  <datalist id="citySuggestions"></datalist>
  <small>Escreva para pesquisar cidades</small>
</div>
```

#### Modal para Registo Google/Reddit:
```html
<div class="modal-overlay hidden" id="locationModal">
  <div class="modal-box">
    <h2>📍 Complete o teu Perfil</h2>
    <p>Para melhorar a tua experiência, precisamos de alguns dados:</p>
    
    <form id="locationForm">
      <div class="form-group">
        <label for="modalCountry">País *</label>
        <select id="modalCountry" required>
          <option value="">Selecione o país</option>
        </select>
      </div>

      <div class="form-group">
        <label for="modalCity">Cidade *</label>
        <input type="text" id="modalCity" list="modalCitySuggestions" required>
        <datalist id="modalCitySuggestions"></datalist>
      </div>

      <button type="submit" class="btn-primary">Continuar</button>
    </form>
  </div>
</div>
```

---

### 3. ✅ INTEGRAÇÃO GEONAMES API

**Arquivo:** `js/geonames.js` (já existia)

#### Funcionalidades:
- ✅ **23 países lusófonos** + principais países europeus e americanos
- ✅ **Busca inteligente de cidades** via API GeoNames
- ✅ **Debounce de 300ms** para não sobrecarregar a API
- ✅ **Fallback** com cidades principais se API falhar
- ✅ **Autocomplete** com datalist HTML5

#### Username GeoNames:
```javascript
const GEONAMES_USERNAME = 'quest4couple';
```
⚠️ **Nota:** Precisas registar uma conta gratuita em http://www.geonames.org/login

#### Países Incluídos:
- 🇵🇹 Portugal, 🇧🇷 Brasil, 🇦🇴 Angola, 🇲🇿 Moçambique
- 🇨🇻 Cabo Verde, 🇬🇼 Guiné-Bissau, 🇸🇹 São Tomé e Príncipe
- 🇹🇱 Timor-Leste, 🇬🇶 Guiné Equatorial, 🇲🇴 Macau
- 🇪🇸 Espanha, 🇫🇷 França, 🇮🇹 Itália, 🇬🇧 Reino Unido
- 🇩🇪 Alemanha, 🇺🇸 Estados Unidos, 🇨🇦 Canadá
- E mais 30+ países

---

### 4. ✅ ADMIN DASHBOARD - MOSTRAR PAÍS E CIDADE

**Arquivo:** `pages/admin.html`

#### Tabela de Utilizadores (HTML):
```html
<thead>
  <tr>
    <th>Nome</th>
    <th>Email</th>
    <th>País</th>       <!-- ✅ NOVO -->
    <th>Cidade</th>     <!-- ✅ NOVO -->
    <th>Relatórios</th>
    <th>Registo</th>
    <th>Status</th>
    <th>Ações</th>
  </tr>
</thead>
```

#### Função `loadUsers()` - Buscar do Firestore:
```javascript
tbody.innerHTML = users.map(user => {
  const createdAt = user.createdAt ? 
    (user.createdAt.toDate ? user.createdAt.toDate() : new Date(user.createdAt)) : null;
  
  // ✅ NOVO: Buscar nome do país
  const countryName = user.countryName || user.country || 'N/A';
  const cityName = user.city || 'N/A';
  
  return `
    <tr>
      <td>${user.displayName || user.name || 'N/A'}</td>
      <td>${user.email}</td>
      <td>${countryName}</td>     <!-- ✅ PAÍS -->
      <td>${cityName}</td>        <!-- ✅ CIDADE -->
      <td>${user.reports ? user.reports.length : 0}</td>
      <td>${createdAt ? createdAt.toLocaleDateString('pt-PT') : 'N/A'}</td>
      <td><span class="badge badge-success">Ativo</span></td>
      <td>
        <button class="btn-action btn-view" onclick="viewUser('${user.email}')">Ver</button>
      </td>
    </tr>
  `;
}).join('');
```

#### Função `filterUsers()` - Pesquisa:
```javascript
tbody.innerHTML = filtered.map(user => {
  const countryName = user.countryName || user.country || 'N/A';
  const cityName = user.city || 'N/A';
  
  return `
    <tr>
      <td>${user.displayName || user.name || 'N/A'}</td>
      <td>${user.email}</td>
      <td>${countryName}</td>     <!-- ✅ PAÍS -->
      <td>${cityName}</td>        <!-- ✅ CIDADE -->
      <!-- ... -->
    </tr>
  `;
}).join('');
```

#### Função `viewUser()` - Detalhes:
```javascript
alert(`Detalhes do Utilizador:\n\n` +
      `Nome: ${userData.displayName || userData.name || 'N/A'}\n` +
      `Email: ${userData.email}\n` +
      `País: ${userData.countryName || userData.country || 'N/A'}\n`  + // ✅ NOVO
      `Cidade: ${userData.city || 'N/A'}\n` +                          // ✅ NOVO
      `Método: ${userData.authProvider || 'Email'}\n` +
      `Relatórios: ${userData.reports ? userData.reports.length : 0}\n` +
      `Registo: ${createdAt ? createdAt.toLocaleString('pt-PT') : 'N/A'}\n` +
      `Último login: ${lastLogin ? lastLogin.toLocaleString('pt-PT') : 'N/A'}`);
```

#### Fallback para localStorage:
```javascript
// ✅ Atualizado colspan de 6 para 8 (adicionadas 2 colunas)
if (users.length === 0) {
  tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: #6c757d;">Sem utilizadores registados</td></tr>';
}

// ✅ Adicionadas colunas de país e cidade
tbody.innerHTML = users.map(user => `
  <tr>
    <td>${user.name || 'N/A'}</td>
    <td>${user.email}</td>
    <td>${user.countryName || user.country || 'N/A'}</td>  <!-- ✅ PAÍS -->
    <td>${user.city || 'N/A'}</td>                         <!-- ✅ CIDADE -->
    <!-- ... -->
  </tr>
`).join('');
```

---

## 🔄 FLUXO DE REGISTO

### Registo por Email/Password:
1. ✅ Utilizador preenche nome, email, password
2. ✅ **Seleciona país** (obrigatório)
3. ✅ **Escreve cidade** com autocomplete GeoNames (obrigatório)
4. ✅ Aceita termos
5. ✅ Cria conta → dados salvos no Firestore

### Registo por Google/Reddit:
1. ✅ Utilizador clica em "Continuar com Google"
2. ✅ Autentica com Google
3. ✅ **Modal aparece** pedindo país e cidade
4. ✅ Utilizador seleciona país
5. ✅ Utilizador escreve cidade com autocomplete
6. ✅ Clica "Continuar"
7. ✅ Dados atualizados no Firestore → redireciona para dashboard

---

## 📊 ESTRUTURA DE DADOS FIRESTORE

```javascript
{
  uid: "abc123...",
  email: "user@example.com",
  displayName: "Nome Utilizador",     // Google Auth
  name: "Nome Utilizador",            // Email Auth
  authProvider: "google.com",         // ou "password"
  
  // ✅ NOVOS CAMPOS
  country: "PT",                      // Código ISO do país
  countryName: "Portugal",            // Nome do país
  city: "Lisboa",                     // Nome da cidade
  
  isAdmin: false,
  createdAt: Timestamp,
  lastLoginAt: Timestamp,
  reports: [...]
}
```

---

## 🎨 ESTILOS CSS

**Arquivo:** `css/auth.css`
- ✅ `.modal-overlay` - já existe (linha 425)
- ✅ `.modal-box` - já existe
- ✅ Animações e responsividade

---

## 📝 SCRIPTS CARREGADOS

**Ordem no `auth.html`:**
```html
<!-- Firebase SDKs -->
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>

<!-- App Scripts -->
<script src="js/firebase-config.js"></script>
<script src="js/geonames.js"></script>         <!-- ✅ GeoNames -->
<script src="js/auth.js"></script>
<script src="js/auth-ui.js"></script>
```

---

## ⚠️ PENDENTE (NÃO FAZER AGORA - AGUARDAR COMMIT)

1. **Registar conta GeoNames:**
   - Ir para http://www.geonames.org/login
   - Criar conta gratuita
   - Ativar "Free Web Services"
   - Atualizar `GEONAMES_USERNAME` em `geonames.js`

2. **Testar após deploy:**
   - Registo por email com país/cidade
   - Registo por Google → modal aparece
   - Admin mostra país/cidade corretamente
   - Autocomplete de cidades funciona

---

## ✅ ARQUIVOS MODIFICADOS

1. ✅ **`pages/admin.html`**
   - Placeholder: "carlos"
   - Tabela: colunas País e Cidade
   - `loadUsers()`: mostrar país/cidade
   - `filterUsers()`: mostrar país/cidade
   - `viewUser()`: mostrar país/cidade
   - Fallback localStorage: colspan 8, colunas país/cidade

2. ✅ **`auth.html`** (já estava pronto)
   - Campos país/cidade no registo
   - Modal de localização para Google/Reddit

3. ✅ **`js/geonames.js`** (já existia)
   - Integração GeoNames API
   - 50+ países carregados
   - Autocomplete de cidades

4. ✅ **`auth.js`** (já estava correto)
   - Credenciais: carlos/rzq7xgq8

---

## 🚀 PRÓXIMO PASSO

**COMMIT E PUSH!**
```bash
git add pages/admin.html
git commit -m "Feature: Tornar país e cidade obrigatórios + mostrar no admin"
git push
```

---

**Status:** ✅ Implementação completa | ⏳ Aguardando commit único
