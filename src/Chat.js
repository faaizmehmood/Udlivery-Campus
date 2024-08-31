import { Text, View, SafeAreaView, TouchableOpacity, ScrollView, StatusBar, Image, ImageBackground, TextInput, Modal, StyleSheet, FlatList, Keyboard, KeyboardAvoidingView } from 'react-native'
import React, { Component } from 'react'
import { config, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag } from './Provider/utilslib/Utils';

export default class Chat extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            user_id: 10,
            //status: this.props.route.params.status,
            data1: [
                {
                    title: 'Hello Sir',
                    user_id: 11,
                    type: 'text',
                    time: '9:45 AM',
                },
                {
                    title: 'Hello Good afternoon',
                    user_id: 10,
                    type: 'text',
                    time: '10:00 AM',
                },
                {
                    title: 'When will i get my parcel',
                    user_id: 11,
                    type: 'text',
                    time: '10:08 AM',
                },

            ],
            modalVisible: false,
            // mediamodal: false
        }
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.white1 }}>


                <SafeAreaView style={{ backgroundColor: Colors.theamColor, flex: 0 }} />
                {/* <StatusBar barStyle='light-content' backgroundColor={Colors.theamColor} hidden={false} translucent={false} /> */}

                {/* //==============Modal========// */}
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setState({ modalVisible: false })
                    }}>
                    <View style={{ backgroundColor: '#00000070', flex: 1 }}>
                        <View style={{ borderRadius: 20, position: 'absolute', bottom: 10, width: mobileW * 90 / 100, alignSelf: 'center', }}>

                            <View style={{ width: mobileW * 90 / 100, alignSelf: 'center', borderRadius: 15, backgroundColor: 'white', paddingVertical: mobileW * 1 / 100 }}>
                                <View style={{ justifyContent: 'center', paddingVertical: mobileW * 2 / 100, borderBottomWidth: 1, borderBottomColor: Colors.bottomborder }}>
                                    <View style={{ justifyContent: 'center', }}>
                                        <Text style={{ fontSize: mobileW * 4 / 100, color: Colors.black_color, fontFamily: Font.Fontregular, textAlign: 'center' }}  >{Lang_chg.Select_Option[config.language]}</Text></View>
                                </View>
                                {/* ====================camera=================== */}

                                <View style={{ justifyContent: 'center', paddingVertical: mobileW * 3 / 100, borderBottomWidth: 1, borderBottomColor: Colors.bottomborder, color: Colors.allmsg, fontFamily: Font.fontbold, }}  >
                                    <TouchableOpacity onPress={() => this.setState({ modalVisible: false })}
                                        style={{ justifyContent: 'center' }}>
                                        <Text style={{ fontSize: mobileW * 4 / 100, color: Colors.black_color, fontFamily: Font.Fontregular, textAlign: 'center' }}>{Lang_chg.clear_chat[config.language]}</Text>
                                    </TouchableOpacity>
                                </View>
                                {/* ====================report=================== */}
                                <View style={{ justifyContent: 'center', paddingVertical: mobileW * 3 / 100 }}>
                                    <TouchableOpacity style={{ justifyContent: 'center', }}
                                    >
                                        <Text style={{ fontSize: mobileW * 4 / 100, color: Colors.black_color, fontFamily: Font.Fontregular, textAlign: 'center' }}>{Lang_chg.report[config.language]}</Text>
                                    </TouchableOpacity>

                                </View>
                            </View>
                            {/* ====================cancel=================== */}
                            <View style={{ justifyContent: 'center', paddingVertical: mobileW * 3.5 / 100, borderBottomWidth: 0.3, marginTop: 10, width: mobileW * 90 / 100, borderRadius: mobileW * 3 / 100, alignSelf: 'center', backgroundColor: 'white', }}>
                                <TouchableOpacity style={{ justifyContent: 'center', }} onPress={() => this.setState({ modalVisible: false })}><Text style={{ fontSize: mobileW * 4 / 100, color: 'red', fontFamily: Font.Semibold, textAlign: 'center' }}>{Lang_chg.cancel[config.language]}</Text></TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>


                {/* =======================header========== */}

                <View style={{ alignSelf: 'center', width: mobileW * 100 / 100, justifyContent: 'center', backgroundColor: Colors.theamColor, flexDirection: 'row', paddingVertical: mobileW * 2.5 / 100 }}>
                    <TouchableOpacity onPress={() => { this.props.navigation.goBack() }} style={{ width: '10%', alignSelf: 'center' }}>
                        <Image style={{ height: mobileW * 5 / 100, width: mobileW * 5 / 100, alignSelf: 'center', borderRadius: mobileW * 7.5 / 100 }} source={localimag.goback} />
                    </TouchableOpacity>
                    <View style={{ width: '10%', alignSelf: 'center' }}>
                        <Image style={{ height: mobileW * 10 / 100, width: mobileW * 10 / 100, alignSelf: 'center', borderRadius: mobileW * 5 / 100 }} source={localimag.profour} />
                    </View>
                    <View style={{ width: '70%', paddingLeft: mobileW * 3 / 100 }}>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: mobileW * 4.5 / 100, color: Colors.white_color, fontFamily: Font.OutfitMedium, textAlign: config.textalign }}>{Lang_chg.Drake[config.language]}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center' }}>
                            <Text style={{ fontSize: mobileW * 3 / 100, color: Colors.white_color, fontFamily: Font.OutfitMedium, textAlign: config.textalign }}>{Lang_chg.Orderid[config.language]}</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => { this.setState({ modalVisible: true }) }} style={{ width: '10%', alignSelf: 'center', }}>
                        <Image style={{ height: mobileW * 5 / 100, width: mobileW * 5 / 100, alignSelf: 'center', borderRadius: mobileW * 7.5 / 100 }} source={localimag.whitedot} />
                    </TouchableOpacity>
                </View>


                <ScrollView keyboardDismissMode='interactive' keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>
                    <TouchableOpacity style={{ flex: 1, paddingBottom: mobileW * 30 / 100 }} activeOpacity={1}>



                        <View style={{ backgroundColor: Colors.white1, width: mobileW * 100 / 100, height: mobileH * 76 / 100 }}>

                            <FlatList
                                data={this.state.data1}
                                showsVerticalScrollIndicator={false}

                                renderItem={({ item, index }) => {

                                    return (

                                        <View style={{ marginTop: 2, width: mobileW * 95 / 100, alignSelf: 'center' }} key={index}>
                                            {this.state.user_id == item.user_id &&
                                                <View style={{ flexDirection: 'row', }}>

                                                    <View
                                                        style={[{
                                                            //flexDirection: 'row',
                                                            //alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            // marginLeft: 10,
                                                            // height:#E8E8E9 (mobileH * 8) / 100,
                                                            width: mobileW * 60 / 100,
                                                            alignSelf: 'flex-start',
                                                            //justifyContent: 'flex-start',
                                                            backgroundColor: Colors.lightpurple,
                                                            marginTop: mobileW * 10 / 100,
                                                            padding: 7,
                                                            //paddingTop:10,

                                                            borderTopEndRadius: 3,
                                                            borderBottomLeftRadius: 3,
                                                            borderBottomRightRadius: 3,
                                                        },]}>

                                                        <Text style={{ color: 'black', fontFamily: Font.regular_font, textAlign: config.textalign }}>{item.title}</Text>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 3, width: mobileW * 20 / 100, justifyContent: 'flex-end', alignSelf: 'flex-end' }} >

                                                            <Text style={{ fontSize: mobileW * 2 / 100, paddingHorizontal: 5, color: Colors.black, textAlign: config.textalign }}>{item.time}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            }
                                            {this.state.user_id != item.user_id && <View
                                                style={[{
                                                    //flexDirection: 'row',
                                                    //alignItems: 'center',
                                                    //justifyContent: 'space-between',
                                                    // height: (mobileH * 8) / 100,
                                                    width: mobileW * 60 / 100,
                                                    alignSelf: 'flex-end',
                                                    backgroundColor: '#F2F2F2',
                                                    //justifyContent:'flex-start',
                                                    marginTop: mobileW * 10 / 100,
                                                    padding: item.type != 'image' ? 7 : 0,
                                                    //paddingTop:10,

                                                    borderTopStartRadius: 5,
                                                    borderBottomLeftRadius: 5,
                                                    borderBottomRightRadius: 5,
                                                },]}>

                                                {item.type == 'text' && <Text style={{ paddingHorizontal: 5, color: Colors.black, textAlign: config.textalign }}>{item.title}</Text>}
                                                {/* {item.type == 'image' && <Image
                                                        source={require('../icons/paneer-chilli-img.png')}
                                                        style={{ height: mobileH * 39 / 100, width: (mobileW * 56) / 100, resizeMode: 'cover', marginVertical: 10, 'alignSelf': 'center' }}
                                                    />} */}
                                                {item.type != 'image' && <View style={{ flexDirection: 'row', alignItems: 'center', width: mobileW * 20 / 100, justifyContent: 'flex-end', alignSelf: 'flex-end' }} >
                                                    {/* <Image
                            source={require('../icons/checkmsg.png')}
                            style={{ height: mobileH * 2 / 100, width: (mobileW * 2) / 100, resizeMode: 'contain' }}
                        /> */}
                                                    <Text style={{ fontSize: mobileW * 2 / 100, paddingHorizontal: 5, color: Colors.black, textAlign: config.textalign }}>{item.time}</Text>
                                                </View>}
                                            </View>}

                                        </View>
                                    )
                                }
                                }

                                keyExtractor={(item, index) => index.toString()}
                            ></FlatList>
                        </View>



                    </TouchableOpacity>
                </ScrollView>

                {/* //-------------messagebox-----------? */}


                {Platform.OS == 'ios' ?
                    <KeyboardAvoidingView

                        behavior='position'
                        keyboardVerticalOffset={40}
                    >
                        <View style={{ alignSelf: 'center', width: mobileW * 100 / 100, backgroundColor: Colors.white_color, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity
                                // onPress={() => this.setState({ mediamodal: true })}
                                style={{ borderTopColor: Colors.white1, width: mobileW * 10 / 100 }} >
                                <Image source={localimag.Shareicon} style={{ height: mobileH * 9 / 100, width: mobileW * 9 / 100, resizeMode: 'contain', alignSelf: 'center' }} />
                            </TouchableOpacity>

                            <TextInput
                                style={{
                                    paddingLeft: 15,
                                    fontSize: mobileH * 2 / 100,
                                    height: mobileH * 5.5 / 100,
                                    width: mobileW * 80 / 100,
                                    borderColor: Colors.chatInputBorderColour,
                                    borderWidth: 1,
                                    borderRadius: mobileW * 10 / 100,

                                    justifyContent: 'center',
                                    marginLeft: mobileW * 5 / 100,
                                    alignSelf: 'center',
                                    textAlign: config.textalign,
                                    marginLeft: mobileW * 0.5 / 100,
                                    fontFamily: Font.placeholderstyle,
                                    color: '#7F7D7D',
                                    paddingVertical: mobileW * 1.5 / 100
                                }}
                                value={"" + this.state.name + ""}
                                //ref={input => { this.email = input }}
                                onChangeText={(txt) => { this.setState({ name: txt }) }}
                                keyboardType='default'
                                selectionColor={Colors.textInputSelectionColor1}
                                maxLength={50}
                                returnKeyLabel='done'
                                returnKeyType='done'
                                onSubmitEditing={() => { Keyboard.dismiss() }}
                                placeholder={Lang_chg.say_something[config.language]}
                                placeholderTextColor={'#7F7D7D'}
                                clearButtonMode="always"
                            />
                            <TouchableOpacity disabled={true} onPress={() => this.props.navigation.navigate('Home')} style={{ borderTopColor: Colors.white1, width: mobileW * 10 / 100 }} >
                                <Image source={localimag.Sendicon} style={{ height: mobileH * 9 / 100, width: mobileW * 9 / 100, resizeMode: 'contain', alignSelf: 'center' }} />
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                    :
                    <KeyboardAvoidingView

                    // behavior='position'
                    // keyboardVerticalOffset={40}
                    >
                        <View style={{ alignSelf: 'center', width: mobileW * 100 / 100, backgroundColor: Colors.white_color, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity
                                // onPress={() => this.setState({ mediamodal: true })}
                                style={{ borderTopColor: Colors.white1, width: mobileW * 10 / 100 }} >
                                <Image source={localimag.Shareicon} style={{ height: mobileH * 9 / 100, width: mobileW * 9 / 100, resizeMode: 'contain', alignSelf: 'center' }} />
                            </TouchableOpacity>

                            <TextInput
                                style={{
                                    paddingLeft: 15,
                                    fontSize: mobileH * 2 / 100,
                                    height: mobileH * 5.5 / 100,
                                    width: mobileW * 80 / 100,
                                    borderColor: Colors.chatInputBorderColour,
                                    borderWidth: 1,
                                    borderRadius: mobileW * 10 / 100,

                                    justifyContent: 'center',
                                    marginLeft: mobileW * 5 / 100,
                                    alignSelf: 'center',
                                    textAlign: config.textalign,
                                    marginLeft: mobileW * 0.5 / 100,
                                    fontFamily: Font.placeholderstyle,
                                    color: '#7F7D7D',
                                    paddingVertical: mobileW * 1.5 / 100
                                }}
                                value={"" + this.state.name + ""}
                                //ref={input => { this.email = input }}
                                onChangeText={(txt) => { this.setState({ name: txt }) }}
                                keyboardType='default'
                                selectionColor={Colors.textInputSelectionColor1}
                                maxLength={50}
                                returnKeyLabel='done'
                                returnKeyType='done'
                                onSubmitEditing={() => { Keyboard.dismiss() }}
                                placeholder={Lang_chg.say_something[config.language]}
                                placeholderTextColor={'#7F7D7D'}
                                clearButtonMode="always"
                            />
                            <TouchableOpacity disabled={true} onPress={() => this.props.navigation.navigate('Home')} style={{ borderTopColor: Colors.white1, width: mobileW * 10 / 100 }} >
                                <Image source={localimag.Sendicon} style={{ height: mobileH * 9 / 100, width: mobileW * 9 / 100, resizeMode: 'contain', alignSelf: 'center' }} />
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>}



            </View>
        )
    }
}