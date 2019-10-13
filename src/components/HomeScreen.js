import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  AsyncStorage,
  FlatList,
  Image,
} from 'react-native';
import User from '../User';
import firebase from 'firebase';
import PubNubReact from 'pubnub-react';
var PushNotification = require('react-native-push-notification');

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.pubnub = new PubNubReact({
      publishKey: 'pub-c-1a256bc0-f516-4140-83e1-2cd02f72e19b',
      subscribeKey: 'sub-c-1a959da8-ebfb-11e9-ad72-8e6732c0d56b',
    });
    this.pubnub.init(this);
    PushNotification.configure({
      onRegister: function(token) {
        if (token.os == 'android') {
          User.token = token.token;
          this.pubnub.push.addChannels({
            channels: [User.username],
            device: User.token,
            pushGateway: 'gcm', // apns, gcm, mpns
          });
        }
      }.bind(this),

      onNotification: function(notification) {
        console.log('NOTIFICATION:', notification);
      },
      // ANDROID: GCM or FCM Sender ID
      senderID: '168500823310',
    });
  }

  state = {
    users: [],
  };
  componentWillMount() {
    let dbRef = firebase.database().ref('users/' + User.username + '/friends/');
    dbRef.on('child_added', val => {
      let person = val.val();
      console.log(person);
      //person.username = val.username
      if (person.username == User.username) {
        //User.name = person.name
      } else {
        this.setState(prevState => {
          return {
            users: [...prevState.users, person],
          };
        });
      }
    });
  }
  logoutHandler = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
    this.pubnub.push.removeChannels(
      {
        channels: [User.username],
        device: User.token,
        pushGateway: 'gcm', // apns, gcm, mpns
      },
      function(status) {
        if (status.error) {
          console.log('operation failed w/ error:', status);
        } else {
          console.log('operation done!');
        }
      },
    );
  };
  renderRow = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('ChatScreen', item)}
        style={{padding: 10, borderBottomColor: '#ccc', borderBottomWidth: 1}}>
        <Text style={{fontSize: 20}}>{item.name}</Text>
      </TouchableOpacity>
    );
  };
  render() {
    return (
      <SafeAreaView>
        <TouchableOpacity onPress={this.logoutHandler}>
          <Text>Logout</Text>
        </TouchableOpacity>

        <FlatList
          data={this.state.users}
          renderItem={this.renderRow}
          keyExtractor={item => item.username}
        />
      </SafeAreaView>
    );
  }
}
