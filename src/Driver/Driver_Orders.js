import { RefreshControl, View, Image, StatusBar, Text, FlatList, ImageBackground, TouchableOpacity, SafeAreaView, Modal, Keyboard, StyleSheet, TextInput, ScrollView } from 'react-native'
import React, { Component } from 'react'
import { config, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag, firebaseprovider } from '../Provider/utilslib/Utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Driver_Footer from '../Driver/Driver_Footer';

export default class Driver_Orders extends Component {

    constructor(props) {
        super(props); {
            this.state = {
                user_id: 'NA',
                num_arr: 'NA',
                num_arr2: [],
                refresh: false
            }
        }
    }

    componentDidMount() {
        this.getUserDetail();
        this.props.navigation.addListener('focus', () => {
            firebaseprovider.firebaseUserGetInboxCount();
            this.getUserDetail();
        });
    }

    getUserDetail = async () => {
        let userdata = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('userdata', userdata);

        this.setState({
            user_id: userdata.user_id,
        });
        consolepro.consolelog(this.state.user_id);

        this.get_all_dining();
    };

    get_all_dining = async (var1) => {
        let url = config.baseURL + 'get_driver_order_list.php?user_id=' + this.state.user_id;
        // console.log('url of driver Order List: ', url);
        var var2 = 0;
        if (var1 == 1) {
            var2 = 1;
        }
        apifuntion

            // .getApi(url, 0)
            .getApi(url, var2)

            .then((obj) => {

                // consolepro.consolelog(obj);
                // console.log('obj of driver Order List: ', obj);
                if (obj.success == 'true') {
                    let order_arr = obj.order_arr;

                    // setTimeout(() => {
                    this.setState({
                        // dining_arr: dining_arr,  
                        num_arr: order_arr,
                        num_arr2: order_arr,
                        refresh: false

                        //   load:false
                    });
                    // }, 300);

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
                consolepro.consolelog("-------- error ------- " + error);

                msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
            });
    };

    _onRefresh = () => {
        this.setState({ refresh: true })
        // this.getAllProduct(1);
        this.get_all_dining(1);
    }



    //-----------------02-09-22
    SearchFilterFunction = (text) => {
        let data1 = this.state.num_arr2 || [];
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
            <View style={{ flex: 1, backgroundColor: '#F5F3F3' }}>

                <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={() => { Keyboard.dismiss() }}>
                    <SafeAreaView style={{ backgroundColor: Colors.theamColor, flex: 0 }} />
                    {/* <StatusBar barStyle='light-content' backgroundColor={Colors.theamColor} hidden={false} translucent={false} /> */}

                    <View style={{
                        flexDirection: 'row', justifyContent: 'flex-start',
                        width: mobileW * 100 / 100, alignItems: 'center', backgroundColor: Colors.theamColor,
                    }} >
                        <TouchableOpacity style={{ width: mobileW * 12 / 100, marginLeft: 9 }} onPress={() => this.props.navigation.goBack('')} >
                            {localimag.goback && <Image style={{ height: mobileW * 6 / 100, width: mobileW * 6 / 100, resizeMode: 'contain' }} source={localimag.goback} />}
                        </TouchableOpacity>
                        <View style={{ width: mobileW * 76 / 100, paddingVertical: mobileW * 3 / 100, alignItems: 'center', alignSelf: 'center' }}>
                            <Text style={{ fontSize: mobileW * 5 / 100, color: Colors.white_color, fontFamily: Font.OutfitMedium }}>{Lang_chg.Order[config.language]}</Text>
                        </View>
                        {/* <TouchableOpacity style={{ width: mobileW * 12 / 100 }}
                            onPress={() => { this.props.navigation.navigate('Notification') }}
                        >
                            <Image style={{ height: mobileW * 7 / 100, width: mobileW * 7 / 100, resizeMode: 'contain' }} source={localimag.notification} />
                        </TouchableOpacity> */}
                    </View>

                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refresh}
                                onRefresh={this._onRefresh}
                            // tintColor={Colors.theme_color}
                            // colors={[Colors.theme_color]}
                            />
                        }

                        keyboardDismissMode='interactive' keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>
                        <TouchableOpacity style={{ flex: 1, paddingBottom: mobileW * 3 / 100 }} activeOpacity={1}>
                            <KeyboardAwareScrollView contentContainerStyle={{ marginBottom: mobileW * 0.20 }}>

                                <View
                                    style={{
                                        flexDirection: 'row', width: mobileW * 100 / 100, borderRadius: mobileW * 1 / 100, backgroundColor: '#FDFDFD', paddingVertical: mobileW * 1 / 100, shadowColor: Colors.shadow_color, shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.20, elevation: 1, alignSelf: 'center',
                                    }}>
                                    {localimag.searchg && <Image style={{
                                        height: mobileW * 4.8 / 100, width: mobileW * 4.8 / 100, resizeMode: 'contain', alignSelf: 'center', justifyContent: 'center', marginLeft: mobileW * 2 / 100,
                                    }} source={localimag.searchg}></Image>}
                                    <TextInput
                                        style={{
                                            width: '88%', justifyContent: 'center', paddingLeft: mobileW * 1 / 100, alignSelf: 'center', fontFamily: Font.fontregular, paddingVertical: mobileW * 2 / 100, color: Colors.light_grey, fontSize: mobileW * 4.2 / 100
                                        }}
                                        maxLength={53}
                                        returnKeyLabel='done'
                                        returnKeyType='done'
                                        secureTextEntry={this.state.eyeshow}
                                        onSubmitEditing={() => { Keyboard.dismiss() }}
                                        placeholderTextColor={Colors.light_grey} placeholder={'Search'}
                                        onFocus={() => { this.setState({ errorno: 0, activeinput: 1 }) }}
                                        onChangeText={(txt) => { this.SearchFilterFunction(txt) }}
                                        selectionColor={Colors.textInputSelectionColor1}
                                    />
                                </View>

                                {this.state.num_arr == 'NA' ?
                                    <Text style={{ width: '50%', alignSelf: 'center', color: Colors.textgrey, textAlign: 'center', fontFamily: Font.FontBold, marginTop: mobileW * 30 / 100, fontSize: mobileW * 5.5 / 100 }}>
                                        {Lang_chg.No_order_available_for_delivery[config.language]}</Text>
                                    :
                                    <View style={{ width: '94%', alignSelf: 'center', paddingVertical: mobileW * 3 / 100, }}>
                                        {
                                            this.state.num_arr != "NA" &&

                                            <FlatList
                                                data={this.state.num_arr}
                                                keyExtractor={(index) => { index.toString() }}
                                                renderItem={({ item, index }) => {
                                                    return (
                                                        <View style={{
                                                            width: '100%', alignSelf: 'center',
                                                            backgroundColor: Colors.white_color,
                                                            borderTopRightRadius: (mobileW * 4) / 100,
                                                            borderTopLeftRadius: (mobileW * 4) / 100,
                                                            marginTop: mobileW * 0.04
                                                        }} key={index}>
                                                            <View style={{
                                                                flexDirection: 'row', width: '100%', alignSelf: 'center',
                                                                justifyContent: 'space-between', backgroundColor: '#ffffff',
                                                                borderTopRightRadius: (mobileW * 4) / 100,
                                                                borderTopLeftRadius: (mobileW * 4) / 100,
                                                                paddingVertical: mobileW * 1 / 100,
                                                                marginBottom: mobileW * 0.005
                                                            }}>
                                                                {/* ---------------------- For img ----------------------- */}
                                                                <View style={{ width: '25%', justifyContent: 'center', alignItems: 'center', }}>
                                                                    <TouchableOpacity style={{
                                                                        width: '95%', borderRadius: mobileW * 2 / 100,
                                                                        alignSelf: 'center', alignItems: 'center'
                                                                    }}
                                                                        onPress={() => {
                                                                            this.props.navigation.navigate('Pendingui', { 'order_status': item.order_status, 'order_id': item.order_id })
                                                                        }}
                                                                        activeOpacity={0.7}>
                                                                        {item.dining_image && < Image style={{
                                                                            height: mobileW * 20 / 100, width: mobileW * 20 / 100,
                                                                            alignSelf: 'center', borderRadius: mobileW * 2 / 100,
                                                                        }}
                                                                            source={{ uri: config.img_url + item.dining_image }}
                                                                        />}
                                                                    </TouchableOpacity>
                                                                </View>
                                                                {/* ---------------------- For View ----------------------- */}
                                                                <View
                                                                    style={{
                                                                        width: '75%', alignSelf: 'center',
                                                                        paddingBottom: (mobileW * 2) / 100,
                                                                    }}>
                                                                    <View style={{ flexDirection: 'row', }}>
                                                                        <Text style={[styles.cardFoddTitle, {
                                                                            width: '70%',
                                                                            marginTop: mobileW * 0.03,
                                                                        }]}>
                                                                            {item.dining_name}
                                                                        </Text>
                                                                        <Text style={[styles.cardFoddTitle, {
                                                                            width: '10%',
                                                                            marginTop: mobileW * 0.03, marginLeft: mobileW * 10 / 100
                                                                        }]}>
                                                                            {item.rupess}
                                                                        </Text>
                                                                    </View>
                                                                    {/* ---------------------- Date time ----------------------- */}
                                                                    <View
                                                                        style={{ width: '95%', flexDirection: 'row', marginTop: mobileW * 0.02 }}>
                                                                        {localimag.calender && <Image
                                                                            // source={item.calender_image}

                                                                            source={localimag.calender}
                                                                            style={{
                                                                                alignSelf: 'center', resizeMode: 'contain', width: (mobileW * 3.6) / 100,
                                                                                height: (mobileW * 3.6) / 100
                                                                            }} />}
                                                                        <Text style={{
                                                                            marginLeft: (mobileW * 1) / 100,
                                                                            fontSize: (mobileW * 3) / 100,
                                                                            alignSelf: 'center',
                                                                            color: Colors.mediumgrey,
                                                                            fontFamily: Font.fontmedium,
                                                                            textAlign: config.textalign
                                                                        }}>
                                                                            {item.createtime}
                                                                        </Text>
                                                                        {item.clock_image && < Image
                                                                            source={item.clock_image}
                                                                            style={{
                                                                                marginLeft: (mobileW * 2) / 100,
                                                                                alignSelf: 'center',
                                                                                resizeMode: 'contain',
                                                                                width: (mobileW * 3.3) / 100,
                                                                                height: (mobileW * 3.3) / 100,
                                                                            }}
                                                                        />}
                                                                        <Text
                                                                            style={{
                                                                                marginLeft: (mobileW * 1) / 100,
                                                                                fontSize: (mobileW * 3) / 100,
                                                                                alignSelf: 'center',
                                                                                color: Colors.mediumgrey,
                                                                                fontFamily: Font.fontmedium,
                                                                                textAlign: config.textalign,
                                                                            }}>
                                                                        </Text>
                                                                    </View>
                                                                    <View
                                                                        style={{
                                                                            width: '95%',
                                                                            flexDirection: 'row',
                                                                            justifyContent: 'space-between',
                                                                            marginTop: mobileW * 0.02,
                                                                            alignItems: 'center'
                                                                        }}>
                                                                        <Text
                                                                            style={{
                                                                                fontSize: (mobileW * 3.2) / 100,
                                                                                alignSelf: 'center',
                                                                                color: Colors.yellow,
                                                                                fontFamily: Font.OutfitMedium,
                                                                                textAlign: config.textalign,
                                                                            }}>
                                                                            {item.order_status == 0 ? <Text style={{ color: Colors.green }}>{Lang_chg.pending[config.language]}</Text> :
                                                                                item.order_status == 1 ? <Text style={{ color: Colors.green }}> {Lang_chg.accepted[config.language]}</Text> :
                                                                                    item.order_status == 2 ? <Text style={{ color: Colors.green }}>{Lang_chg.pickup[config.language]}</Text> :
                                                                                        item.order_status == 3 ? <Text style={{ color: Colors.green }}>{Lang_chg.Delivery[config.language]}</Text> :
                                                                                            item.order_status == 4 ? <Text style={{ color: Colors.red }}>{Lang_chg.cancelled[config.language]}</Text> :
                                                                                                null
                                                                            }
                                                                        </Text>
                                                                        <View style={{
                                                                            width: mobileW * 25 / 100, backgroundColor: Colors.whitepurple, borderColor: Colors.bottomborder, borderRadius: mobileW * 4 / 100, borderWidth: 1, paddingVertical: mobileW * 1 / 100
                                                                        }}>
                                                                            <Text style={{
                                                                                fontSize: mobileW * 3 / 100, fontFamily: Font.OutfitMedium, color: Colors.black, textAlign: 'center'
                                                                            }}>
                                                                                {item.dining_facility_id == 0 && Lang_chg.Dining[config.language]}
                                                                                {item.dining_hall_id == 0 && Lang_chg.Diningf[config.language]}
                                                                            </Text>
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                            {/* ====================customer detail================ */}
                                                            <View
                                                                style={{
                                                                    width: '100%',
                                                                    alignSelf: 'center',
                                                                    backgroundColor: Colors.backgroundgrey,
                                                                    shadowColor: '#000', shadowOpacity: 0.1, elevation: 1,
                                                                    shadowOffset: { width: 0, },
                                                                    shadowOpacity: 0.1, marginTop: mobileW * -0.01
                                                                }}>
                                                                <Text style={{
                                                                    fontFamily: Font.Semibold, fontSize: mobileW * 0.038,
                                                                    width: '95%', alignSelf: 'center', paddingVertical: (mobileW * 1) / 100,
                                                                    marginTop: mobileW * 0.01
                                                                }}>
                                                                    {Lang_chg.customer_details_text[config.language]}
                                                                </Text>
                                                                <View
                                                                    style={{
                                                                        width: '95%',
                                                                        alignSelf: 'center',
                                                                        flexDirection: 'row',
                                                                        paddingVertical: (mobileW * 2) / 100,
                                                                    }}>
                                                                    <View style={{ width: '12%' }}>
                                                                        {item.customer_image && <Image
                                                                            source={item.customer_image == null ? localimag.Profinactive :
                                                                                { uri: config.img_url + item.customer_image }}
                                                                            style={{
                                                                                alignSelf: 'center', width: mobileW * 8 / 100, height: mobileW * 8 / 100, borderRadius: mobileW * 5 / 100, borderColor: Colors.light_grey, borderWidth: 1.5,
                                                                            }} />}
                                                                    </View>
                                                                    <View style={{ width: '88%' }}>
                                                                        <Text style={styles.customer_name_style}>
                                                                            {item.customer_name}
                                                                        </Text>
                                                                        <View
                                                                            style={{
                                                                                width: '100%',
                                                                                alignSelf: 'center',
                                                                                flexDirection: 'row',
                                                                                justifyContent: 'space-between',
                                                                                marginTop: mobileW * 0.015,
                                                                            }}>
                                                                            <Text style={{
                                                                                fontSize: (mobileW * 3.4) / 100,
                                                                                color: '#000', marginLeft: (mobileW * 0.8) / 100,
                                                                                fontFamily: Font.OutfitMedium,
                                                                                textAlign: config.textalign,
                                                                            }}>
                                                                                {Lang_chg.University_text[config.language]}
                                                                            </Text>
                                                                            <Text style={{
                                                                                fontSize: (mobileW * 3.4) / 100,
                                                                                color: Colors.textgrey, marginLeft: (mobileW * 0.8) / 100,
                                                                                fontFamily: Font.OutfitMedium,
                                                                                textAlign: config.textalign,
                                                                            }}>
                                                                                {item.university_name}
                                                                            </Text>
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                                <View
                                                                    style={{
                                                                        width: '100%', alignSelf: 'center',
                                                                        flexDirection: 'row',
                                                                        justifyContent: 'space-between',
                                                                        backgroundColor: Colors.white1,
                                                                        shadowOpacity: 0.1, elevation: 1,
                                                                        shadowOffset: { width: 0, },
                                                                        shadowColor: '#000', shadowOpacity: 0.1
                                                                    }}>
                                                                    <Text style={{
                                                                        alignSelf: 'center', fontFamily: Font.OutfitMedium,
                                                                        fontSize: mobileW * 0.032,
                                                                        color: '#7F7F7F', paddingVertical: (mobileW * 2.5) / 100,
                                                                    }}>
                                                                        Order ID: #{item.order_no}
                                                                    </Text>
                                                                    {
                                                                        (item.order_status == 1 || item.order_status == 2) &&
                                                                        <TouchableOpacity onPress={() => {
                                                                            this.props.navigation.navigate('Pendingui', { 'order_status': item.order_status, 'order_id': item.order_id })
                                                                        }} style={{
                                                                            marginTop: mobileW * 1.5 / 100, marginRight: mobileW * 2.5 / 100,
                                                                            backgroundColor: Colors.theamColor, borderRadius: mobileW * 10 / 100,
                                                                            justifyContent: 'center', height: mobileW * 5.5 / 100, paddingHorizontal: mobileW * 2 / 100
                                                                        }}>
                                                                            {
                                                                                item.order_status == 1 &&
                                                                                <Text style={{ color: '#FFFFFF', fontSize: mobileW * 0.032, }}>Start Delivery</Text>
                                                                            }
                                                                            {
                                                                                item.order_status == 2 &&
                                                                                <Text style={{ color: '#FFFFFF', fontSize: mobileW * 0.032, }}>Finish Delivery</Text>
                                                                            }
                                                                        </TouchableOpacity>
                                                                    }
                                                                </View>
                                                            </View>
                                                        </View>
                                                    )
                                                }
                                                } />
                                        }
                                    </View>
                                }
                            </KeyboardAwareScrollView>
                        </TouchableOpacity>
                    </ScrollView>

                    <Driver_Footer
                        activepage='Driver_Orders'
                        usertype={1}
                        footerpage={[
                            { name: 'Driver_Home', fname: 'Home', countshow: false, image: (localimag.Homeinactive), activeimage: (localimag.Homeactive) },
                            { name: 'Driver_Orders', fname: 'Orders', countshow: false, image: (localimag.Orderinactive), activeimage: (localimag.Orderactive) },
                            { name: 'Inbox', fname: 'Chat', countshow: count_inbox, image: (localimag.chat_gray), activeimage: (localimag.Chatactive) },
                            { name: 'My_Earnings', fname: 'My Earnings', countshow: false, image: (localimag.Dollerinactive), activeimage: (localimag.Dolleractive) },
                            { name: 'Driver_Profile', fname: 'Profile', countshow: false, image: (localimag.Profinactive), activeimage: (localimag.Profactive) },
                        ]}
                        navigation={this.props.navigation}
                        imagestyle1={{
                            width: 26, height: 26, backgroundColor: '#01faff', countcolor: 'red',
                            countbackground: 'red', backgroundColor: 'white'
                        }}
                    />

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

})