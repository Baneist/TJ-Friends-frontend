import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
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

interface MessageContextMenuProps {
  isVisible: boolean;
  onHide: () => void;
  onRemove: () => void;
  onRevoke: () => void;
}

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
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isContextMenuVisible, setContextMenuVisible] = useState(false);

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

  function onLongPress(context, currentMessage) {
    setSelectedMessage(currentMessage);
    setContextMenuVisible(true);
  }
  
  function MessageContextMenu({ isVisible, onHide, onRemove, onRevoke }: MessageContextMenuProps) {
    if (!isVisible) {
      return null;
    }
  
    return (
      <View style={styles.contextMenuContainer}>
        <TouchableOpacity style={styles.contextMenuItem} onPress={onRemove}>
          <Text style={styles.contextMenuItemText}>删除</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contextMenuItem} onPress={onRevoke}>
          <Text style={styles.contextMenuItemText}>撤回</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  function handleRemoveMessage(message) {
    // 根据消息的 _id 进行删除操作
    setMessages(previousMessages =>
      previousMessages.filter(m => m._id !== message._id)
    );
    setContextMenuVisible(false);
  }
  
  function handleRevokeMessage(message) {
    // 实现撤回消息的逻辑
    // ...
    setContextMenuVisible(false);
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
    <View style={styles.container}>
      <MessageContextMenu
      isVisible={isContextMenuVisible}
      onHide={() => setContextMenuVisible(false)}
      onRemove={() => handleRemoveMessage(selectedMessage)}
      onRevoke={() => handleRevokeMessage(selectedMessage)}
    />
      <GiftedChat
      messages={messages}
      onSend={onSend}
      onLongPress={onLongPress}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contextMenuContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#CCCCCC',
  },
  contextMenuItem: {
    paddingHorizontal: 20,
  },
  contextMenuItemText: {
    fontSize: 16,
    color: '#333333',
  },
});


export default ChatDetail;
