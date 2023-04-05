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
import {Button, Card, TextInput, Dialog, Portal, Provider,Snackbar,IconButton } from 'react-native-paper';
import { Block, Text, Checkbox,Toast } from "galio-framework";
import Icon from 'react-native-vector-icons/AntDesign';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

//获取屏幕宽高
const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

//图片
const profileImage = {
  ProfileBackground : require("../assets/imgs/profile-screen-bg.png"),
  ProfilePicture: 'https://picsum.photos/700'
}

//个人信息
const userInfo = {
  userId:'2052123',
  userName:'吉尔伽美什',
  userNickName: 'Gilgamesh',
  userGender: 'Male',
  userBirthDate:'2002-08-07',
  userStatus:'Enuma Elish!',
  userMajor:'愉悦',
  userYear:'2020',
  userInterest:'喜欢钱和一切金闪闪的东西，还有哈哈哈哈哈哈（是个快乐的男人！）'
}

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
//性别
function Gender(){
  if(userInfo.userGender=='Male')
    return (<Icon name="man" size={16} color="#32325D" style={{ marginTop: 10 }}>Male</Icon>)
  else
    return (<Icon name="woman" size={16} color="#32325D" style={{ marginTop: 10 }}>Female</Icon>)
}


//资料页面
export function EditProfile(){
  const { bottom } = useSafeAreaInsets();
  //选择日期
  const [date, setDate] = useState(new Date(1598051730000));

  //生日权限
  const [birthChecked, setBirthChecked] = useState(false);

  //解绑手机提示对话框
  const [unbindVisibel, setUnbindVisible]=useState(false);
  const [pwdInput, setpwdInput] = useState(false);
  const [pwdVisible, setpwdVisible]=useState(false);
  const [submitted, setsubmitted]=useState(false);
  const [password, setPassword] = useState('');
  function UnbindPhoneDialog(){
    const handlePasswordChange = (value:string) => {
      setPassword(value);
    };
    return (
      <Portal>
        <Dialog visible={unbindVisibel} dismissable={false}>
        <Dialog.Icon icon="alert" />
          <Dialog.Title>解绑手机</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">您确定要解绑手机吗？</Text>
            {pwdInput&&
             <TextInput
             label="Password"
             secureTextEntry={!pwdVisible}
             right={<TextInput.Icon icon="eye" onPress={()=>{
              setpwdVisible(!pwdVisible)
             }}/>}
           />
            }
          </Dialog.Content>
          <Dialog.Actions>
          {!pwdInput&&<Button mode='outlined' onPress={() =>{
              setpwdInput(true);
            }}>确定</Button>}
          {pwdInput&&<Button mode='outlined' onPress={() =>{
              setpwdInput(false);
              setUnbindVisible(false);
              setsubmitted(true);
            }}>提交</Button>}
            <Button mode='outlined' onPress={() =>{
              setUnbindVisible(false);
            }}>取消</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    )
  }

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
            <Provider>
            <Block flex style={styles.profileCard}>
              {/* 头像 */}
                <Block middle style={styles.avatarContainer}>
                  <Image 
                    source={{ uri: profileImage.ProfilePicture }}
                    style={styles.avatar}
                  />
                </Block>
                <Block flex>
                    {/* 先显示学号 姓名等不可修改信息 */}
                    <Block middle>
                        <Text bold size={28} color="#32325D">
                          {userInfo.userName}
                        </Text>
                        <Text size={16} color="#32325D" style={{ marginTop: 10 }}>
                          {userInfo.userId}
                        </Text>
                        <Gender />
                        <Text size={16} color="#32325D" style={{ marginTop: 10 }}>
                          {userInfo.userYear + '/' + userInfo.userMajor}
                        </Text>
                    </Block>
                    {/* 修改信息 */}
                    <Card elevation={5} style={{ margin: 10 }}>
                      <Card.Title 
                      title='个性信息'
                      subtitle='Personal Information'
                      left={(props) => <IconButton icon='emoticon-outline'/>}
                      />
                      <Card.Content>
                      <TextInput  
                          mode="outlined"
                          label="昵称"
                          placeholder={userInfo.userNickName}
                          maxLength={32}
                          multiline
                          numberOfLines={2}
                          right={<TextInput.Affix text="/32" />}
                          style={styles.inputBox}
                        />
                        <TextInput  
                          mode="outlined"
                          label="个性签名"
                          placeholder={userInfo.userStatus}
                          maxLength={32}
                          multiline
                          numberOfLines={16}
                          right={<TextInput.Affix text="/256" />}
                          style={styles.inputBox}
                        />
                        <TextInput  
                          mode="outlined"
                          label="兴趣爱好"
                          placeholder={userInfo.userInterest}
                          maxLength={32}
                          multiline
                          numberOfLines={16}
                          right={<TextInput.Affix text="/256" />}
                          style={styles.inputBox}
                        />
                      </Card.Content>
                    </Card>
                    {/* 手机号码 */}
                    <Card elevation={5} style={{ margin: 10 }}>
                    <Card.Title 
                      title='手机号码'
                      subtitle='Phone Number'
                      left={(props) => <IconButton icon='cellphone'/>}
                      />
                    <Card.Content>
                      <Block row space='between'>
                        <Text size={16} style={{marginTop:15,marginLeft:10}}
                        >+86 12332112345</Text>
                        <Button icon='cellphone-remove'
                        mode= 'outlined'
                        style={{marginTop:10}}
                        onPress={() =>{
                          setUnbindVisible(true)
                        }}
                        >解绑</Button>
                        {/* 解绑对话框 */}
                        <UnbindPhoneDialog />
                        <Snackbar
                            visible={submitted}
                            duration={1000}
                            onDismiss={()=>{setsubmitted(false)}}
                          >
                          <Icon name="check" color={'white'} size={15}> Submit successful!</Icon>
                      </Snackbar>
                      </Block>
                    </Card.Content>
                    </Card>
                    {/* 有权限的 */}
                    <Card elevation={5} style={{ margin: 10 }}>
                      <Card.Title 
                      title='隐私信息&权限设置'
                      subtitle='Private Information'
                      left={(props) => <IconButton icon='lock'/>}
                      />
                      <Card.Content>
                      <Block row space="between" style = {{marginTop:10}}>
                        <Button icon="cake-variant">
                          生日
                        </Button>
                          <DateTimePicker
                            value={date}
                            mode='date'
                          />
                          <Checkbox
                          label="他人可见" 
                          status={birthChecked?'checked':'unchecked'}
                          color='#5F0B65'
                          onPress={() =>{
                            setBirthChecked(!birthChecked)
                          }}
                          />
                        </Block>
                        <Block row space='between'>
                        <Button icon="school">
                          专业
                        </Button>
                        <Text size={15} style={{marginTop:10}}>{userInfo.userMajor}</Text>
                        <Checkbox
                          label="他人可见" 
                          status={birthChecked?'checked':'unchecked'}
                          color='#5F0B65'
                          onPress={() =>{
                            setBirthChecked(!birthChecked)
                          }}
                          />
                        </Block>
                        <Block row space='between'>
                        <Button icon="alpha-y-circle-outline">
                          学年
                        </Button>
                        <Text size={15} style={{marginTop:10}}>{userInfo.userYear}</Text>
                        <Checkbox
                          label="他人可见" 
                          status={birthChecked?'checked':'unchecked'}
                          color='#5F0B65'
                          onPress={() =>{
                            setBirthChecked(!birthChecked)
                          }}
                          />
                        </Block>
                        <Block row space='between'>
                        <Button icon="heart">
                          兴趣爱好
                        </Button>
                        <Checkbox
                          label="他人可见" 
                          status={birthChecked?'checked':'unchecked'}
                          color='#5F0B65'
                          onPress={() =>{
                            setBirthChecked(!birthChecked)
                          }}
                          />
                        </Block>
                        <Block row space='between'>
                        <Button icon="butterfly">
                          关注列表
                        </Button>
                        <Checkbox
                          label="他人可见" 
                          status={birthChecked?'checked':'unchecked'}
                          color='#5F0B65'
                          onPress={() =>{
                            setBirthChecked(!birthChecked)
                          }}
                          />
                        </Block>
                        <Block row space='between'>
                        <Button icon="candy">
                          粉丝列表
                        </Button>
                        <Checkbox
                          label="他人可见" 
                          status={birthChecked?'checked':'unchecked'}
                          color='#5F0B65'
                          onPress={() =>{
                            setBirthChecked(!birthChecked)
                          }}
                          />
                        </Block>
                      </Card.Content>
                    </Card>
                </Block>
            </Block>
              {/* eslint-disable-next-line max-len */}
            {/* -> Set bottom view to allow scrolling to top if you set bottom-bar position absolute */}
            <View style={{ height: 190 }} />
            </Provider>
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
  },
  surface: {
    marginTop:10,
    padding: 8,
    height: 60,
    width: width / 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});