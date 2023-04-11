import React, { useState } from 'react';
import { Pressable, ScrollView, View, Image, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { Card, TextInput, Button, Divider, IconButton } from 'react-native-paper';
import { UserPhoto, styles, Like, Share } from './Memories'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';

function Thumb() {
  const [focused, setFocused] = useState(0);
  const [likes, setLikes] = useState('4');
  const thumb = 
  <View style={{ flexDirection: 'row' }}>
      <Icon size={17} name={focused ? 'thumb-up' : 'thumb-up-outline'} />
      {likes != '0' && <Text style={{ paddingLeft: 5 }}>{likes}</Text>}
    </View>;
  function handleClick() {
    setFocused(1 - focused);
    console.log('pressed');
  }

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

function CommentCard() {
  return (
    <Card mode='outlined' style={styles.commentcard}>
      <Card.Title
        title="UserName"
        subtitle={
          <Text
            style={{
              color: 'grey',
              fontSize: 12.5
            }}>
            PostTime
          </Text>}
        left={UserPhoto}
        right={Thumb}
      />
      <Card.Content style={{ marginLeft: 55 }}>
        <Text>Comment screen Comment screen Comment screen Comment screen Comment screen</Text>
      </Card.Content>
    </Card>
  );
}

function DetailedCard() {
  const [MenuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!MenuVisible);
  };
  return (
    <View>
      <Card mode='outlined' style={styles.commentcard}>
        <Card.Title
          title="UserName"
          subtitle="PostTime"
          left={UserPhoto}
          right={(props) => <IconButton icon='dots-horizontal' onPress={toggleMenu} />}
        />
        <Card.Content >
          <Text>
            content example content example content example content example content example
          </Text>
        </Card.Content>
        <Card.Cover
          source={{ uri: 'https://picsum.photos/700' }}
          style={{ borderWidth: 15, borderColor: '#fff',backgroundColor:'#fff' }}
          
        />
        <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', paddingBottom:5}}>
          <Like />
          <Share />
        </View>
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
}

function CommentScreen() {
  const array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const [text, setText] = React.useState("");
  return (
    <View>
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
            <Image source={{ uri: 'https://picsum.photos/700' }} style={styles.userphoto} />
            <TextInput
              label={<Text style={{ color: 'lightgrey' }}>Add a comment</Text>}
              value={text}
              onChangeText={text => setText(text)}
              mode='outlined'
              outlineStyle={{ backgroundColor: '#fff', borderColor: 'lightgrey', borderRadius: 21 }}
              style={{ width: 245, height: 42 }}
            />
            <Button style={{ marginLeft: -15, borderWidth: 5 }} onPress={() => { }}>Send</Button>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <ScrollView>
        <DetailedCard />
        <View style={{ margin: 5 }} />
        {array.map((item) => <CommentCard />)}
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
      </ScrollView>
    </View>
  );
}
export default CommentScreen;