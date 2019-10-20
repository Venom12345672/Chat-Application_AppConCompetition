import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
  TextInput,
  Alert,
  AsyncStorage,
  Image,
  StyleSheet,
  ImageBackground,
  ToastAndroid,
} from 'react-native';
import firebase from 'firebase';
import User from '../User';
import ImagePicker from 'react-native-image-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as Animatable from 'react-native-animatable';

export default class SignUpScreen extends React.Component {
  state = {
    username: '',
    name: '',
    password: '',
    confirmPassword: '',
    photo: null,
    isFocused: [false, false, false, false],
    link: null,
  };
  handleFocus = key => {
    let temp = this.state.isFocused;
    temp[key] = true;
    this.setState({isFocused: temp});
  };
  handleBlur = key => {
    let temp = this.state.isFocused;
    temp[key] = false;
    this.setState({isFocused: temp});
  };
  userEntry = () => {
    AsyncStorage.setItem('username', this.state.username);
    AsyncStorage.setItem('name', this.state.name);
    User.username = this.state.username;
    User.name = this.state.name;
    User.password = this.state.password;
    User.photo = this.state.link;
    firebase
      .database()
      .ref('users/' + User.username)
      .set({
        name: this.state.name,
        username: this.state.username,
        password: this.state.password,
        friends: null,
        profileLink: this.state.link,
      });
  };
  checkSpecialCharacters = u => {
    for (let i = 0; i < u.length; i++) {
      if (
        u[i] == '.' ||
        u[i] == '/' ||
        u[i] == '\\' ||
        u[i] == ',' ||
        u[i] == '*' ||
        u[i] == ':'
      ) {
        return true;
      }
    }
    return false;
  };
  signUpHandler = async () => {
    if (
      this.state.username == '' ||
      this.state.password == '' ||
      this.state.confirmPassword == '' ||
      this.state.name == ''
    ) {
      Alert.alert('Sign Up Failed', 'No field should be left empty.');
      return;
    }
    if (this.state.username.length < 5) {
      Alert.alert(
        'Sign Up Failed',
        'Username lenght should be greater than 8 characters.',
      );
      return;
    }
    if (this.checkSpecialCharacters(this.state.username)) {
      Alert.alert('Sign Up Failed', `Username cannot have . \\ / : * ,`);
      return;
    }
    if (this.state.password.length < 8) {
      Alert.alert(
        'Sign Up Failed',
        'Password lenght should be greater than 8 characters.',
      );
      return;
    }
    if (this.state.password != this.state.confirmPassword) {
      Alert.alert(
        'Sign Up Failed',
        'Password and Confirm Password does not match.',
      );
      return;
    }
    var ref = firebase.database().ref(`/users`);
    await ref
      .orderByChild('username')
      .equalTo(this.state.username)
      .once('value')
      .then(async snapshot => {
        if (snapshot.val()) {
          Alert.alert('Sign Up Failed', 'Username already taken.');
          return;
        } else {
          if (this.state.photo) {
            this.uploadImage(this.state.photo.uri, this.state.photo.fileName)
              .then(async result => {
                ToastAndroid.show(
                  'Congratulaions!! New profile created...',
                  ToastAndroid.SHORT,
                );
                const ref = firebase
                  .storage()
                  .ref(`${this.state.username}/${this.state.photo.fileName}`);
                const url = await ref.getDownloadURL();
                this.setState({link: url});
                this.userEntry(); // enter user in database
                this.props.navigation.navigate('App');
              })
              .catch(() => {
                ToastAndroid.show(
                  'Failed. Please Try again later...',
                  ToastAndroid.SHORT,
                );
              });
          } else {
            ToastAndroid.show(
              'Congratulaions!! New profile created...',
              ToastAndroid.SHORT,
            );
            this.setState({link: 'NaN'});
            this.userEntry(); // enter user in database
            this.props.navigation.navigate('App');
          }
        }
      });
  };
  onChangeHandler = key => val => {
    this.setState({[key]: val});
  };
  handleChoosePhoto = () => {
    const options = {noData: true};
    ImagePicker.launchImageLibrary(options, response => {
      if (response.uri) {
        this.setState({photo: response});
      }
    });
  };

  uploadImage = async (uri, name) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    ToastAndroid.show('Creating Account...', ToastAndroid.SHORT);
    var ref = firebase
      .storage()
      .ref()
      .child(this.state.username + '/' + name);

    return ref.put(blob);
  };
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('../assets/wallpaper.png')}
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
                onPress={() => this.props.navigation.navigate('LandingScreen')}>
                <Image
                  source={require('../assets/back.png')}
                  style={{width: 25, height: 25, borderRadius: 100}}></Image>
              </TouchableOpacity>
            </Animatable.View>
          </View>

          <TouchableOpacity
            onPress={this.handleChoosePhoto}
            style={styles.profilePhoto}>
            {this.state.photo ? (
              <Image
                source={{uri: this.state.photo.uri}}
                style={{width: 150, height: 150, borderRadius: 100}}></Image>
            ) : null}
          </TouchableOpacity>
          <KeyboardAwareScrollView>
            <TextInput
              style={{width: '90%', alignSelf: 'center', marginTop: 25}}
              placeholder="Name"
              underlineColorAndroid={
                this.state.isFocused[0] ? '#679AC6' : '#707070'
              }
              onFocus={() => this.handleFocus(0)}
              onBlur={() => this.handleBlur(0)}
              value={this.state.name}
              onChangeText={this.onChangeHandler('name')}
            />
            <TextInput
              style={{width: '90%', alignSelf: 'center', marginTop: 25}}
              placeholder="Username"
              underlineColorAndroid={
                this.state.isFocused[1] ? '#679AC6' : '#707070'
              }
              onFocus={() => this.handleFocus(1)}
              onBlur={() => this.handleBlur(1)}
              value={this.state.username}
              onChangeText={this.onChangeHandler('username')}
            />
            <TextInput
              style={{width: '90%', alignSelf: 'center', marginTop: 25}}
              placeholder="Password"
              underlineColorAndroid={
                this.state.isFocused[2] ? '#679AC6' : '#707070'
              }
              onFocus={() => this.handleFocus(2)}
              onBlur={() => this.handleBlur(2)}
              value={this.state.password}
              onChangeText={this.onChangeHandler('password')}
              secureTextEntry={true}
            />
            <TextInput
              style={{width: '90%', alignSelf: 'center', marginTop: 25}}
              placeholder="Confirm Password"
              underlineColorAndroid={
                this.state.isFocused[3] ? '#679AC6' : '#707070'
              }
              onFocus={() => this.handleFocus(3)}
              onBlur={() => this.handleBlur(3)}
              value={this.state.confirmPassword}
              onChangeText={this.onChangeHandler('confirmPassword')}
              secureTextEntry={true}
            />
            <View style={{width: '90%', alignSelf: 'center'}}>
              <Text style={{fontSize: 12, color: '#707070', paddingLeft: 5}}>
                Atleast 8 characters
              </Text>
            </View>
            <TouchableOpacity
              style={styles.signUpContainer}
              onPress={this.signUpHandler}>
              <Text style={styles.signUpText}>SIGN UP</Text>
            </TouchableOpacity>
          </KeyboardAwareScrollView>
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
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: '90%',
    height: 50,
    marginTop: 70,
  },
  signUpContainer: {
    backgroundColor: '#679AC6',
    width: 150,
    height: 50,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginTop: 30,
    elevation: 5,
  },
  signUpText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  backButtonContainer: {
    width: '90%',
    height: 30,
    alignSelf: 'center',
    marginTop: 20,
  },
  profilePhoto: {
    height: 150,
    width: 150,
    borderRadius: 100,
    alignSelf: 'center',
    backgroundColor: '#e4e4e4',
    marginTop: 40,
  },
});
