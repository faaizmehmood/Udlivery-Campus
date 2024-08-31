import {
  Text, View, ImageBackground, Image, TextInput, Dimensions, Switch, SafeAreaView, FlatList,
  StatusBar, TouchableOpacity, StyleSheet, RefreshControl
} from 'react-native';
import React, { Component } from 'react';
const MobileW = Dimensions.get('window').width;
const MobileH = Dimensions.get('window').height;
import {
  config, Common_Button, msgProvider, localStorage, apifuntion, msgText, msgTitle,
  consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag, firebaseprovider
} from '../Provider/utilslib/Utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { color } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';
import Driver_Footer from '../Driver/Driver_Footer';
import { ScrollView } from 'react-native'
import { Nodata_foundimage } from '../Provider/Nodata_foundimage';

export default class My_Earnings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      password_show: true,
      mod: false,
      arr: 'NA',
      user_id: 'NA',
      user_type: 'NA',
      user_name: 'NA',
      user_email: 'NA',
      refresh: false
    }
    //console.log("count_inbox",count_inbox);
  }
  componentDidMount = () => {
    setTimeout(() => {
      this.getUserDetail();
    }, 300);
    this.props.navigation.addListener('focus', () => {
      this.getUserDetail();
      firebaseprovider.firebaseUserGetInboxCount();
    });
  };

  getUserDetail = async () => {
    let userdata = await localStorage.getItemObject('user_arr');
    consolepro.consolelog('userdata', userdata);
    this.setState({
      user_id: userdata.user_id,
      user_type: userdata.user_type,
      user_name: userdata.name,
      user_email: userdata.email,
      user_image: userdata.image,
      sel_university_id: userdata.university_id,
    });
    this.get_driver_side_earning();
  };

  get_driver_side_earning = async (var1) => {
    let url = config.baseURL + 'get_driver_side_earning.php?user_id=' + this.state.user_id;
    consolepro.consolelog('url', url);
    // var data = new FormData();
    //     data.append('user_id', 0);
    var var2 = 0;
    if (var1 == 1) {
      var2 = 1;
    }
    apifuntion
      // .getApi(url, 1)
      // .getApi(url, 0)
      .getApi(url, var2)
      // .postApi(url, data)
      .then((obj) => {
        consolepro.consolelog('obj', obj);
        if (obj.success == 'true') {
          let earning_arr = obj.earning_arr;

          setTimeout(() => {
            this.setState({
              arr: earning_arr,
              refresh: false
            });
          }, 300);

        } else {
          if (obj.account_active_status == 0) {
            config.checkUserDeactivate(this.props.navigation);
            return false;
          }
          msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
          return false;
        }
      }).catch((error) => {
        msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
      })
  };

  _onRefresh = () => {
    this.setState({ refresh: true })
    this.get_driver_side_earning(1);
  }

  render() {
    return (
      <View
        style={{ flex: 1, backgroundColor: Colors.white1 }}>
        <SafeAreaView style={{ flex: 0, backgroundColor: Colors.white1 }} />
        {/* <StatusBar
          hidden={false}
          backgroundColor={Colors.Red1}
          translucent={false}
          networkActivityIndicatorVisible={true}
          barStyle='light-content'
        /> */}
        {/* Header-------------------------------------- */}
        <View style={{
          paddingLeft: mobileW * 0.02, flexDirection: 'row', justifyContent: 'flex-start',
          width: mobileW * 100 / 100, alignItems: 'center', backgroundColor: Colors.theamColor
        }}>
          <View style={{ width: mobileW * 12 / 100 }} >
            {/* onPress={() => this.props.navigation.goBack('')} > */}
            {/* <Image style={{ height: mobileW * 6.5 / 100, width: mobileW * 6.5 / 100, resizeMode: 'contain' }} 
            source={localimag.BackW} /> */}
          </View>
          <View style={{ width: mobileW * 76 / 100, paddingVertical: mobileW * 3 / 100, alignItems: 'center', alignSelf: 'center' }}>
            <Text style={{
              fontSize: mobileW * 5 / 100, color: Colors.white_color,
              fontFamily: Font.OutfitMedium
            }}>{Lang_chg.My_Earnings[config.language]}</Text>
          </View>
          <View style={{ width: mobileW * 12 / 100 }}>
          </View>
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



          <View style={{
            height: mobileH * 22 / 100, width: mobileW, alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Text style={{
              fontSize: mobileH * 4 / 100, color: Colors.theamColor, textAlign: 'center',
              fontFamily: Font.OutfitMedium
            }}>
              {Lang_chg.My_Earnings[config.language]}
            </Text>
            <Text style={{
              fontSize: mobileW * 3.8 / 100, color: Colors.light_grey, textAlign: 'center',
              fontFamily: Font.Fontregular, paddingTop: mobileH * 1.5 / 100
            }}>Wallet Available Balance</Text>
          </View>

          {this.state.arr != 'NA' ?
            <View style={{
              width: '100%',
              backgroundColor: '#F7F7F7',
              elevation: 2,
              shadowOffset: { width: 0, },
              shadowColor: '#000',
              shadowOpacity: 0.1,
              borderTopLeftRadius: mobileW * 6 / 100,
              borderTopRightRadius: mobileW * 6 / 100, alignItems: 'center', borderWidth: 1,
              justifyContent: 'center', marginTop: mobileW * 2 / 100, paddingVertical: mobileW * 2 / 100,
              borderColor: '#C2C2C2', flex: 1,
            }}>
              <KeyboardAwareScrollView activeOpacity={1} showsVerticalScrollIndicator={false} >
                <FlatList
                  data={this.state.arr}
                  contentContainerStyle={{ paddingBottom: mobileW * 22 / 100 }}
                  keyExtractor={(index) => { index.toString() }}
                  renderItem={({ item, index }) =>
                    <View style={{
                      width: mobileW * 92 / 100, alignSelf: 'center', marginTop: mobileW * 0.02,
                      backgroundColor: Colors.white1, paddingVertical: mobileH * 1 / 100,
                      paddingHorizontal: mobileH * 1 / 100, flexDirection: 'row',
                      borderRadius: mobileH * 2 / 100
                    }}>
                      <View style={{ backgroundColor: 'white', width: mobileW * 70 / 100 }}>

                        <Text style={{
                          fontSize: mobileH * 2.3 / 100,
                          fontFamily: Font.OutfitMedium, color: Colors.black, marginLeft: mobileW * 10 / 100,

                          paddingTop: mobileH * 1 / 100
                        }}>
                          #{item.order_no}</Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                          <Image source={index % 2 == 0 ? localimag.arg : localimag.ared} resizeMode='contain' style={{
                            height: mobileH * 5 / 100
                            , width: mobileW * 5 / 100,
                            marginHorizontal: mobileW * 1 / 100
                          }} />
                          <Text style={{
                            fontSize: mobileH * 2.1 / 100,
                            fontFamily: Font.OutfitMedium, color: '#ABABAB', marginLeft: mobileW * 3 / 100
                          }}>{item.createtime}</Text>
                        </View>
                      </View>
                      <View style={{ backgroundColor: '', width: mobileW * 20 / 100, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{
                          fontSize: mobileH * 2.3 / 100,
                          fontFamily: Font.OutfitMedium, color: Colors.violet,
                        }}>{item.driver_earning}</Text>
                      </View>
                    </View>
                  } />
              </KeyboardAwareScrollView>
            </View> : <Nodata_foundimage />
          }
        </ScrollView>

        <Driver_Footer
          activepage='My_Earnings'
          usertype={1}
          footerpage={[
            { name: 'Driver_Home', fname: 'Home', countshow: false, image: (localimag.Homeinactive), activeimage: (localimag.Homeactive) },
            { name: 'Driver_Orders', fname: 'Orders', countshow: false, image: (localimag.Orderinactive), activeimage: (localimag.Orderactive) },
            { name: 'Inbox', fname: 'Chat', countshow: count_inbox, image: (localimag.chat_gray), activeimage: (localimag.Chatactive) }, { name: 'My_Earnings', fname: 'My Earnings', countshow: false, image: (localimag.Dollerinactive), activeimage: (localimag.Dolleractive) },
            { name: 'Driver_Profile', fname: 'Profile', countshow: false, image: (localimag.Profinactive), activeimage: (localimag.Profactive) },

          ]}
          navigation={this.props.navigation}
          imagestyle1={{
            width: 26, height: 26, backgroundColor: '#01faff', countcolor: 'red',
            countbackground: 'red', backgroundColor: 'white'
          }}
        />
      </View>
    )
  }
}