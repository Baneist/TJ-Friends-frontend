import {Dimensions, StyleSheet} from "react-native";
const {width, height} = Dimensions.get("screen");
const thumbMeasure = (width - 48 - 32) / 3;
export const styles = StyleSheet.create({
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
    shadowOffset: {width: 0, height: 0},
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
    width: 42,
    height: 42,
    borderRadius: 21,
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
  infoNum: {
    marginBottom: 4,
    color: '#525F7F',
    fontSize: 20,
    fontWeight: 'bold'
  },
  infoName: {
    fontSize: 12
  },
  
  modalFromBottom: {
    justifyContent: 'flex-end',
    margin: 0,
    },
    optionBtn:{
    height:50,
    marginTop:10
    },
    contentContainer:{
    backgroundColor: 'white',
    paddingTop:15
    },
});
