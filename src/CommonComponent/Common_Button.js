import {
  Text, View, ImageBackground, Image, TextInput, Dimensions, SafeAreaView, StatusBar, TouchableOpacity,
} from 'react-native';
import React, { Component } from 'react';
const MobileW = Dimensions.get('window').width;
const MobileH = Dimensions.get('window').height;
import {
  config, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font,
  Colors, mobileH, mobileW, localimag
} from '../Provider/utilslib/Utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import Mapprovider from './Provider/Mapprovider';


export default class Common_Button extends Component {
  render() {
    return (
      <View>
        {/* <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                this.props.onButtonClick();
              }}
              style={{width:MobileW*0.22,height:mobileW*0.08,borderRadius:mobileW*0.02,marginTop:mobileW*0.02,alignSelf:'center',alignItems:'center',justifyContent:'center',backgroundColor:Colors.white1}}>
                 <Text style={{fontSize:mobileW*0.04,fontFamily:Font.Fontregular,color:Colors.theamColor}}>
                 {this.props.name}
                 </Text>
             </TouchableOpacity> */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            this.props.onButtonClick();
          }}

          style={{
            width: '100%', height: mobileW * 0.10, borderRadius: mobileW * 0.01,
            alignSelf: 'center', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.white1
          }}>
          <Text style={{ fontSize: mobileW * 0.045, fontFamily: Font.OutfitMedium, color: '#2B32B2' }}>
            {this.props.name}
            {this.props.name_Login}
            {this.props.name_Verify}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}