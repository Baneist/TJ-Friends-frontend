import React , {useState,useEffect,Component}from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {Button, Card, TextInput, Dialog, Surface,
    Portal, Provider,Snackbar,IconButton, List,Divider } from 'react-native-paper';
import {Props} from '../../../App'


const EditeNickName = ({route, navigation}:Props) =>{
    const [nickName,setNickName] = useState('');
    function submit(){
        console.log(submit);
        navigation.goBack()
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