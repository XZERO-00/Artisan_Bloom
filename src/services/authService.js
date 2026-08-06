const API_URL = 'http://localhost:3001/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export const authService = {
  loginWithGoogle: async () => {
    throw new Error('Google Login is currently disabled.');
  },

  register: async (userData) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    
    localStorage.setItem('token', data.token);
    return { success: true, message: 'Registration successful! Welcome to The CraftNest.' };
  },

  login: async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    
    localStorage.setItem('token', data.token);
    return { success: true };
  },

  logout: async () => {
    localStorage.removeItem('token');
  },

  getUserProfile: async () => {
    const res = await fetch(`${API_URL}/auth/me`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch profile');
    return await res.json();
  },

  resetPassword: async (email) => {
    return { success: true, message: 'Password reset link sent to your email (Mocked).' };
  },

  getAllUsers: async () => {
    const res = await fetch(`${API_URL}/users`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch users');
    return await res.json();
  },

  updateUserStatus: async (uid, updates) => {
    const res = await fetch(`${API_URL}/users/${uid}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update user');
    return { success: true };
  },

  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      body: formData
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    return data.url;
  }
};

