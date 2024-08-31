import React, { Component } from 'react'
import { View, Image, StatusBar, Text, FlatList, ImageBackground, TouchableOpacity, SafeAreaView, ScrollView, Keyboard, StyleSheet, TextInput, BackHandler, Alert } from 'react-native'
import { config, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag } from './Provider/utilslib/Utils';

export default class Paynow extends Component {

    constructor(props) {
        super(props);
        this.state = {
            txn_id: this.props.route.params.txn_id,
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
        return true;
    }


    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.white_color, justifyContent: 'center' }}>


                <SafeAreaView style={{ backgroundColor: Colors.theamColor, flex: 0 }} />

                <View style={{ alignSelf: 'center', justifyContent: 'center', }}>
                    <Image style={{ height: mobileW * 25 / 100, width: mobileW * 25 / 100, resizeMode: 'cover', alignSelf: 'center', }} source={localimag.done}  ></Image>
                </View>

                <View style={{ alignSelf: 'center', width: mobileW * 60 / 100, justifyContent: 'center', marginTop: mobileW * 2 / 100, paddingVertical: mobileW * 2.5 / 100, }}>
                    <Text style={{ fontFamily: Font.Bold, fontSize: mobileW * 5.7 / 100, alignSelf: 'center', color: Colors.black, textAlign: 'center' }}>{Lang_chg.Thanks[config.language]}</Text>
                </View>
                <View style={{ alignSelf: 'center', width: mobileW * 70 / 100, }}>
                    <Text style={{ fontFamily: Font.OutfitMedium, fontSize: mobileW * 3.8 / 100, color: "#828384", textAlign: 'center' }}>{Lang_chg.Succefully[config.language]}</Text>
                </View>
                <View style={{ alignSelf: 'center', width: mobileW * 70 / 100, }}>
                    <Text style={{ fontFamily: Font.OutfitMedium, fontSize: mobileW * 3.8 / 100, color: "#828384", textAlign: 'center', paddingVertical: mobileW * 1.5 / 100, }}>{Lang_chg.feed[config.language]}</Text>
                </View>

                <View style={{ alignSelf: 'center', width: mobileW * 70 / 100, }}>
                    <Text style={{ fontFamily: Font.OutfitMedium, fontSize: mobileW * 3.8 / 100, color: "#828384", textAlign: 'center' }}>
                        {Lang_chg.Transactionid[config.language]}
                        {this.state.txn_id}
                    </Text>
                </View>

                <TouchableOpacity onPress={() => this.props.navigation.navigate('Orderhistory')}
                    style={{ width: mobileW * 80 / 100, borderRadius: mobileW * 1 / 100, marginTop: mobileW * 6 / 100, backgroundColor: Colors.removecolor, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', paddingVertical: mobileW * 4 / 100 }}>

                    <Text style={{ fontSize: mobileW * 4.3 / 100, fontFamily: Font.OutfitMedium, color: Colors.white_color, textAlign: 'center' }}>{Lang_chg.ok[config.language]}</Text>

                </TouchableOpacity>


            </View>
        )
    }
}