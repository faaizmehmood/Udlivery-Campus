import { Text, View, ImageBackground, Image, TextInput, Dimensions, SafeAreaView, StatusBar, TouchableOpacity,} from 'react-native';
import React, { Component } from 'react';
const MobileW = Dimensions.get('window').width;
const MobileH = Dimensions.get('window').height;
import { config,  Common_Button,msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag } from './Provider/utilslib/Utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Mapprovider from './Provider/Mapprovider';

export default class About_Us extends Component {
  render() {
    return (
        <View style={{flex:1,backgroundColor:Colors.white1}}>

        <SafeAreaView style={{flex:0,backgroundColor:Colors.white1}}/>
        {/* <StatusBar
                     hidden={false}
                     backgroundColor={Colors.Red1}
                     translucent={false}
                     networkActivityIndicatorVisible={true}
                     barStyle='light-content'
                     
                 /> */}
                 <View style={{
                        paddingLeft: mobileW * 0.02, flexDirection: 'row', justifyContent: 'flex-start',
                        width: mobileW * 100 / 100, alignItems: 'center', backgroundColor: Colors.theamColor, }} >
                        <TouchableOpacity style={{ width: mobileW * 12 / 100 }} 
                        onPress={() => this.props.navigation.goBack('')} >
                        <Image style={{ height: mobileW * 6.5 / 100, width: mobileW * 6.5 / 100, resizeMode: 'contain' }} 
                        source={localimag.BackW} />
                        </TouchableOpacity>
                        <View style={{ width: mobileW * 76/ 100, paddingVertical: mobileW * 3 / 100, alignItems: 'center', alignSelf: 'center' }}>
                        <Text style={{ fontSize: mobileW * 5 / 100, color: Colors.white_color,
                         fontFamily: Font.regular }}>{Lang_chg.txt_aboutUs[config.language]}</Text>
                        </View>
                        <View style={{ width: mobileW * 12 / 100 }}>
                        </View>
                    </View>
                 <KeyboardAwareScrollView>
                    <View style={{justifyContent:'center',alignItems:'center',
                    marginHorizontal:mobileW*2/100,marginVertical:mobileH*1/100}}>
                        <Text style={{fontSize:mobileW*4.3/100, textAlign:'justify',
                         fontFamily:Font.Fontregular,color:Colors.grey}}>
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Impedit laudantium porro, animi dolor pariatur libero maiores cumque adipisci itaque odio, assumenda incidunt quam atque perferendis possimus et autem similique nihil minus neque, distinctio excepturi explicabo illum fuga. Fugit, ad vero eligendi eaque culpa aperiam saepe! Sed quis ab ipsa amet?
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Impedit laudantium porro, animi dolor pariatur libero maiores cumque adipisci itaque odio, assumenda incidunt quam atque perferendis possimus et autem similique nihil minus neque, distinctio excepturi explicabo illum fuga. Fugit, ad vero eligendi eaque culpa aperiam saepe! Sed quis ab ipsa amet?
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Impedit laudantium porro, animi dolor pariatur libero maiores cumque adipisci itaque odio, assumenda incidunt quam atque perferendis possimus et autem similique nihil minus neque, distinctio excepturi explicabo illum fuga. Fugit, ad vero eligendi eaque culpa aperiam saepe! Sed quis ab ipsa amet?
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Impedit laudantium porro, animi dolor pariatur libero maiores cumque adipisci itaque odio, assumenda incidunt quam atque perferendis possimus et autem similique nihil minus neque, distinctio excepturi explicabo illum fuga. Fugit, ad vero eligendi eaque culpa aperiam saepe! Sed quis ab ipsa amet?
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Impedit laudantium porro, animi dolor pariatur libero maiores cumque adipisci itaque odio, assumenda incidunt quam atque perferendis possimus et autem similique nihil minus neque, distinctio excepturi explicabo illum fuga. Fugit, ad vero eligendi eaque culpa aperiam saepe! Sed quis ab ipsa amet?
     </Text>
     </View>
     </KeyboardAwareScrollView>
    
      </View>
    )
  }
}