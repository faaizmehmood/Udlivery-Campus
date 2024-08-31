import { Linking, View, Image, StatusBar, Text, FlatList, ImageBackground, TouchableOpacity, SafeAreaView, Modal, Keyboard, StyleSheet, TextInput, ScrollView } from 'react-native'
import React, { Component } from 'react'
import { config, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag } from '../Provider/utilslib/Utils';
import DashedLine from 'react-native-dashed-line';

export default class Driver_pending extends Component {
    constructor(props) {
        super(props); {
            this.state = {
                // btn_Status: 0,
                modalVisible: false,
                Status: this.props.route.params.Status,
                navi_status: this.props.route.params.navi_status,
                num_arr: 'NA',
                order_arr: 'NA'
                //     [
                //     { id: 1, image: localimag.dishtwo, title: Lang_chg.Mulberry[config.language], Staus: 0, diet: 'Calories : 145', text: 'Qty : 2', title1: 'Mulberry Pizzas as our guests began requesting their favorites over and over.', navi_status: 0 },
                //     { id: 2, image: localimag.dishfour, title: Lang_chg.veg[config.language], Staus: 1, diet: 'Calories : 345', text: 'Qty : 1', title1: 'A classical lip-smacking indian street food recipe made with thin rice noodles tossed with sliced veggies.', navi_status: 0 },
                //     { id: 3, image: localimag.dishseven, title: Lang_chg.Rasberry[config.language], Staus: 2, diet: 'Calories : 567', text: 'Qty : 2', title1: 'Mulberry Pizzas as our guests began requesting their favorites over and over.', navi_status: 0 },

                // ]
            }

        }
    }
    componentDidMount() {
        //console.log('Status', this.state.Status)
        //console.log('navi_status', this.state.navi_status)
        //console.log('new_status', this.props.route.params.new_status)
        // if (this.props.route.params.new_status != null) {
        //     this.setState({ btn_Status: 3 })
        // }
        this.get_order_details()
        this.props.navigation.addListener('focus', () => {
            this.setState({ Status: this.props.route.params.Status })
            this.get_order_details()
        });


    }




    // componentDidMount=async()=>{

    //     }


    get_order_details = async () => {
        let url = config.baseURL + 'get_customer_site_order_details.php?user_id=' + this.state.user_id + '&order_id=' + this.state.order_id;
        consolepro.consolelog('url', url);
        apifuntion
            // .getApi(url, data)
            .getApi(url, 1)
            // .postApi(url, data)
            .then((obj) => {
                // consolepro.consolelog('obj', obj);
                consolepro.consolelog(obj);
                if (obj.success == 'true') {
                    // let orderHistory_arr = obj.order_arr;  

                    setTimeout(() => {
                        this.setState({
                            order_arr: obj.order_arr,
                            num_arr: obj.order_arr.items_arr,
                        });
                    }, 300);

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









    render() {
        return (
            <View style={{ flex: 1 }}>

                <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={() => { Keyboard.dismiss() }}>
                    <SafeAreaView style={{ backgroundColor: Colors.theamColor, flex: 0 }} />
                    {/* <StatusBar barStyle='light-content' backgroundColor={Colors.theamColor} hidden={false} translucent={false} /> */}


                    <View style={{
                        width: mobileW * 100 / 100, alignItems: 'center', backgroundColor: Colors.theamColor,
                    }} >
                        <View style={{ width: mobileW * 95 / 100, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center', paddingVertical: mobileW * 3 / 100 }}>
                            <TouchableOpacity style={{ width: mobileW * 12 / 100, }} onPress={() => this.props.navigation.goBack()} >
                                <Image style={{ height: mobileW * 6 / 100, width: mobileW * 6 / 100, resizeMode: 'contain' }} source={localimag.goback} />
                            </TouchableOpacity>
                            <View style={{ width: mobileW * 70 / 100, alignItems: 'center', alignSelf: 'center' }}>
                                <Text style={{ fontSize: mobileW * 5 / 100, color: Colors.white_color, fontFamily: Font.OutfitMedium }}>
                                    #{this.state.order_arr.order_id}</Text>
                            </View>
                            <TouchableOpacity onPress={() => this.setState({ modalVisible: true })} style={{ width: mobileW * 13 / 100, alignItems: 'flex-end' }}>
                                <Image style={{ height: mobileW * 5 / 100, width: mobileH * 1 / 100, resizeMode: 'cover' }} source={localimag.whitedot} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView keyboardDismissMode='interactive' keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>
                        <TouchableOpacity style={{ flex: 1, }} activeOpacity={1}>

                            {/* //-----------------------------Accept button---------------------// */}
                            {this.state.Status == 0 && <View style={{ backgroundColor: '#F7F7F7', paddingVertical: mobileW * 2 / 100, }}>
                                <View style={{ width: '100%', flexDirection: 'row', alignSelf: 'center', paddingVertical: mobileW * 2 / 100, backgroundColor: Colors.white_color, paddingHorizontal: mobileW * 4 / 100 }}>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.OutfitMedium, color: Colors.black, }}>{Lang_chg.Backyard[config.language]}</Text>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.OutfitMedium, color: Colors.violet }}> (Dining Hall)</Text>
                                </View>
                                <View style={{ width: mobileW * 25 / 100, backgroundColor: Colors.whitepurple, borderColor: Colors.bottomborder, borderRadius: mobileW * 4 / 100, borderWidth: 1, paddingVertical: mobileW * 1 / 100, marginLeft: mobileW * 3 / 100 }}>
                                    <Text style={{ fontSize: mobileW * 3 / 100, fontFamily: Font.OutfitMedium, color: Colors.opengreen, textAlign: 'center' }}>{Lang_chg.accepted[config.language]}</Text>
                                </View>
                            </View>}

                            {/* //-----------------------------pickup button---------------------// */}

                            {this.state.Status == 1 && <View style={{ backgroundColor: '#F7F7F7', paddingVertical: mobileW * 2 / 100, }}>
                                <View style={{ width: '100%', flexDirection: 'row', alignSelf: 'center', paddingVertical: mobileW * 2 / 100, backgroundColor: Colors.white_color, paddingHorizontal: mobileW * 4 / 100 }}>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.Semibold, color: Colors.black }}>{Lang_chg.Backyard[config.language]}</Text>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.OutfitMedium, color: Colors.violet }}> (Dining Hall)</Text>
                                </View>
                                <View style={{ width: mobileW * 25 / 100, backgroundColor: Colors.whitepurple, borderColor: Colors.bottomborder, borderRadius: mobileW * 4 / 100, borderWidth: 1, paddingVertical: mobileW * 1 / 100, marginLeft: mobileW * 3 / 100 }}>
                                    <Text style={{ fontSize: mobileW * 3 / 100, fontFamily: Font.OutfitMedium, color: Colors.opengreen, textAlign: 'center' }}>{Lang_chg.pickup[config.language]}</Text>
                                </View>
                            </View>}

                            {/* //-----------------------------Delivery button---------------------// */}

                            {this.state.Status == 2 && <View style={{ backgroundColor: '#F7F7F7', paddingVertical: mobileW * 2 / 100, }}>
                                <View style={{ width: '100%', flexDirection: 'row', alignSelf: 'center', paddingVertical: mobileW * 2 / 100, backgroundColor: Colors.white_color, paddingHorizontal: mobileW * 4 / 100 }}>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.OutfitMedium, color: Colors.black, }}>{Lang_chg.Backyard[config.language]}</Text>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.OutfitMedium, color: Colors.violet }}> (Dining Hall)</Text>
                                </View>
                                <View style={{ width: mobileW * 25 / 100, backgroundColor: Colors.whitepurple, borderColor: Colors.bottomborder, borderRadius: mobileW * 4 / 100, borderWidth: 1, paddingVertical: mobileW * 1 / 100, marginLeft: mobileW * 3 / 100 }}>
                                    <Text style={{ fontSize: mobileW * 3 / 100, fontFamily: Font.OutfitMedium, color: Colors.opengreen, textAlign: 'center' }}>{Lang_chg.Delivery[config.language]}</Text>
                                </View>
                            </View>}

                            {/* //-----------------------------cANCELLED---------------------// */}

                            {this.state.Status == 3 && <View style={{ backgroundColor: '#F7F7F7', paddingVertical: mobileW * 2 / 100, }}>
                                <View style={{ width: '100%', flexDirection: 'row', alignSelf: 'center', paddingVertical: mobileW * 2 / 100, backgroundColor: Colors.white_color, paddingHorizontal: mobileW * 4 / 100 }}>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.OutfitMedium, color: Colors.black, }}>{Lang_chg.Backyard[config.language]}</Text>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.OutfitMedium, color: Colors.violet }}> (Dining Hall)</Text>
                                </View>
                                <View style={{ width: mobileW * 25 / 100, backgroundColor: Colors.whitepurple, borderColor: Colors.bottomborder, borderRadius: mobileW * 4 / 100, borderWidth: 1, paddingVertical: mobileW * 1 / 100, marginLeft: mobileW * 3 / 100 }}>
                                    <Text style={{ fontSize: mobileW * 3 / 100, fontFamily: Font.OutfitMedium, color: Colors.red, textAlign: 'center' }}>{Lang_chg.cancelled[config.language]}</Text>
                                </View>
                            </View>}


                            <FlatList
                                data={this.state.num_arr}
                                contentContainerStyle={{}}
                                //showsHorizontalScrollIndicator={false}
                                renderItem={({ item, index }) => {
                                    //console.log('item', item)
                                    return (
                                        <View style={{
                                            width: '100%', alignSelf: 'center', paddingVertical: mobileW * 2 / 100, backgroundColor: '#F7F7F7', marginTop: mobileW * 1 / 100
                                        }} >


                                            <View style={{ flexDirection: 'row', width: mobileW * 97 / 100, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', }}>
                                                <Image borderRadius={10}
                                                    style={{ alignSelf: 'center', width: mobileW * 24 / 100, height: mobileW * 23 / 100, }}
                                                    // source={item.image}
                                                    source={{ uri: config.img_url + item.item_image }}

                                                >

                                                </Image>

                                                <View style={{ paddingLeft: mobileW * 2 / 100, }}>
                                                    <View style={{ width: mobileW * 67 / 100, alignSelf: 'center', justifyContent: 'space-between', }}>
                                                        <Text style={{ fontSize: mobileW * 3.7 / 100, fontFamily: Font.OutfitMedium, color: Colors.black_color, }}>{item.item_name}</Text>
                                                    </View>

                                                    <View style={{ width: mobileW * 67 / 100, flexDirection: 'row', alignSelf: 'center', justifyContent: 'flex-start', paddingVertical: mobileW * 1 / 100, }}>
                                                        <Text style={{ fontSize: mobileW * 3 / 100, fontFamily: Font.Fontregular, color: Colors.textgrey, }}>{item.description}</Text>
                                                    </View>

                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', width: mobileW * 67 / 100, paddingVertical: mobileW * 1 / 100, }}>
                                                        <Image borderRadius={4}
                                                            style={{ width: mobileW * 3.5 / 100, height: mobileW * 3.5 / 100, }} resizeMode='contain'
                                                            source={localimag.fireicon}></Image>
                                                        <Text style={{ fontSize: mobileW * 3.2 / 100, fontFamily: Font.Fontregular, color: Colors.removecolor, paddingLeft: mobileW * 1 / 100 }}>
                                                            {Lang_chg.Calories[config.language]}

                                                            {item.calories}</Text>
                                                    </View>

                                                    <View style={{ width: mobileW * 66 / 100, flexDirection: 'row', alignSelf: 'center', justifyContent: 'flex-start', }}>
                                                        <Text style={{ fontSize: mobileW * 3 / 100, fontFamily: Font.Fontregular, color: Colors.textgrey, }}>{Lang_chg.qty[config.language]}

                                                            {item.no_of_quantity}</Text>
                                                    </View>
                                                </View>

                                            </View>
                                        </View>

                                    )
                                }} />


                            <View style={{
                                width: '100%', alignSelf: 'center',
                                paddingVertical: mobileW * 2 / 100, backgroundColor: '#F7F7F7', marginTop: mobileW * 1 / 100, paddingBottom: mobileW * 10 / 100
                            }}>


                                {/* //-------Accept & Delivery-----// */}
                                <View>
                                    <View style={{
                                        width: mobileW * 96 / 100, alignSelf: 'center',
                                        paddingVertical: mobileW * 1 / 100, backgroundColor: '#EFEFEF', borderRadius: mobileW * 2 / 100, paddingBottom: mobileW * 3 / 100,
                                    }}>
                                        <View style={{ width: mobileW * 90 / 100, flexDirection: 'row', alignSelf: 'center', justifyContent: 'flex-start', paddingVertical: mobileW * 2 / 100 }}>
                                            <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.Semibold, color: Colors.black }}>{Lang_chg.customerdetails[config.language]}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', width: mobileW * 95.2 / 100, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', }}>
                                            <Image
                                                style={{ alignSelf: 'center', width: mobileW * 9 / 100, height: mobileW * 9 / 100, borderRadius: mobileW * 5 / 100 }}
                                                source={localimag.driverboy}>
                                            </Image>

                                            <View style={{ paddingLeft: mobileW * 2 / 100 }}>
                                                <View style={{ width: mobileW * 79 / 100, alignSelf: 'center', justifyContent: 'flex-start', }}>
                                                    <Text style={{ fontSize: mobileW * 3.6 / 100, fontFamily: Font.Semibold, color: Colors.violet }}>{Lang_chg.Drake[config.language]}</Text>
                                                </View>

                                                <View style={{ width: mobileW * 79 / 100, flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', alignItems: "center" }}>
                                                    <View style={{ width: mobileW * 63 / 100, flexDirection: 'row', }}>
                                                        <Text style={{ fontSize: mobileW * 3.3 / 100, fontFamily: Font.Fontregular, color: Colors.textgrey, }}>{Lang_chg.universityname[config.language]}</Text>
                                                        <Text style={{ fontSize: mobileW * 3.3 / 100, fontFamily: Font.Fontregular, color: Colors.textgrey }}>{Lang_chg.harvarduniversity[config.language]}</Text>
                                                    </View>
                                                    <View style={{ width: mobileW * 18 / 100, flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between' }}>
                                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Chat')}>
                                                            <Image
                                                                style={{ alignSelf: 'center', width: mobileW * 8 / 100, height: mobileW * 8 / 100, }}
                                                                source={localimag.bluemassage} /></TouchableOpacity>
                                                        <Image
                                                            style={{ alignSelf: 'center', width: mobileW * 8 / 100, height: mobileW * 8 / 100, paddingLeft: mobileW * 2 / 100 }}
                                                            source={localimag.bluecall} />
                                                    </View>
                                                </View>

                                            </View>
                                        </View>

                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row', width: mobileW * 93 / 100, alignSelf: 'center', justifyContent: 'space-between', marginTop: mobileW * 4 / 100, backgroundColor: '#F7F7F7' }}>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.OutfitMedium, color: Colors.grey, }}>{Lang_chg.Ordercreted[config.language]}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image style={{
                                            height: mobileW * 3.3 / 100, width: mobileW * 3.3 / 100, resizeMode: 'contain', alignSelf: 'center', justifyContent: 'center', marginRight: mobileW * 1 / 100,
                                        }} source={localimag.calender}></Image>
                                        <Text style={{ fontSize: mobileW * 3.5 / 100, fontFamily: Font.OutfitMedium, color: '#8A8A8A', textAlign: 'center' }}>{Lang_chg.date[config.language]}</Text>
                                    </View>
                                </View>


                                <View style={{ width: mobileW * 93 / 100, alignSelf: 'center' }}>
                                    <DashedLine style={{ marginTop: mobileH * 0.8 / 100, marginBottom: mobileH * 1 / 100, paddingHorizontal: mobileW * 0.5 / 100, width: mobileW * 92 / 100, }} dashColor={'#DADADA'} gap={7} dashThickness={0.4} dashLength={7} />
                                </View>

                                <View style={{ width: mobileW * 93 / 100, flexDirection: 'row', alignSelf: 'center', justifyContent: 'flex-start', }}>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.OutfitMedium, color: Colors.grey, }}>{Lang_chg.Location[config.language]}</Text>
                                </View>

                                <View style={{ width: mobileW * 93 / 100, flexDirection: 'row', alignSelf: 'center', justifyContent: 'flex-start', paddingVertical: mobileW * 0.5 / 100 }}>
                                    <Text style={{ fontSize: mobileW * 3.5 / 100, fontFamily: Font.Semibold, color: '#8A8A8A' }}>{Lang_chg.newyork[config.language]}</Text>
                                </View>

                                <View style={{ width: mobileW * 93 / 100, flexDirection: 'row', alignSelf: 'center', justifyContent: 'flex-start', }}>
                                    <Text style={{ fontSize: mobileW * 3.5 / 100, fontFamily: Font.Semibold, color: '#8A8A8A' }}>{Lang_chg.Unitedstates[config.language]}</Text>
                                </View>

                                <View style={{ width: mobileW * 93 / 100, alignSelf: 'center' }}>
                                    <DashedLine style={{ marginTop: mobileH * 0.8 / 100, marginBottom: mobileH * 1 / 100, paddingHorizontal: mobileW * 0.5 / 100, width: mobileW * 92 / 100, }} dashColor={'#DADADA'} gap={7} dashThickness={0.4} dashLength={7} />
                                </View>

                                <View style={{ flexDirection: 'row', width: mobileW * 93 / 100, alignSelf: 'center', justifyContent: 'space-between', paddingVertical: mobileW * 1 / 100, }}>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.OutfitMedium, color: Colors.grey, }}>Delivery Fee</Text>
                                    <Text style={{ fontSize: mobileW * 3.5 / 100, fontFamily: Font.OutfitMedium, color: '#8A8A8A' }}>$4.3</Text>
                                </View>

                                <View style={{ flexDirection: 'row', width: mobileW * 93 / 100, alignSelf: 'center', justifyContent: 'space-between', paddingVertical: mobileW * 1 / 100, }}>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.OutfitMedium, color: Colors.grey, }}>{Lang_chg.tip_amount[config.language]}</Text>
                                    <Text style={{ fontSize: mobileW * 3.5 / 100, fontFamily: Font.OutfitMedium, color: '#8A8A8A' }}>$2.2</Text>
                                </View>

                                <View style={{ width: mobileW * 93 / 100, alignSelf: 'center' }}>
                                    <DashedLine style={{ marginTop: mobileH * 0.8 / 100, marginBottom: mobileH * 1 / 100, paddingHorizontal: mobileW * 0.5 / 100, width: mobileW * 92 / 100, }} dashColor={'#DADADA'} gap={7} dashThickness={0.4} dashLength={7} />
                                </View>

                                <View style={{ flexDirection: 'row', width: mobileW * 93 / 100, alignSelf: 'center', justifyContent: 'space-between', paddingVertical: mobileW * 1 / 100, }}>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.Semibold, color: Colors.black, }}>{Lang_chg.totalamount[config.language]}</Text>
                                    <Text style={{ fontSize: mobileW * 3.5 / 100, fontFamily: Font.Semibold, color: Colors.violet }}>$6.5</Text>
                                </View>

                                <View style={{ width: mobileW * 93 / 100, alignSelf: 'center' }}>
                                    <DashedLine style={{ marginTop: mobileH * 0.8 / 100, marginBottom: mobileH * 1 / 100, paddingHorizontal: mobileW * 0.5 / 100, width: mobileW * 92 / 100, }} dashColor={'#DADADA'} gap={7} dashThickness={0.4} dashLength={7} />
                                </View>

                                {/* //---------------------------- only for cancel------------------------------// */}
                                {this.state.Status == 3 && <View style={{ paddingVertical: mobileW * 1 / 100 }}>
                                    <View style={{ width: mobileW * 93 / 100, flexDirection: 'row', alignSelf: 'center', justifyContent: 'flex-start', }}>
                                        <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.OutfitMedium, color: Colors.red }}>{Lang_chg.Cancelresone[config.language]}</Text>
                                    </View>
                                    <View style={{ width: mobileW * 93 / 100, flexDirection: 'row', alignSelf: 'center', justifyContent: 'flex-start', }}>
                                        <Text style={{ fontSize: mobileW * 3.5 / 100, fontFamily: Font.OutfitMedium, color: Colors.textgrey }}>{Lang_chg.Sorry[config.language]}</Text>
                                    </View>
                                </View>}

                                {/* //---------------------------- only for Deliver------------------------------// */}
                                {this.state.Status == 2 && <View style={{ marginTop: mobileW * 2 / 100 }}>
                                    <ImageBackground source={localimag.driverboyblur} resizeMode='cover' style={{ width: mobileW * 93 / 100, height: mobileH * 24 / 100, alignSelf: 'center' }}
                                        imageStyle={{ borderRadius: 10, alignSelf: 'center', justifyContent: 'center' }}>
                                        <Image style={{ height: mobileW * 12 / 100, width: mobileW * 12 / 100, resizeMode: 'contain', alignSelf: 'center', marginTop: mobileW * 16 / 100 }} source={localimag.playbut} />
                                    </ImageBackground>

                                </View>}

                                {/* /---------END DELIVER---------/ */}



                                {/* //------------ only in accept-----------// */}


                                {this.state.Status == 0 && <View style={{
                                    flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', width: mobileW * 90 / 100, marginTop: mobileW * 9 / 100,

                                }}>
                                    {/* {this.state.btn_Status == 1 &&  */}
                                    <TouchableOpacity
                                        // onPress={() => this.setState({ btn_Status: 1 })}
                                        onPress={() => this.setState({ Status: 1 })}
                                        style={{ width: mobileW * 41 / 100, marginBottom: mobileW * 10 / 100 }} >
                                        <View
                                            style={{
                                                width: mobileW * 41 / 100,
                                                alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderRadius: mobileW * 1 / 100, padding: mobileW * 3 / 100, backgroundColor: Colors.violet
                                            }} >

                                            <Text style={{ fontSize: mobileW * 4.3 / 100, color: Colors.white_color, fontFamily: Font.OutfitMedium, textAlign: 'center', paddingLeft: 3.5 }}>
                                                Pick up
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                    {/* } */}


                                    <TouchableOpacity style={{ width: mobileW * 41 / 100, marginBottom: mobileW * 10 / 100 }} onPress={() => { this.props.navigation.navigate('Driver_Cancelorder', { 'navi_status': 0 }) }}>
                                        <View style={{
                                            width: mobileW * 41 / 100,
                                            alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderRadius: mobileW * 1 / 100, padding: mobileW * 3 / 100, backgroundColor: Colors.red
                                        }} >

                                            <Text style={{ fontSize: mobileW * 4.3 / 100, color: Colors.white_color, fontFamily: Font.OutfitMedium, textAlign: 'center', paddingLeft: 3.5 }}>
                                                {Lang_chg.CancelOrder[config.language]}

                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>}



                                {/* //------------ only in pickup-----------// */}


                                {this.state.Status == 1 && <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', width: mobileW * 90 / 100, marginTop: mobileW * 9 / 100, }}>

                                    <TouchableOpacity style={{ width: mobileW * 41 / 100, marginBottom: mobileW * 10 / 100 }} onPress={() => { this.props.navigation.navigate('Driver_Location') }}>
                                        <View style={{
                                            width: mobileW * 41 / 100,
                                            alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderRadius: mobileW * 1 / 100, padding: mobileW * 3 / 100, backgroundColor: Colors.red
                                        }} >

                                            <Text style={{ fontSize: mobileW * 4.3 / 100, color: Colors.white_color, fontFamily: Font.OutfitMedium, textAlign: 'center', paddingLeft: 3.5 }}>
                                                {Lang_chg.HeadToDestination[config.language]}

                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                    {this.state.Status == 0 || this.state.Status == 1 && <TouchableOpacity onPress={() => { this.props.navigation.navigate('Driver_Dropoff', { 'navi_status': 0 }) }}
                                        style={{ width: mobileW * 41 / 100, marginBottom: mobileW * 10 / 100 }} >
                                        <View
                                            style={{
                                                width: mobileW * 41 / 100,
                                                alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderRadius: mobileW * 1 / 100, padding: mobileW * 3 / 100, backgroundColor: Colors.violet
                                            }} >

                                            <Text style={{ fontSize: mobileW * 4.3 / 100, color: Colors.white_color, fontFamily: Font.OutfitMedium, textAlign: 'center', paddingLeft: 3.5 }}>
                                                {Lang_chg.Dropoff[config.language]}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>}
                                </View>}




                            </View>














































                        </TouchableOpacity>
                    </ScrollView>
                </TouchableOpacity >
            </View >
        )
    }
}