import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { StackNavigationProps } from '../App';

const WaitingPage = ({ route, navigation }: StackNavigationProps) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: route.params?.avatar }} style={styles.image} />
      <View style={styles.indicatorContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
      <Text style={styles.boldText}>准备进行语音匹配</Text>
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
    marginTop: 40, // 增加图像和加载动画之间的距离
  },
  text: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default WaitingPage;
