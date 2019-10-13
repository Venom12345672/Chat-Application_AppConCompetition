import React from 'react';
import {View, TouchableOpacity, Text, SafeAreaView} from 'react-native';
import styles from './constants/styles';

export default class LandingScreen extends React.Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('SignUp')}>
          <Text style={styles.btn}>SignUp</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Login')}>
          <Text style={styles.btn}>Login</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}
