import { TouchableOpacity, View, Image, Text, StyleSheet} from "react-native";
import { DialogBadge } from "./NoticeBadge";
interface NoticeProps {
    message: string;
    timestamp: Date;
    senderName: string;
    senderAvatar: string;
    undeal_num: number;
  }
  
  const styles = StyleSheet.create({
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
  }
  );

  export const NoticeCard = ({ message, timestamp, senderName, senderAvatar, undeal_num }: NoticeProps) => {
    return (
      <TouchableOpacity style={styles.container} onPress={()=>{ console.log('click') }}>
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
          {undeal_num > 0 && <DialogBadge count={undeal_num} />}
        </View>
      </TouchableOpacity>
    );
  };

  interface NoticeDetailedProps {
    message: string;
    timeStamp: Date;
    senderName: string;
    senderAvatar: string;
    undealNum: number;
    originPostId: number;
    originCommentId: number;
    originPostTitle: string;
    noticeId: number;
  };

  export const NoticeCardDetailed = ({ message, timeStamp, senderName, senderAvatar, undealNum,noticeId ,originCommentId, originPostId, originPostTitle }: NoticeDetailedProps) => {
    return (
      <TouchableOpacity style={styles.container} onPress={()=>{ console.log('click') }}>
        <View style={styles.container}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: senderAvatar }} style={styles.avatarImage} />
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.senderNameText}>{senderName}</Text>
              <Text style={styles.timestampText}>{timeStamp.toLocaleString()}</Text>
            </View>
            <View style={styles.messageContainer}>
              <Text style={styles.messageText}>{message}</Text>
            </View>
            <View style={{backgroundColor: '#f2f2f2', padding: 10, borderLeftWidth: 5, borderLeftColor: '#ccc'}}>
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>{originPostTitle}</Text>
            </View>

          </View>
          {undealNum > 0 && <DialogBadge count={undealNum} />}
        </View>
      </TouchableOpacity>
    );
  };