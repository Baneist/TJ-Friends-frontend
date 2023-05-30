import React, { useState, useEffect, useRef }  from 'react';
import { StackNavigationProps } from '../../App';
import Badge from '../../components/NoticeManage/NoticeBadge';
import {IconButton} from 'react-native-paper';
import { View, Text,Image, StyleSheet, Dimensions, Alert, TouchableOpacity, FlatList, RefreshControl, ScrollView} from 'react-native';
import { NoticeCard } from '../../components/NoticeManage/NoticeCard';
import { useFocusEffect } from '@react-navigation/native';
import requestApi, { requestApiForMockTest } from '../../utils/request';
import { TwilioVideo, TwilioVideoLocalView, TwilioVideoParticipantView} from 'react-native-twilio-video-webrtc';

export const MatchDetailScreen = ({ route, navigation }: StackNavigationProps) => {
    
  return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}> 
        <Text> 进去了 </Text>
      </View>
  );
};

export default MatchDetailScreen;