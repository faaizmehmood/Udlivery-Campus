import {
  Text,
  View,
  ImageBackground,
  Image,
  TextInput,
  Dimensions,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import React, {Component} from 'react';
const MobileW = Dimensions.get('window').width;
const MobileH = Dimensions.get('window').height;
import {
  config,
  msgProvider,
  localStorage,
  apifuntion,
  msgText,
  msgTitle,
  consolepro,
  Lang_chg,
  Font,
  Colors,
  mobileH,
  mobileW,
  localimag,
} from './Provider/utilslib/Utils';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Mapprovider from './Provider/Mapprovider';

export default class WelCome_Screen extends Component {
  componentDidMount = async () => {
    localStorage.setItemString('page', '1');
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 0, backgroundColor: Colors.theamColor}} />

        <View style={{flex: 1, backgroundColor: Colors.theamColor}}>
          <Image
            source={localimag.welcomelogo}
            resizeMode="contain"
            style={{
              height: (mobileH * 70) / 100,
              width: '85%',
              alignSelf: 'center',
            }}></Image>

          <View
            style={{
              width: MobileW,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontSize: mobileW * 0.1,
                fontFamily: Font.Semibold,
                color: Colors.white1,
              }}>
              {Lang_chg.txt_welcome[config.language]}{' '}
            </Text>
            <Text
              style={{
                fontSize: mobileW * 0.04,
                fontFamily: Font.Fontregular,
                color: Colors.white1,
                marginTop: mobileW * 0.02,
              }}>
              {Lang_chg.txt_1[config.language]}
            </Text>
            <Text
              style={{
                fontSize: mobileW * 0.04,
                fontFamily: Font.Fontregular,
                color: Colors.white1,
                marginTop: mobileW * 0.01,
              }}>
              {Lang_chg.txt_2[config.language]}
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                this.props.navigation.navigate('Step_1');
              }}
              style={{
                width: MobileW * 0.26,
                height: mobileW * 0.09,
                borderRadius: mobileW * 0.01,
                marginTop: mobileW * 0.03,
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: Colors.white1,
              }}>
              <Text
                style={{
                  fontSize: mobileW * 0.04,
                  fontFamily: Font.OutfitMedium,
                  color: Colors.theamColor,
                }}>
                {Lang_chg.txt_button[config.language]}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
