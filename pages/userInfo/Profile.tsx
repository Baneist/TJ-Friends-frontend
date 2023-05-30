import React, { useState } from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  View,
  ScrollView,
  Image,
  ImageBackground,
  Pressable, Dimensions
} from "react-native";
import { Button, List, Chip, IconButton, Menu, Divider, Provider } from 'react-native-paper';
import { Block, Text } from "galio-framework";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackNavigationProps } from '../../App'
import requestApi from "../../utils/request";
import handleAxiosError from "../../utils/handleError";
import { useFocusEffect } from '@react-navigation/native';
import { profileStyles} from "./Profile.style";
import MomentsList from "../../components/MomentsList/MomentsList";
import { AxiosResponse } from "axios";
import { CardwithButtons } from "../memoryManage/Memories";

export enum GENDER { Male = "男", Female = "女" }

const { width } = Dimensions.get("screen");

//图片
export const profileImage = {
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

interface PostIdProps{
  navigation:StackNavigationProps["navigation"],
  userID:string,
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
  followingPms: boolean,
  followingNum:number,
  followerNum:number
}

export const defaultInfo = {
  "userId": {
    "info": "",
    "pms": false
  },
  "userName": {
    "info": "",
    "pms": false
  },
  "userNickName": {
    "info": "",
    "pms": false
  },
  "userGender": {
    "info": "",
    "pms": false
  },
  "userBirthDate": {
    "info": "",
    "pms": true
  },
  "userStatus": {
    "info": "",
    "pms": true
  },
  "userMajor": {
    "info": "",
    "pms": true
  },
  "userPhone": {
    "info": "",
    "pms": false
  },
  "userYear": {
    "info": "",
    "pms": false
  },
  "userInterest": {
    "info": "",
    "pms": true
  },
  "userLabel": {
    "info": [],
    "pms": true
  },
  "userAvatar": {
    "info": "https://picsum.photos/700",
    "pms": true
  },
  "followerPms": true,
  "followingPms": false,
  "followerNum": 1,
  "followingNum": 1
}

const Profile = ({ navigation }: StackNavigationProps) => {
  //state
  const userId = global.gUserId;
  //个人信息
  const [userInfo, setUserInfo] = useState<userProp>(defaultInfo);
  //显示个人信息
  const { bottom } = useSafeAreaInsets();

  function handleApiResponse(response: {code: number}, callback: () => void) {
    if (response.code == 0) {
      callback();
    }
  }

  async function fetchData() {
    //获取资料
    const resInfo = await requestApi('get', `/profile/${userId}`, null, true, 'getProfile failed')
    setUserInfo(resInfo.data)
  }

  // 编辑个人资料
  const editProfile = () => {
    navigation.navigate("EditProfile");
  }

  // 查看关注列表
  const viewFollowing = () => {
    navigation.navigate("FollowingList",{userId:userId});
  }

  // 查看粉丝列表
  const viewFollower = () => {
    navigation.navigate("FollowersList",{userId:userId});
  }


  // 性别
  const Gender = () => {
    return (<Icon name={userInfo.userGender.info === GENDER.Male ? 'gender-male' : 'gender-female'}
      size={18} color="#32325D" style={{ marginTop: 10 }}>
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
  //导航栏
  const [showMenu, setShowMenu] = useState(false)
    React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight:() => (
        <Menu
          visible={showMenu}
          style={{top:90}}
          onDismiss={()=>{setShowMenu(false)}}
          anchor={<IconButton icon="dots-horizontal"
                onPress={()=>setShowMenu(true)}
                style={{marginRight:10}}
          />}>
          <Menu.Item onPress={() => {}} 
          title={<Icon style={{fontSize:17}} name="file-document-edit-outline">草稿箱</Icon>} />
          <Divider />
          <Menu.Item onPress={() => {}} 
          title={<Icon style={{fontSize:17}} name="account-off-outline">黑名单</Icon>} />
        </Menu>
      )
    });
  }, [navigation, showMenu]);
  return (
    <View style={{ flex: 1, marginBottom: bottom }}>
      <View style={{ flex: 1 }}>
        {/* 资料卡片 */}
        <ImageBackground
          source={profileImage.ProfileBackground}
          style={profileStyles.profileContainer}
          imageStyle={profileStyles.profileBackground}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ width }}
          >
            <Block flex style={profileStyles.profileCard}>
              {/* 头像 */}
              <Block middle style={profileStyles.avatarContainer}>
                <Image
                  source={{ uri: userInfo.userAvatar.info }}
                  style={profileStyles.avatar}
                />
              </Block>
              <Block style={profileStyles.info}>
                {/* 粉丝量信息 */}
                <Block row space="around">
                  <Pressable onPress={viewFollower}>
                    <Block middle>
                      <Text style={profileStyles.infoNum}>
                        {userInfo.followerNum}
                      </Text>
                      <Text style={profileStyles.infoName}>Followers</Text>
                    </Block>
                  </Pressable>
                  <Pressable onPress={viewFollowing}>
                    <Block middle>
                      <Text style={profileStyles.infoNum}>
                        {userInfo.followingNum}
                      </Text>
                      <Text style={profileStyles.infoName}>Following</Text>
                    </Block>
                  </Pressable>
                </Block>
              </Block>
              {/* 用户ID 简介等 */}
              <Block flex>
                {/* 用户昵称 */}
                <Block middle style={profileStyles.nameInfo}>
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
                      <Icon size={16} name="pencil">edit your profile</Icon>
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
                  <Block style={profileStyles.divider} />
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
                <MomentsList navigation={navigation} userId={userId}/>
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