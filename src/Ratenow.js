import { View, Image, StatusBar, Text, FlatList, ImageBackground, TouchableOpacity, SafeAreaView, ScrollView, Keyboard, StyleSheet, TextInput } from 'react-native'
import React, { Component } from 'react'
import { config, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag, notification } from './Provider/utilslib/Utils';
import { borderBottomColor } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import StarRating from 'react-native-star-rating-fixed-viewproptype';
export default class Ratenow extends Component {
    constructor(props) {
        super(props)
        this.state = {
            navi_status: this.props.route.params.navi_status,
            review: '',

            //16-08
            user_id: this.props.route.params.customer_id,
            order_id: this.props.route.params.order_id,
            deliver_id: this.props.route.params.driver_id,
            driver_name: this.props.route.params.driver_name,
            driver_image: this.props.route.params.driver_image,


            // starCount: 3
            starCount: 0
        }

    }
    componentDidMount() {

    }

    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
    }

    send_rating = async () => {
        let url = config.baseURL + 'send_rating.php'
        consolepro.consolelog('url', url);
        var data = new FormData();
        data.append('user_id', this.state.user_id);
        data.append('order_id', this.state.order_id);
        data.append('rating', this.state.starCount);
        data.append('review', this.state.review);
        data.append('deliver_id', this.state.deliver_id);
        consolepro.consolelog('user data to be edited', data);
        apifuntion.postApi(url, data).then((obj) => {
                consolepro.consolelog('obj', obj);
                if (obj.success == 'true') {
                    msgProvider.toast(obj.msg[0], 'center');
                    var notification_arr = obj.notification_arr;
                    consolepro.consolelog({ notification_arr })
                    if (notification_arr != "NA") {
                        notification.notification_arr(notification_arr);
                    }
                    setTimeout(() => {
                        this.props.navigation.goBack();
                    }, 700);
                } else {
                    if (obj.account_active_status == 0) {
                        consolepro.consolelog('account_active_status', obj.account_active_status)
                        config.checkUserDeactivate(this.props.navigation);
                        return false;
                    }
                    msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                    return false;
                }
            }).catch((error) => {
                console.log('error',error);
                  });
    };

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#F7F7F7' }}>

                <KeyboardAwareScrollView >

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
                                <Text style={{ fontSize: mobileW * 5 / 100, color: Colors.white_color, fontFamily: Font.regular }}>{Lang_chg.ratenow[config.language]}</Text>
                            </View>
                            <View style={{ width: mobileW * 10 / 100 }}>
                                {/* <Image style={{ height: mobileW * 7 / 100, width: mobileW * 7 / 100, resizeMode: 'contain' }} source={localimag.whitedot} /> */}
                            </View>
                        </View>

                        <ScrollView keyboardDismissMode='interactive' keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>
                            <TouchableOpacity style={{ flex: 1, paddingBottom: mobileW * 15 / 100 }} activeOpacity={1}>

                                <View style={{
                                    width: mobileW * 93 / 100, alignSelf: 'center', shadowColor: Colors.shadowbuy, shadowOffset: { width: 1, height: 1 }, shadowOpacity: 0.5, shadowRadius: 2,
                                    elevation: 2, paddingVertical: mobileW * 2 / 100, borderRadius: mobileW * 2 / 100, marginTop: mobileW * 2 / 100, paddingBottom: mobileW * 5 / 100, backgroundColor: Colors.white1
                                }}>
                                    <View style={{ alignSelf: 'center', marginTop: mobileW * 4 / 100, borderColor: Colors.theme1, borderWidth: 3, borderRadius: mobileW * 10 / 100 }}>
                                        <Image style={{ height: mobileW * 18 / 100, width: mobileW * 18 / 100, resizeMode: 'cover', borderRadius: mobileW * 9 / 100 }}

                                            source={this.state.driver_image == null ? localimag.img_placeholder : { uri: config.img_url + this.state.driver_image }}

                                        // source={localimag.prothree}

                                        />
                                    </View>

                                    <View style={{ width: mobileW * 78 / 100, alignItems: 'center', alignSelf: 'center' }}>
                                        <Text style={{ fontSize: mobileW * 4 / 100, color: Colors.black, fontFamily: Font.OutfitMedium }}>
                                            {/* {Lang_chg.benjamin[config.language]} */}
                                            {this.state.driver_name}
                                        </Text>
                                    </View>


                                    {/* <View style={{ width: mobileW * 35 / 100, flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', }}> */}
                                    <View style={{
                                        width: mobileW * 70 / 100, flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignSelf: 'center',
                                        marginTop: mobileW * 1 / 100
                                    }}>
                                        {/* <Text style={{ fontSize: mobileW * 3.3 / 100, fontFamily: Font.OutfitMedium, color: Colors.black }}>4.1</Text>
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
                                    <Text style={{ fontSize: mobileW * 3.1 / 100, fontFamily: Font.OutfitMedium, color: Colors.black }}>(432)</Text> */}


                                        <StarRating
                                            starSize={mobileW * 7 / 100}
                                            emptyStar={localimag.stargrey}
                                            fullStar={localimag.star}
                                            disabled={false}
                                            maxStars={5}
                                            rating={this.state.starCount}
                                            selectedStar={(rating) => this.onStarRatingPress(rating)}
                                        />

                                    </View>

                                    <View style={{ width: '90%', borderBottomColor: Colors.bottomborder, borderBottomWidth: 1, alignSelf: 'center', padding: mobileW * 2 / 100 }}></View>

                                    {/* //---------------------star rate --------------------//  */}
                                    {/* <View style={{ width: mobileW * 35 / 100, flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', paddingVertical: mobileW * 3 / 100 }}>
                                    <Image
                                        style={{ alignSelf: 'center', width: mobileW * 6.5 / 100, height: mobileW * 6.5 / 100, borderRadius: mobileW * 5 / 100 }}
                                        source={localimag.star} />
                                    <Image
                                        style={{ alignSelf: 'center', width: mobileW * 6.5 / 100, height: mobileW * 6.5 / 100, borderRadius: mobileW * 5 / 100, marginLeft: mobileW * 1 / 100 }}
                                        source={localimag.star} />
                                    <Image
                                        style={{ alignSelf: 'center', width: mobileW * 6.5 / 100, height: mobileW * 6.5 / 100, borderRadius: mobileW * 5 / 100, marginLeft: mobileW * 1 / 100 }}
                                        source={localimag.stargrey} />
                                    <Image
                                        style={{ alignSelf: 'center', width: mobileW * 6.5 / 100, height: mobileW * 6.5 / 100, borderRadius: mobileW * 5 / 100, marginLeft: mobileW * 1 / 100 }}
                                        source={localimag.stargrey} />
                                    <Image
                                        style={{ alignSelf: 'center', width: mobileW * 6.5 / 100, height: mobileW * 6.5 / 100, borderRadius: mobileW * 5 / 100, marginLeft: mobileW * 1 / 100 }}
                                        source={localimag.stargrey} />

                                </View> */}

                                    <View style={{
                                        width: mobileW * 78 / 100, alignSelf: 'center',
                                        borderRadius: mobileW * 1 / 100, paddingBottom: mobileW * 25 / 100,
                                        backgroundColor: '#F9F9FE'
                                        // backgroundColor: 'red'
                                    }}>
                                        <View style={{
                                            width: mobileW * 79 / 100, alignSelf: 'center', justifyContent: 'flex-start', flexDirection: 'row', marginLeft: mobileW * 4 / 100, marginTop: mobileW * 2 / 100,
                                            // alignItems: 'center'
                                        }}>
                                            <Image style={{ marginTop: mobileW * 2 / 100, height: mobileW * 5 / 100, width: mobileW * 5 / 100, resizeMode: 'contain', tintColor: '#80878A' }} source={localimag.Editpen}></Image>
                                            <TextInput
                                                selectionColor={Colors.textInputSelectionColor1}
                                                onChangeText={(txt) => this.setState({ review: txt })}
                                                placeholder={Lang_chg.review[config.language]}
                                                keyboardType='default'
                                                placeholderTextColor={'#636363'}
                                                maxLength={200}
                                                numberOfLines={3}
                                                multiline={true}
                                                style={{
                                                    textAlignVertical: 'top',
                                                    // backgroundColor: 'red',
                                                    width: '85%', fontSize: mobileW * 3.5 / 100, color: '#80878A', fontFamily: Font.extraBold
                                                }}></TextInput>

                                            {/* <Text style={{ fontSize: mobileW * 3.5 / 100, fontFamily: Font.extraBold, color: '#80878A', alignSelf: 'center', marginLeft: mobileW * 2 / 100 }}>{Lang_chg.review[config.language]}</Text> */}
                                        </View>
                                    </View>


                                    <TouchableOpacity
                                        onPress={() => {
                                            if (this.state.starCount == 0) {
                                                //FULL NAME
                                                msgProvider.toast(msgText.Please_select_star[config.language], 'center');
                                                return false;
                                            }




                                            if (this.state.review == '') {
                                                //FULL NAME
                                                msgProvider.toast(msgText.enterreview[config.language], 'center');
                                                return false;
                                            }
                                            if (this.state.review.trim().length < 3) {
                                                msgProvider.toast(msgText.minimum_characters_Message[config.language], 'center');
                                                return false;
                                            }


                                            this.send_rating()




                                            // this.state.navi_status == 0 ?
                                            //     this.props.navigation.navigate('Pendingui', { 'Status': 5 }) :
                                            //     this.props.navigation.navigate('Pendinguione', { 'Status': 8 })
                                        }}
                                        style={{
                                            marginTop: mobileW * 10 / 100,
                                            flexDirection: 'row', width: mobileW * 83 / 100,
                                            alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderRadius: mobileW * 1 / 100, paddingVertical: mobileW * 4 / 100, backgroundColor: Colors.removecolor
                                        }}>
                                        <Text style={{ fontSize: mobileW * 4.3 / 100, fontFamily: Font.OutfitMedium, color: Colors.white_color, textAlign: 'center', paddingLeft: 3.5 }}>
                                            {Lang_chg.send[config.language]}
                                        </Text>
                                    </TouchableOpacity>


                                </View>




                            </TouchableOpacity>
                        </ScrollView>
                    </TouchableOpacity>

                </KeyboardAwareScrollView>
            </View>
        )
    }
}