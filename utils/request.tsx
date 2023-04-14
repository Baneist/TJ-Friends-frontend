import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://119.3.178.68:8000';
let contentType = 'application/json';
// const BASE_URL = 'https://mock.apifox.cn/m1/2539601-0-default';
const instance = axios.create({
  baseURL: BASE_URL,
} as const);

const setToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('@MyApp:token', token);
  } catch (error) {
    console.log(error);
  }
};

const getToken = async () => {
  try {
    return await AsyncStorage.getItem('@MyApp:token');
  } catch (error) {
    return null;
  }
};

const requestApi = async (method: string, url: string, data: any, withToken: boolean) => {
  if (withToken) {
    const token = await getToken();
    if (token) {
      instance.defaults.headers.common['auth'] = token;
    }
  }

  if (url === '/login') {
    contentType = 'application/x-www-form-urlencoded';
    data = new URLSearchParams(data);
  }
  console.log(data)
  const response = await instance.request({
    url, method, data, headers: {
      'Content-Type': contentType,
    }
  });

  // const response = (await fetch(BASE_URL + url, {
  //   method: method,
  //   headers: {
  //     'content-type': contentType,
  //   },
  //   body: JSON.stringify(data)
  // })).json();

  console.log(response)
  // if (response.data.code && response.data.code === 0 && url === '/login') {
  //   await setToken(response.data.data.access_token)
  // }
  return response;
};

export default requestApi;