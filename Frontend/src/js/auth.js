// Auth utility functions
import { api } from './api.js';

async function login(email, password) {
    try {
        const response = await api.post('/auth/login', { email, password });
        const user = response.data.data;
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    } catch (error) {
        throw error.response?.data?.message || 'Login failed';
    }
}

async function register(email, password) {
    try {
        const response = await api.post('/auth/register', { email, password });
        const user = response.data.data;
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    } catch (error) {
        throw error.response?.data?.message || 'Registration failed';
    }
}

function logout() {
    localStorage.removeItem('user');
}

function getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

function isAuthenticated() {
    return getUser() !== null;
}

export { login, register, logout, getUser, isAuthenticated };
