/**
 * Quest4Couple - Authentication System
 * Sistema de autenticação com SHA-256 hash
 */

// ========================================
// SHA-256 IMPLEMENTATION
// ========================================

async function sha256(message) {
  // Encode as UTF-8
  const msgBuffer = new TextEncoder().encode(message);
  
  // Hash the message
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  
  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

// ========================================
// ADMIN CREDENTIALS
// ========================================

// Admin credentials - Updated 19/11/2025
const ADMIN_EMAIL = 'user';
// Password: admin (SHA-256 hash)
const ADMIN_PASSWORD_HASH = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918';

/**
 * Verify admin login
 * @param {string} email 
 * @param {string} password 
 * @returns {boolean}
 */
async function verifyAdminLogin(email, password) {
  if (email !== ADMIN_EMAIL) {
    return false;
  }
  
  const passwordHash = await sha256(password);
  return passwordHash === ADMIN_PASSWORD_HASH;
}

// For synchronous use in admin.html
function verifyAdminLoginSync(email, password) {
  // Simple check - in production use async version
  console.log('🔐 Verificando credenciais:', email);
  if (email === ADMIN_EMAIL && password === 'admin') {
    return true;
  }
  return false;
}

// Make it available globally
window.verifyAdminLogin = verifyAdminLoginSync;

// ========================================
// USER MANAGEMENT
// ========================================

/**
 * Get all users from localStorage
 * @returns {Array}
 */
function getUsers() {
  return JSON.parse(localStorage.getItem('q4c_users') || '[]');
}

/**
 * Save users to localStorage
 * @param {Array} users 
 */
function saveUsers(users) {
  localStorage.setItem('q4c_users', JSON.stringify(users));
}

/**
 * Get current logged in user
 * @returns {Object|null}
 */
function getCurrentUser() {
  const currentUserStr = localStorage.getItem('q4c_current_user');
  return currentUserStr ? JSON.parse(currentUserStr) : null;
}

/**
 * Set current logged in user
 * @param {Object} user 
 */
function setCurrentUser(user) {
  localStorage.setItem('q4c_current_user', JSON.stringify(user));
  
  // Update last login
  const users = getUsers();
  const userIndex = users.findIndex(u => u.email === user.email);
  if (userIndex !== -1) {
    users[userIndex].lastLogin = new Date().toISOString();
    saveUsers(users);
  }
}

/**
 * Logout current user
 */
function logoutUser() {
  localStorage.removeItem('q4c_current_user');
}

/**
 * Register new user
 * @param {string} name 
 * @param {string} email 
 * @param {string} password 
 * @param {string} country - Optional
 * @param {string} city - Optional
 * @returns {Promise<Object>}
 */
async function registerUser(name, email, password, country = 'Não especificado', city = 'Não especificado') {
  const users = getUsers();
  
  // Check if email already exists
  if (users.find(u => u.email === email)) {
    throw new Error('Este email já está registado!');
  }
  
  // Hash password
  const passwordHash = await sha256(password);
  
  // Create new user
  const newUser = {
    id: Date.now(),
    name: name,
    email: email,
    password: passwordHash,
    country: country,
    city: city,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    reports: [],
    savedAnswers: {} // For storing encrypted answer sets with custom codes
  };
  
  // Save user
  users.push(newUser);
  saveUsers(users);
  
  return newUser;
}

/**
 * Login user
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>}
 */
async function loginUser(email, password) {
  const users = getUsers();
  
  // Hash password
  const passwordHash = await sha256(password);
  
  // Find user
  const user = users.find(u => u.email === email && u.password === passwordHash);
  
  if (!user) {
    throw new Error('Email ou password incorretos!');
  }
  
  return user;
}

// ========================================
// REPORT MANAGEMENT
// ========================================

/**
 * Save a compatibility report for the user
 * @param {string} userEmail 
 * @param {Object} reportData 
 */
function saveReport(userEmail, reportData) {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.email === userEmail);
  
  if (userIndex === -1) {
    console.error('User not found');
    return false;
  }
  
  // Add report
  if (!users[userIndex].reports) {
    users[userIndex].reports = [];
  }
  
  const report = {
    id: Date.now(),
    date: new Date().toISOString(),
    packName: reportData.packName,
    compatibility: reportData.compatibility,
    partner1: reportData.partner1,
    partner2: reportData.partner2,
    details: reportData.details || {}
  };
  
  users[userIndex].reports.push(report);
  saveUsers(users);
  
  return true;
}

/**
 * Get all reports for a user
 * @param {string} userEmail 
 * @returns {Array}
 */
function getUserReports(userEmail) {
  const users = getUsers();
  const user = users.find(u => u.email === userEmail);
  
  return user && user.reports ? user.reports : [];
}

/**
 * Delete a report
 * @param {string} userEmail 
 * @param {number} reportId 
 */
function deleteReport(userEmail, reportId) {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.email === userEmail);
  
  if (userIndex === -1) {
    return false;
  }
  
  users[userIndex].reports = users[userIndex].reports.filter(r => r.id !== reportId);
  saveUsers(users);
  
  return true;
}

// ========================================
// SAVED ANSWERS MANAGEMENT (with Access Code)
// ========================================

/**
 * Save encrypted answers with custom access code
 * @param {string} userEmail 
 * @param {string} accessCode - Custom code defined by user
 * @param {Object} answersData 
 */
async function saveEncryptedAnswers(userEmail, accessCode, answersData) {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.email === userEmail);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  // Hash the access code for storage
  const codeHash = await sha256(accessCode);
  
  if (!users[userIndex].savedAnswers) {
    users[userIndex].savedAnswers = {};
  }
  
  // Store with hashed code as key
  users[userIndex].savedAnswers[codeHash] = {
    id: Date.now(),
    savedAt: new Date().toISOString(),
    packName: answersData.packName,
    encryptedData: answersData.encryptedData,
    userName: answersData.userName
  };
  
  saveUsers(users);
  return true;
}

/**
 * Retrieve encrypted answers with access code
 * @param {string} userEmail 
 * @param {string} accessCode 
 * @returns {Object|null}
 */
async function getEncryptedAnswers(userEmail, accessCode) {
  const users = getUsers();
  const user = users.find(u => u.email === userEmail);
  
  if (!user || !user.savedAnswers) {
    return null;
  }
  
  // Hash the access code
  const codeHash = await sha256(accessCode);
  
  return user.savedAnswers[codeHash] || null;
}

/**
 * List all saved answer sets for a user (without decryption)
 * @param {string} userEmail 
 * @returns {Array}
 */
function listSavedAnswers(userEmail) {
  const users = getUsers();
  const user = users.find(u => u.email === userEmail);
  
  if (!user || !user.savedAnswers) {
    return [];
  }
  
  // Return list without the actual encrypted data (just metadata)
  return Object.keys(user.savedAnswers).map(codeHash => ({
    savedAt: user.savedAnswers[codeHash].savedAt,
    packName: user.savedAnswers[codeHash].packName,
    userName: user.savedAnswers[codeHash].userName,
    codeHash: codeHash.substring(0, 8) + '...' // Show partial hash for identification
  }));
}

// ========================================
// EXPORT FUNCTIONS FOR GLOBAL USE
// ========================================

window.auth = {
  sha256,
  verifyAdminLogin: verifyAdminLoginSync,
  getUsers,
  saveUsers,
  getCurrentUser,
  setCurrentUser,
  logoutUser,
  registerUser,
  loginUser,
  saveReport,
  getUserReports,
  deleteReport,
  saveEncryptedAnswers,
  getEncryptedAnswers,
  listSavedAnswers
};
