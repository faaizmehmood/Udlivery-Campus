import {
  Alert,
  View,
  Image,
  StatusBar,
  Text,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Keyboard,
  RefreshControl,
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
} from './Provider/utilslib/Utils';
import {Nodata_foundimage} from './Provider/Nodata_foundimage';

export default class NotificatIon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      message: '',
      user_id: '',
      notification_arr: 'NA',
      refresh: false,
    };
  }

  componentDidMount = () => {
    this.getUserDetail();
  };

  getUserDetail = async () => {
    let userdata = await localStorage.getItemObject('user_arr');
    consolepro.consolelog('userdata', userdata);
    this.setState({
      user_id: userdata.user_id,
    });
    this.get_notification();
  };

  get_notification = async var1 => {
    let url = config.baseURL + 'get_notification.php';
    var data = new FormData();

    data.append('user_id', this.state.user_id);

    consolepro.consolelog('user data to be edited', data);
    var var2 = 0;
    if (var1 == 1) {
      var2 = 1;
    }
    apifuntion

      // .getApi(url, 0)
      .postApi(url, data, var2)
      .then(obj => {
        if (obj.success == 'true') {
          this.setState({
            notification_arr: obj.notification_arr,
            refresh: false,
          });
          console.log('Notiiiiiiii: ', obj.notification_arr[0]?.title);
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

  delete_all_notification = async () => {
    let url = config.baseURL + 'delete_all_notification.php';

    consolepro.consolelog('url', url);
    var data = new FormData();

    data.append('user_id', this.state.user_id);

    consolepro.consolelog('user data to be edited', data);
    apifuntion
      .postApi(url, data)
      .then(obj => {
        consolepro.consolelog('obj', obj);
        if (obj.success == 'true') {
          this.setState({notification_arr: 'NA'});
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

  delete_single_notification = async notification_id => {
    let url = config.baseURL + 'delete_single_notification.php';

    consolepro.consolelog('url', url);
    var data = new FormData();

    data.append('user_id', this.state.user_id);
    data.append('notification_id', notification_id);

    consolepro.consolelog('user data to be edited', data);
    apifuntion
      .postApi(url, data)
      .then(obj => {
        consolepro.consolelog('obj', obj);
        if (obj.success == 'true') {
          this.get_notification();
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

  //25-08-22
  delete_single_notification_alert = async item => {
    Alert.alert(
      'Hold on!',
      'Are you sure you want to delete this notification?',
      [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'YES',
          onPress: () => this.delete_single_notification(item.notification_id),
        },
      ],
    );
    return true;
  };

  delete_all_notification_alert = async () => {
    Alert.alert(
      'Hold on!',
      'Are you sure you want to clear all notification?',
      [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'YES', onPress: () => this.delete_all_notification()},
      ],
    );
    return true;
  };

  _onRefresh = () => {
    this.setState({refresh: true});
    // this.getAllProduct(1);
    this.get_notification(1);
  };

  render() {
    return (
      <View style={{flex: 1}}>
        {/* <TouchableOpacity style={{ flex: 1 }} onPress={() => { Keyboard.dismiss() }}> */}
        <SafeAreaView style={{backgroundColor: Colors.theamColor, flex: 0}} />
        {/* <StatusBar barStyle='light-content' backgroundColor={Colors.theamColor} hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} /> */}

        <View
          style={{
            flexDirection: 'row',
            paddingVertical: (mobileW * 1) / 100,
            width: (mobileW * 100) / 100,
            alignSelf: 'center',
            backgroundColor: Colors.theamColor,
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{
              width: (mobileW * 13) / 100,
              paddingVertical: (mobileW * 3) / 100,
            }}
            onPress={() => this.props.navigation.goBack()}>
            <Image
              style={{
                height: (mobileW * 5.3) / 100,
                width: (mobileW * 5.3) / 100,
                resizeMode: 'contain',
                marginLeft: (mobileW * 2) / 100,
              }}
              source={localimag.BackW}
            />
          </TouchableOpacity>
          <View style={{width: (mobileW * 71) / 100, alignItems: 'center'}}>
            <Text
              style={{
                fontSize: (mobileW * 5) / 100,
                color: Colors.white_color,
                fontFamily: Font.OutfitMedium,
              }}>
              {Lang_chg.Notification[config.language]}
            </Text>
          </View>
          {this.state.notification_arr != 'NA' && (
            <TouchableOpacity
              onPress={() => {
                if (this.state.notification_arr != 'NA') {
                  this.delete_all_notification_alert();
                }
              }}
              style={{
                width: (mobileW * 16) / 100,
                paddingRight: mobileW * 0.03,
              }}>
              <Text
                style={{
                  fontSize: (mobileW * 4) / 100,
                  alignSelf: 'center',
                  color: Colors.white_color,
                  fontFamily: Font.Fontregular,
                }}>
                {Lang_chg.clear[config.language]}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refresh}
              onRefresh={this._onRefresh}
            />
          }
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            style={{flex: 1}}
            onPress={() => {
              Keyboard.dismiss();
            }}
            activeOpacity={1}>
            {this.state.notification_arr != 'NA' ? (
              <FlatList
                data={this.state.notification_arr}
                contentContainerStyle={{paddingBottom: (mobileW * 15) / 100}}
                scrollEnabled={false}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        item.action == 'new_order' ||
                        item.action == 'accept_order' ||
                        item.action == 'delivered_order' ||
                        item.action == 'pikcup_order'
                          ? this.props.navigation.navigate('Pendingui', {
                              order_id: item.action_id,
                            })
                          : null;
                      }}
                      activeOpacity={1}
                      style={{marginTop: (mobileW * 3) / 100}}>
                      <View
                        style={{
                          width: (mobileW * 100) / 100,
                          alignSelf: 'center',
                          justifyContent: 'center',
                        }}>
                        <View
                          style={{
                            backgroundColor: Colors.white_color,
                            shadowColor: Colors.shadow_color,
                            shadowOffset: {width: 2, height: 2},
                            shadowOpacity: 0.2,
                            elevation: 2,
                            flexDirection: 'row',
                            width: (mobileW * 95) / 100,
                            alignSelf: 'center',
                            paddingVertical: (mobileW * 3) / 100,
                            borderRadius: (mobileW * 2) / 100,
                          }}>
                          <View
                            style={{
                              width: (mobileW * 18) / 100,
                              alignSelf: 'center',
                              justifyContent: 'center',
                            }}>
                            <View
                              style={{
                                width: (mobileW * 13.5) / 100,
                                borderRadius: (mobileW * 2) / 100,
                                alignSelf: 'center',
                                justifyContent: 'center',
                              }}>
                              <Image
                                style={{
                                  height: (mobileW * 14.5) / 100,
                                  width: (mobileW * 13.7) / 100,
                                  resizeMode: 'contain',
                                  borderWidth: 2,
                                  borderColor: '#f1f5f0',

                                  borderRadius: (mobileW * 2) / 100,
                                  alignSelf: 'center',
                                }}
                                source={
                                  item.action == 'signup' ||
                                  item.action == 'broadcast'
                                    ? require('./icons/logo_new.png')
                                    : item.image == null
                                    ? localimag.img_placeholder
                                    : {uri: config.img_url + item.image}
                                }></Image>
                            </View>
                          </View>

                          <View
                            style={{
                              width: (mobileW * 76) / 100,
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                width: (mobileW * 76) / 100,
                                justifyContent: 'space-between',
                                alignSelf: 'center',
                              }}>
                              <Text
                                style={{
                                  marginTop: (mobileW * 2.5) / 100,
                                  fontSize: (mobileW * 3.8) / 100,
                                  fontFamily: Font.OutfitMedium,
                                  color: Colors.black_color,
                                }}>
                                {item.name || item.title}
                              </Text>
                              <TouchableOpacity
                                onPress={() =>
                                  this.delete_single_notification_alert(item)
                                }>
                                <Image
                                  style={{
                                    marginTop: (mobileW * 0.8) / 100,
                                    height: (mobileW * 4.5) / 100,
                                    width: (mobileW * 4.5) / 100,
                                    resizeMode: 'contain',
                                    borderRadius: (mobileW * 1) / 100,
                                    alignSelf: 'center',
                                    marginRight: (mobileW * 2) / 100,
                                  }}
                                  source={localimag.cross}></Image>
                              </TouchableOpacity>
                            </View>

                            <View
                              style={{
                                width: (mobileW * 76) / 100,
                                alignSelf: 'center',
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                              }}>
                              <Text
                                style={{
                                  width: '57%',
                                  marginTop: (mobileW * 1.8) / 100,
                                  fontSize: (mobileW * 3) / 100,
                                  fontFamily: Font.OutfitMedium,
                                  color: Colors.textgrey,
                                }}>
                                {item.message}
                              </Text>
                              <Text
                                style={{
                                  width: '43%',
                                  marginTop: (mobileW * 3) / 100,
                                  fontSize: (mobileW * 3) / 100,
                                  fontFamily: Font.OutfitMedium,
                                  color: Colors.textgrey,
                                  alignSelf: 'flex-end',
                                  marginRight: (mobileW * 2) / 100,
                                }}>
                                {item.createtime}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            ) : (
              <Nodata_foundimage />
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}
