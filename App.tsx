import React, { createRef, useRef, useState } from 'react';
import { View, StyleSheet, UIManager, Platform } from 'react-native';
import LoginScreen, { ITextRef } from "./pages/LoginScreen";
import MainScreen from './pages/Main';
import CommentScreen from './pages/Comments';
import TextInput from 'react-native-text-input-interactive';
import { NavigationContainer, StackActions, useNavigationContainerRef, RouteProp } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp, NativeStackScreenProps } from '@react-navigation/stack';
//不知道为啥这里报错TT但是其实是有NativeStackScreenProps的（毕竟是官网抄来的代码啊！）
import Modal from "react-native-modal";
import { WebView } from "react-native-webview";
//查看关注列表和粉丝列表
import FollowingList from './pages/userInfo/FollowersList';
import FollowersList from './pages/userInfo/FollowersList';
//编辑资料相关路由
import { EditProfile } from './pages/userInfo/EditInfo/EditProfile';
import EditNickName from './pages/userInfo/EditInfo/EditNickName'
import EditInterest from './pages/userInfo/EditInfo/EditInterest';
import EditStatus from './pages/userInfo/EditInfo/EditStatus';
import SocialLoginScreen from './pages/SocialLoginScreen';
import PostPage from './pages/PostPage';
import EditLabel from './pages/userInfo/EditInfo/EditLabel';
import instance from './utils/request';

const GetUrl = "https://1.tongji.edu.cn/api/ssoservice/system/loginIn";
const TargetUrl = "https://1.tongji.edu.cn/ssologin";
const PostUrl = "https://1.tongji.edu.cn/api/sessionservice/session/login";
const GetSessionUserUrl = 'https://1.tongji.edu.cn/api/sessionservice/session/getSessionUser';

type RootStackParamList = {
  Main: undefined,
  Login: undefined,
  Signup: undefined,
  Profile: { name: string },
  Comment: undefined,
  Post: undefined;
  EditProfile: undefined,
  EditNickName:undefined,
  EditInterest:undefined,
  EditStatus:undefined,
  EditLabel:undefined,
  FollowingList:undefined,
  FollowersList:undefined
};
const Stack = createStackNavigator<RootStackParamList>();

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;
type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Main'>;

//type Props = {navigation: ProfileScreenNavigationProp;};
//typescript需要指定{route, navigation}的参数类型
export type Props = NativeStackScreenProps<RootStackParamList, 'Main'>;

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const App = () => {
  const webViewRef = useRef<WebView>(null);
  const navigationRef = useNavigationContainerRef<RootStackParamList>();
  const loginRef = useRef<ITextRef>(null);
  const signupRef = useRef<{ username: string, password: string }>(null);
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
      let response = await fetch(GetSessionUserUrl);
      let data = await response.json();
      if (!data.data) {
        const params: { [index: string]: string } = {};
        const pairs = url.split("?")[1].split("&");
        for (const pair of pairs) {
          const [key, value] = pair.split("=");
          params[key] = value;
        }
        try {
          response = await fetch(PostUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
          });
          data = await response.json();
        } catch (error) {
          console.log(error);
        };
      }
      setIsModalVisible(false);
      navigationRef.current?.dispatch(StackActions.replace('Signup'));
      console.log({ username: signupRef.current?.username, password: signupRef.current?.password, id: data.data.uid, sessionid: data.data.sessionid })
      response = await instance.post('/register', { username: 'fff', password: 'fff222', id: data.data.uid, sessionid: data.data.sessionid });
      console.log(response);
      navigationRef.current?.dispatch(StackActions.replace('Signup'));



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
      navigationRef.current?.dispatch(StackActions.replace('Signup'));
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
      onUserNameChangeText={() => { }}
      onPasswordChangeText={() => { }}
      enableFacebookLogin
      enableGoogleLogin
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={RenderLoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Signup" component={RenderSignupScreen} />
          <Stack.Screen name="Comment" component={CommentScreen} options={{ headerBackTitle: 'Back' }} />
          <Stack.Screen name="Post" component={PostPage} options={{ headerBackTitle: 'Back' }} />
          <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
          <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerBackTitle:'Back' }}/>
          <Stack.Screen name="EditNickName" component={EditNickName} options={{ headerBackTitle:'Back' }}/>
          <Stack.Screen name="EditInterest" component={EditInterest} options={{ headerBackTitle:'Back' }}/>
          <Stack.Screen name="EditStatus" component={EditStatus} options={{ headerBackTitle:'Back' }}/>
          <Stack.Screen name="EditLabel" component={EditLabel} options={{ headerBackTitle:'Back' }}/>
          <Stack.Screen name="FollowersList" component={FollowersList} options={{ headerBackTitle:'Back' }}/>
          <Stack.Screen name="FollowingList" component={FollowingList} options={{ headerBackTitle:'Back' }}/>
        </Stack.Navigator>
      </NavigationContainer>
      <Modal isVisible={isModalVisible}>{renderWebView()}</Modal>
    </View>
  );
};

export default App;
