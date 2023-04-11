import React , {useState}from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {Button, Card, TextInput, Dialog, Surface,
    Portal, Provider,Snackbar,IconButton, List,Divider } from 'react-native-paper';
import {Props} from '../../App'

const EditStatus = ({route, navigation}:Props) =>{
    function submit(){
        console.log(submit);
        navigation.goBack()
    }
    return(
        <Card mode='outlined' style={{borderRadius:0}}>
            <Card.Title title="个性签名" subtitle="Your Status" />
            <Card.Content>
            <TextInput 
            mode="outlined"
            maxLength={128}
            autoFocus
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