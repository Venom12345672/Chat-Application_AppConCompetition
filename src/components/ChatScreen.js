import React from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import PubNubReact from 'pubnub-react';
import firebase from 'firebase';
import User from '../User';
export default class ChatScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.getParam('name', null),
    };
  };
  constructor(props) {
    super(props);
    this.pubnub = new PubNubReact({
      publishKey: 'pub-c-1a256bc0-f516-4140-83e1-2cd02f72e19b',
      subscribeKey: 'sub-c-1a959da8-ebfb-11e9-ad72-8e6732c0d56b',
    });
    this.pubnub.init(this);
    this.state = {
      person: {
        name: props.navigation.getParam('name'),
        username: props.navigation.getParam('username'),
      },
      messageList: [],
    };
  }
 
  parse = snapshot => {
    const {text, createdAt, user} = snapshot.val();
    const {key: _id} = snapshot;
    const message = {_id, text, createdAt, user};
    return message;
  };
  get user() {
    return {
      name: 'hamzah baig',
      email: 'hamzahbaigi8@yahoo.com',
      avatar: 'https://placeimg.com/140/140/any',
      _id: 2,
    };
  }
  send = async messages => {
    for (let i = 0; i < messages.length; i++) {
      const {text, user} = messages[i];
      timeStamp = new Date().toString();
      const message = {text, createdAt: timeStamp, user};
      await firebase
        .database()
        .ref('messages')
        .child(User.username)
        .child(this.state.person.username)
        .push(message);
    }
  };
  componentDidMount() {
    firebase
      .database()
      .ref('messages')
      .child(User.username)
      .child(this.state.person.username)
      .on('child_added', snapshot => {
        message = this.parse(snapshot);
        this.setState(previousState => ({
          messageList: GiftedChat.append(previousState.messageList, message),
        }));
      });
  }
  
  render() {
    return (
      <GiftedChat
        messages={this.state.messageList}
        onSend={this.send}
        user={this.user}
      />
    );
  }
}
