import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { StackNavigationProps } from '../../App';
import {io, Socket} from 'socket.io-client';
import requestApi, { LinkSocket } from '../../utils/request';

const WaitingPage = ({ route, navigation }: StackNavigationProps) => {
  let savedUserId = '';
  let socket:any = null;
  const turnInPage = (matchedUserId:any, matchType:any, socket:any) => {
    gSocket = socket;
    if(matchType == '灵魂'){
      navigation.navigate('ChatDetail', {userId: savedUserId});
    } else {
      navigation.navigate('MatchDetailScreen', {matchedUserId: matchedUserId, matchType:matchType});
    }
  };
  const socketInit = async () => {
    socket = LinkSocket();
    await requestApi('post', `/startMatch`, null,  true, '发送匹配信息失败');
    const res = await requestApi('get', `/queryMatch`, null,  true, '获取匹配信息失败');
    const mtUserId = res.data.match;
    savedUserId = mtUserId;
    console.log('我匹配到的人的mtUserId是:', mtUserId);
    if(mtUserId == ''){
      //是接收方
      console.log('我是接收方',gUserId);
      socket.on('sayhi', (data:any) => {
        console.log
        savedUserId = data.userId;
        console.log('接受方sayhi:', data.userId);
        gSenderSocket = data.from;
        socket.emit('sayhi', {
          to: data.from,
          userId: gUserId,
          type: 'A',
        });
        //然后进入详情匹配页面
        requestApi('post', `/endMatch`, null,  true, '发送结束匹配信息失败');
        console.log('进入详情匹配页面:', gUserId, 'type:', route.params?.type);
        turnInPage(mtUserId, route.params?.type, socket);
      });
    } else {
      //是发送方
      console.log('我是发送方',gUserId);
      const res = await requestApi('get', `/match/getSocketId/${mtUserId}`, null,  true, '获取 SocketId 失败');
      console.log('getRemoteIdByUserId:', res.data.socketId);
      gSenderSocket = res.data.socketId;
      socket.emit('sayhi', {
        to: res.data.socketId,
        userId: gUserId,
        type: 'B',
      });
      socket.on('sayhi', (data:any) => {
        //然后进入详情匹配页面
        requestApi('post', `/endMatch`, null,  true, '发送结束匹配信息失败');
        console.log('进入详情匹配页面:', gUserId, 'type:', route.params?.type);
        turnInPage(mtUserId, route.params?.type, socket);
      });
    }
    
    
  };
  useEffect(() => {
    socketInit();
    return () => {
      socket.disconnect();
      requestApi('post', `/endMatch`, null,  true, '发送结束匹配信息失败');
    }
  }, [])
  return (
    <View style={styles.container}>
      <Image source={{ uri: route.params?.avatar }} style={styles.image} />
      <View style={styles.indicatorContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
      <Text style={styles.boldText}>准备进行{route.params?.type}匹配</Text>
      <Text style={styles.text}>正在努力匹配中，请耐心等待</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
  },
  boldText: {
    marginTop: 40,
    fontSize: 20,
    fontWeight: 'bold',
  },
  indicatorContainer: {
    marginTop: 40, 
  },
  text: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default WaitingPage;
