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
import SyncStorage from '../../components/storage';

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
  const usevideo = matchType != '语音';
  let n_stream = new MediaStream(undefined);
  const [local_stream, setLSState] = useState(n_stream);
  const [remote_stream, setRSState] = useState(n_stream);
  let socket: any = gSocket;
  
  //const [peer, setPeer] = useState(new RTCPeerConnection(undefined));
  var turnConf = {
    configuration: {
      offerToReceiveAudio: true,
      offerToReceiveVideo: usevideo
    },
    iceServers: [
      {
        urls: 'stun:stun1.l.google.com:19302', // 免费的 STUN 服务器
      },{
        urls: 'turn:10.80.42.229:7100',
        username: 'jmXXDPoe5M',
        credential: '1iqXgvrmQ3',
      }
    ],
  };
  //let peer: any = null;
  const [peer, setPeer] = useState(new RTCPeerConnection(turnConf));
  const [text, setText] = useState('2053302');
  const handleTextChange = (newText:any) => { setText(newText);};

  // 获取本地摄像头
  const getLocalMedia = async () => {
    let ls = await mediaDevices.getUserMedia({audio: true, video: usevideo}); // {facingMode: { exact: 'environment' }}
    setLSState(ls);
  };
const createRTC = async () => {
  //console.log('@ start create rtc',gUserId,' RTC:', peer._pcId);
  //await setPeer(new RTCPeerConnection(turnConf));
  //peer = new RTCPeerConnection(turnConf);
  setTimeout(() => {
    console.log('@ end create rtc',gUserId,' RTC:', peer._pcId);
  }, 1000);
};
let init_end = false;
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
    peer.setRemoteDescription(answer).catch(e => console.log(e));;
  });
  socket.on('candid', async (data:any) => {
    console.log('@',gUserId,': candid!', data);
    const candid = new RTCIceCandidate(data.candid);
    await peer.addIceCandidate(candid);
  });
};

  const OnPressA = async () => {
    console.log('@',gUserId,' RTC:', peer._pcId);
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
      await peer.setRemoteDescription(offer).catch(e => console.log(e));;
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
    
    console.log('@receiver PRESS A end. PCID=', peer._pcId);
  };
  
  const OnPressB = async () => {
    console.log('@',gUserId,'PRESSED B');
    console.log('@',gUserId,' RTC:', peer._pcId);
    const remote_socket_id = gSenderSocket;
    startCall(remote_socket_id);
    console.log('@receiver PRESS B end. PCID=', peer._pcId);
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
        <Button onPress={()=>{console.log(peer._pcId)}} style={{backgroundColor: '#ff0000'}} />
      </View>
    );
  };

  socket.on('press', async (data:any) => {
      console.log('User:', gUserId, ' 收到press:', data);
      if(data.type == 'A'){
        console.log('User:', gUserId, ' 收到press A');
        //await OnPressA();
      } else {
        console.log('User:', gUserId, ' 收到press B');
        await OnPressB();
      }
  });

  const OnPressBOnce = async () => {
    SyncStorage.setValue('firingOnce', '0');
    if(SyncStorage.getValue('firingOnce') == '0'){
      SyncStorage.setValue('firingOnce', '1');
      OnPressB();
    }
  }

  SyncStorage.setValue('firingOnce1', '0');
  useFocusEffect(()=>{
    if(SyncStorage.getValue('firingOnce1') == '0'){
      SyncStorage.setValue('firingOnce1', '1');
      console.log('User:', gUserId, ' UseFocusEffect:');
      if(matchedUserId == ''){ //我是接受方
        const waitForA = () => {
          if (init_end == true) {
            
          } else setTimeout(waitForA, 500); 
          
        }
        setTimeout(() => {OnPressA();}, 5000);
      } else { //我是发送方
        
        //setTimeout(() => {OnPressB();}, 10000);
      }
    }
  });
  useEffect( () => {
    getLocalMedia().then(() => {
      createRTC().then(() => {
        init_end = true;
        //OnPressA();
      })
    })
    
    if(matchedUserId == ''){ //我是接受方
      
      //setTimeout(() => {OnPressA();}, 2000);
    } else { //我是发送方
      
      //setTimeout(() => {OnPressB();}, 5000);
    }
    return () => {
      console.log('@',gUserId,' RTC:', peer._pcId, 'close!')
      peer.close()
    }
  }, [])

  return (
      <View style={{ flex: 1, alignItems: 'center' }}> 
        <Player />
      </View>
  );
};
export default MatchDetailScreen;