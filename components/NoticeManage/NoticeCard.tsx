import { TouchableOpacity, View, Image, Text, StyleSheet,Modal,LayoutRectangle, Dimensions, TouchableWithoutFeedback } from "react-native";
import { DialogBadge } from "./NoticeBadge";
import { useRef, useState } from "react";
import { Alert } from "react-native";
import { requestApiForMockTest } from "../../utils/request";
interface NoticeProps {
    message: string;
    timestamp: Date;
    senderName: string;
    senderAvatar: string;
    noticeId: number;
    readed: boolean;
    upstate: number;
    setUPState: Function;
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
      modalContent: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 4,
        position: 'absolute',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.35,
        shadowRadius: 3.84,
        elevation: 10,
      },
  }
  );
  export const NoticeCard = ({ message, timestamp, senderName, senderAvatar, noticeId, readed, upstate, setUPState}: NoticeProps) => {
    const [isReaded, setIsReaded] = useState(readed);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalLayout, setModalLayout] = useState<LayoutRectangle | null>(null);
    const buttonRef = useRef<TouchableOpacity>(null);
    const handleLongPress = () => {
      setIsModalVisible(true);
    };
  
    const handleCloseModal = () => {
      setIsModalVisible(false);
    };
  
    const handleDeleteItem = () => {
      console.log('send delete request');
      setUPState(upstate + 1);
      const res = requestApiForMockTest('post', '/notice/deleteNotice', { noticeId: noticeId }, true, '删除失败');
      setIsModalVisible(false);
    };
    const handleButtonLayout = (event: any) => {
      if (buttonRef.current) {
        buttonRef.current.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
          setModalLayout({ x: pageX, y: pageY, width: modalLayout?.width ?? 0, height: modalLayout?.height ?? 0 });
        });
      }
    };
    async function sendReaded() {
      const res = await requestApiForMockTest('post', '/notice/readSystemNotice', { noticeId: noticeId }, true, '标记已读失败');
      console.log('sendReaded');
    };
    return (
      <TouchableOpacity style={styles.container} onPress={()=>{ Alert.alert(senderName, message); setIsReaded(true); sendReaded();}} onLongPress={handleLongPress} ref={buttonRef} onLayout={handleButtonLayout}>
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
          {isReaded == false && <DialogBadge count={1} />}
        </View>
        <Modal visible={isModalVisible} onRequestClose={handleCloseModal} transparent>
          {modalLayout && (
            <TouchableOpacity activeOpacity={0} style={StyleSheet.absoluteFill} onPress={handleCloseModal}>
            <View style={[styles.modalContent, { left: modalLayout.x+Dimensions.get("screen").width/2, top: modalLayout.y-15, width: Dimensions.get("screen").width/3 }]}>
              <TouchableOpacity onPress={handleDeleteItem}>
                <Text>删除</Text>
              </TouchableOpacity>
            </View>
            </TouchableOpacity>
          )}
        </Modal>
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
    upstate: number;
    setUPState: Function;
    type: string;
  };

  export const NoticeCardDetailed = ({ message, timeStamp, senderName, senderAvatar, undealNum,noticeId ,originCommentId, originPostId, originPostTitle,upstate,setUPState, type}: NoticeDetailedProps) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalLayout, setModalLayout] = useState<LayoutRectangle | null>(null);
    const buttonRef = useRef<TouchableOpacity>(null);
    const handleLongPress = () => {
      setIsModalVisible(true);
    };
  
    const handleCloseModal = () => {
      console.log('close');
      setIsModalVisible(false);
    };
  
    const handleDeleteItem = () => {
      console.log('delete');
      setUPState(upstate + 1);
      const res = requestApiForMockTest('post', '/notice/deleteNotice', { noticeId: noticeId, type:type }, true, '删除失败');
      setIsModalVisible(false);
    };
    const handleButtonLayout = (event: any) => {
      if (buttonRef.current) {
        buttonRef.current.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
          setModalLayout({ x: pageX, y: pageY, width: modalLayout?.width ?? 0, height: modalLayout?.height ?? 0 });
        });
      }
    };
    return (
        <TouchableOpacity style={styles.container} onPress={()=>{ console.log('click') }} onLongPress={handleLongPress} ref={buttonRef} onLayout={handleButtonLayout}>
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
        <Modal visible={isModalVisible} onRequestClose={handleCloseModal} transparent>
          {modalLayout && (
            <TouchableOpacity activeOpacity={0} style={StyleSheet.absoluteFill} onPress={handleCloseModal}>
            <View style={[styles.modalContent, { left: modalLayout.x+Dimensions.get("screen").width/2, top: modalLayout.y+30, width: Dimensions.get("screen").width/3 }]}>
              <TouchableOpacity onPress={handleDeleteItem}>
                <Text>删除</Text>
              </TouchableOpacity>
            </View>
            </TouchableOpacity>
          )}
        </Modal>
        
      </TouchableOpacity>
    );
  };