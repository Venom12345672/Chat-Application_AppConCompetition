import React from 'react';
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  AsyncStorage,
  Alert,
  ImageBackground,
  StatusBar,
  ToastAndroid,
  StyleSheet,
} from 'react-native';
import User from '../User';
import firebase from 'firebase';
export default class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    username: '',
    password: '',
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

  submitForm = async () => {
    if (this.state.username == '' || this.state.password == '') {
      Alert.alert('Invalid Login', 'Please fill all the input fields');
      return;
    }
    var ref = firebase.database().ref(`/users`);
    await ref
      .orderByChild('username')
      .equalTo(this.state.username)
      .once('value')
      .then(snapshot => {
        if (snapshot.val()) {
          fetchedData = snapshot.child(this.state.username).val();
          if (fetchedData.password == this.state.password) {
            AsyncStorage.setItem('username', fetchedData.username);
            AsyncStorage.setItem('name', fetchedData.name);
            User.username = fetchedData.username;
            User.name = fetchedData.name;
            User.password = fetchedData.password;
            User.photo = fetchedData.profileLink
            this.props.navigation.navigate('App');
            return;
          } else {
            Alert.alert('Invalid Login', 'Incorrect username or password');
            return;
          }
        } else {
          Alert.alert('Invalid Login', 'Incorrect username or password');
          return;
        }
      });

  };
  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#679AC6" barStyle="light-content" />
        <ImageBackground
          source={require('../assets/wallpaper1.png')}
          style={styles.backgorundImage}>
          <Text style={styles.mainHeading}>Hello.</Text>
          <TextInput
            style={{width: '90%', alignSelf: 'center', marginTop: 50}}
            placeholder="Username"
            value={this.state.username}
            onChangeText={this.handleChange('username')}
            underlineColorAndroid={this.state.isFocused ? '#679AC6' : '#707070'}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
          <TextInput
            style={{width: '90%', alignSelf: 'center', marginTop: 40}}
            underlineColorAndroid={this.state.isFocused ? '#679AC6' : '#707070'}
            placeholder="Password"
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            value={this.state.password}
            secureTextEntry={true}
            onChangeText={this.handleChange('password')}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.signUpContainer}
              onPress={() => this.props.navigation.navigate('SignUp')}>
              <Text style={styles.signUpText}>SIGN UP</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.loginContainter}
              onPress={this.submitForm}>
              <Text style={styles.loginText}>LOG IN</Text>
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
  mainHeading: {
    fontSize: 48,
    marginTop: 80,
    marginLeft: 24,
    fontWeight: 'bold',
    color: '#679AC6',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: '90%',
    height: 50,
    marginTop: 70,
  },
  loginContainter: {
    backgroundColor: '#62B491',
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    elevation: 5

  },
  loginText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  signUpContainer: {
    backgroundColor: '#679AC6',
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    elevation: 5

  },
  signUpText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
});
