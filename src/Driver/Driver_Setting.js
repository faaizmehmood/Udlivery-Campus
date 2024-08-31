import {
  Linking,
  Text,
  View,
  ImageBackground,
  Image,
  TextInput,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import React, {Component} from 'react';
const MobileW = Dimensions.get('window').width;
const MobileH = Dimensions.get('window').height;
import {
  config,
  Common_Button,
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
} from '../Provider/utilslib/Utils';
// import Footer from './Provider/Footer'
import {Switch} from 'react-native-switch';
import {CommonActions} from '@react-navigation/native';
import Share from 'react-native-share';

export default class Driver_Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      password_show: true,
      switchValue: true,
      rateappurl: '',
      sharemsg: '',
      social_data: 'NA',
    };
    this.checkSocailData();
  }

  checkSocailData = async () => {
    let socialdata = await localStorage.getItemObject('socialdata');
    console.log(
      'socialdata---------------------------------------------------------------------',
      socialdata,
    );
    if (socialdata != null) {
      this.setState({social_data: socialdata});
    }
  };

  LogoutPress = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout app?',
      [
        {
          text: 'No',
          onPress: () => {},
          style: 'Yes',
        },
        {
          text: 'Yes',
          onPress: async () => {
            await localStorage.removeItem('socialdata');
            // localStorage.clear();
            localStorage.removeItem('user_arr');

            // this.props.navigation.dispatch(
            // 	CommonActions.reset({
            // 		index: 1,
            // 		routes: [{ name: 'Customertype' }]
            // 	})
            // );
            // this.props.navigation.reset({
            //   index: 0,
            //   routes: [{name: 'login'}],
            // });
            consolepro.consolelog('logout btn clicked');
            let remember_me = await localStorage.getItemString('remember_me');
            let email = await localStorage.getItemString('email');
            let password = await localStorage.getItemString('password');
            consolepro.consolelog('remember_me', remember_me);
            consolepro.consolelog('email', email);
            consolepro.consolelog('password', password);

            this.props.navigation.navigate('Login');
          },
        },
      ],
      {
        cancelable: false,
      },
    ); // works best when the goBack is async
    return true;
  };

  componentDidMount() {
    //console.log("Customer side");
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('focus', () => {
      this.getUserId();
      this.getContent();
    });

    this.getUserId();
    this.getContent();
  }

  //-------------- function for get content arr--------------//

  getContent = async () => {
    let url = config.baseURL + 'get_all_content.php?user_id=0';
    consolepro.consolelog('url', url);
    apifuntion
      .getApi(url, 1)
      .then(obj => {
        consolepro.consolelog(obj);
        if (obj.success == 'true') {
          consolepro.consolelog('content_obj', obj);
          consolepro.consolelog('content_arr', obj.content_arr);
          consolepro.consolelog('rateappios', obj.content_arr[5].content);
          consolepro.consolelog('rateappandroid', obj.content_arr[4].content);
          consolepro.consolelog('sharemsg', obj.content_arr[6].content);
          var rateappurl = '';
          content_arr = obj.content_arr;

          if (config.device_type == 'ios') {
            rateappurl = obj.content_arr[5].content;
          }
          if (config.device_type == 'android') {
            rateappurl = obj.content_arr[4].content;
          }

          consolepro.consolelog('sharemsg', obj.content_arr[6].content);

          this.setState({sharemsg: obj.content_arr[6].content});

          console.log('rateapp', rateappurl);

          this.setState({rateappurl: rateappurl});
        } else {
          msgProvider.alert(
            msgTitle.information[config.language],
            obj.msg[config.language],
            false,
          );
          return false;
        }
      })
      .catch(error => {
        consolepro.consolelog('-------- error ------- ' + error);
        msgProvider.alert(
          msgTitle.internet[config.language],
          msgText.networkconnection[config.language],
          false,
        );
      });
  };

  //-------------------------get user details-------------------

  getUserId = async () => {
    let result = await localStorage.getItemObject('user_arr');
    consolepro.consolelog('result', result);
    if (result != null) {
      let user_id_get = '';
      if (result != null) {
        user_id_get = result.user_id;
        if (result.notification_status == 0) {
          this.setState({isSwitchOn: false});
        } else {
          this.setState({isSwitchOn: true});
        }
        consolepro.consolelog('login_type', result.login_type);
        if (result.login_type == 'app') {
          this.setState({password_hide: false});
        } else {
          this.setState({password_hide: true});
        }
      }
      this.setState({
        user_id: user_id_get,
      });
    }
  };

  //--------rate us ------------------==
  rate_app = () => {
    try {
      consolepro.consolelog('I am in rate app ');
      Linking.openURL(this.state.rateappurl);
    } catch (error) {
      console.log('error', error);
      Alert.alert('Please check for the Google Play Store');
    }
  };
  //------------------function for share app message-------------------
  shareappbtn = () => {
    //console.log(this.state.sharemsg);
    let shareOptions = {
      message: this.state.sharemsg,
      failOnCancel: false,
    };
    Share.open(shareOptions);
  };

  //--------------------------- function for notification on/off=-----------

  onToggleSwitch = () => {
    this.setState({isSwitchOn: !this.state.isSwitchOn});

    let {user_id, isSwitchOn} = this.state;
    consolepro.consolelog({user_id, isSwitchOn});
    let notification_status = 0;
    if (isSwitchOn == true) {
      notification_status = 0;
    } else {
      notification_status = 1;
    }

    let url = config.baseURL + 'notification_update.php';
    var data = new FormData();
    data.append('user_id', user_id);
    data.append('notification_status', notification_status);

    consolepro.consolelog('data', data);
    apifuntion
      .postApi(url, data, 1)
      .then(obj => {
        consolepro.consolelog('user_arr', obj);
        if (obj.success == 'true') {
          var user_arr = obj.user_details;
          var user_id = user_arr.user_id;
          localStorage.setItemString('user_id', JSON.stringify(user_id));
          localStorage.setItemObject('user_arr', user_arr);
          firebaseprovider.firebaseUserCreate();
          firebaseprovider.getMyInboxAllData();
        } else {
          if (obj.account_active_status == 0) {
            // this.props.navigation.navigate('Login')
            consolepro.consolelog(
              'account_active_status',
              obj.account_active_status,
            );
            config.checkUserDeactivate(this.props.navigation);
            return false;
          }
          msgProvider.alert(
            msgTitle.information[config.language],
            obj.msg[config.language],
            false,
          );
          return false;
        }
      })
      .catch(error => {
        consolepro.consolelog('-------- error ------- ' + error);

        msgProvider.alert(
          msgTitle.internet[config.language],
          msgText.networkconnection[config.language],
          false,
        );
      });
  };

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#F7F7F7'}}>
        <SafeAreaView style={{flex: 0, backgroundColor: Colors.theamColor}} />
        {/* <StatusBar
          backgroundColor={Colors.theamColor}
          hidden={false}
          barStyle={'light-content'}
          // backgroundColor={Colors.back_color}
          translucent={false}
          networkActivityIndicatorVisible={true}
        /> */}

        {/* .....................For Header.................... */}
        <View
          style={{
            paddingLeft: mobileW * 0.02,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            width: (mobileW * 100) / 100,
            alignItems: 'center',
            backgroundColor: Colors.theamColor,
          }}>
          <TouchableOpacity
            style={{
              width: (mobileW * 12) / 100,
              paddingLeft: (mobileW * 3) / 100,
            }}
            onPress={() => this.props.navigation.goBack('')}>
            <Image
              style={{
                height: (mobileW * 6) / 100,
                width: (mobileW * 6) / 100,
                resizeMode: 'contain',
              }}
              source={localimag.goback}
            />
          </TouchableOpacity>
          <View
            style={{
              width: (mobileW * 76) / 100,
              paddingVertical: (mobileW * 3) / 100,
              alignItems: 'center',
              alignSelf: 'center',
            }}>
            <Text
              style={{
                fontSize: (mobileW * 5) / 100,
                color: Colors.white_color,
                fontFamily: Font.OutfitMedium,
              }}>
              {Lang_chg.Setting_txt[config.language]}
            </Text>
          </View>
          <View style={{width: (mobileW * 12) / 100}}></View>
        </View>
        <ScrollView
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            style={{flex: 1, paddingBottom: (mobileW * 30) / 100}}
            activeOpacity={1}>
            {/* .....................For Notification.................... */}
            <View
              style={{
                width: '96%',
                alignSelf: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: mobileW * 0.035,
              }}>
              <View
                style={{
                  width: '10%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={localimag.Notification}
                  resizeMode="contain"
                  style={{
                    height: (mobileW * 6) / 100,
                    width: (mobileW * 6) / 100,
                  }}
                />
              </View>
              <View style={{width: '76%', justifyContent: 'center'}}>
                <Text style={styles.text1}>
                  {Lang_chg.txt_notifications[config.language]}
                </Text>
              </View>
              <View style={{width: '15%', justifyContent: 'center'}}>
                <Switch
                  color={Colors.white_color}
                  value={this.state.show}
                  onValueChange={text => this.setState({show: text})}
                  activeText={''}
                  inActiveText={''}
                  backgroundActive={Colors.theamColor}
                  backgroundInactive="#c2c0ba"
                  circleActiveColor={Colors.white1}
                  circleInActiveColor={Colors.white1}
                  circleSize={Platform.OS == 'android' ? 20 : 19}
                  barHeight={Platform.OS == 'android' ? 20 : 20}
                  circleBorderWidth={0.1}
                  // switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
                  // switchRightPx={2}
                />
              </View>
            </View>
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: Colors.bottomborder,
                alignSelf: 'center',
              }}></View>

            {/* .....................For Edit Profile.................... */}
            <TouchableOpacity
              activeOpacity={0.7}
              // onPress={() => { this.props.navigation.navigate('Edit_Profile', { 'Status': 2 }) }}
              onPress={() => {
                this.props.navigation.navigate('Edit_Profile');
              }}
              style={{
                width: '96%',
                alignSelf: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: mobileW * 0.035,
              }}>
              <View
                style={{
                  width: '10%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={localimag.editprofile}
                  resizeMode="contain"
                  style={styles.image}
                />
              </View>
              <View style={{width: '85%', justifyContent: 'center'}}>
                <Text style={styles.text1}>
                  {Lang_chg.txt_edit[config.language]}
                </Text>
              </View>
              <View style={{width: '10%'}}>
                <Image
                  source={localimag.Blackb}
                  resizeMode="contain"
                  style={styles.Back_image}
                />
              </View>
            </TouchableOpacity>
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: Colors.bottomborder,
                alignSelf: 'center',
              }}></View>
            {/* .....................For Change Password.................... */}
            {this.state.social_data == 'NA' && (
              <>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    this.props.navigation.navigate('Change_Password');
                  }}
                  style={{
                    width: '96%',
                    alignSelf: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: mobileW * 0.035,
                  }}>
                  <View
                    style={{
                      width: '10%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={localimag.Changepassword}
                      resizeMode="contain"
                      style={styles.image}
                    />
                  </View>
                  <View style={{width: '85%', justifyContent: 'center'}}>
                    <Text style={styles.text1}>
                      {Lang_chg.txt_change_password[config.language]}
                    </Text>
                  </View>
                  <View style={{width: '10%'}}>
                    <Image
                      source={localimag.Blackb}
                      resizeMode="contain"
                      style={styles.Back_image}
                    />
                  </View>
                </TouchableOpacity>

                <View
                  style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: Colors.bottomborder,
                    alignSelf: 'center',
                  }}></View>
              </>
            )}
            {/* .....................For About us.................... */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                this.props.navigation.navigate('ContentPage', {
                  pagename: Lang_chg.txt_aboutUs[config.language],
                  contentpage: 0,
                  user_type: 2,
                })
              }
              style={{
                width: '96%',
                alignSelf: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: mobileW * 0.035,
              }}>
              <View
                style={{
                  width: '10%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={localimag.Aboutusicon}
                  resizeMode="contain"
                  style={styles.image}
                />
              </View>
              <View style={{width: '85%', justifyContent: 'center'}}>
                <Text style={styles.text1}>
                  {Lang_chg.txt_aboutUs[config.language]}
                </Text>
              </View>
              <View style={{width: '10%'}}>
                <Image
                  source={localimag.Blackb}
                  resizeMode="contain"
                  style={styles.Back_image}
                />
              </View>
            </TouchableOpacity>
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: Colors.bottomborder,
                alignSelf: 'center',
              }}></View>
            {/* .....................For Terms and condition.................... */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                this.props.navigation.navigate('ContentPage', {
                  pagename: Lang_chg.termsOfService[config.language],
                  contentpage: 2,
                  user_type: 2,
                })
              }
              style={{
                width: '96%',
                alignSelf: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: mobileW * 0.035,
              }}>
              <View
                style={{
                  width: '10%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={localimag.Termsconditions}
                  resizeMode="contain"
                  style={styles.image}
                />
              </View>
              <View style={{width: '85%', justifyContent: 'center'}}>
                <Text style={styles.text1}>
                  {Lang_chg.termsOfService[config.language]}
                </Text>
              </View>
              <View style={{width: '10%'}}>
                <Image
                  source={localimag.Blackb}
                  resizeMode="contain"
                  style={styles.Back_image}
                />
              </View>
            </TouchableOpacity>
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: Colors.bottomborder,
                alignSelf: 'center',
              }}></View>
            {/* .....................For Privacy.................... */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                this.props.navigation.navigate('ContentPage', {
                  pagename: Lang_chg.txt_privacy_policy[config.language],
                  contentpage: 1,
                  user_type: 2,
                })
              }
              style={{
                width: '96%',
                alignSelf: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: mobileW * 0.035,
              }}>
              <View
                style={{
                  width: '10%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={localimag.Privacypolicy}
                  resizeMode="contain"
                  style={styles.image}
                />
              </View>
              <View style={{width: '85%', justifyContent: 'center'}}>
                <Text style={styles.text1}>
                  {Lang_chg.txt_privacy_policy[config.language]}
                </Text>
              </View>
              <View style={{width: '10%'}}>
                <Image
                  source={localimag.Blackb}
                  resizeMode="contain"
                  style={styles.Back_image}
                />
              </View>
            </TouchableOpacity>
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: Colors.bottomborder,
                alignSelf: 'center',
              }}></View>
            {/* .....................For Contact us.................... */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => this.props.navigation.navigate('Contact_Us')}
              style={{
                width: '96%',
                alignSelf: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: mobileW * 0.035,
              }}>
              <View
                style={{
                  width: '10%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={localimag.contactus}
                  resizeMode="contain"
                  style={styles.image}
                />
              </View>
              <View style={{width: '85%', justifyContent: 'center'}}>
                <Text style={styles.text1}>
                  {Lang_chg.txt_contact_us[config.language]}
                </Text>
              </View>
              <View style={{width: '10%'}}>
                <Image
                  source={localimag.Blackb}
                  resizeMode="contain"
                  style={styles.Back_image}
                />
              </View>
            </TouchableOpacity>
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: Colors.bottomborder,
                alignSelf: 'center',
              }}></View>
            {/* .....................For Share.................... */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                // this.props.navigation.navigate('')
                this.shareappbtn();
              }}
              style={{
                width: '96%',
                alignSelf: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: mobileW * 0.035,
              }}>
              <View
                style={{
                  width: '10%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={localimag.shareicon}
                  resizeMode="contain"
                  style={styles.image}
                />
              </View>
              <View style={{width: '85%', justifyContent: 'center'}}>
                <Text style={styles.text1}>
                  {Lang_chg.txt_share_app[config.language]}
                </Text>
              </View>
              <View style={{width: '10%'}}>
                <Image
                  source={localimag.Blackb}
                  resizeMode="contain"
                  style={styles.Back_image}
                />
              </View>
            </TouchableOpacity>
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: Colors.bottomborder,
                alignSelf: 'center',
              }}></View>
            {/* .....................For Rate now.................... */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                this.rate_app();
                // this.props.navigation.navigate('')
              }}
              style={{
                width: '96%',
                alignSelf: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: mobileW * 0.035,
              }}>
              <View
                style={{
                  width: '10%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={localimag.rateappicon}
                  resizeMode="contain"
                  style={styles.image}
                />
              </View>
              <View style={{width: '85%', justifyContent: 'center'}}>
                <Text style={styles.text1}>
                  {Lang_chg.txt_rate_app[config.language]}
                </Text>
              </View>
              <View style={{width: '10%'}}>
                <Image
                  source={localimag.Blackb}
                  resizeMode="contain"
                  style={styles.Back_image}
                />
              </View>
            </TouchableOpacity>
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: Colors.bottomborder,
                alignSelf: 'center',
              }}></View>
            {/* .....................For Delete.................... */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                this.props.navigation.navigate('Delete_Account');
              }}
              style={{
                width: '96%',
                alignSelf: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: mobileW * 0.033,
              }}>
              <View
                style={{
                  width: '10%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={localimag.Delete}
                  resizeMode="contain"
                  style={styles.image}
                />
              </View>
              <View style={{width: '85%', justifyContent: 'center'}}>
                <Text style={styles.text1}>
                  {Lang_chg.Delete_txt[config.language]}
                </Text>
              </View>
              <View style={{width: '10%'}}>
                <Image
                  source={localimag.Blackb}
                  resizeMode="contain"
                  style={styles.Back_image}
                />
              </View>
            </TouchableOpacity>
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: Colors.bottomborder,
                alignSelf: 'center',
              }}></View>
            {/* .....................For Logout.................... */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                this.LogoutPress();
                // this.props.navigation.navigate('Login')
              }}
              style={{
                width: '90%',
                alignSelf: 'center',
                paddingVertical: mobileW * 0.033,
                borderRadius: mobileW * 0.06,
                marginTop: mobileW * 0.15,
                backgroundColor: '#F8E4E4',
              }}>
              <View
                style={{
                  width: '26%',
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Image
                  source={localimag.logout}
                  resizeMode="contain"
                  style={styles.image}
                />
                <Text
                  style={{
                    fontSize: (mobileW * 4.3) / 100,
                    fontFamily: Font.OutfitMedium,
                    color: 'red',
                  }}>
                  {Lang_chg.txt_logout[config.language]}
                </Text>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  image: {
    height: (mobileW * 5.5) / 100,
    width: (mobileW * 5.5) / 100,
  },
  text1: {
    fontSize: (mobileW * 4.3) / 100,
    fontFamily: Font.OutfitMedium,
    color: Colors.black,
  },
  Back_image: {
    height: (mobileW * 4.5) / 100,
    width: (mobileW * 4.5) / 100,
    tintColor: '#797979',
  },
});
