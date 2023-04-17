import React, { useState } from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  View,
  ScrollView,
  Image,
  ImageBackground,
  Pressable, Dimensions
} from "react-native";
import { Button, List, Chip } from 'react-native-paper';
import { Block, Text } from "galio-framework";
import Icon from 'react-native-vector-icons/AntDesign';
import { MomentsList } from "../../components/MomentsList/MomentsList";
import { StackNavigationProps } from '../../App'
import requestApi from "../../utils/request";
import handleAxiosError from "../../utils/handleError";
import { useFocusEffect } from '@react-navigation/native';
import { styles } from "./Profile.style";
import { AxiosResponse } from "axios";

enum GENDER { Male = "男", Female = "女" }

const { width } = Dimensions.get("screen");

//图片
const profileImage = {
  ProfileBackground: require("../../assets/imgs/profile-screen-bg.png"),
  ProfilePicture: 'https://picsum.photos/700'
}

interface labelProp {
  info: string[],
  pms: boolean
}

interface infoProp {
  info: string,
  pms: boolean
}

export interface userProp {
  userId: infoProp,
  userName: infoProp,
  userNickName: infoProp,
  userAvatar: infoProp,
  userGender: infoProp,
  userBirthDate: infoProp,
  userStatus: infoProp,
  userMajor: infoProp,
  userYear: infoProp,
  userPhone: infoProp,
  userInterest: infoProp,
  userLabel: labelProp,
  followerPms: boolean,
  followingPms: boolean
}

export const defaultInfo = {
  "userId": {
    "info": "2053302",
    "pms": false
  },
  "userName": {
    "info": "吉尔伽美什",
    "pms": false
  },
  "userNickName": {
    "info": "Gilgamesh",
    "pms": false
  },
  "userGender": {
    "info": "Male",
    "pms": false
  },
  "userBirthDate": {
    "info": "2002-08-07",
    "pms": true
  },
  "userStatus": {
    "info": "愉悦！",
    "pms": true
  },
  "userMajor": {
    "info": "愉悦学",
    "pms": true
  },
  "userPhone": {
    "info": "",
    "pms": false
  },
  "userYear": {
    "info": "2020",
    "pms": false
  },
  "userInterest": {
    "info": "喜欢钱和一切金闪闪的东西，还有哈哈哈哈哈哈（是个快乐的男人！）",
    "pms": true
  },
  "userLabel": {
    "info": [
      "金闪闪",
      "帅",
      "金发",
      "红瞳",
      "AUO",
      "愉悦教主",
      "强",
      "黄金三靶"
    ],
    "pms": true
  },
  "userAvatar": {
    "info": "https://picsum.photos/700",
    "pms": true
  },
  "followerPms": true,
  "followingPms": false
}

const Profile = ({ navigation }: StackNavigationProps) => {
  //state
  const userId = '2052909';
  //个人信息
  const [userInfo, setUserInfo] = useState<userProp>(defaultInfo);
  console.log(userInfo)
  //粉丝 关注列表
  const [followerNum, setFollowerNum] = useState(0);
  const [followingNum, setFollowingNum] = useState(0);
  //显示个人信息
  const { bottom } = useSafeAreaInsets();

  function handleApiResponse(response: {code: number}, callback: () => void) {
    if (response.code == 0) {
      callback();
    }
  }

  async function fetchData() {
    //获取资料、关注列表和粉丝列表
    const [resInfo, resFollowing, resFollower] = await Promise.all([
      requestApi('get', `/profile/${userId}`, null, true, 'getProfile failed'),
      requestApi('get', `/profile/${userId}/followings`, null, true, 'getFollowing failed'),
      requestApi('get', `/profile/${userId}/followers`, null, true, 'getFollower failed'),
    ]);
    handleApiResponse(resInfo, () => setUserInfo(resInfo.data));
    handleApiResponse(resFollowing, () => setFollowingNum(resFollowing.data.followings.length));
    handleApiResponse(resFollower, () => setFollowerNum(resFollower.data.followers.length));
  }

  // 编辑个人资料
  const editProfile = () => {
    navigation.navigate("EditProfile");
  }

  // 查看关注列表
  const viewFollowing = () => {
    navigation.navigate("FollowingList");
  }

  // 查看粉丝列表
  const viewFollower = () => {
    navigation.navigate("FollowersList");
  }

  // 查看评论列表
  const onCommentPress = () => {
    navigation.navigate("Comment");
  }

  // 性别
  const Gender = () => {
    return (<Icon name={userInfo.userGender.info === GENDER.Male ? 'man' : 'woman'}
      size={16} color="#32325D" style={{ marginTop: 10 }}>
      {userInfo.userGender.info === GENDER.Male ? GENDER.Male : GENDER.Female}
    </Icon>);
  }

  useFocusEffect(
    React.useCallback(() => {
      fetchData()
      return () => {
      };
    }, [])
  );

  return (
    <View style={{ flex: 1, marginBottom: bottom }}>
      <View style={{ flex: 1 }}>
        {/* 资料卡片 */}
        <ImageBackground
          source={profileImage.ProfileBackground}
          style={styles.profileContainer}
          imageStyle={styles.profileBackground}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ width }}
          >
            <Block flex style={styles.profileCard}>
              {/* 头像 */}
              <Block middle style={styles.avatarContainer}>
                <Image
                  source={{ uri: userInfo.userAvatar.info }}
                  style={styles.avatar}
                />
              </Block>
              <Block style={styles.info}>
                {/* 粉丝量信息 */}
                <Block row space="around">
                  <Pressable onPress={viewFollower}>
                    <Block middle>
                      <Text style={styles.infoNum}>
                        {followerNum}
                      </Text>
                      <Text style={styles.infoName}>Followers</Text>
                    </Block>
                  </Pressable>
                  <Pressable onPress={viewFollowing}>
                    <Block middle>
                      <Text style={styles.infoNum}>
                        {followingNum}
                      </Text>
                      <Text style={styles.infoName}>Following</Text>
                    </Block>
                  </Pressable>
                </Block>
              </Block>
              {/* 用户ID 简介等 */}
              <Block flex>
                {/* 用户昵称 */}
                <Block middle style={styles.nameInfo}>
                  <Text bold size={28} color="#32325D">
                    {userInfo.userNickName.info}
                  </Text>
                  {/* 性别 */}
                  <Gender />
                  {/* 改资料 */}
                  <Block middle>
                    <Button
                      buttonColor="transparent"
                      textColor="#3B5998"
                      onPress={editProfile}
                    >
                      <Icon size={16} name="edit">edit your profile</Icon>
                    </Button>
                  </Block>
                </Block>
                <Block middle>
                  {/* 标签 */}
                  <List.Section style={{ width: width / 1.1 }}>
                    <List.Accordion
                      title="标签"
                      left={props => <List.Icon {...props} icon="label-multiple" />}>
                      <View style={{ flex: 1, flexDirection: "row", flexWrap: 'wrap' }}>
                        {userInfo.userLabel.info.map((label, idx) =>
                          <Chip key={idx} style={{ marginRight: 10, marginBottom: 10 }} mode='outlined'>{label}</Chip>
                        )}
                      </View>
                    </List.Accordion>
                  </List.Section>
                  {/* 查看更多信息 */}
                  <List.Section style={{ width: width / 1.1 }}>
                    <List.Accordion
                      title="view more"
                      left={props => <List.Icon {...props} icon="balloon" />}>
                      <List.Item title="学号/姓名"
                        description={userInfo.userId.info + '/' + userInfo.userName.info}
                        left={props => <List.Icon {...props} icon="emoticon-outline" />}
                      />
                      <List.Item title="生日"
                        description={userInfo.userBirthDate.info}
                        left={props => <List.Icon {...props} icon="cake-variant" />}
                      />
                      <List.Item title="学年/专业"
                        description={userInfo.userYear.info + '/' + userInfo.userMajor.info}
                        left={props => <List.Icon {...props} icon="school" />}
                      />
                      <List.Item title="兴趣爱好"
                        description={userInfo.userInterest.info}
                        left={props => <List.Icon {...props} icon="heart" />}
                      />
                    </List.Accordion>
                  </List.Section>
                </Block>
                {/* 分割线 */}
                <Block middle style={{ marginTop: 16, marginBottom: 16 }}>
                  <Block style={styles.divider} />
                </Block>
                {/* 个性签名 */}
                <Block middle>
                  <Text
                    size={16}
                    color="#525F7F"
                    style={{ textAlign: "center" }}
                  >
                    {userInfo.userStatus.info}
                  </Text>
                </Block>
                {/* 动态列表 */}
                <Text bold size={16} color="#525F7F" style={{ marginTop: 12, marginLeft: 12 }}>
                  Moments
                </Text>
                {/* <MomentsList onCommentPress={onCommentPress}/> */}
              </Block>
            </Block>
            {/* eslint-disable-next-line max-len */}
            {/* -> Set bottom view to allow scrolling to top if you set bottom-bar position absolute */}
            <View style={{ height: 190 }} />
          </ScrollView>
        </ImageBackground>
      </View>
    </View>
  )
}

export default Profile;