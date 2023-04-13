import React, { useState, useEffect }  from 'react';
import { NavigationProps } from '../../App';
import Badge from '../../components/NoticeManage/NoticeBadge';
import {DialogBadge} from '../../components/NoticeManage/NoticeBadge';
import {IconButton} from 'react-native-paper';
import { View, Text,Image, StyleSheet, Dimensions, Alert, TouchableOpacity, FlatList, RefreshControl, ScrollView} from 'react-native';
import axios from 'axios';
import { NoticeCard } from '../../components/NoticeManage/NoticeCard';

export const styles = StyleSheet.create({
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

interface NoticeManageProps {
   count: number;
}

function NoticeLikeButton({count} : NoticeManageProps) {
  return (
    <View style={{ alignItems: 'center' }}>
      <IconButton icon='heart' key={'heart'} size={30} onPress={() => { Alert.alert('a', 'b') }} />
      <Text style={styles.label1}>喜欢我的</Text>
      {count > 0 && <Badge count={count} />}
    </View>
  );
}

function NoticeCommentButton({count} : NoticeManageProps) {
  return (
    <View style={{ alignItems: 'center' }}>
      <IconButton icon='comment' key={'comment'} size={30} onPress={() => { }} />
      <Text style={styles.label1}>评论我的</Text>
      {count > 0 && <Badge count={count} />}
    </View>
  );
}

function NoticeShareButton({count} : NoticeManageProps) {
  return (
    <View style={{ alignItems: 'center' }}>
      <IconButton icon='share' key={'share'} size={30} onPress={() => { }} />
      <Text style={styles.label1}>转发我的</Text>
      {count > 0 && <Badge count={count} />}
    </View>
  );
}

function NoticeFollowButton({count} : NoticeManageProps) {
  return (
    <View style={{ alignItems: 'center' }}>
      <IconButton icon='eye' key={'share'} size={30} onPress={() => { }} />
      <Text style={styles.label1}>我关注的</Text>
      {count > 0 && <Badge count={count} />}
    </View>
  );
}

const num4eachData = {
   code: 200,
   data: {
    commentnum: 0,
    follownum: 0,
    likenum: 0,
    sharenum: 0,
   }
};

const messageData = {
  code:77,
  data:[{
    lastMessage:"id Lorem est mollit",
    senderName:"现受强写建",
    senderAvatar:"http://dummyimage.com/100x100",
    timestamp:"2017-10-26 16:56:04",
    undeal_num:57,
  },
  ]
}
;

const NoticeManageScreen = ({ route, navigation }: NavigationProps) => {
  const [refreshing_notice, setRefreshingNotice] = useState(false);
  const [refreshing_message, setRefreshingMessage] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [n4edata, setnum4eachData] = useState(num4eachData);
  const [amsdata, setamsData] = useState(messageData);
  const onRefresh = () => {// 发送 GET 请求获取新增提醒数据
    setRefreshingNotice(true); setRefreshingMessage(true); setRefreshing(true);
    axios.get('https://mock.apifox.cn/m1/2539601-0-default/notice/1/num4each')
    .then(response => {
      const datarecv = response.data;
      setnum4eachData(datarecv);
      setRefreshingNotice(false); if(refreshing_message == false){setRefreshing(false);}
      console.log('Refresh: Notice Manage Get.');
    })
    .catch(error => {
      console.log(error);
      setRefreshingNotice(false); if(refreshing_message == false){setRefreshing(false);}
    });
    axios.get('https://mock.apifox.cn/m1/2539601-0-default/notice/1/allmessage')
    .then(response => {
      const datarecv = response.data;
      setamsData(datarecv);
      setRefreshingMessage(false); if(refreshing_notice == false){setRefreshing(false);}
      console.log('Refresh: Message Manage Get.');
    })
    .catch(error => {
      console.log(error);
      setRefreshingMessage(false); if(refreshing_notice == false){setRefreshing(false);}
    });
  };
  useEffect(() => {// 发送 GET 请求获取新增提醒数据
    axios.get('https://mock.apifox.cn/m1/2539601-0-default/notice/1/num4each')
      .then(response => {
        const datarecv = response.data;
        setnum4eachData(datarecv);
        console.log('Start: Notice Manage Get.');
        console.log(datarecv);
      })
      .catch(error => {
        console.error(error);
      });
      axios.get('https://mock.apifox.cn/m1/2539601-0-default/notice/1/allmessage')
      .then(response => {
        const datarecv = response.data;
        setamsData(datarecv);
        console.log('Start: Message Manage Get.');
      })
      .catch(error => {
        console.error(error);
      });
  }, []);
  const msitems = amsdata.data.map((item) => 
    <NoticeCard
      message={item.lastMessage}
      timestamp={new Date(item.timestamp)}
      senderName={item.senderName}
      senderAvatar={item.senderAvatar}
      undeal_num={item.undeal_num}
    />
  );
  return (
      <ScrollView refreshControl={
        <RefreshControl refreshing={refreshing || refreshing_notice} onRefresh={onRefresh} />
      }>
        <View style={ styles.btscreen }>
          <NoticeLikeButton count={n4edata.data.likenum} />
          <NoticeCommentButton count={n4edata.data.commentnum}/>
          <NoticeShareButton count={n4edata.data.sharenum}/>
          <NoticeFollowButton count={n4edata.data.follownum}/>
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