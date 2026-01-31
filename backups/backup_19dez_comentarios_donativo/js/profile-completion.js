/* ============================================
   QUEST4COUPLE - PROFILE COMPLETION
   Verificação e completar perfil incompleto
   ============================================ */

// ========================================
// VERIFICAR SE PERFIL ESTÁ COMPLETO
// ========================================
function isProfileComplete(profile) {
  if (!profile) return false;
  
  // Campos obrigatórios
  const requiredFields = ['gender', 'ageRange', 'country', 'city', 'username'];
  
  for (const field of requiredFields) {
    if (!profile[field] || profile[field].toString().trim() === '') {
      console.log(`⚠️ Campo em falta: ${field}`);
      return false;
    }
  }
  
  return true;
}

// ========================================
// OBTER CAMPOS EM FALTA
// ========================================
function getMissingFields(profile) {
  const requiredFields = {
    'username': 'Username',
    'gender': 'Sexo',
    'ageRange': 'Faixa Etária',
    'country': 'País',
    'city': 'Cidade'
  };
  
  const missing = [];
  
  for (const [field, label] of Object.entries(requiredFields)) {
    if (!profile || !profile[field] || profile[field].toString().trim() === '') {
      missing.push({ field, label });
    }
  }
  
  return missing;
}

// ========================================
// CRIAR MODAL DE COMPLETAR PERFIL
// ========================================
function createProfileCompletionModal() {
  // Verificar se já existe
  if (document.getElementById('profileCompletionModal')) {
    return document.getElementById('profileCompletionModal');
  }
  
  const modal = document.createElement('div');
  modal.id = 'profileCompletionModal';
  modal.className = 'modal-overlay active';
  modal.style.cssText = 'display: flex; z-index: 10000;';
  
  modal.innerHTML = `
    <div class="modal-box" style="max-width: 500px; max-height: 90vh; overflow-y: auto;">
      <h2 style="color: #d63384; margin-bottom: 10px;">
        <span>📋</span> Completa o teu Perfil
      </h2>
      <p style="color: #666; margin-bottom: 5px; font-size: 0.95em;">
        Para uma melhor experiência, precisamos de alguns dados adicionais.
      </p>
      <p style="color: #888; margin-bottom: 20px; font-size: 0.85em; background: #f8f9fa; padding: 10px; border-radius: 8px;">
        📊 <strong>Para fins estatísticos:</strong> Estes dados ajudam-nos a melhorar a plataforma e a criar estatísticas gerais (sem identificar utilizadores). Em breve teremos uma página de estatísticas públicas!
      </p>
      
      <form id="profileCompletionForm">
        <div class="form-group" id="usernameGroup" style="display: none;">
          <label for="completeUsername"><span>Username</span> *</label>
          <input type="text" id="completeUsername" placeholder="username" pattern="[a-z0-9._]+" title="Apenas letras minúsculas, números, ponto e underscore">
          <small style="color: #888;">Será usado para os parceiros te encontrarem. Apenas letras minúsculas, números, . e _</small>
        </div>
        
        <div class="form-group" id="genderGroup" style="display: none;">
          <label for="completeGender"><span>Sexo</span> *</label>
          <select id="completeGender">
            <option value="">Selecione o sexo</option>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
            <option value="outro">Outro</option>
          </select>
        </div>

        <div class="form-group" id="ageRangeGroup" style="display: none;">
          <label for="completeAgeRange"><span>Faixa Etária</span> *</label>
          <select id="completeAgeRange">
            <option value="">Selecione a faixa etária</option>
            <option value="18-23">18-23 anos</option>
            <option value="24-29">24-29 anos</option>
            <option value="30-35">30-35 anos</option>
            <option value="36-40">36-40 anos</option>
            <option value="41-49">41-49 anos</option>
            <option value="50+">+50 anos</option>
          </select>
        </div>

        <div class="form-group" id="countryGroup" style="display: none;">
          <label for="completeCountry"><span>País</span> *</label>
          <select id="completeCountry">
            <option value="">Selecione o país</option>
            <option value="PT">Portugal</option>
            <option value="BR">Brasil</option>
            <option value="AO">Angola</option>
            <option value="MZ">Moçambique</option>
            <option value="CV">Cabo Verde</option>
            <option value="ES">Espanha</option>
            <option value="FR">França</option>
            <option value="UK">Reino Unido</option>
            <option value="US">Estados Unidos</option>
            <option value="CA">Canadá</option>
            <option value="DE">Alemanha</option>
            <option value="CH">Suíça</option>
            <option value="LU">Luxemburgo</option>
            <option value="OTHER">Outro</option>
          </select>
        </div>

        <div class="form-group" id="cityGroup" style="display: none;">
          <label for="completeCity"><span>Cidade</span> *</label>
          <input type="text" id="completeCity" placeholder="Ex: Lisboa">
        </div>

        <button type="submit" class="btn-primary" style="width: 100%; margin-top: 20px; padding: 14px; background: linear-gradient(135deg, #d63384, #e83e8c); color: white; border: none; border-radius: 8px; font-size: 1.1em; font-weight: 600; cursor: pointer;">
          ✅ Guardar e Continuar
        </button>
      </form>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Adicionar estilos se não existirem
  if (!document.getElementById('profileCompletionStyles')) {
    const styles = document.createElement('style');
    styles.id = 'profileCompletionStyles';
    styles.textContent = `
      #profileCompletionModal .form-group {
        margin-bottom: 18px;
        text-align: left;
      }
      #profileCompletionModal label {
        display: block;
        margin-bottom: 6px;
        font-weight: 500;
        color: #495057;
      }
      #profileCompletionModal input,
      #profileCompletionModal select {
        width: 100%;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 8px;
        font-size: 1em;
        transition: border-color 0.3s;
      }
      #profileCompletionModal input:focus,
      #profileCompletionModal select:focus {
        outline: none;
        border-color: #d63384;
        box-shadow: 0 0 0 3px rgba(214, 51, 132, 0.1);
      }
      #profileCompletionModal small {
        display: block;
        margin-top: 5px;
        font-size: 0.85em;
      }
      #profileCompletionModal .btn-primary:hover {
        background: linear-gradient(135deg, #c1296d, #d63384) !important;
        transform: translateY(-2px);
      }
    `;
    document.head.appendChild(styles);
  }
  
  return modal;
}

// ========================================
// MOSTRAR MODAL DE COMPLETAR PERFIL
// ========================================
async function showProfileCompletionModal(userProfile, missingFields, onComplete) {
  const modal = createProfileCompletionModal();
  
  // Mostrar apenas os campos em falta
  missingFields.forEach(({ field }) => {
    const group = document.getElementById(`${field}Group`);
    if (group) {
      group.style.display = 'block';
    }
  });
  
  // Pré-preencher campos que já existem
  if (userProfile) {
    if (userProfile.username) document.getElementById('completeUsername').value = userProfile.username;
    if (userProfile.gender) document.getElementById('completeGender').value = userProfile.gender;
    if (userProfile.ageRange) document.getElementById('completeAgeRange').value = userProfile.ageRange;
    if (userProfile.country) document.getElementById('completeCountry').value = userProfile.country;
    if (userProfile.city) document.getElementById('completeCity').value = userProfile.city;
  }
  
  // Form submit handler
  const form = document.getElementById('profileCompletionForm');
  form.onsubmit = async (e) => {
    e.preventDefault();
    
    const updateData = {};
    
    // Coletar dados dos campos visíveis
    const usernameGroup = document.getElementById('usernameGroup');
    if (usernameGroup && usernameGroup.style.display !== 'none') {
      const username = document.getElementById('completeUsername').value.trim().toLowerCase();
      if (!username || username.length < 3) {
        alert('❌ O username deve ter pelo menos 3 caracteres.');
        return;
      }
      if (!/^[a-z0-9._]+$/.test(username)) {
        alert('❌ Username inválido. Use apenas letras minúsculas, números, ponto (.) e underscore (_).');
        return;
      }
      
      // Verificar se username já existe
      try {
        const usernameCheck = await db.collection('users').where('username', '==', username).limit(1).get();
        if (!usernameCheck.empty) {
          const existingUser = usernameCheck.docs[0];
          // Verificar se é o próprio utilizador
          if (existingUser.id !== auth.currentUser.uid) {
            alert(`❌ Username "@${username}" já está em uso. Por favor escolhe outro.`);
            return;
          }
        }
      } catch (err) {
        console.warn('⚠️ Erro ao verificar username:', err);
      }
      
      updateData.username = username;
    }
    
    const genderGroup = document.getElementById('genderGroup');
    if (genderGroup && genderGroup.style.display !== 'none') {
      const gender = document.getElementById('completeGender').value;
      if (!gender) {
        alert('❌ Por favor selecione o sexo.');
        return;
      }
      updateData.gender = gender;
    }
    
    const ageRangeGroup = document.getElementById('ageRangeGroup');
    if (ageRangeGroup && ageRangeGroup.style.display !== 'none') {
      const ageRange = document.getElementById('completeAgeRange').value;
      if (!ageRange) {
        alert('❌ Por favor selecione a faixa etária.');
        return;
      }
      updateData.ageRange = ageRange;
    }
    
    const countryGroup = document.getElementById('countryGroup');
    if (countryGroup && countryGroup.style.display !== 'none') {
      const country = document.getElementById('completeCountry').value;
      if (!country) {
        alert('❌ Por favor selecione o país.');
        return;
      }
      updateData.country = country;
      // Guardar nome do país também
      const countrySelect = document.getElementById('completeCountry');
      updateData.countryName = countrySelect.options[countrySelect.selectedIndex]?.text || country;
    }
    
    const cityGroup = document.getElementById('cityGroup');
    if (cityGroup && cityGroup.style.display !== 'none') {
      const city = document.getElementById('completeCity').value.trim();
      if (!city) {
        alert('❌ Por favor introduza a cidade.');
        return;
      }
      updateData.city = city;
    }
    
    // Marcar perfil como completo
    updateData.profileComplete = true;
    updateData.profileCompletedAt = firebase.firestore.FieldValue.serverTimestamp();
    
    try {
      // Atualizar no Firestore
      await db.collection('users').doc(auth.currentUser.uid).update(updateData);
      console.log('✅ Perfil atualizado com sucesso:', updateData);
      
      // Fechar modal
      modal.remove();
      
      // Callback de sucesso
      if (typeof onComplete === 'function') {
        onComplete(updateData);
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar perfil:', error);
      alert('❌ Erro ao guardar dados. Tenta novamente.');
    }
  };
  
  modal.style.display = 'flex';
}

// ========================================
// VERIFICAR E SOLICITAR COMPLETAR PERFIL
// ========================================
async function checkAndRequestProfileCompletion(userProfile, onComplete) {
  if (isProfileComplete(userProfile)) {
    console.log('✅ Perfil já está completo');
    return true;
  }
  
  const missingFields = getMissingFields(userProfile);
  console.log('⚠️ Campos em falta:', missingFields.map(f => f.label).join(', '));
  
  // Mostrar modal
  await showProfileCompletionModal(userProfile, missingFields, onComplete);
  
  return false;
}

// Exportar funções
window.profileCompletion = {
  isProfileComplete,
  getMissingFields,
  checkAndRequestProfileCompletion,
  showProfileCompletionModal
};

console.log('📋 Profile completion module carregado!');
