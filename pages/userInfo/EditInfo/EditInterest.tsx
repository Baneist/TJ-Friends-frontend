import React , {useState,useEffect}from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {Button, Card, TextInput, Dialog, Surface,
    Portal, Provider,Snackbar,IconButton, List,Divider } from 'react-native-paper';
import {StackNavigationProps} from '../../../App'
import { defaultInfo } from "../Profile";
import requestApi from "../../../utils/request";
import handleAxiosError from "../../../utils/handleError";

const EditInterest = ({route, navigation}:StackNavigationProps) =>{
    const [userInterest,setInterest] = useState('');
    let userInfo = defaultInfo;
    const userID = '2052909'
    //初始化
    async function fetchData(){
        try{
            const res = await requestApi('get', `/profile/${userID}`, null,null, true);
            if(res.data.code==0){
                userInfo = res.data.data;
                setInterest(userInfo.userInterest.info);
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
      userInfo.userInterest.info=userInterest;
      console.log(userInfo)
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