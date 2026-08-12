import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${BASE_URL}/api/tickets`;
const AUTH_URL = `${BASE_URL}/api/auth`;

// Axios Interceptor to handle invalid/expired tokens automatically
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Helper to get token
const getConfig = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const loginAdmin = async (userId, password) => {
    const response = await axios.post(`${AUTH_URL}/login`, { userId, password });
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
};

export const getTickets = async (params) => {
    const response = await axios.get(API_URL, { params, ...getConfig() });
    return response.data;
};

export const getTicketById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`, getConfig());
    return response.data;
};

export const createTicket = async (ticketData) => {
    const response = await axios.post(API_URL, ticketData, getConfig());
    return response.data;
};

export const updateTicket = async (id, updatedData) => {
    const response = await axios.put(`${API_URL}/${id}`, updatedData, getConfig());
    return response.data;
};
