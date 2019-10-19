import React from 'react';
import {ActivityIndicator, AsyncStorage, StatusBar, View} from 'react-native';
import User from '../User';
import firebase from 'firebase';
export default class AuthLoadingScreen extends React.Component {
  componentDidMount() {
    this._bootstrapAsync();
  }
  componentWillMount() {
    // Your web app's Firebase configuration
    var firebaseConfig = {
      apiKey: 'AIzaSyAf-NUJhLp_-pHVv6rS7yFpiS7GQRpy6pU',
      authDomain: 'chatapplicationappcon.firebaseapp.com',
      databaseURL: 'https://chatapplicationappcon.firebaseio.com',
      projectId: 'chatapplicationappcon',
      storageBucket: 'chatapplicationappcon.appspot.com',
      messagingSenderId: '168500823310',
      appId: '1:168500823310:web:85abb4b18a86430c1f835f',
      measurementId: 'G-4CHCLQ4XGE',
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  }
  _bootstrapAsync = async () => {
    User.username = await AsyncStorage.getItem('username');
    User.name = await AsyncStorage.getItem('name');
    var ref = firebase.database().ref(`/users`);
    await ref
      .orderByChild('username')
      .equalTo(User.username)
      .once('value')
      .then(snapshot => {
        if (snapshot.val()) {
          User.photo = snapshot.val()[User.username].profileLink;
          console.log(User.photo)
        }
      });
    this.props.navigation.navigate(User.username ? 'App' : 'Auth');
  };

  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="AppCon" />
      </View>
    );
  }
}
