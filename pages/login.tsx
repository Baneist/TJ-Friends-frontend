// Import React and React Native components
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

// Import Ionic components
import {
  IonApp,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonInput,
  IonItem,
  IonLabel,
  IonButton,
} from '@ionic/react';

// Define a custom component for the login page
const LoginPage = () => {
  // Use state hooks to store the username and password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Define a function to handle the login button press
  const handleLogin = () => {
    // Perform some validation and authentication logic here
    // For simplicity, we just alert the username and password
    alert(`Username: ${username}, Password: ${password}`);
  };

  // Return the JSX code for rendering the login page
  return (
    <IonApp>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <View style={styles.container}>
          <Text style={styles.title}>Welcome to Ionic React Native App</Text>
          <IonItem>
            <IonLabel position="floating">Username</IonLabel>
            <IonInput
              value={username}
              onIonChange={(e) => setUsername(e.detail.value as string)}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Password</IonLabel>
            <IonInput
              value={password}
              type="password"
              onIonChange={(e) => setPassword(e.detail.value as string)}
            />
          </IonItem>
          <IonButton expand="block" color="primary" onClick={handleLogin}>
            Login
          </IonButton>
        </View>
      </IonContent>
    </IonApp>
  );
};

// Define some styles for the login page
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
});

// Export the login page component
export default LoginPage;