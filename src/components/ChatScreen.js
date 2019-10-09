import React from 'react';
import {View, Text, SafeAreaView, TouchableOpacity} from 'react-native';
import styles from './constants/styles';
import {TextInput} from 'react-native-gesture-handler';
import User from '../User';
import firebase from 'firebase'
export default class ChatScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.getParam('name', null),
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      person: {
        name: props.navigation.getParam('name'),
        username: props.navigation.getParam('username'),
      },
      textMessage: '',
    };
  }
  handleChange = key => val => {
    this.setState({[key]: val});
  };
  sendMessage = async () => {
    if (this.state.textMessage.length > 0) {
      let msgId = firebase
        .database()
        .ref('messages')
        .child(User.username)
        .child(this.state.person.username)
        .push().key;
      let updates = {};
      let message = {
        message: this.state.textMessage,
        time: firebase.database.ServerValue.TIMESTAMP,
        from: User.username,
      };
      updates[
        'messages/' +
          User.username +
          '/' +
          this.state.person.username +
          '/' +
          msgId
      ] = message;
      updates[
        'messages/' +
          this.state.person.username +
          '/' +
          User.username +
          '/' +
          msgId
      ] = message;
      firebase
        .database()
        .ref()
        .update(updates);
      this.setState({textMessage: ''});
    }
  };
  render() {
    return (
      <SafeAreaView>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TextInput
            style={styles.input}
            value={this.state.textMessage}
            placeholder="Type message..."
            onChangeText={this.handleChange('textMessage')}
          />
          <TouchableOpacity onPress={this.sendMessage}>
            <Text style={styles.btn}>Send</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}
