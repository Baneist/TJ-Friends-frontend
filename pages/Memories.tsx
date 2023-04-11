import React from 'react';
import { Pressable, ScrollView, View, Image, StyleSheet } from 'react-native';
import { Button, Card, IconButton, Divider, FAB } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/AntDesign';
import { useState } from 'react';
import Modal from 'react-native-modal';
import { Props } from '../App';
  
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
  const clickHeart = <Icon size={20} name={focused ? 'heart' : 'hearto'} />;
  function handleClick() {
    setFocused(1 - focused);
    console.log('pressed');
  }

  return (
    <Button onPress={handleClick}>
      {clickHeart}
    </Button>
  );
}

function Comment({onCommentPress}:{onCommentPress?:()=>void}) {
  
  const clickComment = <Icon size={20} name='message1' />;
  return (
      <Button onPress={onCommentPress}>
        {clickComment}
      </Button>
  );
}

export function Share() {
  const clickShare = <Icon size={20} name='retweet' />;

  const [ShareVisible, setShareVisible] = useState(false);

  const toggleShare = () => {
    setShareVisible(!ShareVisible);
  };

  return (
    <View>
      <Button onPress={toggleShare}>
        {clickShare}
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

const FloatButton = ({onPressFAB}:{onPressFAB:()=>void}) => (
  <FAB
    icon="plus"
    style={styles.fab}
    customSize={50}
    onPress={onPressFAB}
  />
);

const CardwithButtons = ({onCommentPress}:{onCommentPress?:()=>void}) => {
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
        <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
        <Card.Actions>
          <Like />
          <Comment onCommentPress={onCommentPress}/>
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

const MemoriesScreen=({route,navigation}:Props)=> {
  const { bottom } = useSafeAreaInsets();
  const array = [1, 2, 3, 4, 5];
  return(
    <View style={{ flex: 1, marginBottom: bottom }}>
      <ScrollView>
        <View>
          {array.map((item) => <CardwithButtons onCommentPress={()=>navigation.navigate('Comment')}/>)}
        </View>
        {/* eslint-disable-next-line max-len */}
        {/* -> Set bottom view to allow scrolling to top if you set bottom-bar position absolute */}
        <View style={{ height: 90 }} />
      </ScrollView>
      <FloatButton onPressFAB={()=>navigation.navigate('Post')}/>
    </View>
  );
}
export default MemoriesScreen;