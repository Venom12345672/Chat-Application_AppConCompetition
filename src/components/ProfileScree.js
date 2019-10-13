import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import User from '../User';
import styles from './constants/styles';
import firebase from 'firebase';
export default class ProfileScreen extends React.Component {
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
      </SafeAreaView>
    );
  }
}
