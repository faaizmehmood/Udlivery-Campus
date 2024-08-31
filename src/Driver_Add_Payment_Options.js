import React, { Component } from 'react'
import { View, Image, Text, ImageBackground, TouchableOpacity, SafeAreaView, Keyboard, BackHandler } from 'react-native'
import { config, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag } from './Provider/utilslib/Utils';

export default class Driver_Add_Payment_Options extends Component {

    constructor(props) {
        super(props); {
            this.state = {
                show1: 1,
                user_id: '',
            }
        }
        this._didFocusSubscription = props.navigation.addListener('focus', (payload) =>
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
        );
    }

    componentDidMount = () => {
        this.getUserDetail();
        this._willBlurSubscription = this.props.navigation.addListener('blur', (payload) =>
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
        );
    };


    handleBackPress = () => {
        // Alert.alert('Hold on!', 'Are you sure you want to exit app?', [
        //     {
        //         text: 'Cancel',
        //         onPress: () => null,
        //         style: 'cancel'
        //     },
        //     { text: 'YES', onPress: () => BackHandler.exitApp() }
        // ]);
        this.props.navigation.goBack();

        return true;
    };

    getUserDetail = async () => {
        let userdata = await localStorage.getItemObject('user_arr');
        this.setState({
            user_id: userdata.user_id,
        });
    };


    add_meal = (showType = 0) => {
        // console.log("Add meal function Show type: ", showType)

        localStorage.setItemString('showPaymentType', showType.toString());
        this.props.navigation.navigate('Addbank_detail', { edit: false, 'user_id': this.state.user_id });
    };

    add_With_Drawal = (showType = 0) => {
        console.log("This Show type is going from Driver_Add_PaymentOptions_Screen: ", showType)

        localStorage.setItemString('showPaymentType', showType.toString());
        this.props.navigation.navigate('Driver_Add_Withrawal', {
            showCardType: showType,
            edit: true
        })
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={() => { Keyboard.dismiss() }}>
                    <SafeAreaView style={{ backgroundColor: Colors.theamColor, flex: 0 }} />

                    <ImageBackground style={{
                        height: mobileH * 100 / 100, width: '100%'
                    }} source={localimag.vectorprofile} resizeMode='stretch'>
                        <View style={{ width: '40%', position: 'absolute', right: 12, top: 20, }}>
                            <Image style={{ height: mobileW * 30 / 100, width: mobileW * 25 / 100, resizeMode: 'contain', marginLeft: mobileW * 8 / 100 }} source={localimag.newwhitelogo} />
                        </View>

                        <View style={{
                            shadowColor: Colors.shadowbuy,
                            shadowOffset: { width: 1, height: 1 },
                            shadowOpacity: 0.5,
                            shadowRadius: 2,
                            elevation: 2, width: mobileW * 90 / 100,
                            paddingVertical: mobileW * 3 / 100, backgroundColor: '#fff', alignSelf: 'center', justifyContent: 'center',
                            borderRadius: mobileW * 3 / 100, marginTop: mobileW * 40 / 100, paddingBottom: mobileW * 10 / 100
                        }} >

                            <Image
                                style={{ alignSelf: 'center', width: mobileW * 35 / 100, height: mobileW * 46 / 100, }} resizeMode='contain'
                                source={localimag.mealvector}>
                            </Image>

                            <View style={{
                                width: mobileW * 84 / 100, alignItems: 'center', alignSelf: 'center', borderRadius: mobileW * 1 / 100,
                                marginTop: mobileW * 3 / 100, backgroundColor: Colors.whitepurple, paddingVertical: mobileW * 2.5 / 100,
                                marginBottom: mobileW * 3 / 100
                            }}>

                                <Text style={{
                                    fontSize: mobileW * 3.5 / 100, fontFamily: Font.Fontregular, color: Colors.black, textAlign: 'center', width: '90%', lineHeight: mobileW * 5 / 100
                                }}>
                                    {Lang_chg.howwoulyoulike[config.language]}</Text>

                            </View>
                            {/* -------------With Drawal Options 1 and 2 */}

                            {/* -------------Paypal Button----------------- */}

                            {/* <View style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                marginTop: 10,
                                gap: 10
                            }}> */}
                            {/* <TouchableOpacity
                                    // onPress={() => { this.props.navigation.navigate('Addbank_detail', { edit: false, 'user_id':this.state.user_id }); }}
                                    // onPress={() => { this.props.navigation.navigate('Addbank_detail') }}
                                    onPress={() => {
                                        0
                                        this.add_With_Drawal(0)
                                    }}
                                    style={{
                                        flexDirection: 'row', width: mobileW * 39 / 100,
                                        alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderRadius: mobileW * 1 / 100,
                                        padding: mobileW * 3 / 100, backgroundColor: Colors.violet,
                                        marginLeft: 1
                                    }} >

                                    <Text style={{ fontSize: mobileW * 4 / 100, color: Colors.white_color, fontFamily: Font.fontbold, textAlign: 'center', paddingLeft: 3.5 }}>
                                        {Lang_chg.Venmo[config.language]}
                                    </Text>

                                </TouchableOpacity> */}

                            {/* <TouchableOpacity
                                    onPress={() => {
                                        this.add_With_Drawal(1);
                                    }}
                                    style={{
                                        flexDirection: 'row', width: mobileW * 81 / 100,
                                        alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderRadius: mobileW * 1 / 100,
                                        padding: mobileW * 3 / 100, backgroundColor: Colors.violet,
                                    }}>
                                    <Text style={{ fontSize: mobileW * 4 / 100, color: Colors.white_color, fontFamily: Font.fontbold, textAlign: 'center', paddingLeft: 3.5 }}>
                                        {Lang_chg.Paypal[config.language]}
                                    </Text>

                                </TouchableOpacity>
                            </View> */}

                            <View style={{
                                marginTop: 10,
                                justifyContent: 'center',
                                gap: 10
                            }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.add_With_Drawal(2)
                                    }}
                                    style={{
                                        flexDirection: 'row', width: mobileW * 82 / 100,
                                        alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderRadius: mobileW * 1 / 100,
                                        padding: mobileW * 3 / 100, backgroundColor: Colors.violet,
                                        marginLeft: 1
                                    }} >
                                    <Text style={{ fontSize: mobileW * 4 / 100, color: Colors.white_color, fontFamily: Font.fontbold, textAlign: 'center', paddingLeft: 3.5 }}>
                                        {Lang_chg.DebitCard[config.language]}
                                    </Text>

                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => {
                                        // this.add_With_Drawal(4)
                                        this.add_meal(4)
                                    }}
                                    style={{
                                        flexDirection: 'row', width: mobileW * 82 / 100,
                                        alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderRadius: mobileW * 1 / 100,
                                        padding: mobileW * 3 / 100, backgroundColor: Colors.violet,
                                    }} >

                                    <Text style={{ fontSize: mobileW * 4 / 100, color: Colors.white_color, fontFamily: Font.fontbold, textAlign: 'center', paddingLeft: 3.5 }}>
                                        {Lang_chg.BankAccount[config.language]}
                                    </Text>

                                </TouchableOpacity>
                            </View>

                        </View>

                        <View >
                        </View>
                    </ImageBackground>
                </TouchableOpacity>
            </View>
        )
    }
}