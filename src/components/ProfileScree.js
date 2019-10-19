import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  AsyncStorage,
  StyleSheet,
  ImageBackground,
  Image,
} from 'react-native';
import User from '../User';
import firebase from 'firebase';
import PubNubReact from 'pubnub-react';
import * as Animatable from 'react-native-animatable';

export default class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.pubnub = new PubNubReact({
      publishKey: 'pub-c-1a256bc0-f516-4140-83e1-2cd02f72e19b',
      subscribeKey: 'sub-c-1a959da8-ebfb-11e9-ad72-8e6732c0d56b',
    });
    this.pubnub.init(this);
  }

  state = {
    name: User.name,
    isFocused: false,
  };

  handleChange = key => val => {
    this.setState({[key]: val});
  };
  handleFocus = () => {
    this.setState({isFocused: true});
  };
  handleBlur = () => {
    this.setState({isFocused: false});
  };
  changeName = async () => {
    if (this.state.name.length < 3) {
      Alert.alert('Error', 'Please enter a valid name');
    } else if (User.name != this.state.name) {
      firebase
        .database()
        .ref('users')
        .child(User.username)
        .update({name: this.state.name});
      Alert.alert('Success!', 'Name changed successfully');
      User.name = this.state.name;
      this.setState({name: this.state.name});
      await AsyncStorage.setItem('name', this.state.name);
    }
  };

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

  render() {
    return (
      // <SafeAreaView style={styles.container}>
      //   <Text style={{fontSize: 20}}>{User.username}</Text>
      //   <Text style={{fontSize: 20}}>{User.name}</Text>
      //   <TextInput
      //     style={styles.input}
      //     value={this.state.name}
      //     onChangeText={this.handleChange('name')}></TextInput>
      //   <TouchableOpacity onPress={this.changeName}>
      //     <Text style={styles.btn}>Change Name</Text>
      //   </TouchableOpacity>
      //   <TouchableOpacity onPress={this.logoutHandler}>
      //     <Text style={styles.btn}>Logout</Text>
      //   </TouchableOpacity>
      // </SafeAreaView>
      <View style={styles.container}>
        <ImageBackground
          source={require('../assets/wallpaper1.png')}
          style={styles.backgorundImage}>
          <View style={styles.backButtonContainer}>
            <Animatable.View animation="slideInLeft">
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Home')}>
                <Image
                  source={require('../assets/back.png')}
                  style={{width: 30, height: 30, borderRadius: 100}}></Image>
              </TouchableOpacity>
            </Animatable.View>
            <Text style={styles.mainHeading}>My Profile</Text>
          </View>
          <TouchableOpacity style={styles.profilePhoto}>
            {User.photo == 'NaN' ? (
              <Image
                source={require('../assets/NaN.png')}
                style={{width: 150, height: 150, borderRadius: 100}}></Image>
            ) : (
              <Image
                source={{uri: User.photo}}
                style={{width: 150, height: 150, borderRadius: 100}}></Image>
            )}
          </TouchableOpacity>
          <Text style={styles.nameText}>{User.name}</Text>
          <TextInput
            style={{width: '90%', alignSelf: 'center', marginTop: 25}}
            placeholder="Name"
            underlineColorAndroid={this.state.isFocused ? '#679AC6' : '#707070'}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            value={this.state.name}
            onChangeText={this.handleChange('name')}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.changeNameContainer}
              onPress={this.changeName}>
              <Text style={styles.changeNameText}>CHANGE NAME</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.logoutContainer}
              onPress={this.logoutHandler}>
              <Text style={styles.logoutText}>LOG OUT</Text>
            </TouchableOpacity>
          </View>
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
  signUpContainer: {
    backgroundColor: '#679AC6',
    width: 150,
    height: 50,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginTop: 30,
  },
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
    marginLeft: 20,
    fontSize: 30,
    fontWeight: 'bold',
    color: '#679AC6',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: '90%',
    height: 50,
    marginTop: 50,
  },
  changeNameContainer: {
    backgroundColor: '#62B491',
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  changeNameText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  logoutContainer: {
    backgroundColor: '#679AC6',
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
});
