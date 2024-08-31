import React, { Component } from 'react'
import { Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, TextInput, Modal, FlatList, ScrollView } from 'react-native'
import { config, Otpprovider,  Mapprovider, apifuntion, Colors, Font, validation, mobileH, mobileW, SocialLogin, Cameragallery, mediaprovider, localStorage, Lang_chg, consolepro, msgProvider, msgTitle, msgText, Currentltlg } from './Provider/utilslib/Utils'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const CSSstyle=StyleSheet.create({
    modaltxtother:{fontFamily:Font.Hind_Regular,textAlign:'center', fontSize: windowWidth*4/100, color:Colors.blackColor},
    modaltxtselect:{fontFamily:Font.Hind_Regular,textAlign:'center', fontSize: windowWidth*3.5/100, color:Colors.blackColor},
    modalcancelview:{ marginTop: 15, alignSelf: 'center', borderRadius: 15, backgroundColor: Colors.mediabackground, width: '94%', justifyContent: 'center', alignItems: 'center',marginBottom:10 },
   modalcanceltouch:{alignSelf: 'center',  width: '100%',  alignItems: 'center', justifyContent: 'center',paddingVertical:windowWidth*3.5/100},
    modalviewinner:{ width:'94%',backgroundColor:Colors.mediabackground,borderRadius:15,paddingVertical:windowWidth*3.5/100 },
    modaaltextview:{borderBottomColor:Colors.border_color,borderBottomWidth:1,  width:'100%', paddingVertical:windowWidth*3/100},
    modaaltextview1:{ width:'100%', paddingVertical:windowWidth*3/100},
    pointnotification:{
        width:windowWidth*4/100,
        height:windowWidth*4/100,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:Colors.otpcountcolor,
        borderRadius:windowWidth*2.5/100,
        position:'absolute',
        left:8,
        top:2
      },
      pointnotification_bus:{
        width:windowWidth*4/100,
        height:windowWidth*4/100,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:Colors.otpcountcolor,
        borderRadius:windowWidth*2.5/100,
        position:'absolute',
        right:5,
        top:6
      },
      pointtext:{
        color:Colors.whiteColor,
        fontFamily:Font.fontmedium,
        fontSize:10
          },
modelview: {
    height: '100%',
    width: '100%',
    backgroundColor: '#00000090',
    justifyContent: 'center',
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center'
},
mainmodelview: {
    // backgroundColor: Colors.bg_color,
    height: 250,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 25,
    alignItems:'center'
   // position:'absolute',bottom:100
},
veriview: {
    justifyContent: 'center',
    paddingTop: 15
},
veritext: {
    fontSize: 25,
    alignSelf: 'center',
    fontWeight: 'bold',
    fontFamily: Font.Hind_Regular
},
pleaseview: {
    justifyContent: 'center'
},
pleasetext: {
    fontSize: 13,
    alignSelf: 'center',
    paddingTop: 7,
    fontFamily: Font.Hind_Regular,
    fontWeight:'bold',
   color: Colors.lightfontcolor
},
updateview: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 2
},
numberview: {
    alignSelf: 'center',
    justifyContent: 'center',
},
numbertext: {
    fontFamily: Font.Hind_Regular,
    fontSize: 13,
    fontWeight:'bold',
    color:Colors.lightfontcolor
},
digitview: {
    alignSelf: 'center',
    justifyContent: 'center'
},
digittext: {
    color: Colors.lightfontcolor,
    fontFamily:Font.Hind_Regular,
    fontSize: 13,
    fontWeight:'bold'
},
editview: {
    alignSelf: 'center',
    justifyContent: 'center',
   
},
edittext: {
    color: '#67a6ff',
    fontSize: 12,
    paddingHorizontal:5,
    fontFamily: Font.Hind_Regular,
  fontWeight:'bold',
  textDecorationColor:'#67a6ff',
  textDecorationLine:'underline'
},
otpview: {
    borderWidth: 2,
    borderColor: '#eceded',
    width: '87%',
    alignSelf: 'center',
    
    position: 'relative',
    top: 20,
    
},
otptext: {
   alignContent:'center',
    fontFamily: Font.Hind_Regular,
    width:'100%',
    alignItems:'center'
},
lastview: {
    position: 'absolute',
    bottom:0,
    flexDirection: 'row',
    borderTopColor: '#eceded',
    borderTopWidth: 2,
    justifyContent: 'space-evenly',
    width: '100%',
    height: 60,
    alignSelf: 'center',
},
resend: {
    color: '#e8485f',
    fontSize: 18,
    fontFamily: Font.Hind_Regular,
    fontWeight:'bold',
    justifyContent: 'center',
    alignSelf: 'center'
},
resendtouch: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: 150,
    marginTop:windowWidth*3/100
  
},
verify: {
    color: '#67a6ff',
    fontSize: 18,
    fontFamily: Font.Hind_Regular,
    fontWeight:'bold',
    justifyContent: 'center',
    alignSelf: 'center'
},
modalageview:
        {width:'100%' ,flexDirection:'row',justifyContent:'space-between',paddingHorizontal:20},
modalcross:
        {width:30,height:30},
line:
    {width:2,backgroundColor:'#eceded'},
    notification_header: {
    flexDirection: config.textalign == 'left' ? 'row' : 'row-reverse',
        // flexDirection: config.textalign != 'left' ? 'row' : 'row-reverse',
        // backgroundColor:'red',
    justifyContent: 'space-between',
    paddingLeft: windowWidth*3/100,
    paddingRight: windowWidth*3/100,
    // backgroundColor: Colors.bg_color,
    paddingTop: 10,
    paddingBottom: 10,
    width: '100%',
    // backgroundColor:'red'
    // elevation:1,shadowColor: "#000", shadowOffset: { width: 2, height: 2, }, shadowOpacity: 0.20,

}, hole_top_l1: {
    width: 22,
    height: 22,
    // transform:[config.textalign=='left'?{scaleX:1}:{scaleX:-1}]
        // transform: [config.textalign == 'left' ? { scaleX: 1 } : { scaleX: -1 }],
        alignSelf:  config.textalign == 'left' ?  'flex-start' : 'flex-end'
},
Notifications_title: {
    fontFamily: Font.Hind_Bold,
    fontSize: windowWidth*4.8/100,
    color: '#000',
    alignSelf:'center'
},
mainbutton:{width: '100%', paddingVertical: windowHeight*1.5/100, backgroundColor: Colors.theme_color1, alignSelf: 'center',  justifyContent: 'center', borderRadius: windowHeight * 1.3 / 100 },
icons:{width:windowWidth*6/100,
    height:windowWidth*6/100,
    resizeMode: 'contain'},
edittxticon:{
    width:windowWidth*5/100,
    height:windowWidth*5/100,
    resizeMode: 'contain'},



    // /new code

    txtitem1: {
        fontSize: windowWidth * 3.8 / 100, fontFamily: Font.Hind_Bold, 
    },
    txtitem: {
        fontSize: windowWidth * 3.7 / 100, fontFamily: Font.Hind_SemiBold, color: Colors.blackColor, alignSelf: 'flex-start', 
    },
    txtitemdes: {
        fontSize: windowWidth * 3.5 / 100, fontFamily: Font.Hind_SemiBold, color: Colors.blackColor, alignSelf: 'flex-start',
    },
    txtadd: {
        fontSize: windowWidth * 3.5 / 100, fontFamily: Font.Hind_SemiBold, color: Colors.blackColor, alignSelf: 'center',
    },
    txtprice: {
        fontSize: windowWidth * 3.5 / 100, fontFamily: Font.Hind_SemiBold, color: Colors.blackColor, alignSelf: 'flex-end', marginHorizontal: windowWidth*1.5/100
    },

    addremove:{
        width:windowWidth*2/100,height:windowWidth*2/100,resizeMode:'contain',
       
    },

    //radhekrsihan
    view1:
    {
        height: mobileH * 8 / 100,
   //     flexDirection: config.language == 0 ? 'row' : 'row-reverse',
        width: mobileW * 90 / 100,
        alignSelf: 'center',
       // alignItems: 'center',
        justifyContent: 'center',
    },

})
export default CSSstyle;