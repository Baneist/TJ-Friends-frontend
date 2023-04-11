import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image } from 'react-native';
import { Button, IconButton, Divider } from 'react-native-paper';
import AvatarPicker from "../components/AvatarPicker/PostPicker";

const PostPage = () => {
  const [showAvatarOption, setShowAvatarOption] = useState(false);
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);

  const handlePost = () => {
    // 发送text和image到服务器
    console.log('发布');
  };
  function cancelAvatarOption(){
    setShowAvatarOption(false);
  }
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
          onPress={()=>setShowAvatarOption(true)}
        />
        <View style={styles.buttonContainer}>
          <Button onPress={handlePost} style={{ width: '97%' }} mode='contained'>发布</Button>
        </View>
      </View>
      <AvatarPicker showAvatarOption={showAvatarOption} onBackdropPress={cancelAvatarOption}/>
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
