import React from 'react';
import { Pressable, ScrollView, View, Image, StyleSheet, Text } from 'react-native';
import { Button, Card, IconButton, Divider, FAB } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/AntDesign';
import { useState, useEffect } from 'react';
import Modal from 'react-native-modal';
import { NavigationProps } from '../App';
import requestApi from '../utils/request';
import handleAxiosError from "../utils/handleError";


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
  const[likeNum,setLike]=useState(props.content.likeNum);
  const[isLiked,setIsLiked]=useState(props.content.isLiked);
  useEffect(() => {
    setLike(props.content.likeNum);
    setIsLiked(props.content.isLiked);
  }, [props.content.likeNum,props.content.isLiked]);
  function handleClick() {
    async function fetchData() {
      try {
        const res = await requestApi('get', `/updateLikeMemory/${props.content.postId}`, null, null, true)
        if (res.data.code == 0) {
          setLike(res.data.data.likeNum);
          setIsLiked(res.data.data.isLiked);
        }
        else {
          console.log('code err', res.data.code)
        }
      } catch (error) {
        handleAxiosError(error);
      }

    }
    fetchData()
    //console.log(props.content.likeNum);
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
      {props.content.commentNum != '0' && <Text style={{ fontSize: 17, fontWeight: '400' }}> {props.content.commentNum}</Text>}
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
        {props.content.repoNum != '0' && <Text style={{ fontSize: 17, fontWeight: '400' }}> {props.content.repoNum}</Text>}
      </Button>
      <Modal
        isVisible={ShareVisible}
        onBackdropPress={toggleShare}
        style={styles.modal}
      >
        <View style={styles.menu}>
          <Card.Title style={{ marginTop: -5 }} title='分享动态' right={(props) => <Button onPress={() => { console.log('pressed'); }}>分享</Button>} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', height: 70 }}>
            <IconButton icon='qqchat' size={40} onPress={() => { }} />
            <IconButton icon='wechat' size={40} onPress={() => { }} />
            <IconButton icon='sina-weibo' size={40} onPress={() => { }} />
          </View>
          <Button style={{ height: 50, paddingTop: 10 }} onPress={toggleShare} >取消</Button>
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
  onCommentPress: () => void,
  clickAvatar: () => void,
  content: any
}

export const CardwithButtons = (props: CardProps) => {
  const [MenuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!MenuVisible);
  };

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
          <Card.Cover source={{ uri: props.content.postPhoto }} />
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
          <Button style={{ height: 50 }} onPress={() => { }} >收藏</Button>
          <Divider />
          <Button style={{ height: 50, paddingTop: 5 }} onPress={() => { }} >举报</Button>
          <Divider />
          <Button style={{ height: 50, paddingTop: 10 }} onPress={() => { }} >删除</Button>
        </View>
      </Modal>

    </View>
  );
};

const MemoriesScreen = ({ route, navigation }: NavigationProps) => {
  const { bottom } = useSafeAreaInsets();
  const onCommentPress = (postID: string) => {
    navigation.navigate('Comment', { userId:'2052909',postId: postID });

  }
  function clickAvatar() {
    navigation.navigate('OthersPage');
  }
  const [list, setlist] = useState([] as any[]);
  let memorylist = [] as any[];
  async function fetchData() {
    try {
      const res = await requestApi('get', '/Memories', null, null, true)
      if (res.data.code == 0) {
        memorylist = memorylist.concat(res.data.data);
        setlist(memorylist);
        //console.log(res.data.data);
      }
      else {
        console.log('code err', res.data.code)
      }
    } catch (error) {
      handleAxiosError(error);
    }
  }
  useEffect(() => {
    fetchData()
  }, )

  return (
    <View style={{ flex: 1, marginBottom: bottom }}>
      <ScrollView>
        <View>
          {list.map((item, index) =>
            <CardwithButtons
              key={index}
              content={item}
              onCommentPress={() => onCommentPress(item.postId)}
              clickAvatar={clickAvatar}
            />)}
        </View>
        {/* eslint-disable-next-line max-len */}
        {/* -> Set bottom view to allow scrolling to top if you set bottom-bar position absolute */}
        <View style={{ height: 90 }} />
      </ScrollView>
      <FloatButton onPressFAB={() => navigation.navigate('Post')} />
    </View>
  );
}
export default MemoriesScreen;