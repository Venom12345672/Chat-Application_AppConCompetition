import React, {Component} from 'react';
import {Modal, View, Text, TouchableOpacity, Image} from 'react-native';
import DownloadsList from './DownloadsList';

const DownloadsModal = ({is_visible, files, closeModal, path}) => {
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={is_visible}
      onRequestClose={() => {
        console.log(files);
        console.log('modal closed');
      }}>
      <View style={styles.modalContainer}>
        <View style={styles.modalMain}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderText}>Files</Text>
            <TouchableOpacity onPress={closeModal}>
              <Image
                source={require('../assets/close.png')}
                style={{width: 25, height: 25}}
              />
            </TouchableOpacity>
          </View>

          <DownloadsList files={files} path={path} />
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  modalContainer: {
    marginTop: 22,
  },
  modalMain: {
    padding: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  modalHeaderText: {
    fontSize: 20,
  },
};

export default DownloadsModal;
