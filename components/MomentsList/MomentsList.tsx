import React,{useState,useEffect} from 'react';
import { ScrollView, View,Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CardwithButtons } from '../../pages/memoryManage/Memories';
import requestApi from '../../utils/request';
import { StackNavigationProps } from '../../App';
import { useFocusEffect } from '@react-navigation/native';
import { AxiosResponse } from 'axios';

export interface PostsProps{
  navigation:StackNavigationProps["navigation"],
  userId:string,
}
const MomentsList=(props: PostsProps) => {
  const { bottom } = useSafeAreaInsets();
  const onCommentPress = (postID: string) => {
    props.navigation.navigate('Comment', { postId: postID });
  }

  function clickAvatar() {
    props.navigation.navigate('OthersPage',{userId:props.userId});
  }

  const [list, setlist] = useState([] as any[]);
  async function fetchData() {
    const res = await requestApi('get', `/getUserMemories/${props.userId}`,null, true, 'get user memories faild')
    if(res.code === 0){
      setlist(res.data)
      console.log(props.userId,list)
    }
    else{
      console.log('get user memories faild', res.code)
      console.log(res.msg)
      console.log(props.userId)
    }
  }

  async function deleteMomery(postId: string) {
    const res = await requestApi('get', `/deleteMemory/${postId}`, null, true, '动态删除失败');
    if (res.code == 0) {
      console.log(postId)
      fetchData()
    }
  };
  
  useFocusEffect(
    React.useCallback(() => {
      console.log(props.userId)
      fetchData()
      return () => {
      };
    }, [])
  );

  return (
    <View style={{ flex: 1, marginBottom: bottom }}>
        <View>
          {list.map((item, index) =>
            <CardwithButtons
              key={index}
              content={item}
              onCommentPress={() => onCommentPress(item.postId)}
              onDelete = {() => deleteMomery(item.postId)}
              navigation={props.navigation}
            />)}
          {list.length===0 && 
            <View style={{flex:1, alignItems:'center'}}>
              <Text style={{color:'#525F7F', marginTop:20}}>---暂无更多---</Text>
            </View>
          }
        </View>
    </View>
  );
}
export default MomentsList;