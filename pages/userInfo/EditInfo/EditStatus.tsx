import React , {useState,useEffect}from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {Button, Card, TextInput, Dialog, Surface,
    Portal, Provider,Snackbar,IconButton, List,Divider } from 'react-native-paper';
import {NavigationProps} from '../../../App'
import { userProp, defaultInfo } from "../Profile";
import requestApi from "../../../utils/request";
import handleAxiosError from "../../../utils/handleError";

const EditStatus = ({route, navigation}:NavigationProps) =>{
    const [userStatus,setStatus] = useState('');
    let userInfo = defaultInfo;
    const userID='2052123';
    //初始化
    async function fetchData(){
        try{
            const res = await requestApi('get', `/profile/${userID}`, null,null, true);
            if(res.data.code==0){
                userInfo = res.data.data;
                setStatus(userInfo.userStatus.info);
            }
            else{
              console.log('code err',res.data.code)
            }
          } catch(err){
            handleAxiosError(err);
        }
    }
    useEffect(()=>{
        fetchData()
    },[])
    async function submit(){
        userInfo.userStatus.info=userStatus;
        try{
            const res = await requestApi('put', '/updateUserInfo',null, userInfo, true);
            if(res.status==200){
              navigation.goBack()
            }
            else{
              console.log('err',res.status)
            }
          } catch(err){
            handleAxiosError(err);
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