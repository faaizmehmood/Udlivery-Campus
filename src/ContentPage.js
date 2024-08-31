import React, { Component } from 'react';
import { Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, Modal, FlatList, ScrollView, RadioButton, Button, TextInput } from 'react-native'

import { config, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag } from './Provider/utilslib/Utils';
// import HtmlView from 'react-native-fast-htmlview';
import HTML from 'react-native-render-html';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


export default class Contentpage extends Component {

    constructor(props) {

        super(props)

        this.state = {
            pagename: this.props.route.params.pagename,
            content_arr: "NA",
            user_type: this.props.route.params.user_type,
            contentpage: this.props.route.params.contentpage,
            data_not_found: '',
            datafound: 'NA',
            content: "NA"
        }
    }

    componentDidMount() {
        consolepro.consolelog('Content Page', 'Content Page')
        this.props.navigation.addListener('focus', () => {

            if (this.state.contentpage == 1) {

            }
            this.getContent();
        });
        // this.getContent();
    }

    //---------function for get all content-------//
    getContent = async () => {
        // if (content_arr == 'NA') {
        let url = config.baseURL + "get_all_content.php?user_id=0";
        consolepro.consolelog('url', url)
        apifuntion.getApi(url).then((obj) => {
            consolepro.consolelog(obj)

            if (obj.success == 'true') {

                consolepro.consolelog('content_obj', obj);

                var data = obj.content_arr;

                if (data != "NA") {

                    this.setState({ content_arr: data })

                    if (this.state.user_type == 1) {

                        if (this.state.contentpage == 2) {
                            this.setState({ content: data[2].content })
                        }

                        if (this.state.contentpage == 1) {
                            this.setState({ content: data[1].content })
                        }

                        if (this.state.contentpage == 0) {
                            this.setState({ content: data[0].content })
                        }

                    }

                    if (this.state.user_type == 2) {

                        if (this.state.contentpage == 2) {
                            this.setState({ content: data[2].content_1 })
                        }

                        if (this.state.contentpage == 1) {
                            this.setState({ content: data[1].content_1 })
                        }

                        if (this.state.contentpage == 0) {
                            this.setState({ content: data[0].content_1 })
                        }

                    }



                } else {

                    this.setState({ content_arr: "NA" })
                    this.setState({ content: "NA" })
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
        // }
        // else {
        //     var data = content_arr;
        //     if (data != 'NA') {
        //         this.setState({ datafound: content_arr });
        //     }
        //     else {
        //         this.setState({ datafound: 'NA', data_not_found: 'Content not found' })
        //     }
        // }
    }




    render() {
        return (
            <SafeAreaView style={styles.container}>

                <View style={{
                    paddingLeft: mobileW * 0.02, flexDirection: 'row', justifyContent: 'flex-start',
                    width: mobileW * 100 / 100, alignItems: 'center', backgroundColor: Colors.theamColor,
                }} >
                    <TouchableOpacity style={{ width: mobileW * 12 / 100 }}
                        onPress={() => this.props.navigation.goBack('')} >
                        <Image style={{ height: mobileW * 6.5 / 100, width: mobileW * 6.5 / 100, resizeMode: 'contain' }}
                            source={localimag.BackW} />
                    </TouchableOpacity>
                    <View style={{ width: mobileW * 76 / 100, paddingVertical: mobileW * 3 / 100, alignItems: 'center', alignSelf: 'center' }}>
                        <Text style={{
                            fontSize: mobileW * 5 / 100, color: Colors.white_color,
                            fontFamily: Font.regular
                        }}>
                            {this.state.pagename || 'Page Name'}
                        </Text>
                    </View>
                    <View style={{ width: mobileW * 12 / 100 }}>
                    </View>
                </View>


                <KeyboardAwareScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                    {
                        this.state.content != "NA" &&
                        <>
                            {
                                this.state.content != "NA" ?
                                    <View style={{ alignItems: 'center', marginTop: mobileH * 2 / 100, width: mobileW, alignSelf: 'center', paddingHorizontal: mobileW * 8 / 100 }}>
                                        {/* <HtmlView
                                            value={this.state.content}
                                            stylesheet={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.FontMedium, color: Colors.black_color, textAlign: 'justify' }}
                                        /> */}
                                        <HTML source={{ html: this.state.content }} contentWidth={mobileW * 90 / 100} />
                                    </View>
                                    :
                                    <View style={{ width: mobileW * 76 / 100, paddingVertical: mobileW * 3 / 100, alignItems: 'center', alignSelf: 'center' }}>
                                        <Text style={{
                                            fontSize: mobileW * 5 / 100, color: Colors.white_color,
                                            fontFamily: Font.regular
                                        }}>
                                            {'No Content Yet'}
                                        </Text>
                                    </View>
                            }
                        </>
                    }
                </KeyboardAwareScrollView>

                {/* <ScrollView showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false} contentContainerStyle={{ width: mobileW, }} keyboardShouldPersistTaps='handled'>
                    <View style={{ alignItems: 'center', marginTop: mobileH * 2 / 100, width: mobileW * 90 / 100, alignSelf: 'center' }}>
                    {
                            (this.state.datafound != 'NA')
                                ?
                                this.state.datafound.map((item, index) => (
                                    this.state.user_type==1?(
                                    (item.content_type == this.state.contentpage)
                                        ?
                                        <HtmlView
                                            value={config.language==0?item.content:item.content}
                                            stylesheet={styles12}
                                        />
                                        :
                                       null)
                                       :
                                       (
                                       (item.content_type == this.state.contentpage)
                                        ?
                                        <HtmlView
                                            value={config.language==0?item.content:item.content_1}
                                            stylesheet={styles12}
                                        />
                                        :
                                       null)
                                ))
                                :
                                <Text style={{ alignSelf: 'center', marginTop: 10, fontSize: 19 }}>{this.state.data_not_found}</Text>
                        }

                    </View>
                </ScrollView> */}

            </SafeAreaView>


        )
    }
}

const styles = StyleSheet.create({
    container:
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.whiteColor


    },
    view1:
    {
        backgroundColor: Colors.back_color,
        height: mobileH * 8 / 100,

        flexDirection: 'row',
        width: mobileW * 88 / 100,
        alignSelf: 'center',
        alignItems: 'center',

    },
})
const styles12 = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        // backgroundColor: 'red'
    },
    button:
    {
        marginBottom: 13,
        borderRadius: 6,
        paddingVertical: 12,
        width: '50%',
        margin: 15,
        backgroundColor: '#fa5252'
    },
    textbutton: {
        borderBottomColor: '#f2f2f2'
        , borderBottomWidth: 1,
        paddingVertical: 16,
        width: '95%',
        alignSelf: 'center'
    },
    textfont: {
        fontSize: 13,
        paddingLeft: 10
    },
    p: {
        fontWeight: '300',
        color: 'black',
        marginBottom: -50,
        lineHeight: 24,
        letterSpacing: 0.8,
        fontStyle: 'normal',
    },

})