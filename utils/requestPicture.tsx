import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import qs from 'qs';
import handleAxiosError from "./handleError";
import { Alert } from "react-native";

const BASE_URL = 'https://imgs.top/api/v1';

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Authorization": "Bearer 1284|3jDnF9zXnrscwEEPWTdhCTPTgdR9WCgnwt6Qv4l0",
    'Content-Type': 'multipart/form-data',
    'Accept': 'application/json',
  }
} as const);

const uploadPicture = async (uri: string) => {
  try {
    const response = await instance.post('upload', {
      file: {
        uri,
        type: 'image/png',
        name: uri.split('/')[uri.split('/').length - 1]
      }
    });
    console.log(response);
    return response.data.data.links.url;
  } catch (error) {
    handleAxiosError(error);
    return uri;
  }
}


export default uploadPicture;
