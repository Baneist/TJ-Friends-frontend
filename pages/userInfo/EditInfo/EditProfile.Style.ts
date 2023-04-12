import {
    StyleSheet,
    Dimensions
  } from "react-native"

//获取屏幕宽高
const { width, height } = Dimensions.get("screen");
export default StyleSheet.create({
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
      marginTop: 130,
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
    contentContainer:{
      backgroundColor: 'white',
      paddingTop:15
    },
    modalFromBottom: {
      justifyContent: 'flex-end',
      margin: 0,
    },
    infoName:{
       marginBottom: 4,
       color:'#525F7F',
       fontSize:20
    },
    otherVisable:{
      marginTop:6,
      marginRight:6
    }
  });