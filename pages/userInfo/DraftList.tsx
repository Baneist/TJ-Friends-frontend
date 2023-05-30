import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Image, Pressable } from 'react-native';
import { Block, Text } from 'galio-framework';
import { Avatar, Button, List } from 'react-native-paper';
import requestApi from '../../utils/request';
import { userProp, defaultInfo } from './Profile';
import { AxiosResponse } from 'axios';
import { followProp } from './FollowingList';
import { StackNavigationProps } from '../../App';

// 获取屏幕宽高
const { width, height } = Dimensions.get('screen');

interface draftProps{
    postPhoto:string,
    postTime:string,
    postText:string,
    draftId:string
}

const defaultDraft = [
    {
        postPhoto:'https://picsum.photos/700',
        postTime:'2022-12-12 13:13:13',
        postText:'纯净，温暖，有力量。任世俗纷纷扰扰，星光熠熠不掩其芒。寻觅点点痕迹，描摹心心相印，戴伊晗只想和你漫步云端，带你一起《卷ToTheMorning》。',
        draftId:'1'
    },
    {
        postPhoto:'https://picsum.photos/700',
        postTime:'2022-12-12 13:13:13',
        postText:'晴时灼灼，天色茫茫，光辉熠熠。约好了林深海蓝，梦醒时分便去见你。戴伊晗EP《卷ToTheMorning》5月29日正式上线，这是专属于你的罗曼史。',
        draftId:'1'
    },
    {
        postPhoto:'https://picsum.photos/700',
        postTime:'2022-12-12 13:13:13',
        postText:'打翻汽水的仲夏夜，蝉鸣贯耳的好晴天。张扬的色彩伴着花草香铺面而上这是 坨姐 的派对，狂欢的KING@戴伊晗Curly 举杯“Vive l’été”夏日万岁。',
        draftId:'1'
    },
]

// 关注列表页面
const DraftList = ({ route, navigation }: StackNavigationProps) => {
  //当前用户
  const curUser = global.gUserId;
  const [drafts, setDrafts] = useState(defaultDraft);
  async function fetchData() {

  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {drafts.map((item, idx) => (
            <Pressable key={idx}>
                <View style={styles.container}>
                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                    <View>
                        <Text style={[styles.title,{fontSize:18, fontWeight:'bold'}]}>Moment</Text>
                        <Text style={styles.title}>{item.postTime}</Text>
                    </View>
                    <Button>删除</Button>
                    </View>
                    <List.Item 
                        title={item.postText}
                        titleNumberOfLines={3}
                        left={props => 
                            <Image  
                            source={{uri:item.postPhoto}}
                            style={{width:100, height:100}}
                            />
                        }
                    />
                </View>
            </Pressable>
        ))}
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
