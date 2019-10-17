import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import styles from './constants/styles';
import ImagePicker from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import firebase from 'firebase';
import {PermissionsAndroid} from 'react-native';

var RNFS = require('react-native-fs');
const dirs = RNFS.dirs;
export default class ChatScreen extends React.Component {
  state = {
    url: null,
  };
  handleChoosePhoto = () => {
    const options = {noData: true};
    ImagePicker.launchImageLibrary(options, response => {
      this.uploadImage(response.uri, 'test-image').then(result => {
        alert('Success');
      });
    });
  };

  uploadImage = async (uri, name) => {
    console.log(uri, name);
    const response = await fetch(uri);
    const blob = await response.blob();
    var ref = firebase
      .storage()
      .ref()
      .child('images/' + name);
    return ref.put(blob);
  };

  download = async () => {
    this.requestCameraPermission();
    this.requestCameraPermission1();
    // write the file
    await RNFS.mkdir(`/storage/emulated/0/TEMPP`)
      .then(() => {
        alert('Success');
      })
      .catch(err => {
        console.log(err);
      });

    // RNFS.readDir(RNFS.DocumentDirectoryPath)
    //   .then(files => {
    //     files.forEach(x => {
    //       console.log(x.isDirectory());
    //     });
    //   })
    //   .catch(err => {
    //     console.log(err.message, err.code);
    //   });
    // console.log(p);
    const ref = firebase.storage().ref('documents/7.pdf');
    const url = await ref.getDownloadURL();
    const response = await fetch(url);
    text = await response.text();
    const DownloadFileOptions = {
      fromUrl: url,
      toFile: `/storage/emulated/0/TEMPP/test-image.pdf`,
    };
    const {jobId, promise} = await RNFS.downloadFile(DownloadFileOptions);
    promise.then(result => {
      console.log(result);
    });
  };
  requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  requestCameraPermission1 = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  handleDocument = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log(res);
      const response = await fetch(res.uri);
      const blob = await response.blob();
      var ref = firebase
        .storage()
        .ref()
        .child('documents/test-pdf')
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
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.handleChoosePhoto}>
          <Text style={styles.btn}>Choose Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.handleDocument}>
          <Text style={styles.btn}>Choose Document</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.download}>
          <Text style={styles.btn}>Download</Text>
        </TouchableOpacity>
        <Image
          style={{height: 100, width: 200}}
          source={{uri: this.state.url}}
        />
      </View>
    );
  }
}
