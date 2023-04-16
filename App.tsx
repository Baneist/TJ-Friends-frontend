import React, { useRef, useState } from "react";
import { View, UIManager, Platform, Alert } from "react-native";
import {
  NavigationContainer,
  StackActions,
  useNavigationContainerRef,
} from "@react-navigation/native";
import {
  createStackNavigator,
  StackScreenProps,
} from "@react-navigation/stack";
import Modal from "react-native-modal";
import { WebView } from "react-native-webview";
import axios from "axios";

import handleAxiosError from "./utils/handleError";

import Signin from "./pages/Signin";
import MainScreen from "./pages/Main";
import CommentScreen from "./pages/Comments";

//查看关注列表和粉丝列表
import FollowingList from "./pages/userInfo/FollowingList";
import FollowersList from "./pages/userInfo/FollowersList";
//查看他人主页
import OthersPage from "./pages/userInfo/OthersPage";

//编辑资料相关路由
import { EditProfile } from "./pages/userInfo/EditInfo/EditProfile";
import EditNickName from "./pages/userInfo/EditInfo/EditNickName";
import EditInterest from "./pages/userInfo/EditInfo/EditInterest";
import EditStatus from "./pages/userInfo/EditInfo/EditStatus";
import PostPage from "./pages/PostPage";
import EditLabel from "./pages/userInfo/EditInfo/EditLabel";

import Login from "./pages/Login";
import requestApi from "./utils/request";

const GetUrl = "https://1.tongji.edu.cn/api/ssoservice/system/loginIn";
const TargetUrl = "https://1.tongji.edu.cn/ssologin";
const PostUrl = "https://1.tongji.edu.cn/api/sessionservice/session/login";
const GetSessionUserUrl =
  "https://1.tongji.edu.cn/api/sessionservice/session/getSessionUser";

type RootStackParamList = {
  Main: { userId: string };
  Login: undefined;
  Signup: undefined;
  ChangePassword: undefined;
  Profile: { userId: string };
  Comment: { userId: string };
  Post: { userId: string };
  EditProfile: { userId: string };
  EditNickName: { userId: string };
  EditInterest: { userId: string };
  EditStatus: { userId: string };
  EditLabel: { userId: string };
  FollowingList: { userId: string };
  FollowersList: { userId: string };
  OthersPage: { userId: string };
};
const Stack = createStackNavigator<RootStackParamList>();

//typescript需要指定{route, navigation}的参数类型
export type NavigationProps = StackScreenProps<
  RootStackParamList,
  keyof RootStackParamList
>;

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const App = () => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const webViewRef = useRef<WebView>(null);
  const navigationRef = useNavigationContainerRef<RootStackParamList>();
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

  const handleWebViewNavigationStateChange = async (newNavState: {
    url: string;
  }) => {
    const { url } = newNavState;
    if (url?.startsWith(TargetUrl)) {
      try {
        console.log(url);
        let params: { [key: string]: string } = {};
        for (const pair of url.split("?")[1].split("&")) {
          const param = pair.split("=");
          params[param[0]] = param[1];
        }
        console.log(params);
        let data = (await axios.post(PostUrl, params)).data;
        if (!data?.data) {
          data = (await axios.get(GetSessionUserUrl)).data;
        }
        console.log(data);
        setIsModalVisible(false);
        data = (
          await requestApi(
            "post",
            "/register",
            null,
            {
              username,
              password,
              id: data.data?.uid,
              sessionid: data.data?.sessionid,
            },
            false
          )
        ).data;
        if (data.code === 0) {
          navigationRef.current?.dispatch(StackActions.replace("Main"));
        } else {
          Alert.alert("注册失败", data.msg);
        }
      } catch (error: any) {
        handleAxiosError(error, "注册失败");
      }
    }
  };

  const RenderSignupScreen = ({ navigation }: NavigationProps) => (
    <Signin
      style={{ flex: 1, justifyContent: "center" }}
      logoImageSource={require("./assets/logo-example.png")}
      onLoginPress={() => setIsModalVisible(true)}
      onUsernameChange={setUsername}
      onPasswordChange={setPassword}
      loginButtonText={"Continue with school validation"}
      signupText={"Already have an account?"}
      onSignupPress={() => navigation.replace("Login")}
      enablePasswordValidation={false}
    />
  );

  const RenderChangeScreen = ({ navigation }: NavigationProps) => (
    <Signin
      style={{ flex: 1, justifyContent: "center" }}
      logoImageSource={require("./assets/logo-example.png")}
      onLoginPress={() => setIsModalVisible(true)}
      onUsernameChange={setUsername}
      onPasswordChange={setPassword}
      loginButtonText={"Continue with school validation"}
      signupText={"Already have an account?"}
      onSignupPress={() => navigation.replace("Login")}
      enablePasswordValidation={false}
      usernamePlaceholder={"修改后的账号"}
      passwordPlaceholder={"修改后的密码"}
    />
  );

  const RenderLoginScreen = ({ navigation }: NavigationProps) => (
    <Login
      onSignUpPress={() => navigation.replace("Signup")}
      onLoginPress={() => {}}
      onForgotPasswordPress={() => navigation.replace("ChangePassword")}
      navigation={navigation}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={RenderLoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Signup" component={RenderSignupScreen} />
          <Stack.Screen name="ChangePassword" component={RenderChangeScreen} />
          <Stack.Screen
            name="Comment"
            component={CommentScreen}
            options={{ headerBackTitle: "Back" }}
          />
          <Stack.Screen
            name="Post"
            component={PostPage}
            options={{ headerBackTitle: "Back" }}
          />
          <Stack.Screen
            name="Main"
            component={MainScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfile}
            options={{ headerBackTitle: "Back" }}
          />
          <Stack.Screen
            name="EditNickName"
            component={EditNickName}
            options={{ headerBackTitle: "Back" }}
          />
          <Stack.Screen
            name="EditInterest"
            component={EditInterest}
            options={{ headerBackTitle: "Back" }}
          />
          <Stack.Screen
            name="EditStatus"
            component={EditStatus}
            options={{ headerBackTitle: "Back" }}
          />
          <Stack.Screen
            name="EditLabel"
            component={EditLabel}
            options={{ headerBackTitle: "Back" }}
          />
          <Stack.Screen
            name="FollowersList"
            component={FollowersList}
            options={{ headerBackTitle: "Back" }}
          />
          <Stack.Screen
            name="FollowingList"
            component={FollowingList}
            options={{ headerBackTitle: "Back" }}
          />
          <Stack.Screen
            name="OthersPage"
            component={OthersPage}
            options={{ headerBackTitle: "Back" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Modal
        children={renderWebView()}
        isVisible={isModalVisible}
        onBackdropPress={() => setIsModalVisible(false)}
        onBackButtonPress={() => setIsModalVisible(false)}
      />
    </View>
  );
};

export default App;
