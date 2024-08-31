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
// import Mapprovider from './Provider/Mapprovider';
// import Mapprovider from '../Provider/Mapprovider';

export default class Drivre_Delete_Account extends Component {
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
            }}>{Lang_chg.Delete_txt[config.language]}</Text>
          </View>
          <View style={{ width: mobileW * 12 / 100 }}>
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
                  placeholder={Lang_chg.txt_reason[config.language]}
                  keyboardType='default'
                  placeholderTextColor={'#636363'}
                  maxLength={200}
                  multiline={true}
                  style={{  width: '95%', fontSize: mobileW * 4 / 100, color: '#636363', fontFamily: Font.Semibold }}></TextInput>
              </View>
            </View>
            <View style={{ width: '98%', height: 1, backgroundColor: Colors.bottomborder, alignSelf: 'center', marginTop: mobileW * 15 / 100 }}></View>


            {/* .....................For Btn.................... */}
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Driver_Delete_Success')}
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