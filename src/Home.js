import {
  RefreshControl,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  ImageBackground,
  TextInput,
  StyleSheet,
  FlatList,
  Keyboard,
  BackHandler,
  Alert,
} from 'react-native';
import React, {Component} from 'react';
import {
  config,
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
  firebaseprovider,
  pushnotification,
} from './Provider/utilslib/Utils';
import Footer from './Provider/Footer';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import OneSignal from 'react-native-onesignal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { get, ref, update, set } from 'firebase/database';
import { db } from './ChatProvider/Config1';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: 'NA',
      user_type: 'NA',
      user_name: 'NA',
      user_email: 'NA',
      dining_arr: 'NA',
      dining_facilities: 'NA',
      refresh: false,
      notification_count: 0,
      university_name: 'NA',
    };

    pushnotification.redirectfun(this.props.navigation);

    this._didFocusSubscription = props.navigation.addListener(
      'focus',
      payload =>
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress),
    );
  }

  componentDidMount() {
    this._willBlurSubscription = this.props.navigation.addListener(
      'blur',
      payload =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          this.handleBackPress,
        ),
    );

    this.props.navigation.addListener('focus', () => {
      // firebaseprovider.firebaseUserGetInboxCount();
      //console.log("count_inbox Home--->", count_inbox);
      this.getUserDetail();
    });

    this.saveUserDeviceToken();
  }

  handleBackPress = () => {
    Alert.alert('Hold on!', 'Are you sure you want to exit app?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {text: 'YES', onPress: () => BackHandler.exitApp()},
    ]);
    return true;
  };

  getUserDetail = async () => {
    let userdata = await localStorage.getItemObject('user_arr');
    consolepro.consolelog('userdata', userdata);

    this.setState({
      user_id: userdata.user_id,
      user_type: userdata.user_type,
      user_name: userdata.name,
      user_email: userdata.email,
      university_name: userdata.university_name,
    });
    consolepro.consolelog(this.state.user_id);
    this.get_home_dining();
  };

  get_home_dining = async () => {
    let url =
      config.baseURL + 'get_home_dining.php?user_id=' + this.state.user_id;
    consolepro.consolelog('url', url);

    apifuntion
      .getApi(url, 1)
      .then(obj => {
        consolepro.consolelog(obj);
        if (obj.success == 'true') {
          let dining_arr = obj.dining_arr;
          let diningFacility_arr = obj.diningFacility_arr;
          let notification_count = obj.notification_count;
          setTimeout(() => {
            this.setState({
              dining_arr: dining_arr,
              dining_facilities: diningFacility_arr,
              notification_count: notification_count,
              refresh: false,
            });
          }, 300);
        } else {
          if (obj.account_active_status == 0) {
            consolepro.consolelog(
              'account_active_status',
              obj.account_active_status,
            );
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
        console.log('error', error);
      });
  };
  get_dining_facilities_home = async () => {
    let url =
      config.baseURL +
      'get_dining_facilities_home.php?user_id=' +
      this.state.user_id;
    consolepro.consolelog('url', url);
    apifuntion
      .getApi(url, 1)
      .then(obj => {
        consolepro.consolelog(obj);
        if (obj.success == 'true') {
          let dining_facilities = obj.diningFacility_arr;
          setTimeout(() => {
            this.setState({
              dining_facilities: dining_facilities,
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
        console.log('error', error);
      });
  };

  _onRefresh = () => {
    this.setState({refresh: true});
    this.get_home_dining(1);
  };

  async saveUserDeviceToken() {
    try {
      let deviceState = await OneSignal.getDeviceState();
      let token = deviceState?.userId;

      let userdata = await localStorage.getItemObject('user_arr');

      const userRef = ref(db, `token/u_${userdata?.user_id}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        await update(userRef, {token});
      } else {
        await set(userRef, {token});
      }
    } catch (error) {
      console.log('Error saving user token:', error);
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            width: (mobileW * 100) / 100,
            alignItems: 'center',
            backgroundColor: Colors.theamColor,
          }}>
          <View style={{width: (mobileW * 10) / 100}}></View>

          <View
            style={{
              width: (mobileW * 80) / 100,
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
              {Lang_chg.Home[config.language]}
            </Text>
          </View>
          <TouchableOpacity
            style={{width: (mobileW * 10) / 100}}
            onPress={() => this.props.navigation.navigate('Notification')}>
            <Image
              style={{
                height: (mobileW * 7) / 100,
                width: (mobileW * 7) / 100,
                resizeMode: 'contain',
              }}
              source={
                this.state.notification_count == 0
                  ? localimag.notification_empty
                  : localimag.notification
              }
            />
          </TouchableOpacity>
        </View>

        <KeyboardAwareScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refresh}
              onRefresh={this._onRefresh}
            />
          }
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          // contentContainerStyle={this.state.product_id_arr.length > 0 ? { width: mobileW, paddingBottom: mobileH * 7 / 100 } : { width: mobileW, }}
          style={{flex: 1}}
          keyboardShouldPersistTaps="handled">
          <View style={{flex: 1, backgroundColor: '#F7F7F7'}}>
            <TouchableOpacity
              activeOpacity={1}
              style={{flex: 1}}
              onPress={() => {
                Keyboard.dismiss();
              }}>
              <SafeAreaView
                style={{backgroundColor: Colors.theamColor, flex: 0}}
              />
              <ScrollView
                keyboardDismissMode="interactive"
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}>
                <TouchableOpacity
                  style={{flex: 1, paddingBottom: (mobileW * 20) / 100}}
                  activeOpacity={1}>
                  <ImageBackground
                    source={localimag.home}
                    resizeMode="cover"
                    style={{
                      width: '100%',
                      height: (mobileH * 28) / 100,
                      alignSelf: 'center',
                    }}
                    imageStyle={{
                      borderBottomLeftRadius: 12,
                      borderBottomRightRadius: 12,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '93%',
                        alignSelf: 'center',
                        marginTop: (mobileW * 4) / 100,
                      }}>
                      <Text
                        style={{
                          width: '60%',
                          color: Colors.white_color,
                          fontSize: (mobileW * 5.3) / 100,
                          fontFamily: Font.Bold,
                        }}>
                        {this.state.university_name != 'NA'
                          ? this.state.university_name
                          : ''}
                      </Text>

                      <View style={{width: '40%'}}>
                        <Image
                          style={{
                            height: (mobileW * 25) / 100,
                            width: (mobileW * 25) / 100,
                            resizeMode: 'contain',
                            marginLeft: (mobileW * 5) / 100,
                          }}
                          source={localimag.newwhitelogo_white}
                        />
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('Dininghall', {
                          order_type: 2,
                        })
                      }
                      style={styles.textInputHeader}>
                      <Image
                        style={{
                          height: (mobileW * 5) / 100,
                          width: (mobileW * 5) / 100,
                          resizeMode: 'contain',
                          alignSelf: 'center',
                          justifyContent: 'center',
                          marginLeft: mobileW * 0.03,
                        }}
                        source={localimag.search}></Image>
                      <Text style={styles.textInputView}>
                        {Lang_chg.Homesearch[config.language]}
                      </Text>
                    </TouchableOpacity>
                  </ImageBackground>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignSelf: 'center',
                      width: (mobileW * 91) / 100,
                      alignItems: 'center',
                      marginTop: (mobileW * 9) / 100,
                    }}>
                    <Text
                      style={{
                        fontFamily: Font.OutfitMedium,
                        fontSize: (mobileW * 4.5) / 100,
                        color: Colors.neavyblue,
                      }}>
                      {Lang_chg.Dininghall[config.language]}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('Dininghall', {
                          order_type: 0,
                        })
                      }
                      style={{
                        padding: (mobileW * 2) / 100,
                        width: (mobileW * 25) / 100,
                        alignItems: 'flex-end',
                      }}>
                      <Text
                        style={{
                          fontSize: (mobileW * 4.5) / 100,
                          color: Colors.violet,
                          fontFamily: Font.OutfitMedium,
                        }}>
                        {Lang_chg.View[config.language]}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      marginLeft: (mobileW * 2.5) / 100,
                      height: (mobileW * 60) / 100,
                    }}>
                    {this.state.dining_arr != 'NA' && (
                      <FlatList
                        data={this.state.dining_arr}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({item, index}) => {
                          return (
                            <View
                              style={{
                                alignSelf: 'center',
                                paddingHorizontal: (mobileH * 1) / 100,
                              }}>
                              <TouchableOpacity
                                activeOpacity={1}
                                onPress={() =>
                                  this.props.navigation.navigate('Details', {
                                    dining_halls_id: item.dining_halls_id,
                                    user_id: this.state.user_id,
                                  })
                                }
                                style={styles.inboxText}>
                                <View
                                  style={{
                                    shadowColor: Colors.shadow_color,
                                    shadowOffset: {width: 2, height: 2},
                                    shadowOpacity: 0.2,
                                    elevation: 2,
                                    backgroundColor: Colors.white_color,
                                    borderRadius: 4.9,
                                  }}>
                                  <ImageBackground
                                    style={{
                                      height: (mobileW * 33) / 100,
                                      width: (mobileW * 42) / 100,
                                      resizeMode: 'cover',
                                      alignSelf: 'center',
                                    }}
                                    imageStyle={{
                                      height: (mobileW * 33) / 100,
                                      width: (mobileW * 42) / 100,
                                      resizeMode: 'cover',
                                      borderRadius: 5,
                                    }}
                                    source={{
                                      uri: config.img_url + item.image,
                                    }}></ImageBackground>

                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      justifyContent: 'space-between',
                                      marginTop: mobileH * 0.01,
                                      marginLeft: mobileW * 0.02,
                                    }}>
                                    <Text
                                      style={{
                                        fontSize: (mobileW * 3.5) / 100,
                                        color: Colors.mediumgrey,
                                        textAlign: 'center',
                                        fontFamily: Font.Fontregular,
                                      }}>
                                      {item.name}
                                    </Text>
                                  </View>

                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      marginLeft: mobileW * 0.02,
                                      alignSelf: 'flex-start',
                                      justifyContent: 'center',
                                      paddingVertical: (mobileW * 0.6) / 100,
                                    }}>
                                    <Image
                                      style={{
                                        height: (mobileW * 3.8) / 100,
                                        width: (mobileW * 3.8) / 100,
                                        resizeMode: 'contain',
                                      }}
                                      source={localimag.breakfastimg}
                                    />

                                    <Text
                                      numberOfLines={1}
                                      style={{
                                        width: '90%',
                                        fontSize: (mobileW * 2.8) / 100,
                                        color: Colors.dinnigfacili,
                                        fontFamily: Font.Fontregular,
                                        marginTop: (mobileW * 0.4) / 100,
                                        marginLeft: (mobileW * 1) / 100,
                                      }}>
                                      {item.category_name}
                                    </Text>
                                  </View>
                                  {item.status == 1 && (
                                    <Text
                                      style={{
                                        fontSize: (mobileW * 3.5) / 100,
                                        color: Colors.opengreen,
                                        marginLeft: mobileW * 0.02,
                                        paddingVertical: 2,
                                        fontFamily: Font.OutfitMedium,
                                        paddingBottom: (mobileW * 2) / 100,
                                      }}>
                                      {Lang_chg.opened_txt[config.language]}
                                    </Text>
                                  )}
                                  {item.status == 0 && (
                                    <Text
                                      style={{
                                        fontSize: (mobileW * 3.5) / 100,
                                        color: Colors.red,
                                        marginLeft: mobileW * 0.02,
                                        paddingVertical: 2,
                                        fontFamily: Font.OutfitMedium,
                                        paddingBottom: (mobileW * 2) / 100,
                                      }}>
                                      {Lang_chg.closed_txt[config.language]}
                                    </Text>
                                  )}
                                </View>
                              </TouchableOpacity>
                            </View>
                          );
                        }}
                      />
                    )}
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignSelf: 'center',
                      width: (mobileW * 91) / 100,
                      alignItems: 'center',
                      marginTop: (mobileW * 3) / 100,
                    }}>
                    <Text
                      style={{
                        fontFamily: Font.OutfitMedium,
                        fontSize: (mobileW * 4.5) / 100,
                        color: Colors.neavyblue,
                      }}>
                      {Lang_chg.Diningfacility[config.language]}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('Dininghall', {
                          order_type: 1,
                        })
                      }
                      style={{
                        padding: (mobileW * 2) / 100,
                        width: (mobileW * 25) / 100,
                        alignItems: 'flex-end',
                      }}>
                      <Text
                        style={{
                          fontSize: (mobileW * 4.5) / 100,
                          color: Colors.violet,
                          fontFamily: Font.OutfitMedium,
                        }}>
                        {Lang_chg.View[config.language]}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      marginLeft: (mobileW * 2.5) / 100,
                      height: (mobileW * 60) / 100,
                    }}>
                    {this.state.dining_facilities != 'NA' && (
                      <FlatList
                        data={this.state.dining_facilities}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({item, index}) => {
                          return (
                            <View>
                              <View
                                style={{
                                  marginTop: (mobileW * 1) / 100,
                                  alignSelf: 'center',
                                  paddingHorizontal: (mobileH * 1) / 100,
                                }}>
                                <TouchableOpacity
                                  activeOpacity={1}
                                  onPress={() =>
                                    this.props.navigation.navigate(
                                      'Details_One',
                                      {
                                        dining_facility_id:
                                          item.dining_facility_id,
                                        user_id: this.state.user_id,
                                      },
                                    )
                                  }
                                  style={styles.inboxText}>
                                  <View
                                    style={{
                                      shadowColor: Colors.shadow_color,
                                      shadowOffset: {width: 2, height: 2},
                                      shadowOpacity: 0.2,
                                      elevation: 2,
                                      backgroundColor: Colors.white_color,
                                      borderRadius: 4.9,
                                    }}>
                                    <ImageBackground
                                      style={{
                                        height: (mobileW * 33) / 100,
                                        width: (mobileW * 42) / 100,
                                        resizeMode: 'cover',
                                        alignSelf: 'center',
                                      }}
                                      imageStyle={{
                                        height: (mobileW * 33) / 100,
                                        width: (mobileW * 42) / 100,
                                        resizeMode: 'cover',
                                        borderRadius: 5,
                                      }}
                                      source={{
                                        uri: config.img_url + item.image,
                                      }}></ImageBackground>

                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        marginTop: mobileH * 0.01,
                                        marginLeft: mobileW * 0.02,
                                      }}>
                                      <Text
                                        style={{
                                          fontSize: (mobileW * 3.5) / 100,
                                          color: Colors.mediumgrey,
                                          textAlign: 'center',
                                          fontFamily: Font.Fontregular,
                                        }}>
                                        {item.name}
                                      </Text>
                                    </View>

                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginLeft: mobileW * 0.02,
                                        alignSelf: 'flex-start',
                                        justifyContent: 'center',
                                        paddingVertical: (mobileW * 0.6) / 100,
                                      }}>
                                      <Image
                                        style={{
                                          height: (mobileW * 3.8) / 100,
                                          width: (mobileW * 3.8) / 100,
                                          resizeMode: 'contain',
                                        }}
                                        source={localimag.breakfastimg}
                                      />

                                      <Text
                                        numberOfLines={1}
                                        style={{
                                          width: '90%',
                                          fontSize: (mobileW * 2.8) / 100,
                                          color: Colors.dinnigfacili,
                                          marginTop: (mobileW * 0.4) / 100,
                                          marginLeft: (mobileW * 1) / 100,
                                          fontFamily: Font.Fontregular,
                                        }}>
                                        {item.category_name}
                                      </Text>
                                    </View>

                                    {item.status == 1 && (
                                      <Text
                                        style={{
                                          fontSize: (mobileW * 3.5) / 100,
                                          color: Colors.opengreen,
                                          marginLeft: mobileW * 0.02,
                                          paddingVertical: 2,
                                          fontFamily: Font.OutfitMedium,
                                          paddingBottom: (mobileW * 2) / 100,
                                        }}>
                                        {Lang_chg.opened_txt[config.language]}
                                      </Text>
                                    )}
                                    {item.status == 0 && (
                                      <Text
                                        style={{
                                          fontSize: (mobileW * 3.5) / 100,
                                          color: Colors.red,
                                          marginLeft: mobileW * 0.02,
                                          paddingVertical: 2,
                                          fontFamily: Font.OutfitMedium,
                                          paddingBottom: (mobileW * 2) / 100,
                                        }}>
                                        {Lang_chg.closed_txt[config.language]}
                                      </Text>
                                    )}
                                  </View>
                                </TouchableOpacity>
                              </View>
                            </View>
                          );
                        }}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              </ScrollView>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
        <Footer
          activepage="Home"
          usertype={1}
          footerpage={[
            {
              name: 'Home',
              fname: 'Home',
              countshow: false,
              image: localimag.homeinactive,
              activeimage: localimag.homeactive,
            },
            {
              name: 'Inbox',
              fname: 'Inbox',
              countshow: count_inbox,
              image: localimag.notifyinactive,
              activeimage: localimag.notifyactive,
            },
            {
              name: 'Orderhistory',
              countshow: false,
              image: localimag.calenderinactive,
              activeimage: localimag.calenderactive,
            },
            {
              name: 'Setting',
              fname: 'Setting',
              countshow: false,
              image: localimag.settinginactive,
              activeimage: localimag.settingactive,
            },
            {
              name: 'Profile',
              fname: 'Profile',
              countshow: false,
              image: localimag.userinactive,
              activeimage: localimag.useractive,
            },
          ]}
          navigation={this.props.navigation}
          imagestyle1={{
            width: 26,
            height: 26,
            backgroundColor: '#01faff',
            countcolor: '#FFFFFF',
            countbackground: 'red',
          }}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  textInputView: {
    width: '87%',
    justifyContent: 'center',
    paddingLeft: (mobileW * 0.9) / 100,
    alignSelf: 'center',
    fontFamily: Font.OutfitMedium,
    paddingVertical: (mobileW * 1) / 100,
    color: Colors.light_grey,
    fontSize: (mobileW * 3.8) / 100,
    // marginTop: mobileW * 1 / 100
  },
  textInputHeader: {
    flexDirection: 'row',
    width: (mobileW * 90) / 100,
    borderRadius: (mobileW * 5) / 100,
    backgroundColor: Colors.white_color,
    paddingVertical: (mobileW * 2) / 100,
    shadowColor: Colors.shadow_color,
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.2,
    elevation: 2,
    alignSelf: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: -20,
  },
  inboxText: {
    width: (mobileW * 42) / 100,
    borderRadius: 5,
    // marginTop: mobileH * 0.04,
    alignSelf: 'center',
    justifyContent: 'center',
    // paddingVertical: mobileW * 1 / 100,
  },
});
