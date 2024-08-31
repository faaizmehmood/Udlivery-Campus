import { View, Image, StatusBar, Text, FlatList, ImageBackground, TouchableOpacity, SafeAreaView, ScrollView, Keyboard, StyleSheet, TextInput } from 'react-native'
import React, { Component } from 'react'
import { config, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag, firebaseprovider } from './Provider/utilslib/Utils';
import Footer from './Provider/Footer'
import RNRestart from 'react-native-restart';
export default class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            logoutmodal: false,
            user_type: 'NA',
            user_name: 'NA',
            user_phone: 'NA',
            user_email: 'NA',
            letter_name: '',


            //radhekrishan
            sel_university_id: '',
            university_arr: '',
            sel_university_name: '',
            user_image: ''
        };
    }
    componentDidMount = () => {
        setTimeout(() => {
            this.getUserDetail();
        }, 300);
        this.props.navigation.addListener('focus', () => {
            firebaseprovider.firebaseUserGetInboxCount();
            this.getUserDetail();
        });
    };


    get_university = async () => {
        let url = config.baseURL + 'get_university_list.php';
        consolepro.consolelog('url', url);
        var data = new FormData();
        data.append('user_id', 0);
        apifuntion
            // .getApi(url, data)
            .postApi(url, data)
            .then((obj) => {
                consolepro.consolelog('obj', obj);
                if (obj.success == 'true') {
                    let university_arr = obj.university_arr;

                    setTimeout(() => {
                        this.setState({
                            university_arr: university_arr,
                            //   mod: true  
                        });
                    }, 300);

                    consolepro.consolelog('i am outside ')

                    for (let i = 0; i < university_arr.length; i++) {
                        // consolepro.consolelog(this.state.u)
                        if (this.state.sel_university_id == university_arr[i].university_id) {
                            consolepro.consolelog(this.state.sel_university_id)
                            this.setState({
                                sel_university_name: university_arr[i].university_name
                            })
                        }
                    }

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
                console.log('error', error);
            })
    };



    getUserDetail = async () => {
        let userdata = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('userdata', userdata);
        // var letter_name = userdata.user_name;
        // letter_name = letter_name.charAt(0).toUpperCase();
        // consolepro.consolelog({ letter_name });
        this.setState({
            user_id: userdata.user_id,
            user_type: userdata.user_type,
            user_name: userdata.name,
            user_email: userdata.email,
            user_image: userdata.image,
            sel_university_id: userdata.university_id,
        });
        this.get_university();
        // consolepro.consolelog('myusername', this.state.user_name);
    };

    //user to driver

    switch_account = async () => {



        let url = config.baseURL + 'switch_account.php'

        consolepro.consolelog('url', url);
        var data = new FormData();

        data.append('user_id', this.state.user_id);
        data.append('switch_type', 1);

        apifuntion
            .postApi(url, data)
            .then((obj) => {
                consolepro.consolelog('obj switc h acount', obj);
                if (obj.success == 'true') {
                    // msgProvider.toast(obj.msg[0], 'center');
                    localStorage.setItemObject('user_arr', obj.user_details);
                    localStorage.setItemString('user_id', JSON.stringify(obj.user_details.user_id));
                    // firebaseprovider.firebaseUserCreate();
                    // firebaseprovider.getMyInboxAllData();
                    // firebaseprovider.getMyInboxAllDataBooking();
                    // let user_type = obj.user_details.user_type;
                    // let profile_complete = obj.user_details.profile_complete;
                    //console.log("profile_complete",obj.user_details.profile_complete);
                    if (obj.user_details.profile_complete == 1) {
                        RNRestart.Restart();
                    } else {
                        this.props.navigation.navigate('Become_delivery');
                    }


                    // 
                    //     if (user_type == 2 && profile_complete == 0) { 
                    // // this.props.navigation.navigate('Driver_Home');



                    //     }
                    //     else {


                    //     }
                    // localStorage.setItemObject('user_arr', obj);

                    // consolepro.consolelog('user data values after getting from localstorage and user type',obj.user_type);
                    // let userdata = localStorage.getItemObject('user_arr');
                    // consolepro.consolelog('userdata', userdata);



                    // if (this.state.remember_me) {
                    //   localStorage.setItemString('remember_me', 'yes');
                    // } else {
                    //   localStorage.setItemString('remember_me', 'no');
                    // }
                    // localStorage.setItemString('user_id', JSON.stringify(user_id));
                    // localStorage.setItemObject('user_arr', user_arr);
                    // localStorage.setItemString('password', this.state.password);
                    // localStorage.setItemString('email', this.state.email);
                    // // this.props.navigation.navigate('Home');
                    // this.setState({ email: '', password: '', remember_me: false })





                    // obj.user_details.user_type == 1 ?


                    //   setTimeout(() => {
                    //     this.props.navigation.navigate('Home');
                    //     // this.props.navigation.navigate('Verify',{user_id:obj.user_details.user_id});
                    //   }, 700)
                    //   :
                    //   setTimeout(() => {
                    //     this.props.navigation.navigate('Driver_Home');
                    //     // this.props.navigation.navigate('Verify',{user_id:obj.user_details.user_id});
                    //   }, 700)


                    //   ;
                    // setTimeout(() => {
                    //    this.props.navigation.navigate('Home');
                    //   this.props.navigation.navigate('splash');
                    // this.props.navigation.navigate('Verify',{user_id:obj.user_details.user_id});
                    // }, 700);
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
                console.log('error', error);
            });
    };







    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#F7F7F7' }}>

                <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={() => { Keyboard.dismiss() }}>
                    <SafeAreaView style={{ backgroundColor: Colors.theamColor, flex: 0 }} />
                    {/* <StatusBar barStyle='light-content' backgroundColor={Colors.theamColor} hidden={false} translucent={false} /> */}

                    <ImageBackground style={{
                        // height: mobileW * 48 / 100,
                        height: mobileW * 53 / 100,
                        // height: mobileW * 75 / 100,

                        alignSelf: 'center',
                        width: mobileW * 100 / 100,
                        // width: mobileW * 150 / 100,
                    }} source={localimag.profile}
                        // resizeMode='stretch'
                        resizeMode='stretch'
                    // resizeMode='cover'
                    // resizeMode='contain'
                    // resizeMode='contain'

                    >
                        <TouchableOpacity style={{ width: mobileW * 12 / 100 }} onPress={() => this.props.navigation.goBack('')} >
                            {/* <Image style={{ height: mobileW * 7 / 100, width: mobileW * 7 / 100, resizeMode: 'contain' }} source={localimag.goback} /> */}
                        </TouchableOpacity>
                        <View style={{ width: mobileW * 76 / 100, alignItems: 'center', alignSelf: 'center', marginTop: mobileW * 2 / 100 }}>
                            <Text style={{ fontSize: mobileW * 5 / 100, color: Colors.white_color, fontFamily: Font.OutfitMedium }}>{Lang_chg.profile[config.language]}</Text>
                        </View>
                        <View style={{ width: mobileW * 12 / 100 }}>
                            {/* <Image style={{ height: mobileW * 7 / 100, width: mobileW * 7 / 100, resizeMode: 'contain' }} source={localimag.notification} /> */}
                        </View>
                    </ImageBackground>



                    <View style={{
                        // backgroundColor: 'yellow',
                        alignItems: 'center', marginTop: mobileW * -16 / 100,
                    }}>
                        <Image
                            style={{
                                // backgroundColor: 'red',
                                backgroundColor: '#fff',
                                borderRadius: mobileW * 15 / 100,
                                // resizeMode:'cover',
                                height: mobileW * 26.5 / 100, width: mobileW * 26.5 / 100, alignSelf: 'center', justifyContent: 'center', borderWidth: 5, borderColor: Colors.white_color
                            }}
                            // source={localimag.Profinactive}
                            // source= {this.state.user_image ==null? localimag.Profinactive : {uri:config.img_url+ this.state.user_image}}
                            source={this.state.user_image == null ? localimag.img_placeholder : { uri: config.img_url + this.state.user_image }}

                        >
                            {/* source={localimag.protwo}> */}
                        </Image>
                    </View>
                    <ScrollView keyboardDismissMode='interactive' keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>
                        <TouchableOpacity style={{ flex: 1, paddingBottom: mobileW * 30 / 100 }} activeOpacity={1}>


                            <View style={{
                                width: mobileW * 100 / 100, borderRadius: 28,
                                // backgroundColor: Colors.mediabackground,
                                alignSelf: 'center',
                            }}>
                                {/* <View style={{ width: mobileW * 90 / 100, alignSelf: 'center', justifyContent: 'center', marginTop: mobileH * 1 / 100 }}>
                                    <Text style={{ fontSize: mobileW * 5.3 / 100, fontFamily: Font.Semibold, color: Colors.removecolor, alignSelf: 'center' }}>
                                        {Lang_chg.charlotte[config.language]}
                                        {this.state.user_name}
                                    </Text>
                                </View> */}
                                <View style={{ width: mobileW * 90 / 100, alignSelf: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                                    <Image style={{ height: mobileW * 6.3 / 100, width: mobileW * 6.3 / 100, resizeMode: 'contain', }} source={localimag.message}></Image>
                                    <Text style={{ fontSize: mobileW * 3.7 / 100, fontFamily: Font.OutfitMedium, color: Colors.light_grey, alignSelf: 'center', marginLeft: mobileW * 1 / 100 }}>
                                        {/* {Lang_chg.charlottemail[config.language]} */}
                                        {this.state.user_email}
                                    </Text>
                                </View>
                            </View>



                            <View style={{ flexDirection: 'row', width: mobileW * 92 / 100, alignSelf: 'center', justifyContent: 'center', marginTop: mobileW * 13 / 100, borderBottomColor: Colors.bottomborder, borderBottomWidth: 1, paddingVertical: mobileW * 2 / 100 }}>
                                <Image style={{ height: mobileW * 5 / 100, width: mobileW * 5 / 100, resizeMode: 'contain', alignSelf: 'center' }}
                                    source={localimag.university}>
                                </Image>
                                <View style={{ flexDirection: 'row', width: mobileW * 85 / 100, alignItems: 'center', justifyContent: 'space-between', marginLeft: mobileW * 2 / 100 }}>
                                    <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.OutfitMedium, color: Colors.mediumgrey, textAlign: 'center', }}>
                                        {/* {Lang_chg.Harvar[config.language]} */}
                                        {this.state.sel_university_name}

                                    </Text>
                                </View>
                            </View>

                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Edit_Profile', { 'Status': 1 })} style={{ flexDirection: 'row', width: mobileW * 92 / 100, alignSelf: 'center', justifyContent: 'center', marginTop: mobileW * 5 / 100, borderBottomColor: Colors.bottomborder, borderBottomWidth: 1, paddingVertical: mobileW * 2 / 100 }}>
                                <Image style={{ height: mobileW * 5 / 100, width: mobileW * 5 / 100, resizeMode: 'contain', alignSelf: 'center' }}
                                    source={localimag.user}>
                                </Image>
                                <View style={{ flexDirection: 'row', width: mobileW * 85 / 100, alignItems: 'center', justifyContent: 'space-between', marginLeft: mobileW * 2 / 100 }}>
                                    <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.OutfitMedium, color: Colors.mediumgrey, textAlign: 'center', }}>{Lang_chg.Editprofile[config.language]}</Text>
                                    <Image style={{ height: mobileW * 4 / 100, width: mobileW * 4 / 100, resizeMode: 'contain', }}
                                        source={localimag.arrowleft}>
                                    </Image>
                                </View>
                            </TouchableOpacity>


                            <TouchableOpacity
                                // onPress={() => this.props.navigation.navigate('Become_delivery')}
                                onPress={() => this.switch_account()}
                                style={{ flexDirection: 'row', width: mobileW * 92 / 100, alignSelf: 'center', justifyContent: 'space-between', marginTop: mobileW * 5 / 100, borderBottomColor: Colors.bottomborder, borderBottomWidth: 1, paddingVertical: mobileW * 2 / 100 }}>
                                <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.OutfitMedium, color: Colors.red, textAlign: 'center', }}>{Lang_chg.Becomeudelivery[config.language]}</Text>
                                <Image style={{ height: mobileW * 4 / 100, width: mobileW * 4 / 100, resizeMode: 'contain', }}
                                    source={localimag.arrowleft}>
                                </Image>
                            </TouchableOpacity>






                        </TouchableOpacity>

                    </ScrollView>

                    <Footer
                        activepage='Profile'
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
                    />
                </TouchableOpacity>
            </View>
        )
    }
}