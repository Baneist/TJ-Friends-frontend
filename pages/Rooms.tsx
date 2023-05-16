import React, { useState } from 'react';
import { Pressable, ScrollView, View, StyleSheet } from 'react-native';
import { Button, Card, Divider, FAB } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Modal from 'react-native-modal';
import { StackNavigationProps } from '../App';
import WaterfallFlow from 'react-native-waterfall-flow'
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


const FloatButton = ({ onPressFAB }: { onPressFAB: () => void }) => (
    <FAB
        icon="plus"
        style={styles.fab}
        customSize={50}
        onPress={onPressFAB}
    />
);

interface CardProps {
    goToDetail?: () => void,
    key?: number,
    content?: any,
    navigation?: any,
    height: number
}
export const CardwithButtons = (props: CardProps) => {
    const [MenuVisible, setMenuVisible] = useState(false);
    const toggleMenu = () => {
        setMenuVisible(!MenuVisible);
    };
    return (
        <View>
            <Pressable onPress={props.goToDetail} onLongPress={toggleMenu}>
                <Card mode='contained' style={{ borderRadius: 5 }}  >
                    <Card.Cover source={{ uri: "https://picsum.photos/600/400" }} style={{ height: props.height }} />
                    <Card.Title title="Room Name" subtitle="Description" />
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
    let list = [1];
    for (let index in [1, 2, 3, 4, 5, 6, 7, 8]) {
        list[index] = Math.random() * 50 + 100;
    }
    return (
        <View style={{ flex: 1, marginBottom: bottom }}>
            <ScrollView>
                <WaterfallFlow
                    data={list}
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
                                height={item}
                                goToDetail={() => { }}
                            />
                        </View>)
                    }} />
                {/* eslint-disable-next-line max-len */}
                {/* -> Set bottom view to allow scrolling to top if you set bottom-bar position absolute */}
                <View style={{ height: 90 }} />
            </ScrollView>
            <FloatButton onPressFAB={() => navigation.navigate('CreateRoom')} />
            {/* <NoticeManageButton onPressFAB={() => navigation.navigate('NoticeManageScreen')} /> */}
        </View>
    );
}
export default RoomsScreen;