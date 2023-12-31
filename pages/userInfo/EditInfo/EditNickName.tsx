import React, { useState, useEffect, useRef } from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Button, Card, TextInput, Dialog, Surface,
  Portal, Provider, Snackbar, IconButton, List, Divider
} from 'react-native-paper';
import { StackNavigationProps } from '../../../App'
import { userProp, defaultInfo } from "../Profile";

import requestApi from "../../../utils/request";
import handleAxiosError from "../../../utils/handleError";

const EditeNickName = ({ route, navigation }: StackNavigationProps) => {
  //state
  const [nickName, setNickName] = useState('1');
  //不展示的用ref 不能用let
  const refInfo = useRef<userProp>(defaultInfo);
  const userID = global.gUserId;


  //初始化
  async function fetchData() {
    const res = await requestApi('get', `/profile/${userID}`, null, true, 'get profile失败');
    if (res.code === 0) {
      refInfo.current = res.data;
      setNickName(res.data.userNickName.info);
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  //提交修改
  async function submit() {

    refInfo.current.userNickName.info = nickName;
    console.log('in change',refInfo.current)
    const res = await requestApi('put', '/updateUserInfo', refInfo.current, true, 'update userInfo失败');
    if (res.code === 0) {
      navigation.goBack()
    }
  }

  return (
    <Card mode='outlined' style={{ borderRadius: 0 }}>
      <Card.Title title="昵称" subtitle="Your Nickname" />
      <Card.Content>
        <TextInput
          mode="outlined"
          maxLength={32}
          autoFocus
          value={nickName}
          placeholder={nickName}
          onChangeText={(text) => setNickName(text)}
          right={<TextInput.Affix text="/32" />}
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
export default EditeNickName;