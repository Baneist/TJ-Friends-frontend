import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import EmojiPicker from 'react-native-emoji-selector';


function CustomInputToolbar(props) {
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  function handleSend() {
    if (text.length > 0) {
      const message = {
        text: text.trim(),
        createdAt: new Date(),
        user: {
          _id: props.user._id,
          name: props.user.name,
        },
      };
      props.onSend([message]);
      setText('');
    }
  }

  function handlePickImage() {
    // Handle picking image from device library or camera
    // and then send it as a message
  }

  function handlePickEmoji(emoji) {
    setText(text + emoji);
  }

  return (
    <View style={styles.container}>
      {showEmojiPicker && (
        <EmojiPicker onEmojiSelected={handlePickEmoji} />
      )}
      <TouchableOpacity onPress={() => setShowEmojiPicker(true)} style={styles.button}>
        <MaterialIcons name="mood" size={24} color="#5A5A5A" />
      </TouchableOpacity>
      <TextInput
        style={styles.textInput}
        placeholder="Type a message..."
        value={text}
        onChangeText={setText}
      />
      <TouchableOpacity onPress={handlePickImage} style={styles.button}>
        <MaterialIcons name="photo-camera" size={24} color="#5A5A5A" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
        <MaterialIcons name="send" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    elevation: 2,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  button: {
    padding: 5,
  },
  sendButton: {
    padding: 5,
    backgroundColor: '#C4C4C4',
    borderRadius: 50,
    marginRight: 5,
  },
});

export default CustomInputToolbar;
