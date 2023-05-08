import React from 'react';
import { Alert } from 'react-native';
import { Bubble } from 'react-native-gifted-chat';


interface CustomBubbleProps {
  wrapperStyle?: {
    left?: any;
    right?: any;
  };
  textStyle?: {
    left?: any;
    right?: any;
  };
  messageId?:any;
  onMessageRecall?:any;
  currentMessage?:any;
}


function CustomBubble(props: CustomBubbleProps) {
  function handleLongPress() {
    const { messageId, onMessageRecall } = props;
    const canRecall = props.currentMessage.canRecall !== false; // default is true
    if (canRecall) {
      Alert.alert(
        'Recall message',
        'Are you sure you want to recall this message?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Recall',
            style: 'destructive',
            onPress: () => onMessageRecall(messageId),
          },
        ],
      );
    }
  }

  return (
    <Bubble
      {...props}
      wrapperStyle={{
        left: {
          backgroundColor: '#FFFFFF',
          borderRadius: 20,
          borderWidth: 1,
          borderColor: '#FFFFFF',
          marginLeft: 10,
        },
        right: {
          backgroundColor: '#6200EE',
          borderRadius: 20,
          borderWidth: 1,
          borderColor: '#6200EE',
          marginRight: 10,
        },
      }}
      textStyle={{
        left: {
          color: '#000',
        },
        right: {
          color: '#FFF',
        },
      }}
      // onLongPress={handleLongPress}
    />
  );
}

export default CustomBubble;
