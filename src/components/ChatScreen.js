import React from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import PubNubReact from 'pubnub-react';
import User from '../User';

export default class ChatScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      textMessage: [],
      person: {
        name: props.navigation.getParam('name'),
        username: props.navigation.getParam('username'),
      },
      currentChannel: '',
    };
    this.pubnub = new PubNubReact({
      publishKey: 'pub-c-1a256bc0-f516-4140-83e1-2cd02f72e19b',
      subscribeKey: 'sub-c-1a959da8-ebfb-11e9-ad72-8e6732c0d56b',
    });
    this.pubnub.init(this);
    this.id = this.randomid();
  }

  componentWillMount() {
    this.pubnub.subscribe({
      channels: [User.username + this.state.person.username],
      withPresence: true,
    });

    this.pubnub.history(
      {channel: User.username + this.state.person.username, reverse: true, count: 15},
      (status, res) => {
        let newmessage = [];
        res.messages.forEach(function(element, index) {
          newmessage[index] = element.entry[0];
        });
        this.setState(previousState => ({
          messages: GiftedChat.append(
            previousState.messages,
            newmessage.reverse(),
          ),
        }));
      },
    );

    this.pubnub.getMessage(User.username + this.state.person.username, msg => {
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, msg['message']),
      }));
    });
  }

  componentWillUnmount() {
    this.pubnub.unsubscribe({channels: [User.username + this.state.person.username]});
  }

  onSend(messages = []) {
    this.pubnub.publish({
      message: messages,
      channel: User.username + this.state.person.username,
    });
  }
  randomid = () => {
    return Math.floor(Math.random() * 100);
  };
  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: User.username,
        }}
      />
    );
  }
}
