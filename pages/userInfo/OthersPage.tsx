import React , {useState}from "react";
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
import {Button, List, Chip, IconButton} from 'react-native-paper';
import { Block,Text} from "galio-framework";
import Icon from 'react-native-vector-icons/AntDesign';
import { MomentsList } from "../../components/MomentsList/MomentsList";
import {Props} from '../../App'
import CardwithButtons from "../Memories";
import request from "../../utils/request";
import axios from "axios";

//获取屏幕宽高
const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

//图片
const profileImage = {
  ProfileBackground : require("../../assets/imgs/profile-screen-bg.png"),
  ProfilePicture: 'https://picsum.photos/700'
}

//个人信息
const userInfo = {
  userId:{"info":'2052123',"permission":true},
  userName:{"info":'吉尔伽美什',"permission":true},
  userNickName: {"info":'Gilgamesh',"permission":true},
  userGender: {"info":'Male',"permission":true},
  userBirthDate:{"info":'2002-08-07',"permission":false},
  userStatus:{"info":'Enuma Elish!',"permission":true},
  userMajor:{"info":'愉悦',"permission":true},
  userPhone:{"info":'123',"permission":true},
  userYear:{"info":'2020',"permission":true},
  userInterest:{"info":'喜欢钱和一切金闪闪的东西，还有哈哈哈哈哈哈（是个快乐的男人！）',"permission":true},
  userLabel : {"info":[
    '金闪闪','帅','金发','红瞳','AUO','愉悦教主','强','黄金三靶'
  ],"permission":true},
  followerPms:false,
  followingPms:true
}

//用户标签
const userLabel = [
  '金闪闪','帅','金发','红瞳','AUO','愉悦教主','强','黄金三靶'
]
const array = [1, 2, 3, 4, 5];

//性别
function Gender(){
  if(userInfo.userGender.info=='Male')
    return (
    <Icon name="man" size={16} color="#32325D" style={{ marginTop: 10 }}>Male</Icon>
    )
  else
    return (<Icon name="woman" size={16} color="#32325D" style={{ marginTop: 10 }}>Female</Icon>)
}
//更多信息

//资料页面


const OthersPage = ({route, navigation}:Props) =>{
  //显示个人信息
  const [showInfo, setShowInfo] = useState(false);
  const { bottom } = useSafeAreaInsets();
  //查看关注列表
  function viewFollowing(){
    if(userInfo.followingPms)
        navigation.navigate('FollowingList')
  }
  //查看粉丝列表
  function viewFollower(){
    if(userInfo.followerPms)
        navigation.navigate('FollowersList')
  }
  function onCommentPress(){
    navigation.navigate('Comment')
  }
  return (
    <View style={{flex:1,  marginBottom: bottom}}>
      <View style={{flex:1}}>
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
                  <Image 
                    source={{ uri: profileImage.ProfilePicture }}
                    style={styles.avatar}
                  />
                </Block>
                <Block style={styles.info}>
                    {/* 发私信之类的 */}
                    <Block
                    middle
                    row
                    space="evenly"
                    style={{ marginTop: 20, paddingBottom: 24 }}
                  >
                    <Button mode='contained'
                    >
                      关注
                    </Button>
                    <Button mode='contained-tonal'
                    >
                      发私信
                    </Button>
                  </Block>
                  {/* 粉丝量信息 */}
                  <Block row space="between">
                  <Pressable onPress={viewFollower}>
                    <Block middle>
                        <Text style={styles.infoNum}>
                          2K
                        </Text>
                      <Text style={styles.infoName}>Followers</Text>
                    </Block>
                    </Pressable>
                    <Pressable onPress={viewFollowing}>
                    <Block middle>
                      <Text style={styles.infoNum}>
                        10
                      </Text>
                      <Text style={styles.infoName}>Following</Text>
                    </Block>
                    </Pressable>
                    <Pressable onPress={viewFollower}>
                    <Block middle>
                        <Text style={styles.infoNum}>
                          188
                        </Text>
                      <Text style={styles.infoName}>Likes</Text>
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
                  </Block>
                  <Block middle>
                    {/* 标签 */}
                  <List.Section style={{width: width / 1.1}}>
                    <List.Accordion
                        title="标签"
                        left={props => <List.Icon {...props} icon="label-multiple" />}>
                      <View style={{flex:1,flexDirection:"row",flexWrap:'wrap'}}>
                          {userInfo.userLabel.info.map((label, idx)=>
                          <Chip key={idx} style={{marginRight:10,marginBottom:10}} mode='outlined' >{label}</Chip>
                          )}
                        </View>
                    </List.Accordion>
                  </List.Section>
                    {/* 查看更多信息 */}
                    <List.Section style={{width: width / 1.1}}>
                      <List.Accordion
                        title="view more"
                        left={props => <List.Icon {...props} icon="balloon" />}>
                        <List.Item title="学号/姓名"
                        description={userInfo.userId.info + '/' + userInfo.userName.info}
                        left={props => <List.Icon {...props} icon="emoticon-outline" />}
                        />
                        <List.Item title="生日" 
                        description={
                          userInfo.userBirthDate.permission?
                          userInfo.userBirthDate.info:'暂不可见'
                        }
                        left={props => <List.Icon {...props} icon="cake-variant" />}
                        />
                        <List.Item title="学年/专业"
                        description={
                            userInfo.userYear.permission?
                            userInfo.userYear.info:'暂不可见'+
                            '/'+
                            userInfo.userMajor.permission?
                            userInfo.userMajor.info:'暂不可见'}
                        left={props => <List.Icon {...props} icon="school" />}
                        />
                        <List.Item title="兴趣爱好" 
                        description={
                            userInfo.userInterest.permission?
                            userInfo.userInterest.info:'暂不可见'
                        }
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
                  <Text bold size={16} color="#525F7F" style={{marginTop: 12, marginLeft: 12}}>
                    Moments
                  </Text>
                  <MomentsList onCommentPress={onCommentPress}/>
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
    marginTop: 130,
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
  },
  infoNum:{
    marginBottom: 4,
    color:'#525F7F',
    fontSize:20,
    fontWeight:'bold'
 },
  infoName:{
  fontSize:12
},
});

export default OthersPage;