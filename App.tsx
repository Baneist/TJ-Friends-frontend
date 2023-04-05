import React, { createRef, useRef, useState } from 'react';
import { View, StyleSheet, UIManager, Platform } from 'react-native';
import LoginScreen, { ITextRef } from "./pages/LoginScreen";
import MainScreen from './pages/Main';
import CommentScreen from './pages/Comments';
import TextInput from 'react-native-text-input-interactive';
import { NavigationContainer, StackActions, useNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import Modal from "react-native-modal";
import { WebView } from "react-native-webview";
import SocialLoginScreen from './pages/SocialLoginScreen';

const GetUrl = "https://1.tongji.edu.cn/api/ssoservice/system/loginIn";
const TargetUrl = "https://1.tongji.edu.cn/ssologin";
const PostUrl = "https://1.tongji.edu.cn/api/sessionservice/session/login"

type RootStackParamList = {
  Main: undefined, // undefined because you aren't passing any params to the home screen
  Login: undefined,
  Signup: undefined,
  Profile: { name: string },
  Comment:undefined;
};
const Stack = createStackNavigator<RootStackParamList>();

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

type Props = { navigation: ProfileScreenNavigationProp; };

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const App = () => {
  // let username = '';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');
  const [cookie, setCookie] = useState({});

  const webViewRef = useRef<WebView>(null);
  const navigationRef = useNavigationContainerRef<RootStackParamList>();
  const loginRef = createRef<ITextRef>();
  const signupRef = createRef<ITextRef>();
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
        let data = response.json();
        navigationRef.current?.dispatch(StackActions.replace('Main'));
        setIsModalVisible(false);
      } catch (error) {
        console.log(error);
      };
      // response = await fetch(PostUrl, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ username, password, repassword, ...cookie }),
      // });
      // data = await response.json();

      // if (data.code && data.code === 0) {
      //   StackActions.replace('Login')
      //   setIsModalVisible(false);
      // } else {
      //   alert(data.msg);
      // }

    }
  };

  const handleLogin = async () => {
    const params = loginRef.current?.getParams();
    try {
      let response = await fetch(PostUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      let data = response.json();
      navigationRef.current?.dispatch(StackActions.replace('Main'));
    } catch (error) {
      console.log(error);
    };
  }

  const RenderSignupScreen = ({ navigation }: Props) => (
    <LoginScreen
      ref={signupRef}
      style={{ flex: 1, justifyContent: 'center' }}
      logoImageSource={require('./assets/logo-example.png')}
      onLoginPress={() => setIsModalVisible(true)}
      loginButtonText={'Continue with school validation'}
      enablePasswordValidation={false}
    />
  );

  const RenderLoginScreen = ({ navigation }: Props) => (
    <SocialLoginScreen
      ref={loginRef}
      onSignUpPress={() => { navigation.replace('Signup') }}
      onLoginPress={handleLogin}
      onForgotPasswordPress={() => { }}
      onUserNameChangeText={username => setUsername(username)}
      onPasswordChangeText={password => setPassword(password)}
      enableFacebookLogin
      enableGoogleLogin
    />
  );

  const RenderMainScreen = ({ navigation }: Props) => (
    <MainScreen
      onCommentPress={() => { navigation.navigate('Comment')}}
    />
  );
  
  const RenderCommentScreen = ({ navigation }: Props) => (
    <CommentScreen
      onBackPress={() => navigation.goBack()}
    />
  );
  
  return (
    // <ValidateWebView/>
    <View style={{ flex: 1 }}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen name="Login" component={RenderLoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Signup" component={RenderSignupScreen} />
          <Stack.Screen name="Main" component={RenderMainScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Comment" component={RenderCommentScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
      <Modal isVisible={isModalVisible}>{renderWebView()}</Modal>
    </View>
  );
};

export default App;
