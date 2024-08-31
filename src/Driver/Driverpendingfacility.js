import { View, Image, StatusBar, Text, FlatList, ImageBackground, TouchableOpacity, SafeAreaView, Modal, Keyboard, StyleSheet, TextInput, ScrollView } from 'react-native'
import React, { Component } from 'react'
import { config, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag } from '../Provider/utilslib/Utils';
import DashedLine from 'react-native-dashed-line';

export default class Driverpendingfacility extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.white_color }}>

                <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={() => { Keyboard.dismiss() }}>
                    <SafeAreaView style={{ backgroundColor: Colors.theamColor, flex: 0 }} />
                    {/* <StatusBar barStyle='light-content' backgroundColor={Colors.theamColor} hidden={false} translucent={false} /> */}

                    <View style={{
                        paddingLeft: mobileW * 0.03, flexDirection: 'row', justifyContent: 'flex-start',
                        width: mobileW * 100 / 100, alignItems: 'center', backgroundColor: Colors.theamColor,
                    }} >
                        <TouchableOpacity style={{ width: mobileW * 12 / 100 }} onPress={() => this.props.navigation.goBack('')} >
                            <Image style={{ height: mobileW * 6 / 100, width: mobileW * 6 / 100, resizeMode: 'contain' }} source={localimag.goback} />
                        </TouchableOpacity>
                        <View style={{ width: mobileW * 78 / 100, paddingVertical: mobileW * 3 / 100, alignItems: 'center', alignSelf: 'center' }}>
                            <Text style={{ fontSize: mobileW * 5 / 100, color: Colors.white_color, fontFamily: Font.OutfitMedium }}>#89346365467</Text>
                        </View>
                        <View style={{ width: mobileW * 10 / 100 }}>
                            <Image style={{ height: mobileW * 5 / 100, width: mobileW * 5 / 100, resizeMode: 'contain' }} source={localimag.whitedot} />
                        </View>
                    </View>


                    <ScrollView keyboardDismissMode='interactive' keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>
                        <TouchableOpacity style={{ flex: 1, paddingBottom: mobileW * 10 / 100 }} activeOpacity={1}>

                            <View style={{backgroundColor: '#F7F7F7', paddingVertical: mobileW * 2 / 100, }}>
                                <View style={{ width: '100%', flexDirection: 'row', alignSelf: 'center', paddingVertical: mobileW * 2 / 100, backgroundColor: '#F7F7F7', paddingHorizontal: mobileW * 4 / 100 }}>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.OutfitMedium, color: Colors.black, }}>{Lang_chg.Backyard[config.language]}</Text>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.OutfitMedium, color: Colors.violet }}> (Dining Facility)</Text>
                                </View>
                                <View style={{ width: mobileW * 25 / 100, borderColor: Colors.bottomborder, borderColor: Colors.bottomborder, borderRadius: mobileW * 4 / 100, borderWidth: 1, paddingVertical: mobileW * 1 / 100, marginLeft: mobileW * 3 / 100 }}>
                                    <Text style={{ fontSize: mobileW * 3 / 100, fontFamily: Font.OutfitMedium, color: Colors.yellow, textAlign: 'center' }}>{Lang_chg.pending[config.language]}</Text>
                                </View>
                            </View>


                            <View style={{ marginTop: mobileW * 3 / 100 }}>
                                <ImageBackground source={localimag.billimg} resizeMode='cover' style={{ width: mobileW * 93 / 100, height: mobileH * 24 / 100, alignSelf: 'center' }}
                                    imageStyle={{ borderRadius: 8, alignSelf: 'center', justifyContent: 'center' }}>

                                </ImageBackground>

                            </View>



                            <View style={{
                                width: '100%', alignSelf: 'center',
                                paddingVertical: mobileW * 2 / 100, backgroundColor: '#fff', marginTop: mobileW * 1 / 100, paddingBottom: mobileW * 40 / 100
                            }}>

                                <View style={{ flexDirection: 'row', width: mobileW * 93 / 100, alignSelf: 'center', justifyContent: 'space-between', marginTop: mobileW * 2 / 100 }}>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.OutfitMedium, color: Colors.grey, }}>{Lang_chg.Ordercreted[config.language]}</Text>
                                    <View style={{ flexDirection: 'row', }}>
                                        <Image style={{
                                            height: mobileW * 3 / 100, width: mobileW * 3 / 100, resizeMode: 'contain', alignSelf: 'center', justifyContent: 'center', marginRight: mobileW * 1 / 100,
                                        }} source={localimag.calender}></Image>
                                        <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.OutfitMedium, color: '#8A8A8A', textAlign: 'center' }}>{Lang_chg.date[config.language]}</Text>
                                    </View>
                                </View>

                                <View style={{ width: mobileW * 93 / 100, alignSelf: 'center' }}>
                                    <DashedLine style={{ marginTop: mobileH * 0.8 / 100, marginBottom: mobileH * 1 / 100, paddingHorizontal: mobileW * 0.5 / 100, width: mobileW * 92 / 100, }} dashColor={'#DADADA'} gap={7} dashThickness={0.4} dashLength={7} />
                                </View>

                                <View style={{ width: mobileW * 93 / 100, flexDirection: 'row', alignSelf: 'center', justifyContent: 'flex-start', }}>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.OutfitMedium, color: Colors.grey, }}>{Lang_chg.Location[config.language]}</Text>
                                </View>

                                <View style={{ width: mobileW * 93 / 100, flexDirection: 'row', alignSelf: 'center', justifyContent: 'flex-start', paddingVertical: mobileW * 0.5 / 100 }}>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.Semibold, color: '#8A8A8A' }}>{Lang_chg.newyork[config.language]}</Text>
                                </View>

                                <View style={{ width: mobileW * 93 / 100, flexDirection: 'row', alignSelf: 'center', justifyContent: 'flex-start', }}>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.Semibold, color: '#8A8A8A' }}>{Lang_chg.Unitedstates[config.language]}</Text>
                                </View>

                                <View style={{ width: mobileW * 93 / 100, alignSelf: 'center' }}>
                                    <DashedLine style={{ marginTop: mobileH * 0.8 / 100, marginBottom: mobileH * 1 / 100, paddingHorizontal: mobileW * 0.5 / 100, width: mobileW * 92 / 100, }} dashColor={'#DADADA'} gap={7} dashThickness={0.4} dashLength={7} />
                                </View>

                                <View style={{ flexDirection: 'row', width: mobileW * 93 / 100, alignSelf: 'center', justifyContent: 'space-between', paddingVertical: mobileW * 1 / 100, }}>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.OutfitMedium, color: Colors.grey, }}>Delivery Fee</Text>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.OutfitMedium, color: '#8A8A8A' }}>$4.3</Text>
                                </View>

                                <View style={{ flexDirection: 'row', width: mobileW * 93 / 100, alignSelf: 'center', justifyContent: 'space-between', paddingVertical: mobileW * 1 / 100, }}>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.OutfitMedium, color: Colors.grey, }}>{Lang_chg.tip_amount[config.language]}</Text>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.OutfitMedium, color: '#8A8A8A' }}>$2.2</Text>
                                </View>

                                <View style={{ width: mobileW * 93 / 100, alignSelf: 'center' }}>
                                    <DashedLine style={{ marginTop: mobileH * 0.8 / 100, marginBottom: mobileH * 1 / 100, paddingHorizontal: mobileW * 0.5 / 100, width: mobileW * 92 / 100, }} dashColor={'#DADADA'} gap={7} dashThickness={0.4} dashLength={7} />
                                </View>

                                <View style={{ flexDirection: 'row', width: mobileW * 93 / 100, alignSelf: 'center', justifyContent: 'space-between', paddingVertical: mobileW * 1 / 100, }}>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.Semibold, color: Colors.grey, }}>{Lang_chg.totalamount[config.language]}</Text>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.Semibold, color: Colors.violet }}>$6.5</Text>
                                </View>

                                <View style={{ width: mobileW * 93 / 100, alignSelf: 'center' }}>
                                    <DashedLine style={{ marginTop: mobileH * 0.8 / 100, marginBottom: mobileH * 1 / 100, paddingHorizontal: mobileW * 0.5 / 100, width: mobileW * 92 / 100, }} dashColor={'#DADADA'} gap={7} dashThickness={0.4} dashLength={7} />
                                </View>


                                <View>
                                    <View style={{
                                        width: mobileW * 95 / 100, alignSelf: 'center',
                                        paddingVertical: mobileW * 1 / 100, backgroundColor: '#EFEFEF', borderRadius: mobileW * 2 / 100, paddingBottom: mobileW * 3 / 100,
                                    }}>
                                        <View style={{ width: mobileW * 88 / 100, flexDirection: 'row', alignSelf: 'center', justifyContent: 'flex-start', paddingVertical: mobileW * 2 / 100 }}>
                                            <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.Semibold, color: Colors.black }}>{Lang_chg.customerdetails[config.language]}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', width: mobileW * 95 / 100, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', }}>
                                            <Image
                                                style={{ alignSelf: 'center', width: mobileW * 9 / 100, height: mobileW * 9 / 100, borderRadius: mobileW * 5 / 100 }}
                                                source={localimag.driverboy}>
                                            </Image>

                                            <View style={{ paddingLeft: mobileW * 2 / 100 }}>
                                                <View style={{ width: mobileW * 77 / 100, alignSelf: 'center', justifyContent: 'flex-start', paddingVertical: mobileW * 1 / 100 }}>
                                                    <Text style={{ fontSize: mobileW * 3.6 / 100, fontFamily: Font.Semibold, color: Colors.violet }}>{Lang_chg.Drake[config.language]}</Text>
                                                </View>

                                                <View style={{ width: mobileW * 77 / 100, flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', alignItems: "center" }}>
                                                    <View style={{ width: mobileW * 57 / 100, flexDirection: 'row', }}>
                                                        <Text style={{ fontSize: mobileW * 3.3 / 100, fontFamily: Font.Fontregular, color: Colors.textgrey, }}>{Lang_chg.universityname[config.language]}</Text>
                                                        <Text style={{ fontSize: mobileW * 3.3 / 100, fontFamily: Font.Fontregular, color: Colors.textgrey }}>{Lang_chg.harvarduniversity[config.language]}</Text>
                                                    </View>

                                                </View>

                                            </View>
                                        </View>

                                    </View>
                                </View>


                                <TouchableOpacity style={{ alignSelf: 'center', justifyContent: 'center', width: mobileW * 90 / 100, marginBottom: mobileW * 10 / 100, marginTop: mobileW * 18 / 100 }} onPress={() => { this.props.navigation.navigate('Driver_pendingDinFac', { Status: 5 }) }}>
                                    <View style={{
                                        width: mobileW * 93 / 100,
                                        alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderRadius: mobileW * 1 / 100, padding: mobileW * 3 / 100, backgroundColor:Colors.theamColor
                                    }} >

                                        <Text style={{ fontSize: mobileW * 4 / 100, color: Colors.white_color, fontFamily: Font.fontmedium, textAlign: 'center', paddingLeft: 3.5 }}>
                                            {Lang_chg.accept[config.language]}

                                        </Text>
                                    </View>
                                </TouchableOpacity>







                            </View>

                        </TouchableOpacity>
                    </ScrollView>
                </TouchableOpacity>
            </View>
        )
    }
}