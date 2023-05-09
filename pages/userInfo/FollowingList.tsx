import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Image, Pressable } from 'react-native';
import { Block, Text } from 'galio-framework';
import { Avatar, Button } from 'react-native-paper';
import requestApi from '../../utils/request';
import { userProp, defaultInfo } from './Profile';
import { AxiosResponse } from 'axios';
import { StackNavigationProps } from '../../App';

// 用户信息
export interface followProp {
  userId: string,
  isFollowed:boolean,
  isFollowing: boolean
}
// 关注列表页面
const FollowingList = ({route, navigation }: StackNavigationProps) => {
  const curUser = route.params?.userId;
  //关注的用户信息
  const [followlist, setlist] = useState([] as userProp[]);
  //是否在关注
  const [statusList, setstatusList] = useState([] as followProp[])
  async function fetchData() {
    //初始化
    let idlist : followProp[];
    const res = await requestApi('get', `/profile/${curUser}/followings`, null, true, 'Get Followings failed');
    if (res.code == 0) {
      idlist = res.data.followings;
      let reqList: Promise<AxiosResponse>[] = [];
      for (let i = 0; i < idlist.length; ++i) {
        reqList.push(new Promise((resolve, reject) => {
          resolve(requestApi('get', `/profile/${idlist[i].userId}`, null, true, 'get profile failed'))
        }))
      }

      Promise.all(reqList).then((values) => {
        for (let i = 0; i < values.length; ++i) {
          //statusList.push({userId:idlist[i], isfollowing:true})
          setstatusList(current => [...current, 
            { 
              userId: idlist[i].userId, 
              isFollowing: idlist[i].isFollowing, 
              isFollowed:idlist[i].isFollowed
            }
          ]);
          setlist(current => current.concat(values[i].data))
        }
      });
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // 关注/取消关注用户
  async function toggleFollow(user: followProp) {
    let res:AxiosResponse['data'];
    if (user.isFollowing) { //取关
      res = await requestApi('post', '/unfollow', { stuid: user.userId }, true, 'unfollow failed')
    }
    else { //关注
      res = await requestApi('post', '/follow', { stuId: user.userId }, true, 'follow failed')
    }
    if(res.code==0){
      const newList = statusList.map((item, idx) => {
        if (item.userId === user.userId) {
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
    else{
      console.log('follow/unfollow fail', res.code)
    }
  }

  return (
    <View style={{ flex: 1 }}>
      {/* 关注列表 */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View>
          
        </View>
        {followlist.map((user, idx) => (
          <Pressable key={idx} onPress={() => {navigation.navigate('OthersPage', {userId:user.userId.info})}}>
            <Block style={styles.userContainer}>
              {/* 头像 */}
              {/* <Avatar.Image size={64} source={{ uri: user.userAvatar.info }} /> */}

              {/* 用户信息 */}
              <Block style={styles.userInfo}>
                <Text style={styles.userName}>{user.userNickName.info}</Text>
                <Text style={styles.userStatus}>{user.userStatus.info}</Text>
              </Block>

              {/* 关注/取消关注按钮 */}
              {statusList[idx].userId !== curUser && <Button
                style={styles.followButton}
                mode={statusList[idx].isFollowing ? 'outlined' : 'contained'}
                onPress={() => toggleFollow(statusList[idx])}
              >
                {
                statusList[idx].isFollowing ? 
                statusList[idx].isFollowed?'互相关注':'取消关注'
                : '关注'
                }
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

export default FollowingList;
