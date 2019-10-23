import React from 'react';
import {
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  View,
  ImageBackground,
  Image,
} from 'react-native';
import User from '../User';
import firebase from 'firebase';
import * as Animatable from 'react-native-animatable';

export default class Friends extends React.Component {
  state = {
    users: [],
  };
  async componentDidMount() {
    let friend = {};
    let dbRef = await firebase
      .database()
      .ref('users/' + User.username + '/friends/');
    dbRef.on('child_added', async val => {
      let person = val.val();
      friend['active'] = person.active;
      await firebase
        .database()
        .ref('users/' + person.username)
        .once('value', snapshot => {
          let value = snapshot.val();
          friend['name'] = value.name;
          friend['username'] = value.username;
          friend['profileLink'] = value.profileLink;
          User.friends[person.username] = friend;
          if (friend.username == User.username) {
            //User.name = person.name
          } else {
            this.setState(prevState => {
              return {
                users: [...prevState.users, friend],
              };
            });
          }
          friend = {};
        });
    });

    
  }
  renderRow = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('ChatScreen', item)}
        style={{marginTop: 20, flexDirection: 'row', alignItems: 'center'}}>
        <Image
          source={
            item.profileLink == 'NaN'
              ? require('../assets/NaN.png')
              : {uri: item.profileLink}
          }
          style={styles.userPhoto}></Image>
        <View>
          <Text style={{fontSize: 20, marginLeft: 15, color: '#679AC6'}}>
            {item.name}
          </Text>
          <Text style={{fontSize: 14, marginLeft: 15, color: 'rgba(0,0,0,0.7)'}}>
            {item.username}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('../assets/wallpaper1.png')}
          style={styles.backgorundImage}>
          <View style={styles.backButtonContainer}>
            <Animatable.View
              animation="slideInLeft"
              style={{
                width: 35,
              }}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Home')}>
                <Image
                  source={require('../assets/back.png')}
                  style={{width: 25, height: 25, borderRadius: 100}}></Image>
              </TouchableOpacity>
            </Animatable.View>
            <Text style={styles.mainHeading}>Friends</Text>
          </View>
          <FlatList
            style={{marginTop: 20}}
            data={this.state.users}
            renderItem={this.renderRow}
            keyExtractor={item => item.username}
          />
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButtonContainer: {
    width: '90%',
    height: 50,
    alignSelf: 'center',
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainHeading: {
    marginLeft: 10,
    fontSize: 30,
    fontWeight: 'bold',
    color: '#679AC6',
  },
  backgorundImage: {width: '100%', height: '100%'},
  subContainer: {
    width: '90%',
    height: 35,
    alignSelf: 'center',
    marginTop: 20,
    flexDirection: 'row-reverse',
  },
  profileViewContainer: {
    width: 100,
    height: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 30,
    borderWidth: 1.2,
    borderColor: '#679AC6',
  },
  profilePhoto: {
    width: 30,
    height: 30,
    borderRadius: 100,
    marginLeft: 2,
  },
  userPhoto: {
    height: 45,
    width: 45,
    borderRadius: 100,
    marginLeft: 15,
  },
});
