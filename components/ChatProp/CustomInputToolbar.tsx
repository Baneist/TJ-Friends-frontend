import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import EmojiPicker from 'react-native-emoji-selector';
import * as ImagePicker from 'expo-image-picker';


function CustomInputToolbar(props) {
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  function handleSend() {
    if (text.length > 0) {
      const message = {
        text: text.trim(),
        createdAt: new Date(),
        user: {
          _id: props.user._id,
          name: props.user.name,
        },
      };
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
      };

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
        };
        props.onSend([message]);
      }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePickImage} style={styles.button}>
        <MaterialIcons name="photo-library" size={24} color="#5A5A5A" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleTakePhoto} style={styles.button}>
        <MaterialIcons name="photo-camera" size={24} color="#5A5A5A" />
      </TouchableOpacity>
      <TextInput
        style={styles.textInput}
        placeholder="Type a message..."
        value={text}
        onChangeText={setText}
      />
      <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
        <MaterialIcons name="send" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
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
