import React , {useState,useEffect}from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {Button, Card, TextInput, Dialog, Surface,
    Portal, Provider,Snackbar,IconButton, List,Divider } from 'react-native-paper';
import {NavigationProps} from '../../../App'
import { userProp,defaultInfo } from "../Profile";
import request from "../../../utils/request";

const EditeNickName = ({route, navigation}:NavigationProps) =>{
    //state
    const [nickName,setNickName] = useState('1');
    let userInfo = defaultInfo;
    const curUser = '2052123';
    //初始化
    async function fetchData(){
        const res = await request.get(`/profile/${curUser}`)
        if(res.data.code==0){
            userInfo = res.data.data;
            setNickName(userInfo.userNickName.info);
        }
        else{
        console.log('code err',res.data.code)
        }
    }
    useEffect(()=>{
        fetchData()
    },[])
    //提交修改
    async function submit(){
        userInfo.userNickName.info=nickName;
        const res = await request.put('/updateUserInfo',{
            data:userInfo
        })
        if(res.status==200){
            //发送事件，传递更新的userInfo
            navigation.goBack()
        }
        else{
            console.log('err',res.status)
        }
    }
    return(
        <Card mode='outlined' style={{borderRadius:0}}>
            <Card.Title title="昵称" subtitle="Your Nickname" />
            <Card.Content>
            <TextInput 
            mode="outlined"
            maxLength={32}
            autoFocus
            value={nickName}
            placeholder={nickName}
            onChangeText={(text)=>setNickName(text)}
            right={<TextInput.Affix text="/32" />}
            />
            </Card.Content>
            <Card.Actions>
            <Button onPress={()=>{navigation.goBack()}}>取消</Button>
            <Button onPress={submit}>保存</Button>
            </Card.Actions>
        </Card>
    )
}
export default EditeNickName;