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
  state = {
    firstHalf: false,
    secondHalf: false,
  };
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        firstHalf: true,
      });
    }, 1000);

    setTimeout(() => {
      this.setTimePassed();
    }, 2500);
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
            {this.state.firstHalf ? (
              <Animatable.View animation="slideInLeft">
                <Text
                  style={{fontSize: 45, color: '#679AC6', fontWeight: 'bold'}}>
                  C O N
                </Text>
              </Animatable.View>
            ) : null}

            <Animatable.View>
              <Text
                style={{fontSize: 45, color: '#679AC6', fontWeight: 'bold'}}>
                {' '}
                N{' '}
              </Text>
            </Animatable.View>
            {this.state.firstHalf ? (
              <Animatable.View animation="slideInRight">
                <Text
                  style={{fontSize: 45, color: '#679AC6', fontWeight: 'bold'}}>
                  E C T
                </Text>
              </Animatable.View>
            ) : null}
            {this.state.firstHalf ? (
              <Animatable.View animation="slideInUp">
                <Text
                  style={{fontSize: 45, color: '#679AC6', fontWeight: 'bold'}}>
                  .
                </Text>
              </Animatable.View>
            ) : null}
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
