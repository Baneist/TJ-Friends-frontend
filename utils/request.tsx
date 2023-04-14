import axios from 'axios'
// HJX的云端mock测试
const BASE_URL= 'https://mock.apifox.cn/m1/2581834-0-default';
//正式接口
//const BASE_URL = 'http://119.3.178.68:8888'
const instance = axios.create({
    baseURL: BASE_URL,
}as const);

export default {
    get:instance.get,
    post:instance.post,
    put:instance.put,
    del:instance.delete
}