import { View, ScrollView, StyleSheet, Text, Dimensions, KeyboardAvoidingView, Platform } from 'react-native'
import { Button, IconButton, Avatar, List, Card} from 'react-native-paper';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { StackNavigationProps } from '../../App'
import MyVideoPlayer from '../../components/VideoPlayer';
import ChatRoom from '../../components/ChatRoom';
import requestApi from '../../utils/request';
import { AxiosResponse } from 'axios';

interface RoomProps {
  roomId:number,
  roomName:string,
  videoUri:string,
  ownerId:string
}

interface MemberInfoProp {
  userId:string,
  userNickName:string,
  userAvatar:string
}
const defaultRoom = {
  roomId:1,
  roomName:'一起来玩吧',
  videoUri:'https://vip.ffzy-play6.com/20221127/8802_3816a20c/2000k/hls/index.m3u8',
  members:['2052909','2052333','2052732'],
  ownerId:'2052909'
}

interface MemberListProps{
  ownerId:string,
  members:string []
}
const MemberList = (props:MemberListProps) => {
  //成员列表
  const [MemberInfo, setMemberInfo] = useState([] as MemberInfoProp[])

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
            userAvatar:values[i].data.userAvatar.info
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
        subtitle="当前3人"
        left={(props) => <List.Icon icon="account-group"/>}
        right={(prop) => props.ownerId == global.gUserId &&
        <IconButton size={20} icon="cog-outline"  onPress={() => {}} />}
      />
      <View style={styles.memberListContainer}>
        {MemberInfo.map((item, idx) => (
          <Avatar.Image size={40} source={{ uri: item.userAvatar }} 
          style={styles.memberContainer}
          key={idx}/>
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
    headerTitle:'房间名：'+ roomInfo.roomName,
    headerRight:() => ( roomInfo.ownerId == global.gUserId &&
      <IconButton icon="cog-outline" 
      style={{marginRight:10}}
      onPress={() =>{navigation.navigate('BlackList')}}
      />
    )
  });
  }, [navigation]);
  return (
    <View style={{height:Dimensions.get('screen').height-110}}>
        <MyVideoPlayer navigation={navigation} videoUri={roomInfo.videoUri}/>
        <MemberList members={roomInfo.members} ownerId={roomInfo.ownerId}/>
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
  }
})

export default RoomInside;