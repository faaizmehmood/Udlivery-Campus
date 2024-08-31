import {
  Text, View, ImageBackground, Image, TextInput, Dimensions, SafeAreaView, StatusBar, TouchableOpacity,
} from 'react-native';
import React, { Component } from 'react';
const MobileW = Dimensions.get('window').width;
const MobileH = Dimensions.get('window').height;
import { config, Common_Button, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag } from './Provider/utilslib/Utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Mapprovider from './Provider/Mapprovider';
import { borderColor } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';


export default class Step_2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      show1: 1,
      show2: true,
      password_show: true,
      password_show1: true,
      mod: false,

      //radhekrishan
      sel_university_id: this.props.route.params.sel_university_id,

    }
  }

  componentDidMount = async () => {
    let t = await localStorage.getItemObject('user_data');


    consolepro.consolelog('university clicked')
    consolepro.consolelog(t)
  }

  manage_user_Driver_navigation = async () => {
    consolepro.consolelog("this.state.show1", this.state.show1)
    if (this.state.show1 == 1) {
      localStorage.setItemObject('manageUser', 1)
    } else {
      localStorage.setItemObject('manageUser', 2)
    }
    // t = await localStorage.setItemObject('manageUser');
    // consolepro.consolelog(t)
    this.props.navigation.navigate('Signup', { 'sel_university_id': this.state.sel_university_id, 'user_type': this.state.show1 });
  }
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

        <View style={{ width: '86%', alignSelf: 'center', marginTop: mobileW * 0.09 }}>
          {/* .....................For Back img.................... */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => { this.props.navigation.navigate('Step_1') }}
          //          style={{width:mobileW*15/100,justifyContent:'center',
          //    alignItems:'center'}}
          >
            <Image source={localimag.BackW} resizeMode='contain'
              style={{ height: mobileH * 6.5 / 100, width: mobileW * 6.5 / 100 }}></Image>
          </TouchableOpacity>

          <Text style={{ fontSize: mobileW * 0.04, fontFamily: Font.Bold, color: Colors.white1, marginTop: mobileW * 0.13 }}>
            {Lang_chg.Step2_txt[config.language]}
          </Text>

          <Text style={{
            fontSize: mobileW * 0.05, fontFamily: Font.OutfitMedium, color: Colors.white1,
            marginTop: mobileW * 0.08
          }}>
            {Lang_chg.Use_txt[config.language]}
          </Text>




          {/*...................For Active and Deactive  img..........................  */}
          <View style={{
            width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: mobileW * 0.05,

          }}>

            <TouchableOpacity
              activeOpacity={1}
              // style={{ alignItems:'center',backgroundColor:'red'}}
              onPress={() => { this.setState({ show1: 1 }); }}
            >
              {this.state.show1 == 1 ?
                <ImageBackground source={localimag.Orderdeactivate} resizeMode='contain'
                  style={{ height: mobileW * 35 / 100, width: mobileW * 38 / 100, justifyContent: 'center' }}>

                  <View style={{
                    height: mobileW * 28 / 100, width: mobileW * 28 / 100, borderRadius: mobileW * 14 / 100, borderWidth: mobileW * 0.01,
                    alignSelf: 'center', borderColor: Colors.theamColor
                  }}>
                  </View>
                </ImageBackground> :
                <ImageBackground source={localimag.Orderdeactivate} resizeMode='contain'
                  style={{ height: mobileW * 35 / 100, width: mobileW * 38 / 100, justifyContent: 'center' }}>
                </ImageBackground>
              }
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              //  style={{ alignItems:'center',backgroundColor:'red'}}
              onPress={() => { this.setState({ show1: 2 }); }}
            >
              {this.state.show1 == 2 ?
                <ImageBackground source={localimag.Dlivererdeactivate} resizeMode='contain'
                  style={{ height: mobileW * 35 / 100, width: mobileW * 35 / 100, justifyContent: 'center' }}>

                  <View style={{
                    height: mobileW * 28 / 100, width: mobileW * 28 / 100, borderRadius: mobileW * 14 / 100, borderWidth: mobileW * 0.01,
                    alignSelf: 'center', borderColor: Colors.theamColor
                  }}>
                  </View>
                </ImageBackground> :
                <ImageBackground source={localimag.Dlivererdeactivate} resizeMode='contain'
                  style={{ height: mobileW * 35 / 100, width: mobileW * 35 / 100, justifyContent: 'center' }}>
                </ImageBackground>
              }
            </TouchableOpacity>

          </View>
          {/* .................For Text.................... */}
          <View style={{
            width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between',

          }}>
            <Text style={{ width: '41%', textAlign: 'center', fontSize: mobileW * 0.04, fontFamily: Font.OutfitMedium, color: Colors.white1, marginTop: mobileW * 0.03 }}>
              {Lang_chg.Order_txt[config.language]}
            </Text>

            <Text style={{ width: '10%', textAlign: 'center', fontSize: mobileW * 0.04, fontFamily: Font.Bold, color: Colors.white1, marginTop: mobileW * 0.03 }}>

            </Text>

            <Text style={{ width: '41%', textAlign: 'center', fontSize: mobileW * 0.04, fontFamily: Font.OutfitMedium, color: Colors.white1, marginTop: mobileW * 0.03 }}>
              {Lang_chg.Deliver_txt[config.language]}
            </Text>


          </View>
          {/* {--------continue button----------}           */}

          <View style={{ marginTop: mobileW * 0.12 }}>
            <Common_Button
              name={Lang_chg.Step_1_B[config.language]}
              onButtonClick={() => {
                this.manage_user_Driver_navigation()

              }}
            />
          </View>



        </View>
      </View>
    )
  }
}