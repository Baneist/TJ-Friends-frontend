import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  Text,
  View,
  Image,
  TextStyle,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
/**
 * ? Local Imports
 */
import styles from "./SocialLoginScreen.style";
import TextField from "../components/TextField/TextField";
import SocialButton from "../components/SocialButton/SocialButton";
import { ITextRef } from "./LoginScreen";

// ? Assets
const backArrowImage = require("../assets/left-arrow.png");
const facebookLogo = require("../assets/facebook-logo.png");
const twitterLogo = require("../assets/twitter-logo.png");
const googleLogo = require("../assets/google-logo.png");
const discordLogo = require("../assets/discord-logo.png");
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
  enableAppleLogin?: boolean;
  enableFacebookLogin?: boolean;
  enableTwitterLogin?: boolean;
  enableGoogleLogin?: boolean;
  enableDiscordLogin?: boolean;
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
  onAppleLoginPress?: () => void;
  onForgotPasswordPress: () => void;
  onFacebookLoginPress?: () => void;
  onTwitterLoginPress?: () => void;
  onGoogleLoginPress?: () => void;
  onDiscordLoginPress?: () => void;
  onUserNameChangeText: (text: string) => void;
  onPasswordChangeText: (text: string) => void;
  //? Only Sign Up Screen Props
  onSignUpPress: () => void;
  onRepasswordChangeText?: (text: string) => void;
}

const SocialLoginScreen = React.forwardRef<ITextRef, ISocialLoginProps>((props: ISocialLoginProps, ref) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const renderHeader = () => {
    const {
      signUpText = "SIGN UP",
      disableSignUp,
      signUpTextStyle,
      backArrowImageSource = backArrowImage,
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
    const { loginTitleText = "Log In", loginTextStyle } = props;
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
      usernamePlaceholder = "john_doe@example.com",
      onUserNameChangeText,
      passwordPlaceholder = "• • • • • • • •",
      onPasswordChangeText,
      passwordTextFieldStyle,
    } = props;
    return (
      <View style={styles.textFieldContainer}>
        <TextField
          {...props}
          placeholder={usernamePlaceholder}
          textFieldStyle={usernameTextFieldStyle}
          onChangeText={setUsername}
        />
        <View style={styles.passwordTextFieldContainer}>
          <TextField
            width="70%"
            secureTextEntry
            {...props}
            placeholder={passwordPlaceholder}
            textFieldStyle={passwordTextFieldStyle}
            onChangeText={setPassword}
          />
        </View>
        {isSignUp
          ? renderRepasswordContainer()
          : renderForgotPassword()}
      </View>
    );
  };

  const renderRepasswordContainer = () => {
    const {
      passwordPlaceholder = "• • • • • • • •",
      onRepasswordChangeText,
      passwordTextFieldStyle,
    } = props;
    return (
      <View style={styles.passwordTextFieldContainer}>
        <TextField
          width="70%"
          secureTextEntry
          {...props}
          placeholder={passwordPlaceholder}
          textFieldStyle={passwordTextFieldStyle}
          onChangeText={onRepasswordChangeText}
        />
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

  const renderClassicLoginButton = () => {
    const {
      loginText = "Let's cook!",
      loginButtonBackgroundColor,
      loginButtonShadowColor = "#58a13f",
      loginButtonSpinnerVisibility,
      spinnerSize,
      spinnerType,
      loginButtonSpinnerColor,
      onLoginPress,
    } = props;
    return (
      <SocialButton
        {...props}
        text={loginText}
        onPress={onLoginPress}
        shadowColor={loginButtonShadowColor}
        backgroundColor={loginButtonBackgroundColor}
        isSpinner={loginButtonSpinnerVisibility}
        spinnerSize={spinnerSize}
        spinnerType={spinnerType}
        spinnerColor={loginButtonSpinnerColor}
      />
    );
  };

  const renderFacebookLoginButton = () => {
    const {
      onFacebookLoginPress,
      facebookSpinnerVisibility,
      spinnerSize,
      spinnerType,
      facebookSpinnerColor,
    } = props;
    return (
      <View style={styles.socialLoginButtonContainer}>
        <SocialButton
          width={60}
          height={60}
          shadowColor="#2f4a82"
          backgroundColor="#4267B2"
          isSpinner={facebookSpinnerVisibility}
          spinnerSize={spinnerSize}
          spinnerType={spinnerType}
          spinnerColor={facebookSpinnerColor}
          component={
            <Image source={facebookLogo} style={styles.facebookImageStyle} />
          }
          onPress={() => onFacebookLoginPress && onFacebookLoginPress()}
        />
      </View>
    );
  };

  const renderAppleLoginButton = () => {
    const {
      spinnerSize,
      spinnerType,
      appleSpinnerColor,
      onAppleLoginPress,
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

  const renderTwitterLoginButton = () => {
    const {
      onTwitterLoginPress,
      twitterSpinnerVisibility,
      spinnerSize,
      spinnerType,
      twitterSpinnerColor,
    } = props;
    return (
      <View style={styles.socialLoginButtonContainer}>
        <SocialButton
          width={60}
          height={60}
          backgroundColor="#1DA1F2"
          shadowColor="#1a7aab"
          isSpinner={twitterSpinnerVisibility}
          spinnerSize={spinnerSize}
          spinnerType={spinnerType}
          spinnerColor={twitterSpinnerColor}
          component={
            <Image
              source={twitterLogo}
              style={styles.socialLoginButtonImageStyle}
            />
          }
          onPress={() => onTwitterLoginPress && onTwitterLoginPress()}
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

  const renderDiscordLoginButton = () => {
    const {
      spinnerSize,
      spinnerType,
      discordSpinnerColor,
      onDiscordLoginPress,
      discordSpinnerVisibility,
    } = props;
    return (
      <View style={styles.socialLoginButtonContainer}>
        <SocialButton
          width={60}
          height={60}
          backgroundColor="#7289DA"
          shadowColor="#4e5e96"
          isSpinner={discordSpinnerVisibility}
          spinnerSize={spinnerSize}
          spinnerType={spinnerType}
          spinnerColor={discordSpinnerColor}
          component={
            <Image
              source={discordLogo}
              style={styles.socialLoginButtonImageStyle}
            />
          }
          onPress={() => onDiscordLoginPress && onDiscordLoginPress()}
        />
      </View>
    );
  };

  const renderSocialButtons = () => {
    const {
      enableFacebookLogin,
      enableTwitterLogin,
      enableGoogleLogin,
      enableDiscordLogin,
      enableAppleLogin,
    } = props;
    return (
      <View style={styles.socialButtonsContainer}>
        {renderClassicLoginButton()}
        {enableFacebookLogin && renderFacebookLoginButton()}
        {enableTwitterLogin && renderTwitterLoginButton()}
        {enableAppleLogin && renderAppleLoginButton()}
        {enableGoogleLogin && renderGoogleLoginButton()}
        {enableDiscordLogin && renderDiscordLoginButton()}

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

  useImperativeHandle(ref, () => ({
    getParams: () => ({username, password})
  }));

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
});

export default SocialLoginScreen;