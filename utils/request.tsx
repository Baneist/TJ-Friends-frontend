import axios from 'axios'
const BASE_URL= 'http://119.3.178.68:8000';
const instance = axios.create({
    baseURL: BASE_URL
}as const);

export default {
    get:instance.get,
    post:instance.post
}