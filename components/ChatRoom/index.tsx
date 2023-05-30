import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, View, Image, Dimensions, TouchableOpacity } from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import { Avatar } from 'react-native-elements';
import {TextInput, Button} from 'react-native-paper'
import { GiftedChat } from 'react-native-gifted-chat';
import { StackNavigationProps } from '../../App';
import CustomBubble from '../../pages/ChatManage/CustomBubble';
import RoomInputToolbar from './inputtoolbar';
import requestApi from '../../utils/request';
import { AxiosResponse } from 'axios';
import Modal from 'react-native-modal';
import { ScrollView } from 'react-native-gesture-handler';

interface ChatMessage {
  _id: number;
  text: string;
  createdAt: Date;
  user: {
    _id: string;
    name: string;
    avatar: string;
  };
  isRevoke: boolean,
  image?: string,
};

const defaultMessages = [
  {
    _id: 5,
    text: '谢谢',
    createdAt: new Date(new Date().getTime() + 2800 * 1000),
    user: {
      _id: '2',
      name: 'ChatGPT',
      avatar: "https://picsum.photos/700",
    },
    isRevoke: false,
  },
  {
    _id: 4,
    text: '那你很棒棒',
    createdAt: new Date(new Date().getTime() + 2800 * 1000),
    user: {
      _id: '1',
      name: 'ME',
      avatar: "https://picsum.photos/700",
    },
    isRevoke: false,
  },
  {
    _id: 3,
    text: '我写完啦',
    createdAt: new Date(new Date().getTime() + 1800 * 1000),
    user: {
      _id: '2',
      name: 'ChatGPT',
      avatar: "https://picsum.photos/700",
    },
    isRevoke: true
  },
  {
    _id: 2,
    text: '你今天作业写完了吗',
    createdAt: new Date(new Date().getTime() + 60 * 1000),
    user: {
      _id: '2',
      name: 'ChatGPT',
      avatar: "https://picsum.photos/700",
    },
    isRevoke: false,
  },
  {
    _id: 1,
    text: '你好',
    createdAt: new Date(),
    user: {
      _id: '2',
      name: 'ChatGPT',
      avatar: "https://picsum.photos/700",
    },
    isRevoke: false,
  },
];

function ChatRoom(roomId:string, navigation:StackNavigationProps['navigation']) {
  const userId = global.gUserId;
  const [IUser, setIUser] = useState({
    _id: userId,
    name: 'ChatGPT',
    avatar: "https://picsum.photos/700",
  });
  const [messages, setMessages] = useState([] as ChatMessage[]);
  const [isTimerEnabled, setIsTimerEnabled] = useState(true);

  async function getUser(id_: string) {
    const resProfile = await requestApi('get', `/profile/${id_}`, null, true, 'get profile failed');
    return {
      _id: id_,
      name: resProfile.data.userNickName.info,
      avatar: resProfile.data.userAvatar.info,
    }
  }

  async function fetchOrigin(){
    let CurMessages: ChatMessage[] = []

    const resAllMessages = await requestApi('get', `/receiveRoomMessage?roomId=${roomId}`, null, true, 'Get All Messages failed');

    setIUser(await getUser(userId));
    
    if (resAllMessages.code === 0) {

      for (let i = 0; i < resAllMessages.data.length; ++i) {
        
        if(resAllMessages.data[i].image==''){
          CurMessages.unshift(
            {
              _id: resAllMessages.data[i].id,
              text: resAllMessages.data[i].text,
              createdAt: resAllMessages.data[i].time,
              user: await getUser(resAllMessages.data[i].userId),
              isRevoke: resAllMessages.data[i].isRecall,
            }
          )
        }
        else{
          CurMessages.unshift(
            {
              _id: resAllMessages.data[i].id,
              text: '',
              createdAt: resAllMessages.data[i].time,
              user: await getUser(resAllMessages.data[i].userId),
              image: resAllMessages.data[i].image,
              isRevoke: resAllMessages.data[i].isRecall,
            }
          )
        }
        
      }
    }

    setMessages(CurMessages);
  }

  function onSend(newMessages: ChatMessage[] = []) {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, newMessages),
    );
  }

  function handleLongPress(context, currentMessage) {
    setIsTimerEnabled(false);

    async function deleteMessage() {
      const res = await requestApi('post', '/chat/deleteMessage', { messageId: currentMessage._id }, true, '删除失败');
      fetchOrigin()
    }

    async function recallMessage() {
      const res = await requestApi('post', '/chat/recallMessage', { messageId: currentMessage._id }, true, '撤回失败');
      fetchOrigin()
    }

    if(currentMessage.user._id===userId){
      const options = [
        '复制',
        '删除',
        '撤回',
        '取消',
      ];
      const cancelButtonIndex = options.length - 1;
      context.actionSheet().showActionSheetWithOptions({
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            Clipboard.setString(currentMessage.text);
            break;
          case 1:
            deleteMessage();
            break;
          case 2:
            recallMessage();
            break;
        }
      });
    }
    else{
      const options = [
        '复制',
        '删除',
        '取消',
      ];
      const cancelButtonIndex = options.length - 1;
      context.actionSheet().showActionSheetWithOptions({
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            Clipboard.setString(currentMessage.text);
            break;
          case 1:
            deleteMessage();
          break;
        }
      });
    }
    
    setIsTimerEnabled(true);
  }


  useEffect(() => {
    fetchOrigin()

    if (isTimerEnabled){
      const intervalId = setInterval(() => {
        fetchOrigin()
      }, 2000);

      return () => clearInterval(intervalId);
    }
    
  }, [isTimerEnabled]);

  return (
    <GiftedChat
    messages={messages}
    onSend={onSend}
    onLongPress={handleLongPress}
    user={IUser}
    showAvatarForEveryMessage={true}
    alignTop={true}
    renderBubble={(props)=><CustomBubble {...props}/>}
    renderInputToolbar={(props) => <RoomInputToolbar {...props} messages={messages} RoomId={roomId} setMessages={setMessages}/>}
    renderAvatar={(props) => (
      !props.currentMessage.isRevoke &&
      <View style={{ marginLeft: 10 }}>
        <TouchableOpacity onPress={() => {navigation.navigate('OthersPage', {userId:props.currentMessage.user._id})}}>
          <Avatar
            size={42}
            source={{ uri: props.currentMessage.user.avatar }}
            rounded
          />
        </TouchableOpacity>
      </View>
    )}
  />
  );
}

export default ChatRoom;

