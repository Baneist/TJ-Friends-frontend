import React from 'react';
import { View, StatusBar, UIManager, Platform } from 'react-native';
import LoginScreen from "./pages/LoginScreen";
import MainScreen from './pages/Main';
import TextInput from 'react-native-text-input-interactive';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';



type RootStackParamList = {
  Home: undefined, // undefined because you aren't passing any params to the home screen
  Login: undefined,
  Signup: undefined,
  Profile: { name: string }; 
};
const Stack = createStackNavigator<RootStackParamList>();

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Home'
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const App = () => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [repassword, setRepassword] = React.useState('');

  const renderSignupScreen = ({ navigation }: Props) => (
    <LoginScreen
      style={{ alignItems: 'center', justifyContent: 'center' }}
      logoImageSource={require('./assets/logo-example.png')}
      onLoginPress={() => {navigation.replace('Login')}}
      onSignupPress={() => {navigation.replace('Login')}}
      onEmailChange={setUsername}
      loginButtonText={'Create an account'}
      disableSignup
      textInputChildren={
        <View style={{ marginTop: 16 }}>
          <TextInput
            placeholder="Re-Password"
            secureTextEntry
            onChangeText={setRepassword}
          />
        </View>
      }
      onPasswordChange={setPassword}
    />
  );

  const renderLoginScreen = ({ navigation }: Props) => (
    <LoginScreen
      style={{ alignItems: 'center', justifyContent: 'center' }}
      logoImageSource={require('./assets/logo-example.png')}
      onLoginPress={() => {navigation.replace('Home')}}
      onSignupPress={() => {navigation.replace('Home')}}
      onEmailChange={setUsername}
      onPasswordChange={setPassword}
      enablePasswordValidation
    />
  );

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Signup" component={renderSignupScreen} />
        <Stack.Screen name="Login" component={renderLoginScreen} />
        <Stack.Screen name="Home" component={MainScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
