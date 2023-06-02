import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Image, Pressable, Alert } from 'react-native';
import { Block, Text } from 'galio-framework';
import { Avatar, Button, List } from 'react-native-paper';
import requestApi, { requestApiForMockTest } from '../../utils/request';
import { userProp, defaultInfo } from './Profile';
import { AxiosResponse } from 'axios';
import { followProp } from './FollowingList';
import { StackNavigationProps } from '../../App';
import { useFocusEffect } from '@react-navigation/native';

// 获取屏幕宽高
const { width, height } = Dimensions.get('screen');

interface draftProps{
    photoUrl:string [],
    time:string,
    content:string,
    draftId:string,
    isAnonymous:number,
    pms:number
}

const defaultDraft = [
    {
        photoUrl:[''],
        time:'',
        content:'',
        draftId:'1',
        isAnonymous:1,
        pms:1
    },
]

// 关注列表页面
const DraftList = ({ route, navigation }: StackNavigationProps) => {
  //当前用户
  const curUser = global.gUserId;
  const [drafts, setDrafts] = useState(defaultDraft);
  async function fetchData() {
    const res = await requestApi('get', '/drafts', null, true, 'get drafts failed.')
    console.log(res.data)
    setDrafts(res.data)
  }

  async function deleteDraft(draftId:string){
    Alert.alert(
        '提示',
        '确定要删除这条草稿吗？',
        [
          {
            text: "是",
            style: 'destructive',
            // This will continue the action that had triggered the removal of the screen
            onPress: async () => {
                await requestApi('post', '/deleteDraft', {draftId:draftId}, true, "删除草稿失败")
                //删除回显
                fetchData()
            }
          },
          {
            text: '取消',
            style: 'cancel',
          },
        ]
      );
  }

  useFocusEffect(
    React.useCallback(() => {
      fetchData()
      return () => {
      };
    }, [])
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {drafts.map((item, idx) => (
            <Pressable key={idx} onPress={() => navigation.navigate('EditDraft',{draftId:item.draftId})}>
                <View style={styles.container}>
                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                    <View>
                        <Text style={[styles.title,{fontSize:18, fontWeight:'bold'}]}>Moment</Text>
                        <Text style={styles.title}>{item.time}</Text>
                    </View>
                    <Button onPress={() => deleteDraft(item.draftId)}>删除</Button>
                    </View>
                    <List.Item 
                        title={item.content}
                        titleNumberOfLines={3}
                        left={props => 
                            <Image  
                            source={{uri:item.photoUrl.length? item.photoUrl[0]: "https://picsum.photos/700"}}
                            style={{width:100, height:100}}
                            />
                        }
                    />
                </View>
            </Pressable>
        ))}
        {!drafts.length &&
         <View style={{flex:1, alignItems:'center'}}>
         <Text style={{color:'#525F7F', marginTop:20}}>---暂无更多---</Text>
       </View>
       }
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    container:{
        backgroundColor:'white', 
        marginBottom:10,
        padding:10
    },
    title:{
        color:"#525F7F", fontSize:16
    }
});

export default DraftList;
