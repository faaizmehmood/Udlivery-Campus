import React, { Component } from 'react';
import Firebase from 'firebase/app';
import { Text, View, Image, TextInput, StyleSheet, ScrollView, Switch, Modal, TouchableOpacity, Dimensions, Alert, FlatList, BackHandler } from 'react-native';
import { mobileW, Font, Lang_chg, config, mobileH, Colors, localStorage } from '../Provider/utilslib/Utils';
const screenHeight = Math.round(Dimensions.get('window').height);
const screenWidth = Math.round(Dimensions.get('window').width);

export default class Driver_Footer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      color: '',
      modalVisible1: false,
      loading: false,
      isConnected: true,
      planModal: false,
    }
    BackHandler.removeEventListener('hardwareBackPress',
      () => { return true });
  }
  componentDidMount() {
    // Firebaseprovider.messagecountforfooter()
  }
  messagecountforfooter = async () => {

    //console.log('getMyInboxAllDatagetinboxaccount');
    //   userdata= await localStorage.getItemObject('user_arr')
    //------------------------------ firbase code get user inbox ---------------
    if (userdata != null) {
      // alert("himanshu");
      var id = 'u_' + userdata.user_id;
      if (inboxoffcheck > 0) {
        console.log('getMyInboxAllDatainboxoffcheck');
        var queryOffinbox = Firebase.database()?.ref('users/' + id + '/myInbox/').child(userChatIdGlobal);
        //queryOff.off('child_added');
        queryOffinbox.off('child_changed');
      }

      var queryUpdatemyinbox = Firebase.database()?.ref('users/' + id + '/myInbox/');
      queryUpdatemyinbox.on('child_changed', (data) => {
        console.log('inboxkachildchange', data.toJSON())
        //  this.showUserInbox()
        Firebaseprovider.firebaseUserGetInboxCount();
      })
    }
  }
  usercheckbtn = async (page) => {

    this.props.functionremove
    const navigation = this.props.navigation;



    let userdata
      = await localStorage.getItemObject('user_arr')
    console.log('userdata', userdata)
    if (userdata != null) {
      if (this.props.usertype == 1) {
        navigation.navigate(page)
      }
      else {
        if (userdata.profile_complete == 0 && userdata.otp_verify == 1) {
          for (let i = 0; i < this.props.footerpage.length; i++) {
            if (page == this.props.footerpage[i].name) {
              navigation.navigate(page)
            }
          }
        }
        else {
          this.setState({ modalVisible1: true })
        }
      }
    } else {
      if (this.props.usertype == 1) {
        navigation.navigate(page)
      }
      else {
        this.setState({ modalVisible1: true })
      }
    }
  }
  Checkuser = () => {

    Alert.alert(
      'confirm',
      'please first login',
      [
        {
          text: msgTitle.cancel[0],
        },
        {
          text: msgTitle.ok[0],
          // onPress: () =>  this.btnPageLoginCall(),
          onPress: () => { this.props.navigation.navigate('Userlogin') }
        },
      ],
      { cancelable: false },
    );
  }


  render() {

    //console.log('this.props.color', this.props.color + '/n')
    // const navigation = this.props.navigation;

    let footerwidth = parseInt(100 / this.props.footerpage.length)
    return (
      <View style={[style1.footercontainer, { backgroundColor: this.props.imagestyle1.backgroundColor }]}>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible1}
          onRequestClose={() => {
            this.setState({ modalVisible1: false });
          }}
        >
          <TouchableOpacity style={{ flex: 1, backgroundColor: '#00000040', justifyContent: 'center', alignItems: 'center' }} onPress={() => { this.setState({ modalVisible1: false }) }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', width: screenWidth * 100 / 100, alignContent: 'center' }}>
              <View style={{ backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingTop: 15, alignContent: 'center', alignItems: 'center', elevation: 5, borderRadius: 5, width: screenWidth * 80 / 100, }}>
                <View style={{ position: 'absolute', left: -13, top: -13, }}>
                  <TouchableOpacity style={{ backgroundColor: 'white', borderRadius: 30, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }} onPress={() => { this.setState({ modalVisible1: false }) }}>
                  </TouchableOpacity>
                </View>

                <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'black', alignSelf: 'flex-start' }}>information</Text>
                <Text style={{ color: 'grey', fontSize: 15, paddingTop: 13, lineHeight: 22, alignSelf: 'center' }}>Please login first</Text>
                <View style={{ backgroundColor: Colors.buttoncolor, marginVertical: 20, width: '95%', borderRadius: 40 }}>
                  <TouchableOpacity activeOpacity={0.9} onPress={() => { this.setState({ modalVisible1: false }); this.props.navigation.navigate('Userlogin') }}>
                    <Text style={{ textAlign: 'center', paddingVertical: 13, color: '#FFFFFF', fontFamily: 'Poppins-SemiBold', fontSize: 13.5, letterSpacing: 1 }}>Login</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>



        <FlatList
          data={this.props.footerpage}
          scrollEnabled={false}
          numColumns={this.props.footerpage.length}
          renderItem={({ item, index }) => {

            //console.log('item data: ++++++++++++++++++++:  ', item)
            return (
              <View style={{ width: screenWidth * footerwidth / 100, alignSelf: 'center', alignItems: 'center' }}
                key={index}>
                {/* {console.log(this.props.footerpage[0])} */}
                {item.name == this.props.activepage ? <TouchableOpacity activeOpacity={0.8} style={style1.footericon} onPress={() => { this.usercheckbtn(item.name || '') }}>
                  <View style={style1.footericonview}>

                    <Image source={item.activeimage} resizeMethod='resize' style={[style1.footerimage, {
                      width: this.props.imagestyle1.width,
                      height: this.props.imagestyle1.height
                    }]} />
                    <Text style={{ alignSelf: 'center', fontSize: mobileW * 2.5 / 100, color: Colors.theamColor }}>{item.fname}</Text>

                    {item.countshow != false &&
                      <View style={{ position: 'absolute', top: 1, left: 20, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{
                          alignSelf: 'center', width: mobileW * 2 / 100, height: mobileW * 2 / 100,
                          borderRadius: mobileW * 50 / 100, backgroundColor: 'red', justifyContent: 'center',
                          alignContent: 'center', alignItems: 'center'
                        }}>
                        </View>
                      </View>}
                  </View>
                </TouchableOpacity> :
                  <TouchableOpacity activeOpacity={0.8} style={[style1.footericon]} onPress={() => { this.usercheckbtn(item.name || '') }}>
                    <View style={style1.footericonview}>

                      <Image source={item.image} resizeMethod='resize' style={[style1.footerimage, {
                        width: this.props.imagestyle1.width,
                        height: this.props.imagestyle1.height,
                      }]} />

                      <Text style={{ alignSelf: 'center', fontSize: mobileW * 2.5 / 100, color: '#858585' }}>{item.fname}</Text>
                      {item.countshow != false && <View style={{
                        position: 'absolute', top: 1, left: 20,
                        alignItems: 'center', justifyContent: 'center'
                      }}>
                        {item.countshow > 0 &&
                          <View style={{
                            alignSelf: 'center', width: mobileW * 2 / 100, height: mobileW * 2 / 100,
                            borderRadius: mobileW * 50 / 100, backgroundColor: this.props.imagestyle1.countbackground,
                            justifyContent: 'center', alignContent: 'center', alignItems: 'center',
                          }}>
                          </View>}
                      </View>}
                    </View>
                  </TouchableOpacity>
                }
              </View>
            )
          }}
        />


      </View>

    )
  }
}
const style1 = StyleSheet.create({

  footercontainer: {
    flexDirection: 'row', width: screenWidth,
    //  backgroundColor:'red',
    position: 'absolute',
    elevation: 5,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    borderTopWidth: 1,
    borderTopColor: '#f7f7f7',
    shadowColor: 'black',
    bottom: 0,
    paddingVertical: 7,

  },
  footericon: {
    width: screenWidth * 25 / 100,
    paddingTop: 5,
    paddingBottom: 5

  },
  footericonview: {
    alignSelf: 'center',
    paddingVertical: 5
  },
  footertext: {
    color: 'black',
    fontSize: 13,

  },
  footerimage: {
    alignSelf: 'center',

    resizeMode: 'contain'
  }

})
