import React, { useState } from 'react';
import { Button, Pressable, ScrollView, View, Image, StyleSheet, Text } from 'react-native';
import { Card, IconButton, Divider, FAB } from 'react-native-paper';
import { UserPhoto } from './Memories'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const styles = StyleSheet.create({
  comment: {
    backgroundColor: '#fff',
    borderColor: 'transparent',
    margin: 0,
    elevation: 0,
    borderRadius: 0
  }
});

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
    <Card mode='outlined' style={styles.comment}>
      <Card.Title
        title="UserName"
        subtitle={
        <Text 
        style={{
          color:'grey',
          fontSize:12.5
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
  return (
    <View>
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