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
import {Button, Card, TextInput, Dialog, Surface,
  Portal, Provider,Snackbar,IconButton, List, Chip } from 'react-native-paper';
import { Block, Text, Checkbox,Toast } from "galio-framework";
import DateTimePicker from '@react-native-community/datetimepicker';
//不知道为啥报错。。但是明明就是叫这个名字TT
import Icon from 'react-native-vector-icons/AntDesign';
import {NavigationProps} from '../../../App'
import Modal from 'react-native-modal';
import styles from './EditProfile.Style'
import AvatarPicker from "../../../components/AvatarPicker/AvatarPicker";

//获取屏幕宽高
const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

//图片
const profileImage = {
  ProfileBackground : require('../../../assets/imgs/profile-screen-bg.png'),
  ProfilePicture: 'https://picsum.photos/700'
}

//用户标签
const userLabel = [
  '金闪闪','帅','金发','红瞳','AUO','愉悦教主','强','黄金三靶'
]

//个人信息
const userInfo = {
  userId:'2052123',
  userName:'吉尔伽美什',
  userNickName: 'Gilgamesh',
  userGender: 'Male',
  userBirthDate:'2002-08-07',
  userStatus:'Enuma Elish!',
  userMajor:'愉悦',
  userPhone:'',
  userYear:'2020',
  userInterest:'喜欢钱和一切金闪闪的东西，还有哈哈哈哈哈哈（是个快乐的男人！）'
}

//性别
function Gender(){
  if(userInfo.userGender=='Male')
    return (<Icon name="man" size={16} color="#32325D" style={{ marginTop: 10 }}>Male</Icon>)
  else
    return (<Icon name="woman" size={16} color="#32325D" style={{ marginTop: 10 }}>Female</Icon>)
}


//资料页面
export function EditProfile({route, navigation}:NavigationProps){
  const { bottom } = useSafeAreaInsets();
  //选择生日
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [birthday, setbirthday] = useState(new Date());
  function ChooseBirthDay(){
    return(
      <Modal
        isVisible={showDatePicker}
        onBackdropPress={()=>{setShowDatePicker(false);setScrollEnabled(true);}}
        style={styles.modalFromBottom}
        >
        <Block row space='between' style={styles.contentContainer}>
          <Button mode='text'
          onPress={()=>{setShowDatePicker(false);setScrollEnabled(true);}} >取消</Button>
          <Button mode='text'
          onPress={()=>{setShowDatePicker(false);setScrollEnabled(true)}}>提交</Button>
        </Block>
        <View style={styles.contentContainer}>
          <DateTimePicker
            value={birthday}
            mode='date'
            display="spinner"
            themeVariant="light"
          />
        </View>
    </Modal>
    )
  }
  //选头像
  function cancelAvatarOption(){
    setShowAvatarOption(false);
    setScrollEnabled(true);
  }
  const [showAvatarOption, setShowAvatarOption] = useState(false);

  //权限
  const [birthChecked, setBirthChecked] = useState(false);

  //滑动允许
  const [scrollEnabled, setScrollEnabled] = useState(true);

  //解绑手机
  const [unbindVisible, setUnbindVisible]=useState(false);
  
  const [pwdVisible, setpwdVisible]=useState(false);
  const [submitted, setsubmitted]=useState(false);
  const [password, setPassword] = useState('');
  const UnbindPhone = () =>{
    const [pwdInput, setpwdInput] = useState(false);
    const handlePasswordChange = (value:string) => {
      setPassword(value);
    };
    return (
      <View>
        <Button icon='cellphone-remove'
          mode= 'outlined'
          style={{marginTop:10}}
          onPress={() =>{
            setUnbindVisible(true);
            setScrollEnabled(false);
            console.log('pressed')
          }}
          >解绑</Button>
        <Modal
        isVisible={unbindVisible}
        >
          <Card>
            <Card.Title 
            title='解绑手机'
            subtitle='unbind phone'
            titleVariant='titleMedium'
            left={(props) => <IconButton {...props} size={25} icon="alert" />}
            />
            <Card.Content>
            <Text variant="titleMedium">
              {pwdInput?'请输入密码以确认解绑':'您确定要解绑手机吗？'}
            </Text>
            {/* 输入密码 */}
              {pwdInput&&
                <TextInput
                mode='outlined'
                style={{marginTop:10}}
                label="Password"
                secureTextEntry={!pwdVisible}
                right={<TextInput.Icon icon="eye" onPress={()=>{
                  setpwdVisible(!pwdVisible)
                }}/>}
              />
              }
            </Card.Content>
            <Card.Actions>
              {!pwdInput&&<Button mode='outlined' style={{marginRight:10}} onPress={() =>{
                setpwdInput(true);
              }}>确定</Button>}
              {pwdInput&&<Button mode='outlined' style={{marginRight:10}} onPress={() =>{
                  setpwdInput(false);
                  setUnbindVisible(false);
                  setsubmitted(true);
                  setScrollEnabled(true);
                }}>提交</Button>}
              <Button mode='outlined' onPress={() =>{
                setpwdInput(false);
                setUnbindVisible(false);
                setScrollEnabled(true);
              }}>取消</Button>
            </Card.Actions>
          </Card>
        </Modal>
      </View>
    )
  }
  //绑定手机
  const BindPhone = () =>{
    const [bindVisible, setbindVisible]=useState(false);
    const [btnText, setBtnText]=useState('获取验证码');
    //控制倒计时中按钮不可点击
    const [btnDisable, setBtnDisable]=useState(false);
    const countDown = () =>{
      setBtnDisable(true);
      let seconds = 5;
      //重新获取
      setBtnText(`重新获取(${seconds}s)`);
      let timeCounter = setInterval(()=>{
        seconds--;
        setBtnText(`重新获取(${seconds}s)`);
        if(seconds==0){
          clearInterval(timeCounter);
          setBtnText('获取验证码');
          setBtnDisable(false);
        }
      }, 1000);
    }
    return(
    <View>  
      <Button icon='cellphone-check'
          mode= 'outlined'
          onPress={()=>{
            setbindVisible(true);
          }}
          style={{marginTop:10}}
      >绑定</Button>
      <Modal
        isVisible={bindVisible}
        >
          <Card>
            <Card.Title 
            title='绑定手机'
            subtitle='bind phone'
            titleVariant='titleMedium'
            left={(props) => <IconButton {...props} size={25} icon="cellphone-check" />}
            />
            <Card.Content>
              <TextInput
              mode='outlined'
              label='手机号码'
              maxLength={11}
              keyboardType='number-pad'
              />
              <TextInput
              mode='outlined'
              label='验证码'
              maxLength={6}
              keyboardType='number-pad'
              />
            </Card.Content>
            <Card.Actions>
            <Button mode='outlined' style={{marginRight:10}} onPress={countDown}
            disabled={btnDisable}
            >
            {btnText}</Button>
            <Button mode='outlined' style={{marginRight:10}} onPress={() =>{
              setbindVisible(false);
              setScrollEnabled(true);
            }}>取消</Button>
            </Card.Actions>
          </Card>
        </Modal>
    </View>
    )
  };

  return (
    <View style={{flex:1,  marginBottom: bottom}}>
      <View style={{flex:1}}>
        {/* 资料卡片 */}
        <ImageBackground
          source={profileImage.ProfileBackground}
          style={styles.profileContainer}
          imageStyle={styles.profileBackground}
          >
            <ScrollView
              scrollEnabled={scrollEnabled}
              showsVerticalScrollIndicator={false}
              style={{ width}}
            >
            <Block flex style={styles.profileCard}>
              {/* 头像 */}
              <Pressable onPress={()=>{setShowAvatarOption(true);setScrollEnabled(false);}}>
                <Block middle style={styles.avatarContainer}>
                  <Image 
                    source={{ uri: profileImage.ProfilePicture }}
                    style={styles.avatar}
                  />
                  <AvatarPicker 
                  showAvatarOption={showAvatarOption}
                  onBackdropPress={cancelAvatarOption}
                  />
                </Block>
              </Pressable>
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
                    <Surface elevation={1} mode='flat' style={{marginTop:10}}>
                    <Block flex>
                        <Card.Title 
                        title='个性信息'
                        subtitle='Personal Information'
                        titleVariant='titleMedium'
                        left={(props) => <IconButton {...props} size={25} icon="emoticon-outline" />}
                        />
                        <List.Section style={{marginBottom:0}}>
                          <Pressable onPress={()=>{navigation.navigate('EditNickName')}}>
                          <Surface elevation={1}>
                          <List.Item style={{marginLeft:25}}
                          left={() => <><Text size={16} style={{marginTop:2}}>昵        称</Text></>}
                          title={userInfo.userNickName} 
                          right={() => <List.Icon icon="chevron-right" />} />
                          </Surface></Pressable>
                          <Pressable onPress={()=>{setShowDatePicker(true);setScrollEnabled(false);}}>
                          <Surface elevation={1}>
                          <List.Item style={{marginLeft:25}}
                          left={() => <><Text size={16} style={{marginTop:2}}>生        日</Text></>}
                          title={userInfo.userBirthDate} 
                          right={() => <List.Icon icon="chevron-right" />} />
                          </Surface></Pressable>
                          <ChooseBirthDay />
                          <Pressable onPress={()=>{navigation.navigate('EditStatus')}}>
                          <Surface elevation={1}>
                          <List.Item style={{marginLeft:25}}
                          left={() => <><Text size={16} style={{marginTop:2}}>个性签名</Text></>}
                          title={userInfo.userStatus} 
                          right={() => <List.Icon icon="chevron-right" />} />
                          </Surface></Pressable>
                          <Pressable onPress={()=>{navigation.navigate('EditInterest')}}>
                          <Surface elevation={1}>
                          <List.Item style={{marginLeft:25}}
                          left={() => <><Text size={16} style={{marginTop:2}}>兴趣爱好</Text></>}
                          title={userInfo.userInterest} 
                          right={() => <List.Icon icon="chevron-right" />} />
                          </Surface></Pressable>
                          <Pressable onPress={()=>{navigation.navigate('EditLabel')}}>
                          <Surface elevation={1}>
                          <List.Item style={{marginLeft:25}}
                          left={() => <><Text size={16} style={{marginTop:2}}>标        签</Text></>}
                          title={props =>
                            <View style={{flex:1,flexDirection:"row",flexWrap:'wrap'}}>
                            {userLabel.map((label, idx)=>
                            <Chip key={idx} style={{marginRight:10,marginBottom:10}} mode='outlined' >{label}</Chip>
                            )}
                          </View>} 
                          right={() => <List.Icon icon="chevron-right" />} />
                          </Surface></Pressable>
                        </List.Section>
                    </Block>
                    </Surface>
                    {/* 手机号码 */}
                    <Surface elevation={1} mode='flat' style={{marginTop:10}}>
                    <Block flex>
                    <Card.Title 
                        title='手机号码'
                        subtitle='Phone Number'
                        titleVariant='titleMedium'
                        left={(props) => <IconButton {...props} size={25} icon="cellphone" />}
                        />
                        <List.Section style={{marginBottom:0, marginTop:0}}>
                        <Surface elevation={1}>
                          <List.Item style={{marginLeft:25}}
                          left={() => <><Text size={16} style={{marginTop:16.5}}>+86</Text></>}
                          title={userInfo.userPhone?userInfo.userPhone:'暂未绑定'}
                          right={() => userInfo.userPhone?<UnbindPhone />:<BindPhone />}
                          />
                          </Surface>
                        </List.Section>
                        <Snackbar
                            visible={submitted}
                            duration={1000}
                            onDismiss={()=>{setsubmitted(false)}}
                          >
                          <Icon name="check" color={'white'} size={15}> Submit successful!</Icon>
                      </Snackbar>
                      </Block>
                      </Surface>
                       {/* 隐私 */}
                      <Surface elevation={1} mode='flat' style={{marginTop:10}}>
                      <Block flex>
                      <Card.Title 
                        title='权限设置'
                        subtitle='Permission Setting'
                        titleVariant='titleMedium'
                        left={(props) => <IconButton {...props} size={25} icon="lock" />}
                        right = {(props) => 
                        <Button mode='outlined' icon='check'
                        style={{marginRight:25}} onPress={() =>{console.log('submit')}}
                        >保存</Button>}
                      />
                        <List.Section style={{marginBottom:0}}>
                        <Surface elevation={1}>
                          <List.Item style={{marginLeft:25}}
                          left={() => <><Text size={16} style={{marginTop:2}}>生日</Text></>}
                          title='' 
                          right={() => <>
                          <Checkbox
                          label="他人可见" 
                          status={birthChecked?'checked':'unchecked'}
                          color='#5F0B65'
                          onPress={() =>{
                            setBirthChecked(!birthChecked)
                          }}/></>} /></Surface>
                          <Surface elevation={1}>
                          <List.Item style={{marginLeft:25}}
                          left={() => <><Text size={16} style={{marginTop:2}}>专业</Text></>}
                          title=''
                          right={() => <>
                          <Checkbox
                          label="他人可见" 
                          status={birthChecked?'checked':'unchecked'}
                          color='#5F0B65'
                          onPress={() =>{
                            setBirthChecked(!birthChecked)
                          }}/></>} /></Surface>
                          <Surface elevation={1}>
                          <List.Item style={{marginLeft:25}}
                          left={() => <><Text size={16} style={{marginTop:2}}>学年</Text></>}
                          title=''
                          right={() => <>
                          <Checkbox
                          label="他人可见" 
                          status={birthChecked?'checked':'unchecked'}
                          color='#5F0B65'
                          onPress={() =>{
                            setBirthChecked(!birthChecked)
                          }}/></>} /></Surface>
                          <Surface elevation={1}>
                          <List.Item style={{marginLeft:25}}
                          left={() => <><Text size={16} style={{marginTop:2}}>兴趣爱好</Text></>}
                          title=''
                          right={() => <>
                          <Checkbox
                          label="他人可见" 
                          status={birthChecked?'checked':'unchecked'}
                          color='#5F0B65'
                          onPress={() =>{
                            setBirthChecked(!birthChecked)
                          }}/></>} /></Surface>
                          <Surface elevation={1}>
                          <List.Item style={{marginLeft:25}}
                          left={() => <><Text size={16} style={{marginTop:2}}>关注列表</Text></>}
                          title=''
                          right={() => <>
                          <Checkbox
                          label="他人可见" 
                          status={birthChecked?'checked':'unchecked'}
                          color='#5F0B65'
                          onPress={() =>{
                            setBirthChecked(!birthChecked)
                          }}/></>} /></Surface>
                          <Surface elevation={1}>
                          <List.Item style={{marginLeft:25}}
                          left={() => <><Text size={16} style={{marginTop:2}}>粉丝列表</Text></>}
                          title=''
                          right={() => <>
                          <Checkbox
                          label="他人可见" 
                          status={birthChecked?'checked':'unchecked'}
                          color='#5F0B65'
                          onPress={() =>{
                            setBirthChecked(!birthChecked)
                          }}/></>} /></Surface>
                        </List.Section>
                      </Block>
                      </Surface>
                </Block>
            </Block>
              {/* eslint-disable-next-line max-len */}
            {/* -> Set bottom view to allow scrolling to top if you set bottom-bar position absolute */}
            <View style={{ height: 190 }} />
            </ScrollView>
        </ImageBackground>
      </View>
    </View>
  )
}