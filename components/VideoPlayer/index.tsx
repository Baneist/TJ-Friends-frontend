import * as ScreenOrientation from 'expo-screen-orientation'
import { Dimensions, ScrollView, StyleSheet, Text } from 'react-native'
import { ResizeMode } from 'expo-av'
import { Button, IconButton} from 'react-native-paper';
import React, { useRef, useState } from 'react'
import VideoPlayer from 'expo-video-player'
import { StackNavigationProps } from '../../App'


interface PlayerProps{
  navigation:StackNavigationProps['navigation'],
  videoUri:string
}

const MyVideoPlayer = (props:PlayerProps) => {
  const [inFullscreen, setInFullsreen] = useState(false)
  const refVideo2 = useRef(null)
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
  return (
      <VideoPlayer
        videoProps={{
          shouldPlay: true,
          resizeMode: ResizeMode.CONTAIN,
          source: {
            uri: props.videoUri,
          },
          ref: refVideo2,
        }}
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