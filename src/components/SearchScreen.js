import React from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import styles from './constants/styles';
import firebase from 'firebase';
import User from '../User';
export default class SearchScreen extends React.Component {
  state = {
    enteredUsername: '',
    serachedUser: null,
  };
  handleChange = key => val => {
    if (val == User.username) {
      return;
    }
    let temp = null;
    var ref = firebase.database().ref(`/users`);
    ref
      .orderByChild('username')
      .equalTo(val)
      .on('child_added', function(snapshot) {
        temp = snapshot.val();
      });
    this.setState({[key]: val, serachedUser: temp});
  };
  renderResult = navigation => {
    if (this.state.serachedUser) {
      return (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('UserProfile', this.state.serachedUser)
          }
          style={{
            padding: 10,
            borderBottomColor: '#ccc',
            borderBottomWidth: 1,
          }}>
          <Text style={{fontSize: 20}}>{this.state.serachedUser.name}</Text>
        </TouchableOpacity>
      );
    }
  };
  render() {
    return (
      <View stle={styles.container}>
        <TextInput
          placeholder="Enter Friend's Username"
          style={styles.input}
          value={this.state.enteredUsername}
          onChangeText={this.handleChange('enteredUsername')}
        />
        {this.renderResult(this.props.navigation)}
      </View>
    );
  }
}
