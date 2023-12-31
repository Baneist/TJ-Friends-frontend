import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Alert, Dimensions, Image, ImageBackground, Pressable, ScrollView, View } from "react-native";
import { Button, Chip, List, IconButton, Divider } from 'react-native-paper';
import { Block, Text } from "galio-framework";
import Icon from 'react-native-vector-icons/AntDesign';
import { StackNavigationProps } from '../../App'
import { defaultInfo, userProp } from "./Profile";
import { followProp } from "./FollowingList";
import requestApi from "../../utils/request";
import { profileStyles } from "./Profile.style";
import { GENDER } from "./Profile";
import MomentsList from "../../components/MomentsList/MomentsList";
import ChatDetail from "../ChatManage/ChatDetail";
import { useFocusEffect } from '@react-navigation/native';
import Modal from 'react-native-modal';

//获取屏幕宽高
const { width } = Dimensions.get("screen");

//图片
const profileImage = {
  ProfileBackground: require("../../assets/imgs/profile-screen-bg.png"),
  ProfilePicture: 'https://picsum.photos/700'
}

interface ModalOptionsProps{
  showOption:boolean,
  onBlock:() => void,
  onComplaint:() => void,
  onBackdropPress:() => void
}
const ModalOptions = (props:ModalOptionsProps) =>{
  return(
      <Modal
      isVisible={props.showOption}
      onBackdropPress={props.onBackdropPress}
      style={profileStyles.modalFromBottom}
      >
      <View style={profileStyles.contentContainer}>
        <Button
        style={profileStyles.optionBtn} 
        onPress={props.onBlock}
        >加入黑名单</Button>
        <Divider />
        <Button
        style={profileStyles.optionBtn} 
        onPress={props.onComplaint}>举报</Button>
        <Divider />
        <Button style={profileStyles.optionBtn}
        onPress={props.onBackdropPress}>取消</Button>
      </View>
    </Modal>
  )
}

const OthersPage = ({route, navigation }: StackNavigationProps) => {
  //state
  const curUser = global.gUserId; //当前用户
  const pageid = route.params?.userId; //所查看主页的用户
  //个人信息
  const [userInfo, setUserInfo] = useState<userProp>(defaultInfo);
  //粉丝 关注列表
  const [followerNum, setFollowerNum] = useState(0);
  const [followingNum, setFollowingNum] = useState(0);
  //被当前用户关注了
  const [isfollowing, setFollowing] = useState(false);
  //拉黑选项
  const [blockOption, setBlockOption] = useState(false);
  //显示个人信息
  const { bottom } = useSafeAreaInsets();

  function handleApiResponse(response: {code: number}, callback: () => void) {
    if (response.code == 0) {
      callback();
    }
  }
  //导航栏
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ marginRight: 10 }}>
          <IconButton icon="dots-horizontal" 
          onPress={()=> {setBlockOption(true)}}
          />
        </View>
      ),
    });
  }, [navigation]);

  async function fetchData() {
    //获取资料、关注列表和粉丝列表
    const resInfo = await requestApi('get', `/profile/${pageid}`, null, true, 'getProfile failed')
    setUserInfo(resInfo.data)
    setFollowerNum(resInfo.data.followerNum)
    setFollowingNum(resInfo.data.followingNum)
    setFollowing(resInfo.data.isFollowing)
  }

  useFocusEffect(
    React.useCallback(() => {
      fetchData()
      return () => {
      };
    }, [])
  );
  // useEffect(() => {
  //   //获取数据
  //   fetchData()

  // }, [])

  //查看关注列表
  function viewFollowing() {
    if (userInfo.followingPms)
      navigation.navigate('FollowingList',{userId:pageid})
    else {
      Alert.alert('关注列表暂不可见')
    }
  }

  //查看粉丝列表
  function viewFollower() {
    if (userInfo.followerPms)
      navigation.navigate('FollowersList',{userId:pageid})
    else {
      Alert.alert('粉丝列表暂不可见')
    }
  }

  //关注/取关
  // 关注/取消关注用户
  async function toggleFollow() {
    if (isfollowing) { //取关
      const res = await requestApi('post', '/unfollow', {stuid: pageid }, true, 'unfollow failed')
    } else { //关注
      console.log(pageid)
      const res = await requestApi('post', '/follow', { stuid: pageid }, true, 'follow failed')
    }
    //不能先set取反 因为用的是旧值快照
    setFollowerNum(followerNum + (isfollowing ? -1 : 1));
    setFollowing(!isfollowing)
  }
  //拉黑
  function onBlock(){
    Alert.alert(
      "提示",
      "是否确定拉黑该用户？",
      [
        {
          text:'OK',
          onPress:() =>{setBlockOption(false)}
        },
        {
          text:'Cancel',
          onPress:() => {setBlockOption(false)}
        }
      ]
    )
  }
  //投诉
  function onComplaint(){
    setBlockOption(false)
    navigation.navigate('ComplaintUser', {userId:pageid})
  }

  // 性别
  const Gender = () => {
    return (<Icon name={userInfo.userGender.info === GENDER.Male ? 'man' : 'woman'}
      size={16} color="#32325D" style={{ marginTop: 10 }}>
      {userInfo.userGender.info === GENDER.Male ? GENDER.Male : GENDER.Female}
    </Icon>);
  }
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
            <ModalOptions 
            showOption={blockOption}
            onBlock={onBlock}
            onComplaint={onComplaint}
            onBackdropPress={()=>{setBlockOption(false)}}
            />
            <Block flex style={profileStyles.profileCard}>
              {/* 头像 */}
              <Block middle style={profileStyles.avatarContainer}>
                <Image
                  source={{ uri: userInfo.userAvatar.info }}
                  style={profileStyles.avatar}
                />
              </Block>
              <Block style={profileStyles.info}>
                {/* 发私信之类的 */}
                <Block
                  middle
                  row
                  space='around'
                  style={{ marginTop: 20, paddingBottom: 24 }}
                >
                  <Button mode={isfollowing ? 'contained' : "outlined"}
                    onPress={toggleFollow}
                  >
                    {isfollowing ? '取消关注' : "关注"}
                  </Button>
                  <Button mode='contained-tonal'
                  onPress={()=>{navigation.navigate('ChatDetail',{userId: pageid})}}
                  >
                    发私信
                  </Button>
                </Block>
                {/* 粉丝量信息 */}
                <Block row space="around">
                  <Pressable onPress={viewFollower}>
                    <Block middle>
                      <Text style={profileStyles.infoNum}>
                        {followerNum}
                      </Text>
                      <Text style={profileStyles.infoName}>Followers</Text>
                    </Block>
                  </Pressable>
                  <Block middle>
                      <Text style={profileStyles.infoNum}>
                        0%
                      </Text>
                      <Text style={profileStyles.infoName}>Suitability</Text>
                  </Block>
                  <Pressable onPress={viewFollowing}>
                    <Block middle>
                      <Text style={profileStyles.infoNum}>
                        {followingNum}
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
                        description={
                          userInfo.userBirthDate.pms ?
                            userInfo.userBirthDate.info : '暂不可见'
                        }
                        left={props => <List.Icon {...props} icon="cake-variant" />}
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
                        left={props => <List.Icon {...props} icon="school" />}
                      />
                      <List.Item title="兴趣爱好"
                        description={
                          userInfo.userInterest.pms ?
                            userInfo.userInterest.info : '暂不可见'
                        }
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
                <MomentsList navigation={navigation} userId={pageid}/>
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


export default OthersPage;