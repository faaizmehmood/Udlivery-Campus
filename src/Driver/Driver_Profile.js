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
  firebaseprovider,
} from '../Provider/utilslib/Utils';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {color} from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';
// import Mapprovider from './Provider/Mapprovider';
// import Mapprovider from '../Provider/Mapprovider';
import Driver_Footer from '../Driver/Driver_Footer';
import RNRestart from 'react-native-restart';

export default class Driver_Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logoutmodal: false,
      user_type: 'NA',
      user_name: 'NA',
      user_phone: 'NA',
      user_email: 'NA',
      letter_name: '',

      //radhekrishan
      sel_university_id: '',
      university_arr: '',
      sel_university_name: '',
      //05-08
      user_image: '',
      edit: '',
      txtType: 'Edit Payment Details',
      showType: 5,
    };
    //console.log("count_inbox", count_inbox);
  }

  get_university = async () => {
    let url = config.baseURL + 'get_university_list.php';
    consolepro.consolelog('url', url);
    var data = new FormData();
    data.append('user_id', 0);
    apifuntion
      // .getApi(url, data)
      .postApi(url, data)
      .then(obj => {
        consolepro.consolelog('obj', obj);
        if (obj.success == 'true') {
          let university_arr = obj.university_arr;

          setTimeout(() => {
            this.setState({
              university_arr: university_arr,
              //   mod: true
            });
          }, 300);

          for (let i = 0; i < university_arr.length; i++) {
            // consolepro.consolelog(this.state.u)
            if (
              this.state.sel_university_id == university_arr[i].university_id
            ) {
              consolepro.consolelog(this.state.sel_university_id);
              this.setState({
                sel_university_name: university_arr[i].university_name,
              });
            }
          }
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
    // consolepro.consolelog('userdata', userdata);

    // console.log('The data of userdata is: ', userdata);
    // var letter_name = userdata.user_name;
    // letter_name = letter_name.charAt(0).toUpperCase();
    // consolepro.consolelog({ letter_name });
    this.setState({
      user_id: userdata.user_id,
      user_type: userdata.user_type,
      user_name: userdata.name,
      user_email: userdata.email,
      user_image: userdata.image,
      sel_university_id: userdata.university_id,
    });
    this.get_university();
    // consolepro.consolelog('myusername', this.state.user_name);
  };

  componentDidMount = () => {
    this.onGotoEditWihDrawalOptions();
    setTimeout(() => {
      this.getUserDetail();
    }, 300);
    this.props.navigation.addListener('focus', () => {
      this.getUserDetail();
      firebaseprovider.firebaseUserGetInboxCount();
    });
  };

  onGotoEditWihDrawalOptions = async () => {
    let showPayType = await localStorage.getItemString('showPaymentType');

    if (showPayType === '1') {
      this.setState({txtType: 'Edit Paypal Details'});
      this.setState({showType: 3});
    }
    if (showPayType === '2') {
      this.setState({txtType: 'Edit Debit Card Details'});
      this.setState({showType: 5});
    }
    if (showPayType === '4') {
      this.setState({txtType: 'Edit Bank Details'});
    }
  };

  // driver to user

  switch_account = async () => {
    let url = config.baseURL + 'switch_account.php';

    consolepro.consolelog('url', url);
    var data = new FormData();

    data.append('user_id', this.state.user_id);
    data.append('switch_type', 2);
    // data.append('email', this.state.email);
    // data.append('message', this.state.message);

    consolepro.consolelog('user data to be edited', data);
    apifuntion
      .postApi(url, data)
      .then(obj => {
        consolepro.consolelog('obj', obj);
        if (obj.success == 'true') {
          // msgProvider.toast(obj.msg[config.language], 'center');
          localStorage.setItemObject('user_arr', obj.user_details);
          localStorage.setItemString(
            'user_id',
            JSON.stringify(obj.user_details.user_id),
          );
          firebaseprovider.firebaseUserCreate();
          // firebaseprovider.getMyInboxAllData();
          firebaseprovider.getMyInboxAllDataBooking();
          RNRestart.Restart();
        } else {
          if (obj.account_active_status == 0) {
            // this.props.navigation.navigate('Login')
            // consolepro.consolelog('account_active_status', obj.account_active_status)
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
        console.log('error: ', error);
        msgProvider.alert(
          msgTitle.internet[config.language],
          msgText.networkconnection[config.language],
          false,
        );
      });
  };

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#F7F7F7'}}>
        <SafeAreaView style={{flex: 0, backgroundColor: Colors.theamColor}} />
        {/* <StatusBar
          backgroundColor={Colors.theamColor}
          hidden={false}
          barStyle={'light-content'}
          // backgroundColor={Colors.back_color}
          translucent={false}
          networkActivityIndicatorVisible={true}
        /> */}
        {/* .....................Background img.................... */}
        <ImageBackground
          style={{
            height: (mobileW * 48) / 100,
            alignSelf: 'center',
            width: (mobileW * 100) / 100,
          }}
          source={localimag.profile}
          resizeMode="stretch">
          {/* .....................For Header.................... */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              width: (mobileW * 100) / 100,
              alignItems: 'center',
              backgroundColor: Colors.theamColor,
            }}>
            <TouchableOpacity
              style={{width: (mobileW * 12) / 100}}
              onPress={() => this.props.navigation.goBack('')}>
              {/* <Image style={{ height: mobileW * 7 / 100, width: mobileW * 7 / 100, resizeMode: 'contain' }} 
              source={localimag.goback} /> */}
            </TouchableOpacity>
            <View
              style={{
                width: (mobileW * 76) / 100,
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
                {Lang_chg.Drivre_Profile[config.language]}
              </Text>
            </View>
            <View style={{width: (mobileW * 12) / 100}}></View>
          </View>
        </ImageBackground>

        <View
          style={{
            // backgroundColor:'red',
            alignItems: 'center',
            marginTop: (mobileW * -16) / 100,
          }}>
          <Image
            style={{
              // resizeMode:'cover',
              // resizeMode:'contain',
              backgroundColor: '#fff',
              borderRadius: (mobileW * 26.5) / 200,
              height: (mobileW * 26.5) / 100,
              width: (mobileW * 26.5) / 100,
              // alignSelf: 'center', justifyContent: 'center',
              borderWidth: 5,
              borderColor: Colors.white_color,
            }}
            // source= {this.state.user_image ==null? localimag.Profinactive : {uri:config.img_url+ this.state.user_image}}
            source={
              this.state.user_image == null
                ? localimag.img_placeholder
                : {uri: config.img_url + this.state.user_image}
            }
            //  source={localimag.driverprofile}
          ></Image>
        </View>

        {/* .....................Name and Email.................... */}
        <View
          style={{
            width: (mobileW * 100) / 100,
            borderRadius: 28,
            // backgroundColor: Colors.mediabackground,
            alignSelf: 'center',
          }}>
          <View
            style={{
              width: (mobileW * 90) / 100,
              alignSelf: 'center',
              justifyContent: 'center',
              marginTop: (mobileH * 2) / 100,
            }}>
            <Text
              style={{
                fontSize: (mobileW * 5.3) / 100,
                fontFamily: Font.Semibold,
                color: Colors.removecolor,
                alignSelf: 'center',
              }}>
              {this.state.user_name}
              {/* {Lang_chg.benjamin[config.language]} */}
            </Text>
          </View>
          {/* <View style={{
            width: mobileW * 90 / 100, alignSelf: 'center', justifyContent: 'center',
            flexDirection: 'row', marginTop: mobileH * 0.7 / 100,
          }}>
            <Image style={{
              height: mobileW * 6.3 / 100, width: mobileW * 6.3 / 100, resizeMode: 'contain',
              tintColor: '#000'
            }} source={localimag.message}></Image>
            <Text style={{
              fontSize: mobileW * 3.7 / 100, fontFamily: Font.OutfitMedium, color: Colors.bottomborder,
              alignSelf: 'center', marginLeft: mobileW * 1 / 100
            }}>
              {Lang_chg.charlottemail[config.language]}
              {this.state.user_email}
            </Text>
          </View> */}
        </View>

        <ScrollView
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}>
          {/* .....................University.................... */}
          <View
            style={{
              flexDirection: 'row',
              width: (mobileW * 92) / 100,
              alignSelf: 'center',
              justifyContent: 'center',
              borderBottomColor: Colors.bottomborder,
              borderBottomWidth: 1,
              paddingVertical: (mobileW * 3.5) / 100,
              marginTop: (mobileH * 6) / 100,
            }}>
            <Image
              style={{
                height: (mobileW * 5) / 100,
                width: (mobileW * 5) / 100,
                resizeMode: 'contain',
                alignSelf: 'center',
              }}
              source={localimag.University_Profile}></Image>
            <View
              style={{
                flexDirection: 'row',
                width: (mobileW * 85) / 100,
                alignItems: 'center',
                justifyContent: 'space-between',
                marginLeft: (mobileW * 2) / 100,
              }}>
              <Text
                style={{
                  fontSize: (mobileW * 4) / 100,
                  fontFamily: Font.OutfitMedium,
                  color: Colors.mediumgrey,
                  textAlign: 'center',
                }}>
                {/* {Lang_chg.University[config.language]} */}
                {this.state.sel_university_name}
              </Text>
            </View>
          </View>
          {/* .....................Edit Profile.................... */}
          <TouchableOpacity
            // onPress={() => this.props.navigation.navigate('Drivre_Edit_Profile')}
            onPress={() => this.props.navigation.navigate('Edit_Profile')}
            style={{
              flexDirection: 'row',
              width: (mobileW * 92) / 100,
              alignSelf: 'center',
              justifyContent: 'center',
              borderBottomColor: Colors.bottomborder,
              borderBottomWidth: 1,
              paddingVertical: (mobileW * 3.5) / 100,
            }}>
            <Image
              style={{
                height: (mobileW * 5) / 100,
                width: (mobileW * 5) / 100,
                resizeMode: 'contain',
                alignSelf: 'center',
              }}
              source={localimag.user}></Image>
            <View
              style={{
                flexDirection: 'row',
                width: (mobileW * 85) / 100,
                alignItems: 'center',
                justifyContent: 'space-between',
                marginLeft: (mobileW * 2) / 100,
              }}>
              <Text
                style={{
                  fontSize: (mobileW * 4) / 100,
                  fontFamily: Font.OutfitMedium,
                  color: Colors.mediumgrey,
                  textAlign: 'center',
                }}>
                {Lang_chg.txt_edit[config.language]}
              </Text>
              <Image
                style={{
                  height: (mobileW * 4) / 100,
                  width: (mobileW * 4) / 100,
                  resizeMode: 'contain',
                }}
                source={localimag.Blackb}></Image>
            </View>
          </TouchableOpacity>
          {/* .....................Edit Bank.................... */}
          <TouchableOpacity
            onPress={() => {
              if (
                this.state.txtType ===
                Lang_chg.Edit_Payment_Details[config.language]
              ) {
                this.props.navigation.navigate('Driver_Edit_WithDrawal', {
                  edit: true,
                  showCardType: this.state.showType,
                });
              }
              if (this.state.txtType === 'Edit Paypal Details') {
                this.props.navigation.navigate('Driver_Edit_WithDrawal', {
                  edit: true,
                  showCardType: this.state.showType,
                });
              }
              if (this.state.txtType === 'Edit Debit Card Details') {
                this.props.navigation.navigate('Driver_Edit_WithDrawal', {
                  edit: true,
                  showCardType: this.state.showType,
                });
              }
              if (this.state.txtType === 'Edit Bank Details') {
                this.props.navigation.navigate('Driver_Add_bank', {edit: true});
              }
            }}
            style={{
              flexDirection: 'row',
              width: (mobileW * 92) / 100,
              alignSelf: 'center',
              justifyContent: 'center',
              borderBottomColor: Colors.bottomborder,
              borderBottomWidth: 1,
              paddingVertical: (mobileW * 3.5) / 100,
            }}>
            <Image
              style={{
                height: (mobileW * 5) / 100,
                width: (mobileW * 5) / 100,
                resizeMode: 'contain',
                alignSelf: 'center',
              }}
              source={localimag.Bank}></Image>
            <View
              style={{
                flexDirection: 'row',
                width: (mobileW * 85) / 100,
                alignItems: 'center',
                justifyContent: 'space-between',
                marginLeft: (mobileW * 2) / 100,
              }}>
              <Text
                style={{
                  fontSize: (mobileW * 4) / 100,
                  fontFamily: Font.OutfitMedium,
                  color: Colors.mediumgrey,
                  textAlign: 'center',
                }}>
                {this.state.txtType ||
                  Lang_chg.Edit_Payment_Details[config.language]}
                {/* {Lang_chg.Edit_bank[config.language]} */}
              </Text>
              <Image
                style={{
                  height: (mobileW * 4) / 100,
                  width: (mobileW * 4) / 100,
                  resizeMode: 'contain',
                }}
                source={localimag.Blackb}></Image>
            </View>
          </TouchableOpacity>

          {/* ..................... Edit withdrawal options .................... */}

          {/* <TouchableOpacity
            onPress={() => { this.onGotoEditWihDrawalOptions(3) }}
            style={{
              flexDirection: 'row', width: mobileW * 92 / 100, alignSelf: 'center',
              justifyContent: 'center', borderBottomColor: Colors.bottomborder,
              borderBottomWidth: 1, paddingVertical: mobileW * 3.5 / 100
            }}>
            <Image style={{
              height: mobileW * 5 / 100, width: mobileW * 5 / 100, resizeMode: 'contain',
              alignSelf: 'center'
            }}
              source={localimag.withdrawalBank}>
            </Image>
            <View style={{
              flexDirection: 'row', width: mobileW * 85 / 100, alignItems: 'center',
              justifyContent: 'space-between', marginLeft: mobileW * 2 / 100
            }}>
              <Text style={{
                fontSize: mobileW * 4 / 100, fontFamily: Font.OutfitMedium, color: Colors.mediumgrey,
                textAlign: 'center',
              }}>
                Extra Withdrawal Options
              </Text>
              <Image style={{ height: mobileW * 4 / 100, width: mobileW * 4 / 100, resizeMode: 'contain', }}
                source={localimag.Blackb}>
              </Image>
            </View>
          </TouchableOpacity> */}

          {/* .....................Setting Profile.................... */}
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Driver_Setting')}
            // onPress={() => this.props.navigation.navigate('Setting')}
            style={{
              // backgroundColor: 'red',
              flexDirection: 'row',
              width: (mobileW * 92) / 100,
              alignSelf: 'center',
              justifyContent: 'center',
              borderBottomColor: Colors.bottomborder,
              borderBottomWidth: 1,
              paddingVertical: (mobileW * 3.5) / 100,
            }}>
            <Image
              style={{
                height: (mobileW * 5) / 100,
                width: (mobileW * 5) / 100,
                resizeMode: 'contain',
                alignSelf: 'center',
              }}
              source={localimag.Setting_Profile}></Image>
            <View
              style={{
                flexDirection: 'row',
                width: (mobileW * 85) / 100,
                alignItems: 'center',
                justifyContent: 'space-between',
                marginLeft: (mobileW * 2) / 100,
              }}>
              <Text
                style={{
                  fontSize: (mobileW * 4) / 100,
                  fontFamily: Font.OutfitMedium,
                  color: Colors.mediumgrey,
                  textAlign: 'center',
                }}>
                {Lang_chg.Setting_txt[config.language]}
              </Text>
              <Image
                style={{
                  height: (mobileW * 4) / 100,
                  width: (mobileW * 4) / 100,
                  resizeMode: 'contain',
                }}
                source={localimag.Blackb}></Image>
            </View>
          </TouchableOpacity>

          {/* .....................Place Profile.................... */}
          <TouchableOpacity
            onPress={() => this.switch_account()}
            // onPress={() => this.props.navigation.navigate('Home')}
            style={{
              flexDirection: 'row',
              width: (mobileW * 92) / 100,
              alignSelf: 'center',
              justifyContent: 'space-between',
              paddingVertical: (mobileW * 3.5) / 100,
              alignItems: 'center',
              borderBottomColor: Colors.bottomborder,
              borderBottomWidth: 1,
              marginBottom: (mobileH * 20) / 100,
            }}>
            <Text
              style={{
                fontSize: (mobileW * 4) / 100,
                fontFamily: Font.Semibold,
                color: Colors.red,
                textAlign: 'center',
              }}>
              {Lang_chg.Place_txt[config.language]}
            </Text>
            <Image
              style={{
                height: (mobileW * 4) / 100,
                width: (mobileW * 4) / 100,
                resizeMode: 'contain',
              }}
              source={localimag.Blackb}></Image>
          </TouchableOpacity>
        </ScrollView>

        <Driver_Footer
          activepage="Driver_Profile"
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
  image: {
    height: (mobileW * 5.5) / 100,
    width: (mobileW * 5.5) / 100,
  },
  text1: {
    fontSize: (mobileW * 4.3) / 100,
    fontFamily: Font.OutfitMedium,
    color: Colors.black,
  },
  Back_image: {
    height: (mobileW * 4.5) / 100,
    width: (mobileW * 4.5) / 100,
    tintColor: '#797979',
  },
});
