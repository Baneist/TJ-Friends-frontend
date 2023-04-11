import React, { useState } from 'react';
import { View,  TextInput, StyleSheet, Image, Pressable } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import AvatarPicker from "../components/AvatarPicker/PostPicker";
import Icon from 'react-native-vector-icons/Feather';

const PostPage = () => {
  const [showAvatarOption, setShowAvatarOption] = useState(false);
  const [text, setText] = useState('');
  const [image, setImage] = useState([] as string[]);

  const handlePost = () => {
    // 发送text和image到服务器
    console.log('发布');
  };
  function cancelAvatarOption() {
    return (
      setShowAvatarOption(false)
    );
  }
  function changeImage(uri: string[]) {
    setImage(current => current.concat(uri))
  }
  function out() {
    return (
      console.log(image)
    );
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
        <View style={{ flexDirection: 'row',flexWrap:'wrap',position:'relative' }}>
            {image.length != 0 && image.map((item,index) =>
            <View>
              <Image source={{ uri: item }} style={styles.image} />
              <Pressable 
              style={{position:'absolute',top:5,right:5, margin:0}}
              onPress={()=>setImage(current=>current.filter((i)=>{return i!=item}))}>
                <Icon name={'x'} style={{fontSize:15,color:'white',backgroundColor:'grey',opacity:0.6}}/>
              </Pressable>
              </View>
            )}
          {image.length <9 &&<IconButton
            icon={'plus'}
            mode='contained'
            style={{ borderRadius: 0, margin: 5, width: 112, height: 112 }}
            size={50}
            onPress={() => setShowAvatarOption(true)}
          />}
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={handlePost} style={{ width: '97%' }} mode='contained'>发布</Button>
        </View>
      </View>
      <AvatarPicker showAvatarOption={showAvatarOption} onBackdropPress={cancelAvatarOption} setImage={changeImage} />
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
    height: 140,
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
