import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ToastAndroid,
} from 'react-native';
import firebase from 'firebase';
var RNFS = require('react-native-fs');

export default class DownloadsList extends Component {
  render() {
    const {files} = this.props;

    return (
      <View>
        <FlatList
          data={files}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      </View>
    );
  }

  renderItem = ({item}) => {
    return (
      <View style={styles.listItem}>
        <View style={styles.filenameContainer}>
          {item.type == 'image' && (
            <Image
              style={styles.image}
              source={{uri: item.link}}
              resizeMode={'contain'}
            />
          )}
          
          {item.type != 'image' && (
           <Text>Hamzah</Text>
          )}

          <Text style={styles.filename}>{item.name.substr(0, 20)}...</Text>
        </View>

        <TouchableOpacity onPress={() => this.handler(item.name, item.link)}>
          <View style={[styles.buttonContainer, styles.buttonDownload]}>
            <Image
              source={require('../assets/download.png')}
              style={{width: 25, height: 25}}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  handler = (n, l) => {
    this.download(n, l);
  };
  download = async (n, l) => {
    ToastAndroid.show('Downloading...', ToastAndroid.SHORT);

    await RNFS.mkdir(`/storage/emulated/0/FirebaseChatDownloads`)
      .then(() => {})
      .catch(err => {
        console.log(err);
      });
    const ref = firebase.storage().ref(`${this.props.path}/${n}`);
    const url = await ref.getDownloadURL();
    const response = await fetch(url);
    const DownloadFileOptions = {
      fromUrl: url,
      toFile: `/storage/emulated/0/FirebaseChatDownloads/${n}`,
    };
    const {jobId, promise} = await RNFS.downloadFile(DownloadFileOptions);
    promise.then(result => {
      console.log(result);
      ToastAndroid.show('Download Compelete...', ToastAndroid.SHORT);
    });
  };
}

const styles = {
  list: {
    justifyContent: 'center',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  filenameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filename: {
    paddingLeft: 10,
  },
  image: {
    width: 50,
    height: 50,
  },
  buttonContainer: {
    padding: 10,
  },
  buttonDownload: {
    alignSelf: 'center',
  },
};
