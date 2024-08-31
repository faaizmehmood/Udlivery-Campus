import {
  Text,
  View,
  ImageBackground,
  Image,
  TextInput,
  Dimensions,
  Switch,
  SafeAreaView,
  FlatList,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  Modal,
  BackHandler,
  Alert,
} from 'react-native';
import React, {Component} from 'react';
const MobileW = Dimensions.get('window').width;
const MobileH = Dimensions.get('window').height;
import RBSheet from 'react-native-raw-bottom-sheet';
import DatePicker from 'react-native-date-picker';
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
} from '../Provider/utilslib/Utils';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {mediaprovider, Cameragallery} from '../Provider/utilslib/Utils';
import axios from 'axios';

// import { createToken, initStripe, Token } from '@stripe/stripe-react-native';

global.date_1 = new Date();
export default class Driver_Add_Withrawal extends Component {
  constructor(props) {
    super(props);

    const params = this.props.route.params;

    this.state = {
      edit: params.edit,
      showType: params.showCardType,
      mediamodal: false,
      activeImg: '',

      // card: '4242 4242 4242 4242',
      // venmo: 'sfsd@sfd.sdf',
      // paypal: 'sfsd@sfd.sdf',

      firstname: '',
      lastname: '',
      email: '',
      mobile_number: '',

      card: '',
      cardHoldername: '',
      Date_of_Birth: '', // It is for Date of Birth
      edate: '', // It is for Card Expirey Date
      address_1: '',
      city: '',
      state: '',
      zip_code: '',
      tax_id: '',

      row_date: date_1,
      selected_date: '',
      selected_date_1: '',
      datetoselect: '',
      sdate: '',

      cardCVV: '',

      // card_token: '',

      photo_id_front: '',
      photo_id_back: '',
      additional_doc: '',

      // venmo: null,
      // paypal: '',
      user_id: 0,
      id: '',
    };
    this._didFocusSubscription = props.navigation.addListener(
      'focus',
      payload =>
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress),
    );
  }

  componentDidMount = () => {
    if (this.props.route.params != undefined) {
      const {edit, showCardType} = this.props.route.params;
      this.setState({
        edit: edit,
        showType: showCardType,
      });

      console.log(
        'This showType is coming from the Driver_Add_WithDrwawal.js Screen ',
        this.state.showType,
      );

      this._willBlurSubscription = this.props.navigation.addListener(
        'blur',
        payload =>
          BackHandler.removeEventListener(
            'hardwareBackPress',
            this.handleBackPress,
          ),
      );
    }
    this.getUserDetail();
  };

  getUserDetail = async () => {
    let userdata = await localStorage.getItemObject('user_arr');
    consolepro.consolelog('userdata', userdata);
    this.setState({
      user_id: userdata.user_id,
    });
  };

  add_withdraw_detail = async () => {
    let url = config.baseURL + 'withdraw/add_extra_details.php';
    var data = new FormData();
    data.append('user_id', this.state.user_id);
    data.append('firstname', this.state.firstname);
    data.append('lastname', this.state.lastname);
    data.append('email', this.state.email);
    data.append('phone_number', this.state.mobile_number);
    data.append('dateofbirth', this.state.Date_of_Birth);
    data.append('address', this.state.address_1);
    data.append('city', this.state.city);
    data.append('state', this.state.state);
    data.append('zip_code', this.state.zip_code);
    data.append('ssn_number', this.state.tax_id);

    data.append('card', this.state.card);
    // data.append('venmo', this.state.venmo);
    // data.append('paypal', this.state.paypal);
    data.append('cardholder_name', this.state.cardHoldername);
    // data.append('stripe_account_id', this.state.stripe_Account_ID);
    data.append('card_cvc', this.state.cardCVV);
    data.append('card_expiry_date', this.state.edate);

    if (
      this.state.photo_id_front &&
      this.state.photo_id_back &&
      this.state.additional_doc
    ) {
      if (this.state.photo_id_front != 'NA') {
        data.append('photo_fron_id', {
          uri: this.state.photo_id_front,
          type: 'image/jpg',
          name: 'image.jpg',
        });
      }
      if (this.state.photo_id_back != 'NA') {
        data.append('photo_back_id', {
          uri: this.state.photo_id_back,
          type: 'image/jpg',
          name: 'image.jpg',
        });
      }
      if (this.state.additional_doc != 'NA') {
        data.append('additional_doc', {
          uri: this.state.additional_doc,
          type: 'image/jpg',
          name: 'image.jpg',
        });
      }
    }
    apifuntion
      .postApi(url, data)
      .then(obj => {
        // console.log("OBJECT", obj)
        if (obj.success == 'true') {
          this.props.navigation.navigate('Driver_Home');
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
        console.log('-------- error ------- ', error);
        msgProvider.alert(
          msgTitle.internet[config.language],
          msgText.networkconnection[config.language],
          false,
        );
      });
  };

  edit_validation = () => {
    this.add_withdraw_detail();
  };

  //back handler
  handleBackPress = () => {
    {
      this.state.edit == true
        ? this.props.navigation.navigate('Driver_Add_Payment_Options')
        : this.props.navigation.goBack();
    }
    return true;
  };

  //------------for close date picker--------------//
  _closeDatePicker = () => {
    this.DatePicker.close();
  };
  //-------for set date to variable----------
  setDate = d => {
    this.setState({row_date: d});
    // date = new Date();
    // consolepro.consolelog(this.state.row_date);
  };
  //------set date to today's date

  setTodayDate = () => {
    let newDate = new Date();
    this.setState({row_date: newDate});
  };

  //----------for set selected date---------
  //----------------------select date function-------------------//
  Select_date_check = async date => {
    var d = new Date(this.state.row_date);
    consolepro.consolelog({d});
    if (d != '') {
      var m = d.getMonth() + 1;
      var y = d.getFullYear();
      var date = d.getDate();
      if (m.toString().length == 1) {
        m = '0' + m;
      }
      if (date.toString().length == 1) {
        date = '0' + date;
      }
      var fulldate = date + '/' + m + '/' + y;
      var fulldate1 = y + '-' + m + '-' + date;
    } else {
      let d = new Date();
      var m = d.getMonth() + 1;
      var y = d.getFullYear();
      var date = d.getDate();
      if (m.toString().length == 1) {
        m = '0' + m;
      }
      if (date.toString().length == 1) {
        date = '0' + date;
      }
      var fulldate = date + '/' + m + '/' + y;
      var fulldate1 = y + '-' + m + '-' + date;
    }
    consolepro.consolelog({fulldate, fulldate1});

    consolepro.consolelog(' i am in select date ');

    var d = new Date(fulldate);
    this.setState({
      selected_date: fulldate,
      selected_date_1: fulldate1,
    });

    this.state.datetoselect == 1
      ? this.setState({datetoselect: '', sdate: fulldate1})
      : this.setState({datetoselect: '', Date_of_Birth: fulldate1});

    this.DatePicker.close();
  };

  //-------------------image
  //-----------------for camera open----------------------

  Camerapopen = async () => {
    mediaprovider
      .launchCamera(false)
      .then(res => {
        let tmp = res.path;

        if (this.state.activeImg == 'photo_id_front') {
          this.setState({
            mediamodal: false,
            photo_id_front: tmp,
          });
        } else if (this.state.activeImg == 'photo_id_back') {
          this.setState({
            mediamodal: false,
            photo_id_back: tmp,
          });
        } else if (this.state.activeImg == 'additional_doc') {
          this.setState({
            mediamodal: false,
            additional_doc: tmp,
          });
        }
        consolepro.consolelog(res.path);
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

  handleChangeText = text => {
    let value = text;
    const rawValue = text.replace(/:/g, '');
    value = rawValue.replace(/\D/g, '');
    if (value.length > 2) {
      value = `${value.slice(0, 2)} / ${value.slice(2)}`;
    }
    value = value.toUpperCase();

    this.setState({edate: value});

    if (this.props.onChange) {
      text = value;
      this.props.onChange(event);
    }
  };

  //-----------------------------function to access images from gallery

  Galleryopen = () => {
    consolepro.consolelog('gallery open clicked');
    mediaprovider
      // .launchGellery(true)
      .launchGellery(false)
      .then(res => {
        let tmp = res.path;

        if (this.state.activeImg == 'photo_id_front') {
          this.setState({
            mediamodal: false,
            photo_id_front: tmp,
          });
        } else if (this.state.activeImg == 'photo_id_back') {
          this.setState({
            mediamodal: false,
            photo_id_back: tmp,
          });
        } else if (this.state.activeImg == 'additional_doc') {
          this.setState({
            mediamodal: false,
            additional_doc: tmp,
          });
        }
        consolepro.consolelog(res.path);
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

  render() {
    return (
      <View style={{flex: 1, backgroundColor: Colors.theamColor}}>
        {/* Date Picker Sheet 1 */}

        <RBSheet
          ref={ref => {
            this.DatePicker = ref;
          }}
          height={300}
          openDuration={200}
          closeDuration={200}
          customStyles={{
            container: {},
          }}>
          <View
            style={{
              backgroundColor: Colors.theme_color,
              paddingLeft: 20,
              paddingRight: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                width: (mobileW * 15) / 100,
                paddingVertical: (mobileH * 3) / 100,
                alignItems: 'center',
              }}
              onPress={() => {
                this._closeDatePicker();
                // this.setTodayDate();
              }}>
              <Text
                style={{color: Colors.whiteColor, fontFamily: Font.fontbold}}>
                {Lang_chg.close_txt[config.language]}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                width: (mobileW * 15) / 100,
                paddingVertical: (mobileH * 3) / 100,
                alignItems: 'center',
              }}
              onPress={() => {
                this.Select_date_check();
                // this.setTodayDate();
              }}>
              <Text
                style={{color: Colors.whiteColor, fontFamily: Font.fontbold}}>
                {Lang_chg.done_txt[config.language]}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <DatePicker
              date={new Date(this.state.row_date)}
              onDateChange={date => this.setDate(date)}
              mode="date"
              // minimumDate={this.state.sdate != '' && this.state.sdate}
              // minimumDate={this.state.row_date}
              maximumDate={date_1}
            />
          </View>
        </RBSheet>

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

        <SafeAreaView style={{flex: 0, backgroundColor: Colors.theamColor}} />
        <KeyboardAwareScrollView>
          <View
            style={{
              width: '86%',
              alignSelf: 'center',
              marginTop: mobileW * 0.1,
              paddingBottom: (mobileW * 15) / 100,
            }}>
            {/* .....................For Back photoicon.................... */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                {
                  this.state.edit == true
                    ? this.props.navigation.navigate(
                        'Driver_Add_Payment_Options',
                      )
                    : this.props.navigation.goBack();
                }
              }}>
              <Image
                source={localimag.BackW}
                resizeMode="contain"
                style={{
                  height: (mobileH * 6.5) / 100,
                  width: (mobileW * 6.5) / 100,
                }}></Image>
            </TouchableOpacity>
            {/* .....................For Edit txt.................... */}
            <View
              style={{
                width: '100%',
                alignSelf: 'center',
                marginTop: (mobileH * 5) / 100,
              }}>
              <Text
                style={{
                  fontFamily: Font.Bold,
                  fontSize: (mobileW * 5) / 100,
                  color: Colors.white1,
                }}>
                {'Add Payment Details'}
              </Text>
            </View>

            {/* .....................For FirstName.................... 2 */}
            {this.state.showType == 2 && (
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  marginTop: mobileW * 0.08,
                  alignItems: 'center',
                }}>
                {/* textInput--------- */}
                <View style={{width: '92%', justifyContent: 'center'}}>
                  <TextInput
                    value={this.state.firstname}
                    onChangeText={txt => this.setState({firstname: txt})}
                    placeholder={Lang_chg.FirstName[config.language]}
                    keyboardType="default"
                    selectionColor={Colors.textInputSelectionColor}
                    placeholderTextColor={Colors.white1}
                    maxLength={25}
                    style={{
                      width: '95%',
                      fontSize: (mobileW * 4) / 100,
                      color: Colors.white1,
                      paddingVertical: (mobileH * 1) / 100,
                      marginTop: mobileW * 0.01,
                      fontFamily: Font.Bold,
                      textAlignVertical: 'center',
                    }}></TextInput>
                </View>
              </View>
            )}

            {this.state.showType == 2 && (
              <View
                style={{
                  width: '98%',
                  height: (mobileW * 0.2) / 100,
                  backgroundColor: Colors.white1,
                  alignSelf: 'center',
                }}></View>
            )}

            {/* .....................For LastName.................... 2 */}
            {this.state.showType == 2 && (
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  marginTop: mobileW * 0.08,
                  alignItems: 'center',
                }}>
                {/* textInput--------- */}
                <View style={{width: '92%', justifyContent: 'center'}}>
                  <TextInput
                    value={this.state.lastname}
                    onChangeText={txt => this.setState({lastname: txt})}
                    placeholder={Lang_chg.LastName[config.language]}
                    keyboardType="default"
                    selectionColor={Colors.textInputSelectionColor}
                    placeholderTextColor={Colors.white1}
                    maxLength={25}
                    style={{
                      width: '95%',
                      fontSize: (mobileW * 4) / 100,
                      color: Colors.white1,
                      paddingVertical: (mobileH * 1) / 100,
                      marginTop: mobileW * 0.01,
                      fontFamily: Font.Bold,
                      textAlignVertical: 'center',
                    }}></TextInput>
                </View>
              </View>
            )}

            {this.state.showType == 2 && (
              <View
                style={{
                  width: '98%',
                  height: (mobileW * 0.2) / 100,
                  backgroundColor: Colors.white1,
                  alignSelf: 'center',
                }}></View>
            )}

            {/* .....................For Email.................... 2 */}
            {this.state.showType == 2 && (
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  marginTop: mobileW * 0.08,
                  alignItems: 'center',
                }}>
                {/* textInput--------- */}
                <View style={{width: '92%', justifyContent: 'center'}}>
                  <TextInput
                    value={this.state.email}
                    onChangeText={txt => this.setState({email: txt})}
                    placeholder={Lang_chg.Email_txt[config.language]}
                    keyboardType="email-address"
                    selectionColor={Colors.textInputSelectionColor}
                    placeholderTextColor={Colors.white1}
                    maxLength={100}
                    style={{
                      width: '95%',
                      fontSize: (mobileW * 4) / 100,
                      color: Colors.white1,
                      paddingVertical: (mobileH * 1) / 100,
                      marginTop: mobileW * 0.01,
                      fontFamily: Font.Bold,
                      textAlignVertical: 'center',
                    }}></TextInput>
                </View>
              </View>
            )}

            {this.state.showType == 2 && (
              <View
                style={{
                  width: '98%',
                  height: (mobileW * 0.2) / 100,
                  backgroundColor: Colors.white1,
                  alignSelf: 'center',
                }}></View>
            )}

            {/* .....................For Mobile Number.................... 2 */}
            {this.state.showType == 2 && (
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  marginTop: mobileW * 0.08,
                  alignItems: 'center',
                }}>
                {/* textInput--------- */}
                <View style={{width: '92%', justifyContent: 'center'}}>
                  <TextInput
                    value={this.state.mobile_number}
                    onChangeText={txt => this.setState({mobile_number: txt})}
                    placeholder={Lang_chg.Mobile_txt[config.language]}
                    keyboardType="number-pad"
                    selectionColor={Colors.textInputSelectionColor}
                    placeholderTextColor={Colors.white1}
                    maxLength={15}
                    style={{
                      width: '95%',
                      fontSize: (mobileW * 4) / 100,
                      color: Colors.white1,
                      paddingVertical: (mobileH * 1) / 100,
                      marginTop: mobileW * 0.01,
                      fontFamily: Font.Bold,
                      textAlignVertical: 'center',
                    }}></TextInput>
                </View>
              </View>
            )}

            {this.state.showType == 2 && (
              <View
                style={{
                  width: '98%',
                  height: (mobileW * 0.1) / 100,
                  backgroundColor: Colors.white1,
                  alignSelf: 'center',
                }}></View>
            )}

            {/* .....................For Date of Birth .................... 2 */}
            {this.state.showType == 2 && (
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  marginTop: mobileW * 0.08,
                  alignItems: 'center',
                }}>
                {/* textInput--------- */}
                <View style={{width: '92%', justifyContent: 'center'}}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({datetoselect: 2});
                      {
                        this.state.Date_of_Birth == ''
                          ? this.setTodayDate()
                          : this.setState({row_date: this.state.Date_of_Birth});
                      }
                      this.DatePicker.open();
                    }}
                    style={{
                      alignSelf: 'center',
                      width: '92%',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        // backgroundColor: 'yellow',
                        width: '95%',
                        fontSize: (mobileW * 4) / 100,
                        color: Colors.white1,
                        marginLeft: (mobileW * -2) / 100,
                        paddingVertical: (mobileH * 1) / 100,
                        marginTop: mobileW * 0.01,
                        fontFamily: Font.Bold,
                        textAlignVertical: 'center',
                      }}>
                      {/* {this.state.dob == '' ? */}
                      {this.state.Date_of_Birth == ''
                        ? Lang_chg.Birth_txt[config.language]
                        : // :this.state.selected_date}
                          // :this.state.sdate}
                          this.state.Date_of_Birth}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {this.state.showType == 2 && (
              <View
                style={{
                  width: '98%',
                  height: (mobileW * 0.2) / 100,
                  backgroundColor: Colors.white1,
                  alignSelf: 'center',
                }}></View>
            )}

            {/* .....................For Card Address.................... 2 */}
            {this.state.showType == 2 && (
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  marginTop: mobileW * 0.08,
                  alignItems: 'center',
                }}>
                {/* textInput--------- */}
                <View style={{width: '92%', justifyContent: 'center'}}>
                  <TextInput
                    value={this.state.address_1}
                    onChangeText={txt => this.setState({address_1: txt})}
                    placeholder={Lang_chg.Address_txt[config.language]}
                    keyboardType="default"
                    selectionColor={Colors.textInputSelectionColor}
                    placeholderTextColor={Colors.white1}
                    maxLength={50}
                    style={{
                      width: '95%',
                      fontSize: (mobileW * 4) / 100,
                      color: Colors.white1,
                      paddingVertical: (mobileH * 1) / 100,
                      marginTop: mobileW * 0.01,
                      fontFamily: Font.Bold,
                      textAlignVertical: 'center',
                    }}></TextInput>
                </View>
              </View>
            )}

            {this.state.showType == 2 && (
              <View
                style={{
                  width: '98%',
                  height: (mobileW * 0.2) / 100,
                  backgroundColor: Colors.white1,
                  alignSelf: 'center',
                }}></View>
            )}

            {/* .....................For City.................... 2 */}
            {this.state.showType == 2 && (
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  marginTop: mobileW * 0.08,
                  alignItems: 'center',
                }}>
                {/* textInput--------- */}
                <View style={{width: '92%', justifyContent: 'center'}}>
                  <TextInput
                    value={this.state.city}
                    onChangeText={txt => this.setState({city: txt})}
                    selectionColor={Colors.textInputSelectionColor}
                    placeholder={Lang_chg.City_txt[config.language]}
                    keyboardType="default"
                    placeholderTextColor={Colors.white1}
                    maxLength={50}
                    style={{
                      width: '95%',
                      fontSize: (mobileW * 4) / 100,
                      color: Colors.white1,
                      paddingVertical: (mobileH * 1) / 100,
                      marginTop: mobileW * 0.01,
                      fontFamily: Font.Bold,
                      textAlignVertical: 'center',
                    }}></TextInput>
                </View>
              </View>
            )}

            {this.state.showType == 2 && (
              <View
                style={{
                  width: '98%',
                  height: (mobileW * 0.1) / 100,
                  backgroundColor: Colors.white1,
                  alignSelf: 'center',
                }}></View>
            )}

            {/* .....................For State.................... 2 */}
            {this.state.showType == 2 && (
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  marginTop: mobileW * 0.08,
                  alignItems: 'center',
                }}>
                {/* textInput--------- */}
                <View style={{width: '92%', justifyContent: 'center'}}>
                  <TextInput
                    value={this.state.state}
                    onChangeText={txt => this.setState({state: txt})}
                    placeholder={Lang_chg.State_txt[config.language]}
                    keyboardType="default"
                    placeholderTextColor={Colors.white1}
                    selectionColor={Colors.textInputSelectionColor}
                    maxLength={50}
                    style={{
                      width: '95%',
                      fontSize: (mobileW * 4) / 100,
                      color: Colors.white1,
                      paddingVertical: (mobileH * 1) / 100,
                      marginTop: mobileW * 0.01,
                      fontFamily: Font.Bold,
                      textAlignVertical: 'center',
                    }}></TextInput>
                </View>
              </View>
            )}

            {this.state.showType == 2 && (
              <View
                style={{
                  width: '98%',
                  height: (mobileW * 0.1) / 100,
                  backgroundColor: Colors.white1,
                  alignSelf: 'center',
                }}></View>
            )}

            {/* .....................For ZipCode.................... 2 */}
            {this.state.showType == 2 && (
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  marginTop: mobileW * 0.08,
                  alignItems: 'center',
                }}>
                {/* textInput--------- */}
                <View style={{width: '92%', justifyContent: 'center'}}>
                  <TextInput
                    value={this.state.zip_code}
                    onChangeText={txt => this.setState({zip_code: txt})}
                    placeholder={Lang_chg.Zip_txt[config.language]}
                    keyboardType="number-pad"
                    selectionColor={Colors.textInputSelectionColor}
                    placeholderTextColor={Colors.white1}
                    maxLength={6}
                    style={{
                      width: '95%',
                      fontSize: (mobileW * 4) / 100,
                      color: Colors.white1,
                      paddingVertical: (mobileH * 1) / 100,
                      marginTop: mobileW * 0.01,
                      fontFamily: Font.Bold,
                      textAlignVertical: 'center',
                    }}></TextInput>
                </View>
              </View>
            )}

            {this.state.showType == 2 && (
              <View
                style={{
                  width: '98%',
                  height: (mobileW * 0.1) / 100,
                  backgroundColor: Colors.white1,
                  alignSelf: 'center',
                }}></View>
            )}

            {/* .....................For Tax ID.................... 2 */}
            {this.state.showType == 2 && (
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  marginTop: mobileW * 0.08,
                  alignItems: 'center',
                }}>
                {/* textInput--------- */}
                <View style={{width: '92%', justifyContent: 'center'}}>
                  <TextInput
                    value={this.state.tax_id}
                    placeholder={Lang_chg.SSN_txt[config.language]}
                    onChangeText={txt => this.setState({tax_id: txt})}
                    keyboardType="default"
                    selectionColor={Colors.textInputSelectionColor}
                    placeholderTextColor={Colors.white1}
                    maxLength={50}
                    style={{
                      width: '95%',
                      fontSize: (mobileW * 4) / 100,
                      color: Colors.white1,
                      paddingVertical: (mobileH * 1) / 100,
                      marginTop: mobileW * 0.01,
                      fontFamily: Font.Bold,
                      textAlignVertical: 'center',
                    }}></TextInput>
                </View>
              </View>
            )}

            {this.state.showType == 2 && (
              <View
                style={{
                  width: '98%',
                  height: (mobileW * 0.1) / 100,
                  backgroundColor: Colors.white1,
                  alignSelf: 'center',
                }}></View>
            )}

            {/* .....................For card.................... 2 */}
            {this.state.showType == 2 && (
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  marginTop: mobileW * 0.08,
                  alignItems: 'center',
                }}>
                {/* textInput--------- */}
                <View style={{width: '92%', justifyContent: 'center'}}>
                  <TextInput
                    value={this.state.card}
                    onChangeText={txt => this.setState({card: txt})}
                    placeholder="Debit Card Number"
                    keyboardType="decimal-pad"
                    selectionColor={Colors.textInputSelectionColor}
                    placeholderTextColor={Colors.white1}
                    maxLength={16}
                    style={{
                      width: '95%',
                      fontSize: (mobileW * 4) / 100,
                      color: Colors.white1,
                      paddingVertical: (mobileH * 1) / 100,
                      marginTop: mobileW * 0.01,
                      fontFamily: Font.Bold,
                      textAlignVertical: 'center',
                    }}></TextInput>
                </View>
              </View>
            )}

            {this.state.showType == 2 && (
              <View
                style={{
                  width: '98%',
                  height: (mobileW * 0.1) / 100,
                  backgroundColor: Colors.white1,
                  alignSelf: 'center',
                }}></View>
            )}

            {this.state.showType == 2 && (
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  marginTop: mobileW * 0.08,
                  alignItems: 'center',
                }}>
                {/* textInput--------- */}
                <View style={{width: '92%', justifyContent: 'center'}}>
                  <TextInput
                    defaultValue={this.state.cardHoldername}
                    onChangeText={txt => this.setState({cardHoldername: txt})}
                    placeholder="Card Holder Name"
                    keyboardType="default"
                    selectionColor={Colors.textInputSelectionColor}
                    placeholderTextColor={Colors.white1}
                    maxLength={25}
                    style={{
                      width: '95%',
                      fontSize: (mobileW * 4) / 100,
                      color: Colors.white1,
                      paddingVertical: (mobileH * 1) / 100,
                      marginTop: mobileW * 0.01,
                      fontFamily: Font.Bold,
                      textAlignVertical: 'center',
                    }}></TextInput>
                </View>
              </View>
            )}

            {/* This is the stripe Account Id Input Field */}

            {/* {(this.state.showType == 2) && <View style={{ width: '98%', height: mobileW * 0.2 / 100, backgroundColor: Colors.white1, alignSelf: 'center' }}></View>}

                        {(this.state.showType == 2) && <View style={{ width: '98%', height: mobileW * 0.2 / 100, backgroundColor: Colors.white1, alignSelf: 'center' }}></View>} */}

            {/* {(this.state.showType == 2) && <View style={{ width: '100%', flexDirection: 'row', marginTop: mobileW * 0.08, alignItems: 'center' }}> */}
            {/* textInput--------- */}
            {/* <View style={{ width: '92%', justifyContent: 'center' }}>
                                <TextInput value={this.state.stripe_Account_ID}
                                    onChangeText={(txt) => {
                                        this.setState({ stripe_Account_ID: txt })
                                    }}
                                    placeholder='Stripe Account Id'
                                    selectionColor={Colors.textInputSelectionColor}
                                    placeholderTextColor={Colors.white1}
                                    keyboardType="default"
                                    maxLength={30}
                                    caretColor="white"
                                    style={{
                                        width: '95%',
                                        fontSize: mobileW * 4 / 100, color: Colors.white1,
                                        paddingVertical: mobileH * 1 / 100, marginTop: mobileW * 0.01,
                                        fontFamily: Font.Bold, textAlignVertical: 'center'
                                    }}></TextInput>
                            </View> */}
            {/* </View>} */}

            {/* This is the Card Expirey Input Field */}

            {this.state.showType == 2 && (
              <View
                style={{
                  width: '98%',
                  height: (mobileW * 0.2) / 100,
                  backgroundColor: Colors.white1,
                  alignSelf: 'center',
                }}></View>
            )}

            {this.state.showType == 2 && (
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  marginTop: mobileW * 0.08,
                  alignItems: 'center',
                }}>
                {/* textInput--------- */}
                <View style={{width: '92%', justifyContent: 'center'}}>
                  {/* <TouchableOpacity
                                    onPress={() => {
                                        this.setState({ datetoselect: 2 });
                                        {
                                            this.state.Date_of_Birth == ''
                                                ? this.setTodayDate()
                                                : this.setState({ row_date: this.state.Date_of_Birth });
                                        }
                                        this.DatePicker.open();
                                    }}
                                    style={{
                                        alignSelf: 'center', width: '92%', justifyContent: 'center', marginLeft: -11,
                                    }}>
                                    <Text style={{
                                        width: '95%',
                                        fontSize: mobileW * 4 / 100, color: Colors.white1,
                                        paddingVertical: mobileH * 1 / 100, marginTop: mobileW * 0.01,
                                        fontFamily: Font.Bold, textAlignVertical: 'center'
                                    }}>
                                        {/* {this.state.dob == '' ? */}
                  {/* {this.state.Date_of_Birth == '' ?
                                            Lang_chg.Expiry_txt[config.language]
                                            : this.state.Date_of_Birth}
                                    </Text>
                                </TouchableOpacity> */}

                  {/* Making Text Input for Card Expirey Date */}

                  <TextInput
                    placeholder={
                      Lang_chg.Expiry_txt_CreditCard[config.language]
                    }
                    placeholderTextColor={Colors.white1}
                    onChangeText={this.handleChangeText}
                    value={this.state.edate}
                    style={{
                      width: '95%',
                      fontSize: (mobileW * 4) / 100,
                      paddingVertical: (mobileH * 1) / 100,
                      marginTop: mobileW * 0.01,
                      fontFamily: Font.Bold,
                      textAlignVertical: 'center',
                      color: Colors.white1,
                    }}
                    keyboardType="numeric"
                    maxLength={9}
                    caretColor="white"
                  />
                </View>
              </View>
            )}

            {this.state.showType == 2 && (
              <View
                style={{
                  width: '98%',
                  height: (mobileW * 0.1) / 100,
                  backgroundColor: Colors.white1,
                  alignSelf: 'center',
                }}></View>
            )}

            {this.state.showType == 2 && (
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  marginTop: mobileW * 0.08,
                  alignItems: 'center',
                }}>
                {/* textInput--------- */}
                <View style={{width: '92%', justifyContent: 'center'}}>
                  <TextInput
                    value={this.state.cardCVV}
                    onChangeText={txt => {
                      this.setState({cardCVV: txt});
                    }}
                    placeholder="CVV / CVC"
                    selectionColor={Colors.textInputSelectionColor}
                    placeholderTextColor={Colors.white1}
                    keyboardType="numeric"
                    maxLength={3}
                    caretColor="white"
                    style={{
                      width: '95%',
                      fontSize: (mobileW * 4) / 100,
                      color: Colors.white1,
                      paddingVertical: (mobileH * 1) / 100,
                      marginTop: mobileW * 0.01,
                      fontFamily: Font.Bold,
                      textAlignVertical: 'center',
                    }}></TextInput>
                </View>
              </View>
            )}

            {this.state.showType == 2 && (
              <View
                style={{
                  width: '98%',
                  height: (mobileW * 0.1) / 100,
                  backgroundColor: Colors.white1,
                  alignSelf: 'center',
                }}></View>
            )}

            {this.state.showType == 2 && (
              <View
                style={{
                  width: '98%',
                  height: (mobileW * 0.1) / 100,
                  backgroundColor: Colors.white1,
                  alignSelf: 'center',
                }}></View>
            )}

            {/* .....................For Venmo Id.................... 1 */}
            {/* {(this.state.showType == 0) && <View style={{
                            width: '100%', flexDirection: 'row', marginTop: mobileW * 0.08,
                            alignItems: 'center',
                        }}> */}
            {/* textInput--------- */}
            {/* <View style={{ width: '92%', justifyContent: 'center' }}>
                                <TextInput
                                    value={this.state.venmo}
                                    onChangeText={(txt) => this.setState({ venmo: txt })}
                                    placeholder='Venmo Id'
                                    keyboardType='email-address'
                                    selectionColor={Colors.textInputSelectionColor}
                                    placeholderTextColor={Colors.white1}
                                    maxLength={100} style={{
                                        width: '95%',
                                        fontSize: mobileW * 4 / 100, color: Colors.white1,
                                        paddingVertical: mobileH * 1 / 100, marginTop: mobileW * 0.01,
                                        fontFamily: Font.Bold, textAlignVertical: 'center'
                                    }}></TextInput>
                            </View>
                        </View>} */}
            {/* {(this.state.showType == 0) && <View style={{ width: '98%', height: mobileW * 0.2 / 100, backgroundColor: Colors.white1, alignSelf: 'center' }}></View>} */}

            {/* .....................For paypal Id....................  1 */}
            {this.state.showType == 1 && (
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  marginTop: mobileW * 0.08,
                  alignItems: 'center',
                }}>
                {/* textInput--------- */}
                <View style={{width: '92%', justifyContent: 'center'}}>
                  <TextInput
                    value={this.state.paypal}
                    onChangeText={txt => this.setState({paypal: txt})}
                    placeholder="PayPal Email"
                    keyboardType="email-address"
                    selectionColor={Colors.textInputSelectionColor}
                    placeholderTextColor={Colors.white1}
                    maxLength={100}
                    style={{
                      width: '95%',
                      fontSize: (mobileW * 4) / 100,
                      color: Colors.white1,
                      paddingVertical: (mobileH * 1) / 100,
                      marginTop: mobileW * 0.01,
                      fontFamily: Font.Bold,
                      textAlignVertical: 'center',
                    }}></TextInput>
                </View>
              </View>
            )}

            {this.state.showType == 1 && (
              <View
                style={{
                  width: '98%',
                  height: (mobileW * 0.1) / 100,
                  backgroundColor: Colors.white1,
                  alignSelf: 'center',
                }}></View>
            )}

            {/*  */}

            {/* -----------------Photo--------- */}
            {(this.state.showType == 1 || this.state.showType == 2) && (
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  marginTop: mobileW * 0.08,
                  alignItems: 'center',
                }}>
                {/* textInput--------- */}
                <View style={{width: '92%', justifyContent: 'center'}}>
                  <Text
                    style={{
                      fontSize: (mobileW * 4) / 100,
                      color: Colors.white1,
                      fontFamily: Font.Bold,
                      textAlignVertical: 'center',
                    }}>
                    {Lang_chg.StudentIDCardFront[config.language]}
                  </Text>
                </View>
              </View>
            )}

            {(this.state.showType == 1 || this.state.showType == 2) && (
              <TouchableOpacity
                onPress={() => {
                  consolepro.consolelog('media modal clicked');
                  this.setState({
                    mediamodal: true,
                    activeImg: 'photo_id_front',
                  });
                }}>
                {this.state.photo_id_front == '' ? (
                  <View style={styles.dashed_box}>
                    <Image
                      source={localimag.photoicon}
                      resizeMode="contain"
                      style={{
                        height: (mobileH * 9) / 100,
                        width: (mobileW * 15) / 100,
                      }}></Image>
                    <Text
                      style={{
                        fontSize: (mobileH * 2.5) / 100,
                        fontFamily: Font.Fontregular,
                        color: '#9EB8F1',
                      }}>
                      {Lang_chg.Upload[config.language]}
                    </Text>
                  </View>
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
                    source={{uri: this.state.photo_id_front}}></ImageBackground>
                )}
              </TouchableOpacity>
            )}
            {/*  */}

            {/* -----------------Photo back--------- */}
            {(this.state.showType == 1 || this.state.showType == 2) && (
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  marginTop: mobileW * 0.08,
                  alignItems: 'center',
                }}>
                {/* textInput--------- */}
                <View style={{width: '92%', justifyContent: 'center'}}>
                  <Text
                    style={{
                      fontSize: (mobileW * 4) / 100,
                      color: Colors.white1,
                      fontFamily: Font.Bold,
                      textAlignVertical: 'center',
                    }}>
                    {Lang_chg.StudentIDCardBack[config.language]}
                  </Text>
                </View>
              </View>
            )}

            {(this.state.showType == 1 || this.state.showType == 2) && (
              <TouchableOpacity
                onPress={() => {
                  consolepro.consolelog('media modal clicked');
                  this.setState({mediamodal: true, activeImg: 'photo_id_back'});
                }}>
                {this.state.photo_id_back == '' ? (
                  <View style={styles.dashed_box}>
                    <Image
                      source={localimag.photoicon}
                      resizeMode="contain"
                      style={{
                        height: (mobileH * 9) / 100,
                        width: (mobileW * 15) / 100,
                      }}></Image>
                    <Text
                      style={{
                        fontSize: (mobileH * 2.5) / 100,
                        fontFamily: Font.Fontregular,
                        color: '#9EB8F1',
                      }}>
                      {Lang_chg.Upload1[config.language]}
                    </Text>
                  </View>
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
                    source={{uri: this.state.photo_id_back}}></ImageBackground>
                )}
              </TouchableOpacity>
            )}
            {/* -----------------ADDITION--------- */}
            {(this.state.showType == 1 || this.state.showType == 2) && (
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  marginTop: mobileW * 0.08,
                  alignItems: 'center',
                }}>
                {/* textInput--------- */}
                <View style={{width: '92%', justifyContent: 'center'}}>
                  <Text
                    style={{
                      fontSize: (mobileW * 4) / 100,
                      color: Colors.white1,
                      fontFamily: Font.Bold,
                      textAlignVertical: 'center',
                    }}>
                    {Lang_chg.AdditionalText[config.language]}
                  </Text>
                </View>
              </View>
            )}
            {(this.state.showType == 1 || this.state.showType == 2) && (
              <TouchableOpacity
                onPress={() => {
                  consolepro.consolelog('media modal clicked');
                  this.setState({
                    mediamodal: true,
                    activeImg: 'additional_doc',
                  });
                }}>
                {this.state.additional_doc == '' ? (
                  <View style={styles.dashed_box}>
                    <Image
                      source={localimag.photoicon}
                      resizeMode="contain"
                      style={{
                        height: (mobileH * 9) / 100,
                        width: (mobileW * 15) / 100,
                      }}></Image>
                    <Text
                      style={{
                        fontSize: (mobileH * 2.5) / 100,
                        fontFamily: Font.Fontregular,
                        color: '#9EB8F1',
                      }}>
                      {Lang_chg.Upload2[config.language]}
                    </Text>
                  </View>
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
                    source={{uri: this.state.additional_doc}}></ImageBackground>
                )}
              </TouchableOpacity>
            )}
            {/*  */}

            {/* /----------Add Bank---------------// */}
            <TouchableOpacity
              onPress={() => {
                if (this.state.showType === 1) {
                  if (this.state.paypal.trim().length <= 0) {
                    msgProvider.toast(
                      msgText.enteremail[config.language],
                      'center',
                    );
                    return false;
                  }
                  if (config.regemail.test(this.state.paypal) !== true) {
                    msgProvider.toast(
                      msgText.entervalidemail[config.language],
                      'center',
                    );
                    return false;
                  }
                  if (!this.state.photo_id_front) {
                    msgProvider.toast(
                      msgText.Please_upload_ID_front_photo[config.language],
                      'center',
                    );
                    return false;
                  }

                  if (!this.state.photo_id_back) {
                    msgProvider.toast(
                      msgText.Please_upload_ID_back_photo[config.language],
                      'center',
                    );
                    return false;
                  }

                  if (!this.state.additional_doc) {
                    msgProvider.toast(
                      msgText.Please_upload_ID_Address_Proof[config.language],
                      'center',
                    );
                    return false;
                  }
                  this.edit_validation();
                } else if (this.state.showType === 2) {
                  if (this.state.firstname == '') {
                    //FULL NAME
                    msgProvider.toast(
                      msgText.enter_firstname[config.language],
                      'center',
                    );
                    return false;
                  }
                  if (this.state.firstname.length < 3) {
                    msgProvider.toast(
                      msgText.firstname_minimumcharacter[config.language],
                      'center',
                    );
                    return false;
                  }
                  if (this.state.lastname == '') {
                    //FULL NAME
                    msgProvider.toast(
                      msgText.enter_lastname[config.language],
                      'center',
                    );
                    return false;
                  }
                  if (this.state.lastname.trim().length < 3) {
                    msgProvider.toast(
                      msgText.lastname_minimumcharacter[config.language],
                      'center',
                    );
                    return false;
                  }
                  if (this.state.email.trim().length <= 0) {
                    //email
                    msgProvider.toast(
                      msgText.enteremail[config.language],
                      'center',
                    );
                    return false;
                  }
                  if (config.regemail.test(this.state.email) !== true) {
                    msgProvider.toast(
                      msgText.entervalidemail[config.language],
                      'center',
                    );
                    return false;
                  }
                  if (this.state.mobile_number == '') {
                    //txtPassword
                    msgProvider.toast(
                      msgText.enter_mobilenumber[config.language],
                      'center',
                    );
                    return false;
                  }
                  if (this.state.mobile_number.trim().length < 10) {
                    consolepro.consolelog(this.state.txtAddress);
                    msgProvider.toast(
                      msgText.Mobilenumber_minimumcharacter[config.language],
                      'center',
                    );
                    return false;
                  }
                  if (this.state.mobile_number.length <= 0) {
                    msgProvider.toast(
                      msgText.emptyMobile[config.language],
                      'center',
                    );
                    return false;
                  }
                  if (this.state.mobile_number.length > 0) {
                    if (this.state.mobile_number.length < 7) {
                      msgProvider.toast(
                        msgText.mobileMinLength[config.language],
                        'center',
                      );
                      return false;
                    } else if (this.state.mobile_number.length > 15) {
                      msgProvider.toast(
                        msgText.mobileMaxLength[config.language],
                        'center',
                      );
                      return false;
                    }
                    var mobilevalidation = config.mobilevalidation;
                    if (
                      mobilevalidation.test(this.state.mobile_number) !== true
                    ) {
                      msgProvider.toast(
                        msgText.validMobile[config.language],
                        'center',
                      );
                      return false;
                    }
                  }
                  if (this.state.Date_of_Birth == '') {
                    msgProvider.toast(
                      msgText.select_date_of_birth[config.language],
                      'center',
                    );
                    return false;
                  }
                  if (this.state.address_1 == '') {
                    //txtPassword2
                    msgProvider.toast(
                      msgText.enter_your_addressline1[config.language],
                      'center',
                    );
                    return false;
                  }
                  if (this.state.address_1.trim().length < 3) {
                    msgProvider.toast(
                      msgText.bank_addressline1_minimumcharacter[
                        config.language
                      ],
                      'center',
                    );
                    return false;
                  }
                  if (this.state.city == '') {
                    //txtPassword2
                    msgProvider.toast(
                      msgText.entercity[config.language],
                      'center',
                    );
                    return false;
                  }
                  if (this.state.city.trim().length < 3) {
                    msgProvider.toast(
                      msgText.Cityminimumcharacter[config.language],
                      'center',
                    );
                    return false;
                  }
                  if (this.state.state == '') {
                    //txtPassword2
                    msgProvider.toast(
                      msgText.enterstate[config.language],
                      'center',
                    );
                    return false;
                  }
                  if (this.state.state.trim().length < 2) {
                    msgProvider.toast(
                      msgText.State_minimumcharacter[config.language],
                      'center',
                    );
                    return false;
                  }
                  if (this.state.zip_code == '') {
                    //txtPassword2
                    msgProvider.toast(
                      msgText.enterZipcode[config.language],
                      'center',
                    );
                    return false;
                  }
                  if (this.state.zip_code.trim().length < 5) {
                    msgProvider.toast(
                      msgText.enterValidZipCode[config.language],
                      'center',
                    );
                    return false;
                  }
                  if (this.state.tax_id == '') {
                    //txtPassword2
                    msgProvider.toast(
                      msgText.entertax_id[config.language],
                      'center',
                    );
                    return false;
                  }
                  if (this.state.tax_id.trim().length < 3) {
                    msgProvider.toast(
                      msgText.enterValid_tax_id[config.language],
                      'center',
                    );
                    return false;
                  }
                  if (this.state.card.length <= 0) {
                    msgProvider.toast(
                      msgText.cardNumber_minimumcharacter[config.language],
                      'center',
                    );
                    return false;
                  }
                  if (
                    this.state.card.trim().length > 16 ||
                    this.state.card.trim().length < 15
                  ) {
                    msgProvider.toast(
                      msgText.cardNumber_minimumcharacter[config.language],
                      'center',
                    );
                    return false;
                  }
                  if (this.state.cardHoldername.length <= 0) {
                    msgProvider.toast(
                      msgText.enter_firstname[config.language],
                      'center',
                    );
                    return false;
                  }
                  if (this.state.cardHoldername.trim().length < 3) {
                    msgProvider.toast(
                      msgText.firstname_minimumcharacter[config.language],
                      'center',
                    );
                    return false;
                  }
                  // if (this.state.stripe_Account_ID.length <= 0) {
                  //     msgProvider.toast(msgText.stripe_Account_ID_Check[config.language], 'center');
                  //     return false;
                  // }
                  if (this.state.edate == '') {
                    msgProvider.toast(
                      msgText.select_card_Expirey_Date[config.language],
                      'center',
                    );
                    return false;
                  }
                  if (this.state.cardCVV.length <= 0) {
                    msgProvider.toast(
                      msgText.cardCvv_minimumcharacter[config.language],
                      'center',
                    );
                    return false;
                  }
                  if (
                    this.state.cardCVV.trim().length < 3 ||
                    this.state.cardCVV.trim().length > 3
                  ) {
                    msgProvider.toast(
                      msgText.cardCvv_minimumcharacter[config.language],
                      'center',
                    );
                    return false;
                  }
                  if (!this.state.photo_id_front) {
                    msgProvider.toast(
                      msgText.Please_upload_ID_front_photo[config.language],
                      'center',
                    );
                    return false;
                  }

                  if (!this.state.photo_id_back) {
                    msgProvider.toast(
                      msgText.Please_upload_ID_back_photo[config.language],
                      'center',
                    );
                    return false;
                  }

                  if (!this.state.additional_doc) {
                    msgProvider.toast(
                      msgText.Please_upload_ID_Address_Proof[config.language],
                      'center',
                    );
                    return false;
                  }
                  this.edit_validation();
                } else {
                  this.edit_validation();
                }
              }}
              style={{
                flexDirection: 'row',
                width: (mobileW * 85) / 100,
                alignSelf: 'center',
                marginTop: (mobileW * 9) / 100,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: (mobileW * 1) / 100,
                padding: (mobileW * 3) / 100,
                backgroundColor: Colors.white_color,
              }}>
              <Text
                style={{
                  fontSize: (mobileW * 4) / 100,
                  color: Colors.neavyblue,
                  fontFamily: Font.OutfitMedium,
                  textAlign: 'center',
                  paddingLeft: 3.5,
                }}>
                {'Continue'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  dashed_box: {
    alignItems: 'center',
    borderColor: Colors.white1,
    width: mobileW * 0.84,
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: (mobileW * 1) / 100,
    borderStyle: 'dashed',
    marginTop: (mobileH * 2) / 100,
    borderRadius: mobileW * 0.02,
    paddingVertical: mobileW * 0.09,
  },
});
