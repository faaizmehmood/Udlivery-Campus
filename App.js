import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {firebaseprovider} from './src/Provider/FirebaseProvider';
import Stacknav from './src/Provider/Routenavigation';
import {AppProvider, AppConsumer} from './src/Provider/context/AppProvider';
import {mediaprovider} from './src/Provider/Mediaprovider/Mediaprovider';
import {LogBox} from 'react-native';
import OneSignal from 'react-native-onesignal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {config} from './src/Provider/configProvider';

// Ignore all log notifications:
LogBox.ignoreAllLogs();

global.MapAddress = 'NA';
global.mediaprovider = mediaprovider;
console.disableYellowBox = true;

class App extends Component {
  async componentDidMount() {
    /* O N E S I G N A L   S E T U P */
    OneSignal.setAppId('fbbae85c-dfc8-46e8-8a60-162bbba8b330');

    // promptForPushNotificationsWithUserResponse will show the native iOS or Android notification permission prompt.
    // We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step 8)
    OneSignal.promptForPushNotificationsWithUserResponse();

    //Method for handling notifications received while app in foreground
    OneSignal.setNotificationWillShowInForegroundHandler(
      notificationReceivedEvent => {
        console.log(
          'OneSignal: notification will show in foreground:',
          notificationReceivedEvent,
        );
        let notification = notificationReceivedEvent.getNotification();
        console.log('notification: ', notification);
        const data = notification.additionalData;
        console.log('additionalData: ', data);
        // Complete with null means don't show a notification.
        notificationReceivedEvent.complete(notification);
      },
    );

    config.playerID = await AsyncStorage.getItem('player_id');
    let intervalCount = 0;
    let playerIdTime = setInterval(async () => {
      var state = await OneSignal.getDeviceState();
      config.playerID = state?.userId;
      intervalCount++;

      if (state?.userId || (intervalCount > 5 && config.playerID)) {
        clearInterval(playerIdTime);
        AsyncStorage.setItem('player_id', config.playerID);
      }

      console.log('coming from App.js file pl==>', config.playerID);
      // console.log('coming from App.js file pl==> (get state)', state?.userId);
    }, 100);

    firebaseprovider.getAllUsers();
  }

  render() {
    return (
      <NavigationContainer>
        <AppProvider {...this.props}>
          <AppConsumer>
            {funcs => {
              global.props = {...funcs};
              return <Stacknav {...funcs} />;
            }}
          </AppConsumer>
        </AppProvider>
      </NavigationContainer>
    );
  }
}

export default App;
