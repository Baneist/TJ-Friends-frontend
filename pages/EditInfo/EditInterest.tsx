import React , {useState}from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {Button, Card, TextInput, Dialog, Surface,
    Portal, Provider,Snackbar,IconButton, List,Divider } from 'react-native-paper';
import {Props} from '../../App'

const EditInterest = ({route, navigation}:Props) =>{
    function submit(){
        console.log(submit);
        navigation.goBack()
    }
    return(
        <Card mode='outlined' style={{borderRadius:0}}>
            <Card.Title title="兴趣爱好" subtitle="Your Interst" />
            <Card.Content>
            <TextInput 
            mode="outlined"
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