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

const EditStatus = ({ route, navigation }: StackNavigationProps) => {
  const [userStatus, setStatus] = useState('');
  //不展示的用ref 不能用let
  const refInfo = useRef<userProp>(defaultInfo);
  const userID = global.gUserId;
  //初始化
  async function fetchData() {
    const res = await requestApi('get', `/profile/${userID}`, null, true, 'get profile失败');
    if (res.code == 0) {
      refInfo.current = res.data;
      setStatus(res.data.userStatus.info);
    }

  }
  useEffect(() => {
    fetchData()
  }, [])
  async function submit() {
    refInfo.current.userStatus.info = userStatus;
    const res = await requestApi('put', '/updateUserInfo', refInfo.current, true, 'update userInfo失败');
    if (res.code === 0) {
      navigation.goBack()
    }
  }
  return (
    <Card mode='outlined' style={{ borderRadius: 0 }}>
      <Card.Title title="个性签名" subtitle="Your Status" />
      <Card.Content>
        <TextInput
          mode="outlined"
          maxLength={128}
          autoFocus
          placeholder={userStatus}
          value={userStatus}
          onChangeText={(text) => setStatus(text)}
          multiline
          numberOfLines={10}
          right={<TextInput.Affix text="/128" />}
        />
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => { navigation.goBack() }}>取消</Button>
        <Button onPress={submit}>保存</Button>
      </Card.Actions>
    </Card>
  )
}
export default EditStatus;