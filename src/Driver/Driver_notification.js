import {
    Text, View, ImageBackground, Image, TextInput, Dimensions, Switch, SafeAreaView, FlatList,
    StatusBar, TouchableOpacity, StyleSheet, Modal, ScrollView
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

export default class Driver_notification extends Component {
    constructor(props) {
        super(props)
        this.state = {
            r1: true,
            noty_arr: [
                { id: 1, image: localimag.proone, title: Lang_chg.benjamin[config.language], title1: Lang_chg.Anna[config.language], title2: '5 min ago', text: 'to deliver', status: false, image1: localimag.cross, },
                { id: 2, image: localimag.profive, title: Lang_chg.william[config.language], title1: Lang_chg.your[config.language], title2: '10 min ago', text: 'at your home', status: false, image1: localimag.cross, },
                { id: 3, image: localimag.protwo, title: Lang_chg.Calebklein[config.language], title1: Lang_chg.Caleb[config.language], title2: '15 min ago', text: 'answer', status: false, image1: localimag.cross, },
                { id: 4, image: localimag.prothree, title: Lang_chg.Drake[config.language], title1: Lang_chg.your[config.language], title2: '20 min ago', text: 'at your home', status: false, image1: localimag.cross, },
                { id: 5, image: localimag.profour, title: Lang_chg.Cherry[config.language], title1: Lang_chg.Caleb[config.language], title2: '25 min ago', text: 'answer', status: false, image1: localimag.cross, },
                { id: 3, image: localimag.prosix, title: Lang_chg.Bikky[config.language], title1: Lang_chg.Anna[config.language], title2: '28 min ago', text: 'to deliver', status: false, image1: localimag.cross, },


            ]

        }
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.white1 }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theamColor }} />
                {/* <StatusBar
                    backgroundColor={Colors.theamColor}
                    hidden={false}
                    barStyle={'light-content'}
                    // backgroundColor={Colors.back_color}
                    translucent={false}
                    networkActivityIndicatorVisible={true}
                /> */}
                <View
                    style={{
                        flexDirection: 'row', paddingVertical: mobileW * 1 / 100, width: mobileW * 100 / 100, alignSelf: 'center', backgroundColor: Colors.theamColor, alignItems: 'center'
                    }} >

                    <TouchableOpacity style={{ width: mobileW * 13 / 100, paddingVertical: mobileW * 3 / 100 }} onPress={() => this.props.navigation.goBack()} >
                        <Image style={{ height: mobileW * 5.3 / 100, width: mobileW * 5.3 / 100, resizeMode: 'contain', marginLeft: mobileW * 2 / 100 }} source={localimag.BackW} />
                    </TouchableOpacity>
                    <View style={{ width: mobileW * 71 / 100, alignItems: 'center', }}>
                        <Text style={{ fontSize: mobileW * 5 / 100, color: Colors.white_color, fontFamily: Font.OutfitMedium }}>{Lang_chg.Notification[config.language]}</Text>
                    </View>
                    <View style={{ width: mobileW * 16 / 100, paddingRight: mobileW * 0.03, }}>
                        <Text style={{ fontSize: mobileW * 5 / 100, alignSelf: 'center', color: Colors.white_color, fontFamily: Font.Fontregular }}>{Lang_chg.clear[config.language]}</Text>
                    </View>
                </View>

                <ScrollView keyboardDismissMode='interactive' keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>
                    <TouchableOpacity style={{ flex: 1 }} onPress={() => { Keyboard.dismiss() }} activeOpacity={1}>

                        <FlatList
                            data={this.state.noty_arr}
                            contentContainerStyle={{ paddingBottom: mobileW * 15 / 100 }}
                            scrollEnabled={false}

                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableOpacity activeOpacity={1} style={{ marginTop: mobileW * 3 / 100 }}>
                                        <View style={{ width: mobileW * 100 / 100, alignSelf: 'center', justifyContent: 'center', }}>

                                            <View style={{
                                                backgroundColor: Colors.white_color,
                                                shadowColor: Colors.shadow_color,
                                                shadowOffset: { width: 2, height: 2, },
                                                shadowOpacity: 0.20,
                                                elevation: 2, flexDirection: 'row', width: mobileW * 95 / 100, alignSelf: 'center', paddingVertical: mobileW * 3 / 100, borderRadius: mobileW * 2 / 100
                                            }}>


                                                <View style={{ width: mobileW * 18 / 100, alignSelf: 'center', justifyContent: 'center', }}>
                                                    <View style={{ height: mobileW * 14 / 100, width: mobileW * 13.5 / 100, borderRadius: mobileW * 2 / 100, alignSelf: 'center', justifyContent: 'center' }}>
                                                        <Image style={{ height: mobileW * 14.5 / 100, width: mobileW * 13.7 / 100, resizeMode: 'cover', borderRadius: mobileW * 2 / 100, alignSelf: 'center' }} source={item.image} ></Image>
                                                    </View>
                                                </View>

                                                <View style={{ width: mobileW * 76 / 100, }}>

                                                    <View style={{ flexDirection: 'row', width: mobileW * 76 / 100, justifyContent: 'space-between', alignSelf: 'center' }}>
                                                        <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.OutfitMedium, color: Colors.black_color }}>{item.title}</Text>
                                                        <Image style={{ height: mobileW * 4.5 / 100, width: mobileW * 4.5 / 100, resizeMode: 'contain', borderRadius: mobileW * 1 / 100, alignSelf: 'center', marginRight: mobileW * 2 / 100 }} source={item.image1} ></Image>
                                                    </View>

                                                    <View style={{ width: mobileW * 76 / 100, alignSelf: 'center', paddingVertical: mobileW * 1 / 100 }}>
                                                        <Text style={{ fontSize: mobileW * 3 / 100, fontFamily: Font.OutfitMedium, color: Colors.textgrey }}>{item.title1}</Text>
                                                    </View>

                                                    <View style={{ width: mobileW * 76 / 100, alignSelf: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
                                                        <Text style={{ fontSize: mobileW * 3 / 100, fontFamily: Font.OutfitMedium, color: Colors.textgrey }}>{item.text}</Text>
                                                        <Text style={{ fontSize: mobileW * 3 / 100, fontFamily: Font.OutfitMedium, color: Colors.textgrey, alignSelf: 'flex-end', marginRight: mobileW * 2 / 100 }}>{item.title2}</Text>
                                                    </View>

                                                </View>

                                            </View>
                                        </View>

                                    </TouchableOpacity>

                                )
                            }} />

                    </TouchableOpacity>

                </ScrollView>

            </View>
        )
    }
}