import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Image,
} from 'react-native';
import firebase from 'firebase';
import User from '../User';
import * as Animatable from 'react-native-animatable';

export default class SearchScreen extends React.Component {
  state = {
    enteredUsername: '',
    serachedUser: null,
    isFocused: false,
  };
  handleFocus = () => {
    this.setState({isFocused: true});
  };
  handleBlur = () => {
    this.setState({isFocused: false});
  };
  handleChange = key => async val => {
    if (val == User.username) {
      this.setState({[key]: val, serachedUser: null});

      return;
    }
    let temp = null;
    var ref = firebase.database().ref(`/users`);
    ref
      .orderByChild('username')
      .equalTo(val)
      .once('value')
      .then(snapshot => {
        if (snapshot.val()) {
          temp = snapshot.val()[val];
          this.setState({[key]: val, serachedUser: temp});
        }
      });
    this.setState({[key]: val, serachedUser: null});
  };
  renderResult = navigation => {
    if (this.state.serachedUser) {
      return (
        <TouchableOpacity
          onPress={() =>{
            navigation.navigate('UserProfile', this.state.serachedUser)}
          }
          style={{
            marginTop: 10,
            width: '90%',
            height: 50,
            alignSelf: 'center',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            source={
              this.state.serachedUser.profileLink == 'NaN'
                ? require('../assets/NaN.png')
                : {uri: this.state.serachedUser.profileLink}
            }
            style={{width: 50, height: 50, borderRadius: 100}}
          />
          <Text style={{fontSize: 20, color: '#679AC6', marginLeft: 10}}>
            {this.state.serachedUser.name}
          </Text>
        </TouchableOpacity>
      );
    }
  };
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
                // borderRightWidth: 2,
                // borderRightColor: '#62B491',
              }}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Home')}>
                <Image
                  source={require('../assets/back.png')}
                  style={{width: 25, height: 25, borderRadius: 100}}></Image>
              </TouchableOpacity>
            </Animatable.View>
            <Text style={styles.mainHeading}>Search. Connect!</Text>
          </View>
          <TextInput
            style={{width: '90%', alignSelf: 'center', marginTop: 10}}
            placeholder="Enter Username"
            value={this.state.enteredUsername}
            onChangeText={this.handleChange('enteredUsername')}
            underlineColorAndroid={this.state.isFocused ? '#679AC6' : '#707070'}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
          {this.renderResult(this.props.navigation)}
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
  backButtonContainer: {
    width: '90%',
    height: 50,
    alignSelf: 'center',
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainHeading: {
    marginLeft: 10,
    fontSize: 30,
    fontWeight: 'bold',
    color: '#679AC6',
  },
});
