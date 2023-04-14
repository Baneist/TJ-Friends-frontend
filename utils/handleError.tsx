import {Alert} from "react-native";

const handleAxiosError = (error: any, title: string = '') => {
    if (error.response) {
        const response = error.response;
        console.log(response.data);
        console.log(response.status);
        console.log(response.headers);
        Alert.alert(title, response.data.message ?? JSON.stringify(response.data))
    } else if (error.request) {
        console.log(error.request);
    } else {
        console.log('Error', error.message);
    }
};

export default handleAxiosError;