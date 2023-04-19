import React, { useState } from "react";
import { StyleSheet, View, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ImageEditor } from "expo-image-editor";
import Modal from 'react-native-modal';
import { Button, Divider } from 'react-native-paper';

const styles = StyleSheet.create({
  modalFromBottom: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  avatarBtn: {
    height: 50,
    marginTop: 10
  },
  contentContainer: {
    backgroundColor: 'white',
    paddingTop: 15
  },
});


<<<<<<< Updated upstream
interface AvatarPickerProps{
    showAvatarOption:boolean,
    onBackdropPress:()=>void,
=======
interface AvatarPickerProps {
  showAvatarOption: boolean,
  onBackdropPress: () => void,
  onSubmit: (uri: string) => void,
>>>>>>> Stashed changes
}


export default function AvatarPicker(props: AvatarPickerProps) {
  const [imageUri, setImageUri] = useState('');

  const [editorVisible, setEditorVisible] = useState(false);

  //从相册选
  const fromAlbum = async () => {
    // Get the permission to access the camera roll
    const response = await ImagePicker.requestCameraPermissionsAsync();
    // If they said yes then launch the image picker
    if (response.granted) {
      const pickerResult = await ImagePicker.launchImageLibraryAsync();
      // Check they didn't cancel the picking
      if (!pickerResult.canceled) {
        console.log(pickerResult.assets[0].uri)
        launchEditor(pickerResult.assets[0].uri);
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
        console.log(pickerResult.assets[0].uri)
        launchEditor(pickerResult.assets[0].uri);
      }
    } else {
      // If not then alert the user they need to enable it
      Alert.alert(
        "Please enable camera roll permissions for this app in your settings."
      );
    }
  };
  const launchEditor = (uri: string) => {
    // Then set the image uri
    setImageUri(uri);
    // And set the image editor to be visible
    setEditorVisible(true);
  };
  return (
    <Modal
      isVisible={props.showAvatarOption}
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
<<<<<<< Updated upstream
        </View>
          <ImageEditor
          visible={editorVisible}
          onCloseEditor={() => setEditorVisible(false)}
          imageUri={imageUri}
          fixedCropAspectRatio={1 / 1}
          lockAspectRatio={true}
          minimumCropDimensions={{
            width: 100,
            height: 100,
          }}
          onEditingComplete={(result) => {
              console.log(result);
              props.onBackdropPress();
          }}
          mode="full"
        />
      </Modal>
    );
  }
=======
      </View>
      <ImageEditor
        visible={editorVisible}
        onCloseEditor={() => setEditorVisible(false)}
        imageUri={imageUri}
        fixedCropAspectRatio={1 / 1}
        lockAspectRatio={true}
        minimumCropDimensions={{
          width: 400,
          height: 400,
        }}
        onEditingComplete={(result) => {
          console.log(result);
          props.onSubmit(result.uri);
          props.onBackdropPress();
        }}
        mode="full"
      />
    </Modal>
  );
}
>>>>>>> Stashed changes
