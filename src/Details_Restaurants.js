import {
  Text,
  View,
  ImageBackground,
  Image,
  TextInput,
  Dimensions,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
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
  notification,
} from './Provider/utilslib/Utils';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Mapprovider from './Provider/Mapprovider';
import DashedLine from 'react-native-dashed-line';
import {mediaprovider, Cameragallery} from './Provider/utilslib/Utils';
import {WebView} from 'react-native-webview';

export default class Details_Restaurants extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      show1: 0,
      show2: true,
      modalVisible: false,
      tipModalVisible: false,

      // For Getting Current Date Time only
      date_Time: '',

      food_arr: [
        {id: 0, image: localimag.foodcatone, text: 0.0, status: false},
        {id: 1, image: localimag.foodcatone, text: 1, status: true},
        {id: 2, image: localimag.foodcattwo, text: 1.5, status: false},
        {id: 3, image: localimag.foodcatthree, text: 2, status: false},
        {id: 4, image: localimag.foodcatfour, text: 3, status: false},
        {id: 5, image: localimag.foodcatthree, text: 5, status: false},
      ],

      tip_amount: 0,
      mediamodal: false,

      order_image: 'NA',
      address: '',
      name: '',
      order_number: '',

      dining_facility_id: this.props.route.params.dining_facility_id,
      user_id: this.props.route.params.user_id,
      restaurant_id: this.props.route.params.restaurant_id,
      dining_facility_arr: 'NA',

      tip_amount_selected: 0,
      address: '',
      tip_amount: 0,

      add_to_cart_arr: 'NA',
      amountVisible: 0,
      tip_amount_plus_fee: 0,
      webviewshow: false,

      university_id: '',

      estimated_tax_amount: 0,
      estimated_tax_per: 0,
      total: 0,
      txn_id: 123456,
      // to_pay: '',

      serviceFee: 0,
      tipAmountShow: '0.0',
      total_customer_amount: 0,
      payment_status: 0,
    };
  }

  Camerapopen = async () => {
    mediaprovider
      // .launchCamera(true)
      .launchCamera(false)
      .then(res => {
        //console.log("camerares", res);

        let tmp = res.path;

        this.setState({
          mediamodal: false,

          order_image: tmp,
        });
      })
      .catch(error => {
        this.setState({mediamodal: false});

        consolepro.consolelog(' camera error ', error);

        if (config.device_type == 'ios') {
          if (
            error ==
            'Error: Cannot access images. Please allow access if you want to be able to select images.'
          ) {
            consolepro.consolelog('i am here ');

            setTimeout(() => {
              this.open_settings();
            }, 1000);
          }
        } else {
          if (error == 'Error: Required permission missing') {
            this.open_settings();
          }
        }
      });
  };

  //-----------------------------function to access images from gallery

  Galleryopen = () => {
    consolepro.consolelog('gallery open clicked');
    mediaprovider
      .launchGellery(false)
      .then(res => {
        //console.log("camerares", res);

        let tmp = res.path;

        this.setState({
          mediamodal: false,

          order_image: tmp,
        });
      })
      .catch(error => {
        this.setState({mediamodal: false});

        consolepro.consolelog('gallery error', error);

        if (config.device_type == 'ios') {
          if (
            error ==
            'Error: Cannot access images. Please allow access if you want to be able to select images.'
          ) {
            consolepro.consolelog('i am here ');

            setTimeout(() => {
              this.open_settings();
            }, 1000);
          }
        } else {
          if (error == 'Error: Required permission missing') {
            this.open_settings();
          }
        }
      });
  };

  //----------------------------function for open setting of this app in device for permission----------------

  open_settings = () => {
    Alert.alert(
      'Alert',
      'This app need permissions,Please allow it',
      [
        {
          text: 'Close',

          onPress: () => {
            consolepro.consolelog('nothing user cancle it ');
          },

          style: 'cancel',
        },

        {
          text: 'Open Settings',
          onPress: () => {
            Linking.openSettings();
          },
        },
      ],
      {cancelable: false},
    );
  };

  //17-08
  componentDidMount() {
    //console.log("Math.floor(100000 + Math.random() * 900000)",Math.floor(1000000000 + Math.random() * 9000000000));
    const currentDate = new Date();

    {
      /* <================== Date Formate Like 23 Oct 2023 08:41 Am =============> */
    }
    // const timeString = currentDate.toLocaleTimeString('en-US', {
    //   hour12: true,
    //   hour: 'numeric',
    //   minute: 'numeric',
    // });

    // const options = {day: '2-digit', year: 'numeric', month: 'short'};
    // let dateString = new Intl.DateTimeFormat('en-US', options).format(
    //   currentDate,
    // );

    // let dateArr = dateString.split(' ');

    // dateArr[1].replace(/,/g, '');

    // dateString =
    //   dateArr[1].replace(/,/g, '') + ' ' + dateArr[0] + ' ' + dateArr[2];

    // let dateTime = dateString + ' ' + timeString;

    {
      /* <================== Server Date Formate  =============> */
    }
    // Format date as "YYYY-MM-DD"
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    // Format time as "HH:mm:ss"
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    const dateTime = formattedDate + ' ' + formattedTime;

    // console.log('Date time:', dateTime);

    this.setState({date_Time: dateTime});

    this.getUserDetail();
    consolepro.consolelog(this.state.user_id);

    // this.get_amountVisible();

    this.props.navigation.addListener('focus', () => {
      this.setState({
        txn_id: Math.floor(1000000000 + Math.random() * 9000000000),
      });
      // this.getUserDetail();
      if (this.props.route.params != undefined) {
        let address = this.props.route.params.address;
        let latitude = this.props.route.params.latitude;
        let longitude = this.props.route.params.longitude;
        this.setState({
          latitude: latitude,
          longitude: longitude,
          address: address,
        });
      }

      if (this.props.route.params.dining_facility_id != undefined) {
        let dining_facility_id = this.props.route.params.dining_facility_id;
        let user_id = this.props.route.params.user_id;
        let restaurant_id = this.props.route.params.restaurant_id;
        this.setState({
          user_id: user_id,
          restaurant_id: restaurant_id,
          dining_facility_id: dining_facility_id,
        });
      }
    });
  }

  getUserDetail = async () => {
    let userdata = await localStorage.getItemObject('user_arr');
    consolepro.consolelog('userdata', userdata);
    // var letter_name = userdata.user_name;
    // letter_name = letter_name.charAt(0).toUpperCase();
    // consolepro.consolelog({ letter_name });
    this.setState({
      user_id: userdata.user_id,
      user_type: userdata.user_type,
      user_name: userdata.name,
      user_email: userdata.email,
      university_id: userdata.university_id,
    });
    consolepro.consolelog(this.state.user_id);
    consolepro.consolelog('university_id will be', this.state.university_id);

    this.get_amountVisible();
    this.get_dining_facilities_details();
  };

  get_dining_facilities_details = async () => {
    let url =
      config.baseURL +
      'get_dining_facilities_restaurant_details.php?user_id=' +
      this.state.user_id +
      '&dining_facility_id=' +
      this.state.dining_facility_id +
      '&restaurant_id=' +
      this.state.restaurant_id;
    consolepro.consolelog('url of dining Facilities Hall ', url);

    apifuntion
      .getApi(url, 0)
      .then(obj => {
        consolepro.consolelog('obj of dinning: ', obj);
        if (obj.success == 'true') {
          setTimeout(() => {
            this.setState({
              payment_status: obj.payment_status,
              dining_facility_arr: obj.dining_facility_arr,
            });
          }, 200);
        } else {
          msgProvider.toast(obj.message, 'center');
          return false;
        }
      })
      .catch(error => {
        consolepro.consolelog('-------- error ------- ' + error);
      });
  };

  //17-08
  //----------------------- details resturent
  get_amountVisible = async () => {
    let order_type = 1;
    let url =
      config.baseURL +
      'get_commission_for_order.php?user_id=' +
      this.state.user_id +
      '&university_id=' +
      this.state.university_id +
      '&order_type=' +
      order_type;
    consolepro.consolelog('url', url);
    apifuntion
      .getApi(url, 0)
      .then(obj => {
        consolepro.consolelog('obj', obj);

        if (obj.success == 'true') {
          let amountVisible = obj.amountVisible;

          let estimated_tax_per = obj.estimated_tax_per;

          let estimated_tax_amount = (amountVisible * estimated_tax_per) / 100;

          let total = amountVisible + estimated_tax_amount;

          //console.log("total----->", total);

          let percentage_amount = obj.percentageAmount;

          this.setState({
            total_customer_amount: total,
            percentageAmount: percentage_amount,
          });

          if (this.state.tip_amount_selected == 'NA') {
            var to_pay = parseFloat(total).toFixed(2);
            //console.log("to_pay", to_pay);
          } else {
            var to_pay = parseFloat(
              total +
                parseInt(
                  this.state.food_arr[this.state.tip_amount_selected].text,
                ),
            ).toFixed(2);
            //console.log("total + tip ammount", to_pay);
          }

          amountVisible = (Math.round(amountVisible * 100) / 100).toFixed(2);
          estimated_tax_amount = (
            Math.round(estimated_tax_amount * 100) / 100
          ).toFixed(2);

          total = (Math.round(total * 100) / 100).toFixed(2);
          to_pay = (Math.round(to_pay * 100) / 100).toFixed(2);

          //console.log("to_pay", to_pay);

          let serviceFee = ((to_pay * 2.9) / 100 + 0.3).toFixed(2);

          //console.log("first serviceFee", serviceFee);
          //console.log(
          //   "percentage_amount",
          //   parseFloat(percentage_amount).toFixed(2)
          // );
          serviceFee = (
            parseFloat(serviceFee) + parseFloat(percentage_amount)
          ).toFixed(2);

          this.setState({serviceFee: serviceFee});

          total = (parseFloat(to_pay) + parseFloat(serviceFee)).toFixed(2);

          to_pay = (parseFloat(to_pay) + parseFloat(serviceFee)).toFixed(2);

          //console.log("final to pay value ", to_pay);

          this.setState({
            amountVisible: amountVisible,
            tip_amount_plus_fee: amountVisible,
            driver_status: obj.driver_status,
            estimated_tax_amount: estimated_tax_amount,
            estimated_tax_per: estimated_tax_per,
            total: total,
            to_pay: to_pay,
            blank: false,
          });
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

  CreateOrder = async () => {
    console.log('I am in Create Order ');
    let url = config.baseURL + 'order_submit.php';
    consolepro.consolelog('url of submit', url);
    var data = new FormData();
    data.append('user_id', this.state.user_id);
    data.append('university_id', this.state.university_id);
    data.append('dining_hall_id', 0);
    data.append('transaction_datetime', this.state.date_Time);
    data.append('createtime', this.state.date_Time);
    data.append('updatetime', this.state.date_Time);
    // data.append('dining_hall_id', this.state.dining_halls_id);
    data.append('dining_facility_id', this.state.dining_facility_id);
    // data.append('dining_facility_id', this.state.dining_facility_id);
    data.append('location', this.state.address);
    this.state.tip_amount_selected == 'NA'
      ? data.append('tip_amount', this.state.tip_amount)
      : data.append(
          'tip_amount',
          this.state.food_arr[this.state.tip_amount_selected].text,
        );
    // data.append('order_type', this.state.order_type);
    // data.append('order_type', 2);
    data.append('order_type', 1);
    data.append('estimated_tax_amount', this.state.estimated_tax_amount);

    //29-07
    data.append('latitude', this.state.latitude);
    data.append('longitude', this.state.longitude);
    data.append('transaction_id', this.state.txn_id);
    //30-07
    // data.append('cart_arr', this.state.cart_arr)
    // data.append('cart_arr[]', JSON.stringify(this.state.add_to_cart_arr))
    // for (let i = 0; i < this.state.add_to_cart_arr.length; i++) {
    //     data.append('cart_arr[]', this.state.add_to_cart_arr[i]);
    // }
    // data.append('cart_arr', JSON.stringify(this.state.add_to_cart_arr))
    // data.append('cart_arr', this.state.add_to_cart_arr)
    //17-08-22
    data.append('facility_type', this.state.show1);
    if (this.state.show1 == 0) {
      if (this.state.order_image != '') {
        data.append('image', {
          uri: this.state.order_image,
          type: 'image/jpg', // or photo.type
          name: 'image.jpg',
        });
      }
    } else {
      data.append('facility_name', this.state.name);
      data.append('facility_order_number', this.state.order_number);
    }

    // data.append('image', this.state.image)

    consolepro.consolelog('data of Submit Api: ', data);
    // return false;
    apifuntion
      .postApi(url, data)
      .then(obj => {
        console.log('Sucess i am in then func');
        consolepro.consolelog('obj', obj);
        if (obj.success == 'true') {
          consolepro.consolelog('obj.success', obj);
          //   localStorage.removeItem('add_to_cart_arr');

          localStorage.removeItem('add_to_cart');
          // this.setState({
          //     add_to_cart_arr: 'NA',
          // })

          //   localStorage.setItemString({'dining_halls_id':''});
          localStorage.removeItem('dining_halls_id');
          // let tmp = localStorage.getItemObject('dining_halls_id');
          // consolepro.consolelog(tmp);
          var notification_arr = obj.notification_arr;
          if (notification_arr != 'NA') {
            consolepro.consolelog({notification_arr});
            notification.notification_arr(notification_arr);
          }
          setTimeout(() => {
            this.props.navigation.navigate('Paynow', {
              txn_id: this.state.txn_id,
            });
          }, 300);

          //   this.props.navigation.navigate('Paynow')
        } else {
          if (obj.account_active_status == 0) {
            // this.props.navigation.navigate('Login')
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
        console.log('Api Catch Error');
        console.log('error', error);
      });
  };

  //--------------on navigation state change function ------------//
  _onNavigationStateChange(webViewState) {
    webViewState.canGoBack = false;
    if (webViewState.loading == false) {
      //console.log("webViewState", webViewState);
      //console.log(webViewState.url);
      var t = webViewState.url.split('/').pop().split('?')[0];
      if (typeof t != null) {
        var p = webViewState.url.split('?').pop().split('&');
        //console.log("file name", t);
        if (t == 'payment_success_final.php') {
          // console.log('parameter', p);
          var payment_id = 0;

          //console.log("p.length", p.length);
          for (var i = 0; i < p.length; i++) {
            var val = p[i].split('=');
            //console.log("val", val);
            // if (val[0] == 'order_id') {
            if (val[0] == 'payment_id') {
              payment_id = val[1];
            }
            this.setState({txn_id: payment_id});
          }
          //console.log("tax id will be ", this.state.txn_id);
          this.setState({webviewshow: false});
          setTimeout(() => {
            // this.add_money()
            this.CreateOrder();
          }, 300);
        } else if (t == 'payment_failed.php') {
          msgProvider.toast(Lang_chg.payment_failed[config.language], 'center');
          this.setState({webviewshow: false});
          return false;
        }
      }
    }
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: Colors.white1}}>
        {console.log('sads')}
        {/* image picker */}
        <Cameragallery
          mediamodal={this.state.mediamodal}
          Camerapopen={() => {
            this.Camerapopen();
          }}
          Galleryopen={() => {
            this.Galleryopen();
          }}
          Canclemedia={() => {
            this.setState({mediamodal: false});
          }}
        />

        {/* //==================================== Custom tip -----------------// */}

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.tipModalVisible}
          onRequestClose={() => {
            this.setState({tipModalVisible: false});
          }}>
          <View
            style={{
              backgroundColor: '#00000080',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 20,
              marginTop: -50,
            }}>
            <View
              style={{
                borderRadius: 20,
                width: (mobileW * 80) / 100,
                position: 'absolute',
                alignSelf: 'center',
              }}>
              <View
                style={{
                  backgroundColor: Colors.white_color,
                  borderRadius: (mobileW * 4) / 100,
                  width: '100%',
                  paddingVertical: (mobileW * 2) / 100,
                  paddingBottom: (mobileW * 7) / 100,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({tipModalVisible: false});
                  }}
                  style={{
                    alignSelf: 'flex-end',
                    width: '15%',
                    justifyContent: 'flex-end',
                  }}>
                  <Image
                    style={{
                      height: (mobileW * 8) / 100,
                      width: (mobileW * 8) / 100,
                      resizeMode: 'contain',
                    }}
                    source={localimag.wrong}></Image>
                </TouchableOpacity>
                <View
                  style={{
                    width: (mobileW * 80) / 100,
                    marginTop: (mobileW * -2) / 100,
                  }}>
                  <Image
                    style={{
                      height: (mobileW * 17) / 100,
                      width: (mobileW * 17) / 100,
                      resizeMode: 'contain',
                      alignSelf: 'center',
                    }}
                    source={localimag.modaldoller}></Image>
                </View>
                <View
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    width: (mobileW * 70) / 100,
                    alignSelf: 'center',
                    marginBottom: (mobileW * 4) / 100,
                    borderBottomColor: Colors.bottomborder,
                    borderBottomWidth: 1,
                    paddingVertical: (mobileW * 2) / 100,
                  }}>
                  <Text
                    style={{
                      fontSize: (mobileW * 5) / 100,
                      color: Colors.textgrey,
                      textAlign: 'center',
                    }}>
                    $
                  </Text>
                  <TextInput
                    autoFocus={true}
                    onChangeText={txt => this.setState({tip_amount: txt})}
                    keyboardType="number-pad"
                    placeholderTextColor={Colors.white1}
                    selectionColor={Colors.textInputSelectionColor1}
                    maxLength={100}
                    style={{
                      width: '95%',
                      fontSize: (mobileW * 5) / 100,
                      color: Colors.textgrey,
                      fontFamily: Font.OutfitMedium,
                      textAlignVertical: 'center',
                    }}></TextInput>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    if (this.state.tip_amount < 0) {
                      msgProvider.toast(
                        msgText.Tip_amount_must[config.language],
                        'center',
                      );
                      return false;
                    }
                    let tmp = this.state.tip_amount;
                    let tmp2 = this.state.total;
                    let tmp3 = parseInt(tmp) + parseInt(tmp2);
                    tmp3 = (Math.round(tmp3 * 100) / 100).toFixed(2);

                    let to_pay = tmp3;
                    //console.log("to_pay--->", to_pay);

                    // let serviceFee = (((to_pay*2.9)/100)+0.30).toFixed(2);
                    // console.log("serviceFee",serviceFee);
                    // this.setState({serviceFee:serviceFee})

                    // let amount = parseFloat(to_pay) + (((to_pay*2.9)/100)+0.30);
                    // amount = parseFloat(amount).toFixed(2);

                    // console.log("amount",amount);

                    // this.setState({ modalVisible: false, tip_amount_plus_fee: amount, to_pay: amount })

                    // this.setState({ tipModalVisible: false });
                  }}
                  style={{
                    marginTop: (mobileW * 5) / 100,
                    flexDirection: 'row',
                    width: (mobileW * 70) / 100,
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: (mobileW * 1) / 100,
                    padding: (mobileW * 4) / 100,
                    backgroundColor: Colors.removecolor,
                  }}>
                  <Text
                    style={{
                      fontSize: (mobileW * 3.8) / 100,
                      color: Colors.white_color,
                      fontFamily: Font.Fontregular,
                      textAlign: 'center',
                      paddingLeft: 3.5,
                    }}>
                    {Lang_chg.paytip[config.language]}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* //----------strip modal */}
        <Modal
          animationType="slide"
          // transparent
          visible={this.state.webviewshow}
          // visible={true}
          onRequestClose={() => {
            this.setState({webviewshow: false});
          }}>
          <SafeAreaView
            style={{flex: 0, backgroundColor: Colors.theme_color}}
          />
          <View
            style={{
              width: mobileW,
              // backgroundColor: Colors.theme_color,
              // backgroundColor: 'red',
              backgroundColor: Colors.theamColor,
              alignItems: 'center',
            }}>
            <View
              style={{
                backgroundColor: Colors.theme_color,
                height: (mobileH * 8) / 100,
                flexDirection: 'row',
                alignItems: 'center',
                width: '98%',
                justifyContent: 'space-between',
                // backgroundColor:'yellow',
              }}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  this.setState({webviewshow: false});
                }}
                style={{
                  width: (mobileW * 7) / 100,
                  height: (mobileW * 7) / 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: (mobileW * 4.5) / 100,
                }}>
                <Image
                  resizeMode="contain"
                  style={{
                    tintColor: '#fff',
                    // backgroundColor: 'red',
                    width: (mobileW * 8) / 100,
                    height: (mobileW * 8) / 100,
                    // transform: [config.textalign == 'right' ? {
                    //     scaleX: -1
                    // } : {
                    //     scaleX: 1
                    // }]
                  }}
                  source={localimag.back2}></Image>
              </TouchableOpacity>
              <View style={{alignItems: 'center', alignSelf: 'center'}}>
                <Text
                  style={{
                    fontSize: (mobileW * 5) / 100,
                    fontFamily: Font.FontRegular,
                    color: Colors.white_color,
                  }}>
                  {Lang_chg.payment_processing_txt[config.language]}
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  width: (mobileW * 7) / 100,
                  height: (mobileW * 7) / 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: (mobileW * 4.5) / 100,
                }}></TouchableOpacity>
            </View>
          </View>
          <View style={{flex: 1, backgroundColor: 'white'}}>
            <Text
              style={{
                alignSelf: 'center',
                color: 'red',
                textAlign: 'center',
                fontFamily: Font.FontBold,
                marginTop: 15,
                fontSize: (mobileW * 3) / 100,
              }}>
              {Lang_chg.payment_warning_txt[config.language]}
            </Text>
            {this.state.webviewshow == true && (
              <>
                <WebView
                  source={{
                    uri:
                      config.baseURL +
                      'stripe_payment/payment_url.php?user_id=' +
                      this.state.user_id +
                      '&amount=' +
                      this.state.to_pay,

                    // this.state.tip_amount_selected =='NA'? this.state.amount : this.state.amountVisible+this.state.food_arr[this.state.tip_amount_selected-1].text
                  }}
                  onNavigationStateChange={this._onNavigationStateChange.bind(
                    this,
                  )}
                  userAgent="Mozilla/5.0 (Linux; Android 10; Pixel) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.1234.56 Mobile Safari/537.36"
                  onMessage={event => {
                    // Handle messages from JavaScript here
                    const data = event.nativeEvent.data;
                    console.log('Data:', data);
                    // Process data or take action based on the message
                  }}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  startInLoadingState={false}
                  containerStyle={{marginTop: 20, flex: 1}}
                  textZoom={100}
                />
              </>
            )}
          </View>
        </Modal>

        <SafeAreaView style={{flex: 0, backgroundColor: Colors.white1}} />

        <View
          style={{
            width: (mobileW * 100) / 100,
            alignItems: 'center',
            backgroundColor: Colors.theamColor,
          }}>
          <View
            style={{
              width: (mobileW * 95) / 100,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              alignSelf: 'center',
              paddingVertical: (mobileW * 3) / 100,
            }}>
            <TouchableOpacity
              style={{width: (mobileW * 12) / 100}}
              onPress={() => this.props.navigation.goBack()}>
              <Image
                style={{
                  height: (mobileW * 6) / 100,
                  width: (mobileW * 6) / 100,
                  resizeMode: 'contain',
                }}
                source={localimag.goback}
              />
            </TouchableOpacity>
            <View
              style={{
                width: (mobileW * 71) / 100,
                alignItems: 'center',
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  fontSize: (mobileW * 5) / 100,
                  color: Colors.white_color,
                  fontFamily: Font.OutfitMedium,
                }}>
                {Lang_chg.Details_txt[config.language]}
              </Text>
            </View>
            <View style={{width: (mobileW * 12) / 100, alignItems: 'flex-end'}}>
              {/* <Image style={{ height: mobileW * 5 / 100, width: mobileW * 5 / 100, resizeMode: 'contain' }} source={localimag.whitedot} /> */}
            </View>
          </View>
        </View>
        <KeyboardAwareScrollView>
          {/* img-------------------------------------- */}
          {/* <ImageBackground imageStyle={{
                        borderBottomLeftRadius: mobileW * 3 / 100,
                        borderBottomRightRadius: mobileW * 3 / 100
                    }}
                        style={{ alignSelf: 'center', width: '100%', height: mobileW * 44 / 100, justifyContent: 'center' }}
                        source={localimag.dishfour}>
                    </ImageBackground> */}
          <ImageBackground
            imageStyle={{
              borderBottomLeftRadius: (mobileW * 3) / 100,
              borderBottomRightRadius: (mobileW * 3) / 100,
              resizeMode: 'cover',
            }}
            style={{
              alignSelf: 'center',
              width: (mobileW * 100) / 100,
              height: (mobileW * 65) / 100,
              justifyContent: 'center',
            }}
            // source={localimag.dishfour}>
            source={{
              uri: config.img_url + this.state.dining_facility_arr.image,
            }}></ImageBackground>
          {/* Main view-------------------------------------- */}
          <View
            style={{
              // shadowColor: Colors.shadowbuy, shadowOffset: { width: 1, height: 1 }, shadowOpacity: 0.5,
              // shadowRadius: 2, elevation: 2,
              width: (mobileW * 100) / 100,
              alignSelf: 'center',
              paddingVertical: (mobileW * 2) / 100,
              backgroundColor: '#fff',
              borderRadius: (mobileW * 1) / 100,
            }}>
            <View
              style={{
                flexDirection: 'row',
                width: '94%',
                alignSelf: 'center',
              }}>
              <View style={{width: '100%'}}>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      fontSize: (mobileW * 3.9) / 100,
                      fontFamily: Font.OutfitMedium,
                      color: Colors.neavyblue,
                    }}>
                    {/* {Lang_chg.Backyard[config.language]} */}
                    {this.state.dining_facility_arr.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: (mobileW * 3.7) / 100,
                      color: Colors.opengreen,
                      fontFamily: Font.Semibold,
                    }}>
                    {/* {Lang_chg.open[config.language]} */}
                    {this.state.dining_facility_arr.status == 1 && (
                      <Text
                        style={{
                          fontSize: (mobileW * 3.5) / 100,
                          color: Colors.opengreen,
                          marginLeft: mobileW * 0.02,
                          paddingVertical: 2,
                          fontFamily: Font.OutfitMedium,
                        }}>
                        {Lang_chg.Open[config.language]}
                      </Text>
                    )}
                    {this.state.dining_facility_arr.status == 0 && (
                      <Text
                        style={{
                          fontSize: (mobileW * 3.5) / 100,
                          color: Colors.red,
                          marginLeft: mobileW * 0.02,
                          paddingVertical: 2,
                          fontFamily: Font.OutfitMedium,
                        }}>
                        {Lang_chg.Close[config.language]}
                      </Text>
                    )}
                  </Text>
                </View>
                <View style={{width: '95%'}}>
                  <Text
                    style={{
                      fontSize: (mobileW * 3) / 100,
                      fontFamily: Font.Fontregular,
                      color: Colors.detailspring,
                    }}>
                    {/* Spring rolls recipe. firstly, the stuffing is ideally made with a combination of finely chopped vegetables as per your preference. but ensure to make them dice thinly and finely. otherwise, it may damage the sheets while folding. secondly, the stuffing may not necessarily have to be vegetables and you can use the combination of meat and vegetables. */}
                    {this.state.dining_facility_arr.description}
                  </Text>
                </View>
                {/* <View style={{
                                    flexDirection: 'row', alignSelf: 'center', width: '100%', marginTop: mobileW * 0.01,
                                    alignItems: 'center'
                                }}>
                                    <Image style={{ height: mobileW * 3.8 / 100, width: mobileW * 3.8 / 100, resizeMode: 'contain', }}
                                        source={localimag.breakfastimg} />
                                    <Text style={{
                                        fontSize: mobileW * 3.3 / 100, color: Colors.textgrey, fontFamily: Font.Fontregular,
                                        marginLeft: mobileW * 0.01,
                                    }}>
                                        {this.state.dining_facility_arr.category_name}
                                    </Text>
                                </View> */}
              </View>
            </View>
          </View>
          {/* comment by bhupendra  */}
          {/* <View style={{
                        width: '94%', alignSelf: 'center', borderColor: Colors.avalabilityBoxBorder, backgroundColor: '#FBFBFB',
                        borderWidth: mobileW * 0.002, borderRadius: mobileW * 0.02, marginTop: mobileW * 0.0, paddingVertical: MobileW * 1 / 100
                    }}>
                        <Text style={{ fontSize: mobileW * 3.7 / 100, width: '96%', alignSelf: 'center', marginTop: mobileW * 0.01, fontFamily: Font.OutfitMedium, color: Colors.theamColor }}>
                            {Lang_chg.Availabity_text[config.language]}</Text>
                        <FlatList
                            data={this.state.dining_facility_arr.getSchedule}
                            renderItem={({ item, index }) => {
                                return (
                                    <View style={{
                                        width: '96%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: MobileW * 1 / 100,
                                        marginTop: mobileW * 0.01
                                    }}>
                                        <Text style={{ fontSize: mobileW * 3.3 / 100, fontFamily: Font.Fontregular, color: Colors.textgrey }}>
                                            {item.days}</Text>
                                        <Text style={{ fontSize: mobileW * 3.2 / 100, color: Colors.textgrey, fontFamily: Font.Fontregular }}>
                                            {item.opening_time == 'NA' ?
                                                Lang_chg.closed[config.language] : item.opening_time
                                            }
                                            {item.opening_time == 'NA' ?
                                                null : '-' + item.closing_time
                                            }
                                        </Text>
                                    </View>

                                );
                            }}

                        ></FlatList>

                    </View> */}
          {/* comment by bhupendra  */}
          <Text
            style={{
              fontSize: (mobileW * 4) / 100,
              width: '94%',
              alignSelf: 'center',
              marginTop: mobileW * 0.03,
              fontFamily: Font.Semibold,
              color: Colors.neavyblue,
            }}>
            {Lang_chg.Order_info[config.language]}
          </Text>
          {/* radio------------------------------------- */}
          <View
            style={{
              flexDirection: 'row',
              width: '94%',
              alignItems: 'center',
              alignSelf: 'center',
              marginTop: mobileW * 0.01,
            }}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={{flexDirection: 'row', alignItems: 'center'}}
              onPress={() => {
                this.setState({show1: 0});
              }}>
              {this.state.show1 == 0 ? (
                <Image
                  source={localimag.radioon}
                  resizeMode="contain"
                  style={{
                    height: (mobileH * 6) / 100,
                    width: (mobileW * 6) / 100,
                  }}></Image>
              ) : (
                <Image
                  source={localimag.radiooof}
                  resizeMode="contain"
                  style={{
                    height: (mobileW * 6) / 100,
                    width: (mobileW * 6) / 100,
                  }}></Image>
              )}
              <Text
                style={{
                  fontSize: (mobileW * 3.5) / 100,
                  fontFamily: Font.Fontregular,
                  marginLeft: mobileW * 0.015,
                  color: Colors.textgrey,
                }}>
                {Lang_chg.Take_taxt[config.language]}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={{flexDirection: 'row', alignItems: 'center'}}
              onPress={() => {
                this.setState({show1: 1});
              }}>
              {this.state.show1 == 1 ? (
                <Image
                  source={localimag.radioon}
                  resizeMode="contain"
                  style={{
                    height: (mobileH * 6) / 100,
                    width: (mobileW * 6) / 100,
                    marginLeft: (mobileW * 10) / 100,
                  }}></Image>
              ) : (
                <Image
                  source={localimag.radiooof}
                  resizeMode="contain"
                  style={{
                    height: (mobileH * 6) / 100,
                    width: (mobileW * 6) / 100,
                    marginLeft: (mobileW * 10) / 100,
                  }}></Image>
              )}
              <Text
                style={{
                  fontSize: (mobileW * 3.5) / 100,
                  fontFamily: Font.Fontregular,
                  marginLeft: mobileW * 0.015,
                  color: Colors.textgrey,
                }}>
                {Lang_chg.Manual_taxt[config.language]}
              </Text>
            </TouchableOpacity>
          </View>
          {/* Condition For First Radio View------------------ */}
          {/* {this.state.show1 == 0 && */}
          {this.state.show1 == 0 ? (
            this.state.order_image == 'NA' ? (
              <TouchableOpacity
                onPress={() => this.setState({mediamodal: true})}>
                <View style={styles.dashed_box}>
                  <Image
                    source={localimag.img}
                    resizeMode="contain"
                    style={{
                      height: (mobileH * 9) / 100,
                      width: (mobileW * 15) / 100,
                    }}></Image>
                  <Text
                    style={{
                      fontSize: (mobileH * 2.5) / 100,
                      fontFamily: Font.Fontregular,
                      color: '#B0B0B0',
                    }}>
                    Upload Order Ticket
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <ImageBackground
                imageStyle={{borderRadius: (mobileW * 2) / 100}}
                style={{
                  // width: (mobileW * 20) / 100,
                  width: mobileW * 0.84,
                  height: (mobileW * 40) / 100,
                  marginTop: (mobileW * 5) / 100,
                  // backgroundColor: 'blue',
                  alignSelf: 'center',
                }}
                // source={item.img}
                // source={ uri: this.state.profile_pic }
                source={{uri: this.state.order_image}}></ImageBackground>
            )
          ) : (
            <View style={{width: '94%', alignSelf: 'center'}}>
              <View
                style={{
                  width: '100%',
                  alignSelf: 'center',
                  flexDirection: 'row',
                  marginTop: (mobileW * -1) / 100,
                  alignItems: 'center',
                }}>
                {/* name Image------------ */}
                <View style={{width: '8%', justifyContent: 'center'}}>
                  <Image
                    source={localimag.Usericonc2}
                    resizeMode="contain"
                    style={{
                      height: (mobileW * 5) / 100,
                      width: (mobileW * 5) / 100,
                    }}
                  />
                </View>
                {/* textInput--------- */}
                <View style={{width: '92%', justifyContent: 'center'}}>
                  <TextInput
                    placeholder={Lang_chg.Name_txt[config.language]}
                    onChangeText={txt => this.setState({name: txt})}
                    keyboardType="default"
                    selectionColor={Colors.textInputSelectionColor1}
                    placeholderTextColor={Colors.textgrey}
                    maxLength={50}
                    style={{
                      width: '95%',
                      fontSize: (mobileW * 3.8) / 100,
                      color: Colors.textgrey,
                      paddingVertical: (mobileH * 1) / 100,
                      fontFamily: Font.OutfitMedium,
                      textAlignVertical: 'center',
                      marginTop: mobileW * 0.01,
                    }}></TextInput>
                </View>
              </View>
              <View
                style={{
                  width: '100%',
                  height: (mobileW * 0.2) / 100,
                  backgroundColor: Colors.grey,
                  alignSelf: 'center',
                }}></View>

              <View
                style={{
                  width: '100%',
                  alignSelf: 'center',
                  flexDirection: 'row',
                  marginTop: mobileW * 0.02,
                  alignItems: 'center',
                }}>
                {/* name Image------------ */}
                <View style={{width: '8%', justifyContent: 'center'}}>
                  <Image
                    source={localimag.activatehistoryicon}
                    resizeMode="contain"
                    style={{
                      height: (mobileW * 5) / 100,
                      width: (mobileW * 5) / 100,
                    }}
                  />
                </View>
                {/* textInput--------- */}
                <View style={{width: '92%', justifyContent: 'center'}}>
                  <TextInput
                    placeholder={Lang_chg.Order_No[config.language]}
                    onChangeText={txt => this.setState({order_number: txt})}
                    keyboardType="default"
                    selectionColor={Colors.textInputSelectionColor1}
                    placeholderTextColor={Colors.textgrey}
                    maxLength={50}
                    style={{
                      width: '95%',
                      fontSize: (mobileW * 3.8) / 100,
                      color: Colors.textgrey,
                      paddingVertical: (mobileH * 1) / 100,
                      fontFamily: Font.OutfitMedium,
                      textAlignVertical: 'center',
                      marginTop: mobileW * 0.01,
                    }}></TextInput>
                </View>
              </View>
              <View
                style={{
                  width: '100%',
                  height: (mobileW * 0.2) / 100,
                  backgroundColor: Colors.grey,
                  alignSelf: 'center',
                }}></View>
            </View>
          )}

          <View
            style={{
              width: '90%',
              alignItems: 'center',
              flexDirection: 'row',
              backgroundColor: Colors.white_color,
              marginTop: (mobileW * 3) / 100,
              alignSelf: 'center',
              justifyContent: 'space-between',
              paddingVertical: (mobileW * 1) / 100,
            }}>
            <Text
              style={{
                fontSize: (mobileW * 3.9) / 100,
                color: Colors.light_grey,
                fontFamily: Font.OutfitMedium,
                textAlign: 'center',
              }}>
              {Lang_chg.Deliveryfeetext[config.language]}
            </Text>
            <Text
              style={{
                fontSize: (mobileW * 4) / 100,
                color: Colors.removecolor,
                fontFamily: Font.Semibold,
                textAlign: 'center',
              }}>
              ${this.state.amountVisible}
            </Text>
          </View>
          <DashedLine
            style={{
              marginTop: (mobileH * 0.8) / 100,
              marginBottom: (mobileH * 1) / 100,
              paddingHorizontal: (mobileW * 0.5) / 100,
              width: (mobileW * 92.4) / 100,
              alignSelf: 'center',
            }}
            dashColor={Colors.bottomborder}
            gap={8}
            dashThickness={0.6}
            dashLength={8}
          />

          <View
            style={{
              width: '90%',
              alignItems: 'center',
              flexDirection: 'row',
              backgroundColor: Colors.white_color,
              marginTop: (mobileW * 2) / 100,
              alignSelf: 'center',
              justifyContent: 'space-between',
              paddingVertical: (mobileW * 1) / 100,
            }}>
            <Text
              style={{
                fontSize: (mobileW * 3.9) / 100,
                color: Colors.light_grey,
                fontFamily: Font.OutfitMedium,
                textAlign: 'center',
              }}>
              {Lang_chg.Estimatetaxtext[config.language]}
            </Text>
            <Text
              style={{
                fontSize: (mobileW * 4) / 100,
                color: Colors.removecolor,
                fontFamily: Font.Semibold,
                textAlign: 'center',
              }}>
              ${this.state.estimated_tax_amount}
            </Text>
          </View>
          <DashedLine
            style={{
              marginTop: (mobileH * 0.8) / 100,
              marginBottom: (mobileH * 1) / 100,
              paddingHorizontal: (mobileW * 0.5) / 100,
              width: (mobileW * 92.4) / 100,
              alignSelf: 'center',
            }}
            dashColor={Colors.bottomborder}
            gap={8}
            dashThickness={0.6}
            dashLength={8}
          />
          <View
            style={{
              width: '90%',
              alignItems: 'flex-start',
              backgroundColor: Colors.white_color,
              alignSelf: 'center',
              marginTop: (mobileW * 3) / 100,
            }}>
            <Text
              style={{
                fontSize: (mobileW * 3.9) / 100,
                color: Colors.foodcolor,
                fontFamily: Font.OutfitMedium,
                textAlign: 'center',
              }}>
              {Lang_chg.choosetip[config.language]}
            </Text>
          </View>

          <FlatList
            data={this.state.food_arr}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => {
              return (
                <View
                  key={index}
                  style={{
                    marginTop: (mobileW * 1) / 100,
                    paddingVertical: (mobileW * 2) / 100,
                    width: (mobileW * 17) / 100,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingLeft: (mobileW * 2) / 100,
                  }}>
                  {this.state.tip_amount_selected != index ? (
                    <TouchableOpacity
                      onPress={() => {
                        //console.log("Click---->");
                        this.setState({tipAmountShow: item.text});

                        let to_pay = parseFloat(
                          this.state.total_customer_amount,
                        ).toFixed(2);
                        //console.log("intial to pay amount", to_pay);

                        let tip_amount = parseFloat(item.text).toFixed(2);

                        to_pay = (
                          parseFloat(to_pay) + parseFloat(tip_amount)
                        ).toFixed(2);

                        //console.log("total + tip amount", to_pay);

                        let serviceFee = ((to_pay * 2.9) / 100 + 0.3).toFixed(
                          2,
                        );

                        //console.log("first serviceFee", serviceFee);

                        serviceFee = (
                          parseFloat(serviceFee) +
                          parseFloat(this.state.percentageAmount)
                        ).toFixed(2);
                        //console.log(
                        //   "this.state.percentageAmount",
                        //   this.state.percentageAmount
                        // );
                        //console.log(
                        //   "serviceFee + percentage amount ",
                        //   serviceFee
                        // );

                        to_pay = (
                          parseFloat(to_pay) + parseFloat(serviceFee)
                        ).toFixed(2);

                        //console.log("serviceFee", serviceFee);

                        this.setState({serviceFee: serviceFee});

                        //console.log("to_pay--->", to_pay);
                        let amount = to_pay;
                        this.setState({
                          tip_amount_selected: item.id,
                          tip_amount: 0,
                          tip_amount_plus_fee: this.state.amountVisible,
                          to_pay: amount,
                        });
                      }}
                      style={{
                        width: (mobileW * 10) / 100,
                        backgroundColor: '#fff',
                        borderRadius: (mobileW * 10) / 100,
                        paddingVertical: (mobileW * 1) / 100,
                        alignItems: 'center',
                        shadowColor: Colors.shadowbuy,
                        shadowOffset: {width: 1, height: 1},
                        shadowOpacity: 0.5,
                        shadowRadius: 2,
                        elevation: 2,
                      }}>
                      <Text
                        style={{
                          fontSize: (mobileW * 3.4) / 100,
                          fontFamily: Font.fontsemibold,
                          color: Colors.removecolor,
                          textAlign: 'center',
                        }}>
                        {'$' + item.text}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        //console.log("tip");

                        let to_pay = parseFloat(
                          this.state.total_customer_amount,
                        ).toFixed(2);
                        //console.log("intial to pay amount", to_pay);

                        let tip_amount = 0;

                        to_pay = (
                          parseFloat(to_pay) + parseFloat(tip_amount)
                        ).toFixed(2);

                        //console.log("total + tip amount", to_pay);

                        let serviceFee = ((to_pay * 2.9) / 100 + 0.3).toFixed(
                          2,
                        );

                        //console.log("first serviceFee", serviceFee);

                        serviceFee = (
                          parseFloat(serviceFee) +
                          parseFloat(this.state.percentageAmount)
                        ).toFixed(2);
                        to_pay = (
                          parseFloat(to_pay) + parseFloat(serviceFee)
                        ).toFixed(2);
                        //console.log("serviceFee", serviceFee);

                        this.setState({serviceFee: serviceFee});

                        this.setState({
                          tip_amount_selected: 'NA',
                          to_pay: this.state.total,
                        });
                      }}
                      style={{
                        width: (mobileW * 10) / 100,
                        backgroundColor: Colors.removecolor,
                        borderRadius: (mobileW * 10) / 100,
                        paddingVertical: (mobileW * 1) / 100,
                        alignItems: 'center',
                        shadowColor: Colors.shadowbuy,
                        shadowOffset: {width: 1, height: 1},
                        shadowOpacity: 0.5,
                        shadowRadius: 2,
                        elevation: 2,
                        borderColor: Colors.white1,
                        borderWidth: 1,
                      }}>
                      <Text
                        style={{
                          fontSize: (mobileW * 3.4) / 100,
                          fontFamily: Font.OutfitMedium,
                          color: Colors.white_color,
                          textAlign: 'center',
                        }}>
                        {'$' + item.text}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            }}
          />

          <TouchableOpacity
            onPress={() => {
              this.setState({
                tip_amount_selected: 'NA',
                modalVisible: true,
              });
            }}
            style={{
              width: (mobileW * 20) / 100,
              backgroundColor:
                this.state.tip_amount != 0 ? Colors.removecolor : '#fff',
              borderRadius: (mobileW * 10) / 100,
              paddingVertical: (mobileW * 2) / 100,
              alignItems: 'center',
              marginLeft: (mobileW * 4) / 100,
              shadowColor: Colors.shadowbuy,
              shadowOffset: {width: 1, height: 1},
              shadowOpacity: 0.5,
              shadowRadius: 2,
              elevation: 2,
            }}>
            <Text
              style={{
                fontSize: (mobileW * 3.4) / 100,
                fontFamily: Font.OutfitMedium,
                color:
                  this.state.tip_amount != 0
                    ? Colors.white_color
                    : Colors.removecolor,
                textAlign: 'center',
              }}>
              {Lang_chg.custom[config.language]}
            </Text>
          </TouchableOpacity>
          {/* <View style={{ width: '90%', alignItems: 'center', flexDirection: 'row', backgroundColor: Colors.white_color, marginTop: mobileW * 3 / 100, alignSelf: 'center', justifyContent: 'space-between', paddingVertical: mobileW * 1 / 100, }}>
                                            <Text style={{ fontSize: mobileW * 3.9 / 100, color: Colors.light_grey,
                                             fontFamily: Font.OutfitMedium, textAlign: 'center' }}>{Lang_chg.TipAmountText[config.language]}</Text>
                                            <Text style={{ fontSize: mobileW * 4 / 100, color: Colors.removecolor, fontFamily: Font.Semibold, textAlign: 'center' }}>
                                                ${this.state.tipAmountShow}
                                            </Text>
                                        </View> */}
          <DashedLine
            style={{
              marginTop: (mobileH * 0.8) / 100,
              marginBottom: (mobileH * 1) / 100,
              paddingHorizontal: (mobileW * 0.5) / 100,
              width: (mobileW * 92.4) / 100,
              alignSelf: 'center',
            }}
            dashColor={Colors.bottomborder}
            gap={8}
            dashThickness={0.6}
            dashLength={8}
          />
          <View
            style={{
              width: '90%',
              alignItems: 'center',
              flexDirection: 'row',
              backgroundColor: Colors.white_color,
              marginTop: (mobileW * 2) / 100,
              alignSelf: 'center',
              justifyContent: 'space-between',
              paddingVertical: (mobileW * 1) / 100,
            }}>
            <Text
              style={{
                fontSize: (mobileW * 3.9) / 100,
                color: Colors.light_grey,
                fontFamily: Font.OutfitMedium,
                textAlign: 'center',
              }}>
              {Lang_chg.serviceFeeText[config.language]}
            </Text>
            <Text
              style={{
                fontSize: (mobileW * 4) / 100,
                color: Colors.removecolor,
                fontFamily: Font.Semibold,
                textAlign: 'center',
              }}>
              ${this.state.serviceFee}
            </Text>
          </View>
          <DashedLine
            style={{
              marginTop: (mobileH * 0.8) / 100,
              marginBottom: (mobileH * 1) / 100,
              paddingHorizontal: (mobileW * 0.5) / 100,
              width: (mobileW * 92.4) / 100,
              alignSelf: 'center',
            }}
            dashColor={Colors.bottomborder}
            gap={8}
            dashThickness={0.6}
            dashLength={8}
          />

          {/* <View style={{
                        width: '90%', alignItems: 'center', flexDirection: 'row',
                        backgroundColor: Colors.white_color,
                        marginTop: mobileW * 5 / 100,
                        alignSelf: 'center',
                        justifyContent: 'space-between', paddingVertical: mobileW * 0.015,
                    }}>
                        <Text style={{
                            fontSize: mobileW * 3.9 / 100,
                            color: Colors.light_grey,
                            fontFamily: Font.OutfitMedium,
                            textAlign: 'center'
                        }}>{Lang_chg.deliveryfee[config.language]}</Text>
                        <Text style={{
                            fontSize: mobileW * 4 / 100, color: Colors.removecolor, fontFamily: Font.Semibold,
                            textAlign: 'center'
                        }}> ${this.state.amountVisible}
                            </Text>
                    </View> */}
          {/* <DashedLine style={{
                        marginTop: mobileH * 0.8 / 100, marginBottom: mobileH * 1 / 100,
                        paddingHorizontal: mobileW * 0.5 / 100, width: mobileW * 92.4 / 100, alignSelf: 'center'
                    }}
                        dashColor={Colors.dashcolor} gap={8} dashThickness={0.6} dashLength={8} /> */}

          {/* <View style={{ width: '90%', alignItems: 'center', flexDirection: 'row', backgroundColor: Colors.white_color, marginTop: mobileW * 3 / 100, alignSelf: 'center', justifyContent: 'space-between', paddingVertical: mobileW * 1 / 100, }}>
                        <Text style={{ fontSize: mobileW * 3.9 / 100, color: Colors.light_grey, fontFamily: Font.OutfitMedium, textAlign: 'center' }}>
                            {Lang_chg.estimated_tax_percent_1[config.language] + this.state.estimated_tax_per + Lang_chg.estimated_tax_percent_2[config.language]}
                        </Text>
                        <Text style={{ fontSize: mobileW * 4 / 100, color: Colors.removecolor, fontFamily: Font.Semibold, textAlign: 'center' }}>
                            ${this.state.estimated_tax_amount}
                        </Text>
                    </View>
                    <DashedLine style={{ marginTop: mobileH * 0.8 / 100, marginBottom: mobileH * 1 / 100, paddingHorizontal: mobileW * 0.5 / 100, width: mobileW * 92.4 / 100, alignSelf: 'center' }} dashColor={Colors.bottomborder} gap={8} dashThickness={0.6} dashLength={8} /> */}

          {/* <View style={{ width: '90%', alignItems: 'center', flexDirection: 'row', backgroundColor: Colors.white_color, marginTop: mobileW * 3 / 100, alignSelf: 'center', justifyContent: 'space-between', paddingVertical: mobileW * 1 / 100, }}>
                        <Text style={{ fontSize: mobileW * 3.9 / 100, color: Colors.light_grey, fontFamily: Font.OutfitMedium, textAlign: 'center' }}>{Lang_chg.total_Payable_amount[config.language]}</Text>
                        <Text style={{ fontSize: mobileW * 4 / 100, color: Colors.removecolor, fontFamily: Font.Semibold, textAlign: 'center' }}>
                            ${this.state.to_pay}
                        </Text>
                    </View> */}
          {/* <DashedLine style={{ marginTop: mobileH * 0.8 / 100, marginBottom: mobileH * 1 / 100, paddingHorizontal: mobileW * 0.5 / 100, width: mobileW * 92.4 / 100, alignSelf: 'center' }} dashColor={Colors.bottomborder} gap={8} dashThickness={0.6} dashLength={8} /> */}

          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('Location', {order_type: 1});
            }}
            style={{
              flexDirection: 'row',
              width: (mobileW * 92) / 100,
              alignSelf: 'center',
              justifyContent: 'center',
              marginTop: (mobileW * 2) / 100,
              borderBottomColor: Colors.bottomborder,
              borderBottomWidth: 1,
              paddingVertical: (mobileW * 2) / 100,
            }}>
            <Image
              style={{
                height: (mobileW * 4.9) / 100,
                width: (mobileW * 4.9) / 100,
                resizeMode: 'contain',
                alignSelf: 'center',
              }}
              source={localimag.location}></Image>
            <View
              style={{
                flexDirection: 'row',
                width: (mobileW * 87) / 100,
                alignItems: 'center',
                justifyContent: 'space-between',
                marginLeft: (mobileW * 1) / 100,
              }}>
              <Text
                style={{
                  fontSize: (mobileW * 3.8) / 100,
                  fontFamily: Font.OutfitMedium,
                  color: Colors.grey,
                  textAlign: 'center',
                }}>
                {this.state.address == '' || this.state.address == undefined
                  ? Lang_chg.location[config.language]
                  : this.state.address}
              </Text>
              <Image
                style={{
                  height: (mobileW * 4) / 100,
                  width: (mobileW * 4) / 100,
                  resizeMode: 'contain',
                }}
                source={localimag.arrowleft}></Image>
            </View>
          </TouchableOpacity>

          {/* <Text style={{ fontSize: mobileW * 4 / 100, color:'red', 
                            fontFamily: Font.OutfitMedium, textAlign: 'center',marginTop:mobileW*5/100  }}>
                        The Udliverer will use their unlimited meal swipe to pickup and delivery your order.
                        </Text> */}

          {/* pay now */}

          {/* <TouchableOpacity
                        onPress={() => {
                            if (this.state.show1 == 0 && this.state.order_image == '')
                            {
                                
                                    msgProvider.toast(msgText.Please_upload_Order_Ticket[config.language], 'center');
                                    return false;
                                    
                            }
                            if (this.state.show1 == 1 && this.state.name == '') {
                                //FULL NAME
                                msgProvider.toast(msgText.enterfullname[config.language], 'center');
                                return false;
                            }
                            if (this.state.show1 == 1 && this.state.name.trim().length < 3) {
                                msgProvider.toast(msgText.fullnameminimumcharacter[config.language], 'center');
                                return false;
                            }
                            if (this.state.show1 == 1 && this.state.order_number == '') {
                                //FULL NAME
                                msgProvider.toast(msgText.enter_ordernumber[config.language], 'center');
                                return false;
                            }
                            if (this.state.show1 == 1 && this.state.order_number.trim().length < 3) {
                                msgProvider.toast(msgText.ordernumber_minimumcharacter[config.language], 'center');
                                return false;
                            }
                            if (this.state.address == '') {
                                //txtAddress
                                consolepro.consolelog('enter full address');
                                msgProvider.toast(msgText.enterDeliveryAddress2[config.language], 'center');
                                return false;
                            }
                            
                            this.props.navigation.navigate('Paynow')
                        }}
                                style={{
                                    marginTop: mobileW * 15 / 100, flexDirection: 'row', width: mobileW * 90 / 100,
                                    alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                    borderRadius: mobileW * 1 / 100, marginBottom: mobileW * 0.05,
                                    padding: mobileW * 4 / 100, backgroundColor: Colors.removecolor
                                }}>
                                <Text style={{
                                    fontSize: mobileW * 3.8 / 100, color: Colors.white_color,
                                    fontFamily: Font.OutfitMedium, textAlign: 'center', paddingLeft: 3.5
                                }}>
                                    {Lang_chg.paynow[config.language]}
                                </Text>
                            </TouchableOpacity> */}

          {/* <TouchableOpacity onPress={() => {
                        if (this.state.address == '' || this.state.address == undefined) {
                            //txtAddress
                            consolepro.consolelog('enter full address');
                            msgProvider.toast(msgText.enterDeliveryAddress2[config.language], 'center');
                            return false;
                        }


                        // consolepro.consolelog('cart_arr',this.state.add_to_cart_arr[0].item_name);
                        console.log('i am here');
                        console.log(this.state.add_to_cart_arr);
                        // return
                        // this.props.navigation.navigate('Paynow', { txn_id: '234432' })
                        // this.props.navigation.navigate('Paynow',{'txn_id':this.state.txn_id})


                        // return false;
                        let to_pay =
                            this.state.tip_amount_selected == 'NA' ? this.state.amount : this.state.amountVisible + this.state.food_arr[this.state.tip_amount_selected - 1].text

                        setTimeout(() => { this.setState({ to_pay: to_pay, webviewshow: true }) }, 300);
                        // setTimeout(() => { this.setState({ to_pay: 300, webviewshow: true }) }, 300);

                        // this.CreateOrder()
                    }}
                        style={{
                            marginTop: mobileW * 25 / 100,
                            flexDirection: 'row', width: mobileW * 90 / 100,
                            alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderRadius: mobileW * 1 / 100, padding: mobileW * 4 / 100, backgroundColor: Colors.removecolor
                        }}>
                        {this.state.tip_amount_selected == 'NA' ?
                            <Text style={{ fontSize: mobileW * 4.3 / 100, color: Colors.white_color, fontFamily: Font.OutfitMedium, textAlign: 'center', }}>
                                {Lang_chg.paynow[config.language]}



                                {
                                    // this.state.amountVisible
                                    // +
                                    // this.state.tip_amount
                                    this.state.tip_amount_plus_fee

                                }


                                {Lang_chg.close_bracket[config.language]}
                            </Text> :
                            <Text style={{ fontSize: mobileW * 4.3 / 100, color: Colors.white_color, fontFamily: Font.OutfitMedium, textAlign: 'center', }}>
                                {Lang_chg.paynow[config.language]}

                                {this.state.amountVisible + this.state.food_arr[this.state.tip_amount_selected - 1].text}
                                {Lang_chg.close_bracket[config.language]}
                            </Text>



                        }
                    </TouchableOpacity> */}
          {/* <TouchableOpacity onPress={() => {
                        if (this.state.address == '' || this.state.address == undefined) {
                            //txtAddress
                            consolepro.consolelog('enter full address');
                            msgProvider.toast(msgText.enterDeliveryAddress2[config.language], 'center');
                            return false;
                        }


                        // consolepro.consolelog('cart_arr',this.state.add_to_cart_arr[0].item_name);
                        console.log('i am here');
                        console.log(this.state.add_to_cart_arr);
                        // return
                        // this.props.navigation.navigate('Paynow', { txn_id: '234432' })
                        // this.props.navigation.navigate('Paynow',{'txn_id':this.state.txn_id})


                        // return false;
                        let to_pay =
                            this.state.tip_amount_selected == 'NA' ? this.state.amount : this.state.amountVisible + this.state.food_arr[this.state.tip_amount_selected - 1].text

                        setTimeout(() => { this.setState({ to_pay: to_pay, webviewshow: true }) }, 300);

                        // this.CreateOrder()
                    }}
                        style={{
                            marginTop: mobileW * 25 / 100,
                            flexDirection: 'row', width: mobileW * 90 / 100,
                            alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderRadius: mobileW * 1 / 100, padding: mobileW * 4 / 100, backgroundColor: Colors.removecolor
                        }}>
                        {this.state.tip_amount_selected == 'NA' ?
                            <Text style={{ fontSize: mobileW * 4.3 / 100, color: Colors.white_color, fontFamily: Font.OutfitMedium, textAlign: 'center', }}>
                                {Lang_chg.paynow[config.language]}



                                {
                                    // this.state.amountVisible
                                    // +
                                    // this.state.tip_amount
                                    this.state.tip_amount_plus_fee +
                                    this.state.estimated_tax_amount
                                    // 20

                                }


                                {Lang_chg.close_bracket[config.language]}
                            </Text> :
                            <Text style={{ fontSize: mobileW * 4.3 / 100, color: Colors.white_color, fontFamily: Font.OutfitMedium, textAlign: 'center', }}>
                                {Lang_chg.paynow[config.language]}

                                {this.state.amountVisible + this.state.estimated_tax_amount + this.state.food_arr[this.state.tip_amount_selected - 1].text}
                                {Lang_chg.close_bracket[config.language]}
                            </Text>



                        }
                    </TouchableOpacity> */}
          {this.state.dining_facility_arr.status == 1 && (
            <TouchableOpacity
              onPress={() => {
                if (this.state.dining_facility_arr.status == 1) {
                  if (this.state.order_image == 'NA' && this.state.show1 == 0) {
                    msgProvider.toast(
                      msgText.Please_upload_order_ticket[config.language],
                      'center',
                    );
                    return false;
                  }
                  if (this.state.name == '' && this.state.show1 == 1) {
                    //txtAddress
                    msgProvider.toast(
                      msgText.enterfullname[config.language],
                      'center',
                    );
                    return false;
                  }
                  if (this.state.name.length < 3 && this.state.show1 == 1) {
                    //txtAddress
                    msgProvider.toast(
                      msgText.fullnameminimumcharacter[config.language],
                      'center',
                    );
                    return false;
                  }
                  if (this.state.order_number == '' && this.state.show1 == 1) {
                    //txtAddress
                    msgProvider.toast(
                      msgText.enter_ordernumber[config.language],
                      'center',
                    );
                    return false;
                  }
                  if (
                    this.state.order_number.length < 3 &&
                    this.state.show1 == 1
                  ) {
                    //txtAddress
                    msgProvider.toast(
                      msgText.ordernumber_minimumcharacter[config.language],
                      'center',
                    );
                    return false;
                  }
                  if (
                    this.state.address == '' ||
                    this.state.address == undefined
                  ) {
                    consolepro.consolelog('enter full address');
                    msgProvider.toast(
                      msgText.enterDeliveryAddress2[config.language],
                      'center',
                    );
                    return false;
                  }

                  if (this.state.payment_status == 1) {
                    setTimeout(() => {
                      this.setState({webviewshow: true});
                    }, 300);
                  } else {
                    this.CreateOrder();
                  }
                }
              }}
              style={{
                marginTop: (mobileW * 10) / 100,
                flexDirection: 'row',
                width: (mobileW * 90) / 100,
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: (mobileW * 1) / 100,
                padding: (mobileW * 4) / 100,
                backgroundColor: Colors.removecolor,
              }}>
              {this.state.payment_status == 1 ? (
                <>
                  {this.state.tip_amount_selected == 'NA' ? (
                    <Text
                      style={{
                        fontSize: (mobileW * 4.3) / 100,
                        color: Colors.white_color,
                        fontFamily: Font.OutfitMedium,
                        textAlign: 'center',
                      }}>
                      {Lang_chg.paynow[config.language]}
                      {this.state.to_pay}
                      {Lang_chg.close_bracket[config.language]}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontSize: (mobileW * 4.3) / 100,
                        color: Colors.white_color,
                        fontFamily: Font.OutfitMedium,
                        textAlign: 'center',
                      }}>
                      {Lang_chg.paynow[config.language]}
                      {this.state.to_pay}
                      {Lang_chg.close_bracket[config.language]}
                    </Text>
                  )}
                </>
              ) : (
                <>
                  <Text
                    style={{
                      fontSize: (mobileW * 4.3) / 100,
                      color: Colors.white_color,
                      fontFamily: Font.OutfitMedium,
                      textAlign: 'center',
                    }}>
                    {Lang_chg.Continue[config.language]}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}

          <View style={{marginTop: (mobileW * 2) / 100}}></View>

          <Modal
            animationType="slide"
            transparent={true}
            //contentContainerStyle={{ paddingBottom: mobileW * 20 / 100 }}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              this.setState({modalVisible: false});
            }}>
            <View
              style={{
                backgroundColor: '#00000080',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 20,
                marginTop: -50,
              }}>
              {/* <StatusBar backgroundColor={Colors.theamColor} barStyle='default' hidden={false} translucent={false}
                                networkActivityIndicatorVisible={true} /> */}
              <View
                style={{
                  borderRadius: 20,
                  width: (mobileW * 80) / 100,
                  position: 'absolute',
                  alignSelf: 'center',
                }}>
                <View
                  style={{
                    backgroundColor: Colors.white_color,
                    borderRadius: (mobileW * 4) / 100,
                    width: '100%',
                    paddingVertical: (mobileW * 2) / 100,
                    paddingBottom: (mobileW * 7) / 100,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({modalVisible: false});
                    }}
                    style={{
                      alignSelf: 'flex-end',
                      width: '15%',
                      justifyContent: 'flex-end',
                    }}>
                    <Image
                      style={{
                        height: (mobileW * 8) / 100,
                        width: (mobileW * 8) / 100,
                        resizeMode: 'contain',
                      }}
                      source={localimag.wrong}></Image>
                  </TouchableOpacity>

                  <View
                    style={{
                      width: (mobileW * 80) / 100,
                      marginTop: (mobileW * -2) / 100,
                    }}>
                    <Image
                      style={{
                        height: (mobileW * 17) / 100,
                        width: (mobileW * 17) / 100,
                        resizeMode: 'contain',
                        alignSelf: 'center',
                      }}
                      source={localimag.modaldoller}></Image>
                  </View>
                  <View
                    style={{
                      // backgroundColor:'red',
                      alignItems: 'center',
                      flexDirection: 'row',
                      width: (mobileW * 70) / 100,
                      alignSelf: 'center',
                      marginBottom: (mobileW * 4) / 100,
                      borderBottomColor: Colors.bottomborder,
                      borderBottomWidth: 1,
                      paddingVertical: (mobileW * 2) / 100,
                    }}>
                    {/* <Text style={{ fontSize: mobileW * 5 / 100, color: Colors.textgrey, textAlign: 'center', }}>$</Text> */}
                    {/* <Text style={{ fontSize: mobileW * 5.3 / 100, fontFamily: Font.fontsemibold, color: Colors.mediumgrey, textAlign: 'center', }}> 2.2</Text> */}

                    <Text
                      style={{
                        fontSize: (mobileW * 5) / 100,
                        color: Colors.textgrey,
                        textAlign: 'center',
                      }}>
                      $
                    </Text>

                    <TextInput
                      //  ref={tipRef}
                      autoFocus={true}
                      selectionColor={Colors.textInputSelectionColor1}
                      onChangeText={txt => {
                        this.setState({tip_amount: txt, tipAmountShow: txt});
                      }}
                      value={this.state.tip_amount?.toString()}
                      // placeholder={Lang_chg.Email_txt[config.language]}
                      keyboardType="number-pad"
                      placeholderTextColor={Colors.white1}
                      maxLength={100}
                      style={{
                        // backgroundColor: 'red',
                        width: '95%',
                        fontSize: (mobileW * 5) / 100,
                        color: Colors.textgrey,
                        // paddingVertical: mobileH * 1 / 100, marginTop: mobileW * 0.01,
                        fontFamily: Font.OutfitMedium,
                        textAlignVertical: 'center',
                      }}></TextInput>
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      let tip_amount = parseFloat(
                        this.state.tip_amount,
                      ).toFixed(2);

                      if (tip_amount < 0) {
                        msgProvider.toast(
                          msgText.Tip_amount_must[config.language],
                          'center',
                        );
                        return false;
                      }

                      //console.log("Click---->");
                      this.setState({tipAmountShow: tip_amount});

                      let to_pay = parseFloat(
                        this.state.total_customer_amount,
                      ).toFixed(2);
                      //console.log("intial to pay amount", to_pay);

                      to_pay = (
                        parseFloat(to_pay) + parseFloat(tip_amount)
                      ).toFixed(2);

                      //console.log("total + tip amount", to_pay);

                      let serviceFee = ((to_pay * 2.9) / 100 + 0.3).toFixed(2);

                      //console.log("first serviceFee", serviceFee);

                      serviceFee = (
                        parseFloat(serviceFee) +
                        parseFloat(this.state.percentageAmount)
                      ).toFixed(2);
                      //console.log(
                      //   "this.state.percentageAmount",
                      //   this.state.percentageAmount
                      // );
                      //console.log(
                      //   "serviceFee + percentage amount ",
                      //   serviceFee
                      // );

                      to_pay = (
                        parseFloat(to_pay) + parseFloat(serviceFee)
                      ).toFixed(2);

                      //console.log("serviceFee", serviceFee);

                      this.setState({serviceFee: serviceFee});

                      //console.log("to_pay--->", to_pay);
                      let amount = to_pay;
                      this.setState({
                        modalVisible: false,
                        // tip_amount_selected: item.id,
                        // tip_amount: 0,
                        tip_amount_plus_fee: this.state.amountVisible,
                        to_pay: amount,
                      });
                    }}
                    style={{
                      marginTop: (mobileW * 2) / 100,
                      flexDirection: 'row',
                      width: (mobileW * 70) / 100,
                      alignSelf: 'center',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: (mobileW * 1) / 100,
                      padding: (mobileW * 4) / 100,
                      backgroundColor: Colors.removecolor,
                    }}>
                    <Text
                      style={{
                        fontSize: (mobileW * 3.8) / 100,
                        color: Colors.white_color,
                        fontFamily: Font.Fontregular,
                        textAlign: 'center',
                        paddingLeft: 3.5,
                      }}>
                      {Lang_chg.paytip[config.language]}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  dashed_box: {
    alignItems: 'center',
    borderColor: '#C3C3C3',
    width: mobileW * 0.84,
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: (mobileW * 0.7) / 100,
    borderStyle: 'dashed',
    marginTop: (mobileH * 2) / 100,
    borderRadius: mobileW * 0.02,
    paddingVertical: mobileW * 0.09,
    backgroundColor: Colors.white1,
  },
});
