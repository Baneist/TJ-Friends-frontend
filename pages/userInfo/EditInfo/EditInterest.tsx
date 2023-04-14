import React , {useState,useEffect}from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {Button, Card, TextInput, Dialog, Surface,
    Portal, Provider,Snackbar,IconButton, List,Divider } from 'react-native-paper';
import {Props} from '../../../App'
import { defaultInfo } from "../Profile";
import request from "../../../utils/request";

const EditInterest = ({route, navigation}:Props) =>{
    const [userInterest,setInterest] = useState('');
    let userInfo = defaultInfo;
    const curUser = '2052123'
    //初始化
    async function fetchData(){
        const res = await request.get(`/profile/${curUser}`)
        if(res.data.code==0){
            userInfo = res.data.data;
            setInterest(userInfo.userInterest.info);
        }
        else{
        console.log('code err',res.data.code)
        }
    }
    useEffect(()=>{
        fetchData()
    },[])
    async function submit(){
        userInfo.userInterest.info=userInterest;
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
            <Card.Title title="兴趣爱好" subtitle="Your Interst" />
            <Card.Content>
            <TextInput 
            mode="outlined"
            value={userInterest}
            onChangeText={(Text)=>setInterest(Text)}
            maxLength={256}
            autoFocus
            multiline
            numberOfLines={15}
            right={<TextInput.Affix text="/256" />}
            />
            </Card.Content>
            <Card.Actions>
            <Button onPress={()=>{navigation.goBack()}}>取消</Button>
            <Button onPress={submit}>保存</Button>
            </Card.Actions>
        </Card>
    )
}
export default EditInterest;