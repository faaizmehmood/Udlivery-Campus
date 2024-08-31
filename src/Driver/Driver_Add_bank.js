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
  ActivityIndicator,
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
} from '../Provider/utilslib/Utils';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {color} from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';
// import Mapprovider from './Provider/Mapprovider';
// import Mapprovider from '../Provider/Mapprovider';

import RBSheet from 'react-native-raw-bottom-sheet';
import DatePicker from 'react-native-date-picker';
import {mediaprovider, Cameragallery} from '../Provider/utilslib/Utils';
import axios from 'axios';
import AppLoader from '../Provider/context/AppLoader';

global.date_1 = new Date();
export default class Driver_Add_bank extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: '',

      //
      mediamodal: false,
      loading: false,
      activeImg: '',

      //radhekrishan
      // name: 'sfsd',
      // email: 'sfsd@sfd.sdf',
      // mobile_number: '1231231231',
      // dob: '123',
      // bank_name: 'qwqweeq',
      // address_1: 'qweqwe',
      // address_2: 'qweqwe',
      // city: 'qweqwe',
      // state: 'qweqwe',
      // zip_code: 'qweqwe',
      // bank_account: 'qweqwe',
      // routing_no: 'qweqwe',
      // tax_id: 'qweqwe',
      // photo_id_front: 'qweqwe',
      // photo_id_back: 'qweqwe',
      // additional_doc: 'qweqwe',

      //radhekrishan
      name: '',
      firstname: '',
      lastname: '',
      email: '',
      mobile_number: '',
      dob: '',
      bank_name: '',
      address_1: '',
      address_2: '',
      city: '',
      state: '',
      zip_code: '',
      bank_account: '',
      routing_no: '',
      tax_id: '',
      photo_id_front: '',
      photo_id_back: '',
      additional_doc: '',

      //date
      row_date: date_1,
      selected_date: '',
      selected_date_1: '',

      datetoselect: '',
      sdate: '',
      edate: '',

      //radhekrishan
      // edate: 'fsdf'
      user_id: 0,

      //06-08-22
      dob_day: '',
      dob_month: '',
      dob_year: '',
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
      let tmp = this.props.route.params.edit;
      this.setState({
        edit: tmp,
      });

      // consolepro.consolelog(tmp);
      // consolepro.consolelog('i am cdm');
      // this.setState({
      //     edit:true,

      // })

      this._willBlurSubscription = this.props.navigation.addListener(
        'blur',
        payload =>
          BackHandler.removeEventListener(
            'hardwareBackPress',
            this.handleBackPress,
          ),
      );

      // consolepro.consolelog(this.state.edit);
    }

    this.getUserDetail();
  };

  //05-08-22
  get_bank_detail = async () => {
    let url =
      config.baseURL +
      'stripe_payment/get_bank_accounts.php?user_id=' +
      this.state.user_id;
    // console.log(' The api url', url);
    // var data = new FormData();
    // data.append('user_id', 0);
    apifuntion
      // .getApi(url, 1)
      .getApi(url, 0)
      // .postApi(url, data)
      .then(obj => {
        // console.log('obj data is: ', obj);
        if (obj.success == 'true' && obj.bank_arr !== 'NA') {
          // console.log('obj data is: ', obj);
          var dob_day = obj.bank_arr[0].dob_day;
          var dob_month = obj.bank_arr[0].dob_month;
          var dob_year = obj.bank_arr[0].dob_year;

          var edate = dob_year + '-' + dob_month + '-' + dob_day;
          // console.log(edate)

          // setTimeout(() => {
          this.setState({
            address_1: obj.bank_arr[0].address_line_1,
            address_2: obj.bank_arr[0].address_line_2,
            bank_name: obj.bank_arr[0].bank_name,
            city: obj.bank_arr[0].city,

            edate: edate,

            email: obj.bank_arr[0].email,
            firstname: obj.bank_arr[0].first_name,
            id: obj.bank_arr[0].id,
            lastname: obj.bank_arr[0].last_name,
            mobile_number: obj.bank_arr[0].mobile,
            tax_id: obj.bank_arr[0].ssn_number,
            state: obj.bank_arr[0].state,
            bank_account: obj.bank_arr[0].user_account,
            routing_no: obj.bank_arr[0].user_routing,
            zip_code: obj.bank_arr[0].zip_code,
          });
          // }, 300);
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
          // msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
          return false;
        }
      })
      .catch(error => {
        consolepro.consolelog('-------- error ------- ' + error);

        msgProvider.alert(
          msgTitle.internet[config.language],
          msgText.networkconnection[config.language],
          false,
        );
      });
  };

  getUserDetail = async () => {
    let userdata = await localStorage.getItemObject('user_arr');
    consolepro.consolelog('userdata', userdata);
    this.setState({
      user_id: userdata.user_id,
    });
    this.get_bank_detail();
  };

  //06-08-22
  add_bank = async () => {
    // let url = config.baseURL + 'signup.php';
    let url = config.baseURL + 'stripe_payment/add_edit_bank_account_UK.php';
    // consolepro.consolelog('url of add bank', url);

    // var data = new FormData();
    // data.append('user_id', 25);
    // data.append('user_id', '117');

    // data.append('user_id', this.state.user_id);
    // data.append('firstname', this.state.firstname);
    // data.append('lastname', this.state.lastname);
    // data.append('email', this.state.email);
    // data.append('phone_number', this.state.mobile_number);
    // data.append('bank_name', this.state.bank_name);

    // data.append('dateofbirth', this.state.edate);
    // data.append('user_account', this.state.bank_account);
    // data.append('user_routing', this.state.routing_no);
    // data.append('ssn_number', this.state.tax_id);

    // data.append('bank_address_line_1', this.state.address_1);
    // data.append('bank_address_line_2', this.state.address_2);
    // data.append('bank_city_name', this.state.city);
    // data.append('bank_state_name', this.state.state);
    // data.append('bank_zip_code', this.state.zip_code);

    // if (this.state.photo_id_front != 'NA') {
    //   data.append('photo_fron_id', {
    //     uri: this.state.photo_id_front,
    //     type: 'image/jpg',
    //     // name: 'image.jpg'
    //     name: 'image.jpg',
    //   });
    // }

    // if (this.state.photo_id_back != 'NA') {
    //   data.append('photo_back_id', {
    //     uri: this.state.photo_id_back,
    //     type: 'image/jpg',
    //     name: 'image.jpg',
    //   });
    // }

    // if (this.state.additional_doc != 'NA') {
    //   data.append('additional_doc', {
    //     uri: this.state.additional_doc,
    //     type: 'image/jpg',
    //     name: 'image.jpg',
    //   });
    // }

    const configHeaders = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    var data = {
      user_id: this.state.user_id,
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      email: this.state.email,
      phone_number: this.state.mobile_number,
      bank_name: this.state.bank_name,

      dateofbirth: this.state.edate,
      user_account: this.state.bank_account,
      user_routing: this.state.routing_no,
      ssn_number: this.state.tax_id,

      bank_address_line_1: this.state.address_1,
      bank_address_line_2: this.state.address_2,
      bank_city_name: this.state.city,
      bank_state_name: this.state.state,
      bank_zip_code: this.state.zip_code,
    };

    this.setState({
      loading: true,
    });

    // 11/22/2023
    try {
      const response = await axios.post(url, data, configHeaders);
      console.log('Response From the Api: ', response);
      if (response.status === 200) {
        this.props.navigation.navigate('Driver_Home');
        this.setState({
          loading: false,
        });
      } else {
        if (response.account_active_status == 0) {
          // this.props.navigation.navigate('Login')
          consolepro.consolelog(
            'account_active_status',
            response.account_active_status,
          );
          config.checkUserDeactivate(this.props.navigation);
          return false;
        }
        msgProvider.alert(
          msgTitle.information[config.language],
          response.msg[config.language],
          false,
        );
        return false;
      }
    } catch (error) {
      this.setState({
        loading: false,
      });
      msgProvider.alert(
        msgTitle.internet[config.language],
        msgText.networkconnection[config.language],
        false,
      );
      console.log('Error: ', error);
    }

    // consolepro.consolelog('data to be send', data);
    // apifuntion
    //   .postApi(url, data)
    //   .then(obj => {
    //     console.log("Response: " + obj);
    //     if (obj.success == 'true') {
    //       // localStorage.setItemObject('user_arr', obj.user_details);
    //       setTimeout(() => {
    //         this.props.navigation.navigate('Driver_Home');
    //         // this.props.navigation.navigate('Driver_Profile')

    //         //   this.props.navigation.navigate('Verify',{user_id:obj.user_details.user_id});
    //       }, 700);
    //     } else {
    //       if (obj.account_active_status == 0) {
    //         // this.props.navigation.navigate('Login')
    //         consolepro.consolelog(
    //           'account_active_status',
    //           obj.account_active_status,
    //         );
    //         config.checkUserDeactivate(this.props.navigation);
    //         return false;
    //       }
    //       msgProvider.alert(
    //         msgTitle.information[config.language],
    //         obj.msg[config.language],
    //         false,
    //       );
    //       return false;
    //     }
    //   })
    //   .catch(error => {
    //     consolepro.consolelog('-------- error ------- ' + error);
    //     msgProvider.alert(
    //       msgTitle.internet[config.language],
    //       msgText.networkconnection[config.language],
    //       false,
    //     );
    //   });
  };

  // add_bank = async () => {
  //   // let url = config.baseURL + 'signup.php';
  //   let url = config.baseURL + 'stripe_payment/add_edit_bank_account_UK.php';
  //   consolepro.consolelog('url', url);
  //   var data = new FormData();

  //   data.append('user_id', this.state.user_id);
  //   data.append('firstname', this.state.firstname);
  //   data.append('lastname', this.state.lastname);
  //   data.append('email', this.state.email);
  //   data.append('phone_number', this.state.mobile_number);
  //   data.append('bank_name', this.state.bank_name);

  //   data.append('dateofbirth', this.state.edate);
  //   data.append('user_account', this.state.bank_account);
  //   data.append('user_routing', this.state.routing_no);
  //   data.append('ssn_number', this.state.tax_id);

  //   data.append('bank_address_line_1', this.state.address_1);
  //   data.append('bank_address_line_2', this.state.address_2);
  //   data.append('bank_city_name', this.state.city);
  //   data.append('bank_state_name', this.state.state);
  //   data.append('bank_zip_code', this.state.zip_code);

  //   if (this.state.photo_id_front != 'NA') {
  //     data.append('photo_fron_id', {
  //       uri: this.state.photo_id_front,
  //       type: 'image/jpg',
  //       name: 'image.jpg'
  //     })
  //   }

  //   if (this.state.photo_id_back != 'NA') {
  //     data.append('photo_back_id', {
  //       uri: this.state.photo_id_back,
  //       type: 'image/jpg',
  //       name: 'image.jpg'
  //     })
  //   }

  //   if (this.state.additional_doc != 'NA') {
  //     data.append('additional_doc', {
  //       uri: this.state.additional_doc,
  //       type: 'image/jpg',
  //       name: 'image.jpg'
  //     })
  //   }

  //   // consolepro.consolelog('data', data);
  //   apifuntion.postApi(url, data).then((obj) => {
  //     consolepro.consolelog('obj', obj);
  //     if (obj.success == 'true') {
  //       console.log(true)
  //       console.log('obj data is: ', obj);
  //       // this.get_details_after_add_bank()
  //     } else {
  //       if (obj.account_active_status == 0) {
  //         config.checkUserDeactivate(this.props.navigation);
  //         return false;
  //       }
  //       msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
  //       return false;
  //     }
  //   }).catch((error) => {
  //     console.log('error', error);
  //   })
  // };

  edit_bank_validation = () => {
    if (this.state.firstname == '') {
      //FULL NAME
      msgProvider.toast(msgText.enter_firstname[config.language], 'center');
      return false;
    } else if (this.state.firstname.length < 3) {
      msgProvider.toast(
        msgText.firstname_minimumcharacter[config.language],
        'center',
      );
      return false;
    }
    if (this.state.lastname == '') {
      //FULL NAME
      msgProvider.toast(msgText.enter_lastname[config.language], 'center');
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
      msgProvider.toast(msgText.enteremail[config.language], 'center');
      return false;
    }
    if (config.regemail.test(this.state.email) !== true) {
      msgProvider.toast(msgText.entervalidemail[config.language], 'center');
      return false;
    }

    if (this.state.mobile_number == '') {
      //txtPassword
      msgProvider.toast(msgText.enter_mobilenumber[config.language], 'center');
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
      msgProvider.toast(msgText.emptyMobile[config.language], 'center');
      return false;
    }
    if (this.state.mobile_number.length > 0) {
      if (this.state.mobile_number.length < 7) {
        msgProvider.toast(msgText.mobileMinLength[config.language], 'center');
        return false;
      }
      if (this.state.mobile_number.length > 15) {
        msgProvider.toast(msgText.mobileMaxLength[config.language], 'center');
        return false;
      }
      var mobilevalidation = config.mobilevalidation;
      if (mobilevalidation.test(this.state.mobile_number) !== true) {
        msgProvider.toast(msgText.validMobile[config.language], 'center');
        return false;
      }
    }
    if (this.state.edate == '') {
      msgProvider.toast(
        msgText.select_date_of_birth[config.language],
        'center',
      );
      return false;
    }
    if (this.state.bank_name == '') {
      //FULL NAME
      msgProvider.toast(msgText.enter_banknamename[config.language], 'center');
      return false;
    }
    if (this.state.bank_name.trim().length < 3) {
      msgProvider.toast(
        msgText.bank_nameminimumcharacter[config.language],
        'center',
      );
      return false;
    }
    if (this.state.address_1 == '') {
      //txtPassword2
      msgProvider.toast(
        msgText.enter_bank_addressline1[config.language],
        'center',
      );
      return false;
    }
    if (this.state.address_1.trim().length < 3) {
      msgProvider.toast(
        msgText.bank_addressline1_minimumcharacter[config.language],
        'center',
      );
      return false;
    }
    // else if (this.state.address_2 == '') {
    //   //txtPassword2
    //   msgProvider.toast(
    //     msgText.enter_bank_addressline2[config.language],
    //     'center',
    //   );
    //   return false;
    // }
    // else if (this.state.address_2.trim().length < 3) {
    //   msgProvider.toast(
    //     msgText.bank_addressline2_minimumcharacter[config.language],
    //     'center',
    //   );
    // return false;
    // }

    if (this.state.city == '') {
      //txtPassword2
      msgProvider.toast(msgText.entercity[config.language], 'center');
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
      msgProvider.toast(msgText.enterstate[config.language], 'center');
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
      msgProvider.toast(msgText.enterZipcode[config.language], 'center');
      return false;
    }
    if (this.state.zip_code.trim().length < 5) {
      msgProvider.toast(msgText.enterValidZipCode[config.language], 'center');
      return false;
    }

    // else if (this.state.bank_account == '') {
    //     //txtPassword2
    //     msgProvider.toast(msgText.enter_bank_account[config.language], 'center');
    //     return false;
    // } else if (this.state.bank_account.trim().length < 6) {
    //     msgProvider.toast(msgText.bank_account_minimumcharacter[config.language], 'center');
    //     return false;
    // }

    if (this.state.bank_account == '') {
      //txtPassword2
      msgProvider.toast(
        msgText.enter_bank_account_no[config.language],
        'center',
      );
      return false;
    }
    if (this.state.bank_account.trim().length < 6) {
      msgProvider.toast(
        msgText.bank_account_minimumcharacter_no[config.language],
        'center',
      );
      return false;
    }
    if (this.state.routing_no == '') {
      //txtPassword2
      msgProvider.toast(msgText.enter_routing_no[config.language], 'center');
      return false;
    }
    if (this.state.routing_no.trim().length < 3) {
      msgProvider.toast(
        msgText.routing_no_minimumcharacter[config.language],
        'center',
      );
      return false;
    }
    if (this.state.tax_id == '') {
      //txtPassword2
      msgProvider.toast(msgText.entertax_id[config.language], 'center');
      return false;
    }
    if (this.state.tax_id.trim().length < 3) {
      msgProvider.toast(msgText.enterValid_tax_id[config.language], 'center');
      return false;
    }

    // else if (this.state.photo_id_front == '') {
    //     //txtPassword2
    //     msgProvider.toast(msgText.Please_upload_ID_front_photo[config.language], 'center');
    //     return false;
    // }

    // else if (this.state.photo_id_back == '') {
    //     //txtPassword2
    //     msgProvider.toast(msgText.Please_upload_ID_back_photo[config.language], 'center');
    //     return false;
    // }

    // else if (this.state.additional_doc == '') {
    //     //txtPassword2
    //     msgProvider.toast(msgText.Please_upload_ID_Address_Proof[config.language], 'center');
    //     return false;
    // }
    this.add_bank();
  };

  //back handler
  handleBackPress = () => {
    // Alert.alert('Hold on!', 'Do you really want to exit app?', [
    // 	{
    // 		text: 'Cancel',
    // 		onPress: () => null,
    // 		style: 'cancel'
    // 	},
    // 	{ text: 'YES', onPress: () => BackHandler.exitApp() }
    // ]);
    // this.props.navigation.navigate('Home');
    {
      this.state.edit == true
        ? // this.props.navigation.navigate('Driver_Home')
          this.props.navigation.navigate('Driver_Profile')
        : // this.props.navigation.navigate('My_Earnings')

          // this.props.navigation.navigate('Driver_Home');
          this.props.navigation.goBack();
      // this.props.navigation.navigate('My_Earnings')
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
      : this.setState({datetoselect: '', edate: fulldate1});

    this.DatePicker.close();
  };

  //-------------------image
  //-----------------for camera open----------------------

  Camerapopen = async () => {
    mediaprovider
      // .launchCamera(true)
      .launchCamera(false)
      .then(res => {
        //console.log('camerares', res);

        let tmp = res.path;

        if (this.state.activeImg == 'photo_id_front') {
          this.setState({
            mediamodal: false,

            photo_id_front: tmp,

            // image1: res.path,
            //Image1FileName: res.path
          });
        } else if (this.state.activeImg == 'photo_id_back') {
          this.setState({
            mediamodal: false,

            photo_id_back: tmp,

            // image1: res.path,
            //Image1FileName: res.path
          });
        } else if (this.state.activeImg == 'additional_doc') {
          this.setState({
            mediamodal: false,

            additional_doc: tmp,

            // image1: res.path,
            //Image1FileName: res.path
          });
        }

        // let tmp = this.state.add_arr;
        // 	tmp[this.state.activeImg].selectstatus = 1;
        // 	tmp[this.state.activeImg].img = res.path;
        // tmp[this.state.activeImg].img = res.data;

        // this.setState({
        // 	mediamodal: false,

        // 	imagefile: res.path,
        // 	chosenFileName: res.path
        // });
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

  //-----------------------------function to access images from gallery

  Galleryopen = () => {
    consolepro.consolelog('gallery open clicked');
    mediaprovider
      // .launchGellery(true)
      .launchGellery(false)
      .then(res => {
        //console.log('camerares', res);
        // consolepro.consolelog(this.state.activeImg)

        // // if (this.state.activeImg == 0) {

        // 	let tmp = this.state.add_arr;
        // 	tmp[this.state.activeImg].selectstatus = 1;
        // 	tmp[this.state.activeImg].img = res.path;
        // 	// tmp[this.state.activeImg].img = res.data;

        // 	this.setState({
        // 		mediamodal: false,

        // 		add_arr:tmp

        // 		// image1: res.path,
        // 		//Image1FileName: res.path
        // 	});
        // }
        // else if (this.state.activeImg == 1) {
        // 	this.setState({
        // 		mediamodal: false,

        // 		image2: res.path,
        // 		//Image2FileName: res.path
        // 	});
        // }
        // else if (this.state.activeImg == 2) {
        // 	this.setState({
        // 		mediamodal: false,

        // 		image3: res.path,
        // 		//Image3FileName: res.path
        // 	});
        // }

        let tmp = res.path;

        if (this.state.activeImg == 'photo_id_front') {
          this.setState({
            mediamodal: false,

            photo_id_front: tmp,

            // image1: res.path,
            //Image1FileName: res.path
          });
        } else if (this.state.activeImg == 'photo_id_back') {
          this.setState({
            mediamodal: false,

            photo_id_back: tmp,

            // image1: res.path,
            //Image1FileName: res.path
          });
        } else if (this.state.activeImg == 'additional_doc') {
          this.setState({
            mediamodal: false,

            additional_doc: tmp,

            // image1: res.path,
            //Image1FileName: res.path
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
      <>
        <View style={{flex: 1, backgroundColor: Colors.theamColor}}>
          {this.state.loading && (
            <View
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: '#00000036',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator size="large" color="white" />
            </View>
          )}
          <>
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
                    style={{
                      color: Colors.whiteColor,
                      fontFamily: Font.fontbold,
                    }}>
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
                    style={{
                      color: Colors.whiteColor,
                      fontFamily: Font.fontbold,
                    }}>
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

            <SafeAreaView
              style={{flex: 0, backgroundColor: Colors.theamColor}}
            />
            {/* <StatusBar
                    backgroundColor={Colors.theamColor}
                    hidden={false}
                    barStyle={'light-content'}
                    // backgroundColor={Colors.back_color}
                    translucent={false}
                    networkActivityIndicatorVisible={true}
                /> */}
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
                    // this.props.navigation.navigate('Driver_Profile')
                    {
                      this.state.edit == true
                        ? // this.props.navigation.navigate('Driver_Home')
                          this.props.navigation.navigate('Driver_Profile')
                        : // this.props.navigation.navigate('My_Earnings')

                          // this.props.navigation.navigate('Driver_Home');
                          this.props.navigation.goBack();
                      // this.props.navigation.navigate('My_Earnings')
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
                    {Lang_chg.Edit_bank[config.language]}
                  </Text>
                </View>

                {/* .....................For first name.................... */}
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

                <View
                  style={{
                    width: '98%',
                    height: (mobileW * 0.2) / 100,
                    backgroundColor: Colors.white1,
                    alignSelf: 'center',
                  }}></View>

                {/* .....................For last name.................... */}
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

                <View
                  style={{
                    width: '98%',
                    height: (mobileW * 0.2) / 100,
                    backgroundColor: Colors.white1,
                    alignSelf: 'center',
                  }}></View>
                {/* .....................For email.................... */}
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
                <View
                  style={{
                    width: '98%',
                    height: (mobileW * 0.2) / 100,
                    backgroundColor: Colors.white1,
                    alignSelf: 'center',
                  }}></View>
                {/* .....................For mobile no.................... */}

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

                <View
                  style={{
                    width: '98%',
                    height: (mobileW * 0.2) / 100,
                    backgroundColor: Colors.white1,
                    alignSelf: 'center',
                  }}></View>
                {/* .....................For DOB.................... */}
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    marginTop: mobileW * 0.08,
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({datetoselect: 2});
                      {
                        this.state.edate == ''
                          ? this.setTodayDate()
                          : this.setState({row_date: this.state.edate});
                      }
                      this.DatePicker.open();
                    }}
                    style={{
                      alignSelf: 'center',
                      width: '92%',
                      justifyContent: 'center',
                    }}>
                    {/* <Text placeholder={Lang_chg.Birth_txt[config.language]}
                                    keyboardType='default'
                                    placeholderTextColor={Colors.white1}
                                    maxLength={50} style={{
                                        width: '95%',
                                        fontSize: mobileW * 4 / 100, color: Colors.white1,
                                        paddingVertical: mobileH * 1 / 100, marginTop: mobileW * 0.01,
                                        fontFamily: Font.Bold, textAlignVertical: 'center'
                                    }}></Text> */}
                    <Text
                      style={{
                        // backgroundColor: 'yellow',
                        width: '95%',
                        fontSize: (mobileW * 4) / 100,
                        color: Colors.white1,
                        paddingVertical: (mobileH * 1) / 100,
                        marginTop: mobileW * 0.01,
                        fontFamily: Font.Bold,
                        textAlignVertical: 'center',
                      }}>
                      {/* {this.state.dob == '' ? */}
                      {this.state.edate == ''
                        ? Lang_chg.Birth_txt[config.language]
                        : // :this.state.selected_date}
                          // :this.state.sdate}
                          this.state.edate}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    width: '98%',
                    height: (mobileW * 0.2) / 100,
                    backgroundColor: Colors.white1,
                    alignSelf: 'center',
                  }}></View>
                {/* .....................For Credit.................... */}
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
                      value={this.state.bank_name}
                      onChangeText={txt => this.setState({bank_name: txt})}
                      selectionColor={Colors.textInputSelectionColor}
                      placeholder={Lang_chg.Credit_txt[config.language]}
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
                <View
                  style={{
                    width: '98%',
                    height: (mobileW * 0.2) / 100,
                    backgroundColor: Colors.white1,
                    alignSelf: 'center',
                  }}></View>
                {/* .....................For Address.................... */}
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    marginTop: mobileW * 0.08,
                    alignItems: 'center',
                  }}>
                  <View style={{width: '92%', justifyContent: 'center'}}>
                    <TextInput
                      value={this.state.address_1}
                      onChangeText={txt => this.setState({address_1: txt})}
                      placeholder={Lang_chg.Bankaddress_txt[config.language]}
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
                <View
                  style={{
                    width: '98%',
                    height: (mobileW * 0.2) / 100,
                    backgroundColor: Colors.white1,
                    alignSelf: 'center',
                  }}></View>

                {/* //------------------- enter Bankaddresstwo_txt--------------/ */}
                {/* <View style={{
                            width: '100%', flexDirection: 'row', marginTop: mobileW * 0.08,
                            alignItems: 'center',
                        }}>
                           
                            <View style={{ width: '92%', justifyContent: 'center' }}>
                                <TextInput value={this.state.address_2}
                                    onChangeText={(txt) => this.setState({ address_2: txt })}
                                    placeholder={Lang_chg.Bankaddresstwo_txt[config.language]}
                                    keyboardType='default'
                                    selectionColor={Colors.textInputSelectionColor}
                                    placeholderTextColor={Colors.white1}
                                    maxLength={50} style={{
                                        width: '95%',
                                        fontSize: mobileW * 4 / 100, color: Colors.white1,
                                        paddingVertical: mobileH * 1 / 100, marginTop: mobileW * 0.01,
                                        fontFamily: Font.Bold, textAlignVertical: 'center'
                                    }}></TextInput>
                            </View>
                        </View>
                        <View style={{ width: '98%', height: mobileW * 0.2 / 100, backgroundColor: Colors.white1, alignSelf: 'center' }}></View> */}

                {/* //-----------city--------/ */}

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
                <View
                  style={{
                    width: '98%',
                    height: (mobileW * 0.2) / 100,
                    backgroundColor: Colors.white1,
                    alignSelf: 'center',
                  }}></View>

                {/* //----------state-----------------------// */}

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
                <View
                  style={{
                    width: '98%',
                    height: (mobileW * 0.2) / 100,
                    backgroundColor: Colors.white1,
                    alignSelf: 'center',
                  }}></View>

                {/* //------------zip-----/ */}
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
                <View
                  style={{
                    width: '98%',
                    height: (mobileW * 0.2) / 100,
                    backgroundColor: Colors.white1,
                    alignSelf: 'center',
                  }}></View>

                {/* //-------- bank account-------------// */}
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
                      value={this.state.bank_account}
                      onChangeText={txt => this.setState({bank_account: txt})}
                      placeholder={Lang_chg.Bankaccount_txt[config.language]}
                      keyboardType="number-pad"
                      selectionColor={Colors.textInputSelectionColor}
                      placeholderTextColor={Colors.white1}
                      maxLength={12}
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
                <View
                  style={{
                    width: '98%',
                    height: (mobileW * 0.2) / 100,
                    backgroundColor: Colors.white1,
                    alignSelf: 'center',
                  }}></View>
                {/* 
                        //-------rount---------------/ */}

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
                      value={this.state.routing_no}
                      onChangeText={txt => this.setState({routing_no: txt})}
                      placeholder={Lang_chg.Routing_txt[config.language]}
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
                <View
                  style={{
                    width: '98%',
                    height: (mobileW * 0.2) / 100,
                    backgroundColor: Colors.white1,
                    alignSelf: 'center',
                  }}></View>

                {/* //-----------ssn------------------// */}
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
                <View
                  style={{
                    width: '98%',
                    height: (mobileW * 0.2) / 100,
                    backgroundColor: Colors.white1,
                    alignSelf: 'center',
                  }}></View>

                {/* /----------Add Bank---------------// */}

                <TouchableOpacity
                  onPress={() => {
                    this.edit_bank_validation();

                    // this.props.navigation.goBack()
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
                    {/* {Lang_chg.Addbank_txt[config.language]} */}
                    {Lang_chg.Update_bank_txt[config.language]}
                  </Text>
                </TouchableOpacity>

                {/* Add More Options */}

                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate(
                      'Driver_Add_Payment_Options',
                    );
                  }}
                  style={{
                    flexDirection: 'row',
                    width: (mobileW * 85) / 100,
                    alignSelf: 'center',
                    marginTop: (mobileW * 8) / 100,
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
                    {'Add More Options'}
                  </Text>
                </TouchableOpacity>
              </View>
            </KeyboardAwareScrollView>
          </>
        </View>
      </>
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
