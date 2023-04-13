import React from 'react';
import { Pressable, ScrollView, View, Image, StyleSheet, Text } from 'react-native';
import { Button, Card, IconButton, Divider, FAB } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/AntDesign';
import { useState } from 'react';
import Modal from 'react-native-modal';
import { NavigationProps } from '../App';
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

export function UserPhoto() {
  function handleClick() {
    console.log('pressed');
  }
  return (
    <Pressable onPress={handleClick}>
      <Image source={{ uri: 'https://picsum.photos/700' }} style={styles.userphoto} />
    </Pressable>
  );
}

export function Like() {
  const [focused, setFocused] = useState(0);
  const [likes, setLikes] = useState('1');

  const clickHeart =
      <Icon size={18} name={focused ? 'heart' : 'hearto'} />;
  function handleClick() {
    setFocused(1 - focused);
    console.log('pressed');
  }

  return (
    <Button onPress={handleClick} style={{flexDirection:'row'}}>
      {clickHeart}
      {likes!='0'&&<Text style={{fontSize:17,fontWeight:'400'}}> {likes}</Text>}
    </Button>
  );
}

function Comment({ onCommentPress }: { onCommentPress?: () => void }) {
  const [comments, setComments] = useState('2');
  const clickComment =
      <Icon size={18} name='message1' />
  return (
    <Button onPress={onCommentPress}  style={{flexDirection:'row'}}>
      {clickComment}
      {comments != '0' && <Text style={{fontSize:17,fontWeight:'400'}}> {comments}</Text>}
    </Button>
  );
}

export function Share() {
  const [repos, setRepos] = useState('3');
  const clickShare =
      <Icon size={18} name='retweet' />

  const [ShareVisible, setShareVisible] = useState(false);

  const toggleShare = () => {
    setShareVisible(!ShareVisible);
  };

  return (
    <View>
      <Button onPress={toggleShare}  style={{flexDirection:'row'}}>
        {clickShare}
        {repos!='0'&& <Text style={{fontSize:17,fontWeight:'400'}}> {repos}</Text>}
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

export const CardwithButtons = ({ onCommentPress }: { onCommentPress?: () => void }) => {
  const [MenuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!MenuVisible);
  };

  return (
    <View>
      <Card elevation={5} style={{ margin: 5 }}>
        <Card.Title
          title="UserName"
          subtitle="PostTime"
          left={UserPhoto}
          right={(props) => <IconButton icon='dots-horizontal' onPress={toggleMenu} />}
        />
        <Pressable onPress={onCommentPress}>
          <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
        </Pressable>
        <Card.Actions>
          <Like />
          <Comment onCommentPress={onCommentPress} />
          <Share />
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
  const array = [1, 2, 3, 4, 5];
  return (
    <View style={{ flex: 1, marginBottom: bottom }}>
      <ScrollView>
        <View>
          {array.map((item,index) => <CardwithButtons onCommentPress={() => navigation.navigate('Comment')} />)}
        </View>
        {/* eslint-disable-next-line max-len */}
        {/* -> Set bottom view to allow scrolling 2to top if you set bottom-bar position absolute */}
        <View style={{ height: 90 }} />
      </ScrollView>
      <FloatButton onPressFAB={() => navigation.navigate('Post')} />
      <NoticeManageButton onPressFAB={() => navigation.navigate('NoticeManageScreen')} />
    </View>
  );
}
export default MemoriesScreen;