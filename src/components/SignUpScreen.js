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
  KeyboardAvoidingView,
} from 'react-native';
import firebase from 'firebase';
import User from '../User';
import ImagePicker from 'react-native-image-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export default class SignUpScreen extends React.Component {
  state = {
    username: '',
    name: '',
    password: '',
    confirmPassword: '',
    photo: null,
    isFocused: [false, false, false, false],
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
    firebase
      .database()
      .ref('users/' + User.username)
      .set({
        name: this.state.name,
        username: this.state.username,
        password: this.state.password,
        friends: null,
      });
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
      .then(snapshot => {
        if (snapshot.val()) {
          Alert.alert('Sign Up Failed', 'Username already taken.');
          return;
        } else {
          this.userEntry();
          this.props.navigation.navigate('App');
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
  render() {
    return (
      // <SafeAreaView style={styles.container}>
      //   {this.state.photo && (
      //     <Image
      //       source={{uri: this.state.photo.uri}}
      //       style={{width: 100, height: 100, marginRight: 200, borderRadius: 100}}
      //     />
      //   )}

      //   <TextInput
      //     style={styles.input}
      //     value={this.state.username}
      //     placeholder={'Username'}
      //     onChangeText={this.onChangeHandler('username')}></TextInput>
      //   <TextInput
      //     style={styles.input}
      //     value={this.state.name}
      //     placeholder={'Name'}
      //     onChangeText={this.onChangeHandler('name')}></TextInput>
      //   <TextInput
      //     secureTextEntry={true}
      //     style={styles.input}
      //     value={this.state.password}
      //     placeholder={'Password'}
      //     onChangeText={this.onChangeHandler('password')}></TextInput>
      //   <TextInput
      //     style={styles.input}
      //     secureTextEntry={true}
      //     value={this.state.confirmPassword}
      //     placeholder={'Confirm Password'}
      //     onChangeText={this.onChangeHandler('confirmPassword')}></TextInput>
      //   <TouchableOpacity onPress={this.signUpHandler}>
      //     <Text style={styles.btn}>Sign Up</Text>
      //   </TouchableOpacity>
      //   <TouchableOpacity onPress={this.handleChoosePhoto}>
      //     <Text style={styles.btn}>Choose Photo</Text>
      //   </TouchableOpacity>
      // </SafeAreaView>
      <View style={styles.container}>
        <ImageBackground
          source={require('../assets/wallpaper.png')}
          style={styles.backgorundImage}>
          <ImageBackground
            style={{
              alignSelf: 'center',
              height: 100,
              width: 100,
              backgroundColor: '#e4e4e4',
              borderRadius: 100,
              marginTop: 80,
            }}></ImageBackground>
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
  },
  signUpText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
});
