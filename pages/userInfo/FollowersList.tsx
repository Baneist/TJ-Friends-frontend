import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Image, Pressable } from 'react-native';
import { Block, Text } from 'galio-framework';
import { Avatar, Button } from 'react-native-paper';
import requestApi from '../../utils/request';
import { userProp, defaultInfo } from './Profile';
import { AxiosResponse } from 'axios';
import { followProp } from './FollowingList';
import { StackNavigationProps } from '../../App';

// 获取屏幕宽高
const { width, height } = Dimensions.get('screen');

// 关注列表页面
const FollowersList = ({ route, navigation }: StackNavigationProps) => {
  //正在查看的是谁
  const pageUser = route.params?.userId;
  //当前用户
  const curUser = global.gUserId;
  //关注的用户信息
  const [followerlist, setlist] = useState([] as userProp[]);
  //是否在关注
  const [statusList, setstatusList] = useState([] as followProp[])
  //查看的是否是自己的粉丝
  const [isMine, setMine] = useState(pageUser==curUser);
  async function fetchData() {
      //初始化
    let idlist : followProp[];
    const res = await requestApi('get', `/profile/${pageUser}/followers`, null, true, 'Get Followers failed');
    idlist = res.data.followers;
    let reqList: Promise<AxiosResponse>[] = [];
    for (let i = 0; i < idlist.length; ++i) {
      reqList.push(new Promise((resolve, reject) => {
        resolve(requestApi('get', `/profile/${idlist[i].userID}`, null, true, 'get profile failed'))
      }))
    }
    Promise.all(reqList).then((values) => {
      for (let i = 0; i < values.length; ++i) {
        setstatusList(current => [...current, 
          { 
            userID: idlist[i].userID, 
            isFollowing: idlist[i].isFollowing, 
            isFollowed:idlist[i].isFollowed
          }
        ]);
        setlist(current => current.concat(values[i].data))
      }
    })
  }

  useEffect(() => {
    fetchData()
  }, [])

  // 关注/取消关注用户
  async function toggleFollow(user: followProp) {
    let res:AxiosResponse['data'];
    if (user.isFollowing) { //取关
      res = await requestApi('post', '/unfollow', { stuid: user.userID }, true, 'unfollow failed');
    }
    else { //关注
      res = await requestApi('post', '/follow', { stuid: user.userID }, true, 'follow failed');
    }
    const newList = statusList.map((item, idx) => {
      if (item.userID === user.userID) {
        item.isFollowing = !item.isFollowing;
        return item;
      }
      else {
        return item;
      }
    })
    setstatusList(newList)
    //粉丝列表的回粉信息交给后端修改
  }

  return (
    <View style={{ flex: 1 }}>
      {/* 关注列表 */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {followerlist.map((user, idx) => (
          <Pressable key={idx} onPress={() => {navigation.navigate('OthersPage', {userId:user.userId.info})}}>
            <Block style={styles.userContainer}>
              {/* 头像 */}
              <Avatar.Image size={64} source={{ uri: user.userAvatar.info }} />

              {/* 用户信息 */}
              <Block style={styles.userInfo}>
                <Text style={styles.userName}>{user.userNickName.info}</Text>
                <Text style={styles.userStatus}>{user.userStatus.info}</Text>
              </Block>

              {/* 关注/取消关注按钮 */}
              {statusList[idx].userID !== curUser && <Button
                style={styles.followButton}
                mode={statusList[idx].isFollowing ? 'outlined' : 'contained'}
                onPress={() => toggleFollow(statusList[idx])}
              >
                {isMine ?
                  (statusList[idx].isFollowing ? '互相关注' : '回粉')
                  : (statusList[idx].isFollowing ? '取消关注' : '关注')}
              </Button>}
            </Block>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  titleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold', color: '#32325D',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#32325D',
  },
  userStatus: {
    fontSize: 16,
    color: '#525F7F',
  },
  followButton: {
    marginLeft: 16,
  },
});

export default FollowersList;
