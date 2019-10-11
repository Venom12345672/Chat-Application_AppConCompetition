// import React from 'react';
// import {View, Text} from 'react-native';
// import PushNotificationIOS from 'react-native';
// import PubNubReact from 'pubnub-react';
// var PushNotification = require('react-native-push-notification');
// export default class HomeScreen extends React.Component {
//   constructor(props) {
//     super(props);
//     this.pubnub = new PubNubReact({
//       publishKey: 'pub-c-1a256bc0-f516-4140-83e1-2cd02f72e19b',
//       subscribeKey: 'sub-c-1a959da8-ebfb-11e9-ad72-8e6732c0d56b',
//     });
//     this.pubnub.init(this);
//     PushNotification.configure({
//       // Called when Token is generated.
//       onRegister: function(token) {
//         console.log('TOKEN:', token);
//         if (token.os == 'ios') {
//           this.pubnub.push.addChannels({
//             channels: ['notifications'],
//             device: token.token,
//             pushGateway: 'apns',
//           });
//           // Send iOS Notification from debug console: {"pn_apns":{"aps":{"alert":"Hello World."}}}
//         } else if (token.os == 'android') {
//           this.pubnub.push.addChannels({
//             channels: ['notifications'],
//             device: token.token,
//             pushGateway: 'gcm', // apns, gcm, mpns
//           });
//           // Send Android Notification from debug console:
//         }
//       }.bind(this),
//       // Something not working?
//       // See: https://support.pubnub.com/support/solutions/articles/14000043605-how-can-i-troubleshoot-my-push-notification-issues-
//       // Called when a remote or local notification is opened or received.
//       onNotification: function(notification) {
//         console.log('NOTIFICATION:', notification);
//         // Do something with the notification.
//         // Required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
//         // notification.finish(PushNotificationIOS.FetchResult.NoData);
//       },
//       // ANDROID: GCM or FCM Sender ID
//       senderID: '168500823310',
//     });
//   }
  
 
//   render() {
//     return (
//       <View>
//         <Text>HamahBaig</Text>
//       </View>
//     );
//   }
// }
