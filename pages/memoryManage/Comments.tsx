import React, { useState, useEffect } from 'react';
import { Pressable, ScrollView, View, Image, Text, KeyboardAvoidingView, Platform, Dimensions, Keyboard, Alert } from 'react-native';
import { Card, TextInput, Button, Divider, IconButton } from 'react-native-paper';
import { styles, Share } from './Memories'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageViewer from 'react-native-image-zoom-viewer'

import Modal from 'react-native-modal';
import { StackNavigationProps } from '../../App';
import requestApi from '../../utils/request';
import { useFocusEffect } from '@react-navigation/native';
import { IImageInfo } from 'react-native-image-zoom-viewer/built/image-viewer.type';

interface CardProps {
  clickAvatar?: () => void,
  content?: any,
  id?: any,
  navigation?: any,
  onDelete?: () => void
}

function UserPhoto(props: CardProps) {
  return (
    <Pressable onPress={props.clickAvatar}>
      <Image source={{ uri: props.content.isAnonymous ? "https://picsum.photos/200" : props.content.userAvatar }} style={styles.userphoto} />
    </Pressable>
  );
}

function Like(props: CardProps) {
  const [likeNum, setLike] = useState(props.content.likeNum);
  const [isLiked, setIsLiked] = useState(props.content.isLiked);
  useEffect(() => {
    setLike(props.content.likeNum);
    setIsLiked(props.content.isLiked);
  }, [props.content.likeNum, props.content.isLiked]);

  async function handleClick() {
    const res = await requestApi('get', `/updateLikeMemory/${props.id}`, null, true, '动态点赞失败');
    if (res.code === 0) {
      setLike(res.data.likeNum);
      setIsLiked(res.data.isLiked);
    }
  };

  const clickHeart =
    <Icon size={18} name={isLiked ? 'heart' : 'heart-outline'} />;
  return (
    <Button onPress={handleClick} style={{ flexDirection: 'row' }}>
      {clickHeart}
      {likeNum != '0' && <Text style={{ fontSize: 17, fontWeight: '400' }}> {likeNum}</Text>}
    </Button>
  );
}

function Thumb(props: CardProps) {
  const [likeNum, setLike] = useState(props.content.likeNum);
  const [isLiked, setIsLiked] = useState(props.content.isLiked);
  useEffect(() => {
    setLike(props.content.likeNum);
    setIsLiked(props.content.isLiked);
  }, [props.content.likeNum, props.content.isLiked]);

  async function handleClick() {
    const res = await requestApi('get', `/updateLikeComment/${props.content.commentId}`, null, true, '评论点赞失败');
    if (res.code == 0) {
      setLike(res.data.likeNum);
      setIsLiked(res.data.isLiked);
    }
  };

  const thumb =
    <View style={{ flexDirection: 'row' }}>
      <Icon size={17} name={isLiked ? 'thumb-up' : 'thumb-up-outline'} />
      {likeNum != '0' && <Text style={{ paddingLeft: 5 }}>{likeNum}</Text>}
    </View>;

  return (
    <Pressable
      style={{ marginRight: 20 }}
      onPress={handleClick}
      hitSlop={2}
    >
      {thumb}
    </Pressable>
  );
}

const dd = {
  likeNum: "51",
  repoNum: "46",
  userName: "康霞",
  postTime: "2001-12-18 05:34:08",
  userAvatar: "http://dummyimage.com/100x100",
  postPhoto: [
    "http://dummyimage.com/400x400",
    "http://dummyimage.com/400x400",
    "http://dummyimage.com/400x400"
  ],
  postContent: "esse",
  comments: [
    {
      commentId: 15,
      userId: "21",
      likeNum: "57",
      userName: "周秀英",
      isLiked: 30,
      commentContent: "aute consectetur nisi nulla ad",
      userAvatar: "http://dummyimage.com/100x100",
      postTime: "1989-10-01 11:06:25"
    },
  ],
  isLiked: true,
  userId: "6",
  isAnonymous: false
}
const dc = [
  {
    commentId: 15,
    userId: "21",
    likeNum: "57",
    userName: "周秀英",
    isLiked: 30,
    commentContent: "aute consectetur nisi nulla ad",
    userAvatar: "http://dummyimage.com/100x100",
    postTime: "1989-10-01 11:06:25"
  }
]


function Comment({ route, navigation }: StackNavigationProps) {
  //获取屏幕宽高
  const { width, height } = Dimensions.get("screen");

  const [MenuVisible, setMenuVisible] = useState(false);
  const toggleDMenu = () => {
    setMenuVisible(!MenuVisible);
  };

  async function onMemoryDelete() {
    const res = await requestApi('get', `/deleteMemory/${id}`, null, true, '动态删除失败');
    if (res.code === 0)
      navigation.goBack();
  };

  function onEdit() {
    navigation.navigate('EditPost', { postId: id })
    setMenuVisible(!MenuVisible);
  }

  const [text, setText] = React.useState("");
  const id = route.params?.postId;
  const [senderAvatar, setAvatar] = useState("http://dummyimage.com/100x100");

  const [cid, setcid] = useState(0);
  const [MenuVisible1, setMenuVisible1] = useState(false);
  const [MenuVisible2, setMenuVisible2] = useState(false);
  const toggleMenu = (userId: string, cid: number) => {
    setcid(cid);
    if (global.gUserId === userId)
      setMenuVisible2(true);
    else
      setMenuVisible1(true);
  };
  const [detail, setDetail] = useState(dd);
  const [commentlist, setList] = useState(dc);
  const list = detail.postPhoto;
  const [state, setState] = useState(0);
  const [urls, setUrls] = useState([] as IImageInfo[]);
  const [fullview, setFullview] = useState(false);
  async function fetchData() {
    const res = await requestApi('get', `/Memories/${id}`, null, true, '获取动态失败');
    if (res.code == 0) {
      setDetail(res.data);
      setList(res.data.comments);
      let temp = [];
      for (let index in res.data.postPhoto) {
        temp.push({ url: res.data.postPhoto[index] });
      }
      setUrls(temp);
    }
    const info = await requestApi('get', `/profile/${global.gUserId}`, null, true, 'getProfile failed');
    if (info.code == 0) {
      setAvatar(info.data.userAvatar.info)
    }
  }

  useFocusEffect(React.useCallback(() => {
    fetchData()
    return () => {
    };
  }, [state]))
  function onDelete(commentID: number) {
    async function deleteComment() {
      const res = await requestApi('post', '/deleteComment', { comment_id: commentID }, true, '评论删除失败');
      if (res.code === 0) {
        setState(state + 1);
      }
    }
    deleteComment()
  };

  async function postComment() {
    const res = await requestApi('post', `/postComment`, { postId: id, content: text }, true, '评论发布失败');
    Keyboard.dismiss;
    if (res.code == 0) {
      setText('');
      setState(state + 1)
    }
  }

  function clickAvatar() {
    navigation.navigate('OthersPage');
  }
  const [pno, setpno] = useState(1);
  return (
    <View style={{ height: height - 91 }}>
      <Modal
        isVisible={true}
        style={styles.modal}
        coverScreen={false}
        hasBackdrop={false}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={80}
        >
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            height: 80,
            backgroundColor: '#fff',
            alignItems: 'center',
            paddingBottom: 15
          }}>
            <Image source={{ uri: senderAvatar }} style={styles.userphoto} />
            <TextInput
              label={<Text style={{ color: 'lightgrey' }}>Add a comment</Text>}
              value={text}
              onChangeText={text => setText(text)}
              mode='outlined'
              outlineStyle={{ backgroundColor: '#fff', borderColor: 'lightgrey', borderRadius: 21 }}
              style={{ width: 245, height: 42 }}
            />
            <Button style={{ marginLeft: -15, borderWidth: 5 }} onPress={postComment}>Send</Button>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <ScrollView >
        <View>
          <Card mode='outlined' style={styles.commentcard}>
            <Card.Title
              title={detail.isAnonymous ? "momo" : detail.userName}
              subtitle={detail.postTime}
              left={() => <UserPhoto
                clickAvatar={clickAvatar}
                content={detail} />}
              right={() => <IconButton icon='dots-horizontal' onPress={toggleDMenu} />}
            />
            <Card.Content>
              <Text>
                {detail.postContent}
              </Text>
            </Card.Content>
            {list.map((item: string, index: number) =>
              <Pressable onPress={() => { setFullview(true); setpno(index) }}>
                <Image
                  source={{ uri: item }}
                  style={{
                    borderWidth: 15,
                    borderColor: '#fff',
                    backgroundColor: '#fff',
                    width: width,
                    height: width,
                    marginBottom: -15
                  }}
                  key={index}
                />
              </Pressable>
            )}

            <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', paddingBottom: 10, paddingTop: 10 }}>
              <Like content={detail} id={id} />
              <Share content={detail} />
            </View>
          </Card>
          <Modal
            isVisible={fullview}
            presentationStyle='fullScreen'
          >
            <ImageViewer
              imageUrls={urls}
              onClick={() => setFullview(false)}
              saveToLocalByLongPress={false}
              index={pno}
            />
          </Modal>
          <Modal
            isVisible={MenuVisible}
            onBackdropPress={toggleDMenu}
            style={styles.modal}
          >
            <View style={styles.menu}>
              {global.gUserId === detail.userId && <Button style={{ height: 50, paddingTop: 5 }} onPress={onEdit
              }>编辑</Button>}
              {global.gUserId === detail.userId && <Divider />}
              <Button style={{ height: 50, paddingTop: 5 }} onPress={() => {
              }}>收藏</Button>
              {global.gUserId != detail.userId && <Divider />}
              {global.gUserId != detail.userId && <Button style={{ height: 50, paddingTop: 5 }} onPress={
                () => {setMenuVisible(!MenuVisible); Alert.alert('', '举报成功', [{ text: '确定'}]);}
              }>举报</Button>}
              {global.gUserId === detail.userId && <Divider />}
              {global.gUserId === detail.userId && <Button style={{ height: 50, paddingTop: 5 }} onPress={
                () => { setMenuVisible(!MenuVisible); Alert.alert('', '确定删除这条动态吗?', [{ text: '确定', onPress: onMemoryDelete }, { text: '取消' }]); }
              }>删除</Button>}
            </View>
          </Modal>
        </View>
        <View style={{ margin: 5 }} />
        {
          commentlist.map((item, index) =>
            <View key={index}>
              <Pressable onLongPress={() => toggleMenu(item.userId, item.commentId)}>
                <View>
                  <Card mode='outlined' style={styles.commentcard}>
                    <Card.Title
                      title={item.userName}
                      subtitle={
                        <Text
                          style={{
                            color: 'grey',
                            fontSize: 12.5
                          }}>
                          {item.postTime}
                        </Text>}
                      left={() => <UserPhoto
                        clickAvatar={clickAvatar}
                        content={item}
                      />}
                      right={() => <Thumb
                        content={item} />}
                    />
                    <Card.Content style={{ marginLeft: 55 }}>
                      <Text>
                        {item.commentContent}
                      </Text>
                    </Card.Content>
                  </Card>
                </View>
              </Pressable>
              <Modal
                isVisible={MenuVisible1}
                onBackdropPress={() => setMenuVisible1(false)}
                style={styles.modal}
              >
                <View style={styles.menu}>
                  <Button style={{ height: 50, paddingTop: 5 }} onPress={
                    () => {setMenuVisible1(false);Alert.alert('', '举报成功', [{ text: '确定'}]);}
                    }>举报</Button>
                  <Divider />
                  {/* {global.gUserId === detail.userId && <Button style={{ height: 50, paddingTop: 5 }} onPress={
                    () => { setMenuVisible1(!MenuVisible1); Alert.alert('', '确定删除这条评论吗?', [{ text: '确定', onPress: ()=>onDelete(cid) }, { text: '取消' }]); }
                  }>删除</Button>}
                  <Divider /> */}
                  <Button style={{ height: 50, paddingTop: 5 }} onPress={() => setMenuVisible1(false)}>取消</Button>
                </View>
              </Modal>
              <Modal
                isVisible={MenuVisible2}
                onBackdropPress={() => setMenuVisible2(false)}
                style={styles.modal}
              >
                <View style={styles.menu}>
                  <Button style={{ height: 50, paddingTop: 5 }} onPress={
                    () => { onDelete(cid); setMenuVisible2(false) }
                  }>删除</Button>
                  <Divider />
                  <Button style={{ height: 50, paddingTop: 5 }} onPress={() => setMenuVisible2(false)}>取消</Button>
                </View>
              </Modal>
            </View>
          )
        }
        <View style={{ margin: 20 }} />
        <Text
          style={{
            fontSize: 13,
            color: 'gainsboro',
            textAlign: 'center',
            marginTop: 5,
            marginBottom: 12
          }}>
          Reach the bottom
        </Text>
      </ScrollView >
    </View >
  );
}

export default Comment;