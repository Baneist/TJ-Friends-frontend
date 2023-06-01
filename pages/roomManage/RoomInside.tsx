import { View, Image, StyleSheet, Text, Dimensions, KeyboardAvoidingView, Platform, ImageBackground, Pressable, Alert } from 'react-native'
import { Button, IconButton, Avatar, List, Card, TextInput} from 'react-native-paper';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { StackNavigationProps } from '../../App'
import MyVideoPlayer from '../../components/VideoPlayer';
import Icon from 'react-native-vector-icons/AntDesign';
import ChatRoom from '../../components/ChatRoom';
import requestApi, { requestApiForMockTest } from '../../utils/request';
import { AxiosResponse } from 'axios';
import Modal from 'react-native-modal';
import { defaultInfo, profileImage, userProp } from '../userInfo/Profile';
import { profileStyles } from '../userInfo/Profile.style';

const {width, height} = Dimensions.get("screen");
interface RoomProps {
  roomId:string,
  roomName:string,
  videoUrl:string,
  members:string[],
  roomPwd:string,
  creatorId:string
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
  roomId:'1',
  roomName:'一起来玩吧',
  videoUrl:'https://vip.ffzy-play6.com/20221127/8802_3816a20c/2000k/hls/index.m3u8',
  members:[],
  roomPwd:'',
  creatorId:''
}

interface detailProps{
  userInfo:MemberInfoProp
  roomInfo:RoomProps
  showDetial:boolean
  onBackdropPress:() => void
  onRemoveMember: () => void
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
  }
  //移除成员
  async function leaveRoom(userId: string){
    let data = {
      userId: userId,
      roomId:props.roomInfo.roomId
    }
    console.log(data)
    await requestApi('post', '/leaveRoom', data, true, '移除成员失败')
    props.onRemoveMember()  //界面更新
    props.onBackdropPress()
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
              {global.gUserId === props.roomInfo.creatorId &&
               <Button mode='contained'
              onPress={()=> leaveRoom(props.userInfo.userId)}
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

interface inviteProps{
  roomId:string,
  roomPwd:string,
  roomName:string
}
const InviteFriend = (props:inviteProps) => {
  const [dialogVis, setDialogVis] = useState(false);
  const [stuId, setStuId]=useState('');
  async function invite(){
    setDialogVis(!dialogVis)
    const mes = `加入房间“${props.roomName}”，和我们一起玩吧！\n 房间码：${props.roomId} \n 房间密码：${props.roomPwd}`
    const res = await requestApi('post', '/chat/sendMessage', { image: '' , text: mes , userId: stuId }, true, '发送失败');
  }
  return(
    <View>
      <Pressable onPress={()=>setDialogVis(!dialogVis)}>
          <Avatar.Icon size={40} icon='plus' style={styles.memberContainer} />
      </Pressable>
      <Modal isVisible={dialogVis} onBackdropPress={()=>setDialogVis(!dialogVis)}>
        <Card>
          <Card.Title 
            left={(props) => <List.Icon {...props} icon="account-plus-outline" />}
            title="邀请成员"
          />
          <Card.Content>
            <TextInput
              label="学号"
              value={stuId}
              maxLength={7}
              mode='outlined'
              keyboardType='number-pad'
              onChangeText={text => setStuId(text)}
            />
            <View style={{marginTop:10,backgroundColor:'white',borderRadius:20, borderColor:'#32325D', borderWidth:1, paddingVertical:10}}>
              <Text style={{fontSize:18, marginHorizontal:10, color:'#525F7F'}}>
                加入房间“{props.roomName}”，和我们一起玩吧！
              </Text>
              <Text style={{fontSize:18, marginHorizontal:10, color:'#525F7F'}}>
                房间码：{props.roomId}
              </Text>
              <Text style={{fontSize:18, marginHorizontal:10, color:'#525F7F'}}>
                房间密码：{props.roomPwd}
              </Text>
            </View>
          </Card.Content>
          <Card.Actions>
            <Button onPress={()=>setDialogVis(!dialogVis)}>取消</Button>
            <Button onPress={invite}>确定</Button>
          </Card.Actions>
        </Card>
      </Modal>
    </View>
  )
}

interface MemberListProps{
  roomInfo:RoomProps,
  onRemoveMember: () => void,
  navigation:StackNavigationProps['navigation']
}
const MemberList = (props:MemberListProps) => {
  //成员列表
  const [MemberInfo, setMemberInfo] = useState([] as MemberInfoProp[])
  //成员个数 为了渲染搞一个
  const [memberNum, setMemberNum] = useState(0);
  //查看
  const [viewMember, setViewMember] = useState(false);
  const [member, setMember] = useState(defaultMember)

  async function fetchData(){
    setMemberNum(props.roomInfo.members.length)
    let memberTmp = [] as MemberInfoProp[]  //成员临时变量
    let reqList: Promise<AxiosResponse>[] = [];
    for (let i = 0; i < props.roomInfo.members.length; ++i) {
      reqList.push(new Promise((resolve, reject) => {
        resolve(requestApi('get', `/profile/${props.roomInfo.members[i]}`, null, true, 'get profile failed(In room)'))
      }))
    }
    Promise.all(reqList).then((values) => {
      for (let i = 0; i < values.length; ++i) {
        memberTmp.push(
          { 
            userId: values[i].data.userId.info, 
            userNickName: values[i].data.userNickName.info, 
            userAvatar:values[i].data.userAvatar.info,
            isFollowing:values[i].data.isFollowing
          })
      }
      setMemberInfo(memberTmp)
    })
  }

  useEffect(()=>{
    fetchData()
  },[props])

  return(
      <List.Accordion
      style={{marginBottom:0}}
      title="房间成员"
      description={"当前"+memberNum+"人"}
      left={(props) => <List.Icon icon="account-group"/>}
      >
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
          roomInfo={props.roomInfo}
          onRemoveMember={props.onRemoveMember}
          userInfo={member}
          />
          </View>
        ))}
        <InviteFriend roomId={props.roomInfo.roomId} roomName={props.roomInfo.roomName} roomPwd={props.roomInfo.roomPwd}/>
      </View>
      </List.Accordion>
  )
}
const RoomInside = ({route, navigation}:StackNavigationProps) => {
  const [roomInfo, setRoomInfo] = useState(defaultRoom)
  const isRemoved = useRef(false);

  async function joinRoom(){
    const res = await requestApi('post','/joinRoom',{
      'roomId':route.params?.roomId,
      'roomPwd':route.params?.roomPwd
    }, true, '房间密码错误')
    setRoomInfo(res.data)
  }
  //更新房间信息
  async function updateRoom() {
    if(!isRemoved.current){
      const res = await requestApi('get', 
    `/getRoomInfo?roomId=${route.params?.roomId}`, null, true, '更新房间信息失败')
    setRoomInfo(res.data)
    //检查有没有被移出去
    if(!res.data.members.includes(global.gUserId))
        {
          isRemoved.current = true;
          navigation.goBack()
        }
    }
  }
  //离开房间
  async function leaveRoom(action: any){
    let data = {
      userId: global.gUserId,
      roomId:route.params?.roomId
    }
    await requestApi('post', '/leaveRoom', data, true, '离开房间失败')
    navigation.dispatch(action)
  }
  useEffect(() => {

    //提示是否离开房间
    const onbackpage = navigation.addListener('beforeRemove', (e) => {
      // Prevent default behavior of leaving the screen
      e.preventDefault();
      // Prompt the user before leaving the screen
      if(!isRemoved.current){
        Alert.alert(
          '提示',
          '是否离开该房间？',
          [
            {
              text: "是",
              style: 'destructive',
              // This will continue the action that had triggered the removal of the screen
              onPress: () => leaveRoom(e.data.action)
            },
            {
              text: '取消',
              style: 'cancel',
            },
          ]
        );
      }
      else{
        Alert.alert(
          '提示',
          '你已被房主移出房间',
          [{
            text:'OK',
            onPress : () => navigation.dispatch(e.data.action)
          }]
        )
      }
    });

    //初始加入房间
    joinRoom()

    //定时器，每2s请求一次，同步成员列表信息

    const intervalId = setInterval(() => {
      updateRoom();
    }, 2000);
    return () => {
      clearInterval(intervalId);  //定时器结束
      onbackpage;  //取消监听
    }
  }, [])
  //导航栏
  React.useLayoutEffect(() => {
    navigation.setOptions({
    headerTitle:'房间：'+ roomInfo.roomName,
    headerRight:() => ( roomInfo.creatorId == global.gUserId &&
      <IconButton icon="cog-outline" 
      style={{marginRight:10}}
      onPress={() =>{navigation.navigate('EditRoom', {roomId:roomInfo.roomId})}}
      />
    )
  });
  }, [navigation, roomInfo]);
  //离开房间

  return (
    <View style={{height:Dimensions.get('screen').height-110}}>
        <MyVideoPlayer navigation={navigation} 
        videoUri={roomInfo.videoUrl} 
        roomId={roomInfo.roomId}
        creatorId={roomInfo.creatorId}
        />
        <MemberList roomInfo={roomInfo} navigation={navigation} onRemoveMember={updateRoom}/>
        <ChatRoom roomId={roomInfo.roomId} navigation={navigation}/>
    </View>
  )
}

const styles = StyleSheet.create({
  memberListContainer:{
    flexDirection: "row",
    flexWrap: 'wrap',
    backgroundColor:'white',
    paddingVertical:10
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