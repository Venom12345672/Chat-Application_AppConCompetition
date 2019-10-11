import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  AsyncStorage,
  FlatList,
} from 'react-native';
import User from '../User';
import firebase from 'firebase';
export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Chats',
  };

  state = {
    users: [],
  };
  componentWillMount() {
    let dbRef = firebase.database().ref('users/' + User.username+'/friends/');
    dbRef.on('child_added',val => {
      let person = val.val()
      //person.username = val.username
      if (person.username == User.username) {
        //User.name = person.name
      } else {
        this.setState(prevState => {
          return {
            users: [...prevState.users,person]
          }
        })
      }
    })

  }
  logoutHandler = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
  renderRow = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('ChatScreen', item)}
        style={{padding: 10, borderBottomColor: '#ccc', borderBottomWidth: 1}}>
        <Text style={{fontSize: 20}}>{item.name}</Text>
      </TouchableOpacity>
    );
  };
  render() {
    return (
      <SafeAreaView>
        <TouchableOpacity onPress={this.logoutHandler}>
          <Text>Logout</Text>
        </TouchableOpacity>

        <FlatList
          data={this.state.users}
          renderItem={this.renderRow}
          keyExtractor={item => item.username}
        />
      </SafeAreaView>
    );
  }
}
