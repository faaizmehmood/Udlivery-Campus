import { View, Image, StatusBar, Text, FlatList, ImageBackground, TouchableOpacity, SafeAreaView, ScrollView, Keyboard, StyleSheet, TextInput } from 'react-native'
import React, { Component } from 'react'
import { config, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag } from './Provider/utilslib/Utils';

export default class DiningFacilities extends Component {
    constructor(props) {
        super(props)
        this.state = {
            eyeshow: false,
            recent_arr: [
                { id: 1, image: localimag.dishone, title: Lang_chg.Backyard[config.language], title2: Lang_chg.breakfast[config.language], title1: Lang_chg.open[config.language], status: true },
                { id: 2, image: localimag.dishtwo, title: Lang_chg.Chop[config.language], title2: Lang_chg.breaklunch[config.language], title1: Lang_chg.closed[config.language], status: false },
                { id: 3, image: localimag.dishfive, title: Lang_chg.eatmore[config.language], title2: Lang_chg.breakfast[config.language], title1: Lang_chg.closed[config.language], status: false },
                { id: 4, image: localimag.dishfour, title: Lang_chg.richtable[config.language], title2: Lang_chg.lunch[config.language], title1: Lang_chg.open[config.language], status: true },
                { id: 1, image: localimag.dishtwo, title: Lang_chg.Backyard[config.language], title2: Lang_chg.breakfast[config.language], title1: Lang_chg.open[config.language], status: true },
                { id: 2, image: localimag.dishthree, title: Lang_chg.food[config.language], title2: Lang_chg.breaklunch[config.language], title1: Lang_chg.closed[config.language], status: false },
                { id: 3, image: localimag.dishtwo, title: Lang_chg.Backyard[config.language], title2: Lang_chg.breakfast[config.language], title1: Lang_chg.closed[config.language], status: false },
                { id: 4, image: localimag.dishone, title: Lang_chg.Chop[config.language], title2: Lang_chg.lunch[config.language], title1: Lang_chg.open[config.language], status: true },
            ],
        }
    }
    render() {
        return (
            <View style={{ flex: 1 }}>

                <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={() => { Keyboard.dismiss() }}>
                    <SafeAreaView style={{ backgroundColor: Colors.theamColor, flex: 0 }} />
                    {/* <StatusBar barStyle='light-content' backgroundColor={Colors.theamColor} hidden={false} translucent={false} /> */}

                    <View style={{
                        paddingLeft: mobileW * 0.02, flexDirection: 'row', justifyContent: 'flex-start',
                        width: mobileW * 100 / 100, alignItems: 'center', backgroundColor: Colors.theamColor,
                    }} >
                        <TouchableOpacity style={{ width: mobileW * 12 / 100 }} onPress={() => this.props.navigation.goBack('')} >
                            <Image style={{ height: mobileW * 6 / 100, width: mobileW * 6 / 100, resizeMode: 'contain' }} source={localimag.goback} />
                        </TouchableOpacity>
                        <View style={{ width: mobileW * 78 / 100, paddingVertical: mobileW * 3 / 100, alignItems: 'center', alignSelf: 'center' }}>
                            <Text style={{ fontSize: mobileW * 5 / 100, color: Colors.white_color, fontFamily: Font.OutfitMedium }}>{Lang_chg.Diningfacilities[config.language]}</Text>
                        </View>
                        <View style={{ width: mobileW * 10 / 100 }}>
                            {/* <Image style={{ height: mobileW * 7 / 100, width: mobileW * 7 / 100, resizeMode: 'contain' }} source={localimag.notification} /> */}
                        </View>
                    </View>

                    <ScrollView keyboardDismissMode='interactive' keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>
                        <TouchableOpacity style={{ flex: 1, paddingBottom: mobileW * 30 / 100 }} activeOpacity={1}>

                            <View
                                style={{
                                    flexDirection: 'row', width: mobileW * 100 / 100, borderRadius: mobileW * 1 / 100, backgroundColor: '#FDFDFD', paddingVertical: mobileW * 1 / 100, shadowColor: Colors.shadow_color, shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.20, elevation: 1, alignSelf: 'center',
                                }}>
                                <Image style={{
                                    height: mobileW * 4.8 / 100, width: mobileW * 4.8 / 100, resizeMode: 'contain', alignSelf: 'center', justifyContent: 'center', marginLeft: mobileW * 2 / 100,
                                }} source={localimag.searchg}></Image>
                                <TextInput
                                    style={{
                                        width: '88%', justifyContent: 'center', paddingLeft: mobileW * 1 / 100, alignSelf: 'center', fontFamily: Font.Fontregular, paddingVertical: mobileW * 2 / 100, color: Colors.light_grey, fontSize: mobileW * 4.2 / 100
                                    }}
                                    onChangeText={(txt) => { this.setState({ password: txt }) }}
                                    maxLength={53}
                                    selectionColor={Colors.textInputSelectionColor1}
                                    returnKeyLabel='done'
                                    returnKeyType='done'
                                    secureTextEntry={this.state.eyeshow}
                                    onSubmitEditing={() => { Keyboard.dismiss() }}
                                    placeholderTextColor={Colors.light_grey} placeholder={Lang_chg.Homesearch[config.language]}
                                />
                            </View>





                            <View style={{ marginTop: mobileW * 1 / 100 }}>
                                <FlatList
                                    data={this.state.recent_arr}
                                    numColumns={2}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <View>

                                                <View style={{ alignItems: 'center', marginLeft: mobileH * 1.5 / 100, paddingVertical: mobileW * 2 / 100 }}>
                                                    <View
                                                        style={styles.inboxText}>

                                                        <View style={{
                                                            shadowColor: Colors.shadow_color,
                                                            shadowOffset: { width: 2, height: 2, },
                                                            shadowOpacity: 0.20,
                                                            elevation: 2, backgroundColor: '#FFFFFF', borderRadius: 4.8,paddingBottom:mobileW*2/100
                                                        }}>

                                                            <ImageBackground style={{ height: mobileW * 35 / 100, width: mobileW * 44 / 100, resizeMode: 'cover', alignSelf: 'center' }}
                                                                imageStyle={{ height: mobileW * 35 / 100, width: mobileW * 44 / 100, resizeMode: 'cover', borderRadius: 4.8 }}
                                                                source={item.image}>
                                                            </ImageBackground>

                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: mobileH * 0.01, marginLeft: mobileW * 0.02, }}>
                                                                <Text style={{ fontSize: mobileW * 3.5 / 100, color: Colors.mediumgrey, textAlign: 'center', fontFamily: Font.OutfitMedium }}>{item.title}</Text>
                                                            </View>

                                                            <View style={{ flexDirection: 'row', alignSelf: 'flex-start', alignItems: 'center', marginLeft: mobileW * 0.02,alignSelf:'flex-start',justifyContent:'center',paddingVertical:mobileW*0.6/100 }}>
                                                                <Image style={{ height: mobileW * 3.8 / 100, width: mobileW * 3.8 / 100, resizeMode: 'contain', }}
                                                                    source={localimag.breakfastimg} />
                                                                <Text style={{ fontSize: mobileW * 2.8 / 100, color: Colors.dinnigfacili, marginLeft: mobileW * 0.01, textAlign:'center', fontFamily: Font.Fontregular }}>{item.title2}</Text>
                                                            </View>
                                                            {item.status == true && <Text style={{ fontSize: mobileW * 3.5 / 100, color: Colors.opengreen, marginLeft: mobileW * 0.02, paddingVertical: 2, fontFamily: Font.OutfitMedium }}>{item.title1}</Text>}
                                                            {item.status == false && <Text style={{ fontSize: mobileW * 3.5 / 100, color: Colors.red, marginLeft: mobileW * 0.02, paddingVertical: 2, fontFamily: Font.OutfitMedium }}>{item.title1}</Text>}
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        )
                                    }} />
                            </View>


                        </TouchableOpacity>
                    </ScrollView>
                </TouchableOpacity>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    textInputView: {
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: Font.Fontregular,
        paddingVertical: mobileW * 1.5 / 100,
        color: Colors.textColors,
        fontSize: mobileW * 3.7 / 100
    },
    textInputHeader: {
        flexDirection: 'row',
        width: '100%',
        //borderRadius: mobileW * 1 / 100,
        backgroundColor: Colors.white_color,
        paddingVertical: mobileW * 1.5 / 100,
        shadowColor: Colors.shadow_color,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.20,
        elevation: 2,
        alignItems: 'center',

    },
    inboxText: {
        width: mobileW * 44 / 100,
        borderRadius: 5,
        //marginTop: mobileH * 1 / 100,
        alignSelf: 'center',
        justifyContent: 'center',
        paddingVertical: mobileW * 1 / 100,
    },
})