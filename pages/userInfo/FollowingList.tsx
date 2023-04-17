import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Image, Pressable } from 'react-native';
import { Block, Text } from 'galio-framework';
import { Avatar, Button } from 'react-native-paper';
import requestApi from '../../utils/request';
import { userProp, defaultInfo } from './Profile';
import { AxiosResponse } from 'axios';
import { StackNavigationProps } from '../../App';
import handleAxiosError from '../../utils/handleError';

// 获取屏幕宽高
const { width, height } = Dimensions.get('screen');

// 用户信息
export interface followProp {
  userID: string,
  isfollowing: boolean
}
// 关注列表页面
const FollowingList = ({ navigation }: StackNavigationProps) => {
  const stuid = '2053186';
  //关注的用户信息
  const [followlist, setlist] = useState([] as userProp[]);
  //是否在关注
  const [statusList, setstatusList] = useState([] as followProp[])
  //初始化
  let idlist = [] as string[];
  async function fetchData() {
    const res = await requestApi('get', `/profile/${stuid}/followings`, null, null, true, 'get followings failed');
    if (res.code == 0) {
      idlist = idlist.concat(res.data.followings);
      let reqList: Promise<AxiosResponse>[] = [];
      for (let i = 0; i < idlist.length; ++i) {
        reqList.push(new Promise((resolve, reject) => {
          resolve(requestApi('get', `/profile/${idlist[i]}`, null, null, true, 'get profile failed'))
        }))
      }

      Promise.all(reqList).then((values) => {
        for (let i = 0; i < values.length; ++i) {
          //statusList.push({userID:idlist[i], isfollowing:true})
          setstatusList(current => [...current, { userID: idlist[i], isfollowing: true }]);
          //目前profile接口不正常 先这么写凑合着
          setlist(current => [...current, defaultInfo])
          //setlist(current => current.concat(values[i].data))
        }
      });
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // 关注/取消关注用户
  async function toggleFollow(user: followProp) {
    if (user.isfollowing) { //取关
      const res = await requestApi('post', '/unfollow', { stuid: user.userID }, null, true, 'unfollow failed')
      if (res.status == 200) {
        const newList = statusList.map((item, idx) => {
          if (item.userID === user.userID) {
            item.isfollowing = !item.isfollowing;
            return item;
          }
          else {
            return item;
          }
        })
        setstatusList(newList)
        //粉丝列表的回粉信息交给后端修改
      }
    }
    else { //关注
      const res = await requestApi('post', '/follow', { stuid: user.userID }, null, true, 'follow failed')
      if (res.status == 200) {
        const newList = statusList.map((item, idx) => {
          if (item.userID === user.userID) {
            item.isfollowing = !item.isfollowing;
            return item;
          }
          else {
            return item;
          }
        })
        setstatusList(newList)
        //粉丝列表的回粉信息交给后端修改
      }
    }
  }

  return (
    <View style={{ flex: 1 }}>
      {/* 关注列表 */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {followlist.map((user, idx) => (
          <Pressable key={idx}>
            <Block style={styles.userContainer}>
              {/* 头像 */}
              <Avatar.Image size={64} source={{ uri: user.userAvatar.info }} />

              {/* 用户信息 */}
              <Block style={styles.userInfo}>
                <Text style={styles.userName}>{user.userNickName.info}</Text>
                <Text style={styles.userStatus}>{user.userStatus.info}</Text>
              </Block>

              {/* 关注/取消关注按钮 */}
              <Button
                style={styles.followButton}
                mode={statusList[idx].isfollowing ? 'outlined' : 'contained'}
                onPress={() => toggleFollow(statusList[idx])}
              >
                {statusList[idx].isfollowing ? '取消关注' : '关注'}
              </Button>
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
