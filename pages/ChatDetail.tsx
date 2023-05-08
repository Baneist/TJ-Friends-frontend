import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import { GiftedChat } from 'react-native-gifted-chat';
import CustomBubble from '../components/ChatProp/CustomBubble';
import CustomInputToolbar from '../components/ChatProp/CustomInputToolbar';

type ChatMessage = {
  _id: number;
  text: string;
  createdAt: Date;
  user: {
    _id: number;
    name: string;
    avatar: string;
  };
};

function ChatDetail() {
  const [messages, setMessages] = useState([
    {
      _id: 5,
      text: '谢谢',
      createdAt: new Date(new Date().getTime() + 2800 * 1000),
      user: {
        _id: 2,
        name: 'ChatGPT',
        avatar: "https://picsum.photos/700",
      },
    },

    {
      _id: 4,
      text: '那你很棒棒',
      createdAt: new Date(new Date().getTime() + 2800 * 1000),
      user: {
        _id: 1,
        name: 'ME',
        avatar: "https://picsum.photos/700",
      },
    },

    {
      _id: 3,
      text: '我写完啦',
      createdAt: new Date(new Date().getTime() + 1800 * 1000),
      user: {
        _id: 2,
        name: 'ChatGPT',
        avatar: "https://picsum.photos/700",
      },
    },
    
    {
      _id: 2,
      text: '你今天作业写完了吗',
      createdAt: new Date(new Date().getTime() + 60 * 1000),
      user: {
        _id: 2,
        name: 'ChatGPT',
        avatar: "https://picsum.photos/700",
      },
    },

    {
      _id: 1,
      text: '你好',
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'ChatGPT',
        avatar: "https://picsum.photos/700",
      },
    },

  ]);

  function onSend(newMessages: ChatMessage[] = []) {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, newMessages),
    );
  }
  

  return (
    <GiftedChat
      messages={messages}
      onSend={onSend}
      user={{ _id: 1 }}
      alignTop={true}
      renderBubble={(props)=><CustomBubble {...props}/>}
      renderInputToolbar={(props) => <CustomInputToolbar {...props} />}
      renderAvatar={(props) => (
        <View style={{ marginLeft: 10 }}>
          <Avatar
            size={42}
            source={{ uri: props.currentMessage.user.avatar }}
            rounded
          />
          {/* <Text style={{ fontSize: 12 }}>{props.currentMessage.user.name.slice(0, 8)}</Text> */}
        </View>
      )}
    />
  );
}

export default ChatDetail;
