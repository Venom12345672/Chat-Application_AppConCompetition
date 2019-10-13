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
import SearchScreen from './components/SearchScreen';
import ProfileScreen from './components/ProfileScree';
import React from 'react';
import {TouchableOpacity, Image, Text} from 'react-native';
import LandingScreen from './components/LandingScreen';
import SignUpScreen from './components/SignUpScreen';
YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

const Home = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: ({navigation}) => ({
      title: 'Home',
      headerRight: (
        <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
          <Image
            source={require('./assets/user.png')}
            style={{width: 32, height: 32, marginRight: 7}}
          />
        </TouchableOpacity>
      ),
    }),
  },
});
const Search = createStackNavigator({
  Search: {
    screen: SearchScreen,
    navigationOptions: {
      title: 'Search',
    },
  },
});
const MainStack = createBottomTabNavigator({
  Home: Home,
  Search: Search,
});
const AppStack = createStackNavigator({
  Home: {
    screen: MainStack,
    navigationOptions: {
      header: null,
    },
  },
  UserProfile: UserProfile,
  ChatScreen: ChatScreen,
  ProfileScreen: ProfileScreen,
});
const AuthStack = createStackNavigator({
  LandingScreen: LandingScreen,
  Login: LoginScreen,
  SignUp: SignUpScreen,
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
