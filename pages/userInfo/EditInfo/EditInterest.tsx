import React, {useState, useEffect, useRef} from "react";
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  Button, Card, TextInput, Dialog, Surface,
  Portal, Provider, Snackbar, IconButton, List, Divider
} from 'react-native-paper';
import {StackNavigationProps} from '../../../App'
import {defaultInfo} from "../Profile";
import requestApi from "../../../utils/request";
import { userProp } from "../Profile";
import handleAxiosError from "../../../utils/handleError";

const EditInterest = ({route, navigation}: StackNavigationProps) => {
  const [userInterest, setInterest] = useState('');
  //不展示的用ref 不能用let
  const refInfo = useRef<userProp>(defaultInfo);
  const userID = global.gUserId;


  //初始化
  async function fetchData() {
    const res = await requestApi('get', `/profile/${userID}`, null,  true, 'get profile失败');
    if (res.code == 0) {
      refInfo.current=res.data;
      setInterest(res.data.userInterest.info);
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  async function submit() {
    refInfo.current.userInterest.info = userInterest
    const res = await requestApi('put', '/updateUserInfo',  refInfo.current, true, 'update userInfo失败');
    if (res.code === 0) {
      navigation.goBack()
    }
  }

  return (
    <Card mode='outlined' style={{borderRadius: 0}}>
      <Card.Title title="兴趣爱好" subtitle="Your Interst"/>
      <Card.Content>
        <TextInput
          mode="outlined"
          value={userInterest}
          onChangeText={(Text) => setInterest(Text)}
          maxLength={256}
          autoFocus
          multiline
          numberOfLines={15}
          right={<TextInput.Affix text="/256"/>}
        />
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => {
          navigation.goBack()
        }}>取消</Button>
        <Button onPress={submit}>保存</Button>
      </Card.Actions>
    </Card>
  )
}
export default EditInterest;