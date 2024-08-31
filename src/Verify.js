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
  notification,
} from './Provider/utilslib/Utils';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import OTPTextInput from 'react-native-otp-textinput';
import PushNotification from 'react-native-push-notification';
import CountDown from '@husam287/react-native-countdown-component';

export default class Verify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show1: '',
      otp: '',
      user_id: this.props.route.params.user_id,
      email: this.props.route.params.email,
      startDisable: true,
    };
  }

  // Push Notification Configurations

  sendPushNotification(title, message) {
    PushNotification.localNotification({
      channelId: 'default',
      title,
      message,
    });
  }

  // -------------------------------

  manage_user_Driver_navigation = async () => {
    // var manageUser = await localStorage.getItemObject('manageUser')
    var user_details = await localStorage.getItemObject('user_arr');
    //console.log('manageUser', manageUser)

    if (user_details.user_type == 2) {
      // this.sendPushNotification('Welcome!', 'You are successfully registered.')
      this.props.navigation.navigate('Become_delivery', {
        user_id: this.state.user_id,
      });
    }
    // else if (manageUser == '0') {

    //   this.props.navigation.navigate('Home');
    // }
    else {
      // this.sendPushNotification('Welcome!', 'You are successfully registered.')
      this.props.navigation.navigate('Home');
    }
    // localStorage.clear()
    // this.props.navigation.navigate('Signup');
  };

  componentDidMount() {
    //   this.setText()
    //   this.props.navigation.addListener('focus', () => {
    //     // this.checksocial()
    //     this.setText()
    //  });
  }

  setText = () => {
    //consolepro.consolelog('show_otp',this.state.send_msg_data.otp_get)
    var show_otp = this.state.send_msg_data.showotp;
    var get_otp = this.state.send_msg_data.otp_get;
    if (this.state.fillotp == false) {
      this.otpInput.setValue('');
      this.setState({otpstatus: ''});
    } else {
      this.otpInput.setValue(get_otp);
      this.setState({otpstatus: get_otp});
    }
  };

  otp_verify = async () => {
    let url = config.baseURL + 'otp_verify.php';
    consolepro.consolelog('url of Verify.js==>', url);
    var data = new FormData();
    data.append('user_id', this.state.user_id);
    data.append('otp', this.state.otp);

    apifuntion
      .postApi(url, data)
      .then(obj => {
        consolepro.consolelog('obj', obj);
        if (obj.success == 'true') {
          //console.log('otp verified successsfully');
          let user_details = obj.user_details;

          localStorage.setItemObject('user_arr', user_details);

          var notification_arr = obj.notification_arr;
          if (notification_arr != 'NA') {
            consolepro.consolelog({notification_arr});
            notification.notification_arr(notification_arr);
          }
          this.manage_user_Driver_navigation();
        } else {
          if (obj.account_active_status == 0) {
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

      let userDataInfo = await localStorage?.getItemObject('user_arr');

      this.props.setToken(userDataInfo?.user_id);
  };

  //-----------------------email send function--------------
  mailsendfunction = email_arr => {
    //console.log('email_arr', email_arr);
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

      // api calling start==============================
      apifuntion.postApi(url, data, 1).then(obj => {
        consolepro.consolelog('email_arr', obj);

        if (obj.success == 'true') {
          consolepro.consolelog('Response', 'Mail Send Success');
        } else {
          consolepro.consolelog('Response', 'mail not send');
        }
        // api calling end==============================
      });
    }
  };

  resend_code = async () => {
    let url = config.baseURL + 'resend_otp.php';
    consolepro.consolelog('url', url);
    var data = new FormData();
    data.append('user_id', this.state.user_id);

    // data.append('password', this.state.password);
    // data.append('action', 'normal');
    // // data.append("player_id", player_id_me1);
    // data.append("player_id", config.player_id_me1);
    // data.append("device_type", config.device_type);

    apifuntion
      .postApi(url, data)
      .then(obj => {
        consolepro.consolelog('obj', obj);
        if (obj.success == 'true') {
          this.setState({startDisable: true});

          msgProvider.toast(obj.msg[0], 'center');

          var email_arr = obj.email_arr;

          if (typeof email_arr !== 'undefined') {
            if (email_arr != 'NA') {
              this.mailsendfunction(email_arr);
            }
          }

          // localStorage.setItemObject('user_arr', obj.user_details);

          // setTimeout(() => {
          //    this.props.navigation.navigate('Home');
          //   // this.props.navigation.navigate('Verify',{user_id:obj.user_details.user_id});
          // }, 700);
        } else {
          // msgProvider.toast(obj.success, 'center');
          // setTimeout(() => {
          //   msgProvider.toast(obj.success, 'center');
          // }, 300);

          //   if (obj.active_status == 0 || obj.msg == msgTitle.user_not_exist[config.language]) {
          //       consolepro.consolelog('acitve status1',obj.active_status);
          //       msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
          //       config.checkUserDeactivate(this.props.navigation)
          //   } else {
          msgProvider.alert(
            msgTitle.information[config.language],
            obj.message[0],
            false,
          );

          // }
          return false;
        }
      })
      .catch(error => {
        console.log('-------- error ------- ' + error);
      });
  };

  render() {
    return (
      <View style={{flex: 1, backgroundColor: Colors.theamColor}}>
        <SafeAreaView style={{flex: 0, backgroundColor: Colors.theamColor}} />
        {/* <StatusBar
          backgroundColor={Colors.theamColor}
          hidden={false}
          barStyle={'light-content'}
          // backgroundColor={Colors.back_color}
          translucent={false}
          networkActivityIndicatorVisible={true}
        /> */}
        <KeyboardAwareScrollView>
          {/* .....................For Main view.................... */}
          <View
            style={{
              width: '86%',
              alignSelf: 'center',
              marginTop: mobileW * 0.1,
            }}>
            {/* .....................For Back img.................... */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                this.props.navigation.goBack();
              }}
              //onPress={() => { this.props.navigation.navigate('Step_2') }}
              //style={{width:mobileW*15/100,justifyContent:'center',
              //alignItems:'center'}}
            >
              <Image
                source={localimag.BackW}
                resizeMode="contain"
                style={{
                  height: (mobileH * 6.5) / 100,
                  width: (mobileW * 6.5) / 100,
                }}></Image>
            </TouchableOpacity>
            {/* .....................For Text.................... */}
            <Text
              style={{
                fontSize: mobileW * 0.05,
                fontFamily: Font.Semibold,
                color: Colors.white1,
                marginTop: mobileW * 0.08,
              }}>
              Enter Your Verification Code
            </Text>

            {/*Verification--------------  */}
            <View
              style={{
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  marginTop: (mobileW * 21) / 100,
                  fontSize: (mobileW * 3.8) / 100,
                  fontFamily: Font.Fontregular,
                  color: Colors.white1,
                }}>
                Please type the verification code sent to
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: (mobileW * 0.5) / 100,
                }}>
                <Text
                  style={{
                    fontSize: (mobileW * 3.8) / 100,
                    fontFamily: Font.Fontregular,
                    color: Colors.white1,
                    marginTop: mobileW * 0.005,
                  }}>
                  {/* recharddoe@gmail.com */}
                  {this.state.email}
                </Text>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Signup')}
                  style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Text
                    style={{
                      paddingLeft: (mobileW * 1) / 100,
                      color: Colors.white1,
                      fontFamily: Font.Fontregular,
                      fontSize: (mobileH * 2.1) / 100,
                    }}>
                    Edit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* OTP Verification--------------  */}
            {/* <View style={{
              width: '70%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between',
              marginTop: mobileW * 0.08
            }}>
              <View style={{
                width: mobileW * 0.12, height: mobileW * 0.12, borderRadius: mobileW * 0.6,
                borderWidth: 3, backgroundColor: '#3B63CF',
                borderColor: Colors.white1, justifyContent: 'center', alignItems: 'center'
              }}>
                <TextInput
                  keyboardType='numeric'
                  placeholderTextColor={Colors.white1}
                  maxLength={1}
                  style={{
                    fontSize: mobileW * 5.6 / 100, color: Colors.white1, textAlign: 'center',
                    paddingVertical: mobileH * 1 / 100, fontFamily: Font.Bold, textAlignVertical: 'center'
                  }}>
                </TextInput>
              </View>
              <View style={{
                width: mobileW * 0.12, height: mobileW * 0.12, borderRadius: mobileW * 0.6, borderWidth: 3,
                borderColor: Colors.white1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#3B63CF',
              }}>
                <TextInput
                  keyboardType='numeric'
                  placeholderTextColor={Colors.white1}
                  maxLength={1}
                  style={{
                    fontSize: mobileW * 5.6 / 100, color: Colors.white1, textAlign: 'center',
                    paddingVertical: mobileH * 1 / 100, fontFamily: Font.Bold, textAlignVertical: 'center'
                  }}>
                </TextInput>
              </View>
              <View style={{
                width: mobileW * 0.12, height: mobileW * 0.12, borderRadius: mobileW * 0.6, borderWidth: 3,
                borderColor: Colors.white1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#3B63CF',
              }}>
                <TextInput
                  keyboardType='numeric'
                  placeholderTextColor={Colors.white1}
                  maxLength={1}
                  style={{
                    fontSize: mobileW * 5.6 / 100, color: Colors.white1, textAlign: 'center',
                    paddingVertical: mobileH * 1 / 100, fontFamily: Font.Bold, textAlignVertical: 'center'
                  }}>
                </TextInput>
              </View>
              <View style={{
                width: mobileW * 0.12, height: mobileW * 0.12, borderRadius: mobileW * 0.6, borderWidth: 3,
                borderColor: Colors.white1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#3B63CF',
              }}>
                <TextInput
                  keyboardType='numeric'
                  placeholderTextColor={Colors.white1}
                  maxLength={1}
                  style={{
                    fontSize: mobileW * 5.6 / 100, color: Colors.white1, textAlign: 'center',
                    paddingVertical: mobileH * 1 / 100, fontFamily: Font.Bold, textAlignVertical: 'center'
                  }}>
                </TextInput>
              </View>
            </View> */}

            {/* otp values */}
            <View
              style={{
                marginVertical: (mobileW * 5) / 100,
                width: '60%',
                alignSelf: 'center',
                // width: mobileW * 80 / 100,
                // backgroundColor: 'red'
              }}>
              <OTPTextInput
                ref={e => (this.otpInput = e)}
                defaultValue={this.state.otp}
                containerStyle={{width: '20%'}}
                handleTextChange={text => this.setState({otp: text})}
                textInputStyle={{
                  width: '100%',
                  // color: Colors.digiinputtextcolor,
                  // color: 'red',
                  color: 'white',
                  fontSize: (mobileW * 5) / 100,
                  // backgroundColor: Colors.white_smoke,
                  // backgroundColor: 'green',
                  backgroundColor: '#3B63CF',
                  // borderBottomColor: Colors.white_smoke,
                  // borderBottomColor: 'pink',
                  borderRadius: (mobileW * 1) / 100,
                  padding: (mobileW * 1) / 100,
                  height: (mobileW * 11) / 100,
                  textAlign: 'center',
                  borderRadius: 100,
                  borderWidth: 4,
                }}
                returnKeyLabel="done"
                returnKeyType="done"
                inputCount={4}
                cellTextLength={1}
                tintColor="#f5f5ff"
                offTintColor="#f5f5ff"
                keyboardType={'number-pad'}
              />
            </View>

            {/* ......................Button.................. */}
            {/* <View style={{ marginTop: mobileW * 0.1 }}>
              <Common_Button
                name_Verify={'Verify'}
                onButtonClick={() => {
                  this.props.navigation.navigate('Become_delivery');
                }} />
            </View> */}

            <TouchableOpacity
              activeOpacity={1}
              // style={{width:mobileW*7/100, alignItems:'center',backgroundColor:'red'}}
              onPress={() => {
                this.setState({show1: 0});
              }}>
              <View style={{marginTop: mobileW * 0.1}}>
                <Common_Button
                  name_Verify={'Verify'}
                  onButtonClick={() => {
                    if (this.state.otp.length <= 0) {
                      msgProvider.toast(
                        msgText.empty4OtpMsg[config.language],
                        'center',
                      );
                      return false;
                    }
                    if (this.state.otp.length < 4) {
                      msgProvider.toast(
                        msgText.invalidOtp[config.language],
                        'center',
                      );
                      return false;
                    }

                    // this.manage_user_Driver_navigation()
                    this.otp_verify();
                  }}
                />
              </View>
            </TouchableOpacity>

            {this.state.startDisable == true ? (
              <CountDown
                until={59.5 * 2}
                size={(mobileW * 4) / 100}
                onFinish={() => {
                  this.setState({startDisable: false});
                }}
                digitStyle={{color: Colors.theme_color1}}
                digitTxtStyle={{color: Colors.theme_color1, marginTop: 1.5}}
                timeLabelStyle={{fontSize: 1}}
                timeToShow={['M', 'S']}
                timeLabels={{m: '', s: ''}}
                separatorStyle={{color: Colors.theme_color1}}
                showSeparator={true}
                // style={CSSstyle.resendtouch}
                style={{
                  justifyContent: 'center',
                  alignSelf: 'center',
                  width: 150,
                  marginTop: (mobileW * 3) / 100,
                }}
              />
            ) : (
              <Text
                onPress={() => {
                  this.resend_code();
                }}
                style={{
                  fontSize: (mobileW * 4.6) / 100,
                  marginTop: (mobileW * 8) / 100,
                  fontFamily: Font.Semibold,
                  color: Colors.white1,
                  textDecorationLine: 'underline',
                  textAlign: 'center',
                }}>
                Resend Code
              </Text>
            )}
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
