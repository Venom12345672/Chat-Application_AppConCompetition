import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import HomeScreen from './components/HomeScreen';
import LoginScreen from './components/LoginScreen';
import AuthLoadingScreen from './components/AuthLoadingScreen';
import ChatScreen from './components/ChatScreen';
import UserProfile from './components/UserProfile'
import {YellowBox} from 'react-native';
import _ from 'lodash';
import SearchScreen from './components/SearchScreen';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};
const MainStack = createBottomTabNavigator({
  Home: HomeScreen,
  Search: SearchScreen,
});
const AppStack = createStackNavigator({
  Home: MainStack,
  UserProfile: UserProfile,
  ChatScreen: ChatScreen,
});
const AuthStack = createStackNavigator({Login: LoginScreen});

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
