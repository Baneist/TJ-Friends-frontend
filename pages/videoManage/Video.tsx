import React, {Component, useRef, useState} from "react";
import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
  TwilioVideo,
} from "react-native-twilio-video-webrtc";
import {AppRegistry, Button, Text, TextInput, TouchableOpacity, View} from "react-native";
import {styles} from "./Video.style";

// 定义一个接口，用于描述视频轨道的信息
interface VideoTrackInfo {
  participantSid: string;
  videoTrackSid: string;
}

export const VideoCall = (props: any) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState<boolean>(true);
  const [status, setStatus] = useState<string>("disconnected");
  const [participants, setParticipants] = useState<Map<string, any>>(new Map());
  const [videoTracks, setVideoTracks] = useState<Map<string, VideoTrackInfo>>(new Map());
  const [token, setToken] = useState<string>("");
  const twilioRef = useRef<TwilioVideo>(null);

  const _onConnectButtonPress = () => {
    twilioRef.current?.connect({accessToken: token});
    setStatus("connecting");
  };

  const _onEndButtonPress = () => {
    twilioRef.current?.disconnect();
  };

  const _onMuteButtonPress = () => {
    twilioRef.current
      ?.setLocalAudioEnabled(!isAudioEnabled)
      .then((isEnabled) => setIsAudioEnabled(isEnabled));
  };

  const _onFlipButtonPress = () => {
    twilioRef.current?.flipCamera();
  };

  const _onRoomDidConnect = ({roomName, error}: { roomName: string; error: any }) => {
    console.log("onRoomDidConnect: ", roomName);

    setStatus("connected");
  };

  const _onRoomDidDisconnect = ({roomName, error}: { roomName: string; error: any }) => {
    console.log("[Disconnect]ERROR: ", error);

    setStatus("disconnected");
  };

  const _onRoomDidFailToConnect = (error: any) => {
    console.log("[FailToConnect]ERROR: ", error);

    setStatus("disconnected");
  };

  const _onParticipantAddedVideoTrack = ({
                                           participant,
                                           track,
                                         }: {
    participant: any;
    track: any;
  }) => {
    console.log("onParticipantAddedVideoTrack: ", participant, track);

    setVideoTracks(
      new Map([
        ...videoTracks,
        [
          track.trackSid,
          {participantSid: participant.sid, videoTrackSid: track.trackSid},
        ],
      ])
    );
  };

  const _onParticipantRemovedVideoTrack = ({participant, track}: { participant: any; track: any; }) => {
    // console.log("onParticipantRemovedVideoTrack: ", participant, track);

    const videoTracksLocal = videoTracks;
    videoTracksLocal.delete(track.trackSid);

    setVideoTracks(videoTracksLocal);
  };

  return (
    <View style={styles.container}>
      {status === "disconnected" && (
        <View>
        <Text>
          React Native Twilio Video
        </Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            value={token}
            onChangeText={(text) => setToken(text)}
          ></TextInput>
          <Button
            title="Connect"
            onPress={_onConnectButtonPress}
          ></Button>
        </View>
      )}

      {(status === "connected" || status === "connecting") && (
        <View style={styles.callContainer}>
          {status === "connected" && (
            <View style={styles.remoteGrid}>
              {Array.from(videoTracks, ([trackSid, trackIdentifier]) => {
                return (
                  <TwilioVideoParticipantView
                    style={styles.remoteVideo}
                    key={trackSid}
                    trackIdentifier={trackIdentifier}
                  />
                );
              })}
            </View>
          )}
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={_onEndButtonPress}
            >
              <Text>
              End
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={_onMuteButtonPress}
            >
              <Text>
              {isAudioEnabled ? "Mute" : "Unmute"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={_onFlipButtonPress}
            >
              <Text>Flip</Text>
            </TouchableOpacity>
            <TwilioVideoLocalView enabled={true} style={styles.localVideo}/>
          </View>
        </View>
      )}

      <TwilioVideo
        ref={twilioRef}
        onRoomDidConnect={_onRoomDidConnect}
        onRoomDidDisconnect={_onRoomDidDisconnect}
        onRoomDidFailToConnect={_onRoomDidFailToConnect}
        onParticipantAddedVideoTrack={_onParticipantAddedVideoTrack}
        onParticipantRemovedVideoTrack={_onParticipantRemovedVideoTrack}
      />
    </View>
  );
};