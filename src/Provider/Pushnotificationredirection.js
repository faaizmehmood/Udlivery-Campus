import React from 'react';
import OneSignal from 'react-native-onesignal';
import {config} from './configProvider';
import {localStorage} from './localStorageProvider';

global.propsnavigation = 'NA';

class Pushnotificationredirection {
  constructor() {}

  redirectfun(props) {
    propsnavigation = props;
    // OneSignal.setLocationShared(true);
    // OneSignal.inFocusDisplaying(2);
    // OneSignal.addEventListener('ids', this.onIds.bind(this));
    // OneSignal.addEventListener('opened', this.onOpened);

    OneSignal.setNotificationOpenedHandler(notification => {
      console.log('notification open');
      this.onOpened(notification);
    });
  }

  onOpened = async openResult => {
    let navigation = propsnavigation;

    console.log('Naivgation here in Push Notification.js: ', navigation);

    var datajson =
      openResult.notification.additionalData.action_json.action_json;

    //console.log({ datajson })

    var user_id = datajson.user_id;
    var other_user_id = datajson.other_user_id;
    var action_id = datajson.action_id;
    var action = datajson.action;

    var userdata = await localStorage.getItemObject('user_arr');
    //console.log('datajson_user_id', datajson.user_id)

    if (userdata.user_id == other_user_id) {
      other_user_id = datajson.user_id;
    }

    if (userdata != null) {
      //console.log('navigation run');
      //console.log("action",action);

      if (action == 'new_order') {
        navigation.navigate('Pendingui', {order_id: action_id});
      }

      if (action == 'accept_order') {
        navigation.navigate('Pendingui', {order_id: action_id});
      }

      if (action == 'delivered_order') {
        navigation.navigate('Pendingui', {order_id: action_id});
      }

      if (action == 'pikcup_order') {
        navigation.navigate('Pendingui', {order_id: action_id});
      }

      if (action == 'chat_booking') {
        var image = datajson.image;
        if (image != null) {
          image = config.img_url1 + image;
        }

        navigation.navigate('ChatBooking', {
          chatdata: {
            other_user_id: other_user_id,
            other_user_name: datajson.SenderName,
            image: image,
            blockstatus: 'no',
            booking_id: datajson.booking_id,
            booking_number: '#' + datajson.booking_number,
          },
        });
      }
    } else {
      navigation.navigate('Login');
    }
  };

  // onIds(device) {
  //   console.log('Device info of Notifcation Provider: ', device);
  //   player_id_me1 = device.userId;
  // }
}

export const pushnotification = new Pushnotificationredirection();
