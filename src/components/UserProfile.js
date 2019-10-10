import React from 'react';
import {View, Text} from 'react-native';
import styles from './constants/styles';

export default class UserProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           seacrhedUser : props.navigation.state.params
        } 
      }
  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state.seacrhedUser.name}</Text>
      </View>
    );
  }
}
