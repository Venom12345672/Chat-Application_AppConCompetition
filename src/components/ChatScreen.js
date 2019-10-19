import React from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import PubNubReact from 'pubnub-react';
import User from '../User';
import ImagePicker from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
 var RNFS = require('react-native-fs');

import {
  View,
  TouchableOpacity,
  Image,
  ToastAndroid,
  StyleSheet,
  Text,
  Vibration,
} from 'react-native';
import firebase from 'firebase';
const DURATION = 100;

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
      secretKey: 'sec-c-MDE2ODIyYWMtYzljNC00NGQ4LTk0ODYtOTg1YjZiYjliMTE3',
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

    // this.pubnub.deleteMessages(
    //   {
    //     channel: 'hamzah123minhal123',
    //   },
    //   result => {
    //     console.log(this.state.currentChannel);
    //     console.log(result);
    //   },
    // );
    this.pubnub.subscribe({
      channels: [this.state.currentChannel],
      withPresence: true,
    });

    this.pubnub.history(
      {
        channel: this.state.currentChannel,
        reverse: true,
        count: 50,
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
      Vibration.vibrate(DURATION);

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
    console.log(messages);
    this.pubnub.publish(
      {
        message: {
          pn_gcm: {
            data: {message: `${User.username}: ${messages[0].text}`},
          },
        },
        channel: this.state.person.username,
      },
      status => {
        console.log(User.name);
      },
    );
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
    const response = await fetch(uri);
    const blob = await response.blob();
    console.log(uri);
    let m = [
      {
        _id: 1,
        text: `${name} attached \n (Long Press the message bubble to download it)`,
        createdAt: new Date(),
        user: {
          _id: User.username,
          name: User.username,
        },
        image: uri,
        fileName: name,
        type: 'image',
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
  handleDocument = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log(res, 'BAIG');
      const response = await fetch(res.uri);
      const blob = await response.blob();
      let m = [
        {
          _id: 1,
          text: `${res.name} attached \n (Long Press the message bubble to download it)`,
          createdAt: new Date(),
          user: {
            _id: User.username,
            name: User.username,
          },
          fileName: res.name,
          type: 'file',
        },
      ];
      this.onSend(m);
      ToastAndroid.show('Sending File...', ToastAndroid.SHORT);
      var ref = firebase
        .storage()
        .ref()
        .child(this.state.currentChannel + '/' + res.name)
        .put(blob)
        .then(result => {
          ToastAndroid.show('File Sent...', ToastAndroid.SHORT);
        })
        .catch(() => {
          ToastAndroid.show(
            'Failed. Please Try again later...',
            ToastAndroid.SHORT,
          );
        });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
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

        <TouchableOpacity onPress={this.handleDocument}>
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
  longPress = async (context, message) => {
    if (message.fileName) {
      Vibration.vibrate(DURATION);
      ToastAndroid.show('Downloading...', ToastAndroid.SHORT);
      await RNFS.mkdir(`/storage/emulated/0/FirebaseChatDownloads`)
        .then(() => {})
        .catch(err => {
          console.log(err);
        });
      const ref = firebase
        .storage()
        .ref(`${this.state.currentChannel}/${message.fileName}`);
      const url = await ref.getDownloadURL();
      const response = await fetch(url);
      const DownloadFileOptions = {
        fromUrl: url,
        toFile: `/storage/emulated/0/FirebaseChatDownloads/${message.fileName}`,
      };
      const {jobId, promise} = await RNFS.downloadFile(DownloadFileOptions);
      promise.then(result => {
        console.log(result);
        ToastAndroid.show('Download Compelete...', ToastAndroid.SHORT);
      });
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          renderActions={this.renderCustomActions}
          user={{
            _id: User.username,
            name: User.username,
          }}
          alwaysShowSend={true}
          onLongPress={(context, message) => this.longPress(context, message)}
        />
      </View>
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
