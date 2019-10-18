import React from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import PubNubReact from 'pubnub-react';
import User from '../User';
import ImagePicker from 'react-native-image-picker';
import {
  View,
  TouchableOpacity,
  Image,
  ToastAndroid,
  StyleSheet,
} from 'react-native';
import firebase from 'firebase';
export default class ChatScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      textMessage: [],
      person: {
        name: props.navigation.getParam('name'),
        username: props.navigation.getParam('username'),
      },
      currentChannel: '',
    };
    this.pubnub = new PubNubReact({
      publishKey: 'pub-c-1a256bc0-f516-4140-83e1-2cd02f72e19b',
      subscribeKey: 'sub-c-1a959da8-ebfb-11e9-ad72-8e6732c0d56b',
    });
    this.pubnub.init(this);
    this.id = this.randomid();
  }

  async componentDidMount() {
    var ref = await firebase.database().ref(`/users/${User.username}/friends`);
    await ref
      .orderByChild('username')
      .equalTo(this.state.person.username)
      .once('value')
      .then(snapshot => {
        if (snapshot.val()) {
          snapshot.forEach(x => {
            x = x.toJSON();
            this.setState({
              currentChannel: x.channelKey,
            });
          });
        }
      });
    this.pubnub.subscribe({
      channels: [this.state.currentChannel],
      withPresence: true,
    });

    this.pubnub.history(
      {
        channel: this.state.currentChannel,
        reverse: true,
        count: 15,
      },
      (status, res) => {
        let newmessage = [];
        res.messages.forEach(function(element, index) {
          newmessage[index] = element.entry[0];
        });
        this.setState(previousState => ({
          messages: GiftedChat.append(
            previousState.messages,
            newmessage.reverse(),
          ),
        }));
      },
    );

    this.pubnub.getMessage(this.state.currentChannel, msg => {
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, msg['message']),
      }));
    });
  }

  componentWillUnmount() {
    this.pubnub.unsubscribe({
      channels: [this.state.currentChannel],
    });
  }

  onSend(messages = []) {
    this.pubnub.publish({
      message: messages,
      channel: this.state.currentChannel,
    });
  }
  randomid = () => {
    return Math.floor(Math.random() * 100);
  };
  handleChoosePhoto = () => {
    const options = {noData: true};
    ImagePicker.launchImageLibrary(options, response => {
      this.uploadImage(response.uri, response.fileName)
        .then(result => {
          ToastAndroid.show('Image Sent...', ToastAndroid.SHORT);
        })
        .catch(() => {
          ToastAndroid.show(
            'Failed. Please Try again later...',
            ToastAndroid.SHORT,
          );
        });
    });
  };

  uploadImage = async (uri, name) => {
    console.log(uri, name);
    // this.setState(prevState => ({
    //   files: prevState.files.concat({
    //     name: name,
    //     link: uri,
    //     type: 'image',
    //     id: 1,
    //   }),
    // }));
    const response = await fetch(uri);
    const blob = await response.blob();
    m = [
      {
        _id: 1,
        text: 'Image Attached',
        createdAt: new Date(),
        user: {
          _id: User.username,
          name: User.username,
        },
        image: uri,
      },
    ];
    this.onSend(m);
    ToastAndroid.show('Sending Image...', ToastAndroid.SHORT);
    var ref = firebase
      .storage()
      .ref()
      .child(this.state.currentChannel + '/' + name);

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
      </View>
    );
  };

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        renderActions={this.renderCustomActions}
        user={{
          _id: User.username,
          name: User.username,
        }}
        alwaysShowSend = {true}
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
