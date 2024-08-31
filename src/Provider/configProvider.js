import {Platform} from 'react-native';
import base64 from 'react-native-base64';
import {msgProvider, localStorage} from './utilslib/Utils';
import firebase from 'firebase/app';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

global.player_id_me1 = '123456';
//--------------------------- Config Provider Start -----------------------
class configProvider {
  baseURL = 'https://udlivery.org/app/webservice/';
  img_url = 'https://udlivery.org/app/webservice/images/200X200/';
  img_url1 = 'https://udlivery.org/app/webservice/images/400X400/';
  img_url2 = 'https://udlivery.org/app/webservice/images/700X700/';
  img_url3 = 'https://udlivery.org/app/webservice/images/';
  img_url4 = 'https://udlivery.org/app/webservice/videos/';
  login_type = 'app';
  onesignalappid = 'fbbae85c-dfc8-46e8-8a60-162bbba8b330';
  mapkey = 'AIzaSyBI-EVEqoWesbt7_BxohFw-Alq1wI0XHJU';
  oneSignalAuthorization = 'YzYzYWY1YWUtNzgzYS00MjNiLTk5N2MtNzhjYWI5ZDkyOGZj';
  firebaseServerKey = 'AAAAvHNq3qk:APA91bF48zPU1UsAiVU6GAUy4e1tinSzv8OkghYnl-nKKugoERW99b_oLLGOnjyABUvhewkDvJA4sK1ggtaj2BfsQtnoiBO8L_DXWxI5O1G5HAICoHNZ0v7w7_Fp_ggVjinflmGteSS4';
  maplanguage = 'en';
  language = 0;
  player_id = '123456';
  player_id_me = '123456';
  device_type = Platform.OS;
  playerID = '';
  loading_type = false;
  latitude = 40.7128;
  longitude = 74.006;
  namevalidation = /^[^-\s][a-zA-Z0-9_\s-]+$/;
  emailvalidation =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  mobilevalidation = /^[0-9\_]+$/;
  passwordvalidation = /^\S{3,}$/;
  messagevalidation = /^[^-\s][a-zA-Z0-9_\s- ,]+$/;
  country_code = '+1';
  dishvalidation = /^[^-\s][a-zA-Z0-9_\s- ]+$/;

  regemail =
    /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

  headersapi = {
    Authorization:
      'Basic ' +
      base64.encode(base64.encode('mario') + ':' + base64.encode('carbonell')),
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data',
    'Cache-Control': 'no-cache,no-store,must-revalidate',
    Pragma: 'no-cache',
    Expires: 0,
  };
  GetPlayeridfunctin = player_id => {
    player_id_me1 = config.playerID;
  };

  checkUserDeactivate = async navigation => {
    msgProvider.toast('Your account is deactivated', 'long');
    setTimeout(() => {
      this.AppLogout(navigation);
    }, 200);
    return false;
  };
  AppLogout = async navigation => {
    console.log('AppLogout');
    //----------------------- if get user login type -------------
    var userdata = await localStorage.getItemObject('user_arr');
    var password = await localStorage.getItemString('password');
    var email = await localStorage.getItemString('email');
    var remember_me = await localStorage.getItemString('remember_me');

    var id = 'u_' + userdata.user_id;
    var queryOffinbox = firebase.database()?.ref('users/' + id + '/myInbox/');
    queryOff.off('child_added');
    queryOffinbox.off();
    var queryOffLoginUsers = firebase.database()?.ref('users');
    queryOffLoginUsers.off();

    FirebaseInboxJson = [];

    console.log(password);
    console.log(email);
    console.log(remember_me);

    if (userdata != null) {
      if (userdata.login_type == 'app') {
        localStorage.clear();
        if (remember_me == 'yes') {
          localStorage.setItemString('password', password);
          localStorage.setItemString('email', email);
          localStorage.setItemString('remember_me', remember_me);
        } else {
          localStorage.setItemString('password', password);
          localStorage.setItemString('email', email);
        }
        navigation.navigate('Login');
      } else if (userdata.login_type == 1) {
        console.log('face boook login');
        LoginManager.logOut();
        localStorage.clear();
        navigation.navigate('Login');
      } else if (userdata.login_type == 2) {
        console.log('google login');
        try {
          await GoogleSignin.revokeAccess();
          await GoogleSignin.signOut();
        } catch (error) {
          alert(error);
        }
        localStorage.clear();
        navigation.navigate('Login');
      } else if (userdata.login_type == 5) {
        console.log('face book login');
      }
    } else {
      console.log('user arr not found');
    }
  };
}
//--------------------------- Config Provider End -----------------------

export const config = new configProvider();
