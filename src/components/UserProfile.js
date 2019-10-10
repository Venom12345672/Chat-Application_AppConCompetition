import React from 'react';
import {View, Text, Button} from 'react-native';
import styles from './constants/styles';
import User from '../User';
import firebase from 'firebase';
export default class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seacrhedUser: props.navigation.state.params,
    };
  }
  addFriend = () => {
    var friendListRef = firebase
      .database()
      .ref('users/' + User.username + '/friends');
    var newfriendRef = friendListRef.push();
    let friend = this.state.seacrhedUser.username;
    newfriendRef.set({
      username: this.state.seacrhedUser.username,
      name: this.state.seacrhedUser.name,
    });
  };
  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state.seacrhedUser.name}</Text>
        <Button onPress={this.addFriend} title="Start Chatting!"></Button>
      </View>
    );
  }
}
