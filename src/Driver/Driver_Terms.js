import {
    Text, View, ImageBackground, Image, TextInput, Dimensions,Switch,SafeAreaView,FlatList,
    StatusBar, TouchableOpacity,StyleSheet,Modal,ScrollView
  } from 'react-native';
  import React, { Component } from 'react';
  const MobileW = Dimensions.get('window').width;
  const MobileH = Dimensions.get('window').height;
  import { config,  Common_Button,msgProvider, localStorage, apifuntion, msgText, msgTitle, 
  consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag } from '../Provider/utilslib/Utils';
  import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { color } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';
  // import Mapprovider from './Provider/Mapprovider';
  // import Mapprovider from '../Provider/Mapprovider';

export default class Driver_Terms extends Component {
  constructor(props) {
    super(props)
    this.state = {
        passwordhide: false,
        contentpage: this.props.route.params.contentpage
    }


}


managePageRedirection = () => {
    if (this.props.route.params.pageKey == 1) {
        this.props.navigation.navigate('Paydetail')
    } else {
        this.props.navigation.navigate('Cashdetail')
    }

}
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.white_color }}>
                {/* <StatusBar hidden={false} StatusBarStyle='dark-content' 
                backgroundColor={Colors.multigreen} translucent={false} 
                networkActivityIndicatorVisible={true} 
                barStyle="dark-content" /> */}
                <ScrollView style={{ flex: 1 }}>


                    <View
                        style={{ height: mobileH * 8 / 100, width: mobileW * 100 / 100, alignSelf: 'center', backgroundColor: Colors.theamColor, }} >

                        <View style={{ flexDirection: "row", height: mobileH * 6 / 100, width: mobileW * 99 / 100, alignSelf: 'center', justifyContent: 'space-between', alignItems: 'center', marginTop: mobileH * 0.01 }}>
                            <TouchableOpacity style={{ width: mobileW * 10 / 100 }} 
                            onPress={() => this.props.navigation.goBack()} >
                            <Image style={{ height: mobileW * 6 / 100, width: mobileW * 6 / 100,
                             resizeMode: 'contain', alignSelf: 'center', 
                             justifyContent: 'flex-start' }} source={localimag.goback} ></Image>
                            </TouchableOpacity>
                            <Text style={{ fontSize: mobileW * 5 / 100, color: Colors.white_color, fontFamily: Font.OutfitMedium }}>
                            {this.state.contentpage == 0 && <Text style={{ fontSize: mobileW * 0.05, color: Colors.white_color, }}>Terms & Conditions</Text>}
                            {this.state.contentpage == 1 && <Text style={{ fontSize: mobileW * 0.05, color: Colors.white_color, }}>Privacy Policy</Text>}
                            {this.state.contentpage == 2 && <Text style={{ fontSize: mobileW * 0.05, color: Colors.white_color, }}>About Us</Text>}
                            {this.state.contentpage == 3 && <Text style={{ fontSize: mobileW * 0.05, color: Colors.white_color, }}>Agreement</Text>}
                            </Text>
                            <TouchableOpacity style={{ width: mobileW * 10 / 100 }}>
                            </TouchableOpacity>
                        </View>
                    </View>


                    <View style={{ backgroundColor: Colors.white1, width: mobileW * 0.93, alignSelf: 'center', paddingHorizontal: 4, marginTop: mobileH * 0.01 }}>
                        <Text style={{ fontSize: mobileW * 0.04, textAlign: 'justify', lineHeight: 25, fontFamily: Font.Fontregular }}>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,
                            optio,eaque rerum!Provident similique accusantium nemo autem. Veritatis
                            obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam
                            nihil, eveniet aliquid culpa officia aut! Impedit sit sunt quaerat, odit,
                            tenetur error, harum nesciunt ipsum debitis quas aliquid. Reprehenderit,
                            quia. Quo neque error repudiandae fuga? Ipsa laudantium molestias eos
                            sapiente officiis modi at sunt excepturi expedita sint? Sed quibusdam
                            quasi aliquam eligendi, placeat qui corporis! It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.
                            Many desktop publishing packages and web page editors now use Lorem Ipsum as their
                            default model text, and a search for 'lorem ipsum' will uncover many web sites
                            still in their infancy.Contrary to popular belief, Lorem Ipsum is not simply random text
                            . It has roots in a piece of classical Latin literature from 45 BC, making it over 2000
                            years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia,
                            looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage,
                            and going through the cites of the word in classical literature, discovered the undoubtable source.


                        </Text>
                    </View>

                    {this.state.contentpage == 3 &&
                        <View>
                            <View style={{
                                flexDirection: 'row',
                                width: mobileW * 93 / 100,
                                marginTop: mobileH * 0.33,
                                backgroundColor: Colors.white_color,
                                alignSelf: 'center', justifyContent: 'flex-start'

                            }}>

                                <TouchableOpacity
                                    style={{ marginTop: mobileH * -1 / 100, alignSelf: 'center' }}
                                    onPress={() => {
                                        this.setState({ passwordhide: !this.state.passwordhide })
                                    }}
                                >
                                    {this.state.passwordhide == false ?
                                        <Image style={{
                                            marginTop: mobileH * 1 / 100, height: mobileW * 3.5 / 100,
                                            width: mobileW * 5 / 100,
                                            resizeMode: 'contain',
                                        }} source={localimag.squarebox}>

                                        </Image> : <Image style={{
                                            marginTop: mobileH * 1 / 100, height: mobileW * 3.5 / 100,
                                            width: mobileW * 5 / 100,
                                            resizeMode: 'contain',
                                        }} source={localimag.squarebox1}></Image>
                                    }

                                    <Text style={{ color: Colors.light_grey, marginLeft: mobileH * 0.03, marginTop: mobileH * -2.3 / 100, }}>Please check to accept our agreement</Text>
                                </TouchableOpacity>

                            </View>


                            <TouchableOpacity onPress={() => this.managePageRedirection()}
                                style={{
                                    width: mobileW * 90 / 100, borderRadius: mobileW * 10 / 100, backgroundColor: Colors.mediumpink,
                                    paddingVertical: mobileW * 2.5 / 100, alignSelf: 'center', alignItems: 'center', marginTop: mobileH * 0.03
                                }}>
                                <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: 'bold', color: 'white' }}>Proceed</Text>
                            </TouchableOpacity>
                        </View>}





                </ScrollView>
            </View>
    )
  }
}