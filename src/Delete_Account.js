import {
  Text, View, ImageBackground, Image, TextInput, Dimensions, Platform, SafeAreaView, StatusBar, TouchableOpacity, Modal
} from 'react-native';
import React, { Component } from 'react';
const MobileW = Dimensions.get('window').width;
const MobileH = Dimensions.get('window').height;
import { config, Common_Button, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag, firebaseprovider } from './Provider/utilslib/Utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Mapprovider from './Provider/Mapprovider';
import { borderColor } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';

export default class Delete_Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id:'',
      reason: '', 

    }
  }

  componentDidMount = () => {
		 
    this.getUserDetail();
   
  };

  getUserDetail = async () => {
		let userdata = await localStorage.getItemObject('user_arr');
		consolepro.consolelog('userdata', userdata);
		// var letter_name = userdata.;
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




  delete_account = async () => {
    // let { message } = this.state;
    // let result = await localStorage.getItemString('user_id');
    // consolepro.consolelog('result', result);
    // let user_id_get = '';
    // if (result != null) {

    //     if (result != null) {
    //         user_id_get = result;
    //     }
    //     this.setState({
    //         user_id: user_id_get,
    //     })
    // }
    // consolepro.consolelog({ message, user_id_get })

    //-----------------------message--------------
    // if (message.trim().length <= 0) {
    //     msgProvider.toast(msgText.emptyReportMessage[config.language], 'center')
    //     return false
    // }
    // var letters1 = config.messagevalidation;
    // if (letters1.test(message) !== true) {
    //     msgProvider.toast(msgText.validReportMessage[config.language], 'center')
    //     return false
    // }
    //-------------------api calling--------------

    let url = config.baseURL + "delete_account.php";
    var data = new FormData();
    data.append('user_id', this.state.user_id)
    data.append('reason', this.state.reason)
    
    consolepro.consolelog('data', data)

    apifuntion.postApi(url, data).then((obj) => {
        consolepro.consolelog('res_arr', obj)

        if (obj.success == 'true') {
          // firebaseprovider.firebaseUserDeleteCase();
          localStorage.clear();
          this.props.navigation.navigate('Delete_Success');
        }
        else {
          if (obj.account_active_status == 0) {
              config.checkUserDeactivate(this.props.navigation);
              return false;
          }
          setTimeout(() => {
            msgProvider.toast(obj.msg[config.language], 'center');
          }, 300);
          return false;
      }
  }).catch((error) => {
    console.log('error',error);  });


}




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
          width: mobileW * 100 / 100, alignItems: 'center', backgroundColor: Colors.theamColor,
        }} >
          <View style={{ width: mobileW * 95 / 100, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center', paddingVertical: mobileW * 3 / 100 }}>
            <TouchableOpacity style={{ width: mobileW * 12 / 100 }} onPress={() => this.props.navigation.goBack()} >
              <Image style={{ height: mobileW * 6 / 100, width: mobileW * 6 / 100, resizeMode: 'contain' }} source={localimag.goback} />
            </TouchableOpacity>
            <View style={{ width: mobileW * 71 / 100, alignItems: 'center', alignSelf: 'center' }}>
              <Text style={{ fontSize: mobileW * 5 / 100, color: Colors.white_color, fontFamily: Font.OutfitMedium }}>{Lang_chg.Delete_txt[config.language]}</Text>
            </View>
            <View style={{ width: mobileW * 12 / 100, alignItems: 'flex-end' }}>
              {/* <Image style={{ height: mobileW * 5 / 100, width: mobileW * 5 / 100, resizeMode: 'contain' }} source={localimag.whitedot} /> */}
            </View>
          </View>
        </View>

        <KeyboardAwareScrollView>

          <View style={{ width: '86%', alignSelf: 'center' }}>

            {/* .....................For msg.................... */}
            <View style={{ width: '96%', alignSelf: 'center', flexDirection: 'row', marginTop: mobileW * 0.05, alignItems: 'center', }}>
              {/* name Image------------ */}
              <View style={{ width: '9%', alignItems: 'center' }}>
                <Image source={localimag.editicon} resizeMode='contain'
                  style={{ height: mobileW * 6 / 100, width: mobileW * 6 / 100, }} /></View>
              {/* textInput--------- */}
              <View style={{ width: '92%', }}>
                <TextInput 
											onChangeText={(txt) => this.setState({ reason: txt })}
                      selectionColor={Colors.textInputSelectionColor1}
                  placeholder={Lang_chg.txt_reason[config.language]}
                  keyboardType='default'
                  placeholderTextColor={'#636363'}
                  maxLength={200}
                  multiline={true}

                  style={{ width: '95%', fontSize: mobileW * 4 / 100, color: '#636363', fontFamily: Font.Semibold }}></TextInput>
              </View>
            </View>
            <View style={{ width: '98%', height: 1, backgroundColor: Colors.bottomborder, alignSelf: 'center', marginTop: mobileW * 15 / 100 }}></View>

            {/* .....................For Btn.................... */}
            <TouchableOpacity
              
              onPress={() => {
                                    
                if (this.state.reason == '') {
                    //FULL NAME
                    msgProvider.toast(msgText.enterreason[config.language], 'center');
                    return false;
                } else if (this.state.reason.trim().length < 3) {
                    msgProvider.toast(msgText.Reasonminimumcharacter[config.language], 'center');
                    return false;
                }
                
                this.delete_account()
                // this.props.navigation.navigate('Delete_Success')
            }}
              
              activeOpacity={0.7}
              style={{
                width: '100%', height: mobileW * 0.13, borderRadius: mobileW * 0.02, marginTop: mobileW * 0.10,
                alignSelf: 'center', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.theamColor
              }}>
              <Text style={{ fontSize: mobileW * 4.3 / 100, fontFamily: Font.OutfitMedium, color: Colors.white1 }}>
                {Lang_chg.Delete_txt[config.language]}
              </Text>
            </TouchableOpacity>







          </View>
        </KeyboardAwareScrollView>
      </View>
    )
  }
}