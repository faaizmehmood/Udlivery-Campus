import {
  Text,
  View,
  ImageBackground,
  Image,
  TextInput,
  Dimensions,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import React, {Component} from 'react';
const MobileW = Dimensions.get('window').width;
const MobileH = Dimensions.get('window').height;
import {
  config,
  msgProvider,
  localStorage,
  apifuntion,
  msgText,
  msgTitle,
  consolepro,
  Lang_chg,
  Font,
  Colors,
  mobileH,
  mobileW,
  localimag,
  firebaseprovider,
} from './Provider/utilslib/Utils';
import OneSignal from 'react-native-onesignal';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ----------------------------------- Page--------------------------------
global.guest_user = 0;
export default class Splash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      player_id: '',
    };
    console.log('starting the app v1 from Splash');
  }

  async componentDidMount() {
    firebaseprovider.getAllUsers();
    OneSignal.setInAppMessageClickHandler(event => {
      this.OSLog('OneSignal IAM clicked:', event);
    });
    OneSignal.addEmailSubscriptionObserver(event => {
      this.OSLog('OneSignal: email subscription changed: ', event);
    });
    OneSignal.addSubscriptionObserver(event => {
      this.OSLog('OneSignal: subscription changed:', event);
    });
    OneSignal.addPermissionObserver(event => {
      this.OSLog('OneSignal: permission changed:', event);
    });

    var item = await AsyncStorage?.getItem('language_change');
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

    console.log(message.notificationId);

    let consoleValue;

    if (this.state.consoleValue) {
      consoleValue = this.state.consoleValue + '\n' + message;
    } else {
      consoleValue = message;
    }
    this.setState({consoleValue});
  };

  authenticateSession = async () => {
    try {
      var goto_page = await localStorage.getItemString('page');
      let result = await localStorage.getItemObject('user_arr');

      if (result != null) {
        if (result.login_type == 'app') {
          let password = await localStorage.getItemString('password');
          var user_type = result.user_type;
          var var1 = 1;
          let email = result.email;
          let url = config.baseURL + 'login.php';
          var data = new FormData();
          data.append('email', email);
          data.append('password', password);
          data.append('user_type', user_type);
          data.append('action', 'autologin');
          data.append('device_type', config.device_type);
          data.append('player_id', config.playerID);

          consolepro.consolelog('data', data);

          apifuntion
            .postApi(url, data, var1)
            .then(obj => {
              //console.log("obj--->", obj);
              if (obj.success == 'true') {
                var user_arr = obj.user_details;
                var user_id = user_arr.user_id;
                consolepro.consolelog(
                  'user_arr after auto login will be',
                  user_arr,
                );
                localStorage.setItemString('user_id', JSON.stringify(user_id));
                localStorage.setItemObject('user_arr', user_arr);
                localStorage.setItemString('password', password);
                localStorage.setItemString('email', email);

                firebaseprovider.firebaseUserCreate();
                firebaseprovider.getMyInboxAllDataBooking();

                if (user_arr.user_type == 1) {
                  if (
                    user_arr.otp_verify == 1 &&
                    user_arr.profile_complete == 1
                  ) {
                    this.props.navigation.navigate('Home');
                    return false;
                  } else {
                    this.props.navigation.navigate('Login');
                    return false;
                  }
                } else if (user_arr.user_type == 2) {
                  if (
                    user_arr.otp_verify == 1 &&
                    user_arr.profile_complete == 1
                  ) {
                    setTimeout(() => {
                      this.props.navigation.navigate('Driver_Home');
                    }, 1000);
                  } else {
                    if (user_arr.user_type == 2) {
                      this.props.navigation.navigate('Login');
                    }
                  }
                }
              } else {
                this.props.navigation.navigate('Login');
                return false;
              }
            })
            .catch(error => {
              this.props.navigation.navigate('Login');
            });
        } else {
          let login_type = result.login_type;
          var profile_complete = result.profile_complete;

          if (profile_complete == 1) {
            let id = '';
            if (login_type == 'facebook') {
              id = result.facebook_id;
            } else if (login_type == 'google') {
              id = result.google_id;
            }
            {
              var data = new FormData();
              data.append('social_email', result.email);
              data.append('social_id', id);
              data.append('device_type', config.device_type);
              data.append('player_id', config.playerID);
              data.append('social_type', result.login_type);
              //console.log('data', data)

              localStorage.setItemObject('socialdata', result);

              var url = config.baseURL + 'social_login.php';

              //console.log('url', url);

              apifuntion
                .postApi(url, data, 1)
                .then(obj => {
                  //console.log(obj);
                  if (obj.success == 'true') {
                    if (obj.user_exist == 'yes') {
                      var user_arr = obj.user_details;
                      var user_id = user_arr.user_id;
                      var email = user_arr.email;
                      var user_type = user_arr.user_type;
                      consolepro.consolelog('user type social', user_type);
                      localStorage.setItemString(
                        'user_id',
                        JSON.stringify(user_id),
                      );
                      localStorage.setItemObject('user_arr', user_arr);
                      localStorage.setItemString('email', email);

                      firebaseprovider.firebaseUserCreate();
                      firebaseprovider.getMyInboxAllDataBooking();

                      if (user_arr.user_type == 1) {
                        this.props.navigation.navigate('Home');
                        return false;
                      }
                      if (user_arr.user_type == 2) {
                        if (user_arr.profile_complete == 1) {
                          setTimeout(() => {
                            this.props.navigation.navigate('Driver_Home');
                          }, 1000);
                        } else {
                          setTimeout(() => {
                            this.props.navigation.navigate('Become_delivery');
                          }, 1000);
                        }
                      }
                    } else {
                      this.props.navigation.navigate('Login');
                    }
                  } else {
                    this.props.navigation.navigate('Login');
                  }
                })
                .catch(error => {
                  console.log('-------- error ------- ' + error);
                  this.props.navigation.navigate('Login');
                });
            }
          } else {
            this.props.navigation.navigate('Login');
          }
        }
      } else {
        if (goto_page == '1') {
          setTimeout(() => {
            this.props.navigation.navigate('Step_1');
          }, 700);
        } else {
          setTimeout(() => {
            this.props.navigation.navigate('WelCome_Screen');
          }, 700);
        }
      }
    } catch (error) {
      //
    }
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 0}} />
        <StatusBar
          backgroundColor={Colors.white1}
          hidden={false}
          barStyle={'dark-content'}
          translucent={false}
          networkActivityIndicatorVisible={true}
        />

        <ImageBackground
          imageStyle={{flex: 1}}
          // source={require('./icons/udlivery-splash.png')}
          source={
            config.device_type == 'android'
              ? require('./icons/new/udlivery-splash-1.png')
              : require('./icons/new/udlivery-splash-ios.png')
          }
          resizeMode="stretch"
          style={{
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}></ImageBackground>
      </View>
    );
  }
}
