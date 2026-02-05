// API configuration with Axios
const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // IMPORTANT: Send cookies with every request
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor to handle 401 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear auth and redirect to login
            localStorage.removeItem('user');
            window.location.href = '#login';
            window.location.reload();
        }
        return Promise.reject(error);
    }
);

export { api };
