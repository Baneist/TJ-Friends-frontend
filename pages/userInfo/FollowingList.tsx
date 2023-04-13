import React,{useState,useEffect} from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Image, Pressable } from 'react-native';
import { Block, Text } from 'galio-framework';
import { Avatar, Button } from 'react-native-paper';
import { Props } from '../../App';
import request from '../../utils/request';
import { userProp, defaultInfo } from './Profile';
import { AxiosResponse } from 'axios';

// 获取屏幕宽高
const { width, height } = Dimensions.get('screen');

// 用户信息
export interface followProp{
  userID:string,
  isfollowing:boolean
}
// 关注列表页面
const FollowingList = ({ navigation }: Props) => {
  //关注的用户信息
  const [followlist, setlist]=useState([] as userProp []);
  //是否在关注
  const [statusList, setstatusList] = useState([] as followProp[])
  //初始化
  let idlist = [] as string [];
  async function fetchData(){
    const res = await request.get('/profile/2052123/following')
    if(res.data.code==200){
      idlist = idlist.concat(res.data.data);
      let reqList:Promise<AxiosResponse>[]=[];
      for(let i=0;i<idlist.length;++i){
        reqList.push(new Promise((resolve, reject)=>{
          resolve(request.get('/profile',{
            params:{
              stuid:idlist[i]
            }
          }))
        }))
      }
      Promise.all(reqList).then((values)=>{
        for(let i=0;i<values.length;++i){
          statusList.push({userID:idlist[i], isfollowing:true})
          //setstatusList([...statusList, {userID:idlist[i], isfollowing:true}]);
          setlist(current => current.concat(values[i].data.data))
        }
      })
    }
    else{
      console.log('code err',res.data.code)
    }
}
  useEffect(()=>{
      fetchData()
  },[])

// 关注/取消关注用户
async function toggleFollow(id: string) {
  const res = await request.del('/profile/2052123/following',{
    params:{
      stuid:id
    }
  })
  if(res.status==200){
    const newList = statusList.map((item,idx) =>{
      if(item.userID === id){
          item.isfollowing=!item.isfollowing;
        return item;
      }
      else{
        return item;
      }
    })
    setstatusList(newList)
  }
  else{
    console.log('err')
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
            onPress={() => toggleFollow(statusList[idx].userID)}
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
