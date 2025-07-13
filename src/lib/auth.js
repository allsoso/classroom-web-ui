export function validateAndCleanStorage() {
  try {
    if (!window.localStorage) {
      console.warn('localStorage não está disponível');
      return;
    }
    
    const userData = localStorage.getItem('user_data');
    if (userData && userData !== 'undefined' && userData !== 'null') {
      JSON.parse(userData);
    }
    
    const token = localStorage.getItem('access_token');
    if (token && (token === 'undefined' || token === 'null')) {
      localStorage.removeItem('access_token');
    }
    
  } catch (error) {
    console.error('Erro ao validar localStorage, limpando dados:', error);
    clearAllAuthData();
  }
}

export function initializeAuth() {
  try {
    validateAndCleanStorage();
  } catch (error) {
    console.error('Erro ao inicializar sistema de autenticação:', error);
    clearAllAuthData();
  }
}

export function saveToken(token) {
    if (token && typeof token === 'string') {
        localStorage.setItem('access_token', token);
    } else {
        console.warn('Token inválido:', token);
    }
}

export function removeToken() {
    localStorage.removeItem('access_token');
}

export function getToken() {
    const token = localStorage.getItem('access_token');
    return (token && token !== 'undefined' && token !== 'null') ? token : null;
}

export function isAuthenticated() {
    return !!getToken();
}

export function isUserAuthenticated() {
    const userData = getUserData();
    const token = getToken();
    return !!(userData && userData.id && token);
}

export function saveUserData(userData) {
    if (userData && typeof userData === 'object') {
        localStorage.setItem('user_data', JSON.stringify(userData));
    } else {
        console.warn('Tentativa de salvar dados de usuário inválidos:', userData);
    }
}

export function getUserData() {
  try {
    const userData = localStorage.getItem('user_data');
    
    if (!userData || userData === 'undefined' || userData === 'null') {
      return null;
    }
    
    const parsedData = JSON.parse(userData);
    
    if (!parsedData || typeof parsedData !== 'object') {
      throw new Error('Dados do usuário inválidos');
    }
    
    return parsedData;
  } catch (error) {
    console.error('Erro ao obter dados do usuário:', error);
    localStorage.removeItem('user_data');
    return null;
  }
}

export function removeUserData() {
    localStorage.removeItem('user_data');
}

export function clearAllAuthData() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
}

export function logout() {
    clearAllAuthData();
} 