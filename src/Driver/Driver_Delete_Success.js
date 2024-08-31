import {
  Text, View, ImageBackground, Image, TextInput, Dimensions, Switch, SafeAreaView, FlatList,
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


export default class Driver_Delete_Success extends Component {
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.white1 }}>
        <SafeAreaView style={{ flex: 0, backgroundColor: Colors.white1 }} />
        {/* <StatusBar
          hidden={true}
          backgroundColor={Colors.Red1}
          translucent={false}
          networkActivityIndicatorVisible={true}
          barStyle='light-content'
        /> */}
        <Image source={localimag.done}
          style={{
            height: mobileW * 30 / 100, width: mobileW * 30 / 100, marginTop: mobileW * 0.50,
            alignSelf: 'center',
          }}></Image>
        <View style={{ width: MobileW, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: mobileW * 0.065, fontFamily: Font.Bold, color:Colors.black }}>Success!</Text>
          <Text style={{ fontSize: mobileW * 0.043, fontFamily: Font.Fontregular, color: '#797E82', marginTop: mobileW * 0.04 }}>
            You have successfully deleted</Text>
          <Text style={{ fontSize: mobileW * 0.043, fontFamily: Font.Fontregular, color: '#797E82', marginTop: mobileW * 0.017 }}>
            your account</Text>
          {/* .....................For Btn.................... */}
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Step_1')}
            activeOpacity={0.7}
            style={{
              width: '86%', height: mobileW * 0.13, borderRadius: mobileW * 0.02, marginTop: mobileW * 0.08,
              alignSelf: 'center', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.theamColor
            }}>
            <Text style={{ fontSize: mobileW * 4.3 / 100, fontFamily: Font.OutfitMedium, color: Colors.white1 }}>
              {Lang_chg.txt_done[config.language]}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}