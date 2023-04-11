import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Image, Pressable } from 'react-native';
import { Block, Text } from 'galio-framework';
import { Avatar, Button } from 'react-native-paper';
import { Props } from '../../App';

// 获取屏幕宽高
const { width, height } = Dimensions.get('screen');

// 用户信息
const users = [
{
    id: '1',
    name: '张三',
    avatar: 'https://picsum.photos/700',
    status: '计算机科学与技术',
    isFollowing: true,
},
{
    id: '2',
    name: '李四',
    avatar: 'https://picsum.photos/700',
    status: '信息安全',
    isFollowing: false,
},
{
    id: '3',
    name: '王五',
    avatar: 'https://picsum.photos/700',
    status: '软件工程',
    isFollowing: true,
},
{
    id: '4',
    name: '赵六',
    avatar: 'https://picsum.photos/700',
    status: '人工智能',
    isFollowing: false,
},
];

// 关注列表页面
const FollowingList = ({ navigation }: Props) => {
// 返回个人主页
function goBack() {
navigation.goBack();
}

// 关注/取消关注用户
function toggleFollow(id: string) {
const user = users.find((u) => u.id === id);
if (user) {
user.isFollowing = !user.isFollowing;
}
}

return (
<View style={{ flex: 1 }}>
{/* 页面标题 */}
{/* <Block style={styles.titleBar}>
<Button icon="arrow-left" mode="text" onPress={goBack}>
返回
</Button>
<Text style={styles.title}>关注列表</Text>
<Button mode="text" children=""/>
</Block>*/ }
  {/* 关注列表 */}
  <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
    {users.map((user) => (
      <Pressable key={user.id}>
        <Block style={styles.userContainer}>
          {/* 头像 */}
          <Avatar.Image size={64} source={{ uri: user.avatar }} />

          {/* 用户信息 */}
          <Block style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userStatus}>{user.status}</Text>
          </Block>

          {/* 关注/取消关注按钮 */}
          <Button
            style={styles.followButton}
            mode={user.isFollowing ? 'outlined' : 'contained'}
            onPress={() => toggleFollow(user.id)}
          >
            {user.isFollowing ? '取消关注' : '关注'}
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
    fontWeight: 'bold',color: '#32325D',
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
