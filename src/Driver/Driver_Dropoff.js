import { View, Image, StatusBar, Text, FlatList, ImageBackground, TouchableOpacity, SafeAreaView, Modal, Keyboard, StyleSheet, TextInput, ScrollView } from 'react-native'
import React, { Component } from 'react'
import { config, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag } from '../Provider/utilslib/Utils';

export default class Driver_Dropoff extends Component {
    constructor(props) {
        super(props); {
            this.state = {
                navi_status: this.props.route.params.navi_status,
            }
        }
    }

    componentDidMount() {

        if (this.props.route.params.pageStatus != null) {
            this.setState({ pageStatus_new: 1 })
        }
        if (this.props.route.params.navi_status != null) {
            //console.log('navi_status', this.props.route.params.navi_status)
        }

    }


    render() {
        return (
            <View style={{ flex: 1 }}>

                <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={() => { Keyboard.dismiss() }}>
                    <SafeAreaView style={{ flex: 0, backgroundColor: Colors.white1 }} />
              

                    <ImageBackground ImageBackground
                        source={localimag.driverboyblur}
                        resizeMode='stretch'
                        style={{
                            width: mobileW * 100 / 100,
                            height: mobileH * 100 / 100,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }
                        }
                    >
                        <TouchableOpacity onPress={() => this.props.navigation.goBack('')} style={{ width: mobileW * 12 / 100, position: 'absolute', top: 12, right: -12, }}>
                            <Image style={{ height: mobileW * 6.5 / 100, width: mobileW * 6.5 / 100, resizeMode: 'contain' }}
                                source={localimag.Wrong} />
                        </TouchableOpacity>
                        <Image style={{ height: mobileW * 18 / 100, width: mobileW * 18 / 100, resizeMode: 'contain', alignSelf: 'center', marginTop: mobileW * 16 / 100 }} source={localimag.playbut} />


                        <TouchableOpacity
                            onPress={() => {
                                if (this.props.route.params.navi_status == 0) {
                                    this.props.navigation.navigate('Driver_pending', { Status: 2 })
                                } else {

                                    this.props.navigation.navigate('Driver_pendingDinFac', { Status: 7 })
                                }

                            }}
                            style={{
                                flexDirection: 'row', width: mobileW * 90 / 100,
                                alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                borderRadius: mobileW * 1 / 100, bottom:Platform.OS ==='android' ? 45 : 87, position: 'absolute', marginBottom:mobileW*2/100,
                                padding: mobileW * 3 / 100, backgroundColor: Colors.removecolor
                            }}>
                            <Text style={{
                                fontSize: mobileW * 3.8 / 100, color: Colors.white_color,
                                fontFamily: Font.OutfitMedium, textAlign: 'center', paddingLeft: 3.5
                            }}>
                                {Lang_chg.Step_1_B[config.language]}
                            </Text>
                        </TouchableOpacity>


                    </ImageBackground>




                </TouchableOpacity>

            </View>
        )
    }
}