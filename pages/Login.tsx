import React, { useState } from "react";
import {
  Text,
  View,
  Image,
  TextStyle,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Alert } from "react-native";
/**
 * ? Local Imports
 */
import styles from "./Login.style";
import TextField from "../components/TextField/TextField";
import SocialButton from "../components/LoginSocialButton/SocialButton";
import requestApi from "../utils/request";
import {NavigationProps} from "../App";
import handleAxiosError from "../utils/handleError";

// ? Assets
const googleLogo = require("../assets/google-logo.png");
const appleLogo = require("../assets/apple-logo.png");

export interface ISocialLoginProps {
  loginText?: string;
  signUpText?: string;
  loginTitleText?: string;
  forgotPasswordText?: string;
  loginButtonShadowColor?: string;
  loginButtonBackgroundColor?: string;
  usernamePlaceholder?: string;
  passwordPlaceholder?: string;
  backArrowImageSource?: any;
  loginButtonTextStyle?: any;
  usernameTextFieldStyle?: any;
  passwordTextFieldStyle?: any;
  rightTopAssetImageSource?: any;
  leftBottomAssetImageSource?: any;
  loginButtonSpinnerVisibility?: boolean;
  facebookSpinnerVisibility?: boolean;
  discordSpinnerVisibility?: boolean;
  twitterSpinnerVisibility?: boolean;
  googleSpinnerVisibility?: boolean;
  spinnerSize?: number;
  spinnerType?: string;
  loginButtonSpinnerColor?: string;
  facebookSpinnerColor?: string;
  twitterSpinnerColor?: string;
  googleSpinnerColor?: string;
  discordSpinnerColor?: string;
  disableSignUp?: boolean;
  appleSpinnerColor?: string;
  appleSpinnerVisibility?: boolean;
  disableForgotButton?: boolean;
  loginTextStyle?: TextStyle;
  signUpTextStyle?: TextStyle;
  forgotPasswordTextStyle?: TextStyle;
  onLoginPress: () => void;
  onForgotPasswordPress: () => void;
  onFacebookLoginPress?: () => void;
  onTwitterLoginPress?: () => void;
  onGoogleLoginPress?: () => void;
  onDiscordLoginPress?: () => void;
  onSignUpPress: () => void;
  onRepasswordChangeText?: (text: string) => void;
  navigation: NavigationProps["navigation"];
}

const Login = (props: ISocialLoginProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const renderHeader = () => {
    const {
      signUpText = "Sign Up",
      disableSignUp,
      signUpTextStyle,
    } = props;
    return (
      !disableSignUp && (
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.headerContainerGlue}
            onPress={() => {
              setIsSignUp(!isSignUp);
              props.onSignUpPress && props.onSignUpPress();
            }}
          >
            <Text style={[styles.signUpTextStyle, signUpTextStyle]}>
              {signUpText}
            </Text>
          </TouchableOpacity>
        </View >
      )
    );
  };

  const renderLoginTitle = () => {
    const {
      loginTitleText = "Log In",
      loginTextStyle
    } = props;
    return (
      <View style={styles.loginTitleContainer}>
        <Text style={[styles.loginTextStyle, loginTextStyle]}>
          {loginTitleText}
        </Text>
      </View>
    );
  };

  const renderTextFieldContainer = () => {
    const {
      usernameTextFieldStyle,
      passwordTextFieldStyle
    } = props;
    return (
      <View style={styles.textFieldContainer}>
        <TextField
          placeholder="Student ID"
          textFieldStyle={usernameTextFieldStyle}
          onChangeText={setUsername}
        />
        <View style={styles.passwordTextFieldContainer}>
          <TextField
            width="70%"
            secureTextEntry
            placeholder='Password'
            textFieldStyle={passwordTextFieldStyle}
            onChangeText={setPassword}
          />
        </View>
        {renderForgotPassword()}
      </View>
    );
  };

  const renderForgotPassword = () => {
    const {
      forgotPasswordText = "Forgot Password?",
      forgotPasswordTextStyle,
      onForgotPasswordPress,
      disableForgotButton,
    } = props;
    return (
      !disableForgotButton && (
        <TouchableOpacity
          style={styles.forgotPasswordContainer}
          onPress={onForgotPasswordPress}
        >
          <Text
            style={[styles.forgotPasswordTextStyle, forgotPasswordTextStyle]}
          >
            {forgotPasswordText}
          </Text>
        </TouchableOpacity>
      )
    );
  };

  const onHandleLoginPress = async () => {
    try {
      const data = (await requestApi('post', '/login', null, { username, password }, false)).data;
      if (data.code === 0) {
        props.navigation.replace('Main');
      } else {
        props.navigation.replace('Login');
        Alert.alert('登录失败', data.msg);
      }
    } catch (error) {
      handleAxiosError(error, '登录失败');
    }
  }

  const renderClassicLoginButton = () => {
    const {
      loginText = "Let's Go!",
      loginButtonBackgroundColor,
      loginButtonShadowColor = "#58a13f",
      loginButtonSpinnerVisibility,
      spinnerSize,
      spinnerType,
      loginButtonSpinnerColor,
    } = props;
    return (
      <SocialButton
        text={loginText}
        onPress={onHandleLoginPress}
        shadowColor={loginButtonShadowColor}
        backgroundColor={loginButtonBackgroundColor}
        isSpinner={loginButtonSpinnerVisibility}
        spinnerSize={spinnerSize}
        spinnerType={spinnerType}
        spinnerColor={loginButtonSpinnerColor}
      />
    );
  };

  const onAppleLoginPress = async () => {
    try {
      const res = await requestApi('get', '/profile/2053186',null, null, true);
      Alert.alert('用户信息', JSON.stringify(res.data));
    } catch (error) {
      handleAxiosError(error);
    }
  }

  const renderAppleLoginButton = () => {
    const {
      spinnerSize,
      spinnerType,
      appleSpinnerColor,
      appleSpinnerVisibility,
    } = props;
    return (
      <View style={styles.socialLoginButtonContainer}>
        <SocialButton
          width={60}
          height={60}
          shadowColor="#1c1c1c"
          backgroundColor="#1c1c1c"
          isSpinner={appleSpinnerVisibility}
          spinnerSize={spinnerSize}
          spinnerType={spinnerType}
          spinnerColor={appleSpinnerColor}
          component={
            <Image source={appleLogo} style={styles.appleImageStyle} />
          }
          onPress={() => onAppleLoginPress && onAppleLoginPress()}
        />
      </View>
    );
  };

  const renderGoogleLoginButton = () => {
    const {
      onGoogleLoginPress,
      googleSpinnerVisibility,
      spinnerSize,
      spinnerType,
      googleSpinnerColor,
    } = props;
    return (
      <View style={styles.socialLoginButtonContainer}>
        <SocialButton
          width={60}
          height={60}
          backgroundColor="#fff"
          spinnerSize={spinnerSize}
          spinnerType={spinnerType}
          spinnerColor={googleSpinnerColor}
          isSpinner={googleSpinnerVisibility}
          component={
            <Image
              source={googleLogo}
              style={styles.socialLoginButtonImageStyle}
            />
          }
          onPress={() => onGoogleLoginPress && onGoogleLoginPress()}
        />
      </View>
    );
  };

  const renderSocialButtons = () => {
    return (
      <View style={styles.socialButtonsContainer}>
        {renderClassicLoginButton()}
        {renderAppleLoginButton()}
        {renderGoogleLoginButton()}
      </View>
    );
  };

  const renderRightTopAsset = () => {
    const { rightTopAssetImageSource } = props;
    return (
      <View style={styles.rightTopAssetContainer}>
        <Image
          resizeMode="contain"
          source={rightTopAssetImageSource}
          style={styles.rightTopAssetImageStyle}
        />
      </View>
    );
  };

  const renderLeftBottomAsset = () => {
    const { leftBottomAssetImageSource } = props;
    return (
      <View style={styles.leftBottomAssetContainer}>
        <Image
          resizeMode="contain"
          source={leftBottomAssetImageSource}
          style={styles.leftBottomAssetImageStyle}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderRightTopAsset()}
      <View style={styles.contentContainer}>
        {renderLoginTitle()}
        {renderTextFieldContainer()}
        {renderHeader()}
        {renderSocialButtons()}
      </View>
      {renderLeftBottomAsset()}
    </SafeAreaView>
  );
};

export default Login;