import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import { Avatar } from 'react-native-elements';
import { GiftedChat } from 'react-native-gifted-chat';
import { StackNavigationProps } from '../../App'
import CustomBubble from './CustomBubble';
import CustomInputToolbar from './CustomInputToolbar';
import requestApi from '../../utils/request';
import { AxiosResponse } from 'axios';

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

function ChatDetail({ route, navigation }: StackNavigationProps) {
  const userId = global.gUserId;
  const ChatUser = route.params?.userId;
  
  const [messages, setMessages] = useState([] as ChatMessage[]);
  const [isTimerEnabled, setIsTimerEnabled] = useState(true);
  const [IUser, setIUser] = useState({
    _id: userId,
    name: 'ChatGPT',
    avatar: "https://picsum.photos/700",
  });
  const [UUser, setUUser] = useState({
    _id: ChatUser,
    name: '',
    avatar: "https://picsum.photos/700",
  });

  async function fetchOrigin(){
    let CurMessages: ChatMessage[] = []
    
    const resAllMessages = await requestApi('get', `/chat/receiveAllMessages?userId=${ChatUser}`, null, true, 'Get All Messages failed');
    if (resAllMessages.code === 0) {
      let idlist = [userId,ChatUser]
      let reqList: Promise<AxiosResponse>[] = [];
      for (let i = 0; i < idlist.length; ++i) {
        reqList.push(new Promise((resolve, reject) => {
          resolve(requestApi('get', `/profile/${idlist[i]}`, null, true, 'get profile failed'))
        }))
      }
      Promise.all(reqList).then((values) => {
        setIUser({
          _id: userId,
          name: values[0].data.userNickName.info,
          avatar: values[0].data.userAvatar.info,
        });
        setUUser({
          _id: ChatUser,
          name: values[1].data.userNickName.info,
          avatar: values[1].data.userAvatar.info,
        })
      })

      for (let i = 0; i < resAllMessages.data.length; ++i) {
        if(resAllMessages.data[i].isReceived){
          if(resAllMessages.data[i].image==''){
            CurMessages.unshift(
              {
                _id: resAllMessages.data[i].id,
                text: resAllMessages.data[i].text,
                createdAt: resAllMessages.data[i].time,
                user: UUser,
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
                user: UUser,
                image: resAllMessages.data[i].image,
                isRevoke: resAllMessages.data[i].isRecall,
              }
            )
          }
        }
        else{
          if(resAllMessages.data[i].image==''){
            CurMessages.unshift(
              {
                _id: resAllMessages.data[i].id,
                text: resAllMessages.data[i].text,
                createdAt: resAllMessages.data[i].time,
                user: IUser,
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
                user: IUser,
                image: resAllMessages.data[i].image,
                isRevoke: resAllMessages.data[i].isRecall,
              }
            )
          }
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
  
  
  async function getUnreadMessages() {
    const resUnreadMessages = await requestApi('get', `/chat/receiveUnreadMessages?userId=${ChatUser}`, null, true, 'Get Unread Messages failed');
    let unreadMessage: ChatMessage[] = []
    for (let i = 0; i < resUnreadMessages.data.length; ++i) {
      if(resUnreadMessages.data[i].image==''){
        unreadMessage.unshift(
          {
            _id: resUnreadMessages.data[i].id,
            text: resUnreadMessages.data[i].text,
            createdAt: resUnreadMessages.data[i].time,
            user: UUser,
            isRevoke: resUnreadMessages.data[i].isRecall,
          }
        )
      }
      else{
        unreadMessage.unshift(
          {
            _id: resUnreadMessages.data[i].id,
            text: '',
            createdAt: resUnreadMessages.data[i].time,
            user: UUser,
            image: resUnreadMessages.data[i].image,
            isRevoke: false,
          }
        )
      }
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, unreadMessage)
      );

      alreadyRead();
    }
  }

  async function alreadyRead() {
    const res = await requestApi('post', '/chat/readMessageInfo', { userId: ChatUser }, true, '已读失败');
  }

  useEffect(() => {
    fetchOrigin()
    navigation.setOptions({
      headerTitle:UUser.name});
    if (isTimerEnabled){
      const intervalId = setInterval(() => {
        getUnreadMessages();
      }, 2000);

      return () => clearInterval(intervalId);
    }
    
  }, [isTimerEnabled,UUser.name]);

  return (
    <GiftedChat
    messages={messages}
    onSend={onSend}
    onLongPress={handleLongPress}
    user={IUser}
    showAvatarForEveryMessage={true}
    alignTop={true}
    renderBubble={(props)=><CustomBubble {...props}/>}
    renderInputToolbar={(props) => <CustomInputToolbar {...props} messages={messages} ChatUser={ChatUser} setMessages={setMessages}/>}
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

export default ChatDetail;
