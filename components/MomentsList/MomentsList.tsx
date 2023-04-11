import React from 'react';
import { Pressable, ScrollView, View, Image, StyleSheet } from 'react-native';
import { Button, Card, IconButton, Divider, FAB } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/AntDesign';
import { useState } from 'react';
import Modal from 'react-native-modal';
import { Props } from '../../App';
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