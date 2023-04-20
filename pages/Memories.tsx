import React from 'react';
import { Pressable, ScrollView, View, Image, StyleSheet, Text, Alert } from 'react-native';
import { Button, Card, IconButton, Divider, FAB } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/AntDesign';
import { useState, useEffect } from 'react';
import Modal from 'react-native-modal';
import { StackNavigationProps } from '../App';
import requestApi from '../utils/request';
import handleAxiosError from "../utils/handleError";
import { useFocusEffect } from '@react-navigation/native';
import { NotionMainBadge } from '../components/NoticeManage/NoticeBadge';

export const styles = StyleSheet.create({
  userphoto: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 10,
    bottom: 80,
  },
  nmb: {
    position: 'absolute',
    margin: 16,
    right: 10,
    bottom: 160,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  menu: {
    backgroundColor: '#fff',
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  commentcard: {
    backgroundColor: '#fff',
    borderColor: 'transparent',
    margin: 0,
    elevation: 0,
    borderRadius: 0
  },
});

export function UserPhoto(props: CardProps) {
  return (
    <Pressable onPress={props.clickAvatar}>
      <Image source={{ uri: props.content.userAvatar }} style={styles.userphoto} />
    </Pressable>
  );
}

function Like(props: CardProps) {
  const [likeNum, setLike] = useState(props.content.likeNum);
  const [isLiked, setIsLiked] = useState(props.content.isLiked);

  useFocusEffect(React.useCallback(() => {
    setLike(props.content.likeNum);
    setIsLiked(props.content.isLiked);
    return () => {
    };
  }, [props.content.likeNum, props.content.isLiked]))


  async function handleClick() {
    const res = await requestApi('get', `/updateLikeMemory/${props.content.postId}`, null, true, 'update like memory失败')
    if (res.code == 0) {
      setLike(res.data.likeNum);
      setIsLiked(res.data.isLiked);
    }
  }

  const clickHeart =
    <Icon size={18} name={isLiked ? 'heart' : 'hearto'} />;
  return (
    <Button onPress={handleClick} style={{ flexDirection: 'row' }}>
      {clickHeart}
      {likeNum != '0' && <Text style={{ fontSize: 17, fontWeight: '400' }}> {likeNum}</Text>}
    </Button>
  );
}

function Comment(props: CardProps) {
  const clickComment =
    <Icon size={18} name='message1' />
  return (
    <Button onPress={props.onCommentPress} style={{ flexDirection: 'row' }}>
      {clickComment}
      {props.content.commentNum != '0' &&
        <Text style={{ fontSize: 17, fontWeight: '400' }}> {props.content.commentNum}</Text>}
    </Button>
  );
}

export function Share(props: CardProps) {
  const clickShare =
    <Icon size={18} name='retweet' />

  const [ShareVisible, setShareVisible] = useState(false);

  const toggleShare = () => {
    setShareVisible(!ShareVisible);
  };

  return (
    <View>
      <Button onPress={toggleShare} style={{ flexDirection: 'row' }}>
        {clickShare}
        {props.content.repoNum != '0' &&
          <Text style={{ fontSize: 17, fontWeight: '400' }}> {props.content.repoNum}</Text>}
      </Button>
      <Modal
        isVisible={ShareVisible}
        onBackdropPress={toggleShare}
        style={styles.modal}
      >
        <View style={styles.menu}>
          <Card.Title style={{ marginTop: -5 }} title='分享动态' right={() => <Button onPress={() => {
          }}>分享</Button>} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', height: 70 }}>
            <IconButton icon='qqchat' size={40} onPress={() => {
            }} />
            <IconButton icon='wechat' size={40} onPress={() => {
            }} />
            <IconButton icon='sina-weibo' size={40} onPress={() => {
            }} />
          </View>
          <Button style={{ height: 50, paddingTop: 10 }} onPress={toggleShare}>取消</Button>
        </View>
      </Modal>
    </View>
  );
}

const FloatButton = ({ onPressFAB }: { onPressFAB: () => void }) => (
  <FAB
    icon="plus"
    style={styles.fab}
    customSize={50}
    onPress={onPressFAB}
  />
);

interface CardProps {
  onCommentPress?: () => void,
  clickAvatar?: () => void,
  key?: number,
  content?: any,
  navigation?: any,
  onDelete?:()=>void
}

export const CardwithButtons = (props: CardProps) => {
  const [MenuVisible, setMenuVisible] = useState(false);
  const toggleMenu = () => {
    setMenuVisible(!MenuVisible);
  };

  

  function onEdit() {
    console.log(props.content.postId);
    props.navigation.navigate('EditPost', { postId: props.content.postId })
    setMenuVisible(!MenuVisible);
  }
  return (
    <View>
      <Card elevation={5} style={{ margin: 5 }}>
        <Card.Title
          title={props.content.userName}
          subtitle={props.content.postTime}
          left={() => <UserPhoto
            content={props.content}
            onCommentPress={props.onCommentPress}
            clickAvatar={props.clickAvatar} />}
          right={() => <IconButton icon='dots-horizontal' onPress={toggleMenu} />}
        />
        <Pressable onPress={props.onCommentPress}>
          <Card.Cover source={{ uri: props.content.postPhoto === "" ? "http://dummyimage.com/400x400" : props.content.postPhoto }} />
        </Pressable>
        <Card.Actions>
          <Like
            content={props.content}
            onCommentPress={props.onCommentPress}
            clickAvatar={props.clickAvatar} />
          <Comment
            content={props.content}
            onCommentPress={props.onCommentPress}
            clickAvatar={props.clickAvatar} />
          <Share
            content={props.content}
            onCommentPress={props.onCommentPress}
            clickAvatar={props.clickAvatar} />
        </Card.Actions>
      </Card>
      <Modal
        isVisible={MenuVisible}
        onBackdropPress={toggleMenu}
        style={styles.modal}
      >
        <View style={styles.menu}>
          {global.gUserId === props.content.userID && <Button style={{ height: 50, paddingTop: 5 }} onPress={onEdit
          }>编辑</Button>}
          {global.gUserId === props.content.userID && <Divider />}
          <Button style={{ height: 50, paddingTop: 5 }} onPress={() => {
            toggleMenu
          }}>收藏</Button>
          {global.gUserId != props.content.userID && <Divider />}
          {global.gUserId != props.content.userID && <Button style={{ height: 50, paddingTop: 5 }} onPress={() => {
            toggleMenu
          }}>举报</Button>}
          {global.gUserId === props.content.userID && <Divider />}
          {global.gUserId === props.content.userID && <Button style={{ height: 50, paddingTop: 5 }} onPress={
            () => { setMenuVisible(!MenuVisible); Alert.alert('', '确定删除这条动态吗?', [{ text: '确定', onPress: props.onDelete }, { text: '取消' }]); }
          }>删除</Button>}
        </View>
      </Modal>
    </View>
  );
};

const NoticeManageButton = ({ onPressFAB }: { onPressFAB: () => void }) => (
  <View style={{position:"relative"}}>
    <FAB
    icon="bell"
    style={styles.nmb}
    customSize={50}
    onPress={onPressFAB}
    />
    <NotionMainBadge />
  </View>
);

const MemoriesScreen = ({ navigation }: StackNavigationProps) => {
  const { bottom } = useSafeAreaInsets();
  const onCommentPress = (postID: string) => {
    console.log(postID);
    navigation.navigate('Comment', { postId: postID });
  }

  function clickAvatar(pageId: string) {
    if(pageId === global.gUserId){
      navigation.navigate('Profile');
    }
    else{
      navigation.navigate('OthersPage',{userId:pageId});
    }
  }

  const [list, setlist] = useState([] as any[]);
  let memorylist = [] as any[];

  async function fetchData() {
    memorylist = []
    const res = await requestApi('get', '/Memories', null, true, 'getMemories failed')
    if (res.code == 0) {
      memorylist = memorylist.concat(res.data);
      setlist(memorylist);
    }
  }
  const [state,setState]=useState(false);

  function onDelete(postId:string) {
    console.log('d')
    async function deleteMomery() {
      const res = await requestApi('get', `/deleteMemory/${postId}`, null, true, '删除失败');
      if (res.code == 0) {
        console.log(postId)
        setState(!state);
      }
    };
    deleteMomery();
  }
  useFocusEffect(React.useCallback(() => {
    fetchData()
    return () => {
    };
  }, [state]))

  return (
    <View style={{ flex: 1, marginBottom: bottom }}>
      <ScrollView>
        <View>
          {list.map((item, index) =>
            <CardwithButtons
              key={index}
              content={item}
              onCommentPress={() => onCommentPress(item.postId)}
              clickAvatar={()=>clickAvatar(item.userID)}
              navigation={navigation}
              onDelete={()=>onDelete(item.postId)}
            />)}
        </View>
        {/* eslint-disable-next-line max-len */}
        {/* -> Set bottom view to allow scrolling to top if you set bottom-bar position absolute */}
        <View style={{ height: 90 }} />
      </ScrollView>
      <FloatButton onPressFAB={() => navigation.navigate('Post')} />
      <NoticeManageButton onPressFAB={() => navigation.navigate('NoticeManageScreen')} />
    </View>
  );
}
export default MemoriesScreen;