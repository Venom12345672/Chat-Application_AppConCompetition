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
    name: 'bt_message',
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

  renderRow = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('ChatScreen', item)}
        style={{padding: 10, borderBottomColor: '#ccc', borderBottomWidth: 1}}>
        <Text style={{fontSize: 20}}>{item.name}</Text>
      </TouchableOpacity>
    );
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
      //   <FlatList
      //     data={this.state.users}
      //     renderItem={this.renderRow}
      //     keyExtractor={item => item.username}
      //   />
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
            <Text style={{color: '#9A9A9A', fontSize: 14}}>All messages</Text>
          </View>
          <FloatingAction
            color="#679AC6"
            actions={actions}
            onPressItem={name => {
              if (name == 'search') {
                console.log(name);
                this.props.navigation.navigate('SearchScreen');
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
});
