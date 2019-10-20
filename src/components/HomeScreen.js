import React from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  View,
  ImageBackground,
  StatusBar,
  Image,
} from 'react-native';
import User from '../User';
import firebase from 'firebase';
import PubNubReact from 'pubnub-react';
import * as Animatable from 'react-native-animatable';
import {FloatingAction} from 'react-native-floating-action';

var PushNotification = require('react-native-push-notification');
const actions = [
  {
    text: 'Message',
    name: 'friends',
    position: 1,
    color: '#679AC6',
    icon: require('../assets/message.png'),
  },
  {
    text: 'Find Friend',
    name: 'search',
    position: 2,
    color: '#679AC6',
    icon: require('../assets/search.png'),
  },
];
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
    count: 1,
  };
  isIn = u => {
    if (User.friendsList.length > 0) {
      for (let i = 0; i < User.friendsList.length; i++) {
        if (User.friendsList[i].username == u) {
          return i;
        }
      }
    }
    return -1;
  };
  async componentDidMount() {
    const {navigation} = this.props;

    this.focusListener = navigation.addListener('didFocus', async () => {
      let friend = {};
      let dbRef = await firebase
        .database()
        .ref('users/' + User.username + '/friends/');
      dbRef.once('child_added', async val => {
        let person = val.val();
        friend['username'] = person.username;
        friend['active'] = person.active;
        User.friends[person.username] = friend;
        await firebase
          .database()
          .ref('users/' + person.username)
          .on('value', snapshot => {
            let value = snapshot.val();
            User.friends[value.username]['name'] = value.name;
            User.friends[value.username]['profileLink'] = value.profileLink;
            let index = this.isIn(value.username);
            if (index == -1) {
              User.friendsList.push(User.friends[value.username]);
            } else {
              let u = User.friendsList[index].username;
              User.friendsList[index].active = User.friends[u].active;
              User.friendsList[index].name = User.friends[u].name;
              User.friendsList[index].profileLink = User.friends[u].profileLink;
            }
            if (friend.username == User.username) {
              //User.name = person.name
            } else {
              this.setState(prevState => {
                return {
                  users: User.friendsList,
                };
              });
            }
            friend = {};
          });
      });
    });

    //person.username = val.username
  }

  componentWillUnmount() {
    // Remove the event listener before removing the screen from the stack
    this.focusListener.remove();
  }
  renderRow = ({item}) => {
    if (item.active == true) {
      return (
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('ChatScreen', item)}
          style={{marginTop: 20, flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={
              item.profileLink == 'NaN'
                ? require('../assets/NaN.png')
                : {uri: item.profileLink}
            }
            style={styles.userPhoto}></Image>
          <Text style={{fontSize: 20, marginLeft: 15}}>{item.name}</Text>
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  };
  renderName = () => {
    for (let i = 0; i < User.name.length; i++) {
      if (User.name[i] == ' ') {
        return User.name.substring(0, i);
      }
    }
    return User.name.substring(0, 10);
  };
  render() {
    return (
      // <SafeAreaView>

      // </SafeAreaView>
      <View style={styles.container}>
        <StatusBar backgroundColor="#679AC6" barStyle="light-content" />

        <ImageBackground
          source={require('../assets/wallpaper1.png')}
          style={styles.backgorundImage}>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('ProfileScreen', {
                refresh: () => {
                  console.log(User);
                  this.setState({});
                },
              })
            }>
            <Animatable.View
              animation="slideInRight"
              style={styles.subContainer}>
              <View style={styles.profileViewContainer}>
                <View style={{width: '30%'}}>
                  <Image
                    source={
                      User.photo == 'NaN'
                        ? require('../assets/NaN.png')
                        : {uri: User.photo}
                    }
                    style={styles.profilePhoto}></Image>
                </View>

                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '70%',
                  }}>
                  <Text
                    style={{
                      color: '#679AC6',
                      fontWeight: 'bold',
                    }}>
                    {this.renderName()}
                  </Text>
                </View>
              </View>
            </Animatable.View>
          </TouchableOpacity>
          <View style={{width: '90%', alignSelf: 'center', marginTop: 30}}>
            <Text style={{color: '#9A9A9A', fontSize: 14}}>Active Conversations</Text>
          </View>
          <FlatList
            style={{marginTop: 20}}
            data={this.state.users}
            renderItem={this.renderRow}
            keyExtractor={item => item.username}
          />
          <FloatingAction
            color="#679AC6"
            actions={actions}
            onPressItem={name => {
              if (name == 'search') {
                console.log(name);
                this.props.navigation.navigate('SearchScreen');
              } else if (name == 'friends') {
                this.props.navigation.navigate('FriendsScreen');
              }
            }}
          />
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgorundImage: {width: '100%', height: '100%'},
  subContainer: {
    width: '90%',
    height: 35,
    alignSelf: 'center',
    marginTop: 20,
    flexDirection: 'row-reverse',
  },
  profileViewContainer: {
    width: 100,
    height: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 30,
    borderWidth: 1.2,
    borderColor: '#679AC6',
  },
  profilePhoto: {
    width: 30,
    height: 30,
    borderRadius: 100,
    marginLeft: 2,
  },
  userPhoto: {
    height: 45,
    width: 45,
    borderRadius: 100,
    marginLeft: 15,
  },
});
