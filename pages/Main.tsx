import React, { useEffect } from 'react';
import {View, Switch, Pressable} from 'react-native';
import { Provider as PaperProvider, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {Text, Block} from "galio-framework";
import { BottomFabBar } from 'rn-wave-bottom-bar';
import  MemoriesScreen  from './Memories';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Profile from './userInfo/Profile'


const generateScreen = (screen: string) => () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      }}
    >
      <Text>{screen}!</Text>
    </View>
  );
};

const Tab = createBottomTabNavigator();
const tabBarIcon =
  (name: string) =>
    ({
      focused,
      color,
      size,
    }: {
      focused: boolean;
      color: string; // Defines fab icon color
      size: number;
    }) =>
      <Icon name={name} size={28} color={focused ? 'white' : 'white'} />;

      export interface IMainProps {
        onCommentPress:()=>void;
        onPressFAB:()=>void;
      }
const MainScreen = () => {
  const [showLabel, setShowLabel] = React.useState(false);
  const [enableSquare, setEnableSquare] = React.useState(false);
  const [isRtl, setIsRtl] = React.useState(false);

  const Home = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Enable TabBar labels</Text>
      <Switch
        value={showLabel}
        onValueChange={() => setShowLabel(!showLabel)}
      />
      <Text>Enable TabBar Square</Text>
      <Switch
        value={enableSquare}
        onValueChange={() => setEnableSquare(!enableSquare)}
      />
      <Text>Enable RTL</Text>
      <Switch value={isRtl} onValueChange={() => setIsRtl(!isRtl)} />
    </View>
  );


  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#5F0B65',
        tabBarInactiveTintColor: 'white',
        tabBarActiveBackgroundColor: '#5F0B65',
        tabBarInactiveBackgroundColor: 'red',
        tabBarLabelStyle: {
          color: 'purple',
        },
      }}
      tabBar={(props) => (
        <BottomFabBar
          mode={enableSquare ? 'square' : 'default'}
          isRtl={isRtl}
          // Add Shadow for active tab bar button
          focusedButtonStyle={{
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: -1,
            },
            shadowOpacity: 0.61,
            shadowRadius: 8,
            elevation: 14,
          }}
          /* eslint-disable-next-line max-len */
          // - You can add the style below to show content screen under the tab-bar
          // - It will makes the "transparent tab bar" effect.
          bottomBarContainerStyle={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          }}
          springConfig={{
            stiffness: 1500,
            damping: 85,
            mass: 4,
          }}
          {...props}
        />
      )}
    >
      <Tab.Screen
        options={{
          tabBarIcon: tabBarIcon('aliwangwang-o1'),
          tabBarLabel: showLabel ? 'Home' : undefined,
        }}
        name="Home"
        component={Home}
      />
      <Tab.Screen
        name="Meh"
        options={{
          tabBarIcon: tabBarIcon('meh'),
          tabBarLabel: showLabel ? 'Meh' : undefined,
        }}
        component={generateScreen('Meh')}
      />
      <Tab.Screen
        options={{
          tabBarIcon: tabBarIcon('instagram'),
          tabBarActiveBackgroundColor: '#45014A',
          tabBarActiveTintColor: 'purple',
          tabBarLabel: showLabel ? 'Memories' : undefined,
        }}
        name="Memories"
        component={MemoriesScreen}
      />
      <Tab.Screen
        options={{
          // tabBarStyle: {
          //   display: 'none',
          // },
          tabBarIcon: tabBarIcon('Trophy'),
          tabBarLabel: showLabel ? 'Trophy' : undefined,
        }}
        name="Trophy"
        component={generateScreen('Trophy')}
      />
      <Tab.Screen
        options={{
          tabBarIcon: tabBarIcon('user'),
          tabBarLabel: showLabel ? 'Profile' : undefined,
        }}
        name="Profile"
        component={Profile}
      />
    </Tab.Navigator>
  );
};
export default MainScreen;
