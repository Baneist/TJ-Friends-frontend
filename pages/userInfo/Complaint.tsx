import React, { useState, useEffect, useRef } from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Button, Card, TextInput, Dialog, Surface,
  Portal, Provider, Snackbar, IconButton, List, Divider
} from 'react-native-paper';
import { StackNavigationProps } from '../../App'

const ComplaintUser = ({ route, navigation }: StackNavigationProps) => {
  //state
  const [reason, setReason] = useState('');
  const userID = global.gUserId;

  //提交修改
  async function submit() {
    navigation.goBack()
  }

  return (
    <Card mode='outlined' style={{ borderRadius: 0 }}>
      <Card.Title title="举报理由" subtitle="Your Reason" />
      <Card.Content>
        <TextInput
          mode="outlined"
          maxLength={256}
          autoFocus
          multiline
          value={reason}
          onChangeText={(text) => setReason(text)}
          right={<TextInput.Affix text="/256" />}
        />
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => {
          navigation.goBack()
        }}>取消</Button>
        <Button onPress={submit}>举报</Button>
      </Card.Actions>
    </Card>
  )
}
export default ComplaintUser;