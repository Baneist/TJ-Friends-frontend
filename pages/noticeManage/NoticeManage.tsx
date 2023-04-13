import React, { useState }  from 'react';
import { NavigationProps } from '../../App';
import Badge from '../../components/NoticeBadge/NoticeBadge';
import {IconButton} from 'react-native-paper';
import { View, Text,Image, StyleSheet, Dimensions, Alert, TouchableOpacity } from 'react-native';

export const styles = StyleSheet.create({
  btscreen: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    height: 100,
    width: Dimensions.get('window').width,
    backgroundColor: '#fcfcfc',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 10,
  },
  label1: {
    fontSize: 12,
  },
  sys_msg_list: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 100,
    backgroundColor: '#fcfcfc',
    marginTop: 20,
  },
  container: {
    backgroundColor: '#fcfcfc',
    padding: 10,
    maxWidth: '100%',
    alignSelf: 'flex-start',
    marginBottom: 2,
    flexDirection: 'row',
  },
  avatarContainer: {
    marginRight: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 40,
    height: 40,
  },
  contentContainer: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  senderNameText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timestampText: {
    fontSize: 12,
    color: '#999999',
  },
  messageContainer: {
    marginBottom: 5,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },

});

interface ChatCardProps {
  message: string;
  timestamp: Date;
  senderName: string;
  senderAvatar: string;
}

const ChatCard = ({ message, timestamp, senderName, senderAvatar }: ChatCardProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={()=>{  }}>
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: senderAvatar }} style={styles.avatarImage} />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.senderNameText}>{senderName}</Text>
            <Text style={styles.timestampText}>{timestamp.toLocaleString()}</Text>
          </View>
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

function NoticeLikeButton() {
  const [count, setCount] = useState<number>(1);
  return (
    <View style={{ alignItems: 'center' }}>
      <IconButton icon='heart' key={'heart'} size={30} onPress={() => { Alert.alert('a', 'b') }} />
      <Text style={styles.label1}>喜欢我的</Text>
      {count > 0 && <Badge count={count} />}
    </View>
  );
}

function NoticeCommentButton() {
  const [count, setCount] = useState<number>(2);
  return (
    <View style={{ alignItems: 'center' }}>
      <IconButton icon='comment' key={'comment'} size={30} onPress={() => { }} />
      <Text style={styles.label1}>评论我的</Text>
      {count > 0 && <Badge count={count} />}
    </View>
  );
}

function NoticeShareButton() {
  const [count, setCount] = useState<number>(3);
  return (
    <View style={{ alignItems: 'center' }}>
      <IconButton icon='share' key={'share'} size={30} onPress={() => { }} />
      <Text style={styles.label1}>转发我的</Text>
      {count > 0 && <Badge count={count} />}
    </View>
  );
}

function NoticeFollowButton() {
  const [count, setCount] = useState<number>(4);
  return (
    <View style={{ alignItems: 'center' }}>
      <IconButton icon='eye' key={'share'} size={30} onPress={() => { }} />
      <Text style={styles.label1}>我关注的</Text>
      {count > 0 && <Badge count={count} />}
    </View>
  );
}

const NoticeManageScreen = ({ route, navigation }: NavigationProps) => {
  return (
      <View style={{ alignItems: 'center'}}>
        <View style={ styles.btscreen }>
          <NoticeLikeButton />
          <NoticeCommentButton />
          <NoticeShareButton />
          <NoticeFollowButton />
        </View>
        <View style={ {height: 0, marginTop:20} } />
        <View>
          <ChatCard
            message="Hello, how are you?"
            timestamp={new Date('2023-04-13T15:30:00Z')}
            senderName="John"
            senderAvatar="https://pica.zhimg.com/v2-daafda0978823b9f898c9673aa0ef83e_xl.jpg"
          />
          <ChatCard
            message="你有新的饿了么订单"
            timestamp={new Date('2023-04-13T15:30:00Z')}
            senderName="饿了么 - 订单通知"
            senderAvatar="https://pic1.zhimg.com/v2-af9ee0838023bc76b56078a333f9541f_l.jpg"
          />
        </View>
        <View style={{marginTop:20}}>
          <Text>--已经到底啦--</Text>
        </View>
      </View>
  );
};

export default NoticeManageScreen;