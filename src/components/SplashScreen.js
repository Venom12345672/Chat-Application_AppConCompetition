import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Image,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

export default class SplashScreen extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      this.setTimePassed();
    }, 2000);
  }
  setTimePassed() {
    this.props.navigation.navigate('AuthLoading');
  }
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          style={styles.backgorundImage}
          source={require('../assets/wallpaper1.png')}>
          <View
            animation="slideInRight"
            style={{
              width: '90%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              flexDirection: 'row',
            }}>
            <Animatable.View animation="slideInLeft">
              <Text
                style={{fontSize: 40, color: '#679AC6', fontWeight: 'bold'}}>
                C O N{' '} 
              </Text>
            </Animatable.View>
            <Animatable.View>
              <Text
                style={{fontSize: 40, color: '#679AC6', fontWeight: 'bold'}}>
                N{' '}
              </Text>
            </Animatable.View>
            <Animatable.View animation="slideInRight">
              <Text
                style={{fontSize: 40, color: '#679AC6', fontWeight: 'bold'}}>
                E C T
              </Text>
            </Animatable.View>
            <Animatable.View animation="slideInUp">
              <Text
                style={{fontSize: 40, color: '#679AC6', fontWeight: 'bold'}}>
                .
              </Text>
            </Animatable.View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgorundImage: {width: '100%', height: '100%'},
});
