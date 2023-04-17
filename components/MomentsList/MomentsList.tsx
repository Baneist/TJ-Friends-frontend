import React,{useState,useEffect} from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CardwithButtons } from '../../pages/Memories';
import requestApi from '../../utils/request';
import { StackNavigationProps } from '../../App';

interface PostIdProps{
  navigation:StackNavigationProps["navigation"],
  postIDs:number[],
}

export const MomentsList=(props: PostIdProps) => {
  const { bottom } = useSafeAreaInsets();
  const onCommentPress = (postID: string) => {
    props.navigation.navigate('Comment', { postId: postID });
  }

  function clickAvatar() {
    props.navigation.navigate('OthersPage');
  }

  const [list, setlist] = useState([] as any[]);
  let memorylist = [] as any[];

  async function fetchData() {
    const res = await requestApi('get', '/Memories', null, true, 'getMemories failed')
    if (res.code == 0) {
      memorylist = memorylist.concat(res.data);
      setlist(memorylist);
    }
  }

  useEffect(() => {
    fetchData()
  },)

  return (
    <View style={{ flex: 1, marginBottom: bottom }}>
      <ScrollView>
        <View>
          {list.map((item, index) =>
            <CardwithButtons
              key={index}
              content={item}
              onCommentPress={() => onCommentPress(item.postId)}
              clickAvatar={clickAvatar}
              navigation={props.navigation}
            />)}
        </View>
        {/* eslint-disable-next-line max-len */}
        {/* -> Set bottom view to allow scrolling to top if you set bottom-bar position absolute */}
        <View style={{ height: 90 }} />
      </ScrollView>
    </View>
  );
}
export default MomentsList;