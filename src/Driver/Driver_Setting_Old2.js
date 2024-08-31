import {
    Text, View, ImageBackground, Image, TextInput, Dimensions,  SafeAreaView, ScrollView,
    StatusBar, TouchableOpacity, StyleSheet,Alert
  } from 'react-native';
  import React, { Component } from 'react';
  const MobileW = Dimensions.get('window').width;
  const MobileH = Dimensions.get('window').height;
  import { config, Common_Button, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag } from '../Provider/utilslib/Utils';
  // import Footer from './Provider/Footer'
  import { Switch } from 'react-native-switch';
  import { CommonActions } from '@react-navigation/native';
  
  
  export default class Setting extends Component {
    constructor(props) {
      super(props);
      this.state = {
        show: true,
        password_show: true,
        switchValue: true,
      }
    }
  
    
    LogoutPress = () => {
          Alert.alert(
              'Logout',
              'Do you want to logout app',
              [
                  {
                      text: 'No',
                      onPress: () => {},
                      style: 'Yes'
                  },
                  {
                      text: 'Yes',
                      onPress: () => {
                          localStorage.clear();
  
                          // this.props.navigation.dispatch(
                          // 	CommonActions.reset({
                          // 		index: 1,
                          // 		routes: [{ name: 'Customertype' }]
                          // 	})
                          // );
                          // this.props.navigation.reset({
                          //   index: 0,
                          //   routes: [{name: 'login'}],
                          // });
                          this.props.navigation.navigate('Login' )
                      }
                  }
              ],
              {
                  cancelable: false
              }
          ); // works best when the goBack is async
          return true;
      };
  
  
  
  
  
  
  
  
  
  
  
  
  
  
    render() {
      return (
        <View style={{ flex: 1, backgroundColor: '#F7F7F7' }}>
          <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theamColor }} />
          <StatusBar
            backgroundColor={Colors.theamColor}
            hidden={false}
            barStyle={'light-content'}
            // backgroundColor={Colors.back_color}
            translucent={false}
            networkActivityIndicatorVisible={true}
          />
  
          {/* .....................For Header.................... */}
          <View style={{
            paddingLeft: mobileW * 0.02, flexDirection: 'row', justifyContent: 'flex-start',
            width: mobileW * 100 / 100, alignItems: 'center', backgroundColor: Colors.theamColor
          }}>
            <TouchableOpacity style={{ width: mobileW * 12 / 100, paddingLeft: mobileW * 3 / 100 }} onPress={() => this.props.navigation.goBack('')} >
              <Image style={{ height: mobileW * 6 / 100, width: mobileW * 6 / 100, resizeMode: 'contain' }} source={localimag.goback} />
            </TouchableOpacity>
            <View style={{ width: mobileW * 76 / 100, paddingVertical: mobileW * 3 / 100, alignItems: 'center', alignSelf: 'center' }}>
              <Text style={{ fontSize: mobileW * 5 / 100, color: Colors.white_color, fontFamily: Font.OutfitMedium }}>{Lang_chg.Setting_txt[config.language]}</Text>
            </View>
            <View style={{ width: mobileW * 12 / 100 }}>
            </View>
          </View>
          <ScrollView keyboardDismissMode='interactive' keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>
            <TouchableOpacity style={{ flex: 1, paddingBottom: mobileW * 30 / 100 }} activeOpacity={1}>
  
              {/* .....................For Notification.................... */}
              <View style={{
                width: '96%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between',
                paddingVertical: mobileW * 0.035
              }}>
                <View style={{ width: '10%', justifyContent: 'center', alignItems: 'center' }}>
                  <Image
                    source={localimag.Notification}
                    resizeMode='contain'
                    style={{ height: mobileW * 6 / 100, width: mobileW * 6 / 100, }}
                  />
                </View>
                <View style={{ width: '76%', justifyContent: 'center' }}>
                  <Text style={styles.text1}>{Lang_chg.txt_notifications[config.language]}</Text>
                </View>
                <View style={{ width: '15%', justifyContent: 'center' }}>
                <Switch
                color={Colors.white_color}
                value={this.state.show}
                onValueChange={(text) => this.setState({ show: text })}
                activeText={''}
                inActiveText={''}
                backgroundActive={Colors.theamColor}
                backgroundInactive='#c2c0ba'
                circleActiveColor={Colors.white1}
                circleInActiveColor={Colors.white1}
                circleSize={Platform.OS == 'android' ? 20 : 19}
                barHeight={Platform.OS == 'android' ? 20 : 20}
                circleBorderWidth={0.1}
              // switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
              // switchRightPx={2}
              />
                </View>
              </View>
              <View style={{ width: '100%', height: 1, backgroundColor: Colors.bottomborder, alignSelf: 'center', }}></View>
  
              {/* .....................For Edit Profile.................... */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => { this.props.navigation.navigate('Edit_Profile', { 'Status': 2 }) }}
                style={{
                  width: '96%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between',
                  paddingVertical: mobileW * 0.035
                }}>
                <View style={{ width: '10%', justifyContent: 'center', alignItems: 'center' }}>
                  <Image
                    source={localimag.editprofile}
                    resizeMode='contain'
                    style={styles.image}
                  /></View>
                <View style={{ width: '85%', justifyContent: 'center' }}>
                  <Text style={styles.text1}>{Lang_chg.txt_edit[config.language]}</Text>
                </View>
                <View style={{ width: '10%' }}>
                  <Image
                    source={localimag.Blackb}
                    resizeMode='contain'
                    style={styles.Back_image}
                  /></View>
              </TouchableOpacity>
              <View style={{ width: '100%', height: 1, backgroundColor: Colors.bottomborder, alignSelf: 'center', }}></View>
              {/* .....................For Change Password.................... */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => { this.props.navigation.navigate('Change_Password') }}
                style={{
                  width: '96%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between',
                  paddingVertical: mobileW * 0.035
                }}>
                <View style={{ width: '10%', justifyContent: 'center', alignItems: 'center' }}>
                  <Image
                    source={localimag.Changepassword}
                    resizeMode='contain'
                    style={styles.image}
                  /></View>
                <View style={{ width: '85%', justifyContent: 'center' }}>
                  <Text style={styles.text1}>{Lang_chg.txt_change_password[config.language]}</Text>
                </View>
                <View style={{ width: '10%' }}>
                  <Image
                    source={localimag.Blackb}
                    resizeMode='contain'
                    style={styles.Back_image}
                  /></View>
              </TouchableOpacity>
              <View style={{ width: '100%', height: 1, backgroundColor: Colors.bottomborder, alignSelf: 'center', }}></View>
              {/* .....................For About us.................... */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => this.props.navigation.navigate('Termandcon', { 'contentpage': 2 })}
                style={{
                  width: '96%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between',
                  paddingVertical: mobileW * 0.035,
                }}>
                <View style={{ width: '10%', justifyContent: 'center', alignItems: 'center' }}>
                  <Image
                    source={localimag.Aboutusicon}
                    resizeMode='contain'
                    style={styles.image}
                  /></View>
                <View style={{ width: '85%', justifyContent: 'center' }}>
                  <Text style={styles.text1}>{Lang_chg.txt_aboutUs[config.language]}</Text>
                </View>
                <View style={{ width: '10%' }}>
                  <Image
                    source={localimag.Blackb}
                    resizeMode='contain'
                    style={styles.Back_image}
                  /></View>
              </TouchableOpacity>
              <View style={{ width: '100%', height: 1, backgroundColor: Colors.bottomborder, alignSelf: 'center', }}></View>
              {/* .....................For Terms and condition.................... */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => this.props.navigation.navigate('Termandcon', { 'contentpage': 0 })}
                style={{
                  width: '96%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between',
                  paddingVertical: mobileW * 0.035
                }}>
                <View style={{ width: '10%', justifyContent: 'center', alignItems: 'center' }}>
                  <Image
                    source={localimag.Termsconditions}
                    resizeMode='contain'
                    style={styles.image}
                  /></View>
                <View style={{ width: '85%', justifyContent: 'center' }}>
                  <Text style={styles.text1}>{Lang_chg.Term_txt[config.language]}</Text>
                </View>
                <View style={{ width: '10%' }}>
                  <Image
                    source={localimag.Blackb}
                    resizeMode='contain'
                    style={styles.Back_image}
                  /></View>
              </TouchableOpacity>
              <View style={{ width: '100%', height: 1, backgroundColor: Colors.bottomborder, alignSelf: 'center', }}></View>
              {/* .....................For Privacy.................... */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => this.props.navigation.navigate('Termandcon', { 'contentpage': 1 })}
                style={{
                  width: '96%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between',
                  paddingVertical: mobileW * 0.035,
                }}>
                <View style={{ width: '10%', justifyContent: 'center', alignItems: 'center' }}>
                  <Image
                    source={localimag.Privacypolicy}
                    resizeMode='contain'
                    style={styles.image}
                  /></View>
                <View style={{ width: '85%', justifyContent: 'center' }}>
                  <Text style={styles.text1}>{Lang_chg.txt_privacy_policy[config.language]}</Text>
                </View>
                <View style={{ width: '10%' }}>
                  <Image
                    source={localimag.Blackb}
                    resizeMode='contain'
                    style={styles.Back_image}
                  /></View>
              </TouchableOpacity>
              <View style={{ width: '100%', height: 1, backgroundColor: Colors.bottomborder, alignSelf: 'center', }}></View>
              {/* .....................For Contact us.................... */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  this.props.navigation.navigate('Contact_Us')
                }
  
                style={{
                  width: '96%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between',
                  paddingVertical: mobileW * 0.035
                }}>
                <View style={{ width: '10%', justifyContent: 'center', alignItems: 'center' }}>
                  <Image
                    source={localimag.contactus}
                    resizeMode='contain'
                    style={styles.image}
                  /></View>
                <View style={{ width: '85%', justifyContent: 'center' }}>
                  <Text style={styles.text1}>{Lang_chg.txt_contact_us[config.language]}</Text>
                </View>
                <View style={{ width: '10%' }}>
                  <Image
                    source={localimag.Blackb}
                    resizeMode='contain'
                    style={styles.Back_image}
                  /></View>
              </TouchableOpacity>
              <View style={{ width: '100%', height: 1, backgroundColor: Colors.bottomborder, alignSelf: 'center', }}></View>
              {/* .....................For Share.................... */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => { this.props.navigation.navigate('') }}
                style={{
                  width: '96%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between',
                  paddingVertical: mobileW * 0.035,
                }}>
                <View style={{ width: '10%', justifyContent: 'center', alignItems: 'center' }}>
                  <Image
                    source={localimag.shareicon}
                    resizeMode='contain'
                    style={styles.image}
                  /></View>
                <View style={{ width: '85%', justifyContent: 'center' }}>
                  <Text style={styles.text1}>{Lang_chg.txt_share_app[config.language]}</Text>
                </View>
                <View style={{ width: '10%' }}>
                  <Image
                    source={localimag.Blackb}
                    resizeMode='contain'
                    style={styles.Back_image}
                  /></View>
              </TouchableOpacity>
              <View style={{ width: '100%', height: 1, backgroundColor: Colors.bottomborder, alignSelf: 'center', }}></View>
              {/* .....................For Rate now.................... */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => { this.props.navigation.navigate('') }}
                style={{
                  width: '96%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between',
                  paddingVertical: mobileW * 0.035,
                }}>
                <View style={{ width: '10%', justifyContent: 'center', alignItems: 'center' }}>
                  <Image
                    source={localimag.rateappicon}
                    resizeMode='contain'
                    style={styles.image}
                  /></View>
                <View style={{ width: '85%', justifyContent: 'center' }}>
                  <Text style={styles.text1}>{Lang_chg.txt_rate_app[config.language]}</Text>
                </View>
                <View style={{ width: '10%' }}>
                  <Image
                    source={localimag.Blackb}
                    resizeMode='contain'
                    style={styles.Back_image}
                  />
                </View>
              </TouchableOpacity>
              <View style={{ width: '100%', height: 1, backgroundColor: Colors.bottomborder, alignSelf: 'center', }}></View>
              {/* .....................For Delete.................... */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => { this.props.navigation.navigate('Delete_Account') }}
                style={{
                  width: '96%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between',
                  paddingVertical: mobileW * 0.033,
                }}>
                <View style={{ width: '10%', justifyContent: 'center', alignItems: 'center' }}>
                  <Image
                    source={localimag.Delete}
                    resizeMode='contain'
                    style={styles.image}
                  />
                </View>
                <View style={{ width: '85%', justifyContent: 'center' }}>
                  <Text style={styles.text1}>{Lang_chg.Delete_txt[config.language]}</Text>
                </View>
                <View style={{ width: '10%' }}>
                  <Image
                    source={localimag.Blackb}
                    resizeMode='contain'
                    style={styles.Back_image}
                  />
                </View>
              </TouchableOpacity>
              <View style={{ width: '100%', height: 1, backgroundColor: Colors.bottomborder, alignSelf: 'center', }}></View>
              {/* .....................For Logout.................... */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  this.LogoutPress();
                  // this.props.navigation.navigate('Login')
                }}
                style={{
                  width: '90%', alignSelf: 'center',
                  paddingVertical: mobileW * 0.033, borderRadius: mobileW * 0.06, marginTop: mobileW * 0.15, backgroundColor: '#F8E4E4',
                }}>
                <View style={{
                  width: '26%', alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                  flexDirection: 'row', justifyContent: 'space-between'
                }}>
                  <Image
                    source={localimag.logout}
                    resizeMode='contain'
                    style={styles.image}
                  />
                  <Text style={{
                    fontSize: mobileW * 4.3 / 100, fontFamily: Font.OutfitMedium,
                    color: 'red',
                  }}>{Lang_chg.txt_logout[config.language]}</Text>
                </View>
              </TouchableOpacity>
  
  
            </TouchableOpacity>
          </ScrollView>
  
          {/* <Footer
            activepage='Setting'
            usertype={1}
            footerpage={[
              { name: 'Home', fname: 'Home', countshow: false, image: (localimag.homeinactive), activeimage: (localimag.homeactive) },
              { name: 'Inbox', fname: 'Inbox', countshow: false, image: (localimag.notifyinactive), activeimage: (localimag.notifyinactive) },
              { name: 'Orderhistory', countshow: false, image: (localimag.calenderinactive), activeimage: (localimag.calenderactive) },
              { name: 'Setting', fname: 'Setting', countshow: false, image: (localimag.settinginactive), activeimage: (localimag.settingactive) },
              { name: 'Profile', fname: 'Profile', countshow: false, image: (localimag.userinactive), activeimage: (localimag.useractive) },
  
            ]}
            navigation={this.props.navigation}
            imagestyle1={{ width: 26, height: 26, backgroundColor: '#01faff', countcolor: 'red', countbackground: 'red' }}
          /> */}
        </View>
      )
    }
  }
  const styles = StyleSheet.create({
    image: {
      height: mobileW * 5.5 / 100, width: mobileW * 5.5 / 100,
    },
    text1: {
      fontSize: mobileW * 4.3 / 100, fontFamily: Font.OutfitMedium,
      color: Colors.black,
    },
    Back_image: {
      height: mobileW * 4.5 / 100, width: mobileW * 4.5 / 100, tintColor: '#797979'
    },
  })