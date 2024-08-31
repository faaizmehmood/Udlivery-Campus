import { RefreshControl, View, Image, StatusBar, Text, FlatList, ImageBackground, TouchableOpacity, SafeAreaView, ScrollView, Keyboard, StyleSheet, TextInput } from 'react-native'
import React, { Component } from 'react'
import { config, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag } from './Provider/utilslib/Utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default class Dininghall extends Component {
    constructor(props) {
        super(props)
        this.state = {
            order_type: this.props.route.params.order_type,
            user_id: 'NA',
            user_type: 'NA',
            user_name: 'NA',
            user_email: 'NA',
            dining_arr: 'NA',
            dining_arr1: 'NA',
            refresh: false,
        }
    }

    componentDidMount() {
        this.getUserDetail();
        consolepro.consolelog(this.state.user_id);

        this.props.navigation.addListener('focus', () => {
            this.getUserDetail();
        });
    }

    getUserDetail = async () => {
        let userdata = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('userdata', userdata);
      
        this.setState({
            user_id: userdata.user_id,
            user_type: userdata.user_type,
            user_name: userdata.name,
            user_email: userdata.email,
        });
        consolepro.consolelog(this.state.user_id);

        this.get_all_dining();
    };

    get_all_dining = async (var1) => {
        let url =
            this.state.order_type == 0 ?
                config.baseURL + 'get_all_dining.php?user_id=' + this.state.user_id
                :
                this.state.order_type == 1 ?
                    config.baseURL + 'get_dining_facilities_all.php?user_id=' + this.state.user_id
                    :
                    config.baseURL + 'get_home_search.php?user_id=' + this.state.user_id;
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

                    let dining_arr =
                        this.state.order_type == 0
                            ? obj.dining_arr :
                            this.state.order_type == 1 ?
                                obj.diningFacility_arr : obj.search_arr;

                    setTimeout(() => {
                        this.setState({
                            dining_arr: dining_arr,
                            dining_arr1: dining_arr,
                            refresh: false
                        });
                    }, 200);

                } else {
                    if (obj.account_active_status == 0) {
                        config.checkUserDeactivate(this.props.navigation);
                        return false;
                    }
                    msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                    return false;
                }
            }).catch((error) => {
                consolepro.consolelog("error" + error);
            })
    };


  
    //--------function for local search-------//
    _searchProduct = (textToSearch) => {

        let data1 = this.state.dining_arr1
        // let data1 = this.state.dining_arr
        if (data1 != 'NA') {
            consolepro.consolelog('data1', data1);
            if (data1 != 'NA') {
                var text_data = textToSearch.toString().toLowerCase();
                let newData = data1.filter(function (item) {
                    return (
                        item.name.toString().toLowerCase().indexOf(text_data) >= 0
                    )
                });

                if (newData.length > 0) {
                    this.setState({ dining_arr: newData })
                } else if (newData.length <= 0) {
                    this.setState({ dining_arr: 'NA' })
                }
            }
        }
    }

    _onRefresh = () => {
        this.setState({ refresh: true })
        this.get_all_dining(1);
    }

    render() {
        return (
            <KeyboardAwareScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refresh}
                        onRefresh={this._onRefresh}
                  
                    />
                }
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
    
                style={{ flex: 1 }}
                keyboardShouldPersistTaps='handled'>



                <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={() => { Keyboard.dismiss() }}>
                    <SafeAreaView style={{ backgroundColor: Colors.theamColor, flex: 0 }} />
                    
                    <View style={{
                        paddingLeft: mobileW * 0.02, flexDirection: 'row', justifyContent: 'flex-start',
                        width: mobileW * 100 / 100, alignItems: 'center', backgroundColor: Colors.theamColor,
                    }} >
                        <TouchableOpacity style={{ width: mobileW * 12 / 100 }} onPress={() => this.props.navigation.goBack('')} >
                            <Image style={{ height: mobileW * 6 / 100, width: mobileW * 6 / 100, resizeMode: 'contain' }} source={localimag.goback} />
                        </TouchableOpacity>
                        <View style={{ width: mobileW * 78 / 100, paddingVertical: mobileW * 3 / 100, alignItems: 'center', alignSelf: 'center' }}>
                            <Text style={{ fontSize: mobileW * 5 / 100, color: Colors.white_color, fontFamily: Font.OutfitMedium }}>

                                {this.state.order_type == 0 ? Lang_chg.Dininghall[config.language] :
                                    this.state.order_type == 1 ? Lang_chg.Diningfacility[config.language] :
                                        this.state.order_type == 2 ? Lang_chg.Homesearch[config.language] :
                                            null

                                }</Text>
                        </View>
                        <View style={{ width: mobileW * 10 / 100 }}>
                          </View>
                    </View>

                    <ScrollView

                        keyboardDismissMode='interactive' keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>
                        <TouchableOpacity style={{ flex: 1, paddingBottom: mobileW * 30 / 100 }} activeOpacity={1}>

                            <View
                                style={{
                                    flexDirection: 'row', width: mobileW * 100 / 100, borderRadius: mobileW * 1 / 100, backgroundColor: '#FDFDFD', paddingVertical: mobileW * 1 / 100, shadowColor: Colors.shadow_color, shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.20, elevation: 1, alignSelf: 'center',
                                }}>
                                <Image style={{
                                    height: mobileW * 4.8 / 100, width: mobileW * 4.8 / 100, resizeMode: 'contain', alignSelf: 'center', justifyContent: 'center', marginLeft: mobileW * 2 / 100,
                                }} source={localimag.searchg}></Image>
                                <TextInput
                                    style={{
                                        width: '88%', justifyContent: 'center', paddingLeft: mobileW * 1 / 100, alignSelf: 'center', fontFamily: Font.fontregular, paddingVertical: mobileW * 2 / 100, color: Colors.light_grey, fontSize: mobileW * 4.2 / 100
                                    }}
                                    onChangeText={(txt) => this._searchProduct(txt)}
                                    maxLength={53}
                                    selectionColor={Colors.textInputSelectionColor1}
                                    returnKeyLabel='done'
                                    returnKeyType='done'
                                    onSubmitEditing={() => { Keyboard.dismiss() }}
                                    placeholderTextColor={Colors.light_grey} placeholder={'Search'}
                                />
                            </View>


                            {this.state.dining_arr != 'NA' ?
                                <View style={{ marginTop: mobileW * 1 / 100 }}>
                                    <FlatList
                                        data={this.state.dining_arr}
                                        numColumns={2}
                                        renderItem={({ item, index }) => {
                                            return (
                                                <TouchableOpacity activeOpacity={1}
                                                    onPress={() =>
                                                        this.state.order_type == 1 ?
                                                            this.props.navigation.navigate('Details_One', { dining_facility_id: item.dining_facility_id, user_id: this.state.user_id })
                                                            :
                                                            this.props.navigation.navigate('Details', { dining_halls_id: item.dining_halls_id, user_id: this.state.user_id })}
                                                >

                                                    <View style={{ alignItems: 'center', marginLeft: mobileH * 1.5 / 100, paddingVertical: mobileW * 2 / 100 }}>
                                                        <View style={styles.inboxText}>

                                                            <View style={{
                                                                shadowColor: Colors.shadow_color,
                                                                shadowOffset: { width: 2, height: 2, },
                                                                shadowOpacity: 0.20,
                                                                elevation: 2, backgroundColor: '#FFFFFF', borderRadius: 4.8, paddingBottom: mobileW * 2 / 100
                                                            }}>
                                                                <ImageBackground style={{ height: mobileW * 35 / 100, width: mobileW * 44 / 100, resizeMode: 'cover', alignSelf: 'center' }}
                                                                    imageStyle={{ height: mobileW * 35 / 100, width: mobileW * 44 / 100, resizeMode: 'cover', borderRadius: 4.8 }}
                                                                    source={{ uri: config.img_url + item.image }}

                                                                >
                                                                </ImageBackground>

                                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: mobileH * 0.01, marginLeft: mobileW * 0.02 }}>
                                                                    <Text style={{ fontSize: mobileW * 3.5 / 100, color: Colors.mediumgrey, textAlign: 'center', fontFamily: Font.OutfitMedium }}>{item.name}</Text>
                                                                </View>

                                                                <View style={{ flexDirection: 'row', alignSelf: 'flex-start', alignItems: 'center', marginLeft: mobileW * 0.02, alignSelf: 'flex-start', justifyContent: 'center', paddingVertical: mobileW * 0.6 / 100 }}>
                                                                    <Image style={{ height: mobileW * 3.8 / 100, width: mobileW * 3.8 / 100, resizeMode: 'contain', }}
                                                                        source={localimag.breakfastimg} />
                                                                    <Text
                                                                        numberOfLines={1}
                                                                        style={{
                                                                            width: '90%',
                                                                            fontSize: mobileW * 2.8 / 100,
                                                                            color: Colors.dinnigfacili,
                                                                            marginLeft: mobileW * 0.01,
                                                                            marginTop:mobileW*0.5/100,
                                                                            fontFamily: Font.Fontregular
                                                                        }}>{item.category_name}</Text>
                                                                </View>
                                                                {item.status == 1 && <Text style={{ fontSize: mobileW * 3.5 / 100, color: Colors.opengreen, marginLeft: mobileW * 0.02, paddingVertical: 2, fontFamily: Font.OutfitMedium }}>{Lang_chg.Open[config.language]}</Text>}
                                                                {item.status == 0 && <Text style={{ fontSize: mobileW * 3.5 / 100, color: Colors.red, marginLeft: mobileW * 0.02, paddingVertical: 2, fontFamily: Font.OutfitMedium }}>{Lang_chg.Close[config.language]}</Text>}
                                                            </View>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        }} />
                                </View> :
                                <View style={{ alignItems: 'center', justifyContent: 'center', alignSelf: 'center', height: mobileH * 50 / 100, width: mobileW }}>
                                    <Image resizeMode='contain' style={{ width: mobileW, height: mobileW }} source={localimag.no_data_img}></Image>
                                </View>}
                        </TouchableOpacity>
                    </ScrollView>
                </TouchableOpacity>
            </KeyboardAwareScrollView>

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
    inboxText: {
        width: mobileW * 44 / 100,
        borderRadius: 5,
        //marginTop: mobileH * 1 / 100,
        alignSelf: 'center',
        justifyContent: 'center',
        paddingVertical: mobileW * 1 / 100,
    },
})