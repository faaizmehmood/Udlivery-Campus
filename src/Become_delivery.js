import React, {Component} from 'react';
import {
  View,
  Image,
  Text,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  Keyboard,
  BackHandler,
  Alert,
} from 'react-native';
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
} from './Provider/utilslib/Utils';

export default class Become_delivery extends Component {
  constructor(props) {
    super(props);
    {
      this.state = {
        show1: 1,
        user_id: '',
      };
    }
    this._didFocusSubscription = props.navigation.addListener(
      'focus',
      payload =>
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress),
    );
  }

  componentDidMount = () => {
    this.getUserDetail();
    this._willBlurSubscription = this.props.navigation.addListener(
      'blur',
      payload =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          this.handleBackPress,
        ),
    );
  };

  handleBackPress = () => {
    // Alert.alert('Hold on!', 'Are you sure you want to exit app?', [
    //     {
    //         text: 'Cancel',
    //         onPress: () => null,
    //         style: 'cancel'
    //     },
    //     { text: 'YES', onPress: () => BackHandler.exitApp() }
    // ]);
    return true;
  };

  getUserDetail = async () => {
    let userdata = await localStorage.getItemObject('user_arr');
    consolepro.consolelog('userdata', userdata);
    this.setState({
      user_id: userdata.user_id,
    });
  };

  add_meal = async () => {
    let url = config.baseURL + 'add_meal_plan.php';
    consolepro.consolelog('url', url);
    var data = new FormData();
    data.append('user_id', this.state.user_id);
    data.append('meal_plan', this.state.show1);

    apifuntion
      .postApi(url, data)
      .then(obj => {
        if (obj.success == 'true') {
          setTimeout(() => {
            this.props.navigation.navigate('Driver_Add_Payment_Options', {
              edit: false,
              user_id: this.state.user_id,
            });
          }, 700);
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

  render() {
    return (
      <View style={{flex: 1}}>
        <TouchableOpacity
          activeOpacity={1}
          style={{flex: 1}}
          onPress={() => {
            Keyboard.dismiss();
          }}>
          <SafeAreaView style={{backgroundColor: Colors.theamColor, flex: 0}} />

          <ImageBackground
            style={{
              height: (mobileH * 100) / 100,
              width: '100%',
            }}
            source={localimag.vectorprofile}
            resizeMode="stretch">
            <View
              style={{width: '40%', position: 'absolute', right: 12, top: 20}}>
              <Image
                style={{
                  height: (mobileW * 30) / 100,
                  width: (mobileW * 25) / 100,
                  resizeMode: 'contain',
                  marginLeft: (mobileW * 8) / 100,
                }}
                source={localimag.newwhitelogo}
              />
            </View>

            <View
              style={{
                shadowColor: Colors.shadowbuy,
                shadowOffset: {width: 1, height: 1},
                shadowOpacity: 0.5,
                shadowRadius: 2,
                elevation: 2,
                width: (mobileW * 90) / 100,
                paddingVertical: (mobileW * 3) / 100,
                backgroundColor: '#fff',
                alignSelf: 'center',
                justifyContent: 'center',
                borderRadius: (mobileW * 3) / 100,
                marginTop: (mobileW * 40) / 100,
                paddingBottom: (mobileW * 10) / 100,
              }}>
              <Image
                style={{
                  alignSelf: 'center',
                  width: (mobileW * 35) / 100,
                  height: (mobileW * 46) / 100,
                }}
                resizeMode="contain"
                source={localimag.mealvector}></Image>

              <Text
                style={{
                  fontSize: (mobileW * 5) / 100,
                  fontFamily: Font.OutfitMedium,
                  color: Colors.light_grey,
                  textAlign: 'center',
                  marginTop: (mobileW * 4) / 100,
                  width: '70%',
                  alignSelf: 'center',
                }}>
                {Lang_chg.doyou[config.language]}
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  width: (mobileW * 40) / 100,
                  alignItems: 'center',
                  alignSelf: 'center',
                  paddingVertical: (mobileW * 2) / 100,
                }}>
                <TouchableOpacity
                  style={{flexDirection: 'row', alignItems: 'center'}}
                  activeOpacity={0.7}
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
                      }}></Image>
                  ) : (
                    <Image
                      source={localimag.radioff}
                      resizeMode="contain"
                      style={{
                        height: (mobileW * 6) / 100,
                        width: (mobileW * 6) / 100,
                      }}></Image>
                  )}
                  <Text
                    style={{
                      fontSize: (mobileW * 4) / 100,
                      fontFamily: Font.Fontregular,
                      color: Colors.textgrey,
                      marginLeft: (mobileW * 2) / 100,
                    }}>
                    {Lang_chg.yes[config.language]}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    marginLeft: (mobileW * 4) / 100,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                  activeOpacity={0.7}
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
                      source={localimag.radioff}
                      resizeMode="contain"
                      style={{
                        height: (mobileW * 6) / 100,
                        width: (mobileW * 6) / 100,
                      }}></Image>
                  )}

                  <Text
                    style={{
                      fontSize: (mobileW * 4) / 100,
                      fontFamily: Font.Fontregular,
                      marginLeft: (mobileW * 2) / 100,
                      color: Colors.textgrey,
                    }}>
                    {Lang_chg.No[config.language]}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* //-------------you will need-----// */}
              {this.state.show1 == 0 && (
                <View>
                  <View
                    style={{
                      width: (mobileW * 84) / 100,
                      alignItems: 'center',
                      alignSelf: 'center',
                      borderRadius: (mobileW * 1) / 100,
                      marginTop: mobileW * 0.01,
                      backgroundColor: Colors.whitepurple,
                      paddingVertical: (mobileW * 1) / 100,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: (mobileW * 60) / 100,
                        alignItems: 'center',
                        alignSelf: 'center',
                        marginTop: mobileW * 0.01,
                      }}>
                      <Text
                        style={{
                          fontSize: (mobileW * 3.5) / 100,
                          fontFamily: Font.Fontregular,
                          color: Colors.black,
                          textAlign: 'center',
                          width: '100%',
                          lineHeight: (mobileW * 5) / 100,
                        }}>
                        {Lang_chg.youneedunlimited[config.language]}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* // ------------text for No click----------// */}
              {this.state.show1 == 1 && (
                <View>
                  <View
                    style={{
                      width: (mobileW * 84) / 100,
                      alignItems: 'center',
                      alignSelf: 'center',
                      borderRadius: (mobileW * 1) / 100,
                      marginTop: mobileW * 0.01,
                      backgroundColor: Colors.whitepurple,
                      paddingVertical: (mobileW * 2.5) / 100,
                    }}>
                    <Text
                      style={{
                        fontSize: (mobileW * 3.5) / 100,
                        fontFamily: Font.Fontregular,
                        color: Colors.black,
                        textAlign: 'center',
                        width: '90%',
                        lineHeight: (mobileW * 5) / 100,
                      }}>
                      {Lang_chg.youwillneed[config.language]}
                    </Text>
                  </View>
                </View>
              )}

              <View
                style={{
                  marginTop: 10,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 10,
                }}>
                <TouchableOpacity
                  // onPress={() => { this.props.navigation.navigate('Addbank_detail', { edit: false, 'user_id':this.state.user_id }); }}
                  // onPress={() => { this.props.navigation.navigate('Addbank_detail') }}
                  onPress={() => {
                    this.add_meal();
                  }}
                  style={{
                    flexDirection: 'row',
                    width: (mobileW * 83) / 100,
                    alignSelf: 'center',
                    marginTop: (mobileW * 9) / 100,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: (mobileW * 1) / 100,
                    padding: (mobileW * 3) / 100,
                    backgroundColor: Colors.violet,
                  }}>
                  <Text
                    style={{
                      fontSize: (mobileW * 4) / 100,
                      color: Colors.white_color,
                      fontFamily: Font.fontbold,
                      textAlign: 'center',
                      paddingLeft: 3.5,
                    }}>
                    {Lang_chg.Continue[config.language]}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View></View>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  }
}
