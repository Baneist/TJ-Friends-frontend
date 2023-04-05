import React , {useState}from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Pressable,
  Platform
} from "react-native"
import {Button, Card, TextInput, IconButton} from 'react-native-paper';
import { Block, Text, Input } from "galio-framework";
import DateTimePicker from '@react-native-community/datetimepicker';

//获取屏幕宽高
const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

//图片
const profileImage = {
  ProfileBackground : require("../assets/imgs/profile-screen-bg.png"),
  ProfilePicture: 'https://picsum.photos/700'
}

const Viewed = [
  'https://images.unsplash.com/photo-1501601983405-7c7cabaa1581?fit=crop&w=240&q=80',
  'https://images.unsplash.com/photo-1543747579-795b9c2c3ada?fit=crop&w=240&q=80',
  'https://images.unsplash.com/photo-1551798507-629020c81463?fit=crop&w=240&q=80',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?fit=crop&w=240&q=80',
  'https://images.unsplash.com/photo-1503642551022-c011aafb3c88?fit=crop&w=240&q=80',
  'https://images.unsplash.com/photo-1482686115713-0fbcaced6e28?fit=crop&w=240&q=80',
];

//用户头像 动态中
function UserPhoto({pressable} : {pressable: boolean}) {
  function handleClick() {
    console.log('pressed');
  }
  if(pressable){
    return (
      <Pressable onPress={handleClick}>
        <Image source={{ uri: profileImage.ProfilePicture }} style={styles.moment_avatar}/>
      </Pressable>
    );
  }
  else{
    return (
      <Image source={{ uri: profileImage.ProfilePicture }} style={styles.moment_avatar}/>
    )
  }
}

//资料页面
export function EditProfile(){
  const { bottom } = useSafeAreaInsets();
  //编辑个人资料
  function editProfile(){
    console.log('跳转编辑个人资料')
  }
  //选择日期
  const [date, setDate] = useState(new Date(1598051730000));
  const [show, setShow] = useState(false);  //初始为false

  const showDatepicker = () => {
    setShow(true);
  };
  return (
    <Block flex style={{marginBottom: bottom}}>
      <Block flex>
        {/* 资料卡片 */}
        <ImageBackground
          source={profileImage.ProfileBackground}
          style={styles.profileContainer}
          imageStyle={styles.profileBackground}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ width}}
            >
            <Block flex style={styles.profileCard}>
              {/* 头像 */}
                <Block middle style={styles.avatarContainer}>
                  <Image 
                    source={{ uri: profileImage.ProfilePicture }}
                    style={styles.avatar}
                  />
                </Block>
              {/*输入框等 */}
                <Block flex>
                    {/* 先显示学号 姓名 */}
                    <Block middle>
                        <Text bold size={28} color="#32325D">
                        吉尔伽美什
                        </Text>
                        <Text size={16} color="#32325D" style={{ marginTop: 10 }}>
                        2052123
                        </Text>
                    </Block>
                    <Block middle row  style={{ marginTop: 10 }}>
                        <Text size={16} color="#32325D">
                        2020届
                        </Text>
                        <Text size={16} color="#32325D">
                        愉悦专业
                        </Text>
                    </Block>
                    <Block middle>
                        <TextInput  
                          mode="outlined"
                          label="昵称"
                          placeholder="Gilgamesh"
                          maxLength={32}
                          multiline
                          numberOfLines={2}
                          right={<TextInput.Affix text="/32" />}
                          style={styles.inputBox}
                        />
                        <TextInput  
                          mode="outlined"
                          label="个性签名"
                          placeholder="愉悦"
                          maxLength={32}
                          multiline
                          numberOfLines={16}
                          right={<TextInput.Affix text="/256" />}
                          style={styles.inputBox}
                        />
                        <TextInput  
                          mode="outlined"
                          label="兴趣爱好"
                          placeholder="喜欢钱和一切金闪闪的东西，还有哈哈哈哈哈哈（是个快乐的男人！）"
                          maxLength={32}
                          multiline
                          numberOfLines={16}
                          right={<TextInput.Affix text="/256" />}
                          style={styles.inputBox}
                        />
                        <Button onPress={showDatepicker} mode="elevated" icon="calendar">生日设置</Button>
                    </Block>
                </Block>
            </Block>
              {/* eslint-disable-next-line max-len */}
            {/* -> Set bottom view to allow scrolling to top if you set bottom-bar position absolute */}
            <View style={{ height: 190 }} />
            </ScrollView>
        </ImageBackground>
      </Block>
    </Block>
  )
}


const styles = StyleSheet.create({
  profileContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: 1
  },
  profileBackground: {
    width: width,
    height: height / 2
  },
  profileCard: {
    flex: 1,
    marginTop: 90,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: '#FFFFFF',
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2
  },
  info: {
    paddingHorizontal: 40
  },
  avatarContainer: {
    position: "relative",
    marginTop: -80
  },
  avatar: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 0
  },
  moment_avatar: {
      width:42,
      height:42,
      borderRadius:21,
  },
  nameInfo: {
    marginTop: 35
  },
  divider: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#E9ECEF"
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure
  },
  inputBox:{
    width: width / 1.2
  }
});