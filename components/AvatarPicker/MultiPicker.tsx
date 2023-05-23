import React , {useState}from "react";
import { StyleSheet, View, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Modal from 'react-native-modal';
import {Button, Divider } from 'react-native-paper';
import {styles} from './AvatarPicker'

interface AvatarPickerProps{
    showPickerOption:boolean,
    onBackdropPress:()=>void,
    setImage:(uri:string[])=>void
}

export default function MultiPicker(props:AvatarPickerProps) {
  const [imageUri, setImageUri] = useState('');

  const [editorVisible, setEditorVisible] = useState(false);

  //从相册选
  const fromAlbum = async () => {
    // Get the permission to access the camera roll
    const response = await ImagePicker.requestCameraPermissionsAsync();
    // If they said yes then launch the image picker
    if (response.granted) {
      const pickerResult = await ImagePicker.launchImageLibraryAsync({allowsMultipleSelection:true});
      // Check they didn't cancel the picking
      if (!pickerResult.canceled) {
        {pickerResult.assets.map((item)=>props.setImage([item.uri]))}
        props.onBackdropPress()
      }
    } else {
      // If not then alert the user they need to enable it
      Alert.alert(
        "Please enable camera roll permissions for this app in your settings."
      );
    }
  };
  //从相机选
  const fromCamara = async () => {
    // Get the permission to access the camera roll
    const response = await ImagePicker.requestCameraPermissionsAsync();
    // If they said yes then launch the image picker
    if (response.granted) {
      const pickerResult = await ImagePicker.launchCameraAsync();
      // Check they didn't cancel the picking
      if (!pickerResult.canceled) {
        props.setImage([pickerResult.assets[0].uri])
        props.onBackdropPress()
      }
    } else {
      // If not then alert the user they need to enable it
      Alert.alert(
        "Please enable camera roll permissions for this app in your settings."
      );
    }
  };

  return(
      <Modal
      isVisible={props.showPickerOption}
      onBackdropPress={props.onBackdropPress}
      style={styles.modalFromBottom}
      >
        <View style={styles.contentContainer}>
          <Button icon="camera" 
          style={styles.avatarBtn} 
          onPress={() => fromCamara()}
          >从相机选择</Button>
          <Divider />
          <Button icon='image'
          style={styles.avatarBtn} 
          onPress={() => fromAlbum()}>从相册选择</Button>
          <Divider />
          <Button style={styles.avatarBtn}
          onPress={props.onBackdropPress}>取消</Button>
        </View>
      </Modal>
    );
  }