import axios from 'axios'
const BASE_URL= 'http://127.0.0.1:4523/m1/2539601-0-default';
const instance = axios.create({
    base: BASE_URL
});

export default {
    get:instance.get,
    post:instance.post
}