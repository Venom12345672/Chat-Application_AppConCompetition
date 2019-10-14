import React from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import firebase from 'firebase';

// type Props = {
//   name?: string,
//   email?: string,
//   avatar?: string,
// };

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
  }
  //   static navigationOptions = ({ navigation }) => ({
  //     title: (navigation.state.params || {}).name || 'Scv Chat!',
  //   });
  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.getParam('name', null),
    };
  };
  state = {
    messages: [],
  };

  get user() {
    return {
      name: 'hamzah baig',
      email: 'hamzahbaigi8@yahoo.com',
     avatar: 'https://placeimg.com/140/140/any',
      _id: firebase.uid,
    };
  }
  send = messages => {
    for (let i = 0; i < messages.length; i++) {
      const {text, user} = messages[i];
      const message = {text, user, createdAt: this.timestamp};
      this.ref.push(message);
    }
  };
  refOn = callback => {
    this.ref
      .limitToLast(20)
      .on('child_added', snapshot => callback(this.parse(snapshot)));
  };
  parse = snapshot => {
    const { timestamp: numberStamp, text, user } = snapshot.val();
    const { key: _id } = snapshot;
    const timestamp = new Date(numberStamp);
    const message = {_id, timestamp, text, user};
    return message;
  };
  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={firebase.send}
        user={this.user}
      />
    );
  }

  componentDidMount() {
    firebase.refOn(message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      })),
    );
  }
  componentWillUnmount() {
    firebase.refOff();
  }
}
