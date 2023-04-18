import React,{useState,useEffect} from 'react';
import { ScrollView, View,Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CardwithButtons } from '../../pages/Memories';
import requestApi from '../../utils/request';
import { StackNavigationProps } from '../../App';
import { useFocusEffect } from '@react-navigation/native';
import { AxiosResponse } from 'axios';

interface PostIdProps{
  navigation:StackNavigationProps["navigation"],
  userID:string,
}

export const MomentsList=(props: PostIdProps) => {
  const { bottom } = useSafeAreaInsets();
  const onCommentPress = (postID: string) => {
    props.navigation.navigate('Comment', { postId: postID });
  }

  function clickAvatar() {
    props.navigation.navigate('OthersPage',{userId:props.userID});
  }

  const [list, setlist] = useState([] as any[]);
  async function fetchData() {
    console.log('page userID',props.userID)
    const res = await requestApi('get', `/getUserMemories/${props.userID}`,null, true, 'get user memories faild')
    if(res.code === 0){
      setlist(res.data)
      console.log(list)
    }
    else{
      console.log('get user memories faild', res.code)
      console.log(res.msg)
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      fetchData()
      return () => {
      };
    }, [])
  );

  return (
    <View style={{ flex: 1, marginBottom: bottom }}>
      <ScrollView>
        <View>
          {list.map((item, index) =>
            <CardwithButtons
              key={index}
              content={item}
              onCommentPress={() => onCommentPress(item.postId)}
              navigation={props.navigation}
            />)}
          {list.length===0 && 
            <View style={{flex:1, alignItems:'center'}}>
              <Text style={{color:'#525F7F', marginTop:20}}>---暂无更多---</Text>
            </View>
          }
        </View>
        {/* eslint-disable-next-line max-len */}
        {/* -> Set bottom view to allow scrolling to top if you set bottom-bar position absolute */}
        <View style={{ height: 90 }} />
      </ScrollView>
    </View>
  );
}
export default MomentsList;