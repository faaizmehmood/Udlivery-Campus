import { View, Image, StatusBar, Text, FlatList, ImageBackground, TouchableOpacity, SafeAreaView, ScrollView, Keyboard, StyleSheet, TextInput } from 'react-native'
import React, { Component } from 'react'
import { config, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag } from './Provider/utilslib/Utils';

export default class Report extends Component {
    constructor(props) {
        super(props);
        this.state = {
            desc: '',
            user_id: this.props.route.params.user_id,
            order_id: this.props.route.params.order_id,
            order_arr: this.props.route.params.order_arr,
            other_user_id: this.props.route.params.other_user_id,
        }
        //console.log("user_id",this.state.user_id);
        //console.log("order_arr",this.state.order_arr);
    }

    order_report_send = async () => {



        let url = config.baseURL + 'order_report_send.php'



        consolepro.consolelog('url', url);
        var data = new FormData();

        data.append('user_id', this.state.user_id);
        data.append('order_id', this.state.order_id);
        data.append('reason', this.state.desc);
        data.append('other_user_id', this.state.order_arr.order_status==0?this.state.user_id:this.state.order_arr.driver_id);

        consolepro.consolelog('order_report_send', data);
        apifuntion
            .postApi(url, data)
            .then((obj) => {
                consolepro.consolelog('obj', obj);
                if (obj.success == 'true') {
                    msgProvider.toast(obj.msg[0], 'center');



                    setTimeout(() => {
                        //    this.props.navigation.navigate('Home');
                        this.props.navigation.goBack();
                        // this.props.navigation.navigate('Verify',{user_id:obj.user_details.user_id});
                    }, 700);
                } else {
                    if (obj.account_active_status == 0) {
                        // this.props.navigation.navigate('Login')
                        consolepro.consolelog('account_active_status', obj.account_active_status)
                        config.checkUserDeactivate(this.props.navigation);
                        return false;
                    }
                    msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                    return false;
                }
            }).catch((error) => {
                console.log('error',error);  });
    };










    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.white_color }}>

                <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={() => { Keyboard.dismiss() }}>
                    <SafeAreaView style={{ backgroundColor: Colors.theamColor, flex: 0 }} />
                    {/* <StatusBar barStyle='light-content' backgroundColor={Colors.theamColor} hidden={false} translucent={false} /> */}

                    <View style={{
                        width: mobileW * 100 / 100, alignItems: 'center', backgroundColor: Colors.theamColor,
                    }} >
                        <View style={{ width: mobileW * 95 / 100, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center', paddingVertical: mobileW * 3 / 100 }}>
                            <TouchableOpacity style={{ width: mobileW * 12 / 100 }} onPress={() => this.props.navigation.goBack()} >
                                <Image style={{ height: mobileW * 6 / 100, width: mobileW * 6 / 100, resizeMode: 'contain' }} source={localimag.goback} />
                            </TouchableOpacity>
                            <View style={{ width: mobileW * 71 / 100, alignItems: 'center', alignSelf: 'center' }}>
                                <Text style={{ fontSize: mobileW * 5 / 100, color: Colors.white_color, fontFamily: Font.OutfitMedium }}>{Lang_chg.report[config.language]}</Text>
                            </View>
                            <View style={{ width: mobileW * 12 / 100, alignItems: 'flex-end' }}>
                                {/* <Image style={{ height: mobileW * 5 / 100, width: mobileW * 5 / 100, resizeMode: 'contain' }} source={localimag.whitedot} /> */}
                            </View>
                        </View>
                    </View>

                    <ScrollView keyboardDismissMode='interactive' keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>
                        <TouchableOpacity style={{ flex: 1, paddingBottom: mobileW * 15 / 100 }} activeOpacity={1}>
                            <View style={{ width: '86%', alignSelf: 'center' }}>

                                {/* .....................For msg.................... */}
                                <View style={{ width: '96%', alignSelf: 'center', flexDirection: 'row', marginTop: mobileW * 0.05, alignItems: 'center', }}>


                                    {/* textInput--------- */}
                                    <View style={{ width: '97%', }}>
                                        <TextInput
                                            onChangeText={(txt) => this.setState({ desc: txt })}
                                            selectionColor={Colors.textInputSelectionColor1}
                                            placeholder={Lang_chg.enterdescription[config.language]}
                                            keyboardType='default'
                                            placeholderTextColor={'#636363'}
                                            maxLength={200}
                                            // numberOfLines={7}
                                            multiline={true}

                                            style={{
                                                height: Font.text_area_height,

                                                textAlignVertical: 'top', marginTop: Platform.OS == 'android' ? mobileW * 2.2 / 100 : 0, width: '95%', fontSize: mobileW * 4 / 100, color: '#636363', fontFamily: Font.Semibold
                                            }}></TextInput>
                                    </View>
                                </View>
                                <View style={{
                                    width: '98%', height: 1, backgroundColor: Colors.bottomborder, alignSelf: 'center',
                                    marginTop: mobileW * .15 / 100
                                }}></View>


                                <TouchableOpacity onPress={() => {

                                    if (this.state.desc == '') {
                                        //FULL NAME
                                        msgProvider.toast(msgText.enterDescription[config.language], 'center');
                                        return false;
                                    }
                                    // else if (this.state.desc.trim().length < 3) {
                                    //     msgProvider.toast(msgText.Descriptionminimumcharacter[config.language], 'center');
                                    //     return false;
                                    // }
                                    else if (this.state.desc.trim().length < 3) {
                                        msgProvider.toast(msgText.minimumReportMessage[config.language], 'center');
                                        return false;
                                    }




                                    // this.props.navigation.goBack('')
                                    this.order_report_send()
                                }}
                                    style={{
                                        flexDirection: 'row', width: mobileW * 91 / 100,
                                        alignSelf: 'center', marginTop: mobileW * 9 / 100, justifyContent: 'center', alignItems: 'center', borderRadius: mobileW * 2 / 100, padding: mobileW * 3 / 100, backgroundColor: Colors.violet
                                    }} >

                                    <Text style={{ fontSize: mobileW * 4 / 100, color: Colors.white_color, fontFamily: Font.fontbold, textAlign: 'center', paddingLeft: 3.5 }}>
                                        {Lang_chg.Submit[config.language]}
                                    </Text>

                                </TouchableOpacity>

                            </View>
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
        fontFamily: Font.Fontregular,
        color: Colors.textColors
    },
    ImageView: {

        paddingVertical: mobileW * 1 / 100,
        width: '8%',
        justifyContent: 'center',

    },
})