import React, {useReducer} from 'react';
import {
  View,
  Text,
  Button,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import User from '../User';
import firebase from 'firebase';
import * as Animatable from 'react-native-animatable';

export default class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seacrhedUser: props.navigation.state.params,
      alreadyFriend: false,
    };
  }
  addFriend = async () => {
    var myfriendListRef = firebase
      .database()
      .ref(
        'users/' +
          User.username +
          '/friends/' +
          this.state.seacrhedUser.username,
      );
    myfriendListRef.set({
      username: this.state.seacrhedUser.username,
      name: this.state.seacrhedUser.name,
      channelKey: User.username + this.state.seacrhedUser.username,
      profileLink: this.state.seacrhedUser.profileLink,
      active: false,
      latestMsg: ''
    });
    var otherFriendListRef = firebase
      .database()
      .ref(
        'users/' +
          this.state.seacrhedUser.username +
          '/friends/' +
          User.username,
      );
    otherFriendListRef.set({
      username: User.username,
      name: User.name,
      channelKey: User.username + this.state.seacrhedUser.username,
      profileLink: User.photo,
      active: false,
      latestMsg: ''
    });
    let item = {
      name: this.state.seacrhedUser.name,
      channelKey: User.username + this.state.seacrhedUser.username,
      username: this.state.seacrhedUser.username,
      profileLink: this.state.seacrhedUser.profileLink,
    };
    this.props.navigation.navigate('ChatScreen', item);
  };
  componentDidMount() {
    if (User.friends[this.state.seacrhedUser.username]) {
      this.setState({alreadyFriend: true});
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('../assets/wallpaper1.png')}
          style={styles.backgorundImage}>
          <View style={styles.backButtonContainer}>
            <Animatable.View
              animation="slideInLeft"
              style={{
                width: 35,
              }}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Home')}>
                <Image
                  source={require('../assets/back.png')}
                  style={{width: 25, height: 25, borderRadius: 100}}></Image>
              </TouchableOpacity>
            </Animatable.View>
            <Text style={styles.mainHeading}>User Profile</Text>
          </View>
          <View style={styles.profilePhoto}>
            <Image
              source={
                this.state.seacrhedUser.profileLink == 'NaN'
                  ? require('../assets/NaN.png')
                  : {uri: this.state.seacrhedUser.profileLink}
              }
              style={{width: 150, height: 150, borderRadius: 100}}></Image>
          </View>
          <Text style={styles.nameText}>{this.state.seacrhedUser.name}</Text>
          {this.state.alreadyFriend ? (
            <TouchableOpacity style={styles.connectedContainer}>
              <Text style={styles.letsConnectText}>CONNECTED</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.letsConnectContainer}
              onPress={this.addFriend}>
              <Text style={styles.letsConnectText}>LETS CONNECT.</Text>
            </TouchableOpacity>
          )}
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
  nameText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#679AC6',
    marginTop: 20,
    alignSelf: 'center',
  },
  backButtonContainer: {
    width: '90%',
    height: 50,
    alignSelf: 'center',
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePhoto: {
    height: 150,
    width: 150,
    borderRadius: 100,
    alignSelf: 'center',
    backgroundColor: '#e4e4e4',
    marginTop: 40,
  },
  mainHeading: {
    marginLeft: 10,
    fontSize: 30,
    fontWeight: 'bold',
    color: '#679AC6',
  },
  letsConnectContainer: {
    backgroundColor: '#62B491',
    width: 150,
    height: 50,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginTop: 100,
    elevation: 5,
  },
  connectedContainer: {
    backgroundColor: '#679AC6',
    width: 150,
    height: 50,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginTop: 100,
    elevation: 5,
  },
  letsConnectText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
});
