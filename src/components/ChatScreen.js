import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import styles from './constants/styles';
import {TextInput, FlatList} from 'react-native-gesture-handler';
import User from '../User';
import firebase from 'firebase';
export default class ChatScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.getParam('name', null),
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      person: {
        name: props.navigation.getParam('name'),
        username: props.navigation.getParam('username'),
      },
      textMessage: '',
      messageList: [],
    };
  }
  componentWillMount() {
    firebase
      .database()
      .ref('messages')
      .child(User.username)
      .child(this.state.person.username)
      .on('child_added', value => {
        this.setState(prevState => {
          return {
            messageList: [...prevState.messageList, value.val()],
          };
        });
      });
  }
  handleChange = key => val => {
    this.setState({[key]: val});
  };
  sendMessage = async () => {
    if (this.state.textMessage.length > 0) {
      let msgId = firebase
        .database()
        .ref('messages')
        .child(User.username)
        .child(this.state.person.username)
        .push().key;
      let updates = {};
      let message = {
        message: this.state.textMessage,
        time: firebase.database.ServerValue.TIMESTAMP,
        from: User.username,
      };
      updates[
        'messages/' +
          User.username +
          '/' +
          this.state.person.username +
          '/' +
          msgId
      ] = message;
      updates[
        'messages/' +
          this.state.person.username +
          '/' +
          User.username +
          '/' +
          msgId
      ] = message;
      firebase
        .database()
        .ref()
        .update(updates);
      this.setState({textMessage: ''});
    }
  };
  renderRow = ({item}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          width: '60%',
          alignSelf: item.from == User.username ? 'flex-end' : 'flex-start',
          backgroundColor: item.from == User.username ? '#00897b' : '#7cb342',
          borderRadius: 5,
          marginBottom: 10,
        }}>
        <Text style={{color: '#fff', padding: 7, fontSize: 16}}>
          {item.message}
        </Text>
        <Text style={{color: '#eee', padding: 3, fontSize: 12}}>item.time</Text>
      </View>
    );
  };
  render() {
    let {height, width} = Dimensions.get('window');
    return (
      <SafeAreaView>
        <FlatList
          style={{padding: 10, height: height * 0.8}}
          data={this.state.messageList}
          renderItem={this.renderRow}
          keyExtractor={(item, index) => index.toString()}
        />

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TextInput
            style={styles.input}
            value={this.state.textMessage}
            placeholder="Type message..."
            onChangeText={this.handleChange('textMessage')}
          />
          <TouchableOpacity onPress={this.sendMessage}>
            <Text style={styles.btn}>Send</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}
