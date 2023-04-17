import React, { useState, useEffect } from "react";
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
import {
  Button, Card, TextInput, Switch, Surface,
  Portal, Provider, IconButton, List, Chip
} from 'react-native-paper';
import { Block, Text } from "galio-framework";
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/AntDesign';
import { StackNavigationProps } from '../../../App'
import Modal from 'react-native-modal';
import styles from './EditProfile.Style'
import requestApi from "../../../utils/request";
import handleAxiosError from "../../../utils/handleError";
import AvatarPicker from "../../../components/AvatarPicker/AvatarPicker";
import { userProp, defaultInfo } from "../Profile";
import { useFocusEffect } from '@react-navigation/native';

//获取屏幕宽高
const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

//图片
const profileImage = {
  ProfileBackground: require('../../../assets/imgs/profile-screen-bg.png'),
  ProfilePicture: 'https://picsum.photos/700'
}

//资料页面
export function EditProfile({ route, navigation }: StackNavigationProps) {
  //state
  const userID = '2052909';
  //个人信息
  const [userInfo, setUserInfo] = useState<userProp>(defaultInfo);
  const { bottom } = useSafeAreaInsets();
  //初始化
  //初始化
  async function fetchData() {
    const resInfo = await requestApi('get', `/profile/${userID}`, null, true, 'get profile失败');
    if (resInfo.code == 0) {
      setUserInfo(resInfo.data);
    }
  }

  //先用FocusEffect代替Effect了，不知道为什么从其他路由返回时不触发Effect
  // useEffect(()=>{
  //   fetchData()
  // },[])
  useFocusEffect(
    React.useCallback(() => {
      fetchData()
      return () => {
      };
    }, [])
  );

  //性别
  function Gender() {
    if (userInfo.userGender.info == 'Male')
      return (<Icon name="man" size={16} color="#32325D" style={{ marginTop: 10 }}>Male</Icon>)
    else
      return (<Icon name="woman" size={16} color="#32325D" style={{ marginTop: 10 }}>Female</Icon>)
  }

  //选择生日
  const [showDatePicker, setShowDatePicker] = useState(false);

  function ChooseBirthDay() {
    function formatDate(date: Date) {
      var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2)
        month = '0' + month;
      if (day.length < 2)
        day = '0' + day;

      return [year, month, day].join('-');
    }

    const [birthday, setbirthday] = useState(new Date(userInfo.userBirthDate.info));

    async function submitBirthDay() {
      setShowDatePicker(false);
      let newuser = { ...userInfo };
      let formatBirthDate = formatDate(birthday)
      newuser.userBirthDate.info = formatBirthDate;
      const res = await requestApi('put', '/updateUserInfo', newuser, true, '更新生日失败');
      if (res.code === 0) {
        setUserInfo(newuser)
        //发送事件，传递更新的userInfo
        //navigation.goBack()
      }
    }

    return (
      <Modal
        isVisible={showDatePicker}
        onBackdropPress={() => {
          setShowDatePicker(false);
        }}
        style={styles.modalFromBottom}
      >
        {/* 仅IOS显示按钮 */}
        {Platform.OS == 'ios' && <Block row space='between' style={styles.contentContainer}>
          <Button mode='text'
            onPress={() => {
              setShowDatePicker(false);
            }}>取消</Button>
          <Button mode='text'
            onPress={submitBirthDay}>提交</Button>
        </Block>}
        <View style={styles.contentContainer}>
          <DateTimePicker
            value={birthday}
            onChange={(event, date) => setbirthday(date || new Date())}
            mode='date'
            display="spinner"
            themeVariant="light"
          />
        </View>
      </Modal>
    )
  }

  //选头像
  function cancelAvatarOption() {
    setShowAvatarOption(false);
  }

  const [showAvatarOption, setShowAvatarOption] = useState(false);

  const UnbindPhone = () => {
    //解绑手机
    const [unbindVisible, setUnbindVisible] = useState(false);

    const [pwdVisible, setpwdVisible] = useState(false);
    const [submitted, setsubmitted] = useState(false);
    const [password, setPassword] = useState('');
    const [pwdInput, setpwdInput] = useState(false);
    const handlePasswordChange = (value: string) => {
      setPassword(value);
    };
    return (
      <View>
        <Button icon='cellphone-remove'
          mode='outlined'
          style={{ marginTop: 10 }}
          onPress={() => {
            setUnbindVisible(true);
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
                {pwdInput ? '请输入密码以确认解绑' : '您确定要解绑手机吗？'}
              </Text>
              {/* 输入密码 */}
              {pwdInput &&
                <TextInput
                  mode='outlined'
                  style={{ marginTop: 10 }}
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                  label="Password"
                  secureTextEntry={!pwdVisible}
                  right={<TextInput.Icon icon="eye" onPress={() => {
                    setpwdVisible(!pwdVisible)
                  }} />}
                />
              }
            </Card.Content>
            <Card.Actions>
              {!pwdInput && <Button mode='outlined' style={{ marginRight: 10 }} onPress={() => {
                setpwdInput(true);
              }}>确定</Button>}
              {pwdInput && <Button mode='outlined' style={{ marginRight: 10 }} onPress={() => {
                setpwdInput(false);
                setUnbindVisible(false);
                setsubmitted(true);
              }}>提交</Button>}
              <Button mode='outlined' onPress={() => {
                setpwdInput(false);
                setUnbindVisible(false);
              }}>取消</Button>
            </Card.Actions>
          </Card>
        </Modal>
      </View>
    )
  }
  //绑定手机
  const BindPhone = () => {
    const [bindVisible, setbindVisible] = useState(false);
    const [btnText, setBtnText] = useState('获取验证码');
    //控制倒计时中按钮不可点击
    const [btnDisable, setBtnDisable] = useState(false);
    //手机号
    const [bphone, setBphone] = useState('');
    //验证码
    const [vcode, setVcode] = useState('');
    const countDown = () => {
      setBtnDisable(true);
      let seconds = 5;
      //重新获取
      setBtnText(`重新获取(${seconds}s)`);
      let timeCounter = setInterval(() => {
        seconds--;
        setBtnText(`重新获取(${seconds}s)`);
        if (seconds == 0) {
          clearInterval(timeCounter);
          setBtnText('获取验证码');
          setBtnDisable(false);
        }
      }, 1000);
    }
    return (
      <View>
        <Button icon='cellphone-check'
          mode='outlined'
          onPress={() => {
            setbindVisible(true);
          }}
          style={{ marginTop: 10 }}
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
                value={bphone}
                onChangeText={(text) => setBphone(text)}
                keyboardType='number-pad'
              />
              <TextInput
                mode='outlined'
                label='验证码'
                maxLength={6}
                value={vcode}
                onChangeText={(text) => setVcode(text)}
                keyboardType='number-pad'
              />
            </Card.Content>
            <Card.Actions>
              <Button mode='outlined' style={{ marginRight: 10 }} onPress={countDown}
                disabled={btnDisable}
              >
                {btnText}</Button>
              <Button mode='outlined' style={{ marginRight: 10 }} onPress={() => {
                setbindVisible(false);
              }}>取消</Button>
            </Card.Actions>
          </Card>
        </Modal>
      </View>
    )
  };

  //路由跳转的函数们
  function toEditInterest() {
    navigation.navigate('EditInterest');
  }

  function toEditNickName() {
    navigation.navigate('EditNickName');
  }

  function toEditStatus() {
    navigation.navigate('EditStatus');
  }

  function toEditLabel() {
    navigation.navigate('EditLabel');
  }

  //隐私变更
  function updateBitrthPms() {
    let newuser = { ...userInfo };
    newuser.userBirthDate.pms = !newuser.userBirthDate.pms;
    setUserInfo(newuser)
  }

  function updateMajorPms() {
    let newuser = { ...userInfo };
    newuser.userMajor.pms = !newuser.userMajor.pms;
    setUserInfo(newuser)
  }

  function updateYearPms() {
    let newuser = { ...userInfo };
    newuser.userYear.pms = !newuser.userYear.pms;
    setUserInfo(newuser)
  }

  function updateInterestPms() {
    let newuser = { ...userInfo };
    newuser.userInterest.pms = !newuser.userInterest.pms;
    setUserInfo(newuser)
  }

  function updateFollowingPms() {
    let newuser = { ...userInfo };
    newuser.followingPms = !newuser.followingPms;
    setUserInfo(newuser)
  }

  function updateFollowerPms() {
    let newuser = { ...userInfo };
    newuser.followerPms = !newuser.followerPms;
    setUserInfo(newuser)
  }

  async function updatePmsSetting() {
    const res = await requestApi('put', '/updateUserInfo', userInfo, true, 'update user info failed');
    if (res.code === 0) {
      console.log('ohyes')
    }
  }

  return (
    <View style={{ flex: 1, marginBottom: bottom }}>
      <View style={{ flex: 1 }}>
        {/* 资料卡片 */}
        <ImageBackground
          source={profileImage.ProfileBackground}
          style={styles.profileContainer}
          imageStyle={styles.profileBackground}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ width }}
          >
            <Block flex style={styles.profileCard}>
              {/* 头像 */}
              <Pressable onPress={() => {
                setShowAvatarOption(true);
              }}>
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
                    {userInfo.userName.info}
                  </Text>
                  <Text size={16} color="#32325D" style={{ marginTop: 10 }}>
                    {userInfo.userId.info}
                  </Text>
                  <Gender />
                  <Text size={16} color="#32325D" style={{ marginTop: 10 }}>
                    {userInfo.userYear.info + '/' + userInfo.userMajor.info}
                  </Text>
                </Block>
                {/* 修改信息 */}
                <Surface elevation={1} mode='flat' style={{ marginTop: 10 }}>
                  <Block flex>
                    <Card.Title
                      title='个性信息'
                      subtitle='Personal Information'
                      titleVariant='titleMedium'
                      left={(props) => <IconButton {...props} size={25} icon="emoticon-outline" />}
                    />
                    <List.Section style={{ marginBottom: 0 }}>
                      <Pressable onPress={toEditNickName}>
                        <Surface elevation={1}>
                          <List.Item style={{ marginLeft: 25 }}
                            left={() => <><Text size={16} style={{ marginTop: 2 }}>昵 称</Text></>}
                            title={userInfo.userNickName.info}
                            right={() => <List.Icon icon="chevron-right" />} />
                        </Surface></Pressable>
                      <Pressable onPress={() => {
                        setShowDatePicker(true);
                      }}>
                        <Surface elevation={1}>
                          <List.Item style={{ marginLeft: 25 }}
                            left={() => <><Text size={16} style={{ marginTop: 2 }}>生 日</Text></>}
                            title={userInfo.userBirthDate.info}
                            right={() => <List.Icon icon="chevron-right" />} />
                        </Surface></Pressable>
                      <ChooseBirthDay />
                      <Pressable onPress={toEditStatus}>
                        <Surface elevation={1}>
                          <List.Item style={{ marginLeft: 25 }}
                            left={() => <><Text size={16} style={{ marginTop: 2 }}>个性签名</Text></>}
                            title={userInfo.userStatus.info}
                            right={() => <List.Icon icon="chevron-right" />} />
                        </Surface></Pressable>
                      <Pressable onPress={toEditInterest}>
                        <Surface elevation={1}>
                          <List.Item style={{ marginLeft: 25 }}
                            left={() => <><Text size={16} style={{ marginTop: 2 }}>兴趣爱好</Text></>}
                            title={userInfo.userInterest.info}
                            right={() => <List.Icon icon="chevron-right" />} />
                        </Surface></Pressable>
                      <Pressable onPress={toEditLabel}>
                        <Surface elevation={1}>
                          <List.Item style={{ marginLeft: 25 }}
                            left={() => <><Text size={16} style={{ marginTop: 2 }}>标 签</Text></>}
                            title={props =>
                              <View style={{ flex: 1, flexDirection: "row", flexWrap: 'wrap' }}>
                                {userInfo.userLabel.info.map((label, idx) =>
                                  <Chip key={idx} style={{ marginRight: 10, marginBottom: 10 }}
                                    mode='outlined'>{label}</Chip>
                                )}
                              </View>}
                            right={() => <List.Icon icon="chevron-right" />} />
                        </Surface></Pressable>
                    </List.Section>
                  </Block>
                </Surface>
                {/* 手机号码 */}
                <Surface elevation={1} mode='flat' style={{ marginTop: 10 }}>
                  <Block flex>
                    <Card.Title
                      title='手机号码'
                      subtitle='Phone Number'
                      titleVariant='titleMedium'
                      left={(props) => <IconButton {...props} size={25} icon="cellphone" />}
                    />
                    <List.Section style={{ marginBottom: 0, marginTop: 0 }}>
                      <Surface elevation={1}>
                        <List.Item style={{ marginLeft: 25 }}
                          left={() => <><Text size={16} style={{ marginTop: 16.5 }}>+86</Text></>}
                          title={userInfo.userPhone.info ? userInfo.userPhone.info : '暂未绑定'}
                          right={() => userInfo.userPhone.info ? <UnbindPhone /> : <BindPhone />}
                        />
                      </Surface>
                    </List.Section>
                  </Block>
                </Surface>
                {/* 隐私 */}
                <Surface elevation={1} mode='flat' style={{ marginTop: 10 }}>
                  <Block flex>
                    <Card.Title
                      title='权限设置'
                      subtitle='Permission Setting'
                      titleVariant='titleMedium'
                      left={(props) => <IconButton {...props} size={25} icon="lock" />}
                      right={(props) =>
                        <Button mode='outlined' icon='check'
                          style={{ marginRight: 25 }} onPress={updatePmsSetting}
                        >保存</Button>}
                    />
                    <List.Section style={{ marginBottom: 0 }}>
                      <Pressable onPress={updateBitrthPms}>
                        <Surface elevation={1}>
                          <List.Item style={{ marginLeft: 25 }}
                            left={() => <><Text size={16} style={{ marginTop: 2 }}>生日</Text></>}
                            title=''
                            right={() => <><Text style={styles.otherVisable}>他人可见</Text>
                              <Switch
                                value={userInfo.userBirthDate.pms}
                                onValueChange={updateBitrthPms} />
                            </>} /></Surface></Pressable>
                      <Pressable onPress={updateMajorPms}>
                        <Surface elevation={1}>
                          <List.Item style={{ marginLeft: 25 }}
                            left={() => <><Text size={16} style={{ marginTop: 2 }}>专业</Text></>}
                            title=''
                            right={() => <><Text style={styles.otherVisable}>他人可见</Text>
                              <Switch value={userInfo.userMajor.pms} onValueChange={updateMajorPms} /></>} />
                        </Surface></Pressable>
                      <Pressable onPress={updateYearPms}>
                        <Surface elevation={1}>
                          <List.Item style={{ marginLeft: 25 }}
                            left={() => <><Text size={16} style={{ marginTop: 2 }}>学年</Text></>}
                            title=''
                            right={() => <><Text style={styles.otherVisable}>他人可见</Text>
                              <Switch value={userInfo.userYear.pms} onValueChange={updateYearPms} /></>} />
                        </Surface></Pressable>
                      <Pressable onPress={updateInterestPms}>
                        <Surface elevation={1}>
                          <List.Item style={{ marginLeft: 25 }}
                            left={() => <><Text size={16} style={{ marginTop: 2 }}>兴趣爱好</Text></>}
                            title=''
                            right={() => <><Text style={styles.otherVisable}>他人可见</Text>
                              <Switch value={userInfo.userInterest.pms}
                                onValueChange={updateInterestPms} /></>} />
                        </Surface></Pressable>
                      <Pressable onPress={updateFollowingPms}>
                        <Surface elevation={1}>
                          <List.Item style={{ marginLeft: 25 }}
                            left={() => <><Text size={16} style={{ marginTop: 2 }}>关注列表</Text></>}
                            title=''
                            right={() => <><Text style={styles.otherVisable}>他人可见</Text>
                              <Switch value={userInfo.followingPms} onValueChange={updateFollowingPms} /></>} />
                        </Surface></Pressable>
                      <Pressable onPress={updateFollowerPms}>
                        <Surface elevation={1}>
                          <List.Item style={{ marginLeft: 25 }}
                            left={() => <><Text size={16} style={{ marginTop: 2 }}>粉丝列表</Text></>}
                            title=''
                            right={() => <><Text style={styles.otherVisable}>他人可见</Text>
                              <Switch value={userInfo.followerPms} onValueChange={updateFollowerPms} /></>} />
                        </Surface>
                      </Pressable>
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