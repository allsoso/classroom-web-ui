export function saveToken(token) {
    localStorage.setItem('access_token', token);
}

export function removeToken() {
    localStorage.removeItem('access_token');
}

export function getToken() {
    return localStorage.getItem('access_token');
}

export function isAuthenticated() {
    return !!getToken();
}

export function saveUserData(userData) {
    localStorage.setItem('user_data', JSON.stringify(userData));
}

export function getUserData() {
  try {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Erro ao obter dados do usuário:', error);
    return null;
  }
}

export function removeUserData() {
    localStorage.removeItem('user_data');
}

export function logout() {
    removeToken();
    removeUserData();
} 