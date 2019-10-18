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
import DocumentPicker from 'react-native-document-picker';
import DownloadsModal from './DownloadsModal';
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
      files: [],
      is_modal_visible: false,
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
  viewFiles = async () => {
    this.setState({
      is_modal_visible: true,
    });
  };
  closeModal = () => {
    this.setState({
      is_modal_visible: false,
    });
  };
  send = async messages => {
    for (let i = 0; i < messages.length; i++) {
      let {text, user} = messages[i];
      let message = {_id: 1, text, user};
      await firebase
        .database()
        .ref('messages')
        .child(User.username)
        .child(this.state.person.username)
        .push(message);
      user._id = 1;
      const message2 = {_id: 2, text, user};
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
    console.log("HAM HERE")
    firebase
      .database()
      .ref('messages')
      .child(User.username)
      .child(this.state.person.username)
      .on('child_added', snapshot => {
        console.log(snapshot)
        message = this.parse(snapshot);
        console.log(message)
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
    this.setState(prevState => ({
      files: prevState.files.concat({
        name: name,
        link: uri,
        type: 'image',
        id: 1,
      }),
    }));
    const response = await fetch(uri);
    const blob = await response.blob();
    let m = {
      _id: 1,
      text: 'Image Attached',
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

  handleDocument = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log(res);
      const response = await fetch(res.uri);
      const blob = await response.blob();
      this.setState(prevState => ({
        files: prevState.files.concat({
          name: res.name,
          link: res.uri,
          type: 'file',
          id: 1,
        }),
      }));
      var ref = firebase
        .storage()
        .ref()
        .child('documents/' + res.name)
        .put(blob)
        .then(() => {
          alert('Success');
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
        <TouchableOpacity onPress={this.viewFiles}>
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
      <View style={styles.container}>
        <GiftedChat
          messages={this.state.messageList}
          onSend={this.send}
          user={this.user}
          showUserAvatar={true}
          renderActions={this.renderCustomActions}
        />

        <DownloadsModal
          is_visible={this.state.is_modal_visible}
          files={this.state.files}
          closeModal={this.closeModal}
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
