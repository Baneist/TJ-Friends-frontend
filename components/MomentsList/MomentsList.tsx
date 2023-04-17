import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CardwithButtons } from '../../pages/Memories';

export const MomentsList=({onCommentPress}:{onCommentPress:()=>void}) => {
  const { bottom } = useSafeAreaInsets();
  const array = [1, 2, 3, 4, 5];
  return(
    <View style={{ flex: 1, marginBottom: bottom }}>
      <ScrollView>
        <View>
          {array.map((item,idx) => 
          <CardwithButtons key={idx} onCommentPress={onCommentPress}/>)}
        </View>
        {/* eslint-disable-next-line max-len */}
        {/* -> Set bottom view to allow scrolling to top if you set bottom-bar position absolute */}
        <View style={{ height: 90 }} />
      </ScrollView>
    </View>
  );
}
export default MomentsList;