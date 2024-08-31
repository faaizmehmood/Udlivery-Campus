import React, { useState, useRef } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Splash from '../Splash';
import Pendingui from '../Pendingui';
import Login from '../Login';
import Forgot_Password from '../Forgot_Password';
import WelCome_Screen from '../WelCome_Screen';
import Step_1 from '../Step_1';
import Step_2 from '../Step_2';
import Signup from '../Signup';
import Verify from '../Verify';
import Details from '../Details';
import DiningFacilities from '../DiningFacilities';
import Dininghall from '../Dininghall';
import Home from '../Home';
import Notification from '../Notification';
import Orderhistory from '../Orderhistory';
import Paynow from '../Paynow';
import Profile from '../Profile';
import Viewcart from '../Viewcart';
import Report from '../Report';
import Pendinguione from '../Pendinguione';
import Ratenow from '../Ratenow';
import Become_delivery from '../Become_delivery';
import Inbox from '../Inbox';
import Diningfacility from '../Diningfacility';
import ContentPage from '../ContentPage';
import Video_show from '../Video_show';
import Setting from '../Setting';
import Edit_Profile from '../Edit_Profile';
import Change_Password from '../Change_Password';
import About_Us from '../About_Us';
import Contact_Us from '../Contact_Us';
import Delete_Account from '../Delete_Account';
import Delete_Success from '../Delete_Success';
import Addbank_detail from '../Addbank_detail';
import Privacy from '../Privacy';
import Details_One from '../Details_One';
import Details_Restaurants from '../Details_Restaurants';
import Location from '../Location';
import Chat from '../Chat';
import Termandcon from '../Termandcon';
import Driver_Orders from '../Driver/Driver_Orders';
import Driver_pending from '../Driver/Driver_pending';
import Driver_Dropoff from '../Driver/Driver_Dropoff';
import Driver_Home from '../Driver/Driver_Home';
import My_Earnings from '../Driver/My_Earnings';
import Driver_pendingDinFac from '../Driver/Driver_pendingDinFac';
import Driver_Cancelorder from '../Driver/Driver_Cancelorder';
import Driverpending from '../Driver/Driverpending';
import Driverpendingfacility from '../Driver/Driverpendingfacility';
import Driver_Setting from '../Driver/Driver_Setting';
import Driver_Change_Password from '../Driver/Driver_Change_Password';
import Driver_Contact_Us from '../Driver/Driver_Contact_Us';
import Drivre_Delete_Account from '../Driver/Drivre_Delete_Account';
import Driver_Delete_Success from '../Driver/Driver_Delete_Success';
import Drivre_Edit_Profile from '../Driver/Drivre_Edit_Profile';
import Driver_Profile from '../Driver/Driver_Profile';
import Driver_Edit_WithDrawal from '../Driver/Driver_Edit_WithDrawal';
import Driver_Add_Withrawal from '../Driver/Driver_Add_Withrawal';
import Driver_Add_bank from '../Driver/Driver_Add_bank';
import Driver_notification from '../Driver/Driver_notification';
import Driver_Location from '../Driver/Driver_Location';
import Driver_Inbox from '../Driver/Driver_Inbox';
import Driver_Chat from '../Driver/Driver_Chat';
import Driver_Terms from '../Driver/Driver_Terms';
import Driver_Report from '../Driver/Driver_Report';
import ViewImage from '../ChatProvider/ViewImage'
import ChatReport from '../ChatProvider/ChatReport'
import ChatBooking from '../ChatProvider/ChatBooking'
import InboxBooking from '../ChatProvider/InboxBooking'
import Driver_Add_Payment_Options from '../Driver_Add_Payment_Options';
import { useEffect } from 'react';
import { get, ref, set, onValue, remove, refFromURL, update } from 'firebase/database';
import { db } from '../ChatProvider/Config1';
import { localStorage } from './localStorageProvider';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OneSignal from 'react-native-onesignal';
import { firebaseprovider } from './FirebaseProvider';
import { notification } from './NotificationProvider';
import { AppState } from 'react-native';
import { config } from './configProvider';

const Stack = createNativeStackNavigator();

var initialChats = [];
var isInitialized = false;

const Stacknav = (navigation) => {
      const appState = useRef(AppState.currentState);
      const [appStateVisible, setAppStateVisible] = useState(appState.current);

      const getInitialChats = async () => {
            await AsyncStorage.setItem('isInInbox', '');

            let userData = await localStorage.getItemObject('user_arr');

            console.log('userDatauserDatauserDatauserDatauserData', isInitialized);

            if (!userData)
                  return;

            if (isInitialized)
                  return;

            isInitialized = true;

            setToken(userData?.user_id);

            const chatRef = ref(db, 'temp-message');

            try {
                  const snapshot = await get(chatRef);
                  if (snapshot.exists()) {
                        const data = snapshot.val();

                        let userChats = Object.values(data).filter(item => item?.receiverId == userData?.user_id);

                        initialChats = userChats?.length;
                  } else {
                        console.log('No data found in the "message" collection.');
                  }
            } catch (error) {
                  console.error('Error fetching data: ', error);
            }

            listenToNewMessages();
      }

      const listenToNewMessages = async () => {
            try {
                  let userData = await localStorage.getItemObject('user_arr');

                  const tempChatRef = ref(db, 'temp-message');

                  onValue(tempChatRef, (snapshot) => {
                        if (snapshot.exists()) {
                              const data = snapshot.val();
                              const lastMessage = Object.values(data).pop();
                              const userMessages = Object.values(data).filter(item => item?.receiverId == userData?.user_id)

                              if (lastMessage?.receiverId != userData?.user_id)
                                    return;

                              if (initialChats != userMessages?.length || initialChats?.length === 0) {
                                    getMessageSender(lastMessage);
                              }

                              initialChats = [];

                              console.log('Listening to messages');
                        }
                  })
            } catch (error) {
                  console.log('Error:', error);
            }
      }

      const getMessageSender = async (chat) => {
            try {
                  let userId = `u_${chat.senderId}`;

                  const userInfoRef = ref(db, `user-information/${userId}`);

                  const snapshot = await get(userInfoRef);

                  if (snapshot.exists()) {
                        const userInfo = snapshot.val();
                        let isInInbox = await AsyncStorage.getItem('isInInbox');

                        let chatId = `u_${chat?.receiverId}__u_${chat?.senderId}_b_${chat?.booking_id}`;

                        if (isInInbox != chatId && appState.current == 'active')
                              sendNotification(userInfo?.name, chat?.message, chat?.messageType);

                        deleteMessages(chat?.message);
                  }
            } catch (error) {
                  console.log('Error:', error);
            }
      }

      const sendNotification = (title, message, messageType) => {
            if (messageType == 'image') {
                  PushNotification.localNotification({
                        channelId: 'default',
                        title,
                        message: '',
                        picture: config.img_url1 + message,
                        smallIcon: "ic_notification"
                  });
            } else {
                  PushNotification.localNotification({
                        channelId: 'default',
                        title,
                        message,
                        smallIcon: "ic_notification"
                  });
            }
      }

      const deleteMessages = async (message) => {
            const chatRef = ref(db, 'temp-message');

            try {
                  const snapshot = await get(chatRef);
                  if (snapshot.exists()) {
                        const data = snapshot.val();

                        let chatKeys = Object.keys(data);
                        let chatValues = Object.values(data);

                        for (let i = 0; i < chatValues?.length; i++) {
                              if (chatValues[i]?.message == message) {
                                    let chatId = chatKeys[i];

                                    await remove(chatRef, chatId);
                              }
                        }
                  } else {
                        console.log('No data found in the "message" collection.');
                  }
            } catch (error) {
                  console.error('Error fetching data: ', error);
            }
      }

      const setToken = async (id) => {
            setTimeout(async () => {
                  let deviceState = await OneSignal.getDeviceState();
                  let token = deviceState?.userId;

                  console.log('token =>>>>', token);

                  const tokenRef = ref(db, `token/u_${id}`);

                  const entryExist = await get(tokenRef);

                  if (entryExist.exists()) {
                        await update(tokenRef, { token });

                        console.log('Token successfully updated.');
                  } else {
                        set(tokenRef, { token })
                              .then(() => {
                                    console.log('Token successfully saved.');
                              })
                              .catch((error) => {
                                    console.error('Error creating user:', error);
                              });
                  }
            }, 3000)
      }

      useEffect(() => {
            // getInitialChats();
      }, [])

      useEffect(() => {
            const subscription = AppState.addEventListener('change', nextAppState => {
                  if (
                        appState.current.match(/inactive|background/) &&
                        nextAppState === 'active'
                  ) {
                        console.log('App has come to the foreground!');
                  }

                  appState.current = nextAppState;
                  setAppStateVisible(appState.current);
            });

            return () => {
                  subscription.remove();
            };
      }, []);

      const LoginComponent = (props) => {
            return <Login {...props} setToken={setToken} />
      }

      const VerifyComponent = (props) => {
            return <Verify {...props} setToken={setToken} />
      }

      return (
            <Stack.Navigator
                  initialRouteName={'Splash'}
                  screenOptions={{
                  }}>
                  <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false, }} />
                  <Stack.Screen name="ContentPage" component={ContentPage} options={{ headerShown: false, }} />
                  <Stack.Screen name="WelCome_Screen" component={WelCome_Screen} options={{ headerShown: false, }} />
                  <Stack.Screen name="Login" component={LoginComponent} options={{ headerShown: false, gestureEnabled: false }} />
                  <Stack.Screen name="Forgot_Password" component={Forgot_Password} options={{ headerShown: false, }} />
                  <Stack.Screen name="Step_1" component={Step_1} options={{ headerShown: false, gestureEnabled: false }} />
                  <Stack.Screen name="Step_2" component={Step_2} options={{ headerShown: false, }} />
                  <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false, }} />
                  <Stack.Screen name="Verify" component={VerifyComponent} options={{ headerShown: false, }} />
                  <Stack.Screen name="Privacy" component={Privacy} options={{ headerShown: false, }} />
                  <Stack.Screen name="Termandcon" component={Termandcon} options={{ headerShown: false, }} />
                  <Stack.Screen name="Details" component={Details} options={{ headerShown: false, }} />
                  <Stack.Screen name="DiningFacilities" component={DiningFacilities} options={{ headerShown: false, }} />
                  <Stack.Screen name="Dininghall" component={Dininghall} options={{ headerShown: false, }} />
                  <Stack.Screen name="Home" component={Home} options={{ headerShown: false, gestureEnabled: false }} />
                  <Stack.Screen name="Notification" component={Notification} options={{ headerShown: false }} />
                  <Stack.Screen name="Orderhistory" component={Orderhistory} options={{ headerShown: false }} />
                  <Stack.Screen name="Paynow" component={Paynow} options={{ headerShown: false, gestureEnabled: false }} />
                  <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false, }} />
                  <Stack.Screen name="Viewcart" component={Viewcart} options={{ headerShown: false, }} />
                  <Stack.Screen name="Pendingui" component={Pendingui} options={{ headerShown: false, }} />
                  <Stack.Screen name="Report" component={Report} options={{ headerShown: false, }} />
                  <Stack.Screen name="Pendinguione" component={Pendinguione} options={{ headerShown: false, }} />
                  <Stack.Screen name="Ratenow" component={Ratenow} options={{ headerShown: false, }} />
                  <Stack.Screen name="Become_delivery" component={Become_delivery} options={{ headerShown: false, }} />
                  <Stack.Screen name="Driver_Add_Payment_Options" component={Driver_Add_Payment_Options} options={{ headerShown: false, }} />
                  <Stack.Screen name="Addbank_detail" component={Addbank_detail} options={{ headerShown: false, }} />
                  <Stack.Screen name="Inbox" component={Inbox} options={{ headerShown: false, }} />
                  <Stack.Screen name="Details_One" component={Details_One} options={{ headerShown: false, }} />
                  <Stack.Screen name="Details_Restaurants" component={Details_Restaurants} options={{ headerShown: false, }} />
                  <Stack.Screen name="Location" component={Location} options={{ headerShown: false, }} />
                  <Stack.Screen name="Chat" component={Chat} options={{ headerShown: false, }} />
                  <Stack.Screen name="Diningfacility" component={Diningfacility} options={{ headerShown: false, }} />
                  <Stack.Screen name="Driver_Orders" component={Driver_Orders} options={{ headerShown: false, }} />
                  <Stack.Screen name="Driver_pending" component={Driver_pending} options={{ headerShown: false, }} />
                  <Stack.Screen name="Driver_Dropoff" component={Driver_Dropoff} options={{ headerShown: false, }} />
                  <Stack.Screen name="Driver_Home" component={Driver_Home} options={{ headerShown: false, gestureEnabled: false }} />
                  <Stack.Screen name="My_Earnings" component={My_Earnings} options={{ headerShown: false, }} />
                  <Stack.Screen name="Driver_pendingDinFac" component={Driver_pendingDinFac} options={{ headerShown: false, }} />
                  <Stack.Screen name="Driver_Cancelorder" component={Driver_Cancelorder} options={{ headerShown: false, }} />
                  <Stack.Screen name="Driverpending" component={Driverpending} options={{ headerShown: false, }} />
                  <Stack.Screen name="Driver_Report" component={Driver_Report} options={{ headerShown: false, }} />
                  <Stack.Screen name="Driverpendingfacility" component={Driverpendingfacility} options={{ headerShown: false, }} />
                  <Stack.Screen name="Setting" component={Setting} options={{ headerShown: false, }} />
                  <Stack.Screen name="Edit_Profile" component={Edit_Profile} options={{ headerShown: false, }} />
                  <Stack.Screen name="Change_Password" component={Change_Password} options={{ headerShown: false, }} />
                  <Stack.Screen name="About_Us" component={About_Us} options={{ headerShown: false, }} />
                  <Stack.Screen name="Contact_Us" component={Contact_Us} options={{ headerShown: false, }} />
                  <Stack.Screen name="Delete_Account" component={Delete_Account} options={{ headerShown: false, }} />
                  <Stack.Screen name="Delete_Success" component={Delete_Success} options={{ headerShown: false, }} />
                  <Stack.Screen name="Driver_Setting" component={Driver_Setting} options={{ headerShown: false, }} />
                  <Stack.Screen name="Driver_Change_Password" component={Driver_Change_Password} options={{ headerShown: false, }} />
                  <Stack.Screen name="Driver_Contact_Us" component={Driver_Contact_Us} options={{ headerShown: false, }} />
                  <Stack.Screen name="Drivre_Delete_Account" component={Drivre_Delete_Account} options={{ headerShown: false, }} />
                  <Stack.Screen name="Driver_Delete_Success" component={Driver_Delete_Success} options={{ headerShown: false, }} />
                  <Stack.Screen name="Drivre_Edit_Profile" component={Drivre_Edit_Profile} options={{ headerShown: false, }} />
                  <Stack.Screen name="Driver_Profile" component={Driver_Profile} options={{ headerShown: false, }} />
                  <Stack.Screen name="Driver_Edit_WithDrawal" component={Driver_Edit_WithDrawal} options={{ headerShown: false, }} />
                  <Stack.Screen name="Driver_Add_Withrawal" component={Driver_Add_Withrawal} options={{ headerShown: false, }} />
                  <Stack.Screen name="Driver_Add_bank" component={Driver_Add_bank} options={{ headerShown: false, }} />
                  <Stack.Screen name="Driver_notification" component={Driver_notification} options={{ headerShown: false, }} />
                  <Stack.Screen name="Driver_Location" component={Driver_Location} options={{ headerShown: false, }} />
                  <Stack.Screen name="Driver_Inbox" component={Driver_Inbox} options={{ headerShown: false, }} />
                  <Stack.Screen name="Driver_Chat" component={Driver_Chat} options={{ headerShown: false, }} />
                  <Stack.Screen name="Driver_Terms" component={Driver_Terms} options={{ headerShown: false, }} />
                  <Stack.Screen name="Video_show" component={Video_show} options={{ headerShown: false, }} />
                  <Stack.Screen name="ViewImage" component={ViewImage} options={{ headerShown: false }} />
                  <Stack.Screen name="ChatReport" component={ChatReport} options={{ headerShown: false }} />
                  <Stack.Screen name="ChatBooking" component={ChatBooking} options={{ headerShown: false }} />
                  <Stack.Screen name="InboxBooking" component={InboxBooking} options={{ headerShown: false }} />
            </Stack.Navigator>

      );
}

export default Stacknav;