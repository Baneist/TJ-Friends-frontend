import React, { useState } from 'react';
import { Platform, StyleSheet, Image, Switch, View, Text, Dimensions, Pressable } from 'react-native';
import { TextInput, List, Button, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SinglePicker from '../../components/AvatarPicker/SinglePicker';
import uploadImage from '../../utils/uploadImage';
import { BASE_URL } from '../../utils/request';

const CreatePage = () => {
    const [locked, setLocked] = useState(false);
    const [text1, setText1] = useState('');
    const [text2, setText2] = useState('');
    const [text3, setText3] = useState('');
    const { width, height } = Dimensions.get("screen");
    const [image, setImage] = useState("");
    const [showPickerOption, setShowPickerOption] = useState(false);
    function cancelPickerOption() {
        return (
            setShowPickerOption(false)
        );
    }
    function changeImage(uri: string) {
        setImage(uri)
    }
    async function handleCreate() {
        // const imageRes = await uploadImage(image);
        // if (imageRes.code === 0) {
        //     setImage(BASE_URL + imageRes.data.url);
        // }
        console.log('create');
    }
    return (
        <View style={{ backgroundColor: 'white', height: height - 100 }}>
            <View>
                <Text style={{ marginLeft: 10, marginTop: 15, fontWeight: 'bold' }}>房间封面</Text>
                {image != "" && <View style={{ marginVertical: 6 }}>
                    <Image source={{ uri: image }} style={{ borderRadius: 0, width: width - 20, height: 200, alignSelf: 'center' }} />
                    <Pressable
                        style={{ position: 'absolute', top: 0, right: 10, margin: 0 }}
                        onPress={() => setImage("")}>
                        <Icon name={'window-close'} style={{ fontSize: 15, color: 'white', backgroundColor: 'grey', opacity: 0.6 }} />
                    </Pressable>
                </View>
                }
                {image === "" && <IconButton
                    icon={'plus'}
                    mode='contained'
                    style={{
                        borderRadius: 0,
                        width: width - 20,
                        height: 200,
                        alignSelf: 'center',
                        borderStyle: 'dashed',
                        borderWidth: 1,
                        borderColor: 'darkgrey',
                        backgroundColor: 'white'
                    }}
                    size={70}
                    iconColor='darkgrey'
                    onPress={() => setShowPickerOption(true)}
                />}
                <Text style={{ marginLeft: 10, marginTop: 15, fontWeight: 'bold' }}>视频链接</Text>
                <TextInput
                    mode='outlined'
                    outlineStyle={{ backgroundColor: '#fff', borderColor: 'whitesmoke', borderRadius: 20 }}
                    style={{
                        marginHorizontal: 10
                    }}
                    placeholder='请把视频链接粘贴在这里'
                    placeholderTextColor='lightgrey'
                    value={text1}
                    onChangeText={setText1}
                    scrollEnabled={false}
                    autoFocus={false}
                />
                <View style={{ flexDirection: 'row', margin: 10 }}>
                    <Button
                        mode='text'
                        onPress={() => { }}
                    ><Text style={{ textDecorationLine: 'underline' }}>参考链接1</Text></Button>
                    <Button
                        mode='text'
                    ><Text style={{ textDecorationLine: 'underline' }}>参考链接2</Text></Button>
                </View>
                <Text style={{ marginLeft: 10, marginTop: 5, fontWeight: 'bold' }}>房间名称</Text>
                <TextInput
                    mode='outlined'
                    outlineStyle={{ backgroundColor: '#fff', borderColor: 'whitesmoke', borderRadius: 20 }}
                    style={{
                        marginHorizontal: 10
                    }}
                    placeholder='给你的房间起个名字吧'
                    placeholderTextColor='lightgrey'
                    value={text2}
                    onChangeText={setText2}
                    scrollEnabled={false}
                    autoFocus={false}
                />
                <Text style={{ marginLeft: 10, marginTop: 15, fontWeight: 'bold' }}>房间描述</Text>
                <TextInput
                    mode='outlined'
                    outlineStyle={{ backgroundColor: '#fff', borderColor: 'whitesmoke', borderRadius: 20 }}
                    style={{
                        marginHorizontal: 10
                    }}
                    placeholder='请填写放映内容'
                    placeholderTextColor='lightgrey'
                    value={text3}
                    onChangeText={setText3}
                    scrollEnabled={false}
                    autoFocus={false}
                />
            </View>
            <Text style={{ marginLeft: 10, marginTop: 15, marginBottom: 5, fontWeight: 'bold' }}>房间权限</Text>
            <View style={{ borderRadius: 10, backgroundColor: 'whitesmoke', marginHorizontal: 10 }}>
                <List.Item title='公开'
                    left={() => <Icon name='lock' size={24} style={{ marginLeft: 15 }} />}
                    right={() => <Switch
                        style={{ marginTop: Platform.OS == 'ios' ? -3 : -10, marginBottom: Platform.OS == 'ios' ? -3 : -10 }}
                        value={locked}
                        onValueChange={() => setLocked(!locked)}
                    />}
                />
            </View>
            <Button
                mode='contained'
                style={{ margin: 20, }}
                onPress={handleCreate}
                disabled={text1===""||text2===""}
            >
                创建
            </Button>
            <SinglePicker showPickerOption={showPickerOption} onBackdropPress={cancelPickerOption} setImage={changeImage} />

        </View>
    );
}
export default CreatePage;