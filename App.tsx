import React, { createRef, useRef, useState } from 'react';
import { View, StyleSheet, UIManager, Platform,Text } from 'react-native';
import LoginScreen, { ITextRef } from "./pages/LoginScreen";
import MainScreen from './pages/Main';
import CommentScreen from './pages/Comments';
import TextInput from 'react-native-text-input-interactive';
import { NavigationContainer, StackActions, useNavigationContainerRef, RouteProp  } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp, NativeStackScreenProps  } from '@react-navigation/stack';
//不知道为啥这里报错TT但是其实是有NativeStackScreenProps的（毕竟是官网抄来的代码啊！）
import Modal from "react-native-modal";
import { WebView } from "react-native-webview";
//查看关注列表和粉丝列表
import FollowingList from './pages/userInfo/FollowingList';
import FollowersList from './pages/userInfo/FollowersList';
//查看他人主页
import OthersPage from './pages/userInfo/OthersPage';
//编辑资料相关路由
import { EditProfile } from './pages/userInfo/EditInfo/EditProfile';
import EditNickName from './pages/userInfo/EditInfo/EditNickName'
import EditInterest from './pages/userInfo/EditInfo/EditInterest';
import EditStatus from './pages/userInfo/EditInfo/EditStatus';
import SocialLoginScreen from './pages/SocialLoginScreen';
import PostPage from './pages/PostPage';
import EditLabel from './pages/userInfo/EditInfo/EditLabel';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';

const GetUrl = "https://1.tongji.edu.cn/api/ssoservice/system/loginIn";
const TargetUrl = "https://1.tongji.edu.cn/ssologin";
const PostUrl = "https://1.tongji.edu.cn/api/sessionservice/session/login"

type RootStackParamList = {
  Main: undefined,
  Login: undefined,
  Signup: undefined,
  Profile: { name: string },
  Comment:undefined,
  Post:undefined;
  EditProfile: undefined,
  EditNickName:undefined,
  EditInterest:undefined,
  EditStatus:undefined,
  EditLabel:undefined,
  FollowingList:undefined,
  FollowersList:undefined,
  OthersPage:undefined
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

  const RenderLoginScreen = ({navigation }: Props) => (
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
  
  return (
    // <ValidateWebView/>
    <View style={{ flex: 1 }}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={RenderLoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Signup" component={RenderSignupScreen} />
          <Stack.Screen name="Comment" component={CommentScreen} options={{ headerBackTitle:'Back' }} />
          <Stack.Screen name="Post" component={PostPage}  
          options={{ headerBackTitle:'Back',
          headerRight:()=><Button style={{paddingRight:15,borderRadius:10}} onPress={()=>{console.log('send')}}><Icon name='send' size={20}/></Button>}} />
          <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
          <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerBackTitle:'Back' }}/>
          <Stack.Screen name="EditNickName" component={EditNickName} options={{ headerBackTitle:'Back' }}/>
          <Stack.Screen name="EditInterest" component={EditInterest} options={{ headerBackTitle:'Back' }}/>
          <Stack.Screen name="EditStatus" component={EditStatus} options={{ headerBackTitle:'Back' }}/>
          <Stack.Screen name="EditLabel" component={EditLabel} options={{ headerBackTitle:'Back' }}/>
          <Stack.Screen name="FollowersList" component={FollowersList} options={{ headerBackTitle:'Back' }}/>
          <Stack.Screen name="FollowingList" component={FollowingList} options={{ headerBackTitle:'Back' }}/>
          <Stack.Screen name="OthersPage" component={OthersPage} options={{ headerBackTitle:'Back' }}/>
        </Stack.Navigator>
      </NavigationContainer>
      <Modal isVisible={isModalVisible}>{renderWebView()}</Modal>
    </View>
  );
};

export default App;
