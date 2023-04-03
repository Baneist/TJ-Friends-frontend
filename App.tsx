import React from 'react';
import { View, StyleSheet, UIManager, Platform } from 'react-native';
import LoginScreen from "./pages/LoginScreen";
import MainScreen from './pages/Main';
import TextInput from 'react-native-text-input-interactive';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';



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

  const RenderSignupScreen = ({ navigation }: Props) => (
    <LoginScreen
      style={{ flex: 1, justifyContent: 'center' }}
      logoImageSource={require('./assets/logo-example.png')}
      onLoginPress={() => { navigation.replace('Login') }}
      onSignupPress={() => { navigation.replace('Login') }}
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

  const RenderLoginScreen = ({ navigation }: Props) => (
    <LoginScreen
      style={{ flex: 1, justifyContent: 'center' }}
      logoImageSource={require('./assets/logo-example.png')}
      onLoginPress={() => { navigation.replace('Main') }}
      onSignupPress={() => { navigation.replace('Main') }}
      onEmailChange={setUsername}
      onPasswordChange={setPassword}
      enablePasswordValidation
    />
  );


  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Signup" component={RenderSignupScreen} />
        <Stack.Screen name="Login" component={RenderLoginScreen} />
        <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
