import React, {useEffect, useState} from 'react';
import {View, TextInput, StyleSheet, Image, Pressable, Keyboard} from 'react-native';
import {Button, IconButton,List} from 'react-native-paper';
import AvatarPicker from "../components/AvatarPicker/PostPicker";
import Icon from 'react-native-vector-icons/Feather';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import requestApi from '../utils/request';
import { StackNavigationProps } from '../App';
import {styles} from './PostPage'
import Modal from 'react-native-modal';

const EditPost = ({ route, navigation }: StackNavigationProps) => {
  const [showAvatarOption, setShowAvatarOption] = useState(false);
  const [text, setText] = useState('');
  const [image, setImage] = useState([] as string[]);
  const[pms,setPms]=useState('公开');
  const[pmskey,setKey]=useState(0);
  async function fetchData(){
    console.log(route.params?.postId)
    const res = await requestApi('get', `/Memories/${route.params?.postId}`, null, true, 'get memories失败');
    if (res.code == 0) {
      setText(res.data.postContent);
      setImage(res.data.postPhoto);
      setKey(res.pms);
      if(res.pms==0){
        setPms('公开');
      }
      else if(res.pms==1){
        setPms('好友圈');
      }
      else if(res.pms==2){
        setPms('仅粉丝');
      }
      else{
        setPms('仅自己可见');
      }
    }
  }
  async function handlePost() {
    // 发送text和image到服务器
    const res = await requestApi('put', `/updateMemory/${route.params?.postId}`, { postContent: text, photoUrl: image,pms:pmskey }, true, '修改失败')
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

  const [MenuVisible, setMenuVisible] = useState(false);
  const toggleMenu = () => {
    setMenuVisible(!MenuVisible);
  };

  const [opct, setopct] = useState([1, 0, 0, 0]);
  function Check(key: number) {
    if(key==0){
      setPms('公开');
      setKey(0);
    }
    else if(key==1){
      setPms('好友圈');
      setKey(1);
    }
    else if(key==2){
      setPms('仅粉丝');
      setKey(2);
    }
    else{
      setPms('仅自己可见');
      setKey(3);
    }
    let tmp = [0, 0, 0, 0];
    tmp[key] = 1;
    setopct(tmp);
    toggleMenu();
  }

  function SelectPms() {
    return (
      <View style={styles.menu}>
        <List.Section >
          <List.Subheader style={{fontSize:16}}>选择权限</List.Subheader>
          <List.Item title={'公开'}
            description="所有人可见"
            left={() => <Icon name='access-point' size={24} style={{ marginLeft: 15 }} />}
            right={() => <Icon name="check" size={20} style={{ opacity: opct[0], marginRight: -10, color: 'purple' }} />}
            onPress={()=>Check(0)}
          />
          <List.Item title={'好友圈'}
            description="相互关注好友可见"
            left={() => <Icon name='cards-heart-outline' size={24} style={{ marginLeft: 15 }} />}
            right={() => <Icon name="check" size={20} style={{ opacity: opct[1], marginRight: -10, color: 'purple' }} />}
            onPress={()=>Check(1)}
          />
          <List.Item title={'仅粉丝'}
              description="关注你的人可见"
              left={() => <Icon name='account-heart-outline' size={24} style={{ marginLeft: 15 }} />}
              right={() => <Icon name="check" size={20} style={{ opacity: opct[2], marginRight: -10, color: 'purple' }} />}
              onPress={()=>Check(2)}
          />
          <List.Item title={'仅自己可见'}
              left={() => <Icon name='lock-outline' size={24} style={{ marginLeft: 15 }} />}
              right={() => <Icon name="check" size={20} style={{ opacity: opct[3], marginRight: -10, color: 'purple' }} />}
              onPress={()=>Check(3)}
          />
        </List.Section>
      </View>

    );
  }

  return (
    <View>
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
      <Button onPress={handlePost} mode='contained'>重新发送</Button>
      </View>
      <AvatarPicker showAvatarOption={showAvatarOption} onBackdropPress={cancelAvatarOption} setImage={changeImage}/>
    </KeyboardAwareScrollView>
    <Modal
        isVisible={MenuVisible}
        onBackdropPress={toggleMenu}
        style={styles.modal}
      >
        <View>
          <SelectPms />

        </View>
      </Modal>
    </View>
  );
};

export default EditPost;
