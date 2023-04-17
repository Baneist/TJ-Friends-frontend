import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import qs from 'qs';

const BASE_URL = 'http://119.3.178.68:8888';

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

const requestApi = async (method: string, url: string, params:any, data: any, withToken: boolean) => {
  if (withToken) {
    const token = await getToken();
    if (token) {
      instance.defaults.headers.common['Authorization'] = "Bearer " + token;
    }
  }
  let contentType = 'application/json';
  if (url === '/login') {
    contentType = 'application/x-www-form-urlencoded';
    data = qs.stringify(data);
  }
  const response = await instance.request({
    url, method,params,data, headers: {
      'Content-Type': contentType,
    }
  });

  if (response.data.code === 0 && url === '/login') {
    await setToken(response.data.data.access_token)
  }
  return response;
};

export default requestApi;
