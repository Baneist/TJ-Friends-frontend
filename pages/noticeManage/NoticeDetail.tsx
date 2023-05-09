import React, { useState, useEffect }  from 'react';
import { StackNavigationProps } from '../../App';
import Badge from '../../components/NoticeManage/NoticeBadge';
import {DialogBadge} from '../../components/NoticeManage/NoticeBadge';
import {IconButton} from 'react-native-paper';
import { View, Text,Image, StyleSheet, Dimensions, Alert, TouchableOpacity, FlatList, RefreshControl, ScrollView} from 'react-native';
import axios from 'axios';
import { NoticeCardDetailed } from "../../components/NoticeManage/NoticeCard";
import requestApi, {requestApiForMockTest} from '../../utils/request';
import { useFocusEffect } from '@react-navigation/native';

const styles = StyleSheet.create({
  btscreen: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    height: 100,
    width: Dimensions.get('window').width,
    backgroundColor: '#fcfcfc',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 10,
  },
  label1: {
    fontSize: 12,
  },
  sys_msg_list: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 100,
    backgroundColor: '#fcfcfc',
    marginTop: 20,
  },
});

const noticeDetailedData = {
  code:77,
  data:[{
    sendMessage:"",
    senderName:"",
    senderAvatar:"",
    timeStamp:"",
    undealNum:0,
    originPostId:0,
    originPostTitle:"",
    originCommentId:0,
    noticeId:0,
  },
  ]
};

interface NoticeDetailScreenProps {
  type: string;
};
const NoticeDetailScreen = ({ route, navigation}: StackNavigationProps) => {
    const typ = route.params?.type;
    React.useLayoutEffect(() => {
      navigation.setOptions({
        title: typ == 'like' ? '喜欢我的' : typ == 'comment' ? '评论我的' : 'repo' == typ ? '转发我的' : '关注我的',
      });
    }, [navigation]);
    const [refreshing_notice, setRefreshingNoticeDetailed] = useState(false);
    const [nddata, setndData] = useState(noticeDetailedData);
    const [upstate, setUPState] = useState(1);
    async function getNoticeDetailed() {
      const norep = await requestApi('post', `/notice/readNoticeByType/${typ}`, null, true, '发送已读通知失败.');
      const response = await requestApi('get', `/notice/getNoticeByType/${typ}`, null, true, '读取系统通知失败.');
      const datarecv = response;
      setndData(datarecv);
      setRefreshingNoticeDetailed(false);
      console.log('Refresh: Notice Manage Get.');
    }
    const onRefresh = () => {// 发送 GET 请求获取新增提醒数据
      setRefreshingNoticeDetailed(true);
      getNoticeDetailed();
    };
    useEffect(() => {// 发送 GET 请求获取新增提醒数据
      getNoticeDetailed();
    }, []);
    useFocusEffect(React.useCallback(() => {
      getNoticeDetailed();
      return () => {
      };
    }, [upstate]));

    const notice_items = nddata.data.map((item:any, index:number) => 
    <NoticeCardDetailed
      key={index}
      message={item.sendMessage}
      timeStamp={new Date(item.timeStamp)}
      senderName={item.senderName}
      senderAvatar={item.senderAvatar}
      undealNum={item.undealNum}
      originCommentId={item.originCommentId}
      originPostTitle={item.originPostTitle}
      originPostId={item.originPostId}
      noticeId={item.noticeId}
      upstate={upstate}
      setUPState={setUPState}
      type={typ}
      navigatior={navigation.navigate}
      />
  );
    return (
        <ScrollView refreshControl={
          <RefreshControl refreshing={refreshing_notice} onRefresh={onRefresh} />
        }>
          <View>
            {notice_items}
          </View>
          <View style={{marginTop:20, alignItems: 'center'}}>
            <Text>--已经到底啦--</Text>
          </View>
        </ScrollView>
    );
  };
  
  export default NoticeDetailScreen;