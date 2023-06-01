import React, { useState, useEffect, useRef } from 'react';
import { StackNavigationProps } from '../../App';
import Badge from '../../components/NoticeManage/NoticeBadge';
import { IconButton } from 'react-native-paper';
import { View, Text, Image, StyleSheet, Dimensions, Alert, TouchableOpacity, FlatList, RefreshControl, ScrollView, TextInput } from 'react-native';
import { NoticeCard } from '../../components/NoticeManage/NoticeCard';
import { useFocusEffect } from '@react-navigation/native';
import requestApi, { requestApiForMockTest } from '../../utils/request';
import { Button } from 'react-native-elements';
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
    top: 50
  }
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
        <Modal
          isVisible={true}
          style={styles.modal}
          hasBackdrop={false}
          animationIn={'fadeIn'}
        >
          <RTCView style={{ height:195, width: 130,  }} streamURL={local_stream.toURL()} />
        </Modal>
        <RTCView style={{ height: height - 191, width: width }} streamURL={local_stream.toURL()} />
      </View>
    );
  };

  useEffect(() => {
    getLocalMedia()
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <Player/>
    </View>
  );
};
export default MatchDetailScreen;