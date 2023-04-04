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
import { MomentsList } from "../components/MomentsList/MomentsList";

//获取屏幕宽高
const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

//图片
const profileImage = {
  ProfileBackground : require("../assets/imgs/profile-screen-bg.png"),
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

//用户头像 动态中
function UserPhoto({pressable} : {pressable: boolean}) {
  function handleClick() {
    console.log('pressed');
  }
  if(pressable){
    return (
      <Pressable onPress={handleClick}>
        <Image source={{ uri: profileImage.ProfilePicture }} style={styles.moment_avatar}/>
      </Pressable>
    );
  }
  else{
    return (
      <Image source={{ uri: profileImage.ProfilePicture }} style={styles.moment_avatar}/>
    )
  }
}

//资料页面
export function Profile(){
  const { bottom } = useSafeAreaInsets();
  function clickAvatar(){
    console.log('跳转编辑个人资料')
  }
  return (
    <Block flex style={{marginBottom: bottom}}>
      <Block flex>
        {/* 资料卡片 */}
        <ImageBackground
          source={profileImage.ProfileBackground}
          style={styles.profileContainer}
          imageStyle={styles.profileBackground}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ width}}
            >
            <Block flex style={styles.profileCard}>
              {/* 头像 */}
                <Block middle style={styles.avatarContainer}>
                <Pressable onPress={clickAvatar}>
                  <Image 
                    source={{ uri: profileImage.ProfilePicture }}
                    style={styles.avatar}
                  />
                </Pressable>
                </Block>
                <Block style={styles.info}>
                  {/* 粉丝量信息 */}
                  <Block row space="between">
                    <Block middle>
                      <Text bold size={18} color="#525F7F" style={{ marginBottom: 4}}>
                        2K
                      </Text>
                      <Text size={12}>Followers</Text>
                    </Block>
                    <Block middle>
                      <Text bold  color="#525F7F" size={18} style={{ marginBottom: 4 }}>
                        10
                      </Text>
                      <Text size={12}>Following</Text>
                    </Block>
                    <Block middle>
                      <Text bold size={18} color="#525F7F" style={{ marginBottom: 4 }}>
                        89
                      </Text>
                      <Text size={12}>Comments</Text>
                    </Block>
                  </Block>
                </Block>
              {/* 用户ID 简介等 */}
              <Block flex>
                  {/* 用户ID */}
                  <Block middle style={styles.nameInfo}>
                    <Text bold size={28} color="#32325D">
                      Gilgamesh
                    </Text>
                    <Text size={16} color="#32325D" style={{ marginTop: 10 }}>
                      Uruk
                    </Text>
                  </Block>
                  {/* 分割线 */}
                  <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                    <Block style={styles.divider} />
                  </Block>
                  {/* 简介 */}
                  <Block middle>
                    <Text
                      size={16}
                      color="#525F7F"
                      style={{ textAlign: "center" }}
                    >
                      Enuma Elish !!
                    </Text>
                  </Block>
                  {/* 动态列表 */}
                  <Text bold size={16} color="#525F7F" style={{marginTop: 12, marginLeft: 12}}>
                    Moments
                  </Text>
                  <MomentsList avatar_pre={false}/>
                </Block>
              </Block>
              {/* eslint-disable-next-line max-len */}
            {/* -> Set bottom view to allow scrolling to top if you set bottom-bar position absolute */}
            <View style={{ height: 190 }} />
            </ScrollView>
        </ImageBackground>
      </Block>
    </Block>
  )
}


const styles = StyleSheet.create({
  profileContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: 1
  },
  profileBackground: {
    width: width,
    height: height / 2
  },
  profileCard: {
    flex: 1,
    marginTop: 90,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: '#FFFFFF',
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2
  },
  info: {
    paddingHorizontal: 40
  },
  avatarContainer: {
    position: "relative",
    marginTop: -80
  },
  avatar: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 0
  },
  moment_avatar: {
      width:42,
      height:42,
      borderRadius:21,
  },
  nameInfo: {
    marginTop: 35
  },
  divider: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#E9ECEF"
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure
  }
});