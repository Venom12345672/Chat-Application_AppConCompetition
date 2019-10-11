import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  AsyncStorage,
  FlatList,
} from 'react-native';
import User from '../User';
import firebase from 'firebase';
import PushNotificationIOS from 'react-native';
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
      // Called when Token is generated.
      onRegister: function(token) {
        console.log('TOKEN:', token);
        if (token.os == 'ios') {
          this.pubnub.push.addChannels({
            channels: ['notifications'],
            device: token.token,
            pushGateway: 'apns',
          });
          // Send iOS Notification from debug console: {"pn_apns":{"aps":{"alert":"Hello World."}}}
        } else if (token.os == 'android') {
          console.log("AM CALLED")
          this.pubnub.push.addChannels({
           channels: ['notifications'],
            device: token.token,
            pushGateway: 'gcm', // apns, gcm, mpns
          });
          this.pubnub.subscribe({
            channels:['hamzah123']
          })
          this.pubnub.publish({
            message: {"pn_gcm":{"data":{"message":`${User.username}: Hello World.`}}},
            channel: 'minhal123'
          },status => {
            console.log("published done")
          })
          // Send Android Notification from debug console:
        }
      }.bind(this),
      // Something not working?
      // See: https://support.pubnub.com/support/solutions/articles/14000043605-how-can-i-troubleshoot-my-push-notification-issues-
      // Called when a remote or local notification is opened or received.
      onNotification: function(notification) {
        console.log('NOTIFICATION:', notification);
        // Do something with the notification.
        // Required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
        // notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      // ANDROID: GCM or FCM Sender ID
      senderID: '168500823310',
    });
  }
  static navigationOptions = {
    title: 'Chats',
  };

  state = {
    users: [],
  };
  componentWillMount() {
    let dbRef = firebase.database().ref('users/' + User.username+'/friends/');
    dbRef.on('child_added',val => {
      let person = val.val()
      console.log(person)
      //person.username = val.username
      if (person.username == User.username) {
        //User.name = person.name
      } else {
        this.setState(prevState => {
          return {
            users: [...prevState.users,person]
          }
        })
      }
    })

  }
  logoutHandler = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
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
