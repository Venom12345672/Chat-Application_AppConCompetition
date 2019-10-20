import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import HomeScreen from './components/HomeScreen';
import LoginScreen from './components/LoginScreen';
import AuthLoadingScreen from './components/AuthLoadingScreen';
import ChatScreen from './components/ChatScreen';
import UserProfile from './components/UserProfile';
import {YellowBox} from 'react-native';
import _ from 'lodash';
import ProfileScreen from './components/ProfileScree';
import React from 'react';
import {TouchableOpacity, Image, Text} from 'react-native';
import LandingScreen from './components/LandingScreen';
import SignUpScreen from './components/SignUpScreen';
import SearchScreen from './components/SearchScreen';
import Friends from './components/Friends';
YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

const AppStack = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      header: null,
    },
  },
  SearchScreen: {
    screen: SearchScreen,
    navigationOptions: {
      header: null,
    },
  },
  UserProfile: {
    screen: UserProfile,
    navigationOptions: {
      header: null,
    },
  },
  ChatScreen: {
    screen: ChatScreen,
    navigationOptions: {
      header: null,
    },
  },
  ProfileScreen: {
    screen: ProfileScreen,
    navigationOptions: {
      header: null,
    },
  },
  FriendsScreen: {
    screen: Friends,
    navigationOptions: {
      header: null,
    },
  },
});
const AuthStack = createStackNavigator({
  LandingScreen: LoginScreen,
  SignUp: {
    screen: SignUpScreen,
    navigationOptions: {
      header: null,
    },
  },
});

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'AuthLoading',
    },
  ),
);
