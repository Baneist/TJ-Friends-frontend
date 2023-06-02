import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { StackNavigationProps } from '../../App';

const CallScreen = ({ route, navigation }: StackNavigationProps) => {
  const [callTime, setCallTime] = useState(0);
  const [isCallActive, setIsCallActive] = useState(true);

  useEffect(() => {
    let timer;
    if (isCallActive) {
      timer = setInterval(() => {
        setCallTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isCallActive]);

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    const formattedTime = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
    return formattedTime;
  };

  const padZero = (number) => {
    return number.toString().padStart(2, '0');
  };

  const handleHangUp = () => {
    // 执行挂断操作
    setIsCallActive(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleHangUp}>
          <Icon name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Image source={{ uri: route.params?.otherAvatar }} style={styles.avatar} />
        <Text style={styles.callerName}>route.params?.otherName</Text>
        <Text style={styles.callTime}>{formatTime(callTime)}</Text>
        <Image source={{ uri: route.params?.myAvatar }} style={styles.avatar} />
        <Text style={styles.callerName}>route.params?.myName</Text>
      </View>
      <View style={styles.footer}>
        {/* 添加其他必要元素，如静音按钮、切换摄像头按钮等 */}
        <TouchableOpacity onPress={handleHangUp} style={styles.hangUpButton}>
          <Icon name="phone" size={36} color="#FF0000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -100, 
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
  },
  callerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 48,
  },
  callTime: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 48,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  hangUpButton: {
    borderWidth: 3,
    borderColor: '#FF0000',
    padding: 8,
    borderRadius: 24,
  },
});

export default CallScreen;
