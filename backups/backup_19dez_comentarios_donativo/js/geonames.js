/**
 * Quest4Couple - GeoNames Integration
 * Sistema de seleção de País e Cidade com API GeoNames
 */

// GeoNames API Configuration
const GEONAMES_USERNAME = 'quest4couple'; // Você precisa registar em http://www.geonames.org/login

// Lista de países principais (top countries)
const COUNTRIES = [
  { code: 'PT', name: 'Portugal', geonameId: 2264397 },
  { code: 'BR', name: 'Brasil', geonameId: 3469034 },
  { code: 'ES', name: 'Espanha', geonameId: 2510769 },
  { code: 'FR', name: 'França', geonameId: 3017382 },
  { code: 'IT', name: 'Itália', geonameId: 3175395 },
  { code: 'GB', name: 'Reino Unido', geonameId: 2635167 },
  { code: 'DE', name: 'Alemanha', geonameId: 2921044 },
  { code: 'US', name: 'Estados Unidos', geonameId: 6252001 },
  { code: 'CA', name: 'Canadá', geonameId: 6251999 },
  { code: 'MX', name: 'México', geonameId: 3996063 },
  { code: 'AR', name: 'Argentina', geonameId: 3865483 },
  { code: 'CL', name: 'Chile', geonameId: 3895114 },
  { code: 'CO', name: 'Colômbia', geonameId: 3686110 },
  { code: 'PE', name: 'Peru', geonameId: 3932488 },
  { code: 'VE', name: 'Venezuela', geonameId: 3625428 },
  { code: 'UY', name: 'Uruguai', geonameId: 3439705 },
  { code: 'PY', name: 'Paraguai', geonameId: 3437598 },
  { code: 'BO', name: 'Bolívia', geonameId: 3923057 },
  { code: 'EC', name: 'Equador', geonameId: 3658394 },
  { code: 'CR', name: 'Costa Rica', geonameId: 3624060 },
  { code: 'PA', name: 'Panamá', geonameId: 3703430 },
  { code: 'CU', name: 'Cuba', geonameId: 3562981 },
  { code: 'DO', name: 'República Dominicana', geonameId: 3508796 },
  { code: 'GT', name: 'Guatemala', geonameId: 3595528 },
  { code: 'HN', name: 'Honduras', geonameId: 3608932 },
  { code: 'NI', name: 'Nicarágua', geonameId: 3617476 },
  { code: 'SV', name: 'El Salvador', geonameId: 3585968 },
  { code: 'AO', name: 'Angola', geonameId: 3351879 },
  { code: 'MZ', name: 'Moçambique', geonameId: 1036973 },
  { code: 'CV', name: 'Cabo Verde', geonameId: 3374766 },
  { code: 'GW', name: 'Guiné-Bissau', geonameId: 2372248 },
  { code: 'ST', name: 'São Tomé e Príncipe', geonameId: 2410758 },
  { code: 'TL', name: 'Timor-Leste', geonameId: 1966436 },
  { code: 'GQ', name: 'Guiné Equatorial', geonameId: 2309096 },
  { code: 'MO', name: 'Macau', geonameId: 1821275 },
  { code: 'NL', name: 'Holanda', geonameId: 2750405 },
  { code: 'BE', name: 'Bélgica', geonameId: 2802361 },
  { code: 'CH', name: 'Suíça', geonameId: 2658434 },
  { code: 'AT', name: 'Áustria', geonameId: 2782113 },
  { code: 'SE', name: 'Suécia', geonameId: 2661886 },
  { code: 'NO', name: 'Noruega', geonameId: 3144096 },
  { code: 'DK', name: 'Dinamarca', geonameId: 2623032 },
  { code: 'FI', name: 'Finlândia', geonameId: 660013 },
  { code: 'IE', name: 'Irlanda', geonameId: 2963597 },
  { code: 'PL', name: 'Polônia', geonameId: 798544 },
  { code: 'CZ', name: 'República Checa', geonameId: 3077311 },
  { code: 'HU', name: 'Hungria', geonameId: 719819 },
  { code: 'RO', name: 'Romênia', geonameId: 798549 },
  { code: 'BG', name: 'Bulgária', geonameId: 732800 },
  { code: 'GR', name: 'Grécia', geonameId: 390903 },
  { code: 'TR', name: 'Turquia', geonameId: 298795 },
  { code: 'RU', name: 'Rússia', geonameId: 2017370 },
  { code: 'UA', name: 'Ucrânia', geonameId: 690791 },
  { code: 'JP', name: 'Japão', geonameId: 1861060 },
  { code: 'CN', name: 'China', geonameId: 1814991 },
  { code: 'KR', name: 'Coreia do Sul', geonameId: 1835841 },
  { code: 'IN', name: 'Índia', geonameId: 1269750 },
  { code: 'AU', name: 'Austrália', geonameId: 2077456 },
  { code: 'NZ', name: 'Nova Zelândia', geonameId: 2186224 },
  { code: 'ZA', name: 'África do Sul', geonameId: 953987 }
];

// Cache para cidades
let citiesCache = {};

/**
 * Initialize country dropdown
 * @param {string} selectId - ID do elemento select
 */
function initializeCountryDropdown(selectId) {
  const select = document.getElementById(selectId);
  if (!select) return;

  // Clear existing options (except first)
  select.innerHTML = '<option value="">Selecione o país</option>';

  // Add countries sorted alphabetically
  COUNTRIES.sort((a, b) => a.name.localeCompare(b.name, 'pt'))
    .forEach(country => {
      const option = document.createElement('option');
      option.value = country.code;
      option.textContent = country.name;
      option.dataset.geonameId = country.geonameId;
      select.appendChild(option);
    });
}

/**
 * Search cities using GeoNames API
 * @param {string} countryCode - ISO country code (PT, BR, etc)
 * @param {string} searchTerm - City name to search
 * @returns {Promise<Array>}
 */
async function searchCities(countryCode, searchTerm) {
  if (!searchTerm || searchTerm.length < 2) {
    return [];
  }

  // Check cache
  const cacheKey = `${countryCode}_${searchTerm.toLowerCase()}`;
  if (citiesCache[cacheKey]) {
    return citiesCache[cacheKey];
  }

  try {
    // Use GeoNames API
    const url = `https://secure.geonames.org/searchJSON?` +
      `name_startsWith=${encodeURIComponent(searchTerm)}` +
      `&country=${countryCode}` +
      `&maxRows=10` +
      `&featureClass=P` + // P = city, village, etc
      `&orderby=population` +
      `&username=${GEONAMES_USERNAME}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.geonames && data.geonames.length > 0) {
      const cities = data.geonames.map(city => ({
        name: city.name,
        adminName: city.adminName1, // State/Province
        countryCode: city.countryCode,
        population: city.population,
        fullName: city.adminName1 ? `${city.name}, ${city.adminName1}` : city.name
      }));

      // Cache results
      citiesCache[cacheKey] = cities;
      return cities;
    }

    return [];
  } catch (error) {
    console.error('❌ Erro ao buscar cidades:', error);
    // Fallback: retornar lista vazia
    return [];
  }
}

/**
 * Setup city autocomplete
 * @param {string} countrySelectId - ID do select de países
 * @param {string} cityInputId - ID do input de cidade
 * @param {string} datalistId - ID do datalist
 */
function setupCityAutocomplete(countrySelectId, cityInputId, datalistId) {
  const countrySelect = document.getElementById(countrySelectId);
  const cityInput = document.getElementById(cityInputId);
  const datalist = document.getElementById(datalistId);

  if (!countrySelect || !cityInput || !datalist) return;

  let searchTimeout;

  cityInput.addEventListener('input', async function() {
    const searchTerm = this.value.trim();
    const countryCode = countrySelect.value;

    if (!countryCode) {
      datalist.innerHTML = '';
      return;
    }

    if (searchTerm.length < 2) {
      datalist.innerHTML = '';
      return;
    }

    // Debounce search
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {
      const cities = await searchCities(countryCode, searchTerm);

      // Update datalist
      datalist.innerHTML = '';
      cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city.fullName;
        datalist.appendChild(option);
      });
    }, 300);
  });

  // Clear city when country changes
  countrySelect.addEventListener('change', function() {
    cityInput.value = '';
    datalist.innerHTML = '';
  });
}

/**
 * Get top cities for a country (fallback quando GeoNames não funciona)
 * @param {string} countryCode
 * @returns {Array}
 */
function getTopCitiesByCountry(countryCode) {
  const topCities = {
    'PT': ['Lisboa', 'Porto', 'Braga', 'Coimbra', 'Faro', 'Setúbal', 'Funchal', 'Aveiro', 'Viseu', 'Évora'],
    'BR': ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Porto Alegre'],
    'ES': ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Zaragoza', 'Málaga', 'Murcia', 'Palma', 'Las Palmas', 'Bilbao'],
    'US': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'],
    'GB': ['London', 'Birmingham', 'Manchester', 'Glasgow', 'Liverpool', 'Leeds', 'Sheffield', 'Edinburgh', 'Bristol', 'Cardiff'],
    'FR': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'],
    'IT': ['Roma', 'Milano', 'Napoli', 'Torino', 'Palermo', 'Genova', 'Bologna', 'Firenze', 'Bari', 'Catania'],
    'DE': ['Berlin', 'Hamburg', 'München', 'Köln', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig']
  };

  return topCities[countryCode] || [];
}

/**
 * Setup city dropdown with fallback (sem GeoNames)
 * @param {string} countrySelectId
 * @param {string} cityInputId
 * @param {string} datalistId
 */
function setupCityDropdownFallback(countrySelectId, cityInputId, datalistId) {
  const countrySelect = document.getElementById(countrySelectId);
  const cityInput = document.getElementById(cityInputId);
  const datalist = document.getElementById(datalistId);

  if (!countrySelect || !cityInput || !datalist) return;

  countrySelect.addEventListener('change', function() {
    const countryCode = this.value;
    cityInput.value = '';
    
    if (!countryCode) {
      datalist.innerHTML = '';
      return;
    }

    // Load top cities
    const cities = getTopCitiesByCountry(countryCode);
    datalist.innerHTML = '';
    
    cities.forEach(city => {
      const option = document.createElement('option');
      option.value = city;
      datalist.appendChild(option);
    });
  });
}

/**
 * Initialize all location fields
 */
function initializeLocationFields() {
  // Signup form
  initializeCountryDropdown('signupCountry');
  setupCityDropdownFallback('signupCountry', 'signupCity', 'citySuggestions');
  // Modal form (for Google/Reddit)
  initializeCountryDropdown('modalCountry');
  setupCityDropdownFallback('modalCountry', 'modalCity', 'modalCitySuggestions');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeLocationFields);
} else {
  initializeLocationFields();
}

// Export functions
window.geonames = {
  initializeCountryDropdown,
  searchCities,
  setupCityAutocomplete,
  setupCityDropdownFallback,
  getTopCitiesByCountry,
  initializeLocationFields
};
