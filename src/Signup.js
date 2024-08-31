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
import React, { Component } from 'react';
const MobileW = Dimensions.get('window').width;
const MobileH = Dimensions.get('window').height;
import {
  config,
  Common_Button,
  msgProvider,
  localStorage,
  apifuntion,
  msgText,
  consolepro,
  Lang_chg,
  Font,
  Colors,
  mobileH,
  mobileW,
  localimag,
  firebaseprovider,
} from './Provider/utilslib/Utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      password_show: true,
      password_show1: true,
      openmap: false,

      name: '',
      mobile: '',
      email: '',
      password: '',
      cpassword: '',
      sel_university_id: this.props.route.params.sel_university_id,
      user_type: this.props.route.params.user_type,
      social_data: 'NA',
    };
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.checkSocailData();
    });
    this.checkSocailData();
  }

  // --------------------------------Check Social Ligin -----------------------
  checkSocailData = async () => {
    let socialdata = await localStorage.getItemObject('socialdata');
    //console.log("socialdata", socialdata);
    if (socialdata != null) {
      let name = socialdata.social_name;
      let email = socialdata.social_email;

      this.setState({ name: name, email: email, social_data: socialdata });
    }
  };

  mailsendfunction = email_arr => {
    console.log('email_arr', email_arr);
    for (let i = 0; i < email_arr.length; i++) {
      var email = email_arr[i].email;
      var mailcontent = email_arr[i].mailcontent;
      var mailsubject = email_arr[i].mailsubject;
      var fromName = email_arr[i].fromName;
      var url = config.baseURL + 'mailFunctionsSend.php';
      var data = new FormData();
      data.append('email', email);
      data.append('mailcontent', mailcontent);
      data.append('mailsubject', mailsubject);
      data.append('fromName', fromName);
      data.append('mail_file', 'NA');
      consolepro.consolelog('verification==', data);

      apifuntion.postApi(url, data, 1).then(obj => {
        consolepro.consolelog('email_arr', obj);

        if (obj.success == 'true') {
          consolepro.consolelog('Response', 'Mail Send Success');
        } else {
          consolepro.consolelog('Response', 'mail not send');
        }
      });
    }
  };

  SignupApp = async () => {
    if (this.state.name.length <= 0) {
      msgProvider.toast(msgText.enterfullname[config.language], 'center');
      return false;
    }
    if (this.state.name.trim().length < 3) {
      msgProvider.toast(
        msgText.fullnameminimumcharacter[config.language],
        'center',
      );
      return false;
    }
    if (this.state.mobile.trim().length <= 0) {
      msgProvider.toast(msgText.emptyMobile[config.language], 'center');
      return false;
    }
    if (this.state.mobile.length > 0) {
      if (this.state.mobile.length < 7) {
        msgProvider.toast(msgText.mobileMinLength[config.language], 'center');
        return false;
      }
      var mobilevalidation = config.mobilevalidation;
      if (mobilevalidation.test(this.state.mobile) !== true) {
        msgProvider.toast(msgText.validMobile[config.language], 'center');
        return false;
      }
    }
    if (this.state.email.trim().length <= 0) {
      msgProvider.toast(msgText.enteremail[config.language], 'center');
      return false;
    }
    if (config.regemail.test(this.state.email) !== true) {
      msgProvider.toast(msgText.entervalidemail[config.language], 'center');
      return false;
    }
    if (this.state.password.length <= 0) {
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
    if (this.state.cpassword.trim().length <= 0) {
      msgProvider.toast(
        msgText.Pleaseenterconfirmpassword[config.language],
        'center',
      );
      return false;
    }
    if (this.state.password.trim() != this.state.cpassword.trim()) {
      msgProvider.toast(msgText.Passwordnotmatched[config.language], 'center');
      return false;
    }

    let url = config.baseURL + 'signup.php';
    consolepro.consolelog('url', url);
    var data = new FormData();
    data.append('university_id', this.state.sel_university_id);
    data.append('user_type', this.state.user_type);
    data.append('name', this.state.name);
    data.append('email', this.state.email);
    data.append('mobile', this.state.mobile);
    data.append('password', this.state.password);
    data.append('login_type', 'app');
    data.append('player_id', config.playerID);
    data.append('device_type', config.device_type);
    consolepro.consolelog('data', data);

    apifuntion
      .postApi(url, data)
      .then(obj => {
        consolepro.consolelog('obj', obj);
        if (obj.success == 'true') {
          localStorage.setItemObject('user_arr', obj.user_details);
          localStorage.setItemString('password', this.state.password);
          localStorage.setItemString(
            'user_id',
            JSON.stringify(obj.user_details.user_id),
          );
          firebaseprovider.firebaseUserCreate();
          // firebaseprovider.getMyInboxAllData();
          firebaseprovider.getMyInboxAllDataBooking();
          var email_arr = obj.email_arr;

          if (typeof email_arr !== 'undefined') {
            if (email_arr != 'NA') {
              this.mailsendfunction(email_arr);
            }
          }
          setTimeout(() => {
            this.props.navigation.navigate('Verify', {
              user_id: obj.user_details.user_id,
              email: this.state.email,
            });
          }, 700);
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

  socialSignup = async () => {
    if (this.state.name.length <= 0) {
      msgProvider.toast(msgText.enterfullname[config.language], 'center');
      return false;
    }
    if (this.state.name.trim().length < 3) {
      msgProvider.toast(
        msgText.fullnameminimumcharacter[config.language],
        'center',
      );
      return false;
    }
    if (this.state.mobile.trim().length <= 0) {
      msgProvider.toast(msgText.emptyMobile[config.language], 'center');
      return false;
    }
    if (this.state.mobile.length > 0) {
      if (this.state.mobile.length < 7) {
        msgProvider.toast(msgText.mobileMinLength[config.language], 'center');
        return false;
      }
      var mobilevalidation = config.mobilevalidation;
      if (mobilevalidation.test(this.state.mobile) !== true) {
        msgProvider.toast(msgText.validMobile[config.language], 'center');
        return false;
      }
    }
    if (this.state.email.trim().length <= 0) {
      msgProvider.toast(msgText.enteremail[config.language], 'center');
      return false;
    }
    if (config.regemail.test(this.state.email) !== true) {
      msgProvider.toast(msgText.entervalidemail[config.language], 'center');
      return false;
    }

    let url = config.baseURL + 'signup.php';
    consolepro.consolelog('url', url);
    var data = new FormData();
    data.append('university_id', this.state.sel_university_id);
    data.append('user_type', this.state.user_type);
    data.append('name', this.state.name);
    data.append('email', this.state.email);
    data.append('mobile', this.state.mobile);
    data.append('password', this.state.password);
    data.append('login_type', this.state.social_data.social_type);
    data.append('social_id', this.state.social_data.social_id);
    data.append('player_id', config.playerID);
    data.append('device_type', config.device_type);
    consolepro.consolelog('data', data);

    apifuntion
      .postApi(url, data)
      .then(obj => {
        consolepro.consolelog('obj', obj);
        if (obj.success == 'true') {
          localStorage.setItemObject('user_arr', obj.user_details);
          localStorage.setItemString(
            'user_id',
            JSON.stringify(obj.user_details.user_id),
          );
          firebaseprovider.firebaseUserCreate();
          firebaseprovider.getMyInboxAllDataBooking();

          if (obj.user_details.user_type == 1) {
            this.props.navigation.navigate('Home');
          } else {
            this.props.navigation.navigate('Become_delivery');
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

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.theamColor }}>
        <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theamColor }} />
        <KeyboardAwareScrollView>
          <View
            style={{
              width: '86%',
              alignSelf: 'center',
              marginTop: mobileW * 0.09,
              paddingBottom: (MobileW * 30) / 100,
            }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                this.props.navigation.goBack();
              }}>
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
            {/* .....................For Text.................... */}
            <Text
              style={{
                fontSize: mobileW * 0.04,
                fontFamily: Font.Bold,
                color: Colors.white1,
                marginTop: mobileW * 0.13,
              }}>
              {Lang_chg.Step3_txt[config.language]}
            </Text>
            <Text
              style={{
                fontSize: mobileW * 0.05,
                fontFamily: Font.OutfitMedium,
                color: Colors.white1,
                marginTop: mobileW * 0.08,
              }}>
              {Lang_chg.Creat_txt[config.language]}
            </Text>
            {/* .....................For Full name.................... */}
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                marginTop: mobileW * 0.08,
                alignItems: 'center',
              }}>
              {/* Full name Image------------ */}
              <View style={{ width: '8%', justifyContent: 'center' }}>
                <Image
                  source={localimag.Usericonc}
                  resizeMode="contain"
                  style={{
                    height: (mobileW * 6) / 100,
                    width: (mobileW * 6) / 100,
                  }}
                />
              </View>
              {/* textInput--------- */}
              <View style={{ width: '88%', justifyContent: 'center' }}>
                <TextInput
                  onChangeText={txt => this.setState({ name: txt })}
                  placeholder={Lang_chg.Name_txt[config.language]}
                  value={'' + this.state.name + ''}
                  selectionColor={Colors.textInputSelectionColor}
                  keyboardType="default"
                  placeholderTextColor={Colors.white1}
                  maxLength={50}
                  style={{
                    width: '95%',
                    fontSize: (mobileW * 4) / 100,
                    color: Colors.white1,
                    paddingVertical: (mobileH * 1) / 100,
                    fontFamily: Font.OutfitMedium,
                    textAlignVertical: 'center',
                    marginTop: mobileW * 0.01,
                  }}></TextInput>
              </View>
            </View>
            <View
              style={{
                width: '98%',
                height: (mobileW * 0.2) / 100,
                backgroundColor: Colors.white1,
                alignSelf: 'center',
              }}></View>

            {/* .....................For Mobile.................... */}
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                marginTop: mobileW * 0.08,
                alignItems: 'center',
              }}>
              {/* email Image------------ */}
              <View
                style={{
                  width: '8%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={localimag.telephone}
                  resizeMode="contain"
                  style={{
                    tintColor: Colors.white1,
                    height: (mobileW * 5) / 100,
                    width: (mobileW * 5) / 100,
                  }}
                />
              </View>
              {/* textInput--------- */}
              <View style={{ width: '88%', justifyContent: 'center' }}>
                <TextInput
                  onChangeText={txt => this.setState({ mobile: txt })}
                  value={'' + this.state.mobile + ''}
                  selectionColor={Colors.textInputSelectionColor}
                  placeholder={Lang_chg.Mobile_txt[config.language]}
                  keyboardType="number-pad"
                  placeholderTextColor={Colors.white1}
                  maxLength={15}
                  style={{
                    width: '95%',
                    fontSize: (mobileW * 4) / 100,
                    color: Colors.white1,
                    paddingVertical: (mobileH * 1) / 100,
                    fontFamily: Font.OutfitMedium,
                    textAlignVertical: 'center',
                    marginTop: (mobileW * 0.5) / 100,
                  }}></TextInput>
              </View>
            </View>
            <View
              style={{
                width: '98%',
                height: (mobileW * 0.2) / 100,
                backgroundColor: Colors.white1,
                alignSelf: 'center',
              }}></View>

            {/* .....................For Email.................... */}
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                marginTop: mobileW * 0.08,
                alignItems: 'center',
              }}>
              {/* email Image------------ */}
              <View
                style={{
                  width: '8%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
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
              <View style={{ width: '88%', justifyContent: 'center' }}>
                <TextInput
                  onChangeText={txt => this.setState({ email: txt })}
                  selectionColor={Colors.textInputSelectionColor}
                  value={'' + this.state.email + ''}
                  placeholder={Lang_chg.Email_txt[config.language]}
                  keyboardType="email-address"
                  caretHidden={false}
                  placeholderTextColor={Colors.white1}
                  maxLength={100}
                  style={{
                    width: '95%',
                    fontSize: (mobileW * 4) / 100,
                    color: Colors.white1,
                    paddingVertical: (mobileH * 1) / 100,
                    fontFamily: Font.OutfitMedium,
                    textAlignVertical: 'center',
                    marginTop: (mobileW * 0.5) / 100,
                  }}></TextInput>
              </View>
            </View>
            <View
              style={{
                width: '98%',
                height: (mobileW * 0.2) / 100,
                backgroundColor: Colors.white1,
                alignSelf: 'center',
              }}></View>
            {/* .....................For Password.................... */}

            {this.state.social_data == 'NA' && (
              <>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    marginTop: mobileW * 0.08,
                    alignItems: 'center',
                  }}>
                  <View style={{ width: '8%', justifyContent: 'center' }}>
                    <Image
                      source={localimag.Password}
                      resizeMode="contain"
                      style={{
                        height: (mobileW * 6) / 100,
                        width: (mobileW * 6) / 100,
                      }}
                    />
                  </View>
                  <View style={{ width: '80%', justifyContent: 'center' }}>
                    <TextInput
                      onChangeText={txt => this.setState({ password: txt })}
                      placeholder={Lang_chg.Password_txt[config.language]}
                      keyboardType="default"
                      selectionColor={Colors.textInputSelectionColor}
                      placeholderTextColor={Colors.white1}
                      secureTextEntry={this.state.password_show}
                      maxLength={16}
                      style={{
                        width: '95%',
                        fontSize: (mobileW * 4) / 100,
                        color: Colors.white1,
                        marginTop: mobileW * 0.01,
                        paddingVertical: (mobileH * 1) / 100,
                        fontFamily: Font.OutfitMedium,
                        textAlignVertical: 'center',
                      }}></TextInput>
                  </View>
                  <TouchableOpacity
                    style={{ width: '12%', justifyContent: 'center' }}
                    onPress={() => {
                      this.setState({
                        password_show: !this.state.password_show,
                      });
                    }}>
                    <Text
                      style={{
                        fontSize: (mobileW * 3.3) / 100,
                        fontFamily: Font.OutfitMedium,
                        color: Colors.white1,
                        marginTop: mobileW * 0.01,
                      }}>
                      {this.state.password_show ? 'Show' : 'Hide'}{' '}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    width: '98%',
                    height: (mobileW * 0.2) / 100,
                    backgroundColor: Colors.white1,
                    alignSelf: 'center',
                  }}></View>
              </>
            )}

            {this.state.social_data == 'NA' && (
              <>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    marginTop: mobileW * 0.08,
                    alignItems: 'center',
                  }}>
                  {/* Confirm Password Image------------ */}
                  <View style={{ width: '8%', justifyContent: 'center' }}>
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
                  <View style={{ width: '80%', justifyContent: 'center' }}>
                    <TextInput
                      onChangeText={txt => this.setState({ cpassword: txt })}
                      selectionColor={Colors.textInputSelectionColor}
                      placeholder={Lang_chg.Confirm_txt[config.language]}
                      keyboardType="default"
                      secureTextEntry={this.state.password_show1}
                      placeholderTextColor={Colors.white1}
                      // maxLength={16}
                      maxLength={15}
                      style={{
                        width: '95%',
                        fontSize: (mobileW * 4) / 100,
                        color: Colors.white1,
                        marginTop: mobileW * 0.01,
                        paddingVertical: (mobileH * 1) / 100,
                        fontFamily: Font.OutfitMedium,
                        textAlignVertical: 'center',
                      }}></TextInput>
                  </View>
                  <TouchableOpacity
                    style={{ width: '12%', justifyContent: 'center' }}
                    onPress={() => {
                      this.setState({
                        password_show1: !this.state.password_show1,
                      });
                    }}>
                    <Text
                      style={{
                        fontSize: (mobileW * 3.3) / 100,
                        fontFamily: Font.OutfitMedium,
                        color: Colors.white1,
                        marginTop: mobileW * 0.01,
                      }}>
                      {this.state.password_show1 ? 'Show' : 'Hide'}{' '}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    width: '98%',
                    height: (mobileW * 0.2) / 100,
                    backgroundColor: Colors.white1,
                    alignSelf: 'center',
                  }}></View>
              </>
            )}
            {/* ......................Button.................. */}
            <View style={{ marginTop: mobileW * 0.1 }}>
              <Common_Button
                name={Lang_chg.Step_1_B[config.language]}
                onButtonClick={() => {
                  if (this.state.social_data != 'NA') {
                    this.socialSignup();
                  } else {
                    this.SignupApp();
                  }
                }}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
