import React from 'react';
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';
import User from '../User';
import styles from './constants/styles';
import firebase from 'firebase';
export default class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    username: '',
    name: '',
  };
  handleChange = key => val => {
    this.setState({[key]: val});
  };

  submitForm = async () => {
    // error handling related to the user sign up/login
    alert(this.state.name + '\n' + this.state.username);
    // save data
    await AsyncStorage.setItem('username', this.state.username);
    User.username = this.state.username;
    firebase
      .database()
      .ref('users/' + User.username)
      .set({name: this.state.name, username: this.state.username});
    this.props.navigation.navigate('App');
  };
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          placeholder="Enter Username"
          style={styles.input}
          value={this.state.username}
          onChangeText={this.handleChange('username')}
        />
        <TextInput
          placeholder="Name"
          style={styles.input}
          value={this.state.name}
          onChangeText={this.handleChange('name')}
        />
        <TouchableOpacity onPress={this.submitForm}>
          <Text style={styles.btn}>Enter</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
