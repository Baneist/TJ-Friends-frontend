import React , {useState,useEffect}from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {Button, Card, TextInput, Dialog, Surface,
    Portal, Provider,Snackbar,IconButton, List,Divider } from 'react-native-paper';
import {Props} from '../../../App'
import { userProp, defaultInfo } from "../Profile";
import request from "../../../utils/request";

const EditStatus = ({route, navigation}:Props) =>{
    const [userStatus,setStatus] = useState('');
    let userInfo = defaultInfo;
    const curUser='2052123';
    //初始化
    async function fetchData(){
        const res = await request.get(`/profile/${curUser}`)
        if(res.data.code==0){
            userInfo = res.data.data;
            setStatus(userInfo.userStatus.info);
        }
        else{
        console.log('code err',res.data.code)
        }
    }
    useEffect(()=>{
        fetchData()
    },[])
    async function submit(){
        userInfo.userStatus.info=userStatus;
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
            <Card.Title title="个性签名" subtitle="Your Status" />
            <Card.Content>
            <TextInput 
            mode="outlined"
            maxLength={128}
            autoFocus
            placeholder={userStatus}
            value={userStatus}
            onChangeText={(text)=>setStatus(text)}
            multiline
            numberOfLines={10}
            right={<TextInput.Affix text="/128" />}
            />
            </Card.Content>
            <Card.Actions>
            <Button onPress={()=>{navigation.goBack()}}>取消</Button>
            <Button onPress={submit}>保存</Button>
            </Card.Actions>
        </Card>
    )
}
export default EditStatus;