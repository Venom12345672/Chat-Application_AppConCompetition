import React from 'react';
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
    };
  }
  addFriend = () => {
    var myfriendListRef = firebase
      .database()
      .ref('users/' + User.username + '/friends');
    var newfriendRef = myfriendListRef.push();
    newfriendRef.set({
      username: this.state.seacrhedUser.username,
      name: this.state.seacrhedUser.name,
      channelKey: User.username + this.state.seacrhedUser.username,
    });
    var otherFriendListRef = firebase
      .database()
      .ref('users/' + this.state.seacrhedUser.username + '/friends');
    var otherNewFriend = otherFriendListRef.push();
    otherNewFriend.set({
      username: User.username,
      name: User.name,
      channelKey: User.username + this.state.seacrhedUser.username,
    });
  };
  render() {
    return (
      // <View style={styles.container}>
      //   <Text>{this.state.seacrhedUser.name}</Text>
      //   <Button onPress={this.addFriend} title="Start Chatting!"></Button>
      // </View>
      <View style={styles.container}>
        <ImageBackground
          source={require('../assets/wallpaper1.png')}
          style={styles.backgorundImage}>
          <View style={styles.backButtonContainer}>
            <Animatable.View
              animation="slideInLeft"
              style={{
                width: 35,
                borderRightWidth: 2,
                borderRightColor: '#62B491',
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
            {User.photo == 'NaN' ? (
              <Image
                source={require('../assets/NaN.png')}
                style={{width: 150, height: 150, borderRadius: 100}}></Image>
            ) : (
              <Image
                source={{uri: this.state.seacrhedUser.profileLink}}
                style={{width: 150, height: 150, borderRadius: 100}}></Image>
            )}
          </View>
          <Text style={styles.nameText}>{this.state.seacrhedUser.name}</Text>
          <TouchableOpacity
            style={styles.letsConnectContainer}
            onPress={this.addFriend}>
            <Text style={styles.letsConnectText}>LETS CONNECT.</Text>
          </TouchableOpacity>
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
  letsConnectText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
});
