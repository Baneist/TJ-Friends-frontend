import React, { useState, useEffect }  from 'react';
import { StackNavigationProps } from '../../App';
import Badge from '../../components/NoticeManage/NoticeBadge';
import {DialogBadge} from '../../components/NoticeManage/NoticeBadge';
import {IconButton} from 'react-native-paper';
import { View, Text,Image, StyleSheet, Dimensions, Alert, TouchableOpacity, FlatList, RefreshControl, ScrollView} from 'react-native';
import axios from 'axios';
import { NoticeCardDetailed } from "../../components/NoticeManage/NoticeCard";
import requestApi, {requestApiForMockTest} from '../../utils/request';

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
    sendMessage:"id Lorem est mollit",
    senderName:"现受强写建",
    senderAvatar:"http://dummyimage.com/100x100",
    timeStamp:"2017-10-26 16:56:04",
    undealNum:0,
    originPostId:0,
    originPostTitle:"东西找不到了..",
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
    const [refreshing_notice, setRefreshingNoticeDetailed] = useState(false);
    const [nddata, setndData] = useState(noticeDetailedData);
    const nd_addr = "https://mock.apifox.cn/m1/2539601-0-default/notice/1/getNoticeByType/1";
    async function getNoticeDetailed() {
      const response = await requestApiForMockTest('get', `/notice/getNoticeByType/${typ}`, null, true, '读取系统通知失败');
      console.log(response);
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