import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import qs from 'qs';
import handleAxiosError from "./handleError";
import { Alert } from "react-native";

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

const requestApi = async (method: string, url: string, data: any, withToken: boolean, errorTitle: string) => {
  if (withToken) {
    const token = await getToken();
    if (token) {
      instance.defaults.headers.common['Authorization'] = "Bearer " + token;
    }
  }
  let contentType = 'application/json';
  if (url === '/login' || method === 'get') {
    contentType = 'application/x-www-form-urlencoded';
  }
  if (url === '/login') {
    data = qs.stringify(data);
  }
  try {
    const response = await instance.request({
      url, method, data, headers: {
        'Content-Type': contentType,
      }
    });
    if (response.data.code === 0) {
      if (url === '/login') {
        await setToken(response.data.data.access_token);
      }
    } else {
      console.log(errorTitle, response.data.code);
      Alert.alert(errorTitle, response.data.msg);
    }
    return response.data;
  } catch (error) {
    handleAxiosError(error, errorTitle)
    return { 'code': -1, msg: 'error', data: {} };
  }
};

export default requestApi;

const instance2 = axios.create({
  baseURL: 'https://mock.apifox.cn/m1/2539601-0-default/',
} as const);
export const requestApiForMockTest = async (method: string, url: string, data: any, withToken: boolean, errorTitle: string) => {
  if (withToken) {
    const token = await getToken();
    if (token) {
      instance2.defaults.headers.common['Authorization'] = "Bearer " + token;
    }
  }
  let contentType = 'application/json';
  if (url === '/login' || method === 'get') {
    contentType = 'application/x-www-form-urlencoded';
  }
  if (url === '/login') {
    data = qs.stringify(data);
  }
  try {
    const response = await instance2.request({
      url, method, data, headers: {
        'Content-Type': contentType,
      }
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error, errorTitle)
    return { 'code': -1, msg: 'error', data: {} };
  }
};
