import {
  Text, View, ImageBackground, Image, TextInput, Dimensions, Switch, SafeAreaView, FlatList,
  StatusBar, TouchableOpacity, StyleSheet, Modal
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

export default class Driver_Location extends Component {
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.white1 }}>
        <SafeAreaView style={{ flex: 0, backgroundColor: Colors.white1 }} />
        {/* <StatusBar
          hidden={false}
          backgroundColor={Colors.Red1}
          translucent={false}
          networkActivityIndicatorVisible={true}
          barStyle='light-content'
        /> */}
        {/* Header-------------------------------------- */}
        {/* <View style={{paddingLeft: mobileW * 0.02, flexDirection: 'row', justifyContent: 'flex-start',
        width: mobileW * 100 / 100, alignItems: 'center', backgroundColor: Colors.theamColor}}>
        <TouchableOpacity style={{ width: mobileW * 12 / 100 }} 
        onPress={() => this.props.navigation.goBack('')} >
        <Image style={{ height: mobileW * 6.5 / 100, width: mobileW * 6.5 / 100, resizeMode: 'contain' }} 
        source={localimag.BackW} />
        </TouchableOpacity>
        <View style={{ width: mobileW * 76/ 100, paddingVertical: mobileW * 3 / 100, alignItems: 'center',
        alignSelf: 'center' }}>
        <Text style={{ fontSize: mobileW * 5 / 100, color: Colors.white_color,
        fontFamily: Font.regular }}>{Lang_chg.location_One[config.language]}</Text>
        </View>
        <View style={{ width: mobileW * 12 / 100 }}>
        </View>
        </View> */}
        {/* img-------------------------------------- */}
        <ImageBackground
          source={localimag.Mapimg}
          resizeMode='cover'
          style={{ height: '100%', width: '100%' }}
        >
          <TouchableOpacity
            // onPress={() => { this.props.navigation.navigate('ParcelDetails2') }}
            onPress={() => {
              this.props.navigation.goBack();
            }}
            style={{
              position: 'absolute', zIndex: 999,
              marginLeft: mobileW * 0.03, marginTop: mobileW * 0.01
            }}>
            <Image source={localimag.backCircle} resizeMode='contain'

              style={{ height: mobileH * 10 / 100, width: mobileW * 10 / 100 }}></Image>
          </TouchableOpacity>

        </ImageBackground>
      </View>
    )
  }
}