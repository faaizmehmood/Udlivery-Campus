import {
  Text, View, ImageBackground, Image, TextInput, Dimensions, Switch, SafeAreaView, FlatList,
  StatusBar, TouchableOpacity, StyleSheet, Modal
} from 'react-native';
import React, { Component } from 'react';
const MobileW = Dimensions.get('window').width;
const MobileH = Dimensions.get('window').height;
import {
  config, Common_Button, msgProvider, localStorage, apifuntion, msgText, msgTitle,
  consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag
} from '../Provider/utilslib/Utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { color } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';
// import Mapprovider from './Provider/Mapprovider';
// import Mapprovider from '../Provider/Mapprovider';
import { mediaprovider, Cameragallery } from '../Provider/utilslib/Utils';

export default class Drivre_Edit_Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      password_show: true,
      mod: false,

      //radhekrishan
      mediamodal:false,
      user_img:'',
      name: '',
      email: '',
      university_name:''
    }
  }

  // componentDidMount = async () => {
  //   this.setState({
  //     user_img: localimag.driverprofile
  //   })
  // }

  //-------------------image
    //-----------------for camera open----------------------

	Camerapopen = async () => {
		mediaprovider
			// .launchCamera(true)
			.launchCamera(false)
			.then((res) => {
                //console.log('camerares', res);

                let tmp = res.path;
                
                
                    this.setState({
                    mediamodal: false,

                    user_img:tmp 
					});
                } )
			.catch((error) => {
				this.setState({ mediamodal: false });

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
			.then((res) => {
				 
        //console.log('camerares', res);

        let tmp = res.path;
        
        
            this.setState({
            mediamodal: false,

            user_img:tmp 
  });

                 

 
			})
			.catch((error) => {
				this.setState({ mediamodal: false });

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

					style: 'cancel'
				},

				{
					text: 'Open Settings',
					onPress: () => {
						Linking.openSettings();
					}
				}
			],
			{ cancelable: false }
		);
	};




  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#F7F7F7' }}>


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
						this.setState({ mediamodal: false });
					}}
				/>


        <SafeAreaView style={{ flex: 0, backgroundColor: Colors.white1 }} />
        {/* <StatusBar
          hidden={false}
          backgroundColor={Colors.Red1}
          translucent={false}
          networkActivityIndicatorVisible={true}
          barStyle='light-content'
        /> */}
        {/* Modal-------------------------------------- */}
        <Modal
          animationType="slide"
          transparent
          visible={this.state.mod}
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
                  Select option   {/* {Lang_chg.txt_select_options} */}
                </Text>
              </View>
              <View
                style={{ paddingVertical: mobileH * 2 / 100, borderBottomColor: '#F2F2F2', borderBottomWidth: 1, width: '100%', alignItems: 'center' }}>
                <Text style={{
                  fontSize: mobileW * 4 / 100,
                  fontFamily: Font.Fontregular
                }}>Camera</Text>
              </View>
              <View
                style={{ paddingVertical: mobileH * 2 / 100, width: '100%', alignItems: 'center' }}>
                <Text style={{
                  fontSize: mobileW * 4 / 100,
                  fontFamily: Font.Fontregular
                }}>Gallery</Text>
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
                backgroundColor: '',
              }} onPress={() => {
                this.setState({ mod: 'false' })

              }}>

                <View style={{
                  paddingVertical: mobileH * 2 / 100,
                  backgroundColor: '', width: '100%', alignItems: 'center'
                }}>
                  <Text style={{
                    fontSize: mobileW * 4 / 100,
                    fontFamily: Font.Fontregular, color: '#DC1A21'
                  }}>Cancel</Text>
                </View>
              </TouchableOpacity>
            </View>

          </View>

        </Modal>
        {/* Header-------------------------------------- */}
        <View style={{
          paddingLeft: mobileW * 0.02, flexDirection: 'row', justifyContent: 'flex-start',
          width: mobileW * 100 / 100, alignItems: 'center', backgroundColor: Colors.theamColor
        }}>
          <TouchableOpacity style={{ width: mobileW * 12 / 100 }}
            onPress={() => this.props.navigation.goBack('')} >
            <Image style={{ height: mobileW * 6 / 100, width: mobileW * 6 / 100, resizeMode: 'contain' }}
              source={localimag.BackW} />
          </TouchableOpacity>
          <View style={{ width: mobileW * 76 / 100, paddingVertical: mobileW * 3 / 100, alignItems: 'center', alignSelf: 'center' }}>
            <Text style={{
              fontSize: mobileW * 5 / 100, color: Colors.white_color,
              fontFamily: Font.OutfitMedium
            }}>{Lang_chg.txt_edit[config.language]}</Text>
          </View>
          <View style={{ width: mobileW * 12 / 100 }}>
          </View>
        </View>
        <KeyboardAwareScrollView>
          <View style={{ width: '86%', alignSelf: 'center', marginTop: mobileW * 0.08 }}>
            {/* Profile img-------------------------------------- */}
            <View style={{
              height: mobileW * 28 / 100, width: mobileW * 28 / 100, borderRadius: mobileW * 16 / 100, alignSelf: 'center'
              , marginTop: mobileW * 0.05, backgroundColor: Colors.white1,
              alignItems: 'center', justifyContent: 'center', elevation: 2, shadowOffset: { width: 0, }, shadowColor: '#000', shadowOpacity: 0.2,
            }}>
              {this.state.user_img == ''? 
              <Image
                source={localimag.driverprofile}
                // source={{uri:this.state.user_img}}
                style={{
                  height: mobileW * 26 / 100, width: mobileW * 26 / 100, borderRadius: mobileW * 14 / 100,
                  alignSelf: 'center',
                }} />


                :
                <Image
                // source={localimag.driverprofile}
                source={{uri:this.state.user_img}}
                style={{
                  height: mobileW * 26 / 100, width: mobileW * 26 / 100, borderRadius: mobileW * 14 / 100,
                  alignSelf: 'center',
                }} />
              
              }
              <TouchableOpacity
                style={{
                  width: mobileW * 10 / 100, alignSelf: 'center', marginTop: mobileH * 5 / 100, marginLeft: mobileW * 5 / 100,
                  position: 'absolute', bottom: 2, right: 0
                }}
                // onPress={() => this.setState({ mod: true })}
                onPress={() => this.setState({ mediamodal: true })}
              ><Image source={localimag.Cam}
                style={{ width: mobileW * 10 / 100, height: mobileW * 12 / 100 }} />
              </TouchableOpacity>

            </View>
            {/* .....................For Name.................... */}
            <View style={{ width: '96%', alignSelf: 'center', flexDirection: 'row', marginTop: mobileW * 0.08, alignItems: 'center' }}>
              {/* name Image------------ */}
              <View style={{ width: '8%', justifyContent: 'center' }}>
                <Image source={localimag.Usericonc2} resizeMode='contain'
                  style={{ height: mobileW * 6 / 100, width: mobileW * 6 / 100, }} /></View>
              {/* textInput--------- */}
              <View style={{ width: '88%', justifyContent: 'center', }}>
                <TextInput placeholder={Lang_chg.Name_txt[config.language]}
											onChangeText={(txt) => this.setState({ name: txt })}
                      keyboardType='default'
                      selectionColor={Colors.textInputSelectionColor1}
                  placeholderTextColor={Colors.setting}
                  maxLength={50}
                  style={{
                    width: '95%', fontSize: mobileW * 4 / 100, color: Colors.setting, paddingVertical: mobileH * 1 / 100,
                    fontFamily: Font.OutfitMedium, textAlignVertical: 'center', marginTop: mobileW * 0.01,
                  }}></TextInput>
              </View>

            </View>
            <View style={{ width: '98%', height: 1,borderBottomColor: Colors.bottomborder, borderBottomWidth: 1,  alignSelf: 'center' }}></View>
             {/* .....................For Email.................... */}
             <View style={{
                            flexDirection: 'row', paddingVertical: mobileW * 1 / 100,width: '99%', alignSelf: 'center', alignItems: 'center' 
                        }}>
                          <View style={{ width: '10%', justifyContent: 'center',alignSelf:'center' }}>  
                            <Image style={{
                                height: mobileW * 6 / 100, width: mobileW * 6 / 100, resizeMode: 'contain',
                                alignSelf: 'center',
                            }}
                                source={localimag.Emailiconc2}>
                            </Image>
                            </View>
                            {/* <View> */}
                                {/* textInput--------- */}
                                <View style={{ width: '100%', justifyContent: 'center' }}>
                                    <TextInput placeholder={Lang_chg.Email_txt[config.language]}
											onChangeText={(txt) => this.setState({ email: txt })}
                      keyboardType='email-address'
                      selectionColor={Colors.textInputSelectionColor1}
                                        placeholderTextColor={Colors.setting}
                                        maxLength={50}
                    style={{
                      width: '95%',
                      fontSize: mobileW * 4 / 100, fontFamily: Font.OutfitMedium, color: Colors.mediumgrey,
                      // textAlign: 'center',
                      marginTop: mobileW * 0.8 / 100
                    }}></TextInput>
                                </View>
                            {/* </View> */}
            </View>
              <View style={{ width: '100%', borderBottomColor: Colors.bottomborder, borderBottomWidth: 1,  alignSelf: 'center', }}></View>

            {/* .....................For Btn.................... */}
            <TouchableOpacity
              
                onPress={() =>
                  {
                      if (this.state.name == '') {
                          //FULL NAME
                          msgProvider.toast(msgText.enterfullname[config.language], 'center');
                          return false;
                        } else if (this.state.name.trim().length < 3) {
                          msgProvider.toast(msgText.fullnameminimumcharacter[config.language], 'center');
                          return false;
                        } else if (this.state.email.trim().length <= 0) {
                          //email
                          msgProvider.toast(msgText.enteremail[config.language], 'center');
                          return false;
                        } else if (config.regemail.test(this.state.email) !== true) {
                          msgProvider.toast(msgText.entervalidemail[config.language], 'center');
                          //console.log('i am in invalid email');
                          return false;
                      } 
                      // else if (this.state.university_name == '') { 
                      //     msgProvider.toast(msgText.PleaseSelectUniversity[config.language], 'center');
                      //      return true;

                      // }
                      
                      
                      
                      this.props.navigation.goBack('')
                



              }

                
                
                
                
                
                 }
              activeOpacity={0.7}
              style={{
                width: '100%', height: mobileW * 0.13, borderRadius: mobileW * 0.02, marginTop: mobileW * 0.14,
                alignSelf: 'center', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.theamColor
              }}>
              <Text style={{ fontSize: mobileW * 4.3 / 100, fontFamily: Font.OutfitMedium, color: Colors.white1 }}>
                {Lang_chg.txt_Update[config.language]}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>

      </View>
    )
  }
}