import React, { useState } from 'react';
import { Pressable, View, StyleSheet, Text } from 'react-native';
import { Button, Card, Divider, FAB, TextInput } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Modal from 'react-native-modal';
import { StackNavigationProps } from '../../App';
import WaterfallFlow from 'react-native-waterfall-flow'
import { useFocusEffect } from '@react-navigation/native';
import requestApi from '../../utils/request';

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 10,
        bottom: 80,
    },
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    menu: {
        backgroundColor: '#fff',
        padding: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
});

interface FABProps {
    onPressFAB: () => void,
    navigation: any,
}
const FloatButton = (props: FABProps) => {
    const [text, setText] = useState('');
    const [pwd, setPwd] = useState('');

    const [visible, setVisible] = useState(false);
    const showDialog = () => {
        setVisible(true);
        toggleMenu();
    }
    const hideDialog = () => setVisible(false);

    const [MenuVisible, setMenuVisible] = useState(false);
    const toggleMenu = () => {
        setMenuVisible(!MenuVisible);
    };

    return (
        <View>
            <FAB
                icon="plus"
                style={styles.fab}
                customSize={50}
                onPress={toggleMenu}
            />
            {visible && <Modal isVisible={true} onBackdropPress={hideDialog} style={{
                justifyContent: 'center',
                margin: 20,

            }}>
                <View style={{
                    backgroundColor: '#fff',
                    padding: 10,
                    borderRadius: 10,
                }}>
                    <Text style={{ marginLeft: 10, marginTop: 10, fontWeight: 'bold' }}>房间号</Text>
                    <TextInput
                        mode='outlined'
                        outlineStyle={{ backgroundColor: '#fff', borderColor: 'whitesmoke', borderRadius: 10 }}
                        style={{
                            marginHorizontal: 10
                        }}
                        value={text}
                        onChangeText={setText}
                        scrollEnabled={false}
                        autoFocus={false}
                    />
                    <Text style={{ marginLeft: 10, marginTop: 10, fontWeight: 'bold' }}>房间密码</Text>
                    <TextInput
                        mode='outlined'
                        outlineStyle={{ backgroundColor: '#fff', borderColor: 'whitesmoke', borderRadius: 10 }}
                        style={{
                            marginHorizontal: 10
                        }}
                        value={pwd}
                        onChangeText={setPwd}
                        scrollEnabled={false}
                        autoFocus={false}
                    />
                    <Button onPress={props.navigation.navigate('RoomInside', { roomId: text,roonPwd:pwd })}>加入</Button>
                </View>
            </Modal>}
            {MenuVisible && <Modal
                isVisible={true}
                onBackdropPress={toggleMenu}
                style={styles.modal}
            >
                <View style={styles.menu}>
                    <Button style={{ height: 50, paddingTop: 5 }} onPress={
                        showDialog
                    }>加入房间</Button>
                    <Divider />
                    <Button style={{ height: 50, paddingTop: 5 }} onPress={
                        () => { toggleMenu(); props.onPressFAB(); }
                    }>创建房间</Button>
                    <Divider />
                    <Button style={{ height: 50, paddingTop: 5 }} onPress={
                        toggleMenu
                    }>取消</Button>
                </View>

            </Modal>}



        </View>
    )
};

interface CardProps {
    goToDetail?: () => void,
    key?: number,
    content?: any,
    navigation?: any,
}
export const CardwithButtons = (props: CardProps) => {
    const [MenuVisible, setMenuVisible] = useState(false);
    const toggleMenu = () => {
        setMenuVisible(!MenuVisible);
    };
    return (
        <View>
            <Pressable onPress={props.goToDetail} onLongPress={toggleMenu}>
                <Card mode='contained' style={{ borderRadius: 5 }} >
                    <Card.Cover source={{ uri: props.content.coverUrl === "" ? "https://picsum.photos/600/400" : props.content.coverUrl }} style={{ height: props.content.height }} />
                    <Card.Title title={props.content.roomName} subtitle={props.content.roomDescription} />
                </Card>
            </Pressable>
            <Modal
                isVisible={MenuVisible}
                onBackdropPress={toggleMenu}
                style={styles.modal}
            >
                <View style={styles.menu}>
                    <Button style={{ height: 50, paddingTop: 5 }} onPress={
                        toggleMenu
                    }>举报</Button>
                    <Divider />
                    <Button style={{ height: 50, paddingTop: 5 }} onPress={
                        toggleMenu
                    }>取消</Button>
                </View>
            </Modal>

        </View>
    );
};

const RoomsScreen = ({ navigation }: StackNavigationProps) => {
    const { bottom } = useSafeAreaInsets();
    const [roomlist, setlist] = useState([] as any[]);
    let rooms = [] as any[];
    async function fetchData() {
        rooms = []
        const res = await requestApi('get', '/rooms', null, true, 'getRooms failed')
        if (res.code == 0) {
            for (let index in res.data) {
                res.data[index].height = Math.random() * 50 + 100;
            }
            rooms = rooms.concat(res.data);
            setlist(rooms);
        }
    }
    useFocusEffect(React.useCallback(() => {
        fetchData()
        return () => {
        };
    }, []))

    return (
        <View style={{ flex: 1, marginBottom: bottom }}>
            <Button onPress={()=>navigation.navigate('RoomInside', {roomId:'6', roomPwd:'1'})}>Jump To</Button>
            <WaterfallFlow
                data={roomlist}
                numColumns={2}
                renderItem={({ item, index, columnIndex }) => {
                    return (<View
                        style={{
                            paddingLeft: columnIndex === 0 ? 8 : 4,
                            paddingRight: columnIndex === 0 ? 4 : 8,
                            paddingTop: 3,
                            paddingBottom: 3
                        }}>
                        <CardwithButtons
                            goToDetail={() => { navigation.navigate('RoomInside', { roomId: item.roomId, roomPwd: null }) }}
                            content={item}
                        />
                    </View>)
                }}
            />
            {/* eslint-disable-next-line max-len */}
            {/* -> Set bottom view to allow scrolling to top if you set bottom-bar position absolute */}
            <View style={{ height: 90 }} />

            <FloatButton
                onPressFAB={() => navigation.navigate('CreateRoom')}
                navigation={navigation}
            />
            {/* <NoticeManageButton onPressFAB={() => navigation.navigate('NoticeManageScreen')} /> */}
        </View>
    );
}
export default RoomsScreen;