/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import PushNotification from 'react-native-push-notification';

try {
  PushNotification.configure({});

  PushNotification.createChannel(
    {
      channelId: 'default', // Channel ID
      channelName: 'Default Notification Channel', // Channel Name
    },
    created => console.log(`Channel created: ${created}`),
  );
} catch (error) {
  console.log('error from index.js: :::::::', error);
}

AppRegistry.registerComponent(appName, () => App);
