import React, { forwardRef, useImperativeHandle } from "react";
import {
  Image,
  ImageStyle,
  StatusBar,
  SafeAreaView,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  LayoutAnimation,
} from "react-native";
import TextInput, {
  IInteractiveTextInputProps,
} from "react-native-text-input-interactive";
/**
 * ? Local Imports
 */
import styles from "./Screen.style";
import SocialButton from "../components/social-button/SocialButton";
import useStateWithCallback from "../helpers/useStateWithCallback";
import passwordValidator from "../helpers/passwordValidator";
import Tooltip from "../components/tooltip/Tooltip";

const usernameValidator = (username: string) => {
  return /^[A-Za-z0-9]{5,16}$/.test(username);
};

const dummyFunction = () => { };

export interface ITextRef {
  getText: () => { username: string, password: string };
}

export interface ILoginScreenProps {
  signupText?: string;
  disableDivider?: boolean;
  logoImageSource: any;
  disableSocialButtons?: boolean;
  usernamePlaceholder?: string;
  passwordPlaceholder?: string;
  disableSignup?: boolean;
  disablePasswordInput?: boolean;
  loginButtonText?: string;
  disableUsernameValidation?: boolean;
  enablePasswordValidation?: boolean;
  disableUsernameTooltip?: boolean;
  disablePasswordTooltip?: boolean;
  style?: StyleProp<ViewStyle>;
  dividerStyle?: StyleProp<ViewStyle>;
  logoImageStyle?: StyleProp<ImageStyle>;
  textInputContainerStyle?: StyleProp<ViewStyle>;
  loginButtonStyle?: StyleProp<ViewStyle>;
  loginTextStyle?: StyleProp<TextStyle>;
  signupStyle?: StyleProp<ViewStyle>;
  signupTextStyle?: StyleProp<TextStyle>;
  usernameTextInputProps?: IInteractiveTextInputProps;
  passwordTextInputProps?: IInteractiveTextInputProps;
  children?: any;
  TouchableComponent?: any;
  passwordContentTooltip?: React.ReactNode;
  usernameContentTooltip?: React.ReactNode;
  customSocialLoginButtons?: React.ReactNode;
  customLoginButton?: React.ReactNode;
  customSignupButton?: React.ReactNode;
  customTextInputs?: React.ReactNode;
  textInputChildren?: React.ReactNode;
  customLogo?: React.ReactNode;
  customDivider?: React.ReactNode;
  onLoginPress?: () => void;
  onSignupPress?: () => void;
  onUsernameChange?: (username: string) => void;
  onPasswordChange?: (password: string) => void;
  onFacebookPress?: () => void;
  onTwitterPress?: () => void;
  onApplePress?: () => void;
  onDiscordPress?: () => void;
  onEyePress?: () => void;
}

const LoginScreen = React.forwardRef<ITextRef, ILoginScreenProps>(({
  style,
  dividerStyle,
  logoImageStyle,
  loginTextStyle,
  loginButtonStyle,
  signupTextStyle,
  signupStyle,
  textInputContainerStyle,
  signupText = "Create an account",
  disableDivider,
  logoImageSource,
  onLoginPress,
  disableSocialButtons,
  disablePasswordInput = false,
  loginButtonText = "Login",
  onSignupPress,
  onUsernameChange,
  onPasswordChange,
  onFacebookPress = dummyFunction,
  onTwitterPress = dummyFunction,
  onApplePress = dummyFunction,
  onDiscordPress = dummyFunction,
  usernamePlaceholder = "Username",
  passwordPlaceholder = "Password",
  disableSignup = false,
  customSocialLoginButtons,
  customLogo,
  customTextInputs,
  textInputChildren,
  customLoginButton,
  customSignupButton,
  customDivider,
  usernameTextInputProps,
  passwordTextInputProps,
  disableUsernameValidation = false,
  enablePasswordValidation = false,
  disableUsernameTooltip = false,
  disablePasswordTooltip = false,
  usernameContentTooltip,
  passwordContentTooltip,
  TouchableComponent = TouchableOpacity,
  onEyePress,
  children,
}, ref) => {
  const [isPasswordVisible, setPasswordVisible] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [isUsernameTooltipVisible, setUsernameTooltipVisible] =
    useStateWithCallback(false);
  const [isPasswordTooltipVisible, setPasswordTooltipVisible] =
    useStateWithCallback(false);

  const handleUsernameChange = (text: string) => {
    try {
      // console.log(text);
      isUsernameTooltipVisible && setUsernameTooltipVisible(false);
      setUsername(text);
      // console.log(onUsernameChange)
      // onUsernameChange?.(text);
    } catch (e) {
      console.log(e);
    }
  };

  const handlePasswordChange = (text: string) => {
    isPasswordTooltipVisible && setPasswordTooltipVisible(false);
    setPassword(text);
    // onPasswordChange?.(text);
  };

  const handleEyePress = () => {
    setPasswordVisible((oldValue) => !oldValue);
    onEyePress?.();
  };

  const handleUsernameValidation = () => {
    if (disableUsernameValidation) {
      handlePasswordValidation();
      onUsernameChange?.(username);
      return;
    }

    if (usernameValidator(username)) {
      !disableUsernameTooltip && setUsernameTooltipVisible(false);
      handlePasswordValidation();
      onUsernameChange?.(username);
      return;
    } else {
      LayoutAnimation.spring();
      !disableUsernameTooltip && setUsernameTooltipVisible(true);
      onUsernameChange?.(username);
    }
  };

  const handlePasswordValidation = () => {
    if (isUsernameTooltipVisible) {
      return;
    }
    if (!enablePasswordValidation) {
      onPasswordChange?.(password);
      return;
    }
    if (enablePasswordValidation && passwordValidator(password)) {
      !disablePasswordTooltip && setPasswordTooltipVisible(false);
      onPasswordChange?.(password);
      return;
    } else {
      LayoutAnimation.spring();
      !disableUsernameTooltip && setUsernameTooltipVisible(false);
      !disablePasswordTooltip && setPasswordTooltipVisible(true);
      onPasswordChange?.(password);
    }
  };

  const renderLogo = () =>
    customLogo || (
      <Image
        resizeMode="contain"
        source={logoImageSource}
        style={[styles.logoImageStyle, logoImageStyle]}
      />
    );

  const renderUsernameInput = () => {
    const tooltipContent = () =>
      usernameContentTooltip || (
        <View style={styles.usernameTooltipContainer}>
          <Text style={styles.usernameTooltipTextStyle}>
            That{" "}
            <Text style={styles.usernameTooltipRedTextStyle}>username</Text>{" "}
            doesn't look right
          </Text>
        </View>
      );
    return (
      <View style={styles.usernameTextInputContainer}>
        <>
          {!disableUsernameTooltip && isUsernameTooltipVisible && (
            <Tooltip>{tooltipContent()}</Tooltip>
          )}
          <TextInput
            placeholder={usernamePlaceholder}
            onChangeText={handleUsernameChange}
            autoCapitalize="none"
            onFocus={() => setUsernameTooltipVisible(false)}
            {...usernameTextInputProps}
          />
        </>
      </View>
    );
  };

  const renderPasswordInput = () => {
    const eyeIcon = isPasswordVisible
      ? require("../assets/eye.png")
      : require("../assets/eye-off.png");

    const renderTooltipContent = () =>
      passwordContentTooltip || (
        <View style={styles.passwordTooltipContainer}>
          <Text style={styles.passwordTooltipTextStyle}>
            Your{" "}
            <Text style={styles.passwordTooltipRedTextStyle}>password</Text>
            {" "}is too simple
          </Text>
        </View>
      );

    return (
      !disablePasswordInput && (
        <View style={styles.passwordTextInputContainer}>
          {!disablePasswordTooltip && isPasswordTooltipVisible && (
            <Tooltip>{renderTooltipContent()}</Tooltip>
          )}
          <TextInput
            placeholder={passwordPlaceholder}
            secureTextEntry={!isPasswordVisible}
            onChangeText={handlePasswordChange}
            enableIcon
            iconImageSource={eyeIcon}
            autoCapitalize="none"
            onFocus={() => {
              setPasswordTooltipVisible(false);
            }}
            onIconPress={handleEyePress}
            {...passwordTextInputProps}
          />
        </View>
      )
    );
  };

  const renderTextInputContainer = () => {
    return (
      customTextInputs || (
        <View style={[styles.textInputContainer, textInputContainerStyle]}>
          {renderUsernameInput()}
          {renderPasswordInput()}
          {textInputChildren}
        </View>
      )
    );
  };

  const renderLoginButton = () =>
    customLoginButton || (
      <TouchableComponent
        style={[styles.loginButtonStyle, loginButtonStyle]}
        onPress={() => {
          handleUsernameValidation();
          onLoginPress?.();
        }}
      >
        <Text style={[styles.loginTextStyle, loginTextStyle]}>
          {loginButtonText}
        </Text>
      </TouchableComponent>
    );

  const renderSignUp = () =>
    customSignupButton ||
    (!disableSignup && (
      <TouchableComponent
        style={[styles.signupStyle, signupStyle]}
        onPress={onSignupPress}
      >
        <Text style={[styles.signupTextStyle, signupTextStyle]}>
          {signupText}
        </Text>
      </TouchableComponent>
    ));

  const renderDivider = () =>
    customDivider ||
    (!disableDivider && <View style={[styles.dividerStyle, dividerStyle]} />);

  const renderDefaultSocialLoginButtons = () =>
    !disableSocialButtons ? (
      <>
        <SocialButton
          text="Continue with Apple"
          style={styles.socialButtonStyle}
          TouchableComponent={TouchableComponent}
          imageSource={require("../assets/apple.png")}
          onPress={onApplePress}
        />
        <SocialButton
          text="Continue with Discord"
          style={styles.socialButtonStyle}
          TouchableComponent={TouchableComponent}
          textStyle={styles.discordSocialButtonTextStyle}
          imageSource={require("../assets/discord.png")}
          onPress={onDiscordPress}
        />
      </>
    ) : null;

  useImperativeHandle(ref, () => ({
    getText: () => ({ username, password })
  }));

  return (
    <SafeAreaView style={[styles.container, style]}>
      {/* <StatusBar barStyle="dark-content" /> */}
      {renderLogo()}
      {renderTextInputContainer()}
      {renderLoginButton()}
      {renderSignUp()}
      {renderDivider()}
      <View style={styles.socialLoginContainer}>
        {customSocialLoginButtons || renderDefaultSocialLoginButtons()}
      </View>
      {children}
    </SafeAreaView>
  );
});

export default LoginScreen;
