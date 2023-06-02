import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Image, Pressable } from 'react-native';
import { Block, Text } from 'galio-framework';
import { Avatar, Button, Divider } from 'react-native-paper';
import requestApi from '../../utils/request';
import { userProp, defaultInfo } from './Profile';
import { AxiosResponse } from 'axios';
import { StackNavigationProps } from '../../App';
import Modal from 'react-native-modal';

interface ModalOptionsProps{
    showOption:boolean,
    onDetatch:() => void,
    onSeePage:() => void,
    onBackdropPress:() => void
}
const ModalOptions = (props:ModalOptionsProps) =>{
    return(
        <Modal
        isVisible={props.showOption}
        onBackdropPress={props.onBackdropPress}
        style={styles.modalFromBottom}
        >
        <View style={styles.contentContainer}>
          <Button
          style={styles.optionBtn} 
          onPress={props.onSeePage}
          >查看用户主页</Button>
          <Divider />
          <Button
          style={styles.optionBtn} 
          onPress={props.onDetatch}>解除屏蔽</Button>
          <Divider />
          <Button style={styles.optionBtn}
          onPress={props.onBackdropPress}>取消</Button>
        </View>
      </Modal>
    )
}


const BlockList = ({navigation}:StackNavigationProps) => {
    //state
    const curUser = global.gUserId;
    //显示选项
    const [showOption, setShow] = useState(false);
    //拉黑的用户列表
    const [blackList, setlist] = useState([] as userProp[]);

    const[uid,setuid]=useState('');

    //移除
    async function onDetatch(userId:string){
        //删除回显
        await requestApi('post', '/cancelBlock', {userId:userId}, true, '取消屏蔽失败')
        setlist((blackList) => blackList.filter(item => item.userId.info !== userId))
        setShow(false);
    }
    //查看他人主页
    function onSeePage(userId:string){
        setShow(false);
        console.log(uid)
        navigation.navigate('OthersPage',{
            userId:userId
        })
    }
    async function fetchData(){
        //获取拉黑列表
        let idlist = [] as string [];
        const res = await requestApi('get', `/getBlockList`, null, true, 'Get blockList failed');
        for(let i=0;i<res.data.length;++i)
          idlist.push(res.data[i].blocked)
        let reqList: Promise<AxiosResponse>[] = [];
        for (let i = 0; i < idlist.length; ++i) {
        reqList.push(new Promise((resolve, reject) => {
            resolve(requestApi('get', `/profile/${idlist[i]}`, null, true, 'get profile failed'))
        }))
        }
        Promise.all(reqList).then((values) => {
            for (let i = 0; i < values.length; ++i) {
              setlist(current => current.concat(values[i].data))
            }
        })
    }
    useEffect(() =>{
        fetchData()
    },[])
    return (
        <View style={{flex:1}}>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                {blackList.length!=0 && blackList.map((user, idx) => (
                <View key={idx}>
                <Pressable onPress={() => {setShow(true);setuid(user.userId.info)}}>
                    <Block style={styles.userContainer}>
                    {/* 头像 */}
                    <Avatar.Image size={64} source={{ uri: user.userAvatar.info }} />

                    {/* 用户信息 */}
                    <Block style={styles.userInfo}>
                        <Text style={styles.userName}>{user.userNickName.info}</Text>
                        <Text style={styles.userStatus}>{user.userStatus.info}</Text>
                    </Block>
                    </Block>
                </Pressable>
                <ModalOptions 
                    showOption={showOption}
                    onBackdropPress={()=>{setShow(false)}}
                    onDetatch={() => onDetatch(uid)}
                    onSeePage={()=>onSeePage(uid)}
                />
                </View>
                ))}
                {!blackList.length &&
                  <View style={{flex:1, alignItems:'center'}}>
                  <Text style={{color:'#525F7F', marginTop:20}}>---暂无更多---</Text>
                </View>
                }
            </ScrollView>
        </View>
    )
}

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
    modalFromBottom: {
    justifyContent: 'flex-end',
    margin: 0,
    },
    optionBtn:{
    height:50,
    marginTop:10
    },
    contentContainer:{
    backgroundColor: 'white',
    paddingTop:15
    },
  });
export default BlockList;