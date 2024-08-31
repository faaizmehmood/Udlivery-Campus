import {
  View,
  Image,
  StatusBar,
  Text,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Keyboard,
  StyleSheet,
  TextInput,
  ScrollView,
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
  notification,
} from '../Provider/utilslib/Utils';

export default class Driver_Cancelorder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: this.props.route.params.user_id,
      order_id: this.props.route.params.order_id,
      reason: '',
    };
  }
  componentDidMount() {
    //console.log('done', this.state.navi_status)
  }

  order_cancel_by_driver = async () => {
    // consolepro.consolelog(item)
    let url = config.baseURL + 'order_cancel_by_driver.php';
    consolepro.consolelog('url of cancel order Api:', url);
    var data = new FormData();
    data.append('user_id', this.state.user_id);
    // data.append('driver_id', this.state.user_id);
    data.append('order_id', this.state.order_id);
    data.append('cancellation_reason', this.state.reason);

    consolepro.consolelog('data', data);
    // return false;
    apifuntion
      .postApi(url, data, 0)
      .then(obj => {
        consolepro.consolelog('obj', obj);
        if (obj.success == 'true') {
          consolepro.consolelog(obj);
          msgProvider.toast(obj.msg[0], 'center');
          //   this.get_order_details()

          var notification_arr = obj.notification_arr;
          consolepro.consolelog({notification_arr});
          consolepro.consolelog({notification_arr});
          if (notification_arr != 'NA') {
            consolepro.consolelog({notification_arr});
            notification.notification_arr(notification_arr);
          }
          setTimeout(() => {
            this.props.navigation.navigate('Pendingui');
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
        consolepro.consolelog('-------- error ------- ' + error);

        msgProvider.alert(
          msgTitle.internet[config.language],
          msgText.networkconnection[config.language],
          false,
        );
      });
  };

  render() {
    return (
      <View style={{flex: 1, backgroundColor: Colors.white_color}}>
        <TouchableOpacity
          activeOpacity={1}
          style={{flex: 1}}
          onPress={() => {
            Keyboard.dismiss();
          }}>
          <SafeAreaView style={{backgroundColor: Colors.theamColor, flex: 0}} />
          {/* <StatusBar barStyle='light-content' backgroundColor={Colors.theamColor} hidden={false} translucent={false} /> */}

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
                source={localimag.goback}
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
                {Lang_chg.CancelOrder[config.language]}
              </Text>
            </View>
            <View style={{width: (mobileW * 10) / 100}}>
              {/* <Image style={{ height: mobileW * 7 / 100, width: mobileW * 7 / 100, resizeMode: 'contain' }} source={localimag.whitedot} /> */}
            </View>
          </View>

          <ScrollView
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}>
            <TouchableOpacity
              style={{flex: 1, paddingBottom: (mobileW * 15) / 100}}
              activeOpacity={1}>
              <View
                style={{
                  width: (mobileW * 83) / 100,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  marginTop: (mobileW * 3) / 100,
                  backgroundColor: Colors.white_color,
                }}>
                <TextInput
                  style={{
                    height: Font.text_area_height,

                    color: '#636363',
                    textAlignVertical: 'top',
                    fontFamily: Font.OutfitMedium,
                    fontSize: (mobileW * 3.8) / 100,
                    color: '#636363',
                    width: (mobileW * 82) / 100,
                    alignSelf: 'center',
                  }}
                  onChangeText={txt => {
                    this.setState({reason: txt});
                  }}
                  maxLength={200}
                  multiline={true}
                  selectionColor={Colors.textInputSelectionColor1}
                  // numberOfLines={7}
                  returnKeyLabel="done"
                  returnKeyType="done"
                  onSubmitEditing={() => {
                    Keyboard.dismiss();
                  }}
                  placeholderTextColor={'#636363'}
                  placeholder={Lang_chg.txt_reason[config.language]}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    width: (mobileW * 91) / 100,
                    borderBottomColor: Colors.bottomborder,
                    borderBottomWidth: 1,
                    alignSelf: 'center',
                    // marginTop: mobileW * 15 / 100,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: (mobileW * 2.5) / 100,
                  }}></View>
              </View>

              <TouchableOpacity
                onPress={() => {
                  if (this.state.reason == '') {
                    //FULL NAME
                    msgProvider.toast(
                      msgText.enter_reason[config.language],
                      'center',
                    );
                    return false;
                  }
                  // else if (this.state.desc.trim().length < 3) {
                  //     msgProvider.toast(msgText.Descriptionminimumcharacter[config.language], 'center');
                  //     return false;
                  // }
                  else if (this.state.reason.trim().length < 3) {
                    msgProvider.toast(
                      msgText.minimumReportMessage[config.language],
                      'center',
                    );
                    return false;
                  }

                  this.order_cancel_by_driver();
                  // this.state.navi_status == 0 ?
                  //     this.props.navigation.navigate('Driver_pending', { 'Status': 3 }) :
                  //     this.props.navigation.navigate('Driver_pendingDinFac', { 'Status': 8 })
                }}
                style={{
                  flexDirection: 'row',
                  width: (mobileW * 91) / 100,
                  alignSelf: 'center',
                  marginTop: (mobileW * 12) / 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: (mobileW * 2) / 100,
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
                  {Lang_chg.Submit[config.language]}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </ScrollView>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  ViewText: {
    flexDirection: 'row',
    width: (mobileW * 95) / 100,
    borderBottomColor: Colors.bottomborder,
    borderBottomWidth: 1,
    alignSelf: 'center',
    //marginTop: mobileW * 2 / 100,
    alignItems: 'center',
    borderRadius: (mobileW * 2.5) / 100,
    padding: (mobileW * 0) / 100,
  },
  textInputView: {
    width: '97%',
    //justifyContent: 'center',
    //paddingLeft: mobileW * 1 / 100,
    alignSelf: 'center',
    fontFamily: Font.Fontregular,
    color: Colors.textColors,
  },
  ImageView: {
    paddingVertical: (mobileW * 1) / 100,
    width: '8%',
    justifyContent: 'center',
  },
});
