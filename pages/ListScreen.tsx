import React from 'react';
import { Pressable, ScrollView, View, Image, StyleSheet } from 'react-native';
import { Button, Card, IconButton, Menu, Divider, Provider } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/AntDesign';
import { useState } from 'react';

function UserPhoto() {
  const styles = StyleSheet.create({
    userphoto: {
      width: 42,
      height: 42,
      borderRadius: 21,
    },
  });
  function handleClick() {
    console.log('pressed');
  }
  return (
    <Pressable onPress={handleClick}>
      <Image source={{ uri: 'https://picsum.photos/700' }} style={styles.userphoto} />
    </Pressable>
  );
}

function Like() {
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

function Comment() {
  const clickComment = <Icon size={20} name='message1' />;
  function handleClick() {
    console.log('pressed');
  }
  return (
    <Button onPress={handleClick}>
      {clickComment}
    </Button>
  );
}

function Share() {
  const clickShare = <Icon size={20} name='retweet' />;
  function handleClick() {
    console.log('pressed');
  }

  return (
    <Button onPress={handleClick}>
      {clickShare}
    </Button>
  );
}

function MyMenu() {
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  return (
    <Provider>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={ <Card.Title
            title="UserName"
            subtitle="PostTime"
            left={UserPhoto}
            right={(props)=><IconButton icon='dots-vertical'  size={24} onPress={openMenu}/>}
          />}
          >
          <Menu.Item onPress={() => {}} title="Item 1" />
          <Menu.Item onPress={() => {}} title="Item 2" />
          <Divider />
          <Menu.Item onPress={() => {}} title="Item 3" />
        </Menu>
        <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
        <Card.Actions>
              <Like />
              <Comment />
              <Share />
            </Card.Actions>
    </Provider>
  );
}

export function SettingsScreen() {
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, marginBottom: bottom }}>
      <ScrollView>
        <View>
          <Card elevation={5} style={{ margin: 5 }}>
            <MyMenu />
          </Card>
          <Card elevation={5} style={{ margin: 5 }}>
            <MyMenu />
          </Card>
          <Card elevation={5} style={{ margin: 5 }}>
            <MyMenu />
          </Card>
          <Card elevation={5} style={{ margin: 5 }}>
            <Card.Title
              title="UserName"
              subtitle="PostTime"
              left={UserPhoto}
              right={(props) => <IconButton icon='dots-vertical' />}
            />
            <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
            <Card.Actions>
              <Like />
              <Comment />
              <Share />
            </Card.Actions>
          </Card>
          <Card elevation={5} style={{ margin: 5 }}>
            <Card.Title
              title="UserName"
              subtitle="PostTime"
              left={UserPhoto}
              right={(props) => <IconButton icon='dots-vertical' />}
            />
            <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
            <Card.Actions>
              <Like />
              <Comment />
              <Share />
            </Card.Actions>
          </Card>
          <Card elevation={5} style={{ margin: 5 }}>
            <Card.Title
              title="UserName"
              subtitle="PostTime"
              left={UserPhoto}
              right={(props) => <IconButton icon='dots-vertical' />}
            />
            <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
            <Card.Actions>
              <Like />
              <Comment />
              <Share />
            </Card.Actions>
          </Card>
        </View>
        {/* eslint-disable-next-line max-len */}
        {/* -> Set bottom view to allow scrolling to top if you set bottom-bar position absolute */}
        <View style={{ height: 90 }} />
      </ScrollView>
    </View>
  );
}