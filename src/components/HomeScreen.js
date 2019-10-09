import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  AsyncStorage,
  FlatList,
} from 'react-native';
import User from '../User';
import styles from './constants/styles';
import firebase from 'firebase';
export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Chats',
  };

  state = {
    users: [],
  };
  componentWillMount() {
    let dbRef = firebase.database().ref('users');
    dbRef.on('child_added', val => {
      let person = val.val();
      person.username = val.key;
      this.setState(prevState => {
        return {
          users: [...prevState.users, person],
        };
      });
    });
  }
  logoutHandler = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
  renderRow = ({item}) => {
    return (
      <TouchableOpacity>
        <Text>{item.name}</Text>
      </TouchableOpacity>
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.logoutHandler}>
          <Text>Hi</Text>
        </TouchableOpacity>

        <FlatList
          data={this.state.users}
          renderItem={this.renderRow}
          keyExtractor={item => item.username}
        />
      </View>
    );
  }
}
