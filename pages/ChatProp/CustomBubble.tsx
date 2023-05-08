import React from 'react';
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
}


function CustomBubble(props: CustomBubbleProps) {
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

export default CustomBubble;
