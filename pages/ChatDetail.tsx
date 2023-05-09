import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import { GiftedChat } from 'react-native-gifted-chat';
import { StackNavigationProps } from '../App'
import CustomBubble from '../components/ChatProp/CustomBubble';
import CustomInputToolbar from '../components/ChatProp/CustomInputToolbar';
import requestApi from '../utils/request';
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
  },
];

function ChatDetail({ route, navigation }: StackNavigationProps) {
  const userId = global.gUserId;
  const ChatUser = route.params?.userId;
  
  const [messages, setMessages] = useState([] as ChatMessage[]);

  const IUser = {
    _id: userId,
    name: 'ChatGPT',
    avatar: "https://picsum.photos/700",
  }
  const UUser = {
    _id: ChatUser,
    name: 'ChatGPT',
    avatar: "https://picsum.photos/700",
  }

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
        IUser.name = values[0].data.userNickName.info
        UUser.name = values[1].data.userNickName.info
        IUser.avatar = values[0].data.userAvatar.info
        UUser.avatar = values[1].data.userAvatar.info
      })
    }
    for (let i = 0; i < resAllMessages.data.length; ++i) {
      if(resAllMessages.data[i].isReceived){
        if(resAllMessages.data[i].image==''){
          CurMessages.unshift(
            {
              _id: resAllMessages.data[i].id,
              text: resAllMessages.data[i].text,
              createdAt: resAllMessages.data[i].time,
              user: UUser
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
              user: IUser
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
            }
          )
        }
      }
      
    }
    
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, CurMessages)
    );
  }

  function onSend(newMessages: ChatMessage[] = []) {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, newMessages),
    );
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
            user: UUser
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

    const intervalId = setInterval(() => {
      getUnreadMessages();
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={onSend}
      user={{ _id: userId }}
      showAvatarForEveryMessage={true}
      alignTop={true}
      renderBubble={(props)=><CustomBubble {...props}/>}
      renderInputToolbar={(props) => <CustomInputToolbar {...props} messages={messages} ChatUser={ChatUser}/>}
      renderAvatar={(props) => (
        <View style={{ marginLeft: 10 }}>
          <Avatar
            size={42}
            source={{ uri: props.currentMessage.user.avatar }}
            rounded
          />
        </View>
      )}
    />
  );
}

export default ChatDetail;
