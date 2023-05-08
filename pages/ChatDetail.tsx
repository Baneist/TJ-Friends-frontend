import React, { useState } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import CustomBubble from './ChatProp/CustomBubble';
import CustomInputToolbar from './ChatProp/CustomInputToolbar';

type ChatMessage = {
  _id: number;
  text: string;
  createdAt: Date;
  user: {
    _id: number;
    name: string;
  };
};

function ChatDetail() {
  const [messages, setMessages] = useState([
    {
      _id: 1,
      text: '你好',
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'ChatGPT',
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
      renderBubble={(props)=><CustomBubble {...props}/>}
      renderInputToolbar={(props) => <CustomInputToolbar {...props} />}
    />
  );
}

export default ChatDetail;
