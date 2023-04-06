import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Button, IconButton, Divider } from 'react-native-paper';
import Modal from 'react-native-modal';

const PostPage = () => {
  const [MenuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!MenuVisible);
  };
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const handleChoosePhoto = () => {
    launchImageLibrary({
      mediaType: 'photo',
      maxWidth: 1000,// 设置选择照片的大小，设置小的话会相应的进行压缩
      maxHeight: 1000,
      quality: 0.8,
      // videoQuality: 'low',
      // includeBase64: true
    }, res => {
      if (res.didCancel) {
        return false;
      }
      // 对获取的图片进行处理
    })
  };
  const handleTakePhoto = () => {
    launchCamera({
      mediaType: 'photo',
      maxWidth: 1000,// 设置选择照片的大小，设置小的话会相应的进行压缩
      maxHeight: 1000,
      quality: 0.8,
      // videoQuality: 'low',
      // includeBase64: true
    }, res => {
      if (res.didCancel) {
        return false;
      }
      // 对获取的图片进行处理
    })
  };

  const handlePost = () => {
    // 发送text和image到服务器
    console.log('发布');
  };

  return (
    <View>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="说点什么吧..."
          value={text}
          onChangeText={setText}
          multiline
        />
        {image && (
          <Image source={image} style={styles.image} />
        )}
        <IconButton
          icon={'plus'}
          mode='contained'
          style={{ borderRadius: 0, margin: 10, width: 110, height: 110 }}
          size={50}
          onPress={toggleMenu}
        />
        <View style={styles.buttonContainer}>
          <Button onPress={handlePost} style={{ width: '97%' }} mode='contained'>发布</Button>
        </View>
      </View>
      <Modal
        isVisible={MenuVisible}
        onBackdropPress={toggleMenu}
        style={styles.modal}
      >
        <View style={styles.menu}>
          <Button style={{ height: 50 }} onPress={handleTakePhoto} >拍摄</Button>
          <Divider />
          <Button style={{ height: 50, paddingTop: 5 }} onPress={handleChoosePhoto} >从手机相册选择</Button>
          <View style={{ margin: 5 }} />
          <Button style={{ height: 50, paddingTop: 10 }} onPress={toggleMenu} >取消</Button>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  input: {
    height: 100,
    borderColor: 'transparent',
    borderWidth: 1,
    padding: 10,
    fontSize: 18,
  },
  image: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  menu: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
});

export default PostPage;
