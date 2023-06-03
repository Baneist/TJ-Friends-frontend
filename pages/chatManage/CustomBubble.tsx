import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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

  if(props.currentMessage.isRevoke){
    return (
      <View style={styles.revokedBubble}>
        <Text style={styles.revokedText}>
          {`${props.currentMessage.user.name} 撤回了一条消息`}
        </Text>
      </View>
    );
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
    />
  );
}

const styles = StyleSheet.create({
  revokedBubble: {
    height: 40, 
    justifyContent: 'center', 
    flex: 1,
  },
  revokedText: {
    textAlign: 'center', // 文字水平居中
  },
});

export default CustomBubble;
