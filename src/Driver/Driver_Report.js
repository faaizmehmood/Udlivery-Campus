import { Text, View, ImageBackground, Image, TextInput, Dimensions, Switch, SafeAreaView, FlatList, StatusBar, TouchableOpacity, StyleSheet, ScrollView, Keyboard } from 'react-native';
import React, { Component } from 'react';
const MobileW = Dimensions.get('window').width;
const MobileH = Dimensions.get('window').height;
import { config, Common_Button, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag } from '../Provider/utilslib/Utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default class Driver_Report extends Component {
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.white_color }}>

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
                            <Text style={{ fontSize: mobileW * 5 / 100, color: Colors.white_color, fontFamily: Font.OutfitMedium }}>{Lang_chg.report[config.language]}</Text>
                        </View>
                        <View style={{ width: mobileW * 10 / 100 }}>
                            {/* <Image style={{ height: mobileW * 7 / 100, width: mobileW * 7 / 100, resizeMode: 'contain' }} source={localimag.whitedot} /> */}
                        </View>
                    </View>

                    <ScrollView keyboardDismissMode='interactive' keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>
                        <TouchableOpacity style={{ flex: 1, paddingBottom: mobileW * 15 / 100 }} activeOpacity={1}>


                            <View style={{ width: mobileW * 83 / 100, alignSelf: 'center', justifyContent: 'center', marginTop: mobileW * 5 / 100, backgroundColor: Colors.white_color }}>
                                <Text style={{ fontFamily: Font.fontmedium, fontSize: mobileW * 3.8 / 100, color: Colors.black_color, width: mobileW * 91 / 100, alignSelf: 'center', }}>{Lang_chg.enterdescription[config.language]}</Text>
                                <View style={{
                                    flexDirection: 'row',
                                    width: mobileW * 95 / 100,
                                    borderBottomColor: Colors.bottomborder,
                                    borderBottomWidth: 1,
                                    alignSelf: 'center',
                                    marginTop: mobileW * 7 / 100,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: mobileW * 2.5 / 100,
                                    padding: mobileW * 0 / 100,
                                }}>

                                    <TextInput
                                        style={styles.textInputView}
                                        onChangeText={(txt) => { this.setState({ message: txt }) }}
                                        maxLength={100}
                                        selectionColor={Colors.textInputSelectionColor1}
                                        multiline={true}
                                        returnKeyLabel='done'
                                        returnKeyType='done'
                                        onSubmitEditing={() => { Keyboard.dismiss() }} placeholderTextColor={'#e2e2e2'}
                                        placeholder={''}
                                    />

                                </View>
                            </View>

                            <TouchableOpacity onPress={() => { this.props.navigation.navigate('Detail') }}
                                style={{
                                    flexDirection: 'row', width: mobileW * 91 / 100,
                                    alignSelf: 'center', marginTop: mobileW * 9 / 100, justifyContent: 'center', alignItems: 'center', borderRadius: mobileW * 2 / 100, padding: mobileW * 3 / 100, backgroundColor: Colors.violet
                                }} >

                                <Text style={{ fontSize: mobileW * 4.3 / 100, fontFamily: Font.OutfitMedium, color: Colors.white_color, textAlign: 'center', paddingLeft: 3.5 }}>
                                    {Lang_chg.Submit[config.language]}
                                </Text>

                            </TouchableOpacity>


                        </TouchableOpacity>
                    </ScrollView>
                </TouchableOpacity>
            </View>
        )
    }
}
const styles = StyleSheet.create({

    ViewText:
    {
        flexDirection: 'row',
        width: mobileW * 95 / 100,
        borderBottomColor: Colors.bottom_border,
        borderBottomWidth: 1,
        alignSelf: 'center',

        alignItems: 'center',
        borderRadius: mobileW * 2.5 / 100,
        padding: mobileW * 0 / 100,


    },
    textInputView: {
        width: '97%',
        //justifyContent: 'center',
        //paddingLeft: mobileW * 1 / 100,
        alignSelf: 'center',
        fontFamily: Font.fontregular,
        color: Colors.textColors
    },
    ImageView: {

        paddingVertical: mobileW * 1 / 100,
        width: '8%',
        justifyContent: 'center',

    },
})