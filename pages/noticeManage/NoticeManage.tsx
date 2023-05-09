import React, { useState, useEffect }  from 'react';
import { StackNavigationProps } from '../../App';
import Badge from '../../components/NoticeManage/NoticeBadge';
import {DialogBadge} from '../../components/NoticeManage/NoticeBadge';
import {IconButton} from 'react-native-paper';
import { View, Text,Image, StyleSheet, Dimensions, Alert, TouchableOpacity, FlatList, RefreshControl, ScrollView} from 'react-native';
import axios from 'axios';
import { NoticeCard } from '../../components/NoticeManage/NoticeCard';
import { useFocusEffect } from '@react-navigation/native';
import requestApi, { requestApiForMockTest } from '../../utils/request';


export const styles = StyleSheet.create({
  btscreen: {
    flexDirection: 'row',
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

interface NoticeManageProps {
   count: number;
   onPress: any;
}

function NoticeLikeButton({count, onPress} : NoticeManageProps) {
  return (
    <View style={{ alignItems: 'center' }}>
      <IconButton icon='heart' key={'heart'} size={30} onPress={onPress}/>
      <Text style={styles.label1}>喜欢我的</Text>
      {count > 0 && <Badge count={count} />}
    </View>
  );
}

function NoticeCommentButton({count, onPress} : NoticeManageProps) {
  return (
    <View style={{ alignItems: 'center' }}>
      <IconButton icon='comment' key={'comment'} size={30} onPress={onPress} />
      <Text style={styles.label1}>评论我的</Text>
      {count > 0 && <Badge count={count} />}
    </View>
  );
}

function NoticeShareButton({count, onPress} : NoticeManageProps) {
  return (
    <View style={{ alignItems: 'center' }}>
      <IconButton icon='share' key={'share'} size={30} onPress={onPress} />
      <Text style={styles.label1}>转发我的</Text>
      {count > 0 && <Badge count={count} />}
    </View>
  );
}

function NoticeFollowButton({count, onPress} : NoticeManageProps) {
  return (
    <View style={{ alignItems: 'center' }}>
      <IconButton icon='eye' key={'share'} size={30} onPress={onPress} />
      <Text style={styles.label1}>我关注的</Text>
      {count > 0 && <Badge count={count} />}
    </View>
  );
}

const num4eachData = {
   code: 200,
   data: {
    commentNum: 0,
    followNum: 0,
    likeNum: 0,
    repoNum: 0,
   }
};

const messageData = {
  code:77,
  data:[{
    message:"id Lorem est mollit",
    senderName:"现受强写建",
    senderAvatar:"http://dummyimage.com/100x100",
    timeStamp:"2017-10-26 16:56:04",
    senderUserId:"1",
    unreadedNum:1,
  },
  ]
}
;

const NoticeManageScreen = ({ route, navigation }: StackNavigationProps) => {
  const httpGetAllMessage = 'https://mock.apifox.cn/m1/2539601-0-default/notice/1/getAllSystemNotice';
  const httpGetAllNoticeNum = 'https://mock.apifox.cn/m1/2539601-0-default/notice/1/num4each';
  const [refreshing_notice, setRefreshingNotice] = useState(false);
  const [refreshing_message, setRefreshingMessage] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [n4edata, setnum4eachData] = useState(num4eachData);
  const [amsdata, setamsData] = useState(messageData);
  const [upstate, setUPState] = useState(1);
  
  async function getNoticeMessage() {
    const response = await requestApi('get', `/notice/num4each`, null, true, '读取通知列表失败');
    //console.log(response);
    const datarecv = response;
    setnum4eachData(datarecv);
    setRefreshingNotice(false); if(refreshing_message == false){setRefreshing(false);}
    console.log('Refresh: Notice Manage Get.');
  }
  async function getSystemMessage() {
    const response = await requestApiForMockTest('get', `/chat/getMessageInfo`, null, true, '读取系统通知失败');
    //console.log(response);
    const datarecv = response;
    setamsData(datarecv);
    setRefreshingMessage(false); if(refreshing_notice == false){setRefreshing(false);}
    console.log('Refresh: Message Manage Get.');
  }
  const onRefresh = () => {// 发送 GET 请求获取新增提醒数据
    setRefreshingNotice(true); setRefreshingMessage(true); setRefreshing(true);
    getNoticeMessage();
    getSystemMessage();
  };
  /*
  useEffect(() => {// 发送 GET 请求获取新增提醒数据
    getNoticeMessage();
    getSystemMessage();
  }, []);
  */
  useFocusEffect(React.useCallback(() => {
    getNoticeMessage();
    getSystemMessage();
    return () => {
    };
  }, [upstate]));
  const onpressNoticeCard = (userId: string) => {
    navigation.navigate('ChatDetail', {userId: userId});
  };
  const msitems = amsdata.data.map((item:any, index:number) => 
    <NoticeCard
      key={index}
      message={item.message}
      timestamp={new Date(item.timeStamp)}
      senderName={item.senderName}
      senderAvatar={item.senderAvatar}
      unreadedNum={item.unreadedNum}
      upstate={upstate}
      setUPState={setUPState}
      senderUserId={item.senderUserId}
      navigator={onpressNoticeCard}
    />
  );
  return (
      <ScrollView refreshControl={
        <RefreshControl refreshing={refreshing || refreshing_notice} onRefresh={onRefresh} />
      }>
        <View style={ styles.btscreen }>
          <NoticeLikeButton count={n4edata.data.likeNum} onPress={() => {navigation.navigate('NoticeDetailScreen', {type:'like'}); setnum4eachData({code:n4edata.code, data:{commentNum:n4edata.data.commentNum,followNum:n4edata.data.followNum,likeNum:0,shareNum:n4edata.data.shareNum,}});}}/>
          <NoticeCommentButton count={n4edata.data.commentNum} onPress={() => {navigation.navigate('NoticeDetailScreen', {type:'comment'}); setnum4eachData({code:n4edata.code, data:{commentNum:0,followNum:n4edata.data.followNum,likeNum:n4edata.data.likeNum,shareNum:n4edata.data.shareNum,}});}}/>
          <NoticeShareButton count={n4edata.data.repoNum} onPress={() => {navigation.navigate('NoticeDetailScreen', {type:'repo'}); setnum4eachData({code:n4edata.code, data:{commentNum:n4edata.data.commentNum,followNum:n4edata.data.followNum,likeNum:n4edata.data.likeNum,shareNum:0,}});}}/>
          <NoticeFollowButton count={n4edata.data.followNum} onPress={() => {navigation.navigate('NoticeDetailScreen', {type:'follow'}); setnum4eachData({code:n4edata.code, data:{commentNum:n4edata.data.commentNum,followNum:0,likeNum:n4edata.data.likeNum,shareNum:n4edata.data.shareNum,}});}}/>
        </View>
        <View style={ {height: 0, marginTop:20} } />
        <View>
          {msitems}
        </View>
        <View style={{marginTop:20, alignItems: 'center'}}>
          <Text>--已经到底啦--</Text>
        </View>
      </ScrollView>
  );
};

export default NoticeManageScreen;