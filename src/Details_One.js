import {
  Text, View, ImageBackground, Image, TextInput, SafeAreaView, StatusBar, TouchableOpacity, Modal, FlatList, StyleSheet
} from 'react-native';
import React, { Component } from 'react';
import { config, Common_Button, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag } from './Provider/utilslib/Utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Nodata_foundimage } from './Provider/Nodata_foundimage';

export default class Details_One extends Component {

  constructor(props) {
    super(props)
    this.state = {
      eyeshow: false,
      recent_arr: 'NA',
      dining_facility_id: this.props.route.params.dining_facility_id,
      user_id: this.props.route.params.user_id,
      dining_facility_arr: 'NA',
      // current lat long
      latitude: config.latitude,
      longitude: config.longitude,
      address: 'NA',
    }
  }

  onclick1 = (item) => {
    //console.log('item', item)
    if (item.id == 1) {
      this.props.navigation.navigate('Details_Restaurants')
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

    this.get_dining_facilities_details();
  };

  get_dining_facilities_details = async () => {
    let url = config.baseURL + 'get_dining_facilities_details.php?user_id=' + this.state.user_id + '&dining_facility_id=' + this.state.dining_facility_id;
    consolepro.consolelog('url', url);
    apifuntion.getApi(url, 0).then((obj) => {
      consolepro.consolelog(obj);
      if (obj.success == 'true') {
        setTimeout(() => {
          this.setState({
            dining_facility_arr: obj.dining_facility_arr,
          });
        }, 200);
      } else {
        msgProvider.toast(obj.message, 'center');
        return false;
      }
    })
      .catch((error) => {
        console.log('error', error);
      });
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
    // this.getAllProduct(1);
    this.get_all_dining(1);
  }






  render() {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.white1, }}>
        <SafeAreaView style={{ flex: 0, backgroundColor: Colors.white1 }} />


        <View style={{
          width: mobileW * 100 / 100, alignItems: 'center', backgroundColor: Colors.theamColor,
          }} >
          <View style={{ width: mobileW * 95 / 100, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center', paddingVertical: mobileW * 3 / 100 }}>
            <TouchableOpacity style={{ width: mobileW * 12 / 100 }} onPress={() => this.props.navigation.goBack()} >
              <Image style={{ height: mobileW * 6 / 100, width: mobileW * 6 / 100, resizeMode: 'contain' }} source={localimag.goback} />
            </TouchableOpacity>
            <View style={{ width: mobileW * 71 / 100, alignItems: 'center', alignSelf: 'center' }}>
              <Text style={{ fontSize: mobileW * 5 / 100, color: Colors.white_color, fontFamily: Font.OutfitMedium }}>{Lang_chg.Details_txt[config.language]}</Text>
            </View>
            <View style={{ width: mobileW * 12 / 100, alignItems: 'flex-end' }}>
            </View>
          </View>
        </View>
        <View>
        
          <ImageBackground imageStyle={{ borderBottomLeftRadius: mobileW * 3 / 100, borderBottomRightRadius: mobileW * 3 / 100, resizeMode: 'cover' }}
            style={{ alignSelf: 'center', width: mobileW * 100 / 100, height: mobileW * 65 / 100, justifyContent: 'center' }}
            source={{ uri: config.img_url + this.state.dining_facility_arr.image }}
          >
          </ImageBackground>

          <View style={{
            width: mobileW * 100 / 100, alignSelf: 'center',
            paddingVertical: mobileW * 2 / 100, backgroundColor: '#fff', borderRadius: mobileW * 1 / 100,
            }}>
            <View style={{ flexDirection: 'row', width: '94%', alignSelf: 'center', }}>
              <View style={{ width: '100%' }}>
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: mobileW * 3.9 / 100, fontFamily: Font.OutfitMedium, color: Colors.neavyblue }}>
                    {this.state.dining_facility_arr.name}

                  </Text>
                  <Text style={{ fontSize: mobileW * 3.7 / 100, color: Colors.opengreen, fontFamily: Font.Semibold }}>
                    {this.state.dining_facility_arr.status == 1 && <Text style={{ fontSize: mobileW * 3.5 / 100, color: Colors.opengreen, marginLeft: mobileW * 0.02, paddingVertical: 2, fontFamily: Font.OutfitMedium }}>{Lang_chg.Open[config.language]}</Text>}
                    {this.state.dining_facility_arr.status == 0 && <Text style={{ fontSize: mobileW * 3.5 / 100, color: Colors.red, marginLeft: mobileW * 0.02, paddingVertical: 2, fontFamily: Font.OutfitMedium }}>{Lang_chg.Close[config.language]}</Text>}

                  </Text>
                </View>
                <View style={{ width: '95%', marginTop: mobileW * 0.01, }}>
                  <Text style={{ fontSize: mobileW * 3 / 100, fontFamily: Font.Fontregular, color: Colors.detailspring }}>
                    {this.state.dining_facility_arr.description}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={{
            width: '100%',
            height: mobileH * 58 / 100,
            paddingBottom: 22,
            backgroundColor: '#F9FBFE', borderWidth: mobileW * 1 / 100, borderColor: '#F5F5F5',
            borderTopLeftRadius: mobileW * 0.04, borderTopRightRadius: mobileW * 0.04
            }}>
            <Text style={{ fontFamily: Font.Semibold, fontSize: mobileW * 4.5 / 100, marginTop: mobileW * 0.01, fontFamily: Font.OutfitMedium, color: Colors.neavyblue, width: '93%', alignSelf: 'center' }}>
              {Lang_chg.Dining_Facility[config.language]}
            </Text>


            {this.state.dining_facility_arr.dining_facility_restaurant_arr != 'NA' ?
              <FlatList
                data={this.state.dining_facility_arr.dining_facility_restaurant_arr}
                numColumns={2}
                renderItem={({ item, index }) => {
                  return (
                    <View key={index}>
                      <View style={{
                        alignItems: 'center', paddingHorizontal: mobileH * 1 / 100,
                        paddingVertical: mobileW * 2 / 100, marginLeft: mobileW * 1.2 / 100
                      }}>
                        <TouchableOpacity
                          onPress={() => { this.props.navigation.navigate('Details_Restaurants', { dining_facility_id: this.state.dining_facility_arr.dining_facility_id, restaurant_id: item.restaurant_id, user_id: this.state.user_id, }) }}
                          activeOpacity={0.7}
                          style={styles.inboxText}>


                          <View style={{
                            shadowColor: Colors.shadow_color,
                            shadowOffset: { width: 2, height: 2, },
                            shadowOpacity: 0.20,
                            elevation: 2.5, backgroundColor: '#FFFFFF', borderRadius: 4.8, paddingBottom: mobileW * 2 / 100
                          }}>
                            <ImageBackground style={{ height: mobileW * 33 / 100, width: mobileW * 44 / 100, resizeMode: 'cover', alignSelf: 'center' }}
                              imageStyle={{ height: mobileW * 33 / 100, width: mobileW * 44 / 100, resizeMode: 'cover', borderRadius: 4.8 }}
                              source={{ uri: config.img_url + item.image_get }}>
                            </ImageBackground>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: mobileH * 0.01, marginLeft: mobileW * 0.02 }}>
                              <Text numberOfLines={1}
                                style={{
                                  fontSize: mobileW * 3.5 / 100, color: Colors.mediumgrey,
                                  textAlign: 'center', fontFamily: Font.OutfitMedium
                                }}>
                                {item.name_get}
                              </Text>
                            </View>

                            {item.status == 1 && <Text style={{ fontSize: mobileW * 3.5 / 100, color: Colors.opengreen, marginLeft: mobileW * 0.02, paddingVertical: 2, fontFamily: Font.OutfitMedium }}>{Lang_chg.Open[config.language]}</Text>}
                            {item.status == 0 && <Text style={{ fontSize: mobileW * 3.5 / 100, color: Colors.red, marginLeft: mobileW * 0.02, paddingVertical: 2, fontFamily: Font.OutfitMedium }}>{Lang_chg.Close[config.language]}</Text>}
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )
                }} /> : <Nodata_foundimage />
            }
          </View>
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({

  inboxText: {
    width: mobileW * 44 / 100,
    borderRadius: 5,
    //marginTop: mobileH * 1 / 100,
    alignSelf: 'center',
    justifyContent: 'center',
    paddingVertical: mobileW * 1 / 100,
  },
})