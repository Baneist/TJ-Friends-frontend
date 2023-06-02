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
    top: 40,
  },
  userphoto: {
    width: 45,
    height: 45,
    borderRadius: 22,
  },
});

//MainCode <Example></Example> 
export const MatchDetailScreen = ({ route, navigation }: StackNavigationProps) => {
  const matchType = route.params?.matchType;
  const matchedUserId = route.params?.matchedUserId;
  const usevideo = matchType != '语音';
  let n_stream = new MediaStream(undefined);
  const [local_stream, setLSState] = useState(n_stream);

  // 获取本地摄像头
  const getLocalMedia = async () => {
    console.log('1234')
    let ls = await mediaDevices.getUserMedia({ audio: true, video: true}); // {facingMode: { exact: 'environment' }}
    setLSState(ls);
  };
  const { width, height } = Dimensions.get("screen");
  const Player = () => {
    return (
      <View >
        <RTCView style={{ height: height - 91, width: width }} streamURL={local_stream.toURL()} />
        <Modal
          isVisible={true}
          style={styles.modal}
          hasBackdrop={false}
          animationIn={'fadeIn'}
          coverScreen={false}
        >
          <RTCView style={{ height:195, width: 130,  }} streamURL={local_stream.toURL()} />
        </Modal>
      </View>
    );
  };

  useEffect(() => {
    getLocalMedia()
  }, [])

  return (
    <View style={{ flex: 1,backgroundColor:'white' }}>
      <Player/>
      <Modal
        isVisible={true}
        style={{justifyContent:'flex-end',margin:0}}
        hasBackdrop={false}
      >
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            height: 90,
            backgroundColor: '#fff',
            alignItems: 'center',
            paddingBottom: 15,
            paddingTop:10
          }}>
            <Image source={{ uri: "https://picsum.photos/400" }} style={styles.userphoto} />
            <Text>username</Text>
            <Button onPress={()=>navigation.goBack()} 
            mode='contained' 
            style={{
              backgroundColor:'#ef0000'
            }}
            >结束通话</Button>
          </View>
      </Modal>
    </View>
  );
};
export default MatchDetailScreen;