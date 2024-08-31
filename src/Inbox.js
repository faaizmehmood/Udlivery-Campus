import React, { Component, useEffect, useMemo, useState } from 'react';
import {
  Text,
  BackHandler,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Alert,
  View,
  StyleSheet,
  Keyboard,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  ScrollView,
  RadioButton,
  Button,
  TextInput,
  ActivityIndicator,
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
  firebaseprovider,
} from './Provider/utilslib/Utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ref, on, get, onValue, onChildRemoved } from 'firebase/database';
import { db } from './ChatProvider/Config1';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import firebase from './ChatProvider/Config1';
import database from 'firebase/database';
import Footer from './Provider/Footer';
import Driver_Footer from './Driver/Driver_Footer';
import { Nodata_foundimage } from './Provider/Nodata_foundimage';

const RenderChats = ({ item, index, navigation }) => {
  const [toggleNewMessage, setToggleNewMessage] = useState();

  const listenToMessages = () => {
    try {
      const inboxName = `u_${item?.user_id}__u_${item?.other_user_id}_b_${item?.booking_id}`;

      const messageRef = ref(db, `message/${inboxName}`);

      onValue(messageRef, snapshot => {
        if (snapshot.exists()) {
          const data = snapshot.val();

          const keys = Object.keys(data);

          const lastKey = keys[keys.length - 1];

          const lastMessage = data[lastKey].message;
          const lastMessageType = data[lastKey].messageType;

          item.message = lastMessage;
          item.messageType = lastMessageType;

          setToggleNewMessage(Math.random);
        }
      });
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  const listenToMessagesClear = () => {
    try {
      const inboxRef = ref(db, 'message');

      onChildRemoved(inboxRef, () => {
        const inboxName = `u_${item?.user_id}__u_${item?.other_user_id}_b_${item?.booking_id}`;

        const messageRef = ref(db, `message/${inboxName}`);

        onValue(messageRef, snapshot => {
          if (snapshot.exists()) {
            const data = snapshot.val();

            const keys = Object.keys(data);

            const lastKey = keys[keys.length - 1];

            const lastMessage = data[lastKey].message;
            const lastMessageType = data[lastKey].messageType;

            console.log('Last messge=>', lastMessage);

            item.message = lastMessage;
            item.messageType = lastMessageType;

            setToggleNewMessage(Math.random());
          } else {
            item.message = '';
            item.messageType = '';
          }
        });
      });
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  useEffect(() => {
    setToggleNewMessage(Math.random());

    listenToMessagesClear();
    listenToMessages();
  }, []);

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => navigation.navigate('ChatBooking', { chatdata: item })}>
        <View style={{ width: mobileW, paddingHorizontal: 10, marginTop: 10 }}>
          <View
            style={{
              width: '100%',
              paddingHorizontal: 10,
              paddingVertical: 8,
              backgroundColor: '#fff',
              alignSelf: 'center',
              borderRadius: 4,
            }}>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Image
                style={{ width: 38, height: 38, borderRadius: 50 }}
                source={
                  item?.image ? { uri: item?.image } : localimag.userplaceholder
                }
              />
              <View style={{ justifyContent: 'space-between', flex: 1 }}>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{ color: '#000', fontSize: 13.5, fontWeight: 500 }}>
                    {item?.other_user_name}
                  </Text>
                  <Text style={{ fontSize: 12 }}>
                    (order {item?.booking_number})
                  </Text>
                </View>
                <Text style={{ color: '#555555', fontSize: 13, fontWeight: 400 }}>
                  {item?.messageType == 'image' ? 'Image' : item?.message}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

class Inbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chats: [],
      filteredChats: [],
      userData: {},
      dataLoaded: false,
    };
  }

  componentDidMount(prevProps, prevState) {
    this.focusListener = this.props.navigation.addListener(
      'focus',
      this.getUserData,
    );

    this.getUserData();
  }

  componentWillUnmount() {
    this.focusListener();
  }

  getUserData = async () => {
    try {
      let userData = await localStorage.getItemObject('user_arr');

      this.setState({ userData });

      await this.getUserChats();
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  async getUserChats() {
    const chatRef = ref(db, 'message');

    try {
      const snapshot = await get(chatRef);
      if (snapshot.exists()) {
        const data = snapshot.val();

        let inboxKeys = Object.keys(data);
        let inboxValues = Object.values(data);
        let chats = [];

        for (let i = 0; i < inboxValues?.length; i++) {
          inboxValues[i] = Object.values(inboxValues[i])[
            Object.values(inboxValues[i])?.length - 1
          ];
        }

        for (let i = 0; i < inboxKeys?.length; i++) {
          let userId = inboxKeys[i].split('_')[1];
          let otherUserId = inboxKeys[i].split('_')[4];

          if (userId == this.state.userData?.user_id) {
            const otherUserInfoRef = ref(
              db,
              `user-information/u_${otherUserId}`,
            );
            const otherUserInfo = await get(otherUserInfoRef);

            let userInfoData = otherUserInfo.val();

            inboxValues[i].user_id = userId;
            inboxValues[i].other_user_id = otherUserId;
            inboxValues[i].other_user_name = userInfoData?.name;

            if (userInfoData?.image) inboxValues[i].image = userInfoData?.image;

            chats.push(inboxValues[i]);
          }
        }

        for (const item of chats) {
          if (item?.image)
            item.image =
              'https://udlivery.org/app/webservice/images/' + item?.image;
        }

        this.setState({ chats });
        this.setState({ filteredChats: chats });
      } else {
        console.log('No data found in the "message" collection.');
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    }

    this.setState({ dataLoaded: true });
  }

  searchChats = txt => {
    const result = this.state.chats.filter(item =>
      item.other_user_name.toLowerCase().includes(txt.toLowerCase()),
    );

    this.setState({ filteredChats: result });
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {!this.state.dataLoaded ? (
          <View
            style={{
              position: 'absolute',
              top: 0,
              width: '100%',
              height: '100%',
              backgroundColor: '#0000005c',
              zIndex: 2,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        ) : (
          ''
        )}
        <View
          style={{
            paddingVertical: (mobileH * 1) / 100,
            backgroundColor: Colors.theme_color,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: Colors.theme_color,
              paddingHorizontal: (mobileW * 3) / 100,
            }}>
            <TouchableOpacity
              onPress={() => { }}
              activeOpacity={0.9}
              style={{
                width: (mobileW * 10) / 100,
                alignItems: 'center',
                justifyContent: 'center',
                height: (mobileW * 10) / 100,
              }}></TouchableOpacity>
            <Text
              style={{
                fontFamily: Font.FontMedium,
                fontSize: (mobileW * 5) / 100,
                color: Colors.white_color,
              }}>
              {Lang_chg.Inbox[config.language]}
            </Text>
            <TouchableOpacity
              activeOpacity={0.9}
              style={{
                width: (mobileW * 10) / 100,
                alignItems: 'center',
                justifyContent: 'center',
                height: (mobileW * 10) / 100,
              }}></TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: (mobileW * 100) / 100,
            borderRadius: (mobileW * 1) / 100,
            backgroundColor: '#FDFDFD',
            paddingVertical: (mobileW * 1) / 100,
            shadowColor: Colors.shadow_color,
            shadowOffset: { width: 2, height: 2 },
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
              fontSize: (mobileW * 4.2) / 100,
            }}
            maxLength={53}
            returnKeyLabel="done"
            selectionColor={Colors.textInputSelectionColor1}
            returnKeyType="done"
            secureTextEntry={this.state.eyeshow}
            onSubmitEditing={() => {
              Keyboard.dismiss();
            }}
            placeholderTextColor={Colors.light_grey}
            placeholder={'Search'}
            ref={input => {
              this.mobilefield = input;
            }}
            onFocus={() => {
              this.setState({ errorno: 0, activeinput: 1 });
            }}
            onChangeText={txt => this.searchChats(txt)}
          />
        </View>

        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            width: mobileW,
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: (mobileH * 10) / 100,
          }}
          keyboardShouldPersistTaps="handled">
          <View>
            <View>
              {this.state.chats.length <= 0 || this.state.chats == 'NA' ? (
                <Nodata_foundimage />
              ) : (
                <FlatList
                  data={this.state.filteredChats}
                  renderItem={({ item, index }) => (
                    <RenderChats
                      item={item}
                      index={index}
                      navigation={this.props.navigation}
                    />
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              )}
            </View>
          </View>
        </KeyboardAwareScrollView>
        <HideWithKeyboard>
          {this.state.userData.user_type == 1 && (
            <Footer
              activepage="Inbox"
              usertype={1}
              footerpage={[
                {
                  name: 'Home',
                  fname: 'Home',
                  countshow: false,
                  image: localimag.homeinactive,
                  activeimage: localimag.homeactive,
                },
                {
                  name: 'Inbox',
                  fname: 'Inbox',
                  countshow: count_inbox,
                  image: localimag.notifyinactive,
                  activeimage: localimag.notifyactive,
                },
                {
                  name: 'Orderhistory',
                  countshow: false,
                  image: localimag.calenderinactive,
                  activeimage: localimag.calenderactive,
                },
                {
                  name: 'Setting',
                  fname: 'Setting',
                  countshow: false,
                  image: localimag.settinginactive,
                  activeimage: localimag.settingactive,
                },
                {
                  name: 'Profile',
                  fname: 'Profile',
                  countshow: false,
                  image: localimag.userinactive,
                  activeimage: localimag.useractive,
                },
              ]}
              navigation={this.props.navigation}
              imagestyle1={{
                width: 26,
                height: 26,
                backgroundColor: '#01faff',
                countcolor: '#FFFFFF',
                countbackground: '#FFFFFF',
              }}
            />
          )}
          {this.state.userData.user_type == 2 && (
            <Driver_Footer
              activepage="Inbox"
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
                backgroundColor: '#FFFFFF',
              }}
            />
          )}
        </HideWithKeyboard>
      </SafeAreaView>
    );
  }
}
export default Inbox;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headstyle: {
    fontFamily: Font.FontSemiBold,
    fontSize: (mobileW * 4.5) / 100,
    color: Colors.black_color,
  },
  headview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: (mobileH * 2) / 100,
  },
  view_all: {
    fontFamily: Font.FontSemiBold,
    fontSize: (mobileW * 3.5) / 100,
    color: Colors.black_color,
  },
});
