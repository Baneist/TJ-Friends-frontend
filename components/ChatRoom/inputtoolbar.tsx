import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, KeyboardEvent, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import requestApi, { BASE_URL } from '../../utils/request';
import { GiftedChat } from 'react-native-gifted-chat';
import uploadImage from '../../utils/uploadImage';


function RoomInputToolbar(props) {
  const [text, setText] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  function handleSend() {
    if (text.length > 0) {
      
      async function sendMessage() {
        const res = await requestApi('post', '/sendRoomMessage', { image: '' , text: text.trim() , roomId: props.RoomId }, true, '发送失败');
        const message = {
          _id: res.data.id,
          text: text.trim(),
          createdAt: new Date(),
          user: props.user,
          isRevoke: false,
        };
        console.log(message._id, 'send')
      }
      sendMessage()
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
      const image = result.assets[0].uri
      console.log(image, '1')
      async function sendMessage() {
        const imageRes = await uploadImage(image);
        console.log(BASE_URL + imageRes.data.urle, '2')
        const res = await requestApi('post', '/sendRoomMessage', { image: BASE_URL + imageRes.data.url , text: '' , roomId: props.RoomId }, true, '发送失败');
        const message = {
          _id: res.data.id,
          text: '',
          image: BASE_URL + imageRes.data.url,
          createdAt: new Date(),
          user: props.user,
          isRevoke: false,
        };
      }
      sendMessage()
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
        const image = result.assets[0].uri;
        
        console.log(image, '1')
        async function sendMessage() {
          const imageRes = await uploadImage(image);
          console.log(BASE_URL + imageRes.data.urle, '2')
          const res = await requestApi('post', '/sendRoomMessage', { image: BASE_URL + imageRes.data.urle , text: '' , roomId: props.RoomId }, true, '发送失败');
          const message = {
            _id: res.data.id,
            text: '',
            image: BASE_URL + imageRes.data.urle,
            createdAt: new Date(),
            user: props.user,
            isRevoke: false,
          };
        }
        sendMessage()
      }
  }

  useEffect(() => {
    // 注册键盘事件监听
    Keyboard.addListener('keyboardDidShow', onKeyboardShow);
    Keyboard.addListener('keyboardDidHide', onKeyboardHide);

    return () => {
      // 取消键盘事件监听
      Keyboard.removeAllListeners('keyboardDidShow');
      Keyboard.removeAllListeners('keyboardDidHide');
    };
  }, []);

  function onKeyboardShow(e: KeyboardEvent) {
    console.log('键盘弹出', e.endCoordinates.height);
    setKeyboardHeight(e.endCoordinates.height);
    // 在键盘弹出时执行的操作，例如调整组件布局
    // 可以使用 e.endCoordinates.height 获取键盘的高度
  }

  function onKeyboardHide(e: KeyboardEvent) {
    console.log('键盘收起');
    setKeyboardHeight(0);
    // 在键盘收起时执行的操作，例如恢复组件布局
  }

  const containerStyle = keyboardHeight > 0 ? styles.KeyContainer : styles.container;

  return (
    <KeyboardAvoidingView style={containerStyle} behavior="padding">
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
    bottom: Platform.OS == 'ios'? -20 : 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 10,
    paddingBottom: 40,
    paddingTop: 5,
    elevation: 2,
  },
  KeyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    bottom: Platform.OS == 'ios'? -20 : 260,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 10,
    paddingBottom: 40,
    paddingTop: 5,
    elevation: 2,
  },
  textInput: {
    flex: 1,
    height:40,
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

export default RoomInputToolbar;
