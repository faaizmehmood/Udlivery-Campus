import {
  Text, View, ImageBackground, Image, TextInput, Dimensions, SafeAreaView, StatusBar, TouchableOpacity, Modal, FlatList, StyleSheet
} from 'react-native';
import React, { Component } from 'react';
const MobileW = Dimensions.get('window').width;
const MobileH = Dimensions.get('window').height;
import { config, Common_Button, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag } from './Provider/utilslib/Utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Mapprovider from './Provider/Mapprovider';

export default class Location extends Component {
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.white1 }}>
        <SafeAreaView style={{ flex: 0, backgroundColor: Colors.white1 }} />
        <StatusBar
          hidden={false}
          backgroundColor={Colors.Red1}
          translucent={false}
          networkActivityIndicatorVisible={true}
          barStyle='light-content'
        />
        {/* Header-------------------------------------- */}
        <View style={{
          width: mobileW * 100 / 100, alignItems: 'center', backgroundColor: Colors.theamColor,
        }} >
          <View style={{ width: mobileW * 95 / 100, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center', paddingVertical: mobileW * 3 / 100 }}>
            <TouchableOpacity style={{ width: mobileW * 12 / 100 }} onPress={() => this.props.navigation.goBack()} >
              <Image style={{ height: mobileW * 6 / 100, width: mobileW * 6 / 100, resizeMode: 'contain' }} source={localimag.goback} />
            </TouchableOpacity>
            <View style={{ width: mobileW * 71 / 100, alignItems: 'center', alignSelf: 'center' }}>
              <Text style={{ fontSize: mobileW * 5 / 100, color: Colors.white_color, fontFamily: Font.OutfitMedium }}>{Lang_chg.location_One[config.language]}</Text>
            </View>
            <View style={{ width: mobileW * 12 / 100, alignItems: 'flex-end' }}>
              {/* <Image style={{ height: mobileW * 5 / 100, width: mobileW * 5 / 100, resizeMode: 'contain' }} source={localimag.whitedot} /> */}
            </View>
          </View>
        </View>
        {/* img-------------------------------------- */}
        <ImageBackground
          source={localimag.Mapimg}
          resizeMode='cover'
          style={{ height: '100%', width: '100%' }}
        >
          {/*Search----------------------  */}
          <View
            style={{
              flexDirection: 'row', width: mobileW * 100 / 100, borderRadius: mobileW * 1 / 100, backgroundColor: '#FDFDFD', paddingVertical: mobileW * 1 / 100, shadowColor: Colors.shadow_color, shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.20, elevation: 1, alignSelf: 'center',
            }}>
            <Image style={{
              height: mobileW * 4.8 / 100, width: mobileW * 4.8 / 100, resizeMode: 'contain', alignSelf: 'center', justifyContent: 'center', marginLeft: mobileW * 2 / 100,
            }} source={localimag.searchg}></Image>
            <TextInput
              style={{
                width: '88%', justifyContent: 'center', paddingLeft: mobileW * 1 / 100, alignSelf: 'center', fontFamily: Font.fontregular, paddingVertical: mobileW * 2 / 100, color: Colors.light_grey, fontSize: mobileW * 4.2 / 100
              }}
              onChangeText={(txt) => { this.setState({ password: txt }) }}
              maxLength={53}
              selectionColor={Colors.textInputSelectionColor1}
              returnKeyLabel='done'
              returnKeyType='done'
              onSubmitEditing={() => { Keyboard.dismiss() }}
              placeholderTextColor={Colors.light_grey} placeholder={'Search Location'}
            />
          </View>

          <TouchableOpacity
            onPress={() => { this.props.navigation.goBack() }}
            style={{
              flexDirection: 'row', width: mobileW * 90 / 100,
              alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
              borderRadius: mobileW * 1 / 100, bottom: 0, position: 'absolute', marginBottom: mobileW * 0.2,
              padding: mobileW * 4 / 100, backgroundColor: Colors.removecolor
            }}>
            <Text style={{
              fontSize: mobileW * 3.8 / 100, color: Colors.white_color,
              fontFamily: Font.OutfitMedium, textAlign: 'center', paddingLeft: 3.5
            }}>
              {Lang_chg.Step_1_B[config.language]}
            </Text>
          </TouchableOpacity>
        </ImageBackground>

      </View>
    )
  }
}