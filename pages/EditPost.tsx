import React, {useEffect, useState} from 'react';
import {View, TextInput, StyleSheet, Image, Pressable, Keyboard} from 'react-native';
import {Button, IconButton} from 'react-native-paper';
import AvatarPicker from "../components/AvatarPicker/PostPicker";
import Icon from 'react-native-vector-icons/Feather';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import requestApi from '../utils/request';
import { StackNavigationProps } from '../App';

const EditPost = ({ route, navigation }: StackNavigationProps) => {
  const [showAvatarOption, setShowAvatarOption] = useState(false);
  const [text, setText] = useState('');
  const [image, setImage] = useState([] as string[]);
  async function fetchData(){
    const res = await requestApi('get', `/Memories/${route.params?.postId}`, null, true, 'get memories失败');
    if (res.code == 0) {
      setText(res.data.postContent);
      setImage(res.data.postPhoto);
    }
  }
  async function handlePost() {
    // 发送text和image到服务器
    console.log('发布');
    const res = await requestApi('put', '/updateMemory/{postId}', { postContent: text, photoUrl: image }, true, '修改失败')
    if (res.code == 0) {
      navigation.goBack();
    }
  };
  useEffect(()=>{
    fetchData()
  },[])
  function cancelAvatarOption() {
    return (
      setShowAvatarOption(false)
    );
  }

  function changeImage(uri: string[]) {
    setImage(current => current.concat(uri))
  }

  return (
    <KeyboardAwareScrollView style={styles.container} onScrollToTop={Keyboard.dismiss}>
      <TextInput
        style={styles.input}
        placeholder="说点什么吧..."
        value={text}
        onChangeText={setText}
        multiline
        scrollEnabled={false}
        autoFocus={false}
      />
      <View style={{flexDirection: 'row', flexWrap: 'wrap', position: 'relative', paddingBottom: 10}}>
        {image.length != 0 && image.map((item) =>
          <View>
            <Image source={{ uri: item }} style={styles.image} />
            <Pressable
              style={{ position: 'absolute', top: 5, right: 5, margin: 0 }}
              onPress={() => setImage(current => current.filter((i) => {
                return i != item
              }))}>
              <Icon name={'x'} style={{ fontSize: 15, color: 'white', backgroundColor: 'grey', opacity: 0.6 }} />
            </Pressable>
          </View>
        )}
        {image.length < 9 && <IconButton
          icon={'plus'}
          mode='contained'
          style={{ borderRadius: 0, margin: 5, width: 112, height: 112 }}
          size={50}
          onPress={() => setShowAvatarOption(true)}
        />}
      </View>
      <View style={{paddingBottom: 100}} >
      <Button onPress={handlePost} mode='contained'>发送</Button>
      </View>
      <AvatarPicker showAvatarOption={showAvatarOption} onBackdropPress={cancelAvatarOption} setImage={changeImage}/>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    paddingBottom: 300,
    borderColor: '#fff'
  },
  input: {
    minHeight: 140,
    borderColor: 'transparent',
    borderWidth: 1,
    padding: 10,
    fontSize: 18,
  },
  image: {
    borderRadius: 0,
    margin: 5,
    width: 112,
    height: 112
  },
});

export default EditPost;