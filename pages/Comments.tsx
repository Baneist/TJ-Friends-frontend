import React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function CommentScreen({onBackPress}:{onBackPress:()=>void}) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Comment screen</Text>
        <Button title="Go back" onPress={onBackPress} />
      </View>
    );
  }
export default CommentScreen;