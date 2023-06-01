import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';

import { StackNavigationProps } from '../../App'
import requestApi from '../../utils/request';

export const MatchHomePage = ({ route, navigation }: StackNavigationProps) => {
  const [soulMatchPressed, setSoulMatchPressed] = useState(false);
  const [voiceMatchPressed, setVoiceMatchPressed] = useState(false);
  const [videoMatchPressed, setVideoMatchPressed] = useState(false);
  const [userAvatar, setAvatar] = useState('');

  async function getAvatar() {
    const resProfile = await requestApi('get', `/profile/${global.gUserId}`, null, true, 'get profile failed');
    setAvatar(resProfile.data.userAvatar.info);
  }

  const handleSoulMatch = () => {
    // 处理灵魂匹配按钮的点击事件
    console.log('soul');
    setSoulMatchPressed(true);
  };

  const handleVoiceMatch = () => {
    // 处理语音匹配按钮的点击事件
    console.log('voice');
    setVoiceMatchPressed(true);
  };

  const handleVideoMatch = () => {
    // 处理视频匹配按钮的点击事件
    console.log('video');
    setVideoMatchPressed(true);
  };

  const handleSoulMatchRelease = () => {
    setSoulMatchPressed(false);
    navigation.navigate('WaitingPage', {userId:global.gUserId, avatar: userAvatar, type:'灵魂'})
  };

  const handleVoiceMatchRelease = () => {
    setVoiceMatchPressed(false);
    navigation.navigate('WaitingPage', {userId:global.gUserId, avatar: userAvatar, type:'语音'})
  };

  const handleVideoMatchRelease = () => {
    setVideoMatchPressed(false);
    navigation.navigate('WaitingPage', {userId:global.gUserId, avatar: userAvatar, type:'视频'})
  };

  

  useEffect(() => {
    getAvatar();
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('./R1.gif')} style={styles.gif} />
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.matchButton, styles.soulMatchButton]}
          onPress={handleSoulMatch}
          onPressOut={handleSoulMatchRelease}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText]}>灵魂匹配</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.matchButton, styles.voiceMatchButton]}
          onPress={handleVoiceMatch}
          onPressOut={handleVoiceMatchRelease}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText]}>语音匹配</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.matchButton, styles.videoMatchButton]}
          onPress={handleVideoMatch}
          onPressOut={handleVideoMatchRelease}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText]}>视频匹配</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  matchButton: {
    padding: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  soulMatchButton: {
    backgroundColor: '#9B4F9B',
    marginLeft: 20,
    marginRight: 20,
  },
  voiceMatchButton: {
    backgroundColor: '#FFA500',
    marginLeft: 20,
    marginRight: 10,
  },
  videoMatchButton: {
    backgroundColor: '#00C5C5',
    marginLeft: 10,
    marginRight: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  gif: {
    width: 300,
    height: 300,
    marginBottom: 60,
  },
});

export default MatchHomePage;
