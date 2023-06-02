import React, { useState, useEffect, useRef } from 'react';
import {Button} from 'react-native-paper'
import { StackNavigationProps } from '../../App';
import Badge from '../../components/NoticeManage/NoticeBadge';
import { IconButton } from 'react-native-paper';
import { View, Text, Image, StyleSheet, Dimensions, Alert, TouchableOpacity, FlatList, RefreshControl, ScrollView, TextInput } from 'react-native';
import { NoticeCard } from '../../components/NoticeManage/NoticeCard';
import { useFocusEffect } from '@react-navigation/native';
import requestApi, { requestApiForMockTest } from '../../utils/request';
import { io, Socket } from 'socket.io-client';
import Modal from 'react-native-modal';
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
import { transparent } from 'react-native-paper/lib/typescript/src/styles/themes/v2/colors';
import { VoicePlayer } from './VoiceMatch';



const styles = StyleSheet.create({
  container: {},
  input: {
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  modal: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    top: 50
  }
});

//MainCode <Example></Example> 
export const MatchDetailScreen = ({ route, navigation }: StackNavigationProps) => {
  SyncStorage.setValue('firingOnceReturn', '0');
  const matchUserInfoDemo = {
    username: '匹配用户',
    userAvatar: 'https://img2.baidu.com/it/u=2186443610,2577257885&fm=26&fmt=auto&gp=0.jpg',
  }
  const { width, height } = Dimensions.get("screen");
  const matchType = route.params?.matchType;
  const matchedUserId = route.params?.matchedUserId;
  const usevideo = matchType == '视频';
  let n_stream = new MediaStream(undefined);
  const [local_stream, setLSState] = useState(n_stream);
  const [remote_stream, setRSState] = useState(n_stream);
  let socket: any = gSocket;
  const [userA, setUserA] = useState(matchUserInfoDemo);
  const [userB, setUserB] = useState(matchUserInfoDemo);

  //const [peer, setPeer] = useState(new RTCPeerConnection(undefined));
  const turnConf = {
    configuration: {
      offerToReceiveAudio: true,
      offerToReceiveVideo: usevideo
    },
    iceServers: [
      {
        urls: 'stun:stun1.l.google.com:19302', // 免费的 STUN 服务器
      }, {
        urls: 'turn:10.80.42.229:7100',
        username: 'jmXXDPoe5M',
        credential: '1iqXgvrmQ3',
      }
    ],
  };
  /*
  
  */
  //let peer: any = null;
  const [peer, setPeer] = useState(new RTCPeerConnection(turnConf));
  const [text, setText] = useState('2053302');
  const handleTextChange = (newText:any) => { setText(newText);};

  // 获取本地摄像头
  const getLocalMedia = async () => {
    console.log('1234')
    let ls = await mediaDevices.getUserMedia({ audio: true, video: true}); // {facingMode: { exact: 'environment' }}
    setLSState(ls);
  };
  const createRTC = async () => {
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
      console.log('@receiver SetRemoteDescription end.')
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

  const VideoPlayer = () => {
    return (
      <View >
        <RTCView style={{ height: height - 191, width: width }} streamURL={remote_stream.toURL()} />
        <Modal
          isVisible={true}
          style={styles.modal}
          hasBackdrop={false}
          animationIn={'fadeIn'}
          
        >
          <RTCView style={{ height:195, width: 130 }} streamURL={local_stream.toURL()} />
        </Modal>
        <Modal
          isVisible={true}
          style={{justifyContent:'center'}}
          hasBackdrop={false}
          animationIn={'fadeIn'}
        >
          <Button style={{width:80, height:40, margin:2}} mode='contained' onPress={testA}>退出</Button>
        </Modal>
        
      </View>
    );
  };
  //coverScreen={false}

  const testA = () => {
    console.log('return');
    socket.emit('return', {
      to: gSenderSocket
    });
    navigation.pop();
  };
  /*
    const testB = () => {};
    <Button style={{width:80,height:80,margin:10}} mode='contained' onPress={testB}>b</Button>
  */

  socket.on('press', async (data:any) => {
      console.log('User:', gUserId, ' 收到press:', data);
      if(data.type == 'A'){
        console.log('User:', gUserId, ' 收到press A');
        //await OnPressA(); 
      } else {
        console.log('User:', gUserId, ' 收到press B');
        setIsCallActive(true);
        await OnPressB();
      }
  });
  
    
      
  socket.on('return', async (data:any) => {
    if(SyncStorage.getValue('firingOnceReturn') == '0'){
      SyncStorage.setValue('firingOnceReturn', '1');
      alert('对方已挂断');
      navigation.pop();
    }
});

  const OnPressBOnce = async () => {
    SyncStorage.setValue('firingOnce', '0');
    if(SyncStorage.getValue('firingOnce') == '0'){
      SyncStorage.setValue('firingOnce', '1');
      OnPressB();
    }
  }
  const OnPressAA = () => {
    OnPressA().then(() => {
      console.log('ONPRESS AA');
      socket.emit('callPress', {
        to: gSenderSocket
      })
    });
  };

  const initUserInfo = async () => {
    const res = await requestApi('get', `/profile/${gOtherUserId}`, null, true, '获取对方UserInfo失败');
    setUserA({username: res.data.userName.info, userAvatar: res.data.userAvatar.info});
    const res2 = await requestApi('get', `/profile/${gUserId}`, null, true, '获取自己UserInfo失败');
    setUserB({username: res2.data.userName.info, userAvatar: res2.data.userAvatar.info});
  };

  SyncStorage.setValue('firingOnce1', '0');
  useFocusEffect(()=>{
    if(SyncStorage.getValue('firingOnce1') == '0'){
      SyncStorage.setValue('firingOnce1', '1');
      console.log('User:', gUserId, ' UseFocusEffect:');
      if(matchedUserId == ''){ //我是接受方
        setTimeout(() => {OnPressAA(); setIsCallActive(true)}, 3000);
      } else { //我是发送方
        
        //setTimeout(() => {OnPressB();}, 10000);
      }
    }
  });
  useEffect( () => {
    console.log(gUserId, '我的 matchType:', matchType, ' matchedUserId:', matchedUserId);
    getLocalMedia().then(() => {
      createRTC().then(() => {
        initUserInfo();
        init_end = true;
        //OnPressA();
      })
    })
    return () => {
      console.log('@',gUserId,' RTC:', peer._pcId, 'close!')
      peer.close()
      if(local_stream){
        local_stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
      if(remote_stream){
        remote_stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
      gSocket.close();
      gSocket = null;
    }
  }, [])
  const [isCallActive, setIsCallActive] = useState(false);
  return (
    <View style={{ flex: 1 }}>
      {matchType == '视频' ? <VideoPlayer /> : <VoicePlayer local_stream={local_stream} remote_stream={remote_stream} isCallActive={isCallActive} callend={testA} userA={userA} userB={userB}/>}
    </View>
  );
};
export default MatchDetailScreen;