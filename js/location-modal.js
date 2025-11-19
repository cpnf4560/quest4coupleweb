/**
 * Quest4Couple - Location Modal
 * Modal para pedir país e cidade após registo
 */

// GeoNames username (criar conta gratuita em https://www.geonames.org/export/web-services.html)
const GEONAMES_USERNAME = 'quest4couple'; // Substituir pelo username real

/**
 * Mostrar modal de localização
 */
function showLocationModal() {
  const modalHTML = `
    <div id="locationModal" style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    ">
      <div style="
        background: white;
        border-radius: 20px;
        padding: 40px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      ">
        <h2 style="color: #667eea; margin-bottom: 10px; text-align: center;">
          📍 Bem-vindo ao Quest4Couple!
        </h2>
        <p style="color: #6c757d; text-align: center; margin-bottom: 30px;">
          Para completar o seu registo, precisamos de algumas informações:
        </p>
        
        <form id="locationForm">
          <div style="margin-bottom: 20px;">
            <label style="display: block; color: #495057; font-weight: 500; margin-bottom: 8px;">
              🌍 País *
            </label>
            <select id="countrySelect" required style="
              width: 100%;
              padding: 12px 15px;
              border: 1px solid #dee2e6;
              border-radius: 8px;
              font-size: 1em;
            ">
              <option value="">Selecione o país...</option>
            </select>
          </div>
          
          <div style="margin-bottom: 20px;">
            <label style="display: block; color: #495057; font-weight: 500; margin-bottom: 8px;">
              🏙️ Cidade *
            </label>
            <input type="text" id="cityInput" list="citySuggestions" required placeholder="Digite sua cidade..." style="
              width: 100%;
              padding: 12px 15px;
              border: 1px solid #dee2e6;
              border-radius: 8px;
              font-size: 1em;
            ">
            <datalist id="citySuggestions"></datalist>
            <small style="color: #6c757d; font-size: 0.85em;">
              💡 Comece a digitar para ver sugestões
            </small>
          </div>
          
          <button type="submit" style="
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1.1em;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
          ">
            ✅ Completar Registo
          </button>
        </form>
        
        <p style="color: #6c757d; font-size: 0.85em; text-align: center; margin-top: 15px;">
          * Campos obrigatórios
        </p>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Carregar países
  loadCountries();
  
  // Event listeners
  document.getElementById('countrySelect').addEventListener('change', onCountryChange);
  document.getElementById('cityInput').addEventListener('input', onCityInput);
  document.getElementById('locationForm').addEventListener('submit', onLocationSubmit);
}

/**
 * Carregar lista de países
 */
async function loadCountries() {
  try {
    // Lista de países em português
    const countries = [
      { code: 'PT', name: 'Portugal' },
      { code: 'BR', name: 'Brasil' },
      { code: 'AO', name: 'Angola' },
      { code: 'MZ', name: 'Moçambique' },
      { code: 'CV', name: 'Cabo Verde' },
      { code: 'GW', name: 'Guiné-Bissau' },
      { code: 'ST', name: 'São Tomé e Príncipe' },
      { code: 'TL', name: 'Timor-Leste' },
      { code: 'MO', name: 'Macau' },
      { code: 'ES', name: 'Espanha' },
      { code: 'FR', name: 'França' },
      { code: 'GB', name: 'Reino Unido' },
      { code: 'DE', name: 'Alemanha' },
      { code: 'IT', name: 'Itália' },
      { code: 'NL', name: 'Países Baixos' },
      { code: 'BE', name: 'Bélgica' },
      { code: 'CH', name: 'Suíça' },
      { code: 'LU', name: 'Luxemburgo' },
      { code: 'US', name: 'Estados Unidos' },
      { code: 'CA', name: 'Canadá' },
      // Adicionar mais países conforme necessário
    ];
    
    // Ordenar alfabeticamente
    countries.sort((a, b) => a.name.localeCompare(b.name));
    
    const select = document.getElementById('countrySelect');
    countries.forEach(country => {
      const option = document.createElement('option');
      option.value = country.code;
      option.textContent = country.name;
      select.appendChild(option);
    });
    
  } catch (error) {
    console.error('❌ Erro ao carregar países:', error);
  }
}

/**
 * Quando país é selecionado
 */
function onCountryChange(event) {
  const countryCode = event.target.value;
  document.getElementById('cityInput').disabled = !countryCode;
  
  if (countryCode) {
    document.getElementById('cityInput').focus();
  }
}

/**
 * Quando utilizador digita na cidade
 */
let cityTimeout;
async function onCityInput(event) {
  const query = event.target.value;
  const countryCode = document.getElementById('countrySelect').value;
  
  if (!countryCode || query.length < 2) {
    return;
  }
  
  // Debounce
  clearTimeout(cityTimeout);
  cityTimeout = setTimeout(async () => {
    await searchCities(query, countryCode);
  }, 300);
}

/**
 * Pesquisar cidades no GeoNames
 */
async function searchCities(query, countryCode) {
  try {
    const url = `http://api.geonames.org/searchJSON?name_startsWith=${encodeURIComponent(query)}&country=${countryCode}&maxRows=10&username=${GEONAMES_USERNAME}&featureClass=P&orderby=population`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.geonames && data.geonames.length > 0) {
      const datalist = document.getElementById('citySuggestions');
      datalist.innerHTML = '';
      
      data.geonames.forEach(city => {
        const option = document.createElement('option');
        option.value = city.name;
        datalist.appendChild(option);
      });
    }
  } catch (error) {
    console.error('❌ Erro ao buscar cidades:', error);
    // Continuar sem autocomplete
  }
}

/**
 * Quando formulário é submetido
 */
async function onLocationSubmit(event) {
  event.preventDefault();
  
  const countryCode = document.getElementById('countrySelect').value;
  const countryName = document.getElementById('countrySelect').selectedOptions[0].text;
  const city = document.getElementById('cityInput').value.trim();
  
  if (!countryCode || !city) {
    alert('⚠️ Por favor, preencha todos os campos obrigatórios');
    return;
  }
  
  try {
    // Obter utilizador atual
    const user = firebase.auth().currentUser;
    
    if (!user) {
      throw new Error('Utilizador não autenticado');
    }
    
    // Atualizar Firestore
    await db.collection('users').doc(user.uid).update({
      country: countryName,
      countryCode: countryCode,
      city: city,
      locationUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    console.log('✅ Localização atualizada:', countryName, city);
    
    // Fechar modal
    document.getElementById('locationModal').remove();
    
    // Redirecionar para dashboard
    window.location.href = 'dashboard.html';
    
  } catch (error) {
    console.error('❌ Erro ao salvar localização:', error);
    alert('❌ Erro ao salvar localização. Por favor, tente novamente.');
  }
}

/**
 * Verificar se utilizador precisa preencher localização
 */
async function checkLocationRequired() {
  try {
    const user = firebase.auth().currentUser;
    
    if (!user) {
      return false;
    }
    
    // Buscar dados do utilizador
    const userDoc = await db.collection('users').doc(user.uid).get();
    const userData = userDoc.data();
    
    // Se não tiver país ou cidade, mostrar modal
    if (!userData.country || !userData.city) {
      console.log('⚠️ Localização não preenchida, mostrando modal...');
      showLocationModal();
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ Erro ao verificar localização:', error);
    return false;
  }
}
