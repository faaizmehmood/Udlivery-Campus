import React, {Component} from 'react';
import {Text, View, Image, StyleSheet, StatusBar} from 'react-native';
import {Dimensions} from 'react-native';
import {
  config,
  msgProvider,
  localStorage,
  apifuntion,
  msgText,
  msgTitle,
  consolepro,
  Font,
  Colors,
  mobileH,
  mobileW,
  localimag,
} from './utilslib/Utils';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import OneSignal from 'react-native-onesignal';
import AsyncStorage from '@react-native-async-storage/async-storage';

global.content_arr = 'NA';
global.guest_user = 0;
export default class Splash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      player_id: '',
    };
  }

  getOneSignalDeviceID = () => {
    // setTimeout(async () => {
    //   var state = await OneSignal.getDeviceState();
    //   this.setState({
    //     player_id: state?.userId,
    //   });
    //   player_id_me1 = this.state.player_id;
    //   console.log('pl in Second Splash ==>', player_id_me1);
    //   AsyncStorage.setItem('player_id', player_id_me1);
    // }, 2000);
  };

  async componentDidMount() {
    // firebaseprovider.getAllUsers()

    OneSignal.setInAppMessageClickHandler(event => {
      this.OSLog('OneSignal IAM clicked:', event);
    });
    OneSignal.addEmailSubscriptionObserver(event => {
      this.OSLog('OneSignal: email subscription changed: ', event);
    });
    OneSignal.addSubscriptionObserver(event => {
      this.OSLog('OneSignal: subscription changed:', event);
      this.setState({isSubscribed: event.to.isSubscribed});
    });
    OneSignal.addPermissionObserver(event => {
      this.OSLog('OneSignal: permission changed:', event);
    });

    this.getOneSignalDeviceID();

    let item = await AsyncStorage?.getItem('language_change');
    consolepro.consolelog('item12', item);
    const timer = setTimeout(() => {
      if (item == 1) {
        localStorage.setItemObject('language_change', 0);
      } else {
        consolepro.consolelog('item11', item);

        this.authenticateSession();
      }
    }, 2000);
    return () => clearTimeout(timer);
  }

  OSLog = (message, optionalArg) => {
    consolepro.consolelog({message});
    if (optionalArg) {
      message = message + JSON.stringify(optionalArg);
    }

    //console.log(message.notificationId);

    let consoleValue;

    if (this.state.consoleValue) {
      consoleValue = this.state.consoleValue + '\n' + message;
    } else {
      consoleValue = message;
    }
    this.setState({consoleValue});
  };

  componentWillUnmount() {
    // OneSignal.removeEventListener('ids', this.onIds.bind(this));
    // OneSignal.removeEventListener('opened', this.onOpened);
  }

  authenticateSession = async () => {
    setTimeout(async () => {
      let a = await AsyncStorage.getItem('player_id');
      console.log('This is player_id  in Second Splash a:', a);
    }, 2000);

    let user_details = await localStorage.setItemObject(
      'user_arr',
      user_details,
    );

    if (user_details != null) {
      if (user_details.user_type == 1) {
        this.props.navigation.navigate('Home');
      } else if (user_details.user_type == 2) {
        this.props.navigation.navigate('Driver_Home');
      }
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          hidden={false}
          backgroundColor={Colors.Red1}
          translucent={false}
          networkActivityIndicatorVisible={true}
          barStyle="light-content"
        />

        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            resizeMode="contain"
            style={styles.logo}
            source={localimag.splash}></Image>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: Colors.white_color
  },

  logo: {
    height: mobileH,
    width: mobileW,
  },
});
