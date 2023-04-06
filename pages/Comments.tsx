import React, { useState } from 'react';
import { Pressable, ScrollView, View, Image, Text, KeyboardAvoidingView,Platform } from 'react-native';
import { Card, TextInput, Button } from 'react-native-paper';
import { UserPhoto, styles } from './Memories'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';

function Thumb() {
  const [focused, setFocused] = useState(0);
  const thumb = <Icon size={17} name={focused ? 'thumb-up' : 'thumb-up-outline'} />;
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

function CommentScreen({ onBackPress }: { onBackPress: () => void }) {
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
    <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={80}>

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
          <Button style={{ marginLeft: -15 ,borderWidth:5}} onPress={()=>{}}>Send</Button>
        </View>
    </KeyboardAvoidingView>
      </Modal>
      <ScrollView>
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