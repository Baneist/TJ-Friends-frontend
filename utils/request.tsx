import axios from 'axios'
const BASE_URL = 'http://119.3.178.68:8888/';
const instance = axios.create({
    baseURL: BASE_URL
} as const);

export default instance;