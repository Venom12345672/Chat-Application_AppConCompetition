import React from 'react';
import {
  Text,
  ActivityIndicator,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {GiftedChat, Send} from 'react-native-gifted-chat';
import PubNubReact from 'pubnub-react';
import firebase from 'firebase';
import User from '../User';
import ImagePicker from 'react-native-image-picker';

export default class ChatScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.getParam('name', null),
    };
  };
  constructor(props) {
    super(props);
    this.pubnub = new PubNubReact({
      publishKey: 'pub-c-1a256bc0-f516-4140-83e1-2cd02f72e19b',
      subscribeKey: 'sub-c-1a959da8-ebfb-11e9-ad72-8e6732c0d56b',
    });
    this.pubnub.init(this);
    this.state = {
      person: {
        name: props.navigation.getParam('name'),
        username: props.navigation.getParam('username'),
      },
      messageList: [],
      fileName: '',
    };
  }

  parse = snapshot => {
    const {text, createdAt, user} = snapshot.val();
    const {key: _id} = snapshot;
    const message = {_id, text, createdAt, user};
    return message;
  };

  get user() {
    return {
      name: 'hamzah baig',
      email: 'hamzahbaigi8@yahoo.com',
      avatar: 'https://placeimg.com/140/140/any',
      _id: 2,
    };
  }

  send = async messages => {
    for (let i = 0; i < messages.length; i++) {
      let {text, user} = messages[i];
      timeStamp = new Date().toString();
      let message = {_id: 1, text, createdAt: timeStamp, user};
      await firebase
        .database()
        .ref('messages')
        .child(User.username)
        .child(this.state.person.username)
        .push(message);
      user._id = 1;
      const message2 = {_id: 2, text, createdAt: timeStamp, user};
      await firebase
        .database()
        .ref('messages')
        .child(this.state.person.username)
        .child(User.username)
        .push(message2);
      this.pubnub.publish(
        {
          message: {
            pn_gcm: {
              data: {message: `${User.username}: ${text}`},
            },
          },
          channel: this.state.person.username,
        },
        status => {
          console.log(User.name);
        },
      );
    }
  };

  componentDidMount() {
    firebase
      .database()
      .ref('messages')
      .child(User.username)
      .child(this.state.person.username)
      .on('child_added', snapshot => {
        message = this.parse(snapshot);
        this.setState(previousState => ({
          messageList: GiftedChat.append(previousState.messageList, message),
        }));
      });
  }
  get avatar() {
    return {
      avatar: 'https://placeimg.com/140/140/any',
    };
  }

  handleChoosePhoto = () => {
    const options = {noData: true};
    ImagePicker.launchImageLibrary(options, response => {
      this.uploadImage(response.uri, response.fileName).then(result => {
        alert('Success');
      });
    });
  };

  uploadImage = async (uri, name) => {
    console.log(uri, name);
    const response = await fetch(uri);
    const blob = await response.blob();
    let m = {
      _id: 1,
      text: 'My message',
      createdAt: new Date(Date.UTC(2016, 5, 11, 17, 20, 0)),
      user: {
        _id: 2,
        name: 'React Native',
        avatar: 'https://facebook.github.io/react/img/logo_og.png',
      },
      image: uri,
    };
    this.setState(previousState => ({
      messageList: GiftedChat.append(previousState.messageList, m),
    }));
    var ref = firebase
      .storage()
      .ref()
      .child('images/' + name);
    return ref.put(blob);
  };

  renderCustomActions = () => {
    return (
      <View style={styles.customActionsContainer}>
        <TouchableOpacity onPress={this.handleChoosePhoto}>
          <View style={styles.buttonContainer}>
            <Image
              source={require('../assets/photo.png')}
              style={{width: 25, height: 25}}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity>
          <View style={styles.buttonContainer}>
            <Image
              source={require('../assets/attachment.png')}
              style={{width: 25, height: 25}}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  render() {
    return (
      <GiftedChat
        messages={this.state.messageList}
        onSend={this.send}
        user={this.user}
        showUserAvatar={true}
        renderActions={this.renderCustomActions}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    padding: 10,
  },
  customActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loader: {
    paddingTop: 20,
  },
  sendLoader: {
    marginRight: 10,
    marginBottom: 10,
  },
});
