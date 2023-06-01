import React, { useState, useEffect, useRef }  from 'react';
import { StackNavigationProps } from '../../App';
import Badge from '../../components/NoticeManage/NoticeBadge';
import {IconButton} from 'react-native-paper';
import { View, Text,Image, StyleSheet, Dimensions, Alert, TouchableOpacity, FlatList, RefreshControl, ScrollView, TextInput} from 'react-native';
import { NoticeCard } from '../../components/NoticeManage/NoticeCard';
import { useFocusEffect } from '@react-navigation/native';
import requestApi, { requestApiForMockTest } from '../../utils/request';
import { Button } from 'react-native-elements';
import {io, Socket} from 'socket.io-client';

import {
  ScreenCapturePickerView,
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
} from 'react-native-webrtc';

const styles = StyleSheet.create({
  container: {},
  input: {
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
});

//MainCode <Example></Example> 
export const MatchDetailScreen = ({ route, navigation }: StackNavigationProps) => {
  const matchType = route.params?.matchType;
  const matchedUserId = route.params?.matchedUserId;
  const usevideo = matchType == '语音' ? false : true;
  let n_stream = new MediaStream(undefined);
  const [local_stream, setLSState] = useState(n_stream);
  const [remote_stream, setRSState] = useState(n_stream);
  let socket:any = gSocket;
  let peer:any = null;

  const [text, setText] = useState('2053302');
  const handleTextChange = (newText:any) => { setText(newText);};

  // 获取本地摄像头
  const getLocalMedia = async () => {
    let ls = await mediaDevices.getUserMedia({audio: true, video: usevideo}); // {facingMode: { exact: 'environment' }}
    setLSState(ls);
  };
  var turnConf = {
    configuration: {
      offerToReceiveAudio: true,
      offerToReceiveVideo: usevideo
    },
    iceServers: [
      
    ],
  };
/*
{
        urls: 'stun:stun1.l.google.com:19302', // 免费的 STUN 服务器
      },{
        urls: 'turn:10.80.42.229:7100',
        username: 'jmXXDPoe5M',
        credential: '1iqXgvrmQ3',
      }
*/
const createRTC = async () => {
  peer = new RTCPeerConnection(turnConf);
};
const socketInit = async () => {
  let sock = io(`http://10.80.42.217:9800/webrtc`, { auth: { userid: gUserId, role: 'sender', }, });
  sock.on('connect', async () => {
    console.log('连接成功, 上传socket:', sock.id); 
    const res = await requestApi('post',`/match/uploadSocketId`, {socketId: sock.id}, true, '上传 SocketId 失败');
  });
  socket = sock;
};
const startCall = async (socket_id:any) => {
  await local_stream.getTracks().forEach((track) => {
    console.log('@addTrack:', track);
    peer.addTrack(track, local_stream);
  });
  const offer = await peer.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: usevideo });
  console.log()
  console.log('@sender SetLocalDescription start.');
  await peer.setLocalDescription(offer);
  console.log('@sender SetLocalDescription end.');
  socket.emit('offer', {
    to: socket_id,
    offer: offer,
  });
  peer.onicecandidate = async (event:any) => {
    console.log('@sender onicecandidate:', event);
    if (event.candidate) {
      setTimeout(() => {
        socket.emit('candid', {
          to: socket_id, // 接收端 Socket ID
          candid: event.candidate,
        });
      }, 600);
    }
  };
  socket.on('answer', (data:any) => {
    console.log('@sender get answer!', data);
    peer.ontrack = async (event:any) => {
      console.log('@receiver ontrack:', event);
      let [remoteStream] = event.streams;
      setRSState(remoteStream);
      remote_stream.addTrack(event.track);
    };
    let answer = new RTCSessionDescription(data.answer);
    peer.setRemoteDescription(answer);
  });
  socket.on('candid', async (data:any) => {
    console.log('@',gUserId,': candid!', data);
    const candid = new RTCIceCandidate(data.candid);
    await peer.addIceCandidate(candid);
  });
};
const getRemoteIdByUserId = async (usrId: string) => {
  const res = await requestApi('get', `/match/getSocketId/${usrId}`, null,  true, '获取 SocketId 失败');
  console.log('getRemoteIdByUserId:', res.data.socketId);
  return res.data.socketId;
};
  useEffect(() => {
    getLocalMedia().then(() => {
        createRTC().then(() => {
          if(matchedUserId == ''){ //我是接受方
            OnPressA();
          } else { //我是发送方
            setTimeout(() => {
              OnPressB();
            }, 600);
          }
        });
    });
    return () => {
      
    }
  }, [])

  const OnPressA = async () => {
    console.log('@',gUserId,'PRESSED A');
    console.log('@',gUserId,' RTC:', peer._pcId);
    socket.on('candid', async (data:any) => {
      console.log('@',gUserId,': candid!', data);
      const candid = new RTCIceCandidate(data.candid);
      await peer.addIceCandidate(candid);
    });
    socket.on('offer', (data:any) => {
      transMedia(data);
    });
    const transMedia = async (data: any) => {
      console.log('@',gUserId,' RTC:', peer)
      let offer = new RTCSessionDescription(data.offer);
      peer.ontrack = async (event:any) => {
        console.log('@receiver ontrack:', event);
        let [remoteStream] = event.streams;
        setRSState(remoteStream);
        remote_stream.addTrack(event.track);
      };
      console.log('@receiver get data, startSetRemoteDescription.\n', data.offer);
      await peer.setRemoteDescription(offer);
      console.log('@receiver SetLocalDescription end.')
      await local_stream.getTracks().forEach((track) => {
        console.log('@addTrack:', track);
        peer.addTrack(track, local_stream);
      });
      let answer = await peer.createAnswer();
      console.log('@receiver SetLocalDescription start.')
      await peer.setLocalDescription(answer);
      console.log('@receiver SetLocalDescription end.')
      //setTimeout(() => {peer.setLocalDescription(answer)}, 2000);
      console.log('@receiver send answer:', answer);
      socket.emit('answer', {
        to: data.from, // 呼叫端 Socket ID
        answer: answer,
      });
      peer.onicecandidate = (event:any) => {
        console.log('@receiver onicecandidate:', event);
        if (event.candidate) {
          setTimeout(() => {
            socket.emit('candid', {
              to: data.from, // 呼叫端 Socket ID
              candid: event.candidate,
            });
          }, 600);
        }
      };
    };
    
    // 发送 candidate
    
    
  };
  
  const OnPressB = async () => {
    console.log('@',gUserId,'PRESSED B');
    console.log('@',gUserId,' RTC:', peer._pcId);
    const remote_socket_id = await getRemoteIdByUserId(text);
    startCall(remote_socket_id);
  };

  const Player = () => {
    return (
      <View>
        <Button onPress={OnPressA} style={{borderColor: '#0000ff'}} />
        <Text> 自己： </Text>
        <RTCView style={{ height: 300, width: 400}} streamURL={local_stream.toURL()} />
        <TextInput style={styles.input} onChangeText={handleTextChange} value={text}/>
        <Button onPress={OnPressB} style={{backgroundColor: '#ff0000'}} />
        <Text> 对方： </Text>
        <RTCView style={{ height: 300, width: 400 }} streamURL={remote_stream.toURL()} />
      </View>
    );
  };

  return (
      <View style={{ flex: 1, alignItems: 'center' }}> 
        <Player />
      </View>
  );
};
export default MatchDetailScreen;