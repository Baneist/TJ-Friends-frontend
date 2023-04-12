import axios from 'axios'
const BASE_URL = 'http://119.3.178.68:8888/';
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
} as const);

export default api;
