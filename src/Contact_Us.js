import {
  Text, View, ImageBackground, Image, TextInput, Platform, Dimensions, SafeAreaView, StatusBar, TouchableOpacity, Modal
} from 'react-native';
import React, { Component } from 'react';
const MobileW = Dimensions.get('window').width;
const MobileH = Dimensions.get('window').height;
import { config, Common_Button, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag } from './Provider/utilslib/Utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Mapprovider from './Provider/Mapprovider';
import { borderColor } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';

export default class Contact_Us extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //radhekrishan
      name: '',
      email: '',
      message: '',
      user_id: ''

    }
  }

  componentDidMount = () => {

    this.getUserDetail();

  };

  getUserDetail = async () => {
    let userdata = await localStorage.getItemObject('user_arr');
    consolepro.consolelog('userdata', userdata);
    this.setState({
      user_id: userdata.user_id,
      name: userdata.name,
      email: userdata.email,
    });
  };




  contact_us = async () => {



    let url = config.baseURL + 'contact_us_new.php'



    consolepro.consolelog('url', url);
    var data = new FormData();

    data.append('user_id', this.state.user_id);
    data.append('name', this.state.name);
    data.append('email', this.state.email);
    data.append('message', this.state.message);

    consolepro.consolelog('user data to be edited', data);
    console.log(data)
    apifuntion
      .postApi(url, data)
      .then((obj) => {
        consolepro.consolelog('obj', obj);
        if (obj.success == 'true') {
          msgProvider.toast(obj.msg[0], 'center');
          // console.log(obj.msg[0]) Here is the message whhich have to be corrected

          setTimeout(() => {
            //    this.props.navigation.navigate('Home');
            this.props.navigation.goBack();
            // this.props.navigation.navigate('Verify',{user_id:obj.user_details.user_id});
          }, 700);
        } else {
          if (obj.account_active_status == 0) {
            // this.props.navigation.navigate('Login')
            consolepro.consolelog('account_active_status', obj.account_active_status)
            config.checkUserDeactivate(this.props.navigation);
            return false;
          }
          msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
          return false;
        }
      }).catch((error) => {
        console.log('error', error);
      });
  };



  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#F7F7F7' }}>
        <SafeAreaView style={{ flex: 0, backgroundColor: Colors.white1 }} />
        {/* <StatusBar
          hidden={false}
          backgroundColor={Colors.Red1}
          translucent={false}
          networkActivityIndicatorVisible={true}
          barStyle='light-content'
        /> */}
        {/* Header-------------------------------------- */}
        <View style={{
          paddingLeft: mobileW * 0.02, flexDirection: 'row', justifyContent: 'flex-start',
          width: mobileW * 100 / 100, alignItems: 'center', backgroundColor: Colors.theamColor
        }}>
          <TouchableOpacity style={{ width: mobileW * 12 / 100 }}
            onPress={() => this.props.navigation.goBack('')} >
            <Image style={{ height: mobileW * 6 / 100, width: mobileW * 6 / 100, resizeMode: 'contain' }}
              source={localimag.BackW} />
          </TouchableOpacity>
          <View style={{ width: mobileW * 76 / 100, paddingVertical: mobileW * 3 / 100, alignItems: 'center', alignSelf: 'center' }}>
            <Text style={{
              fontSize: mobileW * 5 / 100, color: Colors.white_color,
              fontFamily: Font.OutfitMedium
            }}>{Lang_chg.txt_contact_us[config.language]}</Text>
          </View>
          <View style={{ width: mobileW * 12 / 100 }}>
          </View>
        </View>
        <KeyboardAwareScrollView>
          <View style={{ width: '86%', alignSelf: 'center' }}>
            {/* .....................For Name.................... */}
            <View style={{ width: '96%', alignSelf: 'center', flexDirection: 'row', marginTop: mobileW * 0.05, alignItems: 'center' }}>
              {/* name Image------------ */}
              <View style={{ width: '9%', justifyContent: 'center' }}>
                <Image source={localimag.Usericonc2} resizeMode='contain'
                  style={{ height: mobileW * 6 / 100, width: mobileW * 6 / 100, }} /></View>
              {/* textInput--------- */}
              <View style={{ width: '88%', justifyContent: 'center' }}>
                <TextInput
                  value={this.state.name}
                  onChangeText={(txt) => this.setState({ name: txt })}
                  placeholder={Lang_chg.Name_txt[config.language]}
                  keyboardType='default'
                  selectionColor={Colors.textInputSelectionColor1}
                  placeholderTextColor={Colors.setting}
                  maxLength={50}
                  style={{
                    width: '95%', fontSize: mobileW * 4 / 100, color: Colors.setting, paddingVertical: mobileH * 1 / 100,
                    fontFamily: Font.OutfitMedium, textAlignVertical: 'center', marginTop: mobileW * 0.01,
                  }}></TextInput>
              </View>
            </View>
            <View style={{ width: '100%', height: 1, backgroundColor: Colors.bottomborder, alignSelf: 'center' }}></View>
            {/* .....................For Email.................... */}
            <View style={{ width: '96%', alignSelf: 'center', flexDirection: 'row', marginTop: mobileW * 0.03, alignItems: 'center' }}>
              {/* email Image------------ */}
              <View style={{ width: '9%', justifyContent: 'center', }}>
                <Image source={localimag.Emailiconc2} resizeMode='contain'
                  style={{ height: mobileW * 6 / 100, width: mobileW * 6 / 100, }} /></View>
              {/* textInput--------- */}
              <View style={{ width: '88%', justifyContent: 'center', }}>
                <TextInput
                  value={this.state.email}
                  onChangeText={(txt) => this.setState({ email: txt })}
                  placeholder={Lang_chg.Email_txt[config.language]}
                  keyboardType='email-address'
                  selectionColor={Colors.textInputSelectionColor1}
                  placeholderTextColor={Colors.setting}
                  maxLength={50}
                  style={{
                    width: '95%', fontSize: mobileW * 4 / 100, color: Colors.setting, paddingVertical: mobileH * 1 / 100,
                    fontFamily: Font.OutfitMedium, textAlignVertical: 'center', marginTop: mobileW * 0.01,
                  }}></TextInput>
              </View>
            </View>
            <View style={{ width: '100%', height: 1, backgroundColor: Colors.bottomborder, alignSelf: 'center' }}></View>

            {/* .....................For msg.................... */}
            <View style={{ width: '96%', alignSelf: 'center', flexDirection: 'row', marginTop: mobileW * 0.05, alignItems: 'center', }}>
              {/* name Image------------ */}
              <View style={{ width: '8%' }}>
                <Image source={localimag.editicon} resizeMode='contain'
                  style={{ height: mobileW * 6 / 100, width: mobileW * 6 / 100, }} />
              </View>
              {/* textInput--------- */}
              <View style={{ width: '92%', }}>
                <TextInput
                  selectionColor={Colors.textInputSelectionColor1}
                  onChangeText={(txt) => this.setState({ message: txt })}
                  placeholder={Lang_chg.txt_msg[config.language]}
                  keyboardType='default'
                  placeholderTextColor={Colors.setting}
                  maxLength={200}
                  multiline={true}
                  style={{ width: '95%', fontSize: mobileW * 4 / 100, color: Colors.mediumgrey, fontFamily: Font.OutfitMedium, }}></TextInput>
              </View>
            </View>
            <View style={{ width: '98%', height: 1, backgroundColor: Colors.bottomborder, alignSelf: 'center', marginTop: mobileW * 15 / 100 }}></View>


            {/* .....................For Btn.................... */}
            <TouchableOpacity
              onPress={() => {
                if (this.state.name == '') {
                  //FULL NAME
                  msgProvider.toast(msgText.enterfullname[config.language], 'center');
                  return false;
                } else if (this.state.name.trim().length < 3) {
                  msgProvider.toast(msgText.minimum_characters_Message[config.language], 'center');
                  return false;
                } else if (this.state.email.trim().length <= 0) {
                  //email
                  msgProvider.toast(msgText.enteremail[config.language], 'center');
                  return false;
                } else if (config.regemail.test(this.state.email) !== true) {
                  msgProvider.toast(msgText.entervalidemail[config.language], 'center');
                  //console.log('i am in invalid email');
                  return false;
                }
                else if (this.state.message == '') {
                  //FULL NAME
                  msgProvider.toast(msgText.entermessage[config.language], 'center');
                  return false;
                } else if (this.state.message.trim().length < 3) {
                  msgProvider.toast(msgText.minimum_characters_Message[config.language], 'center');
                  return false;
                }





                // this.props.navigation.goBack('')
                this.contact_us()

              }}
              activeOpacity={0.7}
              style={{
                width: '100%', height: mobileW * 0.13, borderRadius: mobileW * 0.02, marginTop: mobileW * 0.10,
                alignSelf: 'center', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.theamColor
              }}>
              <Text style={{ fontSize: mobileW * 0.045, fontFamily: Font.Bold, color: Colors.white1 }}>
                {Lang_chg.send[config.language]}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>
    )
  }
}