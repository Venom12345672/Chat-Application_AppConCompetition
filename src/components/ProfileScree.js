import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  AsyncStorage
} from 'react-native';
import User from '../User';
import styles from './constants/styles';
import firebase from 'firebase';
import PubNubReact from 'pubnub-react';

export default class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.pubnub = new PubNubReact({
      publishKey: 'pub-c-1a256bc0-f516-4140-83e1-2cd02f72e19b',
      subscribeKey: 'sub-c-1a959da8-ebfb-11e9-ad72-8e6732c0d56b',
    });
    this.pubnub.init(this);
  }

  static navigationOptions = {
    title: 'Profile',
  };

  state = {
    name: User.name,
  };

  handleChange = key => val => {
    this.setState({[key]: val});
  };

  changeName = async () => {
    if (this.state.name.length < 3) {
      Alert.alert('Error', 'Please enter a valid name');
    } else if (User.name != this.state.name) {
      firebase
        .database()
        .ref('users')
        .child(User.username)
        .update({name: this.state.name});
      Alert.alert('Success!', 'Name changed successfully');
    }
  };

  logoutHandler = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
    this.pubnub.push.removeChannels(
      {
        channels: [User.username],
        device: User.token,
        pushGateway: 'gcm', // apns, gcm, mpns
      },
      function(status) {
        if (status.error) {
          console.log('operation failed w/ error:', status);
        } else {
          console.log('operation done!');
        }
      },
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{fontSize: 20}}>{User.username}</Text>
        <Text style={{fontSize: 20}}>{User.name}</Text>
        <TextInput
          style={styles.input}
          value={this.state.name}
          onChangeText={this.handleChange('name')}></TextInput>
        <TouchableOpacity onPress={this.changeName}>
          <Text style={styles.btn}>Change Name</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.logoutHandler}>
          <Text style={styles.btn}>Logout</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}
