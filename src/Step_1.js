import {
  BackHandler,
  Alert,
  Keyboard,
  Text,
  View,
  Image,
  TextInput,
  Dimensions,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import React, {Component} from 'react';
const MobileW = Dimensions.get('window').width;
const MobileH = Dimensions.get('window').height;
import {
  config,
  Common_Button,
  msgProvider,
  localStorage,
  apifuntion,
  msgText,
  msgTitle,
  consolepro,
  Lang_chg,
  Font,
  Colors,
  mobileH,
  mobileW,
  localimag,
} from './Provider/utilslib/Utils';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Mapprovider from './Provider/Mapprovider';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Step_1 extends Component {
  _didFocusSubscription;
  _willBlurSubscription;

  constructor(props) {
    super(props);
    this.state = {
      show: true,
      password_show: true,
      mod: false,
      sel_university_id: '',
      university_arr: 'NA',
      university_arr1: 'NA',
      sel_university_name: '',
      rateappurl: '',
    };
    this._didFocusSubscription = props.navigation.addListener(
      'focus',
      payload =>
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress),
    );
  }

  componentDidMount() {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('focus', () => {
      this.getContent();
    });
    this.getContent();
    this._willBlurSubscription = this.props.navigation.addListener(
      'blur',
      payload =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          this.handleBackPress,
        ),
    );
  }

  get_university = async () => {
    let url = config.baseURL + 'get_university_list.php';
    consolepro.consolelog('url', url);
    var data = new FormData();
    data.append('user_id', 0);
    apifuntion
      .getApi(url, 0)
      .then(obj => {
        consolepro.consolelog('obj', obj);
        if (obj.success == 'true') {
          let university_arr = obj.university_arr;
          setTimeout(() => {
            this.setState({
              university_arr: university_arr,
              university_arr1: university_arr,
              mod: true,
            });
          }, 300);
        } else {
          if (obj.account_active_status == 0) {
            config.checkUserDeactivate(this.props.navigation);
            return false;
          }
          msgProvider.alert(
            msgTitle.information[config.language],
            obj.msg[config.language],
            false,
          );
          return false;
        }
      })
      .catch(error => {
        msgProvider.alert(
          msgTitle.internet[config.language],
          msgText.networkconnection[config.language],
          false,
        );
      });
  };

  //-------------- function for get content arr--------------//
  getContent = async () => {
    let url = config.baseURL + 'get_all_content.php?user_id=0';
    // consolepro.consolelog('url', url)
    apifuntion
      .getApi(url, 1)
      .then(obj => {
        // consolepro.consolelog(obj)
        if (obj.success == 'true') {
          var rateappurl = '';
          content_arr = obj.content_arr;

          if (config.device_type == 'ios') {
            rateappurl = obj.content_arr[5].content;
          }
          if (config.device_type == 'android') {
            rateappurl = obj.content_arr[4].content;
          }
          this.setState({rateappurl: rateappurl});
        } else {
          msgProvider.alert(
            msgTitle.information[config.language],
            obj.msg[config.language],
            false,
          );
          return false;
        }
      })
      .catch(error => {
        msgProvider.alert(
          msgTitle.internet[config.language],
          msgText.networkconnection[config.language],
          false,
        );
      });
  };

  _searchProduct = textToSearch => {
    let data1 = this.state.university_arr1;
    if (data1 != 'NA') {
      consolepro.consolelog('data1', data1);
      if (data1 != 'NA') {
        var text_data = textToSearch.toString().toLowerCase();
        let newData = data1.filter(function (item) {
          return (
            item.university_name.toString().toLowerCase().indexOf(text_data) >=
            0
          );
        });

        if (newData.length > 0) {
          this.setState({university_arr: newData});
        } else if (newData.length <= 0) {
          this.setState({university_arr: 'NA'});
        }
      }
    }
  };

  //---------back handler funtion-------------//

  handleBackPress = () => {
    Alert.alert('Hold on!', 'Do you really want to exit app?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {text: 'YES', onPress: () => BackHandler.exitApp()},
    ]);
    return true;
  };

  signUpStep2() {
    if (this.state.sel_university_id == '') {
      msgProvider.toast(
        msgText.PleaseSelectUniversity[config.language],
        'center',
      );
      return true;
    }

    this.setState({sel_university_name: '', sel_university_id: ''});
    this.props.navigation.navigate('Step_2', {
      sel_university_id: this.state.sel_university_id,
    });
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: Colors.theamColor}}>
        <SafeAreaView style={{flex: 0, backgroundColor: Colors.theamColor}} />

        {/* University list modal  */}

        {this.state.mod && (
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.mod}
            onRequestClose={() => {
              this.setState({mod: false});
            }}>
            <View style={{flex: 1, backgroundColor: '#F7F7F7'}}>
              {/* <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theamColor }} /> */}

              <View
                style={{
                  paddingLeft: mobileW * 0.02,
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  width: (mobileW * 100) / 100,
                  alignItems: 'center',
                  backgroundColor: Colors.theamColor,
                }}>
                <TouchableOpacity
                  ableOpacity
                  style={{width: (mobileW * 12) / 100}}
                  onPress={() => {
                    this.setState({mod: false});
                  }}>
                  {localimag.BackW && (
                    <Image
                      style={{
                        height: (mobileW * 6.5) / 100,
                        width: (mobileW * 6.5) / 100,
                        resizeMode: 'contain',
                      }}
                      source={localimag.BackW}
                    />
                  )}
                </TouchableOpacity>

                <View
                  style={{
                    width: (mobileW * 78) / 100,
                    paddingVertical: (mobileW * 3) / 100,
                    alignItems: 'center',
                    alignSelf: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: (mobileW * 5) / 100,
                      color: Colors.white_color,
                      fontFamily: Font.OutfitMedium,
                    }}>
                    {Lang_chg.Find_txt[config.language]}
                  </Text>
                </View>
                <View style={{width: (mobileW * 10) / 100}}></View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  width: (mobileW * 100) / 100,
                  borderRadius: (mobileW * 1) / 100,
                  backgroundColor: '#FDFDFD',
                  paddingVertical: (mobileW * 1) / 100,
                  shadowColor: Colors.shadow_color,
                  shadowOffset: {width: 2, height: 2},
                  shadowOpacity: 0.2,
                  elevation: 1,
                  alignSelf: 'center',
                }}>
                {localimag.searchg && (
                  <Image
                    style={{
                      height: (mobileW * 4.8) / 100,
                      width: (mobileW * 4.8) / 100,
                      resizeMode: 'contain',
                      alignSelf: 'center',
                      justifyContent: 'center',
                      marginLeft: (mobileW * 2) / 100,
                    }}
                    source={localimag.searchg}></Image>
                )}
                <TextInput
                  style={{
                    width: '88%',
                    justifyContent: 'center',
                    paddingLeft: (mobileW * 1) / 100,
                    alignSelf: 'center',
                    fontFamily: Font.fontregular,
                    paddingVertical: (mobileW * 2) / 100,
                    color: Colors.light_grey,
                    fontSize: (mobileW * 4.7) / 100,
                  }}
                  onChangeText={txt => this._searchProduct(txt)}
                  maxLength={53}
                  selectionColor={Colors.textInputSelectionColor}
                  returnKeyLabel="done"
                  returnKeyType="done"
                  secureTextEntry={this.state.eyeshow}
                  onSubmitEditing={() => {
                    Keyboard.dismiss();
                  }}
                  placeholderTextColor={Colors.light_grey}
                  placeholder={'Search'}
                />
              </View>

              {this.state.university_arr != 'NA' ? (
                <FlatList
                  data={this.state.university_arr}
                  scrollIndicatorInsets={false}
                  // keyExtractor={(i,index) => { index.toString() }}
                  renderItem={({item, index}) => {
                    return (
                      <TouchableOpacity
                        key={item.university_id || index}
                        onPress={() => {
                          this.setState({
                            mod: false,
                            sel_university_id: item.university_id,
                            sel_university_name: item.university_name,
                          });
                          let uservalue = {
                            sel_university_id: this.state.sel_university_id,
                          };
                          localStorage.setItemObject('user_data', uservalue);
                        }}
                        style={{
                          flexDirection: 'row',
                          width: '100%',
                          alignSelf: 'center',
                          borderBottomColor: Colors.light_grey,
                          borderBottomWidth: 1,
                          height: (mobileH * 6.5) / 100,
                          alignItems: 'center',
                          paddingLeft: (mobileW * 2) / 100,
                        }}>
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          {item.university_image && (
                            <Image
                              source={{
                                uri: config.img_url + item.university_image,
                              }}
                              resizeMode="contain"
                              style={{
                                height: (mobileW * 5.5) / 100,
                                width: (mobileW * 5.5) / 100,
                                alignSelf: 'center',
                                padding: 10,
                              }}></Image>
                          )}
                        </View>
                        <View
                          style={{
                            width: mobileW * 0.87,
                            marginHorizontal: (mobileW * 3.5) / 100,
                          }}>
                          <Text
                            style={{
                              fontSize: (mobileW * 4.3) / 100,
                              fontFamily: Font.OutfitMedium,
                              color: Colors.black,
                            }}>
                            {item.university_name}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                />
              ) : (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    height: (mobileH * 50) / 100,
                    width: mobileW,
                  }}>
                  {localimag.no_data_img && (
                    <Image
                      resizeMode="contain"
                      style={{width: mobileW, height: mobileW}}
                      source={localimag.no_data_img}></Image>
                  )}
                </View>
              )}
            </View>
          </Modal>
        )}
        {/* University list modal END /// */}

        {!this.state.mod && (
          <ScrollView
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}>
            <TouchableOpacity
              style={{flex: 1}}
              activeOpacity={1}></TouchableOpacity>

            <View
              style={{
                width: '86%',
                alignSelf: 'center',
                marginTop: mobileW * 0.09,
              }}>
              {localimag.University1 && (
                <Image
                  source={localimag.University1}
                  resizeMode="contain"
                  style={{
                    height: (mobileH * 30) / 100,
                    width: (mobileW * 30) / 100,
                    alignSelf: 'center',
                  }}></Image>
              )}
              <Text
                style={{
                  fontSize: mobileW * 0.04,
                  fontFamily: Font.Bold,
                  color: Colors.white1,
                  marginTop: mobileW * 0.02,
                }}>
                {Lang_chg.Step_txt[config.language]}
              </Text>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  this.get_university();
                }}
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: mobileW * 0.06,
                  alignItems: 'center',
                  borderBottomColor: Colors.white1,
                  borderBottomWidth: 1,
                  paddingVertical: (mobileW * 2.5) / 100,
                }}>
                <Text
                  style={{
                    width: '90%',
                    fontSize: mobileW * 0.04,
                    fontFamily: Font.Bold,
                    color: Colors.white1,
                  }}>
                  {this.state.sel_university_name == ''
                    ? Lang_chg.Find_txt[config.language]
                    : this.state.sel_university_name}
                </Text>
                {localimag.BlackS && (
                  <Image
                    source={localimag.BlackS}
                    resizeMode="contain"
                    style={{
                      height: (mobileW * 3) / 100,
                      width: (mobileW * 3) / 100,
                      alignSelf: 'center',
                    }}></Image>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  width: '100%',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  marginTop: (mobileW * 2.5) / 100,
                }}>
                <View
                  style={{flexDirection: 'row', width: (mobileW * 80) / 100}}>
                  <Text
                    style={{
                      fontFamily: Font.Fontregular,
                      fontSize: (MobileW * 3.5) / 100,
                      color: Colors.white1,
                    }}>
                    {Lang_chg.By_txt[config.language]}
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() =>
                      this.props.navigation.navigate('ContentPage', {
                        pagename: Lang_chg.termsOfService[config.language],
                        contentpage: 2,
                        user_type: 1,
                      })
                    }
                    style={{alignContent: 'center'}}>
                    <Text
                      style={{
                        textDecorationLine: 'underline',
                        fontFamily: Font.Fontregular,
                        fontSize: (MobileW * 3.5) / 100,
                        color: Colors.white1,
                        marginLeft: (mobileW * 1) / 100,
                      }}>
                      {Lang_chg.termsOfService[config.language]}
                    </Text>
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontFamily: Font.Fontregular,
                      fontSize: (MobileW * 3.5) / 100,
                      color: Colors.white1,
                      marginLeft: (mobileW * 1) / 100,
                    }}>
                    and
                  </Text>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() =>
                      this.props.navigation.navigate('ContentPage', {
                        pagename: Lang_chg.txt_privacy_policy[config.language],
                        contentpage: 1,
                        user_type: 1,
                      })
                    }>
                    <Text
                      style={{
                        textDecorationLine: 'underline',
                        fontFamily: Font.Fontregular,
                        fontSize: (MobileW * 3.5) / 100,
                        color: Colors.white1,
                      }}>
                      {Lang_chg.Privacy_txt[config.language]}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>

              <View style={{marginTop: mobileW * 0.08}}>
                <Common_Button
                  name={Lang_chg.Step_1_B[config.language]}
                  onButtonClick={() => {
                    this.signUpStep2();
                  }}
                />
              </View>
              <View
                style={{
                  width: '100%',
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: mobileW * 0.45,
                  paddingBottom: (mobileW * 15) / 100,
                }}>
                <Text
                  onPress={() => {
                    this.setState({
                      sel_university_name: '',
                      sel_university_id: '',
                    });
                    this.props.navigation.navigate('Login');
                  }}
                  style={{
                    fontSize: (mobileW * 4) / 100,
                    fontFamily: Font.Semibold,
                    color: Colors.white1,
                  }}>
                  {Lang_chg.alreadyou[config.language]}
                  <Text
                    style={{
                      fontFamily: Font.Semibold,
                      textDecorationLine: 'underline',
                    }}>
                    {' '}
                    Login
                  </Text>
                </Text>
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    );
  }
}
