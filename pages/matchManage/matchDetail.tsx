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
import Peer from 'react-native-peerjs';

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
import { set } from 'react-native-reanimated';

//MainCode <Example></Example> 
export const MatchDetailScreen = ({ route, navigation }: StackNavigationProps) => {
  let n_stream = new MediaStream(undefined);
  const [local_stream, setLSState] = useState(n_stream);
  const [remote_stream, setRSState] = useState(n_stream);
  const [localPeer, setLPeerState] = useState(new Peer());
  const [RemotePeer, setRPeerState] = useState(new Peer());
  const [remoteId, setRemoteId] = useState('');
  // 获取本地摄像头
  const getLocalMedia = async (st: Function) => {
    let ls = await mediaDevices.getUserMedia({audio: true, video: true,});
    st(ls);
  };
  
  const endCall = () => {
    
  }

  const createPeer = () => {
    
  }
  
  const VideoCall = async () => {
    setLPeerState(new Peer());
    setRPeerState(new Peer());
    console.log('@in:');
    await getLocalMedia(setLSState);
    localPeer.on('open', function(id: any){
      console.log('@local onopen.');
      //setTimeout(() => {}, 10000);
    });
    RemotePeer.on('open', function(id: any){
      console.log('@remote onopen.');
      setRemoteId(id);
    });
    RemotePeer.on('connection', function(conn: any) {
      console.log('@remote onconnection.');
    });
    RemotePeer.on('call', async (call: any) => {
      console.log('@remote oncall.');
      call.on('stream', function(stream) {
        console.log('@remote stream:' + stream.toURL());
        setRSState(stream);
      });
      setTimeout(() => {
        call.answer(local_stream);
      }, 2000);
    });
    
  };

  /*
  useFocusEffect(React.useCallback(() => {
    if(local_stream != n_stream){
      VideoCall();
    }
    return () => {
    };
  }, [local_stream]));
  */
  //VideoCall();
  ///*

  useEffect(() => {
    VideoCall()
    return () => {
      endCall()
    }
  }, [])

  const OnPress = async () => {
    localPeer.connect(remoteId);
    console.log('@local call.');
        const call = localPeer.call(remoteId, local_stream);
        call.on('stream', (stream:any ) => {
          console.log('@local stream:' + stream.toURL());
          //setRSState(stream);
        });
        call.on('data', (data: any) => {
          console.log('@local data:' + data);
        });
        call.on('close', () => {
          console.log('@local close.');
        });
        call.on('error', (err: any) => {
          console.log('@local error:' + err);
        });
  };

  const Player = () => {
    return (
      <View>
        <Button onPress={OnPress} />
        <Text> 自己： </Text>
        <RTCView style={{ height: 200, width: 200 }} streamURL={local_stream.toURL()} />
        <Text> 远程： </Text>
        <RTCView style={{ height: 200, width: 200 }} streamURL={remote_stream.toURL()} />
      </View>
    );
  };

  return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}> 
        <Player />
      </View>
  );
};

export const MatchDetailScreen2 = ({ route, navigation }: StackNavigationProps) => {
  const [loading, setLoading] = useState(true);
  const [localId, setLocalId] = useState('');
  const [remoteId, setRemoteId] = useState('');
  const [messages, setMessages] = useState([]);
  const [customMsg, setCustomMsg] = useState('');
  let n_stream = new MediaStream(undefined);
  const currentCall = useRef();
  const currentConnection = useRef();
  const peer = useRef()
  const localVideo = useRef(n_stream);
  const remoteVideo = useRef(n_stream);

  useEffect(() => {
    createPeer()
    return () => {
      endCall()
    }
  }, [])

  const endCall = () => {
    if (currentCall.current) {
      currentCall.current.close()
    }
  }

  const createPeer = () => {
    peer.current = new Peer();
    peer.current.on("open", (id) => {
      setLocalId(id)
      setLoading(false)
      console.log(id);
    });
    peer.current.on('connection', (connection) => {
      // 接受对方传来的数据
      connection.on('data', (data) => {
        
      })
      currentConnection.current = connection
    })
    // 媒体传输
    peer.current.on('call', async (call) => {
      if (window.confirm(`是否接受 ${call.peer}?`)) {
        // 获取本地流
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        localVideo.current = stream
        // 响应
        call.answer(stream)
        console.log("call.answer");
        // 监听视频流，并更新到 remoteVideo 上
        call.on('stream', (stream) => {
          remoteVideo.current = stream;
          console.log("call.stream");
        })
        currentCall.current = call
      } else {
        call.close()
        alert('已关闭')
      }
    })
  }

  return (
    <View>
          <Text>localId = {localId}</Text>
          <Text>本地摄像头</Text>
          <RTCView style={{ height: 200, width: 200 }} streamURL={localVideo.current.toURL()} />
          <Text>远程摄像头</Text>
          <RTCView style={{ height: 200, width: 200 }} streamURL={remoteVideo.current.toURL()} />
    </View>
  );
}

export default MatchDetailScreen;
