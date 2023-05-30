import {Alert} from "react-native";

const handleAxiosError = (error: any, title: string = '') => {
    if (error.response) {
        const response = error.response;
        console.log(response.data);
        console.log(response.status);
        console.log(response.headers);
        Alert.alert(title, response.data.detail ?? JSON.stringify(response.data));
    } else if (error.request) {
        console.log(error.request);
        Alert.alert(title, error.request);
    } else {
        console.log('Error', error.message);
        Alert.alert(title, error.message);
    }
};

export default handleAxiosError;