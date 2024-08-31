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
} from './Provider/utilslib/Utils';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Mapprovider from './Provider/Mapprovider';
import {borderColor} from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';
import {mediaprovider, Cameragallery} from './Provider/utilslib/Utils';

export default class Edit_Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      // Status: this.props.route.params.Status,
      password_show: true,
      mod: false,

      //radhekrishan
      mediamodal: false,
      user_img: '',
      // name: '',
      // email: '',
      // university_name:''
      // 15-07
      user_type: 'NA',
      user_name: 'NA',
      user_phone: 'NA',
      user_email: 'NA',

      //radhekrishan
      sel_university_id: '',
      university_arr: '',
      university_arr1: '',
      sel_university_name: '',
      mobile: '',
      //05-08
      user_image: '',
    };
  }

  componentDidMount = () => {
    this.getUserDetail();
  };

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
              university_arr1: university_arr,
              //   mod: true
            });
          }, 300);

          consolepro.consolelog('i am outside ');

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
        console.log('error', error);
      });
  };

  get_university_2 = async () => {
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
              mod: true,
            });
          }, 300);

          consolepro.consolelog('i am outside ');

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
        console.log('error', error);
      });
  };

  getUserDetail = async () => {
    let userdata = await localStorage.getItemObject('user_arr');
    consolepro.consolelog('userdata', userdata);

    var image = '';
    if (userdata.image == null) {
      image = '';
    } else {
      image = config.img_url + userdata.image;
    }

    this.setState({
      user_id: userdata.user_id,
      user_type: userdata.user_type,
      user_name: userdata.name,
      user_email: userdata.email,
      mobile: userdata.mobile,
      user_image: image,
      sel_university_id: userdata.university_id,
    });
    // userdata.image == null?
    // this.setState({
    // 	user_image: userdata.image,
    // }):
    // this.setState({
    // 	user_image: userdata.image,
    // })
    this.get_university();
    // this.setState({ mod:false})
    // consolepro.consolelog('myusername', this.state.user_name);
  };

  edit_profile = async () => {
    if (this.state.user_name.length <= 0) {
      msgProvider.toast(msgText.enterfullname[config.language], 'center');
      return false;
    }
    if (this.state.user_name.trim().length < 3) {
      msgProvider.toast(
        msgText.fullnameminimumcharacter[config.language],
        'center',
      );
      return false;
    }
    if (this.state.mobile.trim().length <= 0) {
      msgProvider.toast(msgText.emptyMobile[config.language], 'center');
      return false;
    }
    if (this.state.mobile.length > 0) {
      if (this.state.mobile.length < 7) {
        msgProvider.toast(msgText.mobileMinLength[config.language], 'center');
        return false;
      }
      var mobilevalidation = config.mobilevalidation;
      if (mobilevalidation.test(this.state.mobile) !== true) {
        msgProvider.toast(msgText.validMobile[config.language], 'center');
        return false;
      }
    }
    if (this.state.user_email.trim().length <= 0) {
      msgProvider.toast(msgText.enteremail[config.language], 'center');
      return false;
    }
    if (config.regemail.test(this.state.user_email) !== true) {
      msgProvider.toast(msgText.entervalidemail[config.language], 'center');
      return false;
    }
    if (this.state.sel_university_id == '') {
      msgProvider.toast(
        msgText.PleaseSelectUniversity[config.language],
        'center',
      );
      return true;
    }

    let url =
      this.state.user_type == 2
        ? config.baseURL + 'edit_profile_deliver.php'
        : config.baseURL + 'edit_profile_customer.php';
    consolepro.consolelog('url', url);

    var data = new FormData();

    if (this.state.user_image != '') {
      data.append('image', {
        uri: this.state.user_image,
        type: 'image/jpg',
        name: 'image.jpg',
      });
    }
    data.append('user_id', this.state.user_id);
    data.append('name', this.state.user_name);
    data.append('email', this.state.user_email);
    data.append('mobile', this.state.mobile);
    {
      this.state.user_type == 1 &&
        data.append('university_id', this.state.sel_university_id);
    }

    consolepro.consolelog('user data to be edited', data);
    apifuntion
      .postApi(url, data)
      .then(obj => {
        consolepro.consolelog('obj', obj);
        if (obj.success == 'true') {
          localStorage.setItemObject('user_arr', obj.user_details);

          consolepro.consolelog(
            'user data values after getting from localstorage',
          );
          // let userdata = localStorage.getItemObject('user_arr');
          //     consolepro.consolelog('userdata', userdata);

          const {
            user_id,
            name,
            notification_status,
            user_type,
            email,
            image,
            login_type,
          } = obj.user_details;

          const player_id_me = config.playerID;
          const id = `u_${user_id}`;

          const jsonUserDataMe = {
            name,
            email,
            image,
            onlineStatus: 'true',
            player_id: player_id_me,
            user_id: parseInt(user_id),
            user_type,
            notification_status,
            chat_room_id: 'no',
            login_type,
          };
          console.log('jsonUserDataMe =>>>>>>>>>>>>>>>>>>>', jsonUserDataMe);

          firebaseprovider.CreateUserInformation(id, jsonUserDataMe);

          setTimeout(() => {
            //    this.props.navigation.navigate('Home');
            this.props.navigation.goBack();
            // this.props.navigation.navigate('Verify',{user_id:obj.user_details.user_id});
          }, 700);
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
        console.log('error', error);
      });

    const user_arr = await localStorage.getItemObject('user_arr');

    if (!user_arr) {
      return;
    }
  };

  //-------------------image
  //-----------------for camera open----------------------

  Camerapopen = async () => {
    mediaprovider
      .launchCamera(true)
      // .launchCamera(false)
      .then(res => {
        //console.log('camerares', res);

        let tmp = res.path;

        this.setState({
          mediamodal: false,

          // user_img: tmp
          user_image: tmp,
        });
        consolepro.consolelog(
          'user_img after update will be',
          this.state.user_image,
        );
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
      .launchGellery(true)
      // .launchCamera(false)
      .then(res => {
        //console.log('camerares', res);

        let tmp = res.path;

        this.setState({
          mediamodal: false,

          user_image: tmp,
        });
        consolepro.consolelog(
          'user_img after update will be',
          this.state.user_image,
        );
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

  // 15-08-22
  //--------function for local search-------//
  _searchProduct = textToSearch => {
    let data1 = this.state.university_arr1;
    // let data1 = this.state.university_arr
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

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#F7F7F7'}}>
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

        <SafeAreaView style={{flex: 0, backgroundColor: Colors.white1}} />
        {/* <StatusBar
                    hidden={false}
                    backgroundColor={Colors.Red1}
                    translucent={false}
                    networkActivityIndicatorVisible={true}
                    barStyle='light-content'
                /> */}
        {/* Modal-------------------------------------- */}
        {/* <Modal
                    animationType="slide"
                    transparent
                    visible={this.state.mod_2}
                    onRequestClose={() => {
                    }}>

                    <View
                        style={{
                            flex: 1,
                            backgroundColor: '#00000099',
                            alignItems: 'center',
                            //justifyContent: 'flex-end',
                            // bottom:-mobileH*2/100,
                            borderRadius: 0,

                        }}>

                        <View style={{
                            marginBottom: mobileW * 20 / 100, bottom: 0, position: 'absolute',
                            backgroundColor: Colors.white_color, alignItems: 'center',
                            width: '90%', borderRadius: mobileW * 6 / 100,
                            paddingVertical: mobileH * 1 / 100
                        }}>
                            <View style={{ paddingVertical: mobileH * 2 / 100, borderBottomColor: '#F2F2F2', borderBottomWidth: 1, width: '100%', alignItems: 'center' }}>
                                <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.Fontregular }}>
                                    {Lang_chg.Select_Option[config.language]}
                                </Text>
                            </View>
                            <View
                                style={{ paddingVertical: mobileH * 2 / 100, borderBottomColor: '#F2F2F2', borderBottomWidth: 1, width: '100%', alignItems: 'center' }}>
                                <Text style={{
                                    fontSize: mobileW * 4 / 100,
                                    fontFamily: Font.Fontregular
                                }}>{Lang_chg.camera[config.language]}</Text>
                            </View>
                            <View
                                style={{ paddingVertical: mobileH * 2 / 100, width: '100%', alignItems: 'center' }}>
                                <Text style={{
                                    fontSize: mobileW * 4 / 100,
                                    fontFamily: Font.Fontregular
                                }}>{Lang_chg.gallary[config.language]}</Text>
                            </View>

                        </View>

                        <View style={{
                            backgroundColor: Colors.white_color,
                            alignItems: 'center', width: '90%', borderRadius: mobileW * 4 / 100,
                            bottom: 0, position: 'absolute', marginBottom: mobileW * 0.05
                        }}>
                            <TouchableOpacity style={{
                                backgroundColor: Colors.white_color,
                                alignItems: 'center', width: '100%', borderRadius: 15,

                            }} onPress={() => {
                                this.setState({ mod: 'false' })

                            }}>

                                <View style={{
                                    paddingVertical: mobileH * 2 / 100,
                                    width: '100%', alignItems: 'center'
                                }}>
                                    <Text style={{
                                        fontSize: mobileW * 4 / 100,
                                        fontFamily: Font.Fontregular, color: '#DC1A21'
                                    }}>{Lang_chg.cancel[config.language]}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                    </View>

                </Modal> */}

        {/* ------------------------------------------------- */}

        {/* Modal-------------------------------------- */}
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.mod}
          onRequestClose={() => {
            this.setState({mod: false});
          }}>
          <View style={{flex: 1, backgroundColor: '#F7F7F7'}}>
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
                style={{width: (mobileW * 12) / 100}}
                onPress={() => {
                  this.setState({mod: false});
                }}>
                <Image
                  style={{
                    height: (mobileW * 6.5) / 100,
                    width: (mobileW * 6.5) / 100,
                    resizeMode: 'contain',
                  }}
                  source={localimag.BackW}
                />
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
            {/*Search----------------------  */}

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
                selectionColor={Colors.textInputSelectionColor1}
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

            <FlatList
              // data={this.state.car_arr}
              data={this.state.university_arr}
              scrollIndicatorInsets={false}
              keyExtractor={index => {
                index.toString();
              }}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    key={index}
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
                      style={{justifyContent: 'center', alignItems: 'center'}}>
                      <Image
                        source={{uri: config.img_url + item.university_image}}
                        // source={item.university_image}
                        resizeMode="contain"
                        style={{
                          height: (mobileW * 5.5) / 100,
                          width: (mobileW * 5.5) / 100,
                          alignSelf: 'center',
                          padding: 10,
                        }}></Image>
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
          </View>
        </Modal>

        {/* Header-------------------------------------- */}

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
            style={{width: (mobileW * 12) / 100}}
            onPress={() => this.props.navigation.goBack('')}>
            <Image
              style={{
                height: (mobileW * 6) / 100,
                width: (mobileW * 6) / 100,
                resizeMode: 'contain',
              }}
              source={localimag.BackW}
            />
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
              {Lang_chg.txt_edit[config.language]}
            </Text>
          </View>
          <View style={{width: (mobileW * 12) / 100}}></View>
        </View>
        <KeyboardAwareScrollView>
          <View
            style={{
              width: '86%',
              alignSelf: 'center',
              marginTop: mobileW * 0.08,
            }}>
            {/* Profile img-------------------------------------- */}
            <View
              style={{
                height: (mobileW * 28) / 100,
                width: (mobileW * 28) / 100,
                borderRadius: (mobileW * 16) / 100,
                alignSelf: 'center',
                marginTop: mobileW * 0.05,
                backgroundColor: Colors.white1,
                alignItems: 'center',
                justifyContent: 'center',
                elevation: 2,
                shadowOffset: {width: 0},
                shadowColor: '#000',
                shadowOpacity: 0.2,
              }}>
              {this.state.user_image != '' ? (
                <TouchableOpacity
                  onPress={() => this.setState({mediamodal: true})}>
                  <Image
                    source={{uri: this.state.user_image}}
                    style={{
                      height: (mobileW * 26) / 100,
                      width: (mobileW * 26) / 100,
                      borderRadius: (mobileW * 14) / 100,
                      alignSelf: 'center',
                    }}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => this.setState({mediamodal: true})}>
                  <Image
                    source={localimag.img_placeholder}
                    style={{
                      height: (mobileW * 28) / 100,
                      width: (mobileW * 28) / 100,
                      borderRadius: (mobileW * 26) / 200,
                      alignSelf: 'center',
                    }}
                  />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={{
                  width: (mobileW * 10) / 100,
                  alignSelf: 'center',
                  marginTop: (mobileH * 5) / 100,
                  marginLeft: (mobileW * 5) / 100,
                  position: 'absolute',
                  bottom: 2,
                  right: 0,
                }}
                onPress={() => this.setState({mediamodal: true})}
                // onPress={() => this.setState({ mod: true })}
              >
                <Image
                  source={localimag.Cam}
                  style={{
                    width: (mobileW * 10) / 100,
                    height: (mobileW * 12) / 100,
                  }}
                />
              </TouchableOpacity>
            </View>

            {/* .....................For Name.................... */}
            <View
              style={{
                width: '96%',
                alignSelf: 'center',
                paddingVertical: (mobileW * 1) / 100,
                flexDirection: 'row',
                marginTop: mobileW * 0.08,
                alignItems: 'center',
              }}>
              {/* name Image------------ */}
              <View style={{width: '8%', justifyContent: 'center'}}>
                <Image
                  source={localimag.Usericonc2}
                  resizeMode="contain"
                  style={{
                    height: (mobileW * 6) / 100,
                    width: (mobileW * 6) / 100,
                  }}
                />
              </View>
              {/* textInput--------- */}
              <View style={{width: '88%', justifyContent: 'center'}}>
                <TextInput
                  value={this.state.user_name}
                  selectionColor={Colors.textInputSelectionColor1}
                  onChangeText={txt => this.setState({user_name: txt})}
                  placeholder={Lang_chg.Name_txt[config.language]}
                  keyboardType="default"
                  placeholderTextColor={Colors.setting}
                  maxLength={50}
                  style={{
                    width: '95%',
                    fontSize: (mobileW * 4) / 100,
                    color: Colors.setting,
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
                borderBottomColor: Colors.bottomborder,
                borderBottomWidth: 1,
                alignSelf: 'center',
              }}></View>

            {/* .....................For Mobile.................... */}
            <View
              style={{
                width: '96%',
                alignSelf: 'center',
                paddingVertical: (mobileW * 1) / 100,
                flexDirection: 'row',
                // marginTop: mobileW * 0.08,
                alignItems: 'center',
              }}>
              {/* name Image------------ */}
              <View style={{width: '8%', justifyContent: 'center'}}>
                <Image
                  source={localimag.telephone}
                  resizeMode="contain"
                  style={{
                    tintColor: Colors.theamColor,
                    height: (mobileW * 5) / 100,
                    width: (mobileW * 5) / 100,
                  }}
                />
              </View>
              {/* textInput--------- */}
              <View style={{width: '88%', justifyContent: 'center'}}>
                <TextInput
                  value={this.state.mobile}
                  selectionColor={Colors.textInputSelectionColor1}
                  onChangeText={txt => this.setState({mobile: txt})}
                  placeholder={Lang_chg.Mobile_txt[config.language]}
                  keyboardType="default"
                  placeholderTextColor={Colors.setting}
                  maxLength={15}
                  style={{
                    width: '95%',
                    fontSize: (mobileW * 4) / 100,
                    color: Colors.setting,
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
                borderBottomColor: Colors.bottomborder,
                borderBottomWidth: 1,
                alignSelf: 'center',
              }}></View>

            {/* .....................For Email.................... */}
            <View
              style={{
                flexDirection: 'row',
                paddingVertical: (mobileW * 1) / 100,
                width: '99%',
                alignSelf: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: '10%',
                  justifyContent: 'center',
                  alignSelf: 'center',
                }}>
                <Image
                  style={{
                    height: (mobileW * 6) / 100,
                    width: (mobileW * 6) / 100,
                    resizeMode: 'contain',
                    alignSelf: 'center',
                  }}
                  source={localimag.Emailiconc2}></Image>
              </View>
              {/* <View> */}
              {/* textInput--------- */}
              {/* <View style={{ width: '90%', justifyContent: 'center',backgroundColor:'red' }}> */}
              <TextInput
                editable={false}
                value={this.state.user_email}
                selectionColor={Colors.textInputSelectionColor1}
                onChangeText={txt => this.setState({email: txt})}
                placeholder={Lang_chg.Email_txt[config.language]}
                keyboardType="email-address"
                placeholderTextColor={Colors.setting}
                maxLength={100}
                style={{
                  // backgroundColor: 'red',
                  // paddingVertical:mobileW * 1.3 / 100,
                  paddingVertical: (mobileW * 2.5) / 100,
                  width: '95%',
                  fontSize: (mobileW * 4) / 100,
                  fontFamily: Font.OutfitMedium,
                  color: Colors.mediumgrey,
                  // textAlign: 'center',
                  marginTop: (mobileW * 0.8) / 100,
                }}></TextInput>
              {/* </View> */}
              {/* </View> */}
            </View>
            <View
              style={{
                marginBottom: (mobileW * 1) / 100,
                width: '100%',
                borderBottomColor: Colors.bottomborder,
                borderBottomWidth: 1,
                alignSelf: 'center',
              }}></View>

            {/* .....................For University name.................... */}
            {this.state.user_type == 1 && (
              <TouchableOpacity
                onPress={() => {
                  // this.setState({mod: true})
                  // this.get_university()
                  this.get_university_2();
                }}
                // style={{ backgroundColor: 'red' }}
              >
                <View
                  style={{
                    //  backgroundColor:'red',
                    width: '96%',
                    alignSelf: 'center',
                    flexDirection: 'row',
                    marginTop: (mobileW * 1) / 100,
                    marginBottom: (mobileW * 2) / 100,
                    alignItems: 'center',
                  }}>
                  {/* name Image------------ */}
                  <View
                    style={{
                      // width: '8%',
                      width: '10%',
                      justifyContent: 'center',
                    }}>
                    <Image
                      source={localimag.universityiconc2e}
                      resizeMode="contain"
                      style={{
                        height: (mobileW * 6) / 100,
                        width: (mobileW * 6) / 100,
                      }}
                    />
                  </View>
                  {/* textInput--------- */}
                  <View style={{width: '88%', justifyContent: 'center'}}>
                    <Text
                      // 		onChangeText={(txt) => this.setState({ university_name: txt })}
                      //         placeholder={Lang_chg.txt_University[config.language]}
                      // keyboardType='default'
                      // placeholderTextColor={Colors.setting}
                      // maxLength={50}
                      style={{
                        width: '95%',
                        fontSize: (mobileW * 4) / 100,
                        color: Colors.setting,
                        paddingVertical: (mobileH * 1) / 100,
                        fontFamily: Font.OutfitMedium,
                        textAlignVertical: 'center',
                      }}>
                      {this.state.sel_university_name}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    width: '100%',
                    borderBottomColor: Colors.bottomborder,
                    borderBottomWidth: 1,
                    alignSelf: 'center',
                  }}></View>
              </TouchableOpacity>
            )}

            {/* .....................For University text.................... */}
            {/* <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => { this.get_university() }}
                            style={{
                                width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: mobileW * 0.06, alignItems: 'center',
                                borderBottomColor: Colors.white1, borderBottomWidth: 1, paddingVertical: mobileW * 2.5/100,
                            }}>
                            <Text style={{
                                width: '90%', fontSize: mobileW * 0.04, fontFamily: Font.Bold,
                                // color: Colors.white1
                                color: Colors.setting
                            }}>
                                {this.state.sel_university_name ==''? Lang_chg.Find_txt[config.language] : this.state.sel_university_name}</Text>
                            <Image source={localimag.BlackS} resizeMode='contain'
                                style={{ height: mobileW * 3 / 100, width: mobileW * 3 / 100, alignSelf: 'center' }}></Image>
                        </TouchableOpacity> */}
            {/* .....................For Btn.................... */}
            <TouchableOpacity
              onPress={() => {
                this.edit_profile();
              }}
              activeOpacity={0.7}
              style={{
                width: '100%',
                height: mobileW * 0.13,
                borderRadius: mobileW * 0.02,
                marginTop: mobileW * 0.14,
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: Colors.theamColor,
              }}>
              <Text
                style={{
                  fontSize: (mobileW * 4.3) / 100,
                  fontFamily: Font.OutfitMedium,
                  color: Colors.white1,
                }}>
                {Lang_chg.txt_Update[config.language]}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
