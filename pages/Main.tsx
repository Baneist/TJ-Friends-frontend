import React from 'react';
import { View, LogBox, StatusBar } from 'react-native';
import AppWithNavigationState from '../navigators';
import GlobalLoading, { globalLoadingRef } from '../components/GlobalLoading';
import GlobalMessage, { globalMessageRef } from '../components/GlobalMessage';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../reduxCore/store';

// LogBox.ignoreAllLogs(true);
// StatusBar.setBarStyle('dark-content');
const MainScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <AppWithNavigationState />
          <GlobalLoading ref={globalLoadingRef} />
          <GlobalMessage ref={globalMessageRef} />
        </PersistGate>
      </Provider>
    </View>
  );
};
export default MainScreen;
