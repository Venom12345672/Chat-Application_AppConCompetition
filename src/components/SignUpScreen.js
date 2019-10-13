import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
  TextInput,
  Alert,
  AsyncStorage,
} from 'react-native';
import styles from './constants/styles';
import firebase from 'firebase';
import User from '../User';
export default class SignUpScreen extends React.Component {
  state = {
    username: '',
    name: '',
    password: '',
    confirmPassword: '',
  };
  userEntry = () => {
    AsyncStorage.setItem('username', this.state.username);
    AsyncStorage.setItem('name', this.state.name);
    User.username = this.state.username;
    User.name = this.state.name;
    User.password = this.state.password;
    firebase
      .database()
      .ref('users/' + User.username)
      .set({
        name: this.state.name,
        username: this.state.username,
        password: this.state.password,
        friends: null,
      });
  };

  signUpHandler = async () => {
    if (
      this.state.username == '' ||
      this.state.password == '' ||
      this.state.confirmPassword == '' ||
      this.state.name == ''
    ) {
      Alert.alert('Sign Up Failed', 'No field should be left empty.');
      return;
    }
    if (this.state.username.length < 5) {
      Alert.alert(
        'Sign Up Failed',
        'Username lenght should be greater than 8 characters.',
      );
      return;
    }
    if (this.state.password.length < 8) {
      Alert.alert(
        'Sign Up Failed',
        'Password lenght should be greater than 8 characters.',
      );
      return;
    }
    if (this.state.password != this.state.confirmPassword) {
      Alert.alert(
        'Sign Up Failed',
        'Password and Confirm Password does not match.',
      );
      return;
    }
    var ref = firebase.database().ref(`/users`);
    await ref
      .orderByChild('username')
      .equalTo(this.state.username)
      .once('value')
      .then(snapshot => {
        if (snapshot.val()) {
          Alert.alert('Sign Up Failed', 'Username already taken.');
          return;
        } else {
          this.userEntry();
          this.props.navigation.navigate('App');
        }
      });
  };
  onChangeHandler = key => val => {
    this.setState({[key]: val});
  };
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <TextInput
          style={styles.input}
          value={this.state.username}
          placeholder={'Username'}
          onChangeText={this.onChangeHandler('username')}></TextInput>
        <TextInput
          style={styles.input}
          value={this.state.name}
          placeholder={'Name'}
          onChangeText={this.onChangeHandler('name')}></TextInput>
        <TextInput
          secureTextEntry={true}
          style={styles.input}
          value={this.state.password}
          placeholder={'Password'}
          onChangeText={this.onChangeHandler('password')}></TextInput>
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          value={this.state.confirmPassword}
          placeholder={'Confirm Password'}
          onChangeText={this.onChangeHandler('confirmPassword')}></TextInput>
        <TouchableOpacity onPress={this.signUpHandler}>
          <Text style={styles.btn}>Sign Up</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}
