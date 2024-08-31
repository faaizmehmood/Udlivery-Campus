import {
  BackHandler,
  Alert,
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
  SocialLogin,
  firebaseprovider,
} from './Provider/utilslib/Utils';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export default class Login extends Component {
  _didFocusSubscription;

  _willBlurSubscription;

  constructor(props) {
    super(props);
    this.state = {
      show: true,
      password_show: true,
      openmap: false,
      email: '',
      password: '',
      remember_me: false,
      social_status: 1,
      socialDetail: 'NA',
    };
    this._didFocusSubscription = props.navigation.addListener(
      'focus',
      payload =>
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress),
    );
  }

  componentDidMount() {
    this._willBlurSubscription = this.props.navigation.addListener(
      'blur',
      payload =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          this.handleBackPress,
        ),
    );

    const {navigation} = this.props;
    this.checkRememberMe();
    this.focusListener = navigation.addListener('focus', () => {
      this.checkRememberMe();
      // this.checkSocialStatus();
      // this.checkSocailData();
    });
  }

  checksocial = async () => {
    // let user_login = await localStorage.getItemObject('user_login');
    // if (user_login != null) {
    //     if (user_login.login_type == 'google') {
    //         localStorage.setItemObject('user_login', null);
    //         SocialLogin.socaillogout('google', this.props.navigation)
    //     }
    //     if (user_login.login_type == 'facebook') {
    //         localStorage.setItemObject('user_login', null);
    //         SocialLogin.socaillogout('facebook', this.props.navigation)
    //     }
    // }
    // var user_remember = await localStorage.getItemObject('remember');
    // if (user_remember != null) {
    //     this.setState({
    //         checkdone: user_remember.checkdone,
    //         email: user_remember.email,
    //         password: user_remember.password,
    //     })
    // }
  };

  handleBackPress = () => {
    Alert.alert('Hold on!', 'Do you want to exit app?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {text: 'YES', onPress: () => BackHandler.exitApp()},
    ]);
    return true;
  };

  checkSocialStatus = async () => {
    let url = config.baseURL + 'social_status_manage.php';
    consolepro.consolelog('url', url);

    apifuntion
      .postApi(url)
      .then(obj => {
        consolepro.consolelog('obj', obj);
        if (obj.success == 'true') {
          this.setState({social_status: obj.social_status});
        } else {
          setTimeout(() => {
            msgProvider.toast(obj.msg[config.language], 'center');
          }, 300);
          return false;
        }
      })
      .catch(error => {
        console.log('error', error);
      });
  };

  // --------------------------------Check Social Ligin -----------------------
  checkSocailData = async () => {
    let socialdata = await localStorage.getItemObject('socialdata');
    consolepro.consolelog('socialdata---', socialdata);
    if (socialdata != null) {
      //console.log("social logout");

      localStorage.setItemObject('socialdata', null);

      this.setState({socialDetail: null});

      SocialLogin.socialLogout('google', this.props.navigation);

      //console.log("socialDetail", socialdata);
    } else {
      //console.log("google login");
      SocialLogin.socialFunction(this.props.navigation, 1, 'google');
    }
  };

  checkSocailDataFacebook = async () => {
    let socialdata = await localStorage.getItemObject('socialdata');
    consolepro.consolelog('socialdata---', socialdata);
    if (socialdata != null) {
      //console.log("social logout");

      localStorage.setItemObject('socialdata', null);

      this.setState({socialDetail: null});

      SocialLogin.socialLogout('facebook', this.props.navigation);

      //console.log("socialDetail", socialdata);
    } else {
      //console.log("facebook login");
      SocialLogin.socialFunction(this.props.navigation, 2, 'facebook');
    }
  };

  login = async () => {
    if (this.state.email.trim().length <= 0) {
      msgProvider.toast(msgText.enteremail[config.language], 'center');
      return false;
    }
    if (config.regemail.test(this.state.email) !== true) {
      msgProvider.toast(msgText.entervalidemail[config.language], 'center');
      return false;
    }
    if (this.state.password.trim().length <= 0) {
      msgProvider.toast(msgText.enterenterpassword[config.language], 'center');
      return false;
    }
    if (this.state.password.trim().length < 6) {
      msgProvider.toast(
        msgText.passwordminimumcharacter[config.language],
        'center',
      );
      return false;
    }

    let url = config.baseURL + 'login.php';
    consolepro.consolelog('url', url);

    var data = new FormData();
    data.append('email', this.state.email);
    data.append('password', this.state.password);
    data.append('action', 'normal');
    data.append('player_id', config.playerID);
    data.append('device_type', config.device_type);
    consolepro.consolelog('data', data);

    apifuntion
      .postApi(url, data)
      //console.log('The url is', url, 'The Data is ', data)
      .then(async (obj) => {
        consolepro.consolelog("obj", obj);
        if (obj.success == "true") {
          localStorage.setItemObject("user_arr", obj.user_details);
          if (this.state.remember_me) {
            localStorage.setItemString('remember_me', 'yes');
          } else {
            localStorage.setItemString('remember_me', 'no');
          }
          localStorage.setItemString(
            'user_id',
            JSON.stringify(obj.user_details.user_id),
          );
          localStorage.setItemString('password', this.state.password);
          localStorage.setItemString('email', this.state.email);
          firebaseprovider.firebaseUserCreate();
          firebaseprovider.getMyInboxAllData();
          firebaseprovider.getMyInboxAllDataBooking();
          this.setState({email: '', password: '', remember_me: false});
          let user_arr = obj.user_details;
          //console.log("user_arr", user_arr);

          this.props.setToken(user_arr?.user_id);

          if (user_arr.otp_verify != 0) {
            if (user_arr.profile_complete == 1) {
              if (user_arr.user_type == 1) {
                this.props.navigation.navigate('Home');
              }
              if (user_arr.user_type == 2) {
                this.props.navigation.navigate('Driver_Home');
              }
            } else {
              if (user_arr.user_type == 2) {
                this.props.navigation.navigate('Become_delivery');
              }
            }
          } else {
            this.props.navigation.navigate('Verify', {
              user_id: user_arr.user_id,
              email: this.state.email,
            });
          }
        } else {
          if (obj.account_active_status == 0) {
            config.checkUserDeactivate(this.props.navigation);
            return false;
          }
          setTimeout(() => {
            msgProvider.toast(obj.msg[config.language], 'center');
          }, 300);
          return false;
        }
      })
      .catch(error => {
        console.log('error', error);
      });
  };

  Applelogin = navigation => {
    SocialLogin.socialFunction(navigation, 'apple', 'apple');
  };

  //---------back handler funtion-------------//

  //--------------remember me check function---------------------
  checkRememberMe = async () => {
    var remember_me = await localStorage.getItemString('remember_me');
    consolepro.consolelog('remembermesss', remember_me);
    // consolepro.consolelog({ redirect_page_id })
    // consolepro.consolelog({ redirect_page })
    if (remember_me == 'yes') {
      let email = await localStorage.getItemString('email');
      let password = await localStorage.getItemString('password');
      consolepro.consolelog('email', email);
      consolepro.consolelog('password', password);
      this.setState({
        email: email,
        password: password,
        remember_me: true,
      });
    } else {
      this.setState({
        email: '',
        password: '',
        remember_me: false,
      });
    }
  };

  //---------remember me check uncheck  funtion-------------//

  remember_me = () => {
    if (this.state.remember_me) {
      this.setState({remember_me: false});
    } else {
      this.setState({remember_me: true});
    }
  };

  render() {
    return (
      <View style={{flex: 1, backgroundColor: Colors.theamColor}}>
        <SafeAreaView style={{flex: 0, backgroundColor: Colors.theamColor}} />
        <KeyboardAwareScrollView>
          <View
            style={{
              width: '86%',
              alignSelf: 'center',
              marginTop: (mobileW * 8) / 100,
            }}>
            {/* .....................For Back img.................... */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                this.props.navigation.navigate('Step_1');
              }}
              //          style={{width:mobileW*15/100,justifyContent:'center',
              //    alignItems:'center'}}
            >
              <Image
                source={localimag.BackW}
                resizeMode="contain"
                style={{
                  height: (mobileH * 6.5) / 100,
                  width: (mobileW * 6.5) / 100,
                }}></Image>
            </TouchableOpacity>

            {/* .....................For Logo img.................... */}
            <Image
              source={localimag.Usericon}
              resizeMode="contain"
              style={{
                height: (mobileH * 19) / 100,
                width: (mobileW * 33) / 100,
                alignSelf: 'center',
                marginTop: mobileW * -0.06,
              }}></Image>
            {/* .....................For Login txt.................... */}
            <View
              style={{
                width: '100%',
                alignSelf: 'center',
                marginTop: mobileW * 0.13,
              }}>
              <Text
                style={{
                  fontFamily: Font.Semibold,
                  fontSize: (mobileW * 4.5) / 100,
                  color: Colors.white1,
                }}>
                {Lang_chg.Login_txt[config.language]}
              </Text>
            </View>
            {/* .....................For Email.................... */}
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                marginTop: mobileW * 0.08,
                alignItems: 'center',
              }}>
              {/* email Image------------ */}
              <View style={{width: '8%', justifyContent: 'center'}}>
                <Image
                  source={localimag.Emailicon}
                  resizeMode="contain"
                  style={{
                    height: (mobileW * 6) / 100,
                    width: (mobileW * 6) / 100,
                  }}
                />
              </View>
              {/* textInput--------- */}
              <View style={{width: '88%', justifyContent: 'center'}}>
                <TextInput
                  selectionColor={Colors.textInputSelectionColor}
                  onChangeText={txt => this.setState({email: txt})}
                  placeholder={Lang_chg.Email_txt[config.language]}
                  keyboardType="email-address"
                  placeholderTextColor={Colors.white1}
                  maxLength={100}
                  value={this.state.email}
                  style={{
                    width: '95%',
                    fontSize: (mobileW * 4) / 100,
                    color: Colors.white1,
                    paddingVertical: (mobileH * 1) / 100,
                    marginTop: mobileW * 0.01,
                    fontFamily: Font.OutfitMedium,
                    textAlignVertical: 'center',
                  }}></TextInput>
              </View>
            </View>
            <View
              style={{
                width: '100%',
                height: (mobileW * 0.2) / 100,
                backgroundColor: Colors.white1,
                alignSelf: 'center',
              }}></View>

            {/* .....................For Password.................... */}
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                marginTop: mobileW * 0.08,
                alignItems: 'center',
              }}>
              {/* Password Image------------ */}
              <View style={{width: '8%', justifyContent: 'center'}}>
                <Image
                  source={localimag.Password}
                  resizeMode="contain"
                  style={{
                    height: (mobileW * 6) / 100,
                    width: (mobileW * 6) / 100,
                  }}
                />
              </View>
              {/* textInput--------- */}
              <View style={{width: '78%', justifyContent: 'center'}}>
                <TextInput
                  onChangeText={txt => this.setState({password: txt})}
                  selectionColor={Colors.textInputSelectionColor}
                  placeholder={Lang_chg.Password_txt[config.language]}
                  keyboardType="default"
                  placeholderTextColor={Colors.white1}
                  secureTextEntry={this.state.password_show}
                  maxLength={16}
                  value={this.state.password}
                  style={{
                    width: '95%',
                    fontSize: (mobileW * 4) / 100,
                    color: Colors.white1,
                    paddingVertical: (mobileH * 1) / 100,
                    marginTop: mobileW * 0.01,
                    fontFamily: Font.OutfitMedium,
                    textAlignVertical: 'center',
                  }}></TextInput>
              </View>
              <TouchableOpacity
                style={{justifyContent: 'center', width: '14%'}}
                onPress={() => {
                  this.setState({password_show: !this.state.password_show});
                }}>
                <Text
                  style={{
                    fontSize: (mobileW * 3.3) / 100,
                    marginTop: mobileW * 0.02,
                    fontFamily: Font.OutfitMedium,
                    color: Colors.white1,
                    textAlign: 'right',
                  }}>
                  {this.state.password_show ? 'Show' : 'Hide'}{' '}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: '100%',
                height: (mobileW * 0.2) / 100,
                backgroundColor: Colors.white1,
                alignSelf: 'center',
              }}></View>

            {/* Click image---------- */}
            <View
              style={{
                width: '99%',
                paddingVertical: (mobileH * 0.2) / 100,
                marginTop: (mobileH * 2) / 100,
                backgroundColor: Colors.theamColor,
                alignSelf: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                // onPress={() => { this.setState({ show: !this.state.show }) }}
                onPress={() => {
                  this.setState({remember_me: !this.state.remember_me});
                }}
                style={{width: '8%'}}>
                {!this.state.remember_me ? (
                  <Image
                    source={localimag.Uncheckicon}
                    resizeMode="contain"
                    style={{
                      height: (MobileW * 5.6) / 100,
                      width: (MobileW * 5.6) / 100,
                      // resizeMode:'stretch'
                    }}
                  />
                ) : (
                  <Image
                    source={localimag.Checkimg}
                    resizeMode="contain"
                    style={{
                      height: (MobileW * 5.6) / 100,
                      width: (MobileW * 5.6) / 100,
                      // resizeMode:'stretch'
                    }}
                  />
                )}
              </TouchableOpacity>
              {/* remenber me text----------- */}
              <TouchableOpacity
                style={{
                  width: (mobileW * 38) / 100,
                }}
                onPress={() => {
                  this.setState({remember_me: !this.state.remember_me});
                }}>
                <Text
                  style={{
                    fontSize: (mobileW * 4) / 100,
                    fontFamily: Font.OutfitMedium,
                    color: Colors.white1,
                  }}>
                  {Lang_chg.remeber[config.language]}
                </Text>
              </TouchableOpacity>
              {/* Forgot Password text----------- */}
              <TouchableOpacity
                style={{
                  width: (mobileW * 40) / 100,
                }}
                onPress={() => {
                  this.props.navigation.navigate('Forgot_Password');
                }}>
                <Text
                  style={{
                    fontSize: (mobileW * 4) / 100,
                    fontFamily: Font.OutfitMedium,
                    color: Colors.white1,
                    textAlign: 'right',
                  }}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>
            {/* Login Button---------- */}
            <View style={{marginTop: mobileW * 0.07}}>
              <Common_Button
                name_Login={Lang_chg.Login[config.language]}
                onButtonClick={() => {
                  this.login();
                }}
              />
            </View>

            {/* Or Border--------------------- */}
            {this.state.social_status == 1 && (
              <>
                <View
                  style={{
                    alignSelf: 'center',
                    width: '94%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: (mobileW * 7) / 100,
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      height: mobileW * 0.002,
                      backgroundColor: Colors.white1,
                      width: (mobileW * 36) / 100,
                    }}></View>
                  <View style={{}}>
                    <Text
                      style={{
                        fontFamily: Font.Fontregular,
                        fontSize: (mobileW * 3.5) / 100,
                        color: Colors.white1,
                      }}>
                      or
                    </Text>
                  </View>
                  <View
                    style={{
                      height: mobileW * 0.002,
                      backgroundColor: Colors.white1,
                      width: (mobileW * 36) / 100,
                    }}></View>
                </View>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}>
                  {/* <TouchableOpacity
                    onPress={() => {
                      this.checkSocailDataFacebook();
                    }}
                    style={{
                      alignSelf: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={localimag.Facebookicon}
                      resizeMode="contain"
                      style={{
                        height: (mobileH * 12) / 100,
                        width: (mobileW * 13) / 100,
                      }}></Image>
                  </TouchableOpacity> */}
                  <TouchableOpacity
                    onPress={() => {
                      this.checkSocailData();
                    }}
                    style={{
                      alignSelf: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={localimag.Googleicon}
                      resizeMode="contain"
                      style={{
                        height: (mobileH * 12) / 100,
                        width: (mobileW * 13) / 100,
                      }}></Image>
                  </TouchableOpacity>

                  {config.device_type == 'ios' && (
                    <TouchableOpacity
                      onPress={() => {
                        this.Applelogin(this.props.navigation);
                      }}
                      style={{
                        alignSelf: 'center',
                        alignItems: 'center',
                      }}>
                      <Image
                        source={localimag.appleIcon}
                        resizeMode="contain"
                        style={{
                          height: (mobileH * 11) / 100,
                          width: (mobileW * 11) / 100,
                        }}></Image>
                    </TouchableOpacity>
                  )}
                </View>
              </>
            )}
            <View
              style={{
                height:
                  this.state.social_status == 1 ? 0 : (mobileW * 37) / 100,
              }}></View>
            <View
              style={{
                width: '100%',
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: (mobileW * 3) / 100,
                marginBottom: (mobileW * 2) / 100,
              }}>
              <Text
                onPress={() => {
                  this.props.navigation.navigate('Step_1');
                }}
                style={{
                  fontSize: (mobileW * 4) / 100,
                  fontFamily: Font.OutfitMedium,
                  color: Colors.white1,
                }}>
                Don't have an account?
                <Text
                  style={{
                    fontFamily: Font.Semibold,
                    textDecorationLine: 'underline',
                  }}>
                  {' '}
                  Signup
                </Text>
              </Text>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
