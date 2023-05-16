import React, { useState } from 'react';
import { Platform, StyleSheet, Switch, View, Text, Dimensions } from 'react-native';
import { TextInput, List, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const CreatePage = () => {
    const [locked, setLocked] = useState(false);
    const [text, setText] = useState('');
  const { width, height } = Dimensions.get("screen");
    
    return (
        <View style={{ backgroundColor: 'white',height:height-100 }}>
            <View>
                <Text style={{ marginLeft: 10, marginTop: 15, fontWeight: 'bold' }}>视频链接</Text>
                <TextInput
                    mode='outlined'
                    outlineStyle={{ backgroundColor: '#fff', borderColor: 'whitesmoke', borderRadius: 20 }}
                    style={{
                        marginHorizontal: 10
                    }}
                    placeholder='请把视频链接粘贴在这里'
                    placeholderTextColor='lightgrey'
                    value={text}
                    onChangeText={setText}
                    scrollEnabled={false}
                    autoFocus={false}
                />
                <View style={{ flexDirection: 'row', margin: 10 }}>
                    <Button
                        mode='text'
                        onPress={() => { }}
                    ><Text style={{textDecorationLine:'underline'}}>参考链接1</Text></Button>
                    <Button
                        mode='text'
                    ><Text style={{textDecorationLine:'underline'}}>参考链接2</Text></Button>
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
                    value={text}
                    onChangeText={setText}
                    scrollEnabled={false}
                    autoFocus={false}
                />
            </View>
            <Text style={{ marginLeft: 10, marginTop: 15, marginBottom:5, fontWeight: 'bold' }}>房间权限</Text>
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
            <Button mode='contained' style={{ margin: 20,position:'relative',top:'40%' }}>创建</Button>
        </View>
    );
}
export default CreatePage;