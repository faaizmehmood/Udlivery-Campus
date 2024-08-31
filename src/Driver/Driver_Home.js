import {
  RefreshControl,
  BackHandler,
  Alert,
  Text,
  View,
  ImageBackground,
  Image,
  TextInput,
  Dimensions,
  SafeAreaView,
  FlatList,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import React, {Component, useEffect} from 'react';
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
  firebaseprovider,
  pushnotification,
  notification,
} from '../Provider/utilslib/Utils';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Driver_Footer from '../Driver/Driver_Footer';
import {Switch} from 'react-native-switch';
import OneSignal from 'react-native-onesignal';
import {get, ref, set, update} from 'firebase/database';
import {db} from '../ChatProvider/Config1';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Driver_Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      password_show: true,
      openmap: false,

      user_id: 'NA',
      driver_id: 'NA',
      order_arr: 'NA',
      notification_count: 0,

      checkStatus: false,
      verificationPending: true,
      showError: [],
      showType: 0,

      load: true,
      refresh: false,
    };

    pushnotification.redirectfun(this.props.navigation);

    this._didFocusSubscription = props.navigation.addListener(
      'focus',
      payload =>
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress),
    );
  }

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

  checkStripeVerificationHandler = async () => {
    let userdata = await localStorage.getItemObject('user_arr');
    let url = `https://udlivery.org/app/webservice/stripe_payment/get_account_status.php?user_id=${userdata.user_id}`;
    // let url = `https://udlivery.org/app/webservice/stripe_payment/get_account_status.php?user_id=593`;
    // let url = `https://udlivery.org/app/webservice/stripe_payment/get_account_status.php?account_id=acct_1OHnTnR0Y7Mpxxde`;

    const configHeaders = {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: 0,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    try {
      const response = await axios.get(url, configHeaders);
      console.log(
        'Verification coming from Verification Status:',
        response?.data,
        ' Length: ',
        response?.data?.errors?.length,
      );
      if (response?.data?.success) {
        await AsyncStorage.setItem('verificationSuccess', 'true');
        this.setState({
          checkStatus: true,
          load: false,
          verificationPending: false,
        });
      } else {
        this.setState({checkStatus: false, load: false});
        let emptyErrorList = [];
        for (let index = 0; index < response?.data?.errors.length; index++) {
          emptyErrorList.push(response?.data?.errors[index]);
        }
        this.setState({showError: emptyErrorList});

        console.log(
          'verification status===================:',
          typeof response?.data?.errors.length,
        );

        if (response?.data?.errors?.length === 0) {
          this.setState({verificationPending: true});
        } else {
          this.setState({verificationPending: false});
        }
      }
    } catch (error) {
      console.log('---------Error Coming from Driver Home Api--------', error);
    }
  };

  onclick1 = item => {
    //console.log('item', item)
    if (item.order_status == 1) {
      this.props.navigation.navigate('');
    } else if (item.order_status == 2) {
      this.props.navigation.navigate('');
    }
  };

  onGotoEditWihDrawalOptions = async () => {
    let showPayType = await localStorage.getItemString('showPaymentType');
    if (showPayType === '2') {
      this.setState({showType: 5});
    }
  };

  async componentDidMount() {
    let verificationSuccess = await AsyncStorage.getItem('verificationSuccess');
    if (verificationSuccess === 'true') {
      this.setState({checkStatus: true, verificationPending: false});
    }

    let i = setInterval(() => {
      if (!this.state.verificationPending) {
        console.log('Clearing Interval');
        clearInterval(i);
      }
      console.log('Sending AccountVerification Request');
      this.checkStripeVerificationHandler();
    }, 3000);

    this.onGotoEditWihDrawalOptions();
    this.getUserDetail();
    this.props.navigation.addListener('focus', () => {
      this.getUserDetail();
      firebaseprovider.firebaseUserGetInboxCount();

      this._willBlurSubscription = this.props.navigation.addListener(
        'blur',
        payload =>
          BackHandler.removeEventListener(
            'hardwareBackPress',
            this.handleBackPress,
          ),
      );
    });

    this.saveUserDeviceToken();
  }

  getUserDetail = async () => {
    let userdata = await localStorage.getItemObject('user_arr');
    if (userdata.deliver_on_off_status == 0) {
      this.setState({
        show: false,
        user_id: userdata.user_id,
      });
    } else {
      this.setState({
        user_id: userdata.user_id,
        show: true,
      });
      if (this.state.checkStatus) {
        this.get_all_dining(1);
      }
    }
  };

  get_all_dining = async var1 => {
    let url =
      config.baseURL + 'get_driver_side_home.php?user_id=' + this.state.user_id;
    consolepro.consolelog('url', url);

    var var2 = 0;
    if (var1 == 1) {
      var2 = 1;
    }
    apifuntion
      .getApi(url, var2)
      .then(obj => {
        console.log('Obj of get_driver_side_home ', obj);
        if (obj.success == 'true') {
          let order_arr = obj.order_arr;
          this.setState({
            notification_count: obj.notification_count,
            order_arr: order_arr,
            load: false,
            refresh: false,
          });
        } else {
          if (obj.account_active_status == 0) {
            config.checkUserDeactivate(this.props.navigation);
            return false;
          }
          msgProvider.toast(obj.msg[0], 'center');
          return false;
        }
      })
      .catch(error => {
        console.log('Error: ', error);
      });
  };

  order_accept_driver = async item => {
    let url = config.baseURL + 'order_accept_driver.php';
    consolepro.consolelog('url of Order', url);

    var data = new FormData();
    data.append('user_id', this.state.user_id);
    data.append('order_id', item.order_id);
    consolepro.consolelog('data', data);

    apifuntion
      .postApi(url, data)
      .then(obj => {
        consolepro.consolelog('obj', obj);
        if (obj.success == 'true') {
          consolepro.consolelog(obj);

          if (obj.notification_arr != 'NA') {
            notification.notification_arr(obj.notification_arr);
          }

          msgProvider.toast(obj.msg[0], 'center');

          setTimeout(() => {
            this.props.navigation.navigate('Driver_Orders');
          }, 700);
        } else {
          if (obj.account_active_status == 0) {
            config.checkUserDeactivate(this.props.navigation);
            return false;
          }
          msgProvider.toast(obj.msg[0], 'center');
          return false;
        }
      })
      .catch(error => {});
  };

  //----------08-08
  order_reject_driver = async item => {
    let url = config.baseURL + 'order_reject_driver.php';
    consolepro.consolelog('url', url);

    var data = new FormData();
    data.append('user_id', this.state.user_id);
    data.append('order_id', item.order_id);
    consolepro.consolelog('data', data);

    apifuntion
      .postApi(url, data)
      .then(obj => {
        consolepro.consolelog('obj', obj);
        if (obj.success == 'true') {
          consolepro.consolelog(obj);

          var notification_arr = obj.notification_arr;
          if (notification_arr != 'NA') {
            notification.notification_arr(notification_arr);
          }
          if (this.state.checkStatus) {
            this.get_all_dining(1);
          }
        } else {
          if (obj.account_active_status == 0) {
            config.checkUserDeactivate(this.props.navigation);
            return false;
          }
          msgProvider.toast(obj.msg[0], 'center');
          return false;
        }
      })
      .catch(error => {
        msgProvider.toast(obj.msg[0], 'center');
      });
  };

  accept_alert = async item => {
    Alert.alert('Accept Order', 'Are you sure you want to accept this order?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {text: 'YES', onPress: () => this.order_accept_driver(item)},
    ]);
    return true;
  };

  reject_alert = async item => {
    Alert.alert('Reject Order', 'Are you sure you want to reject this order?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {text: 'YES', onPress: () => this.order_reject_driver(item)},
    ]);
    return true;
  };

  _onRefresh = () => {
    this.checkStripeVerificationHandler();
    this.setState({refresh: true}) ||
      setTimeout(() => {
        this.setState({refresh: false});
      }, 2000);

    // this.getAllProduct(1);
    if (this.state.checkStatus) {
      this.get_all_dining(1);
    }
  };

  //driver on/off

  onToggleSwitch = () => {
    this.setState({show: !this.state.show});

    let {user_id, show} = this.state;
    consolepro.consolelog({user_id, show});
    let show_status = 0;
    if (show == true) {
      show_status = 0;
    } else {
      show_status = 1;
    }

    let url = config.baseURL + 'driver_on_off_manage.php';
    var data = new FormData();

    data.append('user_id', user_id);
    data.append('deliver_on_off_status', show_status);
    consolepro.consolelog('data', data);

    apifuntion
      .postApi(url, data, 1)
      .then(obj => {
        consolepro.consolelog('user_arr', obj);
        if (obj.success == 'true') {
          var user_arr = obj.user_details;
          var user_id = user_arr.user_id;
          localStorage.setItemString('user_id', JSON.stringify(user_id));
          localStorage.setItemObject('user_arr', user_arr);
        } else {
          if (obj.account_active_status == 0) {
            config.checkUserDeactivate(this.props.navigation);
            return false;
          }
          msgProvider.toast(obj.msg[0], 'center');
          return false;
        }
      })
      .catch(error => {
        msgProvider.toast(obj.msg[0], 'center');
      });
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
      <View
        style={{
          flex: 1,
        }}>
        <SafeAreaView style={{flex: 0, backgroundColor: Colors.theamColor}} />

        <View
          style={{
            width: (mobileW * 100) / 100,
            backgroundColor: Colors.theamColor,
          }}>
          <View
            style={{
              width: (mobileW * 95) / 100,
              flexDirection: 'row',
              alignSelf: 'center',
              justifyContent: 'space-between',
              paddingVertical: (mobileW * 3) / 100,
            }}>
            <Switch
              color={Colors.white_color}
              value={this.state.show}
              onValueChange={this.onToggleSwitch}
              activeText={''}
              inActiveText={''}
              backgroundActive={Colors.white1}
              backgroundInactive="#c2c0ba"
              circleActiveColor={Colors.blueButton}
              circleInActiveColor={Colors.white1}
              circleSize={Platform.OS == 'android' ? 20 : 19}
              barHeight={Platform.OS == 'android' ? 20 : 20}
              circleBorderWidth={0.1}
            />
            {/* <================== Refresh Button =============> */}
            <TouchableOpacity
              style={{
                width: (mobileW * 9.5) / 100,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: -3,
                marginLeft: (mobileW * -28) / 100,
              }}
              onPress={() => this._onRefresh()}
              activeOpacity={0.7}>
              {/* <Image
                style={{
                  height: (mobileW * 7) / 100,
                  width: (mobileW * 7) / 100,
                  resizeMode: 'contain',
                  alignSelf: 'flex-end',
                }}
                source={
                  this.state.notification_count == 0
                    ? localimag.notification_empty
                    : localimag.notification
                }
              /> */}

              <Icon name="refresh" color="#fff" size={25} />
            </TouchableOpacity>

            <View style={{alignItems: 'center', alignSelf: 'center'}}>
              <Text
                style={{
                  marginLeft: (mobileW * -13) / 100,
                  fontSize: (mobileW * 5) / 100,
                  color: Colors.white_color,
                  fontFamily: Font.OutfitMedium,
                }}>
                {Lang_chg.Home[config.language]}
              </Text>
            </View>

            <TouchableOpacity
              style={{width: (mobileW * 9.5) / 100}}
              onPress={() => {
                this.props.navigation.navigate('Notification');
              }}
              activeOpacity={0.7}>
              <Image
                style={{
                  height: (mobileW * 7) / 100,
                  width: (mobileW * 7) / 100,
                  resizeMode: 'contain',
                  alignSelf: 'flex-end',
                }}
                source={
                  this.state.notification_count == 0
                    ? localimag.notification_empty
                    : localimag.notification
                }
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refresh}
              onRefresh={this._onRefresh}
            />
          }
          style={{
            flex: 1,
            backgroundColor: Colors.white1,
          }}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}>
          <KeyboardAwareScrollView
            contentContainerStyle={{
              marginBottom: mobileW * 0.2,
              backgroundColor: Colors.white1,
            }}>
            {this.state.load == true && (
              <View style={{flex: 1, backgroundColor: Colors.white1}}></View>
            )}
            {this.state.show == false && (
              <View
                style={{
                  flex: 1,
                  backgroundColor: Colors.white1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  style={{
                    height: (mobileW * 60) / 100,
                    width: (mobileW * 70) / 100,
                    marginTop: mobileW * 0.25,
                  }}
                  source={localimag.offlinevector}
                />
                <Text
                  style={{
                    fontSize: mobileW * 0.08,
                    color: Colors.textgrey,
                    fontFamily: Font.OutfitMedium,
                  }}>
                  You’re Offline
                </Text>
              </View>
            )}
            {!this.state.checkStatus &&
              (this.state.verificationPending ? (
                <Text
                  style={{
                    width: '50%',
                    alignSelf: 'center',
                    color: Colors.textgrey,
                    textAlign: 'center',
                    fontFamily: Font.FontBold,
                    marginTop: (mobileW * 30) / 100,
                    fontSize: (mobileW * 5.5) / 100,
                  }}>
                  Verification Pending
                </Text>
              ) : (
                <View>
                  <Text
                    style={{
                      width: '90%',
                      alignSelf: 'center',
                      color: 'black',
                      textAlign: 'center',
                      fontFamily: Font.FontBold,
                      marginTop: (mobileW * 30) / 100,
                      fontWeight: 'bold',
                      fontSize: (mobileW * 4.8) / 100,
                    }}>
                    Please Complete Verification to Start Accepting Orders
                  </Text>
                  <ScrollView>
                    {this.state.showError.map((item, index) => {
                      return (
                        <Text
                          key={index}
                          style={{
                            width: '90%',
                            alignSelf: 'center',
                            color: Colors.textgrey,
                            textAlign: 'center',
                            fontFamily: Font.FontBold,
                            marginTop: (mobileW * 5) / 100,
                            fontSize: (mobileW * 3.8) / 100,
                          }}>
                          {index + 1}: {item}
                        </Text>
                      );
                    })}
                  </ScrollView>
                  <TouchableOpacity
                    onPress={() => {
                      if (this.state.showType === 5) {
                        this.props.navigation.navigate(
                          'Driver_Edit_WithDrawal',
                          {
                            edit: true,
                            showCardType: this.state.showType,
                          },
                        );
                      } else {
                        this.props.navigation.navigate('Driver_Add_bank', {
                          edit: true,
                        });
                      }
                    }}
                    style={{
                      flexDirection: 'row',
                      width: (mobileW * 85) / 100,
                      alignSelf: 'center',
                      marginTop: (mobileW * 8) / 100,
                      justifyContent: 'center',
                      backgroundColor: '#3214d1',
                      alignItems: 'center',
                      borderRadius: (mobileW * 1) / 100,
                      padding: (mobileW * 3) / 100,
                    }}>
                    <Text
                      style={{
                        fontSize: (mobileW * 4) / 100,
                        color: Colors.white_color,
                        fontFamily: Font.OutfitMedium,
                        textAlign: 'center',
                        paddingLeft: 3.5,
                      }}>
                      {'Complete Verification'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            {this.state.show == true &&
            this.state.order_arr == 'NA' &&
            this.state.load == false &&
            this.state.checkStatus ? (
              <Text
                style={{
                  width: '50%',
                  alignSelf: 'center',
                  color: Colors.textgrey,
                  textAlign: 'center',
                  fontFamily: Font.FontBold,
                  marginTop: (mobileW * 30) / 100,
                  fontSize: (mobileW * 5.5) / 100,
                }}>
                {Lang_chg.No_order_available_for_delivery[config.language]}
              </Text>
            ) : (
              this.state.order_arr != 'NA' &&
              this.state.show == true &&
              this.state.checkStatus && (
                <View
                  style={{
                    width: '94%',
                    alignSelf: 'center',
                    paddingVertical: (mobileW * 3) / 100,
                  }}>
                  <Text
                    style={{
                      fontSize: (mobileW * 5) / 100,
                      color: Colors.black,
                      fontFamily: Font.OutfitMedium,
                    }}>
                    {Lang_chg.New_Order[config.language]}
                  </Text>

                  {this.state.order_arr != 'NA' && (
                    <FlatList
                      data={this.state.order_arr}
                      keyExtractor={index => {
                        return index.toString();
                      }}
                      renderItem={({item, index}) => {
                        return (
                          <View
                            style={{
                              width: '100%',
                              alignSelf: 'center',
                              backgroundColor: Colors.white_color,

                              borderTopRightRadius: (mobileW * 4) / 100,
                              borderTopLeftRadius: (mobileW * 4) / 100,
                              marginTop: mobileW * 0.04,
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                width: '100%',
                                alignSelf: 'center',
                                justifyContent: 'space-between',
                                backgroundColor: '#ffffff',
                                borderTopRightRadius: (mobileW * 4) / 100,
                                borderTopLeftRadius: (mobileW * 4) / 100,
                                paddingVertical: (mobileW * 1) / 100,
                                marginBottom: mobileW * 0.005,
                              }}>
                              {/* ---------------------- For img ----------------------- */}
                              <View
                                style={{
                                  width: '25%',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                <TouchableOpacity
                                  style={{
                                    width: '95%',
                                    borderRadius: (mobileW * 2) / 100,
                                    alignSelf: 'center',
                                    alignItems: 'center',
                                  }}
                                  onPress={() => {
                                    this.props.navigation.navigate(
                                      'Pendingui',
                                      {
                                        order_status: item.order_status,
                                        order_id: item.order_id,
                                      },
                                    );
                                  }}
                                  activeOpacity={0.7}>
                                  <Image
                                    style={{
                                      height: (mobileW * 20) / 100,
                                      width: (mobileW * 20) / 100,
                                      alignSelf: 'center',
                                      borderRadius: (mobileW * 2) / 100,
                                    }}
                                    source={{
                                      uri: config.img_url + item.dining_image,
                                    }}
                                  />
                                </TouchableOpacity>
                              </View>
                              {/* ---------------------- For View ----------------------- */}
                              <View
                                style={{
                                  width: '75%',
                                  alignSelf: 'center',
                                  paddingBottom: (mobileW * 2) / 100,
                                }}>
                                <View style={{flexDirection: 'row'}}>
                                  <Text
                                    style={[
                                      styles.cardFoddTitle,
                                      {
                                        width: '70%',
                                        marginTop: mobileW * 0.03,
                                      },
                                    ]}>
                                    {item.dining_name}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.cardFoddTitle,
                                      {
                                        width: '10%',
                                        marginTop: mobileW * 0.03,
                                        marginLeft: (mobileW * 10) / 100,
                                      },
                                    ]}>
                                    {item.rupess}
                                  </Text>
                                </View>
                                {/* ---------------------- Date time ----------------------- */}
                                <View
                                  style={{
                                    width: '95%',
                                    flexDirection: 'row',
                                    marginTop: mobileW * 0.02,
                                  }}>
                                  <Image
                                    // source={item.calender_image}

                                    source={localimag.calender}
                                    style={{
                                      alignSelf: 'center',
                                      resizeMode: 'contain',
                                      width: (mobileW * 3.6) / 100,
                                      height: (mobileW * 3.6) / 100,
                                    }}
                                  />
                                  <Text
                                    style={{
                                      marginLeft: (mobileW * 1) / 100,
                                      fontSize: (mobileW * 3) / 100,
                                      alignSelf: 'center',
                                      color: Colors.mediumgrey,
                                      fontFamily: Font.fontmedium,
                                      textAlign: config.textalign,
                                    }}>
                                    {item.createtime}
                                  </Text>
                                  <Image
                                    source={item.clock_image}
                                    style={{
                                      marginLeft: (mobileW * 2) / 100,
                                      alignSelf: 'center',
                                      resizeMode: 'contain',
                                      width: (mobileW * 3.3) / 100,
                                      height: (mobileW * 3.3) / 100,
                                    }}
                                  />
                                  <Text
                                    style={{
                                      marginLeft: (mobileW * 1) / 100,
                                      fontSize: (mobileW * 3) / 100,
                                      alignSelf: 'center',
                                      color: Colors.mediumgrey,
                                      fontFamily: Font.fontmedium,
                                      textAlign: config.textalign,
                                    }}>
                                    {item.time}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    width: '95%',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginTop: mobileW * 0.02,
                                    alignItems: 'center',
                                  }}>
                                  <Text
                                    style={{
                                      fontSize: (mobileW * 3.2) / 100,
                                      alignSelf: 'center',
                                      color: Colors.yellow,
                                      fontFamily: Font.OutfitMedium,
                                      textAlign: config.textalign,
                                    }}>
                                    {Lang_chg.pending[config.language]}
                                  </Text>
                                  <View
                                    style={{
                                      width: (mobileW * 25) / 100,
                                      backgroundColor: Colors.whitepurple,
                                      borderColor: Colors.bottomborder,
                                      borderRadius: (mobileW * 4) / 100,
                                      borderWidth: 1,
                                      paddingVertical: (mobileW * 1) / 100,
                                    }}>
                                    <Text
                                      style={{
                                        fontSize: (mobileW * 3) / 100,
                                        fontFamily: Font.OutfitMedium,
                                        color: Colors.black,
                                        textAlign: 'center',
                                      }}>
                                      {/* {item.dinnig} */}
                                      {item.dining_facility_id == 0 &&
                                        Lang_chg.Dining[config.language]}
                                      {item.dining_hall_id == 0 &&
                                        Lang_chg.Diningf[config.language]}
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            </View>

                            {/* ====================customer detail================ */}

                            <View
                              style={{
                                width: '100%',
                                alignSelf: 'center',
                                backgroundColor: Colors.backgroundgrey,
                                shadowColor: '#000',
                                shadowOpacity: 0.1,
                                elevation: 1,
                                shadowOffset: {width: 0},
                                shadowOpacity: 0.1,
                                marginTop: mobileW * -0.01,
                              }}>
                              <Text
                                style={{
                                  fontFamily: Font.Semibold,
                                  fontSize: mobileW * 0.038,
                                  width: '95%',
                                  alignSelf: 'center',
                                  paddingVertical: (mobileW * 1) / 100,
                                  marginTop: mobileW * 0.01,
                                }}>
                                {
                                  Lang_chg.customer_details_text[
                                    config.language
                                  ]
                                }
                              </Text>
                              <View
                                style={{
                                  width: '95%',
                                  alignSelf: 'center',
                                  flexDirection: 'row',
                                  paddingVertical: (mobileW * 2) / 100,
                                }}>
                                <View style={{width: '12%'}}>
                                  <Image
                                    source={
                                      item.customer_image == null
                                        ? localimag.Profinactive
                                        : {
                                            uri:
                                              config.img_url +
                                              item.customer_image,
                                          }
                                    }
                                    // source={this.state.customer_image == null ? localimag.Profinactive : { uri: item.customer_image }}
                                    style={{
                                      alignSelf: 'center',
                                      width: (mobileW * 8) / 100,
                                      height: (mobileW * 8) / 100,
                                      borderRadius: (mobileW * 5) / 100,
                                      borderColor: Colors.light_grey,
                                      borderWidth: 1.5,
                                    }}
                                  />
                                </View>
                                <View style={{width: '88%'}}>
                                  <Text style={styles.customer_name_style}>
                                    {item.customer_name}
                                  </Text>
                                  <View
                                    style={{
                                      width: '100%',
                                      alignSelf: 'center',
                                      flexDirection: 'row',
                                      justifyContent: 'space-between',
                                      marginTop: mobileW * 0.015,
                                    }}>
                                    <Text
                                      style={{
                                        fontSize: (mobileW * 3.4) / 100,
                                        color: '#000',
                                        marginLeft: (mobileW * 0.8) / 100,
                                        fontFamily: Font.OutfitMedium,
                                        textAlign: config.textalign,
                                      }}>
                                      {
                                        Lang_chg.University_text[
                                          config.language
                                        ]
                                      }
                                    </Text>
                                    <Text
                                      style={{
                                        fontSize: (mobileW * 3.4) / 100,
                                        color: Colors.textgrey,
                                        marginLeft: (mobileW * 0.8) / 100,
                                        fontFamily: Font.OutfitMedium,
                                        textAlign: config.textalign,
                                      }}>
                                      {item.university_name}
                                    </Text>
                                  </View>
                                </View>
                              </View>
                              <View
                                style={{
                                  width: '100%',
                                  alignSelf: 'center',
                                  backgroundColor: Colors.white1,
                                  shadowOpacity: 0.1,
                                  elevation: 1,
                                  shadowOffset: {width: 0},
                                  shadowColor: '#000',
                                  shadowOpacity: 0.1,
                                }}>
                                <Text
                                  style={{
                                    width: '95%',
                                    alignSelf: 'center',
                                    fontFamily: Font.OutfitMedium,
                                    fontSize: mobileW * 0.032,
                                    color: '#7F7F7F',
                                    paddingVertical: (mobileW * 2.5) / 100,
                                  }}>
                                  Order ID: #{item.order_no}
                                </Text>
                              </View>

                              <View
                                style={{
                                  width: '100%',
                                  alignSelf: 'center',
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                }}>
                                <TouchableOpacity
                                  activeOpacity={0.7}
                                  onPress={() => {
                                    this.accept_alert(item);
                                  }}
                                  style={{
                                    width: '50%',
                                    backgroundColor: Colors.theamColor,
                                    paddingVertical: (mobileW * 2.5) / 100,
                                  }}>
                                  <Text
                                    style={{
                                      alignSelf: 'center',
                                      fontFamily: Font.OutfitMedium,
                                      fontSize: (mobileW * 3.4) / 100,
                                      color: '#fff',
                                    }}>
                                    {Lang_chg.accept_text[config.language]}
                                  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => {
                                    this.reject_alert(item);
                                  }}
                                  style={{
                                    width: '50%',
                                    backgroundColor: Colors.red,
                                    paddingVertical: (mobileW * 2.5) / 100,
                                  }}>
                                  <Text
                                    style={{
                                      alignSelf: 'center',
                                      fontFamily: Font.OutfitMedium,
                                      fontSize: (mobileW * 3.4) / 100,
                                      color: '#fff',
                                    }}>
                                    {Lang_chg.reject_text[config.language]}
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        );
                      }}
                    />
                  )}
                </View>
              )
            )}
          </KeyboardAwareScrollView>
        </ScrollView>

        <Driver_Footer
          activepage="Driver_Home"
          usertype={1}
          footerpage={[
            {
              name: 'Driver_Home',
              fname: 'Home',
              countshow: false,
              image: localimag.Homeinactive,
              activeimage: localimag.Homeactive,
            },
            {
              name: 'Driver_Orders',
              fname: 'Orders',
              countshow: false,
              image: localimag.Orderinactive,
              activeimage: localimag.Orderactive,
            },
            {
              name: 'Inbox',
              fname: 'Chat',
              countshow: count_inbox,
              image: localimag.chat_gray,
              activeimage: localimag.Chatactive,
            },
            {
              name: 'My_Earnings',
              fname: 'My Earnings',
              countshow: false,
              image: localimag.Dollerinactive,
              activeimage: localimag.Dolleractive,
            },
            {
              name: 'Driver_Profile',
              fname: 'Profile',
              countshow: false,
              image: localimag.Profinactive,
              activeimage: localimag.Profactive,
            },
          ]}
          navigation={this.props.navigation}
          imagestyle1={{
            width: 26,
            height: 26,
            backgroundColor: '#01faff',
            countcolor: 'red',
            countbackground: 'red',
            backgroundColor: 'white',
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cardFoddTitle: {
    color: '#000',
    fontSize: (mobileW * 3.7) / 100,
    fontFamily: Font.Semibold,
    textAlign: config.textalign,
  },

  customerDetails: {
    fontSize: (mobileW * 3.8) / 100,
    color: '#000',
    fontFamily: Font.OutfitMedium,
    textAlign: config.textalign,
  },

  customer_name_style: {
    marginLeft: (mobileW * 0.8) / 100,
    color: Colors.theamColor,
    fontSize: (mobileW * 3.5) / 100,
    fontFamily: Font.Semibold,
    textAlign: config.textalign,
  },
});
