const API_URL = 'http://127.0.0.1:8001';

// Função para fazer fetch com refresh automático
async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('access_token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    let response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
    });
    
    if (response.status === 401) {
        const refreshed = await refreshAccessToken();
        
        if (refreshed) {
            const newToken = localStorage.getItem('access_token');
            headers['Authorization'] = `Bearer ${newToken}`;
            
            response = await fetch(url, {
                ...options,
                headers,
                credentials: 'include',
            });
        } else {
            localStorage.removeItem('access_token');
            window.location.href = 'login.html';
            throw new Error('Sessão expirada');
        }
    }
    
    return response;
}

async function refreshAccessToken() {
    try {
        const response = await fetch(`${API_URL}/api/refresh/`, {
            method: 'POST',
            credentials: 'include', // Envia cookie com refresh token
        });
        
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('access_token', data.access); // Salva novo access token
            return true;
        }
        return false;
    } catch (error) {
        console.error('Erro ao renovar token:', error);
        return false;
    }
}

function logout() {
    localStorage.removeItem('access_token');
    window.location.href = 'login.html';
}

window.fetchWithAuth = fetchWithAuth;
window.logout = logout;