import React, {useEffect, useState} from "react";
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Dimensions, Image, ImageBackground, Pressable, ScrollView, View} from "react-native";
import {Button, Chip, List} from 'react-native-paper';
import {Block, Text} from "galio-framework";
import Icon from 'react-native-vector-icons/AntDesign';
import {MomentsList} from "../../components/MomentsList/MomentsList";
import {StackNavigationProps} from '../../App'
import {defaultInfo, userProp} from "./Profile";
import requestApi from "../../utils/request";
import handleAxiosError from "../../utils/handleError";
import {styles} from "./Profile.style";

//获取屏幕宽高
const {width} = Dimensions.get("screen");

//图片
const profileImage = {
  ProfileBackground: require("../../assets/imgs/profile-screen-bg.png"),
  ProfilePicture: 'https://picsum.photos/700'
}

//更多信息

//资料页面


const Profile = ({navigation}: StackNavigationProps) => {
  //state
  const curUser = '2053302'; //当前用户
  const pageid = '2053186'; //所查看主页的用户
  //个人信息
  const [userInfo, setUserInfo] = useState<userProp>(defaultInfo);
  //粉丝 关注列表
  const [followerNum, setFollowerNum] = useState(0);
  const [followingNum, setFollowingNum] = useState(0);
  //被当前用户关注了
  const [isfollowing, setFollowing] = useState(false);
  //显示个人信息
  const {bottom} = useSafeAreaInsets();

  //初始化
  async function fetchData() {
    //获取资料
    //获取资料
    try {
      const resInfo = await requestApi('get', `/profile/${pageid}`, null, null, true);
      if (resInfo.data.code == 0) {
        setUserInfo(resInfo.data.data);
      } else {
        console.log('code err', resInfo.data.code)
      }
      //获取关注列表
      try {
        const resFollowing = await requestApi('get', `/profile/${pageid}/followings`, null, null, true);
        if (resFollowing.data.code == 0) {
          console.log(resFollowing.data.data)
          setFollowingNum(resFollowing.data.data.followings.length);
        } else {
          console.log('code err', resFollowing.data.code)
        }
      } catch (error) {
        handleAxiosError(error);
      }
      //获取粉丝列表
      try {
        const resFollower = await requestApi('get', `/profile/${pageid}/followers`, null, null, true);
        if (resFollower.data.code == 0) {
          setFollowerNum(resFollower.data.data.followers.length);
          setFollowing(resFollower.data.data.followers.indexOf(curUser) != -1);
        } else {
          console.log('code err', resFollower.data.code)
        }
      } catch (error) {
        handleAxiosError(error);
      }
    } catch (error) {
      handleAxiosError(error);
    }
  }

  useEffect(() => {
    //获取数据
    fetchData()
  }, [])

  //编辑个人资料
  function editProfile() {
    navigation.navigate('EditProfile')
  }

  //查看关注列表
  function viewFollowing() {
    if (userInfo.followingPms)
      navigation.navigate('FollowingList')
    else {
      console.log('暂不可见')
    }
  }

  //查看粉丝列表
  function viewFollower() {
    if (userInfo.followerPms)
      navigation.navigate('FollowersList')
    else {
      console.log('暂不可见')
    }
  }

  //关注/取关
  // 关注/取消关注用户
  async function toggleFollow() {
    if (isfollowing) { //取关
      try {
        const res = await requestApi('post', '/unfollow', {stuid: pageid}, null, true)
        if (res.status == 200) {
          setFollowing(!isfollowing)
          setFollowingNum(followingNum + (isfollowing ? 1 : -1));
        } else {
          console.log('res.status')
        }
      } catch (error) {
        handleAxiosError(error);
      }
    } else { //关注
      try {
        const res = await requestApi('post', '/follow', {stuid: pageid}, null, true)
        if (res.status == 200) {
          setFollowing(!isfollowing)
        } else {
          console.log('res.status')
        }
      } catch (error) {
        handleAxiosError(error);
      }
    }
  }

  function onCommentPress() {
    navigation.navigate('Comment')
  }

  //性别
  function Gender() {
    if (userInfo.userGender.info == 'Male')
      return (<Icon name="man" size={16} color="#32325D" style={{marginTop: 10}}>Male</Icon>)
    else
      return (<Icon name="woman" size={16} color="#32325D" style={{marginTop: 10}}>Female</Icon>)
  }

  return (
    <View style={{flex: 1, marginBottom: bottom}}>
      <View style={{flex: 1}}>
        {/* 资料卡片 */}
        <ImageBackground
          source={profileImage.ProfileBackground}
          style={styles.profileContainer}
          imageStyle={styles.profileBackground}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{width}}
          >
            <Block flex style={styles.profileCard}>
              {/* 头像 */}
              <Block middle style={styles.avatarContainer}>
                <Image
                  source={{uri: userInfo.userAvatar.info}}
                  style={styles.avatar}
                />
              </Block>
              <Block style={styles.info}>
                {/* 发私信之类的 */}
                <Block
                  middle
                  row
                  space='around'
                  style={{marginTop: 20, paddingBottom: 24}}
                >
                  <Button mode={isfollowing ? 'contained' : "outlined"}
                          onPress={toggleFollow}
                  >
                    {isfollowing ? '取消关注' : "关注"}
                  </Button>
                  <Button mode='contained-tonal'
                  >
                    发私信
                  </Button>
                </Block>
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
                  <Gender/>
                </Block>
                <Block middle>
                  {/* 标签 */}
                  <List.Section style={{width: width / 1.1}}>
                    <List.Accordion
                      title="标签"
                      left={props => <List.Icon {...props} icon="label-multiple"/>}>
                      <View style={{flex: 1, flexDirection: "row", flexWrap: 'wrap'}}>
                        {userInfo.userLabel.info.map((label, idx) =>
                          <Chip key={idx} style={{marginRight: 10, marginBottom: 10}} mode='outlined'>{label}</Chip>
                        )}
                      </View>
                    </List.Accordion>
                  </List.Section>
                  {/* 查看更多信息 */}
                  <List.Section style={{width: width / 1.1}}>
                    <List.Accordion
                      title="view more"
                      left={props => <List.Icon {...props} icon="balloon"/>}>
                      <List.Item title="学号/姓名"
                                 description={userInfo.userId.info + '/' + userInfo.userName.info}
                                 left={props => <List.Icon {...props} icon="emoticon-outline"/>}
                      />
                      <List.Item title="生日"
                                 description={
                                   userInfo.userBirthDate.pms ?
                                     userInfo.userBirthDate.info : '暂不可见'
                                 }
                                 left={props => <List.Icon {...props} icon="cake-variant"/>}
                      />
                      <List.Item title="学年/专业"
                                 description={
                                   userInfo.userYear.pms ?
                                     userInfo.userYear.info : '暂不可见'
                                     + '/'
                                     +
                                     userInfo.userMajor.pms ?
                                       userInfo.userMajor.info : '暂不可见'
                                 }
                                 left={props => <List.Icon {...props} icon="school"/>}
                      />
                      <List.Item title="兴趣爱好"
                                 description={
                                   userInfo.userInterest.pms ?
                                     userInfo.userInterest.info : '暂不可见'
                                 }
                                 left={props => <List.Icon {...props} icon="heart"/>}
                      />
                    </List.Accordion>
                  </List.Section>
                </Block>
                {/* 分割线 */}
                <Block middle style={{marginTop: 16, marginBottom: 16}}>
                  <Block style={styles.divider}/>
                </Block>
                {/* 个性签名 */}
                <Block middle>
                  <Text
                    size={16}
                    color="#525F7F"
                    style={{textAlign: "center"}}
                  >
                    {userInfo.userStatus.info}
                  </Text>
                </Block>
                {/* 动态列表 */}
                <Text bold size={16} color="#525F7F" style={{marginTop: 12, marginLeft: 12}}>
                  Moments
                </Text>
                <MomentsList onCommentPress={onCommentPress}/>
              </Block>
            </Block>
            {/* eslint-disable-next-line max-len */}
            {/* -> Set bottom view to allow scrolling to top if you set bottom-bar position absolute */}
            <View style={{height: 190}}/>
          </ScrollView>
        </ImageBackground>
      </View>
    </View>
  )
}


export default Profile;