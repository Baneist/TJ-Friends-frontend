import React, { useRef, useState } from 'react';
import { View, StyleSheet, UIManager, Platform } from 'react-native';
import LoginScreen from "./pages/LoginScreen";
import MainScreen from './pages/Main';
import TextInput from 'react-native-text-input-interactive';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import Modal from "react-native-modal";
import { WebView } from "react-native-webview";

const GetUrl = "https://1.tongji.edu.cn/api/ssoservice/system/loginIn";
const TargetUrl = "https://1.tongji.edu.cn/ssologin";
const PostUrl = "https://1.tongji.edu.cn/api/sessionservice/session/login"



type RootStackParamList = {
  Main: undefined, // undefined because you aren't passing any params to the home screen
  Login: undefined,
  Signup: undefined,
  Profile: { name: string };
};
const Stack = createStackNavigator<RootStackParamList>();

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

type Props = { navigation: ProfileScreenNavigationProp; };

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

const App = () => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [repassword, setRepassword] = React.useState('');
  const [cookie, setCookie] = React.useState({});

  const webViewRef = useRef<WebView>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const renderWebView = () => {
    return (
      <WebView
        ref={webViewRef}
        source={{ uri: GetUrl }}
        onNavigationStateChange={handleWebViewNavigationStateChange}
      />
    );
  };

  const handleWebViewNavigationStateChange = async (newNavState: { url: string }) => {
    const { url } = newNavState;
    if (url && url.startsWith(TargetUrl)) {
      const params: { [index: string]: string } = {};
      const pairs = url.split("?")[1].split("&");
      for (const pair of pairs) {
        const [key, value] = pair.split("=");
        params[key] = value;
      }
      try {
        let response = await fetch(PostUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        });
        let data = await response.json();
        setCookie({ sessionid: data.sessionid, id: data.uid });
        response = await fetch(PostUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password, repassword, ...cookie}),
        });
        data = await response.json();
        if (data.code && data.code === 0) {
          StackActions.replace('Login')
          setIsModalVisible(false);
        } else {
          alert(data.msg);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const RenderSignupScreen = ({ navigation }: Props) => (
    <>
      <LoginScreen
        style={{ flex: 1, justifyContent: 'center' }}
        logoImageSource={require('./assets/logo-example.png')}
        onLoginPress={() => { }}
        onSignupPress={() => { setIsModalVisible(true) }}
        onUsernameChange={setUsername}
        loginButtonText={'Continue with school validation'}
        textInputChildren={
          <View style={{ marginTop: 16 }}>
            <TextInput
              placeholder="Re-Password"
              secureTextEntry={true}
              onChangeText={setRepassword}
            />
          </View>
        }
        onPasswordChange={setPassword}
        enablePasswordValidation={true}
      />
      <Modal isVisible={isModalVisible}>{renderWebView()}</Modal>
    </>
  );

  const RenderLoginScreen = ({ navigation }: Props) => (
    <LoginScreen
      style={{ flex: 1, justifyContent: 'center' }}
      logoImageSource={require('./assets/logo-example.png')}
      onLoginPress={() => { navigation.replace('Main') }}
      onSignupPress={() => { navigation.replace('Main') }}
      onUsernameChange={setUsername}
      onPasswordChange={setPassword}
      enablePasswordValidation={true}
    />
  );

  return (
    // <ValidateWebView/>
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Signup">
          <Stack.Screen name="Login" component={RenderLoginScreen} />
          <Stack.Screen name="Signup" component={RenderSignupScreen} />
          <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default App;
