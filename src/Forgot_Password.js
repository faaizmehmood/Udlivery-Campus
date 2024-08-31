import {
  Text, View, ImageBackground, Image, TextInput, Dimensions, SafeAreaView, StatusBar, TouchableOpacity,
} from 'react-native';
import React, { Component } from 'react';
const MobileW = Dimensions.get('window').width;
const MobileH = Dimensions.get('window').height;
import { config, Common_Button, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag } from './Provider/utilslib/Utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Mapprovider from './Provider/Mapprovider';

export default class Forgot_Password extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      email: '', 
    }
  }

   //-----------------------email send function--------------
   mailsendfunction = (email_arr) => {
    //console.log('email_arr', email_arr);
    for (let i = 0; i < email_arr.length; i++) {
        var email = email_arr[i].email;
        var mailcontent = email_arr[i].mailcontent
        var mailsubject = email_arr[i].mailsubject
        var fromName = email_arr[i].fromName
        var url = config.baseURL + 'mailFunctionsSend.php';
        var data = new FormData();
        data.append("email", email);
        data.append("mailcontent", mailcontent);
        data.append("mailsubject", mailsubject);
        data.append("fromName", fromName);
        data.append("mail_file", 'NA');
        consolepro.consolelog('verification==', data);

        // api calling start==============================
        apifuntion.postApi(url, data, 1).then((obj) => {

            consolepro.consolelog('email_arr', obj)

            if (obj.success == 'true') {
                consolepro.consolelog('Response', 'Mail Send Success');
            } else {
                consolepro.consolelog('Response', 'mail not send');
            }
            // api calling end==============================    
        })
    }
}

  
  reset_password = async () => { 
		let url = config.baseURL + 'forgot_password.php';
    consolepro.consolelog('url', url);
    var data = new FormData();    
    data.append('email', this.state.email)
      apifuntion.postApi(url, data).then((obj) => {
          consolepro.consolelog('obj', obj);
          if (obj.success == 'true') { 
           
            var email_arr = obj.email_arr;

            if (typeof email_arr !== 'undefined') {
              if (email_arr != 'NA') {
                  this.mailsendfunction(email_arr);
              }
          }
            setTimeout(() => {
              msgProvider.toast(obj.msg[0], 'center');
            }, 300);
            this.props.navigation.navigate('Login');
          } else {
            if (obj.account_active_status == 0) {
                config.checkUserDeactivate(this.props.navigation);
                return false;
            }
            setTimeout(() => {
              msgProvider.toast(obj.msg[0], 'center');
            }, 300);
            return false;
        }
    }).catch((error) => {
      console.log(error);
    });
	};



  render() {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.theamColor }}>

        <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theamColor }} />
        {/* <StatusBar
          backgroundColor={Colors.theamColor}
          hidden={false}
          barStyle={'light-content'}
          // backgroundColor={Colors.back_color}
          translucent={false}
          networkActivityIndicatorVisible={true}
        /> */}
        <KeyboardAwareScrollView>

          <View style={{ width: '86%', alignSelf: 'center', marginTop: mobileW * 0.10 }}>
            {/* .....................For Back img.................... */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => { this.props.navigation.navigate('Login') }}
            //          style={{width:mobileW*15/100,justifyContent:'center',
            //    alignItems:'center'}}
            >
              <Image source={localimag.BackW} resizeMode='contain'
                style={{ height: mobileH * 6.5 / 100, width: mobileW * 6.5 / 100, }}></Image>
            </TouchableOpacity>
            {/* .....................For Logo img.................... */}
            <Image source={localimag.Usericon} resizeMode='contain'
              style={{ height: mobileH * 18 / 100, width: mobileW * 32 / 100, alignSelf: 'center', marginTop: mobileW * -0.06 }}></Image>
            {/* .....................For Login txt.................... */}
            <View
              style={{
                width: '100%', alignSelf: 'center',
                marginTop: mobileH * 12 / 100,
              }}>
              <Text
                style={{ fontFamily: Font.Bold, fontSize: mobileW * 5 / 100, color: Colors.white1 }}>
                Forgot Password?
              </Text>
            </View>
            {/* .....................For Email.................... */}
            <View style={{
              width: '100%', flexDirection: 'row', marginTop: mobileW * 0.08,
              alignItems: 'center',
            }}>
              {/* email Image------------ */}
              <View style={{ width: '8%', justifyContent: 'center' }}>
                <Image source={localimag.Emailicon} resizeMode='contain'
                  style={{ height: mobileW * 6 / 100, width: mobileW * 6 / 100, }} />
              </View>
              {/* textInput--------- */}
              <View style={{ width: '90%', justifyContent: 'center', }}>
                <TextInput
                  onChangeText={(txt) => this.setState({ email: txt })}
                  selectionColor={Colors.textInputSelectionColor}
                  placeholder={Lang_chg.Email_txt[config.language]}
                  keyboardType='email-address'
                  placeholderTextColor={Colors.white1}
                  maxLength={50} style={{
                    width: '95%',
                    fontSize: mobileW * 4 / 100, color: '#ffff',
                    paddingVertical: mobileH * 1 / 100,
                    fontFamily: Font.Bold,
                    textAlignVertical: 'center'
                  }}></TextInput>
              </View>
            </View>
            <View style={{ width: '98%', height: mobileW * 0.2 / 100, backgroundColor: Colors.white1, alignSelf: 'center' }}></View>
            {/*Button---------- */}
            <View style={{ marginTop: mobileW * 0.12 }}>
              <Common_Button
                name_Login={'Reset Password'}
                onButtonClick={() => {
                  if (this.state.email.trim().length <= 0) {
                    //email
                    msgProvider.toast(msgText.enteremail[config.language], 'center');
                    return false;
                  } else if (config.regemail.test(this.state.email) !== true) {
                    msgProvider.toast(msgText.entervalidemail[config.language], 'center');
                    //console.log('i am in invalid email');
                    return false;
                  } 


                  this.reset_password();



                }}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    )
  }
}