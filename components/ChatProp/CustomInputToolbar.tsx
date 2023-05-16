import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import requestApi from '../../utils/request';


function CustomInputToolbar(props) {
  const [text, setText] = useState('');

  function handleSend() {
    if (text.length > 0) {
      const message = {
        text: text.trim(),
        createdAt: new Date(),
        user: {
          _id: props.user._id,
          name: props.user.name,
          avatar: props.user.avatar,
        },
        isRevoke: false,
      };
      async function sendMessage() {
        const res = await requestApi('post', '/chat/sendMessage', { image: '' , text: message.text , userId: props.ChatUser }, true, '发送失败');
      }
      sendMessage()
      props.onSend([message]);
      setText('');
    }
  }

  async function handlePickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('需要访问相册权限以选择图片！');
        return;
      }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const message = {
        image: result.assets[0].uri,
        createdAt: new Date(),
        user: {
          _id: props.user._id,
          name: props.user.name,
        },
        isRevoke: false,
      };
      async function sendMessage() {
        const res = await requestApi('post', '/chat/sendMessage', { image: message.image , text: '' , userId: props.ChatUser }, true, '发送失败');
      }
      sendMessage()
      props.onSend([message]);
    }
  }

  async function handleTakePhoto(){
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        alert('需要访问摄像头权限以拍摄图片！');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const message = {
          image: result.assets[0].uri,
          createdAt: new Date(),
          user: {
            _id: props.user._id,
            name: props.user.name,
          },
          isRevoke: false,
        };
        async function sendMessage() {
          const res = await requestApi('post', '/chat/sendMessage', { image: message.image , text: '' , userId: props.ChatUser }, true, '发送失败');
        }
        sendMessage()
        props.onSend([message]);
      }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <TouchableOpacity onPress={handlePickImage} style={styles.button}>
        <MaterialIcons name="photo-library" size={24} color="#5A5A5A" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleTakePhoto} style={styles.button}>
        <MaterialIcons name="photo-camera" size={24} color="#5A5A5A" />
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          value={text}
          onChangeText={setText}
          multiline
        />
      </View>
      <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
        <MaterialIcons name="send" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    elevation: 2,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  button: {
    padding: 5,
  },
  sendButton: {
    padding: 5,
    backgroundColor: '#C4C4C4',
    borderRadius: 50,
    marginRight: 5,
  },
});

export default CustomInputToolbar;
