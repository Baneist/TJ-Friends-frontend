import * as ScreenOrientation from 'expo-screen-orientation'
import { Dimensions, ScrollView, StyleSheet, Text } from 'react-native'
import { AVPlaybackStatus, ResizeMode } from 'expo-av'
import { Button, IconButton} from 'react-native-paper';
import React, { useEffect, useRef, useState } from 'react'
import VideoPlayer from 'expo-video-player'
import { StackNavigationProps } from '../../App'
import requestApi from '../../utils/request';
import { set } from 'react-native-reanimated';


interface PlayerProps{
  navigation:StackNavigationProps['navigation'],
  creatorId:string,
  roomId:string,
  videoUri:string
}

const MyVideoPlayer = (props:PlayerProps) => {
  const [inFullscreen, setInFullsreen] = useState(false)
  const refVideo = useRef(null)
  const [shouldPlay, setShouldPlay] = useState(false)
  const [positionMillis, setPositionMillis] = useState(0)
    //导航栏
    React.useLayoutEffect(() => {
        props.navigation.setOptions({
        headerShown:!inFullscreen
      });
      console.log(props.videoUri)
    }, [props.navigation,inFullscreen]);

    //全屏回调
    async function fullScreenCallBack() {
      if(!inFullscreen){ //进入全屏
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
          setInFullsreen(!inFullscreen)
      }
      else{ //退出全屏
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
          setInFullsreen(!inFullscreen)
      }
  }
  //视频播放同步
  async function SynchronizeVideo(status:AVPlaybackStatus){
    let dateFormat = require('date-format');
    let date = new Date();
    let formatted = dateFormat('yyyy-MM-dd hh:mm:ss', date);
    if(status.isLoaded && props.creatorId == global.gUserId){  //仅房主更新进度
      let data = {
        roomId: props.roomId,
        positionMillis: status.positionMillis,
        shouldPlay:status.isPlaying,
        curTime:formatted
      }
      await requestApi('post', '/updateProgress', data, true, '更新视频进度失败')
    }
  }

  //获取视频进度
  async function getCurProgress() {
    const res = await requestApi('get', `/getProgress?roomId=${props.roomId}`,null, true, '获取视频进度失败' )
    setShouldPlay(res.data.shouldPlay)
    let time_before = new Date(res.data.curTime)
    let time_now = new Date()
    let diff = Math.abs(positionMillis - res.data.positionMillis) + Math.abs(time_now.getTime() - time_before.getTime());
    let offset = time_now.getTime() - time_before.getTime()
    if(diff >= 10000 && res.data.shouldPlay)
      setPositionMillis(res.data.positionMillis + offset)
  }
  useEffect(() => {
    if(global.gUserId !== props.creatorId){
      getCurProgress()
    }
    const intervalId = setInterval(() => {
      if(global.gUserId !== props.creatorId){
        getCurProgress()
      }
    }, 2000);
    return () => clearInterval(intervalId);
  }, [props]);
  return (
      <VideoPlayer
        videoProps={{
          positionMillis:positionMillis,
          progressUpdateIntervalMillis:5000,  //进度更新回调频率
          shouldPlay: shouldPlay,
          resizeMode: ResizeMode.CONTAIN,
          source: {
            uri: props.videoUri,
          },
          ref: refVideo,
        }}
        playbackCallback = {(status: AVPlaybackStatus)=> SynchronizeVideo(status)}
        fullscreen={{
          inFullscreen: inFullscreen,
          enterFullscreen: fullScreenCallBack,
          exitFullscreen: fullScreenCallBack
        }}
        icon={{
          fullscreen:<IconButton icon='fullscreen' size={30} iconColor='white'/>,
          exitFullscreen: <IconButton icon='fullscreen-exit' size={50} iconColor='white'/>
        }}
        style={{
          videoBackgroundColor: 'black',
          height: inFullscreen?Dimensions.get('window').width:200,
          width: inFullscreen?Dimensions.get('window').height:Dimensions.get('window').width
        }}
      />
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default MyVideoPlayer