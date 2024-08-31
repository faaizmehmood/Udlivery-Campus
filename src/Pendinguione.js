import { View, Image, StatusBar, Text, FlatList, ImageBackground, TouchableOpacity, SafeAreaView, ScrollView, Keyboard, StyleSheet, Modal } from 'react-native'
import React, { Component } from 'react'
import { config, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag } from './Provider/utilslib/Utils';
import DashedLine from 'react-native-dashed-line';

export default class Pendingui extends Component {
    constructor(props) {
        super(props); {
            this.state = {
                modalVisible: false,
                id: this.props.route.params.Status,
                navi_status: this.props.route.params.navi_status,
                num_arr: [
                    { id: 1, image: localimag.dishtwo, title: Lang_chg.Mulberry[config.language], Staus: 0, diet: 'Calories : 145', text: 'Qty : 2', title1: 'Mulberry Pizzas as our guests began requesting their favorites over and over. Ted’s dad made the Hal’s Pizza. ', navi_status: 1 },
                    { id: 2, image: localimag.dishfour, title: Lang_chg.veg[config.language], Staus: 1, diet: 'Calories : 345', text: 'Qty : 1', title1: 'A classical lip-smacking indian street food recipe made with thin rice noodles tossed with sliced veggies.', navi_status: 1, },
                    { id: 3, image: localimag.dishseven, title: Lang_chg.Rasberry[config.language], Staus: 1, diet: 'Calories : 567', text: 'Qty : 2', title1: 'Mulberry Pizzas as our guests began requesting their favorites over and over. Ted’s dad made the Hal’s Pizza .', navi_status: 1, },

                ]
            }
        }
        //console.log('this.state.id1', this.props.route.params.id)
    }
    render() {
        //console.log('this.props.route.params.Status', this.props.route.params.Status)
        return (
            <View style={{ flex: 1, backgroundColor: '#F7F7F7' }}>

                <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={() => { Keyboard.dismiss() }}>
                    <SafeAreaView style={{ backgroundColor: Colors.theamColor, flex: 0 }} />
                    <StatusBar barStyle='light-content' backgroundColor={Colors.theamColor} hidden={false} translucent={false} />

                    <View style={{
                        width: mobileW * 100 / 100, alignItems: 'center', backgroundColor: Colors.theamColor,
                    }} >
                        <View style={{ width: mobileW * 95 / 100, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center', paddingVertical: mobileW * 3 / 100 }}>
                            <TouchableOpacity style={{ width: mobileW * 12 / 100, }} onPress={() => this.props.navigation.goBack()} >
                                <Image style={{ height: mobileW * 6 / 100, width: mobileW * 6 / 100, resizeMode: 'contain' }} source={localimag.goback} />
                            </TouchableOpacity>
                            <View style={{ width: mobileW * 70 / 100, alignItems: 'center', alignSelf: 'center' }}>
                                <Text style={{ fontSize: mobileW * 5 / 100, color: Colors.white_color, fontFamily: Font.OutfitMedium }}>#8458745623</Text>
                            </View>
                            <TouchableOpacity onPress={() => this.setState({ modalVisible: true })} style={{ width: mobileW * 13 / 100, alignItems: 'flex-end' }}>
                                <Image style={{ height: mobileW * 5 / 100, width: mobileH * 1 / 100, resizeMode: 'cover' }} source={localimag.whitedot} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView keyboardDismissMode='interactive' keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>
                        <TouchableOpacity style={{ flex: 1, paddingBottom: mobileW * 10 / 100 }} activeOpacity={1}>





                            {this.state.id == 5 && <View>
                                <View style={{ width: '100%', flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', paddingVertical: mobileW * 2 / 100, backgroundColor: '#F7F7F7', paddingHorizontal: mobileW * 3 / 100, paddingTop: mobileW * 4 / 100 }}>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.Semibold, color: Colors.black, }}>{Lang_chg.Billinginformation[config.language]}</Text>
                                    <Text style={{ fontSize: mobileW * 3.5 / 100, fontFamily: Font.OutfitMedium, color: Colors.yellow }}>{Lang_chg.pending[config.language]}</Text>
                                </View>
                            </View>}


                            {/* ///-------------accept page---------// */}
                            {this.state.id == 6 && <View>
                                <View style={{ width: '100%', flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', paddingVertical: mobileW * 2 / 100, backgroundColor: '#F7F7F7', paddingHorizontal: mobileW * 3 / 100, paddingTop: mobileW * 4 / 100 }}>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.Semibold, color: Colors.black, }}>{Lang_chg.Billinginformation[config.language]}</Text>
                                    <Text style={{ fontSize: mobileW * 3.5 / 100, fontFamily: Font.OutfitMedium, color: Colors.opengreen }}>{Lang_chg.accepted[config.language]}</Text>
                                </View>
                            </View>}
                            {/* ///-------------accept page---------// */}

                            {/* \\--------------Deliver----------------// */}
                            {this.state.id == 7 && <View>
                                <View style={{ width: '100%', flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', paddingVertical: mobileW * 2 / 100, backgroundColor: '#F7F7F7', paddingHorizontal: mobileW * 3 / 100, paddingTop: mobileW * 4 / 100 }}>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.Semibold, color: Colors.black, }}>{Lang_chg.Billinginformation[config.language]}</Text>
                                    <Text style={{ fontSize: mobileW * 3.5 / 100, fontFamily: Font.OutfitMedium, color: Colors.opengreen }}>{Lang_chg.Delivery[config.language]}</Text>
                                </View>
                            </View>}


                            <View style={{
                                width: '100%', alignSelf: 'center',
                                paddingVertical: mobileW * 2 / 100, backgroundColor: '#F7F7F7',
                            }}>


                                {/* //------------------imagebackground use for pedding------------// */}
                                {this.state.id == 5 && <ImageBackground source={localimag.billimg} resizeMode='cover' style={{ width: mobileW * 93 / 100, height: mobileH * 24 / 100, alignSelf: 'center' }}
                                    imageStyle={{ borderRadius: 10, alignSelf: 'center', justifyContent: 'center' }}>
                                    {/* <Image style={{ height: mobileW * 12 / 100, width: mobileW * 12 / 100, resizeMode: 'contain', alignSelf: 'center', marginTop: mobileW * 16 / 100 }} source={localimag.playbut} /> */}
                                </ImageBackground>}

                                {/* //------------------imagebackground use for pedding------------// */}


                                {/* //-------accepted page use this code-----------// */}
                                {this.state.id != 5 &&
                                    <View>
                                        {/* <View style={{ flexDirection: 'row', width: mobileW * 93 / 100, alignSelf: 'center', marginTop: mobileW * 3 / 100 }}>
                                            <Image style={{
                                                height: mobileW * 4 / 100, width: mobileW * 4 / 100, resizeMode: 'contain', alignSelf: 'center', justifyContent: 'center', marginRight: mobileW * 1 / 100,
                                            }} source={localimag.Usernew}></Image>
                                            <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.OutfitMedium, color: Colors.grey, textAlign: 'center' }}>{Lang_chg.charlotte[config.language]}</Text>
                                        </View> */}
                                        <View style={{ width: mobileW * 93 / 100, alignSelf: 'center' }}>
                                            <DashedLine style={{ marginTop: mobileH * 0.8 / 100, marginBottom: mobileH * 1 / 100, paddingHorizontal: mobileW * 0.5 / 100, width: mobileW * 92 / 100, }} dashColor={'#DADADA'} gap={7} dashThickness={0.5} dashLength={7} />
                                        </View>
                                    </View>
                                }

                                {/* //-------accepted page use this code-----------// */}

                                <View style={{ flexDirection: 'row', width: mobileW * 93 / 100, alignSelf: 'center', justifyContent: 'space-between', paddingVertical: mobileW * 1 / 100, marginTop: mobileW * 2 / 100 }}>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.OutfitMedium, color: Colors.grey, }}>Order Number</Text>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.OutfitMedium, color: '#8A8A8A' }}>{Lang_chg.ID[config.language]}</Text>
                                </View>

                                <View style={{ width: mobileW * 93 / 100, alignSelf: 'center' }}>
                                    <DashedLine style={{ marginTop: mobileH * 0.8 / 100, marginBottom: mobileH * 1 / 100, paddingHorizontal: mobileW * 0.5 / 100, width: mobileW * 92 / 100, }} dashColor={'#DADADA'} gap={7} dashThickness={0.5} dashLength={7} />
                                </View>

                                <View style={{ flexDirection: 'row', width: mobileW * 93 / 100, alignSelf: 'center', justifyContent: 'space-between', marginTop: mobileW * 2 / 100 }}>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.OutfitMedium, color: Colors.grey, }}>{Lang_chg.Ordercreted[config.language]}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image style={{
                                            height: mobileW * 3.3 / 100, width: mobileW * 3.3 / 100, resizeMode: 'contain', alignSelf: 'center', justifyContent: 'center', marginRight: mobileW * 1 / 100,
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

                                <View style={{ width: mobileW * 93 / 100, flexDirection: 'row', alignSelf: 'center', justifyContent: 'flex-start', paddingVertical: mobileW * 1 / 100 }}>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.Semibold, color: '#8A8A8A', }}>{Lang_chg.newyork[config.language]}</Text>
                                </View>

                                <View style={{ width: mobileW * 93 / 100, flexDirection: 'row', alignSelf: 'center', justifyContent: 'flex-start', }}>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.Semibold, color: '#8A8A8A', }}>{Lang_chg.Unitedstates[config.language]}</Text>
                                </View>

                                <View style={{ width: mobileW * 93 / 100, alignSelf: 'center' }}>
                                    <DashedLine style={{ marginTop: mobileH * 0.8 / 100, marginBottom: mobileH * 1 / 100, paddingHorizontal: mobileW * 0.5 / 100, width: mobileW * 92 / 100, }} dashColor={'#DADADA'} gap={7} dashThickness={0.4} dashLength={7} />
                                </View>

                                <View style={{ flexDirection: 'row', width: mobileW * 93 / 100, alignSelf: 'center', justifyContent: 'space-between', paddingVertical: mobileW * 1 / 100, }}>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.OutfitMedium, color: Colors.grey, }}>Delivery fee</Text>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.OutfitMedium, color: '#8A8A8A' }}>$4.3</Text>
                                </View>

                                <View style={{ flexDirection: 'row', width: mobileW * 93 / 100, alignSelf: 'center', justifyContent: 'space-between', paddingVertical: mobileW * 1 / 100, }}>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.OutfitMedium, color: Colors.grey, }}>{Lang_chg.tipamount[config.language]}</Text>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.OutfitMedium, color: '#8A8A8A' }}>$2.2</Text>
                                </View>

                                <View style={{ width: mobileW * 93 / 100, alignSelf: 'center' }}>
                                    <DashedLine style={{ marginTop: mobileH * 0.8 / 100, marginBottom: mobileH * 1 / 100, paddingHorizontal: mobileW * 0.5 / 100, width: mobileW * 92 / 100, }} dashColor={'#DADADA'} gap={7} dashThickness={0.4} dashLength={7} />
                                </View>

                                <View style={{ flexDirection: 'row', width: mobileW * 93 / 100, alignSelf: 'center', justifyContent: 'space-between', paddingVertical: mobileW * 1 / 100, }}>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.Semibold, color: Colors.black, }}>{Lang_chg.totalamount[config.language]}</Text>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.Semibold, color: Colors.violet }}>$6.5</Text>
                                </View>

                                <View style={{ width: mobileW * 93 / 100, alignSelf: 'center' }}>
                                    <DashedLine style={{ marginTop: mobileH * 0.8 / 100, marginBottom: mobileH * 1 / 100, paddingHorizontal: mobileW * 0.5 / 100, width: mobileW * 92 / 100, }} dashColor={'#DADADA'} gap={7} dashThickness={0.4} dashLength={7} />
                                </View>

                                {/* //-------Accept start-----// */}

                                {this.state.id != 5 &&
                                    <View style={{
                                        width: mobileW * 95 / 100, alignSelf: 'center', marginTop: mobileW * 2 / 100,
                                        paddingVertical: mobileW * 1 / 100, backgroundColor: '#EFEFEF', borderRadius: mobileW * 2 / 100, paddingBottom: mobileW * 3 / 100,
                                    }}>
                                        <View style={{ width: mobileW * 90 / 100, flexDirection: 'row', alignSelf: 'center', justifyContent: 'flex-start', paddingVertical: mobileW * 1 / 100 }}>
                                            <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.Semibold, color: Colors.black }}>{Lang_chg.Udliverydetail[config.language]}</Text>
                                        </View>

                                        <View style={{ flexDirection: 'row', width: mobileW * 95 / 100, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', marginTop: mobileW * 1 / 100 }}>
                                            <Image
                                                style={{ alignSelf: 'center', width: mobileW * 9.5 / 100, height: mobileW * 9.5 / 100, borderRadius: mobileW * 5 / 100, borderColor: Colors.textgrey, borderWidth: 1.5, marginTop: mobileW * -1.7 / 100 }}
                                                source={localimag.driverboy}>
                                            </Image>

                                            <View style={{ paddingLeft: mobileW * 1 / 100 }}>
                                                <View style={{ width: mobileW * 78 / 100, alignSelf: 'center', justifyContent: 'flex-start', }}>
                                                    <Text style={{ fontSize: mobileW * 3.6 / 100, fontFamily: Font.Semibold, color: Colors.violet }}>{Lang_chg.benjamin[config.language]}</Text>
                                                </View>

                                                <View style={{ width: mobileW * 78 / 100, flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', marginLeft: mobileW * 1 / 100 }}>
                                                    <View style={{ width: mobileW * 60 / 100, flexDirection: 'row', alignSelf: 'center', justifyContent: 'flex-start', }}>
                                                        <Text style={{ fontSize: mobileW * 3.3 / 100, fontFamily: Font.OutfitMedium, color: Colors.black }}>4.1</Text>
                                                        <Image
                                                            style={{ alignSelf: 'center', width: mobileW * 2.6 / 100, height: mobileW * 2.6 / 100, borderRadius: mobileW * 5 / 100 }}
                                                            source={localimag.star} />
                                                        <Image
                                                            style={{ alignSelf: 'center', width: mobileW * 2.6 / 100, height: mobileW * 2.6 / 100, borderRadius: mobileW * 5 / 100 }}
                                                            source={localimag.star} />
                                                        <Image
                                                            style={{ alignSelf: 'center', width: mobileW * 2.6 / 100, height: mobileW * 2.6 / 100, borderRadius: mobileW * 5 / 100 }}
                                                            source={localimag.star} />
                                                        <Image
                                                            style={{ alignSelf: 'center', width: mobileW * 2.6 / 100, height: mobileW * 2.6 / 100, borderRadius: mobileW * 5 / 100 }}
                                                            source={localimag.star} />
                                                        <Image
                                                            style={{ alignSelf: 'center', width: mobileW * 2.6 / 100, height: mobileW * 2.6 / 100, borderRadius: mobileW * 5 / 100 }}
                                                            source={localimag.stargrey} />
                                                        <Text style={{ fontSize: mobileW * 3.1 / 100, fontFamily: Font.OutfitMedium, color: Colors.black }}>(432)</Text>
                                                    </View>

                                                    <View style={{ width: mobileW * 17 / 100, flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between' }}>
                                                        <Image
                                                            style={{ alignSelf: 'center', width: mobileW * 8 / 100, height: mobileW * 8 / 100, }}
                                                            source={localimag.bluemassage} />
                                                        <Image
                                                            style={{ alignSelf: 'center', width: mobileW * 8 / 100, height: mobileW * 8 / 100, paddingLeft: mobileW * 2 / 100 }}
                                                            source={localimag.bluecall} />
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>}
                                {/* //-----------------accept page end ---------------/ */}



                                {/* //----------------------------Deliver------------------------------// */}
                                {this.state.id == 7 &&
                                    <View>
                                        <ImageBackground source={localimag.driverboyblur} resizeMode='cover' style={{ width: mobileW * 93 / 100, height: mobileH * 24 / 100, alignSelf: 'center', marginTop: mobileW * 3 / 100 }}
                                            imageStyle={{ borderRadius: 10, alignSelf: 'center', justifyContent: 'center' }}>
                                            <Image style={{ height: mobileW * 12 / 100, width: mobileW * 12 / 100, resizeMode: 'contain', alignSelf: 'center', marginTop: mobileW * 16 / 100 }} source={localimag.playbut} />
                                        </ImageBackground>


                                        {this.props.route.params.Status == 7 && <TouchableOpacity onPress={() => { this.props.navigation.navigate('Ratenow', { 'navi_status': this.state.navi_status }) }}
                                            style={{
                                                marginTop: mobileW * 18 / 100,
                                                flexDirection: 'row', width: mobileW * 93 / 100,
                                                alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderRadius: mobileW * 2 / 100, padding: mobileW * 4 / 100, backgroundColor: Colors.removecolor
                                            }}>
                                            <Text style={{ fontSize: mobileW * 4.3 / 100, color: Colors.white_color, fontFamily: Font.Fontregular, textAlign: 'center', paddingLeft: 3.5 }}>
                                                {Lang_chg.ratenow[config.language]}
                                            </Text>
                                        </TouchableOpacity>}
                                    </View>}

                                {/* /---------END DELIVER---------/ */}

                                {this.props.route.params.Status == 8 &&
                                    <View>
                                        <View style={{ width: mobileW * 100 / 100, flex: 1, paddingVertical: 2, backgroundColor: '#EEEEEE', bottomborder: mobileW * 1, borderColor: Colors.bottomborder, marginVertical: mobileW * 3 / 100, alignSelf: 'center' }} />
                                        <View style={{
                                            shadowColor: Colors.shadowbuy, shadowOffset: { width: 1, height: 1 }, shadowOpacity: 0.5, shadowRadius: 2, elevation: 1,
                                            width: mobileW * 95 / 100, alignSelf: 'center', marginTop: mobileW * 4 / 100,
                                            paddingVertical: mobileW * 1 / 100, backgroundColor: Colors.white1, borderRadius: mobileW * 2 / 100, paddingBottom: mobileW * 13 / 100,
                                        }}>

                                            <View style={{ flexDirection: 'row', width: mobileW * 95 / 100, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', marginTop: mobileW * 1 / 100, }}>
                                                <View style={{ marginTop: mobileW * -9 / 100 }}>
                                                    <Image
                                                        style={{ alignSelf: 'center', width: mobileW * 9.5 / 100, height: mobileW * 9.5 / 100, borderRadius: mobileW * 5 / 100, borderColor: Colors.light_grey, borderWidth: 1.5, marginTop: mobileW * -1.7 / 100 }}
                                                        source={localimag.protwo}>
                                                    </Image>
                                                </View>

                                                <View style={{ paddingLeft: mobileW * 1 / 100 }}>
                                                    <View style={{ width: mobileW * 78 / 100, flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', marginLeft: mobileW * 1 / 100 }}>
                                                        <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.Semibold, color: Colors.violet }}>{Lang_chg.benjamin[config.language]}</Text>
                                                        <Text style={{ fontSize: mobileW * 3.6 / 100, fontFamily: Font.OutfitMedium, color: Colors.textgrey }}>20 min ago</Text>
                                                    </View>

                                                    <View style={{ width: mobileW * 78 / 100, flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', marginLeft: mobileW * 1 / 100 }}>
                                                        <View style={{ width: mobileW * 60 / 100, flexDirection: 'row', alignSelf: 'center', justifyContent: 'flex-start', paddingVertical: mobileW * 1 / 100 }}>

                                                            <Image
                                                                style={{ alignSelf: 'center', width: mobileW * 2.6 / 100, height: mobileW * 2.6 / 100, borderRadius: mobileW * 5 / 100 }}
                                                                source={localimag.star} />
                                                            <Image
                                                                style={{ alignSelf: 'center', width: mobileW * 2.6 / 100, height: mobileW * 2.6 / 100, borderRadius: mobileW * 5 / 100 }}
                                                                source={localimag.star} />
                                                            <Image
                                                                style={{ alignSelf: 'center', width: mobileW * 2.6 / 100, height: mobileW * 2.6 / 100, borderRadius: mobileW * 5 / 100 }}
                                                                source={localimag.star} />
                                                            <Image
                                                                style={{ alignSelf: 'center', width: mobileW * 2.6 / 100, height: mobileW * 2.6 / 100, borderRadius: mobileW * 5 / 100 }}
                                                                source={localimag.star} />
                                                            <Image
                                                                style={{ alignSelf: 'center', width: mobileW * 2.6 / 100, height: mobileW * 2.6 / 100, borderRadius: mobileW * 5 / 100 }}
                                                                source={localimag.stargrey} />

                                                        </View>
                                                    </View>
                                                    <View style={{ width: mobileW * 77 / 100, flexDirection: 'row', alignSelf: 'center', justifyContent: 'flex-start', paddingVertical: mobileW * 1 / 100 }}>
                                                        <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.OutfitMedium, color: Colors.grey, }}>{Lang_chg.Orderid[config.language]}</Text>
                                                    </View>

                                                    <View style={{ width: mobileW * 76 / 100, flexDirection: 'row', alignSelf: 'center', justifyContent: 'flex-start', }}>
                                                        <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.OutfitMedium, color: Colors.mediumgrey, }}>Lorem Ipsum enriching it with html elements that define its structure.</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>}
                            </View>










                        </TouchableOpacity>
                    </ScrollView>
                </TouchableOpacity>
            </View>
        )
    }
}