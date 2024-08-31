import { RefreshControl, View, Image, StatusBar, Text, FlatList, ImageBackground, TouchableOpacity, SafeAreaView, ScrollView, Keyboard, StyleSheet, TextInput } from 'react-native'
import React, { Component } from 'react'
import { config, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag, firebaseprovider } from './Provider/utilslib/Utils';
import Footer from './Provider/Footer'
import HideWithKeyboard from 'react-native-hide-with-keyboard';

export default class Orderhistory extends Component {

    constructor(props) {
        super(props)
        this.state = {
            eyeshow: false,
            num_arr: 'NA',
            num_arr2: 'NA',
            user_id: '',
            university_id: '',
            isSearch: false
        }
    }

    componentDidMount() {
        this.getUserDetail();
        this.props.navigation.addListener('focus', () => {
            firebaseprovider.firebaseUserGetInboxCount();
            //console.log("count_inbox Home--->", count_inbox);
            this.getUserDetail();
        });
    }

    get_order_history = async (var1) => {
        let url = config.baseURL + 'order_history_list_by_id.php?user_id=' + this.state.user_id + '&university_id=' + this.state.university_id;
        consolepro.consolelog('url', url);

        if (var1 == 1) {
            var1 == 1
        }
        else if (var1 == 0) {
            var1 == 0
        }
        else {
            var1 == 0
        }
        apifuntion.getApi(url, var1).then((obj) => {
            consolepro.consolelog(obj);
            if (obj.success == 'true') {
                let orderHistory_arr = obj.orderHistory_arr;

                setTimeout(() => {
                    this.setState({
                        num_arr: orderHistory_arr,
                        num_arr2: orderHistory_arr,
                        refresh: false
                    });
                }, 0);

            } else {

                if (obj.account_active_status == 0) {
                    config.checkUserDeactivate(this.props.navigation);
                    return false;
                }
                msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                return false;
            }
        }).catch((error) => {
            console.log('error', error);
        });
    };

    getUserDetail = async () => {
        let userdata = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('userdata', userdata);
        this.setState({
            user_id: userdata.user_id,
            university_id: userdata.university_id,
        });

        this.get_order_history();

    };

    _onRefresh = () => {
        this.setState({ refresh: true })
        this.get_order_history(1);
    }

    //-----------------02-09-22
    SearchFilterFunction = (text) => {
        let data1 = this.state.num_arr2
        const newData = data1.filter(function (item) {
            const itemData = item.dining_name ? item.dining_name.toUpperCase() : ''.toUpperCase();
            const itemOrder = item.order_no ? item.order_no.toUpperCase() : ''.toUpperCase();
            const textData = text.toUpperCase();
            return (itemData.indexOf(textData) > -1 || itemOrder.indexOf(textData) > -1);
        });

        if (newData.length > 0) {
            this.setState({
                num_arr: newData,
            });
        }
        else {
            this.setState({
                num_arr: 'NA',
            });
            this.setState({ msg: 'This Type of data is not available' })
        }
    }





    render() {
        return (
            <View style={{ flex: 1 }}>

                <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={() => { Keyboard.dismiss() }}>
                    <SafeAreaView style={{ backgroundColor: Colors.theamColor, flex: 0 }} />

                    <View style={{
                        flexDirection: 'row', justifyContent: 'flex-start',
                        width: mobileW * 100 / 100, alignItems: 'center', backgroundColor: Colors.theamColor,
                    }} >
                        <View style={{ width: mobileW * 10 / 100 }} onPress={() => this.props.navigation.goBack('')} >

                        </View>
                        <View style={{ width: mobileW * 80 / 100, paddingVertical: mobileW * 3 / 100, alignItems: 'center', alignSelf: 'center' }}>
                            <Text style={{ fontSize: mobileW * 5 / 100, color: Colors.white_color, fontFamily: Font.OutfitMedium }}>{Lang_chg.Orderhistory[config.language]}</Text>
                        </View>
                        <View style={{ width: mobileW * 10 / 100 }}>
                        </View>
                    </View>

                    <View
                        style={{ height: mobileH * 95 / 100 }}
                    >
                        <TouchableOpacity style={{ flex: 1, paddingBottom: mobileW * 32 / 100 }} activeOpacity={1}>

                            <View
                                style={{
                                    flexDirection: 'row', width: mobileW * 100 / 100, borderRadius: mobileW * 1 / 100, backgroundColor: '#FDFDFD', paddingVertical: mobileW * 1 / 100, shadowColor: Colors.shadow_color, shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.20, elevation: 1, alignSelf: 'center',
                                }}>
                                {localimag.searchg && <Image style={{
                                    height: mobileW * 4.8 / 100, width: mobileW * 4.8 / 100, resizeMode: 'contain', alignSelf: 'center', justifyContent: 'center', marginLeft: mobileW * 3 / 100,
                                }} source={localimag.searchg}></Image>}
                                <TextInput
                                    style={{
                                        width: '88%', justifyContent: 'center', paddingLeft: mobileW * 2 / 100, alignSelf: 'center', fontFamily: Font.fontregular, paddingVertical: mobileW * 2 / 100, color: Colors.light_grey, fontSize: mobileW * 4.2 / 100
                                    }}
                                    maxLength={53}
                                    returnKeyLabel='done'
                                    returnKeyType='done'
                                    secureTextEntry={this.state.eyeshow}
                                    onSubmitEditing={() => { Keyboard.dismiss() }}
                                    placeholderTextColor={Colors.light_grey} placeholder={'Search'}
                                    onFocus={() => { this.setState({ errorno: 0, activeinput: 1 }); this.setState({ isSearch: true }) }}
                                    onBlur={() => this.setState({ isSearch: false })}
                                    selectionColor={Colors.textInputSelectionColor1}
                                    onChangeText={(txt) => { this.SearchFilterFunction(txt) }}
                                />
                            </View>


                            <View style={{ marginTop: mobileW * 2 / 100 }}>
                                {this.state.num_arr != 'NA' &&

                                    <FlatList
                                        data={this.state.num_arr}
                                        contentContainerStyle={{ paddingBottom: mobileW * 4 / 100 }}
                                        renderItem={({ item, index }) => {
                                            return (
                                                <TouchableOpacity key={index} onPress={() => {
                                                    this.props.navigation.navigate('Pendingui', { 'order_status': item.order_status, 'order_id': item.order_id })
                                                }} style={{
                                                    width: mobileW * 95 / 100, alignSelf: 'center', paddingVertical: mobileW * 2 / 100, backgroundColor: '#fff', borderRadius: mobileW * 3 / 100, marginTop: mobileW * 2 / 100
                                                }} >


                                                    <View style={{ paddingVertical: mobileW * 1 / 100, flexDirection: 'row', width: mobileW * 95 / 100, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', }}>

                                                        <View>
                                                            {item.dining_image && <Image borderRadius={10}
                                                                style={{ alignSelf: 'center', width: mobileW * 24 / 100, height: mobileW * 23 / 100, }}
                                                                source={{ uri: config.img_url + item.dining_image }}
                                                            >
                                                            </Image>}
                                                        </View>

                                                        <View style={{ paddingLeft: mobileW * 2 / 100, }}>
                                                            <View style={{ flexDirection: 'row', width: mobileW * 65 / 100, alignSelf: 'center', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <Text style={{
                                                                    width: '60%', fontSize: mobileW * 4 / 100, fontFamily: Font.Semibold, color: Colors.violet, marginLeft: mobileW * 1 / 100
                                                                }}>
                                                                    {item.dining_name}</Text>
                                                                <View style={{ width: mobileW * 25 / 100, backgroundColor: Colors.whitepurple, borderColor: Colors.bottomborder, borderRadius: mobileW * 4 / 100, borderWidth: 1, paddingVertical: mobileW * 1 / 100 }}>
                                                                    <Text style={{ fontSize: mobileW * 3 / 100, fontFamily: Font.OutfitMedium, color: Colors.black, textAlign: 'center' }}>

                                                                        {item.dining_facility_id == 0 && Lang_chg.Dining[config.language]}
                                                                        {item.dining_hall_id == 0 && Lang_chg.Diningf[config.language]}
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                            {
                                                                item.item_quntity != null &&
                                                                <View style={{ width: mobileW * 63 / 100, flexDirection: 'row', alignSelf: 'center', justifyContent: 'flex-start', paddingVertical: mobileW * 1 / 100 }}>
                                                                    <Text style={{ fontSize: mobileW * 3 / 100, fontFamily: Font.OutfitMedium, color: Colors.ordercolor, }}>
                                                                        {Lang_chg.qty[config.language]}

                                                                        {item.item_quntity}
                                                                    </Text>
                                                                </View>
                                                            }

                                                            <View style={{ width: mobileW * 63 / 100, flexDirection: 'row', alignSelf: 'center', justifyContent: 'flex-start', }}>
                                                                <Text style={{ fontSize: mobileW * 3 / 100, fontFamily: Font.OutfitMedium, color: Colors.ordercolor, }}>
                                                                    {Lang_chg.Order_id[config.language]}

                                                                    {item.order_no}
                                                                </Text>
                                                            </View>

                                                            <View style={{ flexDirection: 'row', width: mobileW * 63 / 100, alignSelf: 'center', justifyContent: 'space-between', paddingVertical: mobileW * 1 / 100 }}>
                                                                <Text style={{ fontSize: mobileW * 3 / 100, fontFamily: Font.OutfitMedium, color: Colors.ordercolor, }}>
                                                                    {item.text2}
                                                                    {Lang_chg.Ordercreted[config.language]}
                                                                </Text>
                                                                <View style={{ flexDirection: 'row', width: mobileW * 34 / 100, }}>
                                                                    {item.image1 && <Image style={{
                                                                        height: mobileW * 3 / 100, width: mobileW * 3 / 100, resizeMode: 'contain', alignSelf: 'center', justifyContent: 'center', marginRight: mobileW * 1 / 100,
                                                                    }} source={item.image1}></Image>}
                                                                    <Text style={{ fontSize: mobileW * 3 / 100, fontFamily: Font.fontsemibold, color: Colors.ordercolor, textAlign: 'center' }}>{item.createtime}</Text>
                                                                </View>
                                                            </View>
                                                            <View style={{ width: mobileW * 63 / 100, flexDirection: 'row', alignSelf: 'center', justifyContent: 'flex-start', }}>
                                                                {item.order_status == 0 ? <Text style={{ fontSize: mobileW * 3. / 100, fontFamily: Font.OutfitMedium, color: Colors.yellow }}>{Lang_chg.pending[config.language]}</Text> :
                                                                    item.order_status == 1 ? <Text style={{ fontSize: mobileW * 3. / 100, fontFamily: Font.OutfitMedium, color: Colors.green }}> {Lang_chg.accepted[config.language]}</Text> :
                                                                        item.order_status == 2 ? <Text style={{ fontSize: mobileW * 3. / 100, fontFamily: Font.OutfitMedium, color: Colors.green }}>{Lang_chg.pickup[config.language]}</Text> :
                                                                            item.order_status == 3 ? <Text style={{ fontSize: mobileW * 3. / 100, fontFamily: Font.OutfitMedium, color: Colors.green }}>{Lang_chg.Delivered_txt[config.language]}</Text> :
                                                                                item.order_status == 4 ? <Text style={{ fontSize: mobileW * 3. / 100, fontFamily: Font.OutfitMedium, color: Colors.red }}>{Lang_chg.cancelled[config.language]}</Text> :
                                                                                    null
                                                                }
                                                            </View>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        }} />
                                }
                            </View>
                        </TouchableOpacity>
                    </View>
                    {!this.state.isSearch && <Footer
                        activepage='Orderhistory'
                        usertype={1}
                        footerpage={[
                            { name: 'Home', fname: 'Home', countshow: false, image: (localimag.homeinactive), activeimage: (localimag.homeactive) },
                            { name: 'Inbox', fname: 'Inbox', countshow: count_inbox, image: (localimag.notifyinactive), activeimage: (localimag.notifyactive) },
                            { name: 'Orderhistory', countshow: false, image: (localimag.calenderinactive), activeimage: (localimag.calenderactive) },
                            { name: 'Setting', fname: 'Setting', countshow: false, image: (localimag.settinginactive), activeimage: (localimag.settingactive) },
                            { name: 'Profile', fname: 'Profile', countshow: false, image: (localimag.userinactive), activeimage: (localimag.useractive) },
                        ]}
                        navigation={this.props.navigation}
                        imagestyle1={{ width: 26, height: 26, backgroundColor: '#01faff', countcolor: '#FFFFFF', countbackground: '#FFFFFF' }}
                    />}
                </TouchableOpacity>
            </View>
        )
    }
}
