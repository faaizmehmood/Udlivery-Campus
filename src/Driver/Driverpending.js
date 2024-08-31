import { View, Image, StatusBar, Text, FlatList, ImageBackground, TouchableOpacity, SafeAreaView, Modal, Keyboard, StyleSheet, TextInput, ScrollView } from 'react-native'
import React, { Component } from 'react'
import { config, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag } from '../Provider/utilslib/Utils';
import DashedLine from 'react-native-dashed-line';

export default class Driverpending extends Component {
    constructor(props) {
        super(props); {
            this.state = {
                modalVisible: false,
                // Status: this.props.route.params.Status,
                // navi_status: this.props.route.params.navi_status,
                num_arr: 'NA',
                order_arr: 'NA',
                // num_arr: [
                //     { id: 1, image: localimag.dishtwo, title: Lang_chg.Mulberry[config.language], Staus: 0, diet: 'Calories : 145', text: 'Qty : 2', title1: 'Mulberry Pizzas as our guests began requesting their favorites over and over.', navi_status: 0 },
                //     { id: 2, image: localimag.dishfour, title: Lang_chg.veg[config.language], Staus: 1, diet: 'Calories : 345', text: 'Qty : 1', title1: 'A classical lip-smacking indian street food recipe made with thin rice noodles tossed with sliced veggies.', navi_status: 0 },
                //     { id: 3, image: localimag.dishseven, title: Lang_chg.Rasberry[config.language], Staus: 2, diet: 'Calories : 567', text: 'Qty : 2', title1: 'Mulberry Pizzas as our guests began requesting their favorites over and over.', navi_status: 0 },

                // ]
            }

        }
    }





    componentDidMount() {
        //console.log('Status',this.state.Status)
        //console.log('navi_status', this.state.navi_status)
        //console.log('new_status', this.props.route.params.new_status)
        // if (this.props.route.params.new_status != null) {
        //     this.setState({ btn_Status: 3 })
        // }
        this.get_order_details()
        this.props.navigation.addListener('focus', () => {
            // this.setState({ Status: this.props.route.params.Status })
            this.get_order_details()
        });


    }




    // componentDidMount=async()=>{
        
    //     }
    
    
        get_order_details = async () => { 
             let url = config.baseURL + 'get_customer_site_order_details.php?user_id='+this.state.user_id+'&order_id='+this.state.order_id;
            consolepro.consolelog('url', url); 
            apifuntion
                // .getApi(url, data)
                .getApi(url,1)
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
                            consolepro.consolelog('account_active_status',obj.account_active_status)
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
                        <TouchableOpacity style={{ flex: 1, }} activeOpacity={1}>

                            <View style={{ backgroundColor: '#F7F7F7', paddingVertical: mobileW * 2 / 100, }}>
                                <View style={{ width: '100%', flexDirection: 'row', alignSelf: 'center', paddingVertical: mobileW * 2 / 100, backgroundColor: '', paddingHorizontal: mobileW * 4 / 100 }}>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.OutfitMedium, color: Colors.black, }}>{Lang_chg.Backyard[config.language]}</Text>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.OutfitMedium, color: Colors.violet }}> (Dining Hall)</Text>
                                </View>
                                <View style={{ width: mobileW * 25 / 100, backgroundColor: Colors.whitepurple, borderColor: Colors.bottomborder, borderRadius: mobileW * 4 / 100, borderWidth: 1, paddingVertical: mobileW * 1 / 100, marginLeft: mobileW * 3 / 100 }}>
                                    <Text style={{ fontSize: mobileW * 3 / 100, fontFamily: Font.OutfitMedium, color: Colors.yellow, textAlign: 'center' }}>{Lang_chg.pending[config.language]}</Text>
                                </View>
                            </View>


                            <FlatList
                                data={this.state.num_arr}
                                contentContainerStyle={{}}
                                //showsHorizontalScrollIndicator={false}
                                renderItem={({ item, index }) => {
                                    //console.log('item', item)
                                    return (
                                        <View style={{
                                             width: '100%', alignSelf: 'center',
                                            paddingVertical: mobileW * 2 / 100, backgroundColor: '#F7F7F7',
                                            marginTop: mobileW * 1 / 100,
                                        }} >


                                            <View style={{ flexDirection: 'row', width: mobileW * 97 / 100, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', }}>
                                                <Image borderRadius={10}
                                                    style={{ alignSelf: 'center', width: mobileW * 24 / 100, height: mobileW * 23 / 100, }}
                                                    source={item.image}>

                                                </Image>

                                                <View style={{ paddingLeft: mobileW * 2 / 100, }}>
                                                    <View style={{ width: mobileW * 67 / 100, alignSelf: 'center', justifyContent: 'space-between', }}>
                                                        <Text style={{ fontSize: mobileW * 3.7 / 100, fontFamily: Font.OutfitMedium, color: Colors.black_color, }}>{item.title}</Text>
                                                    </View>

                                                    <View style={{ width: mobileW * 67 / 100, flexDirection: 'row', alignSelf: 'center', justifyContent: 'flex-start', paddingVertical: mobileW * 1 / 100 }}>
                                                        <Text style={{ fontSize: mobileW * 3 / 100, fontFamily: Font.Fontregular, color: Colors.textgrey, }}>{item.title1}</Text>
                                                    </View>

                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', width: mobileW * 67 / 100, paddingVertical: mobileW * 1 / 100 }}>
                                                        <Image borderRadius={4}
                                                            style={{ width: mobileW * 3.5 / 100, height: mobileW * 3.5 / 100, }} resizeMode='contain'
                                                            source={localimag.fireicon}></Image>
                                                        <Text style={{ fontSize: mobileW * 3.2 / 100, fontFamily: Font.Fontregular, color: Colors.removecolor, paddingLeft: mobileW * 1 / 100 }}>{item.diet}</Text>
                                                    </View>

                                                    <View style={{ width: mobileW * 66 / 100, flexDirection: 'row', alignSelf: 'center', justifyContent: 'flex-start', }}>
                                                        <Text style={{ fontSize: mobileW * 3 / 100, fontFamily: Font.Fontregular, color: Colors.textgrey, }}>{item.text}</Text>
                                                    </View>
                                                </View>

                                            </View>
                                        </View>

                                    )
                                }} />

                            <View>
                                <View style={{
                                    width: mobileW * 95 / 100, alignSelf: 'center',
                                    paddingVertical: mobileW * 1 / 100, backgroundColor: '#F7F7F7', borderRadius: mobileW * 2 / 100, paddingBottom: mobileW * 3 / 100,
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


                            <View style={{
                                width: '100%', alignSelf: 'center',
                                paddingVertical: mobileW * 2 / 100, backgroundColor: '#fff', marginTop: mobileW * 1 / 100, paddingBottom: mobileW * 10 / 100
                            }}>
                                {/* <View style={{ flexDirection: 'row', width: mobileW * 93 / 100, alignSelf: 'center', justifyContent: 'space-between', paddingVertical: mobileW * 1 / 100, marginTop: mobileW * 2 / 100 }}>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.OutfitMedium, color: Colors.grey, }}>{Lang_chg.orderID[config.language]}</Text>
                                    <Text style={{ fontSize: mobileW * 3.5 / 100, fontFamily: Font.OutfitMedium, color: Colors.textgrey }}>{Lang_chg.ID[config.language]}</Text>
                                </View> */}

                                {/* <View style={{ width: mobileW * 93 / 100, alignSelf: 'center' }}>
                                    <DashedLine style={{ marginTop: mobileH * 0.8 / 100, marginBottom: mobileH * 1 / 100, paddingHorizontal: mobileW * 0.5 / 100, width: mobileW * 92 / 100, }} dashColor={Colors.black_color} gap={7} dashThickness={0.5} dashLength={7} />
                                </View> */}

                                <View style={{ flexDirection: 'row', width: mobileW * 93 / 100, alignSelf: 'center', justifyContent: 'space-between', marginTop: mobileW * 2 / 100 }}>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.OutfitMedium, color: Colors.grey, }}>{Lang_chg.Ordercreted[config.language]}</Text>
                                    <View style={{ flexDirection: 'row', }}>
                                        <Image style={{
                                            height: mobileW * 3 / 100, width: mobileW * 3 / 100, resizeMode: 'contain', alignSelf: 'center', justifyContent: 'center', marginRight: mobileW * 1 / 100,
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
                                    <Text style={{ fontSize: mobileW * 3.5 / 100, fontFamily: Font.Semibold, color: Colors.textgrey }}>{Lang_chg.newyork[config.language]}</Text>
                                </View>

                                <View style={{ width: mobileW * 93 / 100, flexDirection: 'row', alignSelf: 'center', justifyContent: 'flex-start', }}>
                                    <Text style={{ fontSize: mobileW * 3.5 / 100, fontFamily: Font.Semibold, color: Colors.textgrey }}>{Lang_chg.Unitedstates[config.language]}</Text>
                                </View>

                                <View style={{ width: mobileW * 93 / 100, alignSelf: 'center' }}>
                                    <DashedLine style={{ marginTop: mobileH * 0.8 / 100, marginBottom: mobileH * 1 / 100, paddingHorizontal: mobileW * 0.5 / 100, width: mobileW * 92 / 100, }} dashColor={'#DADADA'} gap={7} dashThickness={0.4} dashLength={7} />
                                </View>

                                <View style={{ flexDirection: 'row', width: mobileW * 93 / 100, alignSelf: 'center', justifyContent: 'space-between', paddingVertical: mobileW * 1 / 100, }}>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.OutfitMedium, color: Colors.grey, }}>Delivery Fee</Text>
                                    <Text style={{ fontSize: mobileW * 3.5 / 100, fontFamily: Font.OutfitMedium, color: Colors.textgrey }}>$10.0</Text>
                                    
                                </View>

                                <View style={{ flexDirection: 'row', width: mobileW * 93 / 100, alignSelf: 'center', justifyContent: 'space-between', paddingVertical: mobileW * 1 / 100, }}>
                                    <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.OutfitMedium, color: Colors.grey, }}>{Lang_chg.tip_amount[config.language]}</Text>
                                    <Text style={{ fontSize: mobileW * 3.5 / 100, fontFamily: Font.OutfitMedium, color: Colors.textgrey }}>$5.0</Text>
                                </View>


                                <View style={{ width: mobileW * 93 / 100, alignSelf: 'center' }}>
                                    <DashedLine style={{ marginTop: mobileH * 0.8 / 100, marginBottom: mobileH * 1 / 100, paddingHorizontal: mobileW * 0.5 / 100, width: mobileW * 92 / 100, }} dashColor={'#DADADA'} gap={7} dashThickness={0.4} dashLength={7} />
                                </View>

                                <View style={{ flexDirection: 'row', width: mobileW * 93 / 100, alignSelf: 'center', justifyContent: 'space-between', paddingVertical: mobileW * 1 / 100, }}>
                                    <Text style={{ fontSize: mobileW * 3.5 / 100, fontFamily: Font.Semibold, color: Colors.black, }}>{Lang_chg.totalamount[config.language]}</Text>
                                    <Text style={{ fontSize: mobileW * 3.5 / 100, fontFamily: Font.Semibold, color: Colors.violet }}>$15.0</Text>
                                </View>

                                <View style={{ width: mobileW * 93 / 100, alignSelf: 'center' }}>
                                    <DashedLine style={{ marginTop: mobileH * 0.8 / 100, marginBottom: mobileH * 1 / 100, paddingHorizontal: mobileW * 0.5 / 100, width: mobileW * 92 / 100, }} dashColor={'#DADADA'} gap={7} dashThickness={0.4} dashLength={7} />
                                </View>


                                <TouchableOpacity style={{ alignSelf: 'center', justifyContent: 'center', width: mobileW * 90 / 100, marginBottom: mobileW * 10 / 100, marginTop: mobileW * 10 / 100 }} onPress={() => { this.props.navigation.navigate('Driver_pending', { 'Status': 0 }) }}>
                                    <View style={{
                                        width: mobileW * 93 / 100,
                                        alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderRadius: mobileW * 1 / 100, padding: mobileW * 3 / 100, backgroundColor: Colors.theamColor
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
