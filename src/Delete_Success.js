import {
  Text, View, ImageBackground, Image, TextInput, Dimensions, SafeAreaView, StatusBar, TouchableOpacity, Modal
 , BackHandler,} from 'react-native';
import React, { Component } from 'react';
const MobileW = Dimensions.get('window').width;
const MobileH = Dimensions.get('window').height;
import { config, Common_Button, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag } from './Provider/utilslib/Utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Mapprovider from './Provider/Mapprovider';
import { borderColor } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';

export default class Delete_Success extends Component {



  constructor(props) {
    super(props)
    this.state = {
        
    }
    this._didFocusSubscription = props.navigation.addListener('focus', (payload) =>
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
);
}

componentDidMount() {
this._willBlurSubscription = this.props.navigation.addListener('blur', (payload) =>
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
);
 
}

handleBackPress = () => {
// Alert.alert('Hold on!', 'Do you really want to exit app?', [
//   {
//     text: 'Cancel',
//     onPress: () => null,
//     style: 'cancel'
//   },
//   { text: 'YES', onPress: () => BackHandler.exitApp() }
// ]);
return true;
};





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

        {/* <Image source={localimag.splash} style={{ height: mobileW * 5 / 100, width: mobileW * 5 / 100 }}
        /> */}
        <View style={{ width: MobileW, alignItems: 'center', justifyContent: 'center', }}>
          <Text style={{ fontFamily: Font.Bold, fontSize: mobileW * 6 / 100, alignSelf: 'center', color: Colors.black, textAlign: 'center', paddingVertical: mobileW * 1 / 100 }}>{Lang_chg.success[config.language]}</Text>
          <Text style={{ fontFamily: Font.OutfitMedium, fontSize: mobileW * 3.5 / 100, color: "#777C80", textAlign: 'center' }}>
            {Lang_chg.Succefullydelete[config.language]}</Text>
          <Text style={{ fontFamily: Font.OutfitMedium, fontSize: mobileW * 3.5 / 100, color: "#777C80", textAlign: 'center', paddingVertical: mobileW * 1 / 100 }}>
            {Lang_chg.youraccount[config.language]}</Text>
          
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