import React from 'react';
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  AsyncStorage,
  Alert,
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
    password: '',
  };
  handleChange = key => val => {
    this.setState({[key]: val});
  };

  submitForm = async () => {
    // error handling related to the user sign up/login
    // save data
    if (this.state.username == '' || this.state.password == '') {
      Alert.alert('Invalid Login', 'Please fill all the input fields');
      return;
    }
    var ref = firebase.database().ref(`/users`);
    await ref
      .orderByChild('username')
      .equalTo(this.state.username)
      .once('value')
      .then(snapshot => {
        if (snapshot.val()) {
          fetchedData = snapshot.child(this.state.username).val();
          if (fetchedData.password == this.state.password) {
            AsyncStorage.setItem('username', fetchedData.username);
            AsyncStorage.setItem('name', fetchedData.name);
            User.username = fetchedData.username;
            User.name = fetchedData.name;
            User.password = fetchedData.password;
            this.props.navigation.navigate('App');
            return;
          } else {
            Alert.alert('Invalid Login', 'Incorrect username or password');
            return;
          }
        } else {
          Alert.alert('Invalid Login', 'Incorrect username or password');
          return;
        }
      });

    // this.props.navigation.navigate('App');
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
          placeholder="Password"
          style={styles.input}
          value={this.state.password}
          secureTextEntry={true}
          onChangeText={this.handleChange('password')}
        />
        <TouchableOpacity onPress={this.submitForm}>
          <Text style={styles.btn}>Enter</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
