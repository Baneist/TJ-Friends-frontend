import React, { useRef, useState } from "react";
import { Button, View, Text } from "react-native";
import Modal from "react-native-modal";
import { WebView } from "react-native-webview";

const GetUrl = "https://1.tongji.edu.cn/api/ssoservice/system/loginIn";
const TargetUrl = "https://1.tongji.edu.cn/ssologin";
const PostUrl = "https://1.tongji.edu.cn/api/sessionservice/session/login"

const ValidateWebView = (
  saveCookie: (cookie: { sessionid: string; id: string }) => void
) => {
  const webViewRef = useRef<WebView>(null);
  const [isModalVisible, setIsModalVisible] = useState(true);

  const renderWebView = () => {
    return (
      <WebView
        ref={webViewRef}
        source={{ uri: GetUrl }}
        onNavigationStateChange={handleWebViewNavigationStateChange}
      />
    );
  };

  const handleWebViewNavigationStateChange = async (newNavState: { url: string }) => {
    const { url } = newNavState;
    if (url && url.startsWith(TargetUrl)) {
      const params: { [index: string]: string } = {};
      const pairs = url.split("?")[1].split("&");
      for (const pair of pairs) {
        const [key, value] = pair.split("=");
        params[key] = value;
      }
      try {
        const response = await fetch(PostUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        });
        const data = await response.json();
        setIsModalVisible(false);
        saveCookie({sessionid: data.sessionid, id: data.uid})
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <Modal isVisible={isModalVisible}>{renderWebView()}</Modal>
  );
};

export default ValidateWebView;