import {
  Text, View, ImageBackground, Image, TextInput, Dimensions, Switch, SafeAreaView, FlatList, Platform,
  StatusBar, TouchableOpacity, StyleSheet
} from 'react-native';
import React, { Component } from 'react';
const MobileW = Dimensions.get('window').width;
const MobileH = Dimensions.get('window').height;
import {
  config, Common_Button, msgProvider, localStorage, apifuntion, msgText, msgTitle,
  consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag
} from '../Provider/utilslib/Utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { color } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';



export default class Driver_Contact_Us extends Component {
  render() {
    return (
      <View style={{ flex: 1, backgroundColor:'#F7F7F7' }}>
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
              <View style={{ width: '8%', justifyContent: 'center' }}>
                <Image source={localimag.Usericonc2} resizeMode='contain'
                  style={{ height: mobileW * 6 / 100, width: mobileW * 6 / 100, }} /></View>
              {/* textInput--------- */}
              <View style={{ width: '92%', justifyContent: 'center' }}>
                <TextInput placeholder={Lang_chg.Name_txt[config.language]}
                  keyboardType='default'
                  placeholderTextColor={Colors.mediumgrey}
                  maxLength={50}
                  style={{
                    width: '95%', fontSize: mobileW * 4 / 100, color: Colors.mediumgrey, paddingVertical: mobileH * 1 / 100,
                    fontFamily: Font.Semibold, textAlignVertical: 'center', marginTop: mobileW * 0.01,
                  }}></TextInput>
              </View>
            </View>
            <View style={{ width: '98%', height: 1, backgroundColor: Colors.bottomborder, alignSelf: 'center' }}></View>
            {/* .....................For Email.................... */}
            <View style={{ width: '96%', alignSelf: 'center', flexDirection: 'row', marginTop: mobileW * 0.03, alignItems: 'center' }}>
              {/* email Image------------ */}
              <View style={{ width: '8%', justifyContent: 'center' }}>
                <Image source={localimag.Emailiconc2} resizeMode='contain'
                  style={{ height: mobileW * 6 / 100, width: mobileW * 6 / 100, }} /></View>
              {/* textInput--------- */}
              <View style={{ width: '92%', justifyContent: 'center' }}>
                <TextInput placeholder={Lang_chg.Email_txt[config.language]}
                  keyboardType='email-address'
                  placeholderTextColor={Colors.mediumgrey}
                  maxLength={50}
                  style={{
                    width: '95%', fontSize: mobileW * 4 / 100, color: Colors.mediumgrey, paddingVertical: mobileH * 1 / 100,
                    fontFamily: Font.Semibold, textAlignVertical: 'center', marginTop: mobileW * 0.01,
                  }}></TextInput>
              </View>
            </View>
            <View style={{ width: '98%', height: 1, backgroundColor: Colors.bottomborder, alignSelf: 'center' }}></View>


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
              onPress={() => this.props.navigation.goBack('')}
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