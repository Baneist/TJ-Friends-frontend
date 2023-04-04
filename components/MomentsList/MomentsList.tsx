import React from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Pressable
} from "react-native";
import { useState } from "react";
import {Button, Card, Avatar, IconButton} from 'react-native-paper';
import { Block, theme, Text } from "galio-framework";
import Icon from 'react-native-vector-icons/AntDesign';

//图片
const profileImage = {
    ProfileBackground : require("../../assets/imgs/profile-screen-bg.png"),
    ProfilePicture: 'https://picsum.photos/700'
  }
  
  const Viewed = [
    'https://images.unsplash.com/photo-1501601983405-7c7cabaa1581?fit=crop&w=240&q=80',
    'https://images.unsplash.com/photo-1543747579-795b9c2c3ada?fit=crop&w=240&q=80',
    'https://images.unsplash.com/photo-1551798507-629020c81463?fit=crop&w=240&q=80',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?fit=crop&w=240&q=80',
    'https://images.unsplash.com/photo-1503642551022-c011aafb3c88?fit=crop&w=240&q=80',
    'https://images.unsplash.com/photo-1482686115713-0fbcaced6e28?fit=crop&w=240&q=80',
  ];

//用户头像
function UserPhoto({pressable} : {pressable: boolean}) {
    const styles = StyleSheet.create({
      userphoto: {
        width:42,
        height:42,
        borderRadius:21,
      },
    });
    function handleClick() {
      console.log('pressed');
    }
    if(pressable){
      return (
        <Pressable onPress={handleClick}>
          <Image source={{ uri: profileImage.ProfilePicture }} style={styles.userphoto}/>
        </Pressable>
      );
    }
    else{
      return (
        <Image source={{ uri: profileImage.ProfilePicture }} style={styles.userphoto}/>
      )
    }
  }

//转发 点赞 评论
function Like() {
    const [focused,setFocused]=useState(0);
    const clickHeart = <Icon size={20} name={focused ? 'heart' : 'hearto'} />;
    function handleClick() {
      setFocused(1-focused);
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


//动态列表
export function MomentsList({avatar_pre} : {avatar_pre: boolean}){
    return (
    <Block>
      <Block>
        {Viewed.map((img, imgIndex) => (
          <Card elevation={5} style={{ margin: 5 }}>
             <Card.Title
                title="UserName"
                subtitle="PostTime"
                left={(props) =><UserPhoto pressable={avatar_pre}/>}
                right={(props) =><IconButton icon='dots-vertical' />}
              />
              <Card.Cover source={{ uri: img }} />
              <Card.Actions>
                <Like />
                <Comment />
                <Share />
            </Card.Actions>
          </Card>
        ))}
    </Block>
  </Block>
  )
}