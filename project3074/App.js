import React, { useEffect } from 'react';
import EditRestaurant from './screens/edit.js';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import SplashScreen from 'react-native-splash-screen'
import {HomeScreenNavigator, AddScreenNavigator, AboutScreenNavigator} from './custom-navigation.js'
import { ImageBackground } from 'react-native';

const Tab = createBottomTabNavigator();
const restaurants = []

const MyTheme = {
  dark: false,
  colors: {
    primary: 'rgb(255, 45, 85)',
    background: 'rgb(229, 75, 75)',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(28, 28, 30)',
    border: 'rgb(199, 199, 204)',
    notification: 'rgb(255, 69, 58)',
  },
};

function MyTabs() {
  return (
    <Tab.Navigator
    initialRouteName="Home"
    tabBarOptions={{
      activeTintColor: '#fff',
      inactiveTintColor: '#f0f0f0',
      activeBackgroundColor: '#CC3232',
      inactiveBackgroundColor: '#E54B4B',
      showLabel: false,
          style: {
                backgroundColor: '#E54B4B',
          },
   }}>
      <Tab.Screen
        name="Add"
        component={AddScreenNavigator}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name={"plus-circle"} size={25} color="#F9F9F9" />
          ),
        }}
      />
      
    <Tab.Screen
        name="Home"
        component={HomeScreenNavigator}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name={"list-ul"} size={30} color="#F9F9F9" />
          ),
        }}
      />
     
     <Tab.Screen
        name="About"
        component={AboutScreenNavigator}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name={"info-circle"} size={25} color="#F9F9F9" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}


export default function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, [])
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}

