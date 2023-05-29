import { View, Image, StyleSheet, Text, Dimensions, KeyboardAvoidingView, Platform, ImageBackground, Pressable } from 'react-native'
import { Button, IconButton, Avatar, List, Card} from 'react-native-paper';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { StackNavigationProps } from '../../App'
import MyVideoPlayer from '../../components/VideoPlayer';
import Icon from 'react-native-vector-icons/AntDesign';
import ChatRoom from '../../components/ChatRoom';
import requestApi from '../../utils/request';
import { AxiosResponse } from 'axios';
import Modal from 'react-native-modal';
import { defaultInfo, profileImage, userProp } from '../userInfo/Profile';
import { profileStyles } from '../userInfo/Profile.style';

const {width, height} = Dimensions.get("screen");
interface RoomProps {
  roomId:number,
  roomName:string,
  videoUrl:string,
  ownerId:string
}

interface MemberInfoProp {
  userId:string,
  userNickName:string,
  userAvatar:string,
  isFollowing:boolean
}

const defaultMember = {
  userId:'',
  userNickName:'',
  userAvatar:'',
  isFollowing:false
}
const defaultRoom = {
  roomId:1,
  roomName:'一起来玩吧',
  videoUrl:'https://vip.ffzy-play6.com/20221127/8802_3816a20c/2000k/hls/index.m3u8',
  members:['2052909','2052333','2052732'],
  ownerId:'2052909'
}

interface detailProps{
  userInfo:MemberInfoProp
  ownerId:string
  showDetial:boolean
  onBackdropPress:() => void
  navigation:StackNavigationProps['navigation']
}
const UserDetail = (props:detailProps) => {
  const [isfollowing, setFollowing] = useState(props.userInfo.isFollowing)
  // 关注/取消关注用户
  async function toggleFollow() {
    if (isfollowing) { //取关
      await requestApi('post', '/unfollow', {stuid: props.userInfo.userId }, true, 'unfollow failed')
    } else { //关注
      await requestApi('post', '/follow', { stuid: props.userInfo.userId }, true, 'follow failed')
    }
    setFollowing(!isfollowing)
    console.log(isfollowing)
    console.log(props.userInfo.isFollowing)
  }
  useEffect(() => {
    setFollowing(props.userInfo.isFollowing)
  }, [props.userInfo.userId])
  return(
    <Modal
      isVisible={props.showDetial}
      onBackdropPress={props.onBackdropPress}
      style={styles.modalFromBottom}
    >
      <ImageBackground
        source={profileImage.ProfileBackground}
        style={styles.profileContainer}
        imageStyle={styles.profileBackground}
      >
        <View style={profileStyles.profileCard}>
          <View style={[profileStyles.avatarContainer, {alignItems:'center'}]}>
            <Pressable onPress={()=>{
              props.onBackdropPress();
              props.navigation.navigate(
              global.gUserId === props.userInfo.userId?'Profile':'OthersPage',
              {userId:props.userInfo.userId})}}
            >
            <Image
              source={{ uri: props.userInfo.userAvatar}}
              style={profileStyles.avatar}
            />
            </Pressable>
          </View>
          <View>
            <View style={{alignItems:'center'}}>
              <Text style={{fontSize:28,color:"#32325D",fontWeight:'bold'}}>{props.userInfo.userNickName}</Text>
            </View>
            {global.gUserId !== props.userInfo.userId &&
              <View style={{flexDirection:'row', justifyContent:'space-around',marginTop:20}}>
              <Button mode={isfollowing ? 'contained' : "outlined"}
                onPress={toggleFollow}
              >
                {isfollowing ? '取消关注' : "关注"}
              </Button>
              <Button mode='contained-tonal'
              onPress={()=>{props.navigation.navigate('ChatDetail',{userId: props.userInfo.userId})}}
              >
                发私信
              </Button>
              {global.gUserId === props.ownerId &&
               <Button mode='contained'
              onPress={()=>{props.navigation.navigate('ChatDetail',{userId: props.userInfo.userId})}}
              >
                移出房间
              </Button>}
            </View>}
            {global.gUserId === props.userInfo.userId &&
              <View style={{alignItems:'center',marginTop:10}}>
              <Text style={{fontSize:20,color:"#32325D"}}>
                YOU
              </Text>
            </View>
            }
            <View>
            </View>
          </View>
        </View>
      </ImageBackground>
    </Modal>
  )
}
interface MemberListProps{
  ownerId:string,
  members:string [],
  navigation:StackNavigationProps['navigation']
}
const MemberList = (props:MemberListProps) => {
  //成员列表
  const [MemberInfo, setMemberInfo] = useState([] as MemberInfoProp[])
  //查看
  const [viewMember, setViewMember] = useState(false);
  const [member, setMember] = useState(defaultMember)

  async function fetchData(){
    let reqList: Promise<AxiosResponse>[] = [];
    for (let i = 0; i < props.members.length; ++i) {
      reqList.push(new Promise((resolve, reject) => {
        resolve(requestApi('get', `/profile/${props.members[i]}`, null, true, 'get profile failed(In room)'))
      }))
    }
    Promise.all(reqList).then((values) => {
      for (let i = 0; i < values.length; ++i) {
        setMemberInfo(current => [...current, 
          { 
            userId: values[i].data.userId.info, 
            userNickName: values[i].data.userNickName.info, 
            userAvatar:values[i].data.userAvatar.info,
            isFollowing:values[i].data.isFollowing
          }
        ]);
      }
    })
  }

  useEffect(()=>{
    fetchData()
  },[])

  return(
    <View style={{borderRadius:0, paddingBottom:20, backgroundColor:'white'}}>
      <Card.Title
        style={{marginBottom:0}}
        title="房间成员"
        subtitle={"当前"+props.members.length+"人"}
        left={(props) => <List.Icon icon="account-group"/>}
      />
      <View style={styles.memberListContainer}>
        {MemberInfo.map((item, idx) => (
          <View key={idx}>
          <Pressable onPress={()=> {setViewMember(true),setMember(item)}}>
          <Avatar.Image size={40} source={{ uri: item.userAvatar }} 
          style={styles.memberContainer}
          />
          </Pressable>
          <UserDetail 
          showDetial={viewMember} 
          onBackdropPress={()=> setViewMember(false)} 
          navigation={props.navigation}
          ownerId={props.ownerId}
          userInfo={member}
          />
          </View>
        ))}
        <Avatar.Icon size={40} icon='plus' style={styles.memberContainer} />
      </View>
    </View>
  )
}
const RoomInside = ({route, navigation}:StackNavigationProps) => {
  const [roomInfo, setRoomInfo] = useState(defaultRoom)
  //导航栏
  React.useLayoutEffect(() => {
    navigation.setOptions({
    headerTitle:'房间：'+ roomInfo.roomName,
    headerRight:() => ( roomInfo.ownerId == global.gUserId &&
      <IconButton icon="cog-outline" 
      style={{marginRight:10}}
      onPress={() =>{navigation.navigate('EditRoom')}}
      />
    )
  });
  }, [navigation]);
  return (
    <View style={{height:Dimensions.get('screen').height-110}}>
        <MyVideoPlayer navigation={navigation} videoUri={roomInfo.videoUrl}/>
        <MemberList members={roomInfo.members} ownerId={roomInfo.ownerId} navigation={navigation}/>
        <ChatRoom />
    </View>
  )
  useEffect(() => {
    // fetchData()
  }, [])
}

const styles = StyleSheet.create({
  memberListContainer:{
    flexDirection: "row",
    flexWrap: 'wrap',
  },
  memberContainer:{
    marginBottom:5,
    marginLeft:10
  },
  modalFromBottom: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  contentContainer: {
    backgroundColor: 'white',
    paddingTop: 15
  },
  remove:{
    position:'absolute',
    top:-5,
    left:40
  },
  profileContainer: {
    width: width,
    height: height / 2,
    padding: 0,
    zIndex: 1
  },
  profileBackground: {
    width: width,
    height: height / 4
  },
  profileCard: {
    flex: 1,
    marginTop: 30,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: '#FFFFFF',
    shadowColor: "black",
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2
  },
})

export default RoomInside;