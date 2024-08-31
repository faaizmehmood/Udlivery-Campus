import {
  Text, View, ImageBackground, Image, TextInput, Dimensions, SafeAreaView, StatusBar, TouchableOpacity, Modal
} from 'react-native';
import React, { Component } from 'react';
const MobileW = Dimensions.get('window').width;
const MobileH = Dimensions.get('window').height;
import { config, Common_Button, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag } from './Provider/utilslib/Utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Mapprovider from './Provider/Mapprovider';
import { borderColor } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';

export default class Change_Password extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      password_show: true,
      password_show1: true,
      old_password:'',
      new_password:'',
      confirm_password: '',
      user_id:''

    }
  }

  componentDidMount = () => {
		 
    this.getUserDetail();
   
  };

  getUserDetail = async () => {
		let userdata = await localStorage.getItemObject('user_arr');
		consolepro.consolelog('userdata', userdata);
		// var letter_name = userdata.user_name;
		// letter_name = letter_name.charAt(0).toUpperCase();
		// consolepro.consolelog({ letter_name });
        this.setState({
            user_id:userdata.user_id,
			// user_type: userdata.user_type,
			// user_name: userdata.name,
			// user_email: userdata.email, 
			// sel_university_id: userdata.university_id, 
        });
        // this.get_university();
        // this.setState({ mod:false})
		// consolepro.consolelog('myusername', this.state.user_name);
	};


  change_password = async () => { 
    if (this.state.old_password.length<=0) {
      msgProvider.toast(msgText.enterenter_oldpassword[config.language], 'center');
      return false;
    }
    if (this.state.old_password.trim().length < 6) {
      msgProvider.toast(msgText.enterMinimum3Character[config.language], 'center');
      return false;
    }
    if (this.state.new_password.length<=0) {
      msgProvider.toast(msgText.enterenter_newpassword[config.language], 'center');
      return false;
    } 
    if (this.state.new_password.trim().length < 6) {
      msgProvider.toast(msgText.enterMinimum3Character[config.language], 'center');
      return false;
    } 
    if (this.state.confirm_password.length<=0) {
      msgProvider.toast(msgText.Pleaseenterconfirmpassword[config.language], 'center');
      return false;
    }
    if (this.state.confirm_password.trim().length < 6) {
      msgProvider.toast(msgText.enterMinimum3Character[config.language], 'center');
      return false;
    }  
    if (this.state.new_password.trim() != this.state.confirm_password.trim()) {
      msgProvider.toast(msgText.Passwordnotmatched[config.language], 'center');
      return false;
    }
        
    let url = config.baseURL + 'change_password.php';
    consolepro.consolelog('url', url);

    var data = new FormData();    
    data.append('user_id', this.state.user_id);  
    data.append('password_old', this.state.old_password);  
    data.append('password_new', this.state.new_password);

    consolepro.consolelog('user data to be edited', data);
    apifuntion.postApi(url, data).then((obj) => {
    consolepro.consolelog('obj', obj);
      if (obj.success == 'true') {   
    
        msgProvider.toast(obj.msg[0], 'center');
        setTimeout(() => {
          this.props.navigation.goBack();
        }, 300);
    } else {
      if (obj.account_active_status == 0) {
          config.checkUserDeactivate(this.props.navigation);
          return false;
      }
      msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
      return false;
  }
}).catch((error) => {
  console.log('error',error);});
    };




  render() {
    return (
      <View style={{ flex: 1, backgroundColor:'#F7F7F7'}}>
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
            }}>{Lang_chg.txt_change_password[config.language]}</Text>
          </View>
          <View style={{ width: mobileW * 12 / 100 }}>
          </View>
        </View>
        <KeyboardAwareScrollView>
          <View style={{ width: '86%', alignSelf: 'center' }}>

            {/* .....................For Old Password.................... */}
            <View style={{ width: '97%', alignSelf: 'center', flexDirection: 'row', marginTop: mobileW * 0.03, alignItems: 'center' }}>
              {/* name Image------------ */}
              <View style={{ width: '9%', justifyContent: 'center' }}>
                <Image source={localimag.passworde} resizeMode='contain'
                  style={{ height: mobileW * 6 / 100, width: mobileW * 6 / 100, }} /></View>
              {/* textInput--------- */}
              <View style={{ width: '82%', justifyContent: 'center' }}>
                <TextInput
                  
											onChangeText={(txt) => this.setState({ old_password: txt })}
                      selectionColor={Colors.textInputSelectionColor1}
                  placeholder={Lang_chg.txt_Old[config.language]}
                  keyboardType='default'
                  secureTextEntry={this.state.password_show}
                  placeholderTextColor={'#636363'}
                  maxLength={16}
                  style={{
                    width: '95%', fontSize: mobileW * 4 / 100, color:'#636363', marginTop: mobileW * 0.01,
                    paddingVertical: mobileH * 1 / 100, fontFamily: Font.OutfitMedium, textAlignVertical: 'center'
                  }}></TextInput>
              </View>
              <TouchableOpacity style={{ width: '12%', justifyContent: 'center' }}
                onPress={() => { this.setState({ password_show: !this.state.password_show }) }}>
                <Text style={{ fontSize: mobileW * 3.3 / 100, fontFamily: Font.OutfitMedium, color:'#636363' , marginTop: mobileW * 0.01, }}>
                  {this.state.password_show ? 'Show' : 'Hide'}   </Text>
              </TouchableOpacity>
            </View>
            <View style={{ width: '100%', height: 1, backgroundColor: Colors.bottomborder, alignSelf: 'center' }}></View>
           
           
            {/* .....................For New Password.................... */}
            <View style={{ width: '97%', alignSelf: 'center', flexDirection: 'row', marginTop: mobileW * 0.03, alignItems: 'center' }}>
              {/* name Image------------ */}
              <View style={{ width: '9%', justifyContent: 'center' }}>
                <Image source={localimag.passworde} resizeMode='contain'
                  style={{ height: mobileW * 6 / 100, width: mobileW * 6 / 100, }} /></View>
              {/* textInput--------- */}
              <View style={{ width: '82%', justifyContent: 'center' }}>
                <TextInput
                selectionColor={Colors.textInputSelectionColor1}
											onChangeText={(txt) => this.setState({ new_password: txt })}
                  placeholder={Lang_chg.txt_New[config.language]}
                  keyboardType='default'
                  secureTextEntry={this.state.password_show1}
                  placeholderTextColor={'#636363'}
                  maxLength={16}
                  style={{
                    width: '95%', fontSize: mobileW * 4 / 100, color:'#636363', marginTop: mobileW * 0.01,
                    paddingVertical: mobileH * 1 / 100, fontFamily: Font.OutfitMedium, textAlignVertical: 'center'
                  }}></TextInput>
              </View>
              <TouchableOpacity style={{ width: '12%', justifyContent: 'center' }}
                onPress={() => { this.setState({ password_show1: !this.state.password_show1 }) }}>
                <Text style={{ fontSize: mobileW * 3.3 / 100, fontFamily: Font.OutfitMedium, color:'#636363' , marginTop: mobileW * 0.01, }}>
                  {this.state.password_show1 ? 'Show' : 'Hide'}   </Text>
              </TouchableOpacity>
            </View>
            <View style={{ width: '100%', height: 1, backgroundColor: Colors.bottomborder, alignSelf: 'center' }}></View>
           
           
           
            {/* .....................For Confirm Password.................... */}
            <View style={{ width: '97%', alignSelf: 'center', flexDirection: 'row', marginTop: mobileW * 0.03, alignItems: 'center' }}>
              {/* name Image------------ */}
              <View style={{ width: '9%', justifyContent: 'center' }}>
                <Image source={localimag.passworde} resizeMode='contain'
                  style={{ height: mobileW * 6 / 100, width: mobileW * 6 / 100, }} /></View>
              {/* textInput--------- */}
              <View style={{ width: '82%', justifyContent: 'center' }}>
                <TextInput
											onChangeText={(txt) => this.setState({ confirm_password: txt })}
                      placeholder={Lang_chg.Confirm_txt[config.language]}
                  keyboardType='default'
                  selectionColor={Colors.textInputSelectionColor1}
                  secureTextEntry={this.state.show}
                  placeholderTextColor={'#636363'}
                  maxLength={16}
                  style={{
                    width: '95%', fontSize: mobileW * 4 / 100, color:'#636363', marginTop: mobileW * 0.01,
                    paddingVertical: mobileH * 1 / 100, fontFamily: Font.OutfitMedium, textAlignVertical: 'center'
                  }}></TextInput>
              </View>
              <TouchableOpacity style={{ width: '12%', justifyContent: 'center' }}
                onPress={() => { this.setState({ show: !this.state.show }) }}>
                <Text style={{ fontSize: mobileW * 3.3 / 100, fontFamily: Font.OutfitMedium, color:'#636363' , marginTop: mobileW * 0.01, }}>
                  {this.state.show ? 'Show' : 'Hide'}   </Text>
              </TouchableOpacity>
            </View>
            <View style={{ width: '100%', height: 1, backgroundColor: Colors.bottomborder, alignSelf: 'center' }}></View>
          
            {/* .....................For Btn.................... */}
            <TouchableOpacity
              onPress={() => {this.change_password()}}
              activeOpacity={0.7}
              style={{
                width: '100%', height: mobileW * 0.13, borderRadius: mobileW * 0.02, marginTop: mobileW * 0.10,
                alignSelf: 'center', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.theamColor
              }}>
              <Text style={{ fontSize: mobileW * 4.3 / 100, fontFamily: Font.OutfitMedium, color: Colors.white1 }}>
                {Lang_chg.txt_Update[config.language]}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>

    )
  }
}