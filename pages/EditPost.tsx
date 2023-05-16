import React, {useEffect, useState} from 'react';
import {View, TextInput, StyleSheet, Image, Pressable, Keyboard, Alert, Switch,Text, Dimensions, Platform} from 'react-native';
import {Button, Divider, IconButton,List} from 'react-native-paper';
import AvatarPicker from "../components/AvatarPicker/PostPicker";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import requestApi, { BASE_URL } from '../utils/request';
import { StackNavigationProps } from '../App';
import {styles} from './PostPage'
import Modal from 'react-native-modal';
import mime from 'mime';
import { readFile } from './userInfo/EditInfo/EditProfile';

const EditPost = ({ route, navigation }: StackNavigationProps) => {
  const { width, height } = Dimensions.get("screen");

  const [anonymous, setAnonymous] = useState(false);
  const [showAvatarOption, setShowAvatarOption] = useState(false);
  const [text, setText] = useState('');
  const [image, setImage] = useState([] as string[]);
  const [otext, setoText] = useState('');
  const [oimage, setoImage] = useState([] as string[]);
  const [opms, setoPms] = useState('');
  const [oanony, setoAnony] = useState(false);
  const[pms,setPms]=useState('公开');
  const[pmskey,setKey]=useState(0);
  const [clicked,setClick]=useState(false);
  async function fetchData(){
    console.log(route.params?.postId)
    const res = await requestApi('get', `/Memories/${route.params?.postId}`, null, true, 'get memories失败');
    if (res.code == 0) {
      setText(res.data.postContent);
      setImage(res.data.postPhoto);
      setoText(res.data.postContent);
      setoImage(res.data.postPhoto);
      setKey(res.data.pms);
      setoAnony(res.data.isAnonymous)
      setAnonymous(res.data.isAnonymous);
      if(res.data.pms==0){
        setPms('公开');
        setoPms('公开');
      }
      else if(res.data.pms==1){
        setPms('好友圈');
        setoPms('好友圈');
      }
      else if(res.data.pms==2){
        setPms('仅粉丝');
        setoPms('仅粉丝');
      }
      else{
        setPms('仅自己可见');
        setoPms('仅自己可见');
      }

      let tmp = [0, 0, 0, 0];
      tmp[res.data.pms] = 1;
      setopct(tmp);
    }
  }
  async function handlePost() {
    // 发送text和image到服务器
    for (let index in image) {
      const blob = await (await fetch(image[index])).blob();
      const fileType = mime.getType(image[index]);
      const fileName = 'image.' + mime.getExtension(fileType!);

      const imageRes = await requestApi('post', '/uploadImage', { file: await readFile(blob), fileName }, true, '上传图片失败');
      if (imageRes.code === 0) {
      image[index]=BASE_URL+imageRes.data.url;
      }
    }
    console.log(image);
    const res = await requestApi('put', `/updateMemory/${route.params?.postId}`, { postContent: text, photoUrl: image,pms:pmskey,isAnonymous:anonymous }, true, '修改失败')
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

  const hasUnsavedChanges = !(text===otext&&image===oimage&&pms===opms&&anonymous==oanony);

  React.useEffect(
    () =>{
      const onbackpage = navigation.addListener('beforeRemove', (e) => {
        if (!hasUnsavedChanges||clicked) {
          // If we don't have unsaved changes, then we don't need to do anything
          return;
        }

        // Prevent default behavior of leaving the screen
        e.preventDefault();

        // Prompt the user before leaving the screen
        Alert.alert(
          '',
          '放弃此次编辑?',
          [
            {
              text: "放弃",
              style: 'destructive',
              // This will continue the action that had triggered the removal of the screen
              onPress: () => navigation.dispatch(e.data.action)
            },
            {
              text: '取消',
              style: 'cancel',
            },
          ]
        );
      });
      return onbackpage;
    },[navigation, hasUnsavedChanges,clicked]
  );
  
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
              <Icon name={'window-close'} style={{ fontSize: 15, color: 'white', backgroundColor: 'grey', opacity: 0.6 }} />
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
      <View style={{
          backgroundColor: '#fff',
          paddingBottom: 20,
          paddingTop: 20,
          flexDirection: 'column',
          width: width
        }}>
          <Divider />
          <List.Item title='谁可以看'
            left={() => <Icon name='account-outline' size={24} style={{ marginLeft: 15 }} />}
            right={() => <Text style={{ paddingTop: 3, color: 'indigo', paddingRight: 5 }}>{pms}</Text>}
            onPress={toggleMenu}
          />
          <Divider />
          <List.Item title='匿名'
            left={() => <Icon name='ninja' size={24} style={{ marginLeft: 15 }} />}
            right={() => <Switch
              style={{marginTop:Platform.OS == 'ios' ?-3:-10,marginBottom:Platform.OS == 'ios' ?-3:-10}}
              value={anonymous}
              onValueChange={() => setAnonymous(!anonymous)}
            />}
          />
          <Divider />
        </View>
      <View style={{paddingBottom: 100}} >
      <Button disabled={text.length==0&&image.length==0} onPress={()=>{setClick(true);handlePost();}} mode='contained'>重新发送</Button>
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
