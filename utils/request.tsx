import axios from 'axios'
const BASE_URL= 'https://mock.apifox.cn/m1/2581834-0-default';
const instance = axios.create({
    baseURL: BASE_URL,
}as const);

export default {
    get:instance.get,
    post:instance.post
}