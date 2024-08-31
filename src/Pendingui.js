import {
  Alert,
  Linking,
  TouchableWithoutFeedback,
  Dimensions,
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
  StyleSheet,
  Modal,
  PermissionsAndroid,
} from 'react-native';
import React, {Component} from 'react';
import {
  Cameragallery,
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
} from './Provider/utilslib/Utils';
import DashedLine from 'react-native-dashed-line';
import StarRating from 'react-native-star-rating-fixed-viewproptype';
import Geolocation from '@react-native-community/geolocation';
global.ratebtn = 0;
import {mediaprovider} from './Provider/utilslib/Utils';
//video=============
import Icon4 from 'react-native-vector-icons/MaterialIcons';
import {createThumbnail} from '@cygnet-umshah/react-native-create-thumbnail';
import {RNCamera} from 'react-native-camera';

//video=
import CountDown from '@husam287/react-native-countdown-component';

//video=
const flashModeOrder = {
  off: 'on',
  on: 'auto',
  auto: 'torch',
  torch: 'off',
};

const wbOrder = {
  auto: 'sunny',
  sunny: 'cloudy',
  cloudy: 'shadow',
  shadow: 'fluorescent',
  fluorescent: 'incandescent',
  incandescent: 'auto',
};

const landmarkSize = 2;

export default class Pendingui extends Component {
  //video=
  _didFocusSubscription;
  _willBlurSubscription;

  constructor(props) {
    super(props);
    {
      this.state = {
        order_id: this.props.route.params.order_id,

        num_arr: 'NA',

        order_arr: 'NA',

        videomodal: false,
        image_type: '',

        currentTime: 0,
        duration: 0,
        isFullScreen: false,
        isLoading: true,
        paused: false,
        videomodalopen: false,
        status: true,
        playerState: 0, //playing
        screenType: 'content',
        repeatvedio: false,
        modalVisible: false,
        modalVisible2: false,
        mediamodal: false,
        post_image: '',
        post_video: '',
        new_video: '',
        thumbnailimage: '',
        newcameramodal: false,
        flash: 'off',
        isConnected: true,
        loading: false,
        zoom: 0,
        autoFocus: 'on',
        autoFocusPoint: {
          normalized: {x: 0.5, y: 0.5}, // normalized values required for autoFocusPointOfInterest
          drawRectPosition: {
            x: Dimensions.get('window').width * 0.5 - 32,
            y: Dimensions.get('window').height * 0.5 - 32,
          },
        },
        depth: 0,
        type: 'back',
        whiteBalance: 'auto',
        ratio: '16:9',
        secondtime: 0,
        showrecording: true,
        conuntshow: false,
        thumbnailimage: false,
        cameraon: false,
        recordOptions: {
          mute: false,
          maxDuration: 30,
          // This code is commented by faaiz

          quality: RNCamera.Constants.VideoQuality['480p'],
        },
        isRecording: false,
        canDetectFaces: false,
        canDetectText: false,
        canDetectBarcode: false,
        faces: [],
        textBlocks: [],
        barcodes: [],
        Videogallerypic: true,
        user_type: '',
        user_id: '',
        latitude: config.latitude,
        longitude: config.longitude,
        address: '',
      };
    }
    this.getlatlong();
  }

  componentDidMount = async () => {
    console.log('Driver side order page');
    this.getUserDetails();
    this.props.navigation.addListener('focus', () => {
      this.getUserDetails();
    });
  };

  //--------------------function for calling location ---------------//

  callLocation = async that => {
    this.setState({loading: true});
    localStorage.getItemObject('position').then(position => {
      if (position != null) {
        var pointcheck1 = 0;
        this.getalldata(position);
        Geolocation.getCurrentPosition(
          //Will give you the current location
          position => {
            localStorage.setItemObject('position', position);
            this.getalldata(position);
            pointcheck1 = 1;
          },
          error => {
            let position = {
              coords: {
                latitude: this.state.latitude,
                longitude: this.state.longitude,
              },
            };

            this.getalldata(position);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 1000},
        );
        that.watchID = Geolocation.watchPosition(position => {
          //Will give you the location on location change
          if (pointcheck1 != 1) {
            localStorage.setItemObject('position', position);
            this.getalldata(position);
          }
        });
      } else {
        var pointcheck = 0;
        Geolocation.getCurrentPosition(
          //Will give you the current location
          position => {
            localStorage.setItemObject('position', position);

            this.getalldata(position);
            pointcheck = 1;
          },
          error => {
            let position = {
              coords: {
                latitude: this.state.latitude,
                longitude: this.state.longitude,
              },
            };

            this.getalldata(position);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 1000},
        );
        that.watchID = Geolocation.watchPosition(position => {
          //Will give you the location on location change
          if (pointcheck != 1) {
            localStorage.setItemObject('position', position);
            this.getalldata(position);
          }
        });
      }
    });
  };

  //--------------------function for get lat long ------------//
  getlatlong = async () => {
    let permission = await localStorage.getItemString('permission');
    if (permission != 'denied') {
      var that = this;
      //Checking for the permission just after component loaded
      if (Platform.OS === 'ios') {
        this.callLocation(that);
      } else {
        // this.callLocation(that);
        async function requestLocationPermission() {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              {
                title: 'Location Access Required',
                message: 'This App needs to Access your location',
              },
            );
            // console.log('granted', PermissionsAndroid.RESULTS.GRANTED)
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              that.callLocation(that);
            } else {
              let position = {
                coords: {
                  latitude: that.state.latitude,
                  longitude: that.state.longitude,
                },
              };
              localStorage.setItemString('permission', 'denied');
              that.getalldata(position);
            }
          } catch (err) {
            console.warn(err);
          }
        }
        requestLocationPermission();
      }
    } else {
      let position = {
        coords: {
          latitude: this.state.latitude,
          longitude: this.state.longitude,
        },
      };
      this.getalldata(position);
    }
  };
  //---------------------function for set location ------------//
  getalldata = position => {
    let longitude = position.coords.longitude;
    let latitude = position.coords.latitude;
    this.setState({latitude: latitude, longitude: longitude, loading: false});
    (global_latitude = latitude),
      (global_longitude = longitude),
      (config.latitude = latitude);
    config.longitude = longitude;
    setTimeout(() => {
      this.getadddressfromlatlong(latitude, longitude);
    }, 300);
  };
  //----------get location name -----------//
  getadddressfromlatlong = (latitude, longitude) => {
    fetch(
      'https://maps.googleapis.com/maps/api/geocode/json?address=' +
        latitude +
        ',' +
        longitude +
        '&key=' +
        config.mapkey +
        '&language=' +
        config.maplanguage,
    )
      .then(response => response.json())
      .then(resp => {
        let responseJson = resp.results[0];
        let city = '';
        let state = 'unknown';
        let administrative_area_level_1 = '';
        for (let i = 0; i < responseJson.address_components.length; i++) {
          if (
            responseJson.address_components[i].types[0] ==
            'administrative_area_level_2'
          ) {
            city = responseJson.address_components[i].long_name;
          }
          if (
            responseJson.address_components[i].types[0] ==
            'administrative_area_level_1'
          ) {
            state = responseJson.address_components[i].long_name;
          }
        }
        for (let j = 0; j < responseJson.address_components.length; j++) {
          if (
            responseJson.address_components[j].types[0] ==
            'administrative_area_level_1'
          ) {
            administrative_area_level_1 =
              responseJson.address_components[j].long_name;
          }
        }
        let details = responseJson;
        let data2 = {
          latitude: details.geometry.location.lat,
          longitude: details.geometry.location.lng,
          address: details.formatted_address,
          city: city,
          state: state,
          city_state: city + ', ' + state,
          administrative_area_level_1: administrative_area_level_1,
        };
        this.GooglePlacesRef &&
          this.GooglePlacesRef.setAddressText(details.formatted_address);
        this.setState({addressselected: details.formatted_address});
        consolepro.consolelog('data2', data2);

        var address = data2.address;
        var city_state = data2.city_state;
        consolepro.consolelog({address, city_state});
        this.setState({address: address});
      });
  };

  get_order_details = async () => {
    let url =
      this.state.user_type == 1
        ? config.baseURL +
          'get_customer_site_order_details.php?user_id=' +
          this.state.user_id +
          '&order_id=' +
          this.state.order_id
        : config.baseURL +
          'get_driver_site_order_details.php?user_id=' +
          this.state.user_id +
          '&order_id=' +
          this.state.order_id;
    consolepro.consolelog('url', url);

    apifuntion
      .getApi(url, 0)
      .then(obj => {
        if (obj.success == 'true') {
          console.log(true);
          this.setState({
            order_arr: obj.order_arr,
            num_arr: obj.order_arr.items_arr,
          });
        } else {
          if (obj.account_active_status == 0) {
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
        console.log(false);
        console.log('error', error);
      });
  };

  getUserDetails = async () => {
    let userdata = await localStorage.getItemObject('user_arr');
    consolepro.consolelog('userdata', userdata);
    this.setState({
      user_type: userdata.user_type,
      user_id: userdata.user_id,
    });
    this.get_order_details();
  };

  order_accept_driver = async () => {
    consolepro.consolelog(item);
    let url = config.baseURL + 'order_accept_driver.php';
    consolepro.consolelog('url', url);

    var data = new FormData();
    data.append('user_id', this.state.user_id);
    data.append('order_id', this.state.order_arr.order_id);
    consolepro.consolelog('data', data);

    apifuntion
      .postApi(url, data)
      .then(obj => {
        consolepro.consolelog('obj', obj);
        if (obj.success == 'true') {
          consolepro.consolelog(obj);

          msgProvider.toast(obj.msg[0], 'center');

          var notification_arr = obj.notification_arr;

          if (notification_arr != 'NA') {
            notification.notification_arr(notification_arr);
          }

          setTimeout(() => {
            this.props.navigation.navigate('Driver_Orders');
          }, 700);
        } else {
          if (obj.account_active_status == 0) {
            config.checkUserDeactivate(this.props.navigation);
            return false;
          }
          msgProvider.toast(obj.msg[0], 'center');
          return false;
        }
      })
      .catch(error => {
        console.log('error', error);
      });
  };

  //----------08-08
  order_reject_driver = async item => {
    consolepro.consolelog(item);
    let url = config.baseURL + 'order_reject_driver.php';
    consolepro.consolelog('url', url);
    var data = new FormData();
    data.append('user_id', this.state.user_id);
    data.append('order_id', item.order_id);
    consolepro.consolelog('data', data);
    // return false;
    apifuntion
      .postApi(url, data)
      .then(obj => {
        console.log('Reject Order obj', obj);
        if (obj.success == 'true') {
          console.log('Reject Order obj in if Condition', obj);
          consolepro.consolelog(obj);
          var notification_arr = obj.notification_arr;
          consolepro.consolelog({notification_arr});
          consolepro.consolelog({notification_arr});
          if (notification_arr != 'NA') {
            consolepro.consolelog({notification_arr});
            notification.notification_arr(notification_arr);
          }
          this.get_all_dining();
        } else {
          console.log('Reject Order obj in else Condition', obj);
          if (obj.account_active_status == 0) {
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

  order_pickup = async () => {
    let url = config.baseURL + 'order_pick_up.php';
    consolepro.consolelog('url', url);
    var data = new FormData();
    data.append('user_id', this.state.user_id);
    data.append('order_id', this.state.order_arr.order_id);

    consolepro.consolelog('data', data);

    apifuntion
      .postApi(url, data)
      .then(obj => {
        console.log('obj of PickupAPI: ', obj);
        if (obj.success == 'true') {
          console.log(true);
          consolepro.consolelog(obj);
          msgProvider.toast(obj.msg[0], 'center');
          this.get_order_details();

          var notification_arr = obj.notification_arr;
          consolepro.consolelog({notification_arr});
          consolepro.consolelog({notification_arr});
          if (notification_arr != 'NA') {
            consolepro.consolelog({notification_arr});
            notification.notification_arr(notification_arr);
          }
        } else {
          console.log(false);
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

  order_dropoff = async () => {
    let url = config.baseURL + 'order_dropoff.php';

    var data = new FormData();
    data.append('user_id', this.state.user_id);
    data.append('longitude', this.state.longitude);
    data.append('latitude', this.state.latitude);
    data.append('order_id', this.state.order_arr.order_id);

    if (this.state.post_video != 'NA') {
      this.setState({cameraon: false});
      data.append('video', {
        uri: this.state.post_video,
        name: 'video.mp4',
        type: 'video/mp4',
      });
    }

    if (this.state.post_image != 'NA') {
      data.append('video_thumb', {
        uri: this.state.post_image,
        type: 'image/jpg', // or photo.type
        name: 'image.jpg',
      });
    }

    consolepro.consolelog('data', data);

    apifuntion
      .postApi(url, data)
      .then(obj => {
        if (obj.success == 'true') {
          console.log('in if Condition', obj);
          msgProvider.toast(obj.msg[0], 'center');
          this.get_order_details();
          var notification_arr = obj.notification_arr;
          console.log('Notificartion', obj.notification_arr);
          if (notification_arr != 'NA') {
            console.log('in if Condition');
            notification.notification_arr(notification_arr);
          }
        } else {
          console.log('in else Condition obj: ', obj);
          if (obj.account_active_status == 0) {
            config.checkUserDeactivate(this.props.navigation);
            return false;
          }
          msgProvider.toast(obj.msg[0], 'center');
          return false;
        }
      })
      .catch(error => {
        console.log('error: ', error);
      });
  };

  confirmationForDropOffOrder = () => {
    Alert.alert(
      'Hold on!',
      'Are you sure you have arrived at the destination?',
      [
        {
          text: 'NO',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'YES', onPress: () => this.Cameravideopopen()},
      ],
    );
    return true;
  };

  //video=
  Cameravideopopen = () => {
    this.setState({
      newcameramodal: true,
      post_image: 'NA',
      thumbnailimage: 'NA',
      showrecording: true,
      mediamodal: false,
    });
  };

  Galleryvideoopen = async () => {
    mediaprovider
      .launchGelleryvideo(true)
      .then(res => {
        this.setState({Videogallerypic: true});
        consolepro.consolelog('Galleryvideoopen', res);
        this.setState({
          mediamodal: false,
          post_video: res.path,
          cameraon: true,
          res: res,
          post_image: res.path,
          image_type: 1,
        });
        createThumbnail({
          url: res.path,
          // timeStamp: 10000,
        }).then(async pathimage => {
          consolepro.consolelog('thumb1', pathimage);
          consolepro.consolelog('thumb', pathimage.path);
          this.setState({post_image: pathimage.path});
        });
      })
      .catch(error => {
        this.setState({mediamodal: false});
      });
    consolepro.consolelog('sadad', this.state.post_image);
  };

  Camerapopen = async () => {
    mediaprovider
      .launchCamera(true)
      .then(obj => {
        if (this.state.image_type == 0) {
          this.setState({cover_img: obj.path, mediamodal: false});
        } else {
          this.setState({profile_img: obj.path, mediamodal: false});
        }
      })
      .catch(error => {
        this.setState({mediamodal: false});
      });
  };

  Galleryopen = () => {
    mediaprovider
      .launchGellery(true)
      .then(obj => {
        if (this.state.image_type == 0) {
          this.setState({cover_img: obj.path, mediamodal: false});
        } else {
          this.setState({profile_img: obj.path, mediamodal: false});
        }
      })
      .catch(error => {
        this.setState({mediamodal: false});
      });
  };

  // =================start camera video start =================

  falsestatus = () => {};
  toggleFacing() {
    this.setState({
      type: this.state.type === 'back' ? 'front' : 'back',
    });
  }

  toggleFlash() {
    this.setState({
      flash: flashModeOrder[this.state.flash],
    });
  }

  toggleWB() {
    this.setState({
      whiteBalance: wbOrder[this.state.whiteBalance],
    });
  }

  toggleFocus() {
    this.setState({
      autoFocus: this.state.autoFocus === 'on' ? 'off' : 'on',
    });
  }
  touchToFocus(event) {
    const {pageX, pageY} = event.nativeEvent;
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const isPortrait = screenHeight > screenWidth;

    let x = pageX / screenWidth;
    let y = pageY / screenHeight;
    // Coordinate transform for portrait. See autoFocusPointOfInterest in docs for more info
    if (isPortrait) {
      x = pageY / screenHeight;
      y = -(pageX / screenWidth) + 1;
    }

    this.setState({
      autoFocusPoint: {
        normalized: {x, y},
        drawRectPosition: {x: pageX, y: pageY},
      },
    });
  }

  zoomOut() {
    this.setState({
      zoom: this.state.zoom - 0.1 < 0 ? 0 : this.state.zoom - 0.1,
    });
  }

  zoomIn() {
    this.setState({
      zoom: this.state.zoom + 0.1 > 1 ? 1 : this.state.zoom + 0.1,
    });
  }

  setFocusDepth(depth) {
    this.setState({
      depth,
    });
  }

  takePicture = async function () {
    if (this.camera) {
      const data = await this.camera.takePictureAsync();
      console.warn('takePicture ', data);
    }
  };

  takeVideo = async () => {
    this.setState({conuntshow: true});
    const {isRecording} = this.state;
    // This code is commented by faaiz

    if (this.camera && !isRecording) {
      try {
        const promise = this.camera.recordAsync(this.state.recordOptions);

        if (promise) {
          this.setState({isRecording: true});
          const data = await promise;
          console.warn('takeVideo', data);
          createThumbnail({
            url: data.uri,
            // timeStamp: 10000,
          }).then(async pathimage => {
            // this.uploadimage(response.uri,pathimage.path)

            //    this.uploadimage(data.uri,pathimage.path)
            this.setState({
              post_video: data.uri,
              newcameramodal: false,
              post_image: pathimage.path,
              showrecording: false,
              image_type: 1,
            });

            //video=
            this.order_dropoff();
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  toggle = value => () =>
    this.setState(prevState => ({[value]: !prevState[value]}));

  facesDetected = ({faces}) => this.setState({faces});

  renderFace = ({bounds, faceID, rollAngle, yawAngle}) => (
    <View
      key={faceID}
      transform={[
        {perspective: 600},
        {rotateZ: `${rollAngle.toFixed(0)}deg`},
        {rotateY: `${yawAngle.toFixed(0)}deg`},
      ]}
      style={[
        styles.face,
        {
          ...bounds.size,
          left: bounds.origin.x,
          top: bounds.origin.y,
        },
      ]}>
      <Text style={styles.faceText}>ID: {faceID}</Text>
      <Text style={styles.faceText}>rollAngle: {rollAngle.toFixed(0)}</Text>
      <Text style={styles.faceText}>yawAngle: {yawAngle.toFixed(0)}</Text>
    </View>
  );

  renderLandmarksOfFace(face) {
    const renderLandmark = position =>
      position && (
        <View
          style={[
            styles.landmark,
            {
              left: position.x - landmarkSize / 2,
              top: position.y - landmarkSize / 2,
            },
          ]}
        />
      );
    return (
      <View key={`landmarks-${face.faceID}`}>
        {renderLandmark(face.leftEyePosition)}
        {renderLandmark(face.rightEyePosition)}
        {renderLandmark(face.leftEarPosition)}
        {renderLandmark(face.rightEarPosition)}
        {renderLandmark(face.leftCheekPosition)}
        {renderLandmark(face.rightCheekPosition)}
        {renderLandmark(face.leftMouthPosition)}
        {renderLandmark(face.mouthPosition)}
        {renderLandmark(face.rightMouthPosition)}
        {renderLandmark(face.noseBasePosition)}
        {renderLandmark(face.bottomMouthPosition)}
      </View>
    );
  }

  renderFaces = () => (
    <View style={styles.facesContainer} pointerEvents="none">
      {this.state.faces.map(this.renderFace)}
    </View>
  );
  renderLandmarks = () => (
    <View style={styles.facesContainer} pointerEvents="none">
      {this.state.faces.map(this.renderLandmarksOfFace)}
    </View>
  );

  renderTextBlocks = () => (
    <View style={styles.facesContainer} pointerEvents="none">
      {this.state.textBlocks.map(this.renderTextBlock)}
    </View>
  );

  renderTextBlock = ({bounds, value}) => (
    <React.Fragment key={value + bounds.origin.x}>
      <Text
        style={[
          styles.textBlock,
          {left: bounds.origin.x, top: bounds.origin.y},
        ]}>
        {value}
      </Text>
      <View
        style={[
          styles.text,
          {
            ...bounds.size,
            left: bounds.origin.x,
            top: bounds.origin.y,
          },
        ]}
      />
    </React.Fragment>
  );

  textRecognized = object => {
    const {textBlocks} = object;
    this.setState({textBlocks});
  };

  barcodeRecognized = ({barcodes}) => this.setState({barcodes});

  renderBarcodes = () => (
    <View style={styles.facesContainer} pointerEvents="none">
      {this.state.barcodes.map(this.renderBarcode)}
    </View>
  );

  renderBarcode = ({bounds, data, type}) => (
    <React.Fragment key={data + bounds.origin.x}>
      <View
        style={[
          styles.text,
          {
            ...bounds.size,
            left: bounds.origin.x,
            top: bounds.origin.y,
          },
        ]}>
        <Text style={[styles.textBlock]}>{`${data} ${type}`}</Text>
      </View>
    </React.Fragment>
  );

  renderRecording = () => {
    const {isRecording} = this.state;
    const backgroundColor = isRecording ? Colors.whiteColor : Colors.fontcolor;
    const action = isRecording ? this.stopVideo : this.takeVideo;
    const button = isRecording ? this.renderStopRecBtn() : this.renderRecBtn();
    return (
      <TouchableOpacity
        style={[
          styles.flipButton,
          {
            flex: 0.3,
            alignSelf: 'center',

            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor,
          },
        ]}
        onPress={() => action()}>
        {button}
      </TouchableOpacity>
    );
  };

  stopVideo = async () => {
    await this.camera.stopRecording();
    this.setState({isRecording: false, conuntshow: false});
  };

  renderRecBtn() {
    return <Text style={styles.flipText}> REC </Text>;
  }

  renderStopRecBtn() {
    return (
      <Text
        style={{
          color: '#f5cdcd',
          fontSize: 15,
        }}>
        {' '}
        DONE{' '}
      </Text>
    );
  }
  renderCamera() {
    const {canDetectFaces, canDetectText, canDetectBarcode} = this.state;

    const drawFocusRingPosition = {
      top: this.state.autoFocusPoint.drawRectPosition.y - 32,
      left: this.state.autoFocusPoint.drawRectPosition.x - 32,
    };
    if (this.state.showrecording == true) {
      return (
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={{
            flex: 1,
            justifyContent: 'space-between',
          }}
          type={this.state.type}
          flashMode={this.state.flash}
          autoFocus={this.state.autoFocus}
          autoFocusPointOfInterest={this.state.autoFocusPoint.normalized}
          zoom={this.state.zoom}
          whiteBalance={this.state.whiteBalance}
          ratio={this.state.ratio}
          focusDepth={this.state.depth}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          faceDetectionLandmarks={
            RNCamera.Constants.FaceDetection.Landmarks
              ? RNCamera.Constants.FaceDetection.Landmarks.all
              : undefined
          }
          onFacesDetected={canDetectFaces ? this.facesDetected : null}
          onTextRecognized={canDetectText ? this.textRecognized : null}
          onGoogleVisionBarcodesDetected={
            canDetectBarcode ? this.barcodeRecognized : null
          }>
          <View style={StyleSheet.absoluteFill}>
            <View style={[styles.autoFocusBox, drawFocusRingPosition]} />
            <TouchableWithoutFeedback onPress={this.touchToFocus.bind(this)}>
              <View style={{flex: 1}} />
            </TouchableWithoutFeedback>
          </View>
          <View
            style={{
              paddingVertical: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: 10,
              backgroundColor: 'transparent',
              width: (mobileW * 100) / 100,
            }}>
            <View
              style={{
                backgroundColor: 'transparent',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                paddingLeft: 10,
              }}>
              <TouchableOpacity
                style={[
                  {
                    alignSelf: 'center',
                    backgroundColor: 'white',
                    borderRadius: 10,
                    padding: 10,
                  },
                ]}
                onPress={() => {
                  this.setState({newcameramodal: false});
                }}>
                <Image
                  source={localimag.crossicon22}
                  style={{
                    alignSelf: 'center',
                    width: 20,
                    height: 20,
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>

              {this.state.conuntshow == true && (
                <View style={{alignSelf: 'center', paddingLeft: 10}}>
                  <CountDown
                    until={30}
                    size={11}
                    onFinish={() => {
                      this.stopVideo();
                    }}
                    digitStyle={{backgroundColor: '#FFF'}}
                    digitTxtStyle={{color: '#eb133a'}}
                    timeLabelStyle={{color: '#eb133a', fontSize: 1}}
                    timeToShow={['M', 'S']}
                    timeLabels={{m: 'min', s: 'sec'}}
                  />
                </View>
              )}
            </View>
            <View
              style={{
                backgroundColor: 'transparent',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                paddingRight: 10,
              }}>
              <TouchableOpacity
                style={[
                  styles.flipButton45,
                  {
                    borderWidth: 0,
                    backgroundColor: 'white',
                    borderRadius: 10,
                    marginRight: 6,
                    alignSelf: 'center',
                  },
                ]}
                onPress={this.toggleFacing.bind(this)}>
                <Icon4
                  name="switch-camera"
                  size={30}
                  color={Colors.fontcolor}
                  style={{alignSelf: 'center'}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.flipButton45,
                  {
                    borderWidth: 0,
                    backgroundColor: 'white',
                    borderRadius: 10,
                    alignSelf: 'center',
                  },
                ]}
                onPress={this.toggleFlash.bind(this)}>
                <Icon4
                  name="flash-on"
                  size={30}
                  color={Colors.fontcolor}
                  style={{alignSelf: 'center'}}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{bottom: 5}}>
            <View
              style={{
                height: 56,
                backgroundColor: 'transparent',
                flexDirection: 'row',
                alignSelf: 'center',
              }}>
              {this.renderRecording()}
            </View>
            {this.state.zoom !== 0 && (
              <Text style={[styles.flipText, styles.zoomText]}>
                Zoom: {this.state.zoom}
              </Text>
            )}
          </View>
          {!!canDetectFaces && this.renderFaces()}
          {!!canDetectFaces && this.renderLandmarks()}
          {!!canDetectText && this.renderTextBlocks()}
          {!!canDetectBarcode && this.renderBarcodes()}
        </RNCamera>
      );
    } else {
      return (
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <Text>Hi Khizar</Text>
        </View>
      );
    }
  }
  //======start camera video ================

  //=============camera function ==================//

  // =============== camera function =====================//
  //===================video function=========================//
  onLoad = data => this.setState({duration: data.duration, isLoading: false});

  onLoadStart = data => this.setState({isLoading: true});

  onEnd = () => {
    this.setState({playerState: 0, currentTime: 0, paused: false}); //playing

    this.setState({videomodal: false});
  };

  onError = () => Alert.alert('Oh! ', error);
  exitFullScreen = () => {
    Alert.alert('Exit full screen');
  };

  enterFullScreen = () => {};

  onFullScreen = () => {
    if (this.state.screenType == 'content')
      this.setState({screenType: 'cover', isFullScreen: true});
    else this.setState({screenType: 'content', isFullScreen: false});
  };

  onSeeking = currentTime => this.setState({currentTime});
  onReplay = () => {
    //Handler for Replay
    this.videoPlayer.seek(0);

    this.setState({
      playerState: 0, //playing
      currentTime: 0,
      volumesound: valumekey,
      repeatvedio: false,
      paused: false,
    });
  };

  onProgress = data => {
    const {isLoading, playerState} = this.state;
    // Video Player will continue progress even if the video already ended

    if (!isLoading && playerState !== 2) {
      // playing ended
      this.setState({
        currentTime: data.currentTime,
      });
    }
  };
  onSeek = seek => {
    this.videoPlayer.seek(seek);
  };

  onPaused = playerState => {
    if (playerState == 1) {
      this.setState({
        paused: !this.state.paused,
        playerState,
        volumesound: 0,
      });
    } else {
      this.setState({
        paused: !this.state.paused,
        playerState,
        volumesound: valumekey,
      });
    }
    //Handler for Video Pause
  };
  startdate = () => {
    var firstvideo = 'yes';
    localStorage.setItemObject('firstvideo', firstvideo);
    this.props.navigation.navigate('Login');
  };

  //16-08-22---------------------------------------------------
  //----------08-08
  order_accept_driver = async item => {
    let url = config.baseURL + 'order_accept_driver.php';
    consolepro.consolelog('url', url);
    var data = new FormData();
    data.append('user_id', this.state.user_id);
    data.append('order_id', item.order_id);
    consolepro.consolelog('data', data);
    apifuntion
      .postApi(url, data)
      .then(obj => {
        consolepro.consolelog('obj', obj);
        if (obj.success == 'true') {
          msgProvider.toast(obj.msg[0], 'center');
          var notification_arr = obj.notification_arr;
          consolepro.consolelog({notification_arr});
          consolepro.consolelog({notification_arr});
          if (notification_arr != 'NA') {
            consolepro.consolelog({notification_arr});
            notification.notification_arr(notification_arr);
          }

          this.props.navigation.goBack();
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

  //----------08-08
  order_reject_driver = async item => {
    let url = config.baseURL + 'order_reject_driver.php';
    consolepro.consolelog('url', url);
    var data = new FormData();
    data.append('user_id', this.state.user_id);
    data.append('order_id', item.order_id);
    consolepro.consolelog('data', data);
    apifuntion
      .postApi(url, data)
      .then(obj => {
        consolepro.consolelog('obj', obj);
        if (obj.success == 'true') {
          consolepro.consolelog(obj);

          var notification_arr = obj.notification_arr;
          consolepro.consolelog({notification_arr});
          consolepro.consolelog({notification_arr});
          if (notification_arr != 'NA') {
            consolepro.consolelog({notification_arr});
            notification.notification_arr(notification_arr);
          }
          this.props.navigation.goBack();
        } else {
          if (obj.account_active_status == 0) {
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

  accept_alert = async item => {
    Alert.alert('Accept Order', 'Are you sure you want to accept this order?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {text: 'YES', onPress: () => this.order_accept_driver(item)},
    ]);
    return true;
  };

  reject_alert = async item => {
    Alert.alert(
      'Information Message',
      'Do you really want to reject this order?',
      [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'YES', onPress: () => this.order_reject_driver(item)},
      ],
    );
    return true;
  };

  //--------------on subject click start-------------
  OnUserBookingClick = item => {
    consolepro.consolelog('I am in user click...');
    consolepro.consolelog({item});

    var image = item.customer_image;
    var other_user_id = item.customer_id;
    var name = item.customer_name;
    var booking_id = item.order_id;
    var booking_number = item.order_no;
    if (image != null) {
      image = config.img_url1 + image;
    }
    consolepro.consolelog({image});

    this.props.navigation.navigate('ChatBooking', {
      chatdata: {
        other_user_id: other_user_id,
        other_user_name: name,
        image: image,
        blockstatus: 'no',
        booking_id: booking_id,
        booking_number: '#' + booking_number,
      },
    });
  };

  //--------------on subject click start-------------
  OnUserBookingClickDriver = item => {
    consolepro.consolelog('I am in user click...');
    consolepro.consolelog({item});

    var image = item.driver_image;
    var other_user_id = item.driver_id;
    var name = item.driver_name;
    var booking_id = item.order_id;
    var booking_number = item.order_no;
    if (image != null) {
      image = config.img_url1 + image;
    }
    consolepro.consolelog({image});

    this.props.navigation.navigate('ChatBooking', {
      chatdata: {
        other_user_id: other_user_id,
        other_user_name: name,
        image: image,
        blockstatus: 'no',
        booking_id: booking_id,
        booking_number: '#' + booking_number,
      },
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
          {/* //------------report modal------------// */}
          <Modal
            animationType={'slide'}
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              this.setState({modalVisible: false});
            }}>
            <View style={{backgroundColor: '#00000070', flex: 1}}>
              <View
                style={{
                  borderRadius: 20,
                  position: 'absolute',
                  bottom: 10,
                  width: (mobileW * 90) / 100,
                  alignSelf: 'center',
                }}>
                <View
                  style={{
                    width: (mobileW * 90) / 100,
                    alignSelf: 'center',
                    borderRadius: 15,
                    backgroundColor: 'white',
                    paddingVertical: (mobileW * 1) / 100,
                  }}>
                  <View
                    style={{
                      justifyContent: 'center',
                      paddingVertical: (mobileW * 2) / 100,
                      borderBottomWidth: 1,
                      borderBottomColor: Colors.bottomborder,
                    }}>
                    <View style={{justifyContent: 'center'}}>
                      <Text
                        style={{
                          fontSize: (mobileW * 4) / 100,
                          color: Colors.black_color,
                          fontFamily: Font.Fontregular,
                          textAlign: 'center',
                        }}>
                        {Lang_chg.Select_Option[config.language]}
                      </Text>
                    </View>
                  </View>
                  {/* ====================camera=================== */}

                  <View
                    style={{
                      justifyContent: 'center',
                      paddingVertical: (mobileW * 2) / 100,
                      color: Colors.allmsg,
                      fontFamily: Font.fontbold,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({modalVisible: false, hide_status: 1}),
                          this.props.navigation.navigate('Report', {
                            user_id: this.state.user_id,
                            order_id: this.state.order_id,
                            order_arr: this.state.order_arr,
                            other_user_id: this.state.other_user_id,
                          });
                      }}
                      style={{justifyContent: 'center'}}>
                      <Text
                        style={{
                          fontSize: (mobileW * 4) / 100,
                          color: Colors.black_color,
                          fontFamily: Font.Fontregular,
                          textAlign: 'center',
                        }}>
                        {Lang_chg.report[config.language]}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* ====================cancel=================== */}
                <View
                  style={{
                    justifyContent: 'center',
                    paddingVertical: (mobileW * 3.5) / 100,
                    borderBottomWidth: 0.3,
                    marginTop: 10,
                    width: (mobileW * 90) / 100,
                    borderRadius: (mobileW * 3) / 100,
                    alignSelf: 'center',
                    backgroundColor: 'white',
                  }}>
                  <TouchableOpacity
                    style={{justifyContent: 'center'}}
                    onPress={() => this.setState({modalVisible: false})}>
                    <Text
                      style={{
                        fontSize: (mobileW * 4) / 100,
                        color: 'red',
                        fontFamily: Font.Semibold,
                        textAlign: 'center',
                      }}>
                      {Lang_chg.cancel[config.language]}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {this.state.order_arr != 'NA' && (
            <>
              <View
                style={{
                  width: (mobileW * 100) / 100,
                  alignItems: 'center',
                  backgroundColor: Colors.theamColor,
                }}>
                <View
                  style={{
                    width: (mobileW * 95) / 100,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    alignSelf: 'center',
                    paddingVertical: (mobileW * 3) / 100,
                  }}>
                  <TouchableOpacity
                    style={{width: (mobileW * 12) / 100}}
                    onPress={() => this.props.navigation.goBack()}>
                    {localimag.goback && (
                      <Image
                        style={{
                          height: (mobileW * 6) / 100,
                          width: (mobileW * 6) / 100,
                          resizeMode: 'contain',
                        }}
                        source={localimag.goback}
                      />
                    )}
                  </TouchableOpacity>
                  <View
                    style={{
                      width: (mobileW * 70) / 100,
                      alignItems: 'center',
                      alignSelf: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: (mobileW * 5) / 100,
                        color: Colors.white_color,
                        fontFamily: Font.OutfitMedium,
                      }}>
                      #{this.state.order_arr.order_no}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => this.setState({modalVisible: true})}
                    style={{
                      width: (mobileW * 13) / 100,
                      alignItems: 'flex-end',
                    }}>
                    {localimag.whitedot && (
                      <Image
                        style={{
                          height: (mobileW * 5) / 100,
                          width: (mobileH * 1) / 100,
                          resizeMode: 'cover',
                        }}
                        source={localimag.whitedot}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <ScrollView
                keyboardDismissMode="interactive"
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}>
                <TouchableOpacity style={{flex: 1}} activeOpacity={1}>
                  {/* //-----------------------------Pending text---------------------// */}
                  {this.state.user_type == 1 ? (
                    <View style={{}}>
                      <View
                        style={{
                          width: '100%',
                          flexDirection: 'row',
                          alignSelf: 'center',
                          justifyContent: 'space-between',
                          paddingVertical: (mobileW * 2) / 100,
                          backgroundColor: '#F7F7F7',
                          paddingHorizontal: (mobileW * 3) / 100,
                          paddingTop: (mobileW * 4) / 100,
                        }}>
                        <Text
                          style={{
                            fontSize: (mobileW * 3.8) / 100,
                            fontFamily: Font.Semibold,
                            color: Colors.black,
                          }}>
                          {this.state.order_arr.dining_name}
                        </Text>
                        <Text
                          style={{
                            fontSize: (mobileW * 3.5) / 100,
                            fontFamily: Font.OutfitMedium,
                            color: Colors.yellow,
                          }}>
                          {this.state.order_arr.order_status == 0 ? (
                            <Text style={{color: Colors.yellow}}>
                              {Lang_chg.pending[config.language]}
                            </Text>
                          ) : this.state.order_arr.order_status == 1 ? (
                            <Text style={{color: Colors.green}}>
                              {' '}
                              {Lang_chg.accepted[config.language]}
                            </Text>
                          ) : this.state.order_arr.order_status == 2 ? (
                            <Text style={{color: Colors.green}}>
                              {Lang_chg.pickup[config.language]}
                            </Text>
                          ) : this.state.order_arr.order_status == 3 ? (
                            <Text style={{color: Colors.green}}>
                              {Lang_chg.Delivered_txt[config.language]}
                            </Text>
                          ) : this.state.order_arr.order_status == 4 ? (
                            <Text style={{color: Colors.red}}>
                              {Lang_chg.cancelled[config.language]}
                            </Text>
                          ) : null}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View
                      style={{
                        backgroundColor: '#F7F7F7',
                        paddingVertical: (mobileW * 2) / 100,
                      }}>
                      <View
                        style={{
                          width: '100%',
                          flexDirection: 'row',
                          alignSelf: 'center',
                          paddingVertical: (mobileW * 2) / 100,
                          backgroundColor: '',
                          paddingHorizontal: (mobileW * 4) / 100,
                        }}>
                        <Text
                          style={{
                            fontSize: (mobileW * 3.8) / 100,
                            fontFamily: Font.OutfitMedium,
                            color: Colors.black,
                          }}>
                          {this.state.order_arr.dining_name}
                        </Text>
                        <Text
                          style={{
                            fontSize: (mobileW * 3.8) / 100,
                            fontFamily: Font.OutfitMedium,
                            color: Colors.violet,
                          }}>
                          {this.state.order_arr.dining_facility_id == 0
                            ? Lang_chg.Dining_2[config.language]
                            : Lang_chg.Diningf_2[config.language]}
                        </Text>
                      </View>
                      <View
                        style={{
                          width: (mobileW * 25) / 100,
                          backgroundColor: Colors.whitepurple,
                          borderColor: Colors.bottomborder,
                          borderRadius: (mobileW * 4) / 100,
                          borderWidth: 1,
                          paddingVertical: (mobileW * 1) / 100,
                          marginLeft: (mobileW * 3) / 100,
                        }}>
                        <Text
                          style={{
                            fontSize: (mobileW * 3) / 100,
                            fontFamily: Font.OutfitMedium,
                            color: Colors.yellow,
                            textAlign: 'center',
                          }}>
                          {this.state.order_arr.order_status == 0 ? (
                            <Text style={{color: Colors.yellow}}>
                              {Lang_chg.pending[config.language]}
                            </Text>
                          ) : this.state.order_arr.order_status == 1 ? (
                            <Text style={{color: Colors.green}}>
                              {' '}
                              {Lang_chg.accepted[config.language]}
                            </Text>
                          ) : this.state.order_arr.order_status == 2 ? (
                            <Text style={{color: Colors.green}}>
                              {Lang_chg.pickup[config.language]}
                            </Text>
                          ) : this.state.order_arr.order_status == 3 ? (
                            <Text style={{color: Colors.green}}>
                              {Lang_chg.Delivered[config.language]}
                            </Text>
                          ) : this.state.order_arr.order_status == 4 ? (
                            <Text style={{color: Colors.red}}>
                              {Lang_chg.cancelled[config.language]}
                            </Text>
                          ) : null}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* //-----------------------------Accept button---------------------// */}
                  {this.state.order_status == 1 && (
                    <View>
                      <View
                        style={{
                          width: '100%',
                          flexDirection: 'row',
                          alignSelf: 'center',
                          justifyContent: 'space-between',
                          paddingVertical: (mobileW * 2) / 100,
                          backgroundColor: '#F7F7F7',
                          paddingHorizontal: (mobileW * 3) / 100,
                          paddingTop: (mobileW * 4) / 100,
                        }}>
                        <Text
                          style={{
                            fontSize: (mobileW * 3.8) / 100,
                            fontFamily: Font.Semibold,
                            color: Colors.black,
                          }}>
                          {Lang_chg.Backyard[config.language]}
                        </Text>
                        <Text
                          style={{
                            fontSize: (mobileW * 3.5) / 100,
                            fontFamily: Font.OutfitMedium,
                            color: Colors.opengreen,
                          }}>
                          {Lang_chg.accepted[config.language]}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* \\--------------Deliver----------------// */}
                  {this.state.order_status == 2 && (
                    <View>
                      <View
                        style={{
                          width: '100%',
                          flexDirection: 'row',
                          alignSelf: 'center',
                          justifyContent: 'space-between',
                          paddingVertical: (mobileW * 2) / 100,
                          backgroundColor: '#F7F7F7',
                          paddingHorizontal: (mobileW * 3) / 100,
                          paddingTop: (mobileW * 4) / 100,
                        }}>
                        <Text
                          style={{
                            fontSize: (mobileW * 3.8) / 100,
                            fontFamily: Font.Semibold,
                            color: Colors.black,
                          }}>
                          {Lang_chg.Backyard[config.language]}
                        </Text>
                        <Text
                          style={{
                            fontSize: (mobileW * 3.5) / 100,
                            fontFamily: Font.OutfitMedium,
                            color: Colors.opengreen,
                          }}>
                          {Lang_chg.Delivery[config.language]}
                        </Text>
                      </View>
                    </View>
                  )}

                  {this.state.order_arr.order_type == 1 &&
                    (this.state.order_arr.facility_image != '' ? (
                      <ImageBackground
                        source={{
                          uri:
                            config.img_url +
                            this.state.order_arr.facility_image,
                        }}
                        resizeMode="cover"
                        style={{
                          width: (mobileW * 93) / 100,
                          height: (mobileH * 24) / 100,
                          alignSelf: 'center',
                        }}
                        imageStyle={{
                          borderRadius: 10,
                          alignSelf: 'center',
                          justifyContent: 'center',
                        }}></ImageBackground>
                    ) : (
                      <View
                        style={{
                          backgroundColor: '#F7F7F7',
                        }}>
                        {/* <View style={{ flexDirection: 'row', width: mobileW * 93 / 100, alignSelf: 'center', marginTop: mobileW * 3 / 100 }}>
                          {localimag.Usernew && <Image style={{
                            height: mobileW * 4 / 100, width: mobileW * 4 / 100, resizeMode: 'contain', alignSelf: 'center', justifyContent: 'center', marginRight: mobileW * 1 / 100,
                          }} source={localimag.Usernew}></Image>}
                          <Text style={{ fontSize: mobileW * 3.8 / 100, fontFamily: Font.OutfitMedium, color: Colors.grey, textAlign: 'center' }}>{Lang_chg.charlotte[config.language]}</Text>
                        </View> */}
                        <View
                          style={{
                            width: (mobileW * 93) / 100,
                            alignSelf: 'center',
                          }}>
                          <DashedLine
                            style={{
                              marginTop: (mobileH * 0.8) / 100,
                              marginBottom: (mobileH * 1) / 100,
                              paddingHorizontal: (mobileW * 0.5) / 100,
                              width: (mobileW * 92) / 100,
                            }}
                            dashColor={'#DADADA'}
                            gap={7}
                            dashThickness={0.5}
                            dashLength={7}
                          />
                        </View>
                      </View>
                    ))}

                  {this.state.num_arr != 'NA' && (
                    <View>
                      <FlatList
                        data={this.state.num_arr}
                        contentContainerStyle={{}}
                        renderItem={({item, index}) => {
                          return (
                            <View
                              style={{
                                width: '100%',
                                alignSelf: 'center',
                                paddingVertical: (mobileW * 2) / 100,
                                backgroundColor: '#F7F7F7',
                                marginTop: (mobileW * 1) / 100,
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  width: (mobileW * 97) / 100,
                                  alignSelf: 'center',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                {item.item_image && (
                                  <Image
                                    borderRadius={10}
                                    style={{
                                      alignSelf: 'center',
                                      width: (mobileW * 24) / 100,
                                      height: (mobileW * 23) / 100,
                                    }}
                                    source={{
                                      uri: config.img_url + item.item_image,
                                    }}></Image>
                                )}
                                <View
                                  style={{paddingLeft: (mobileW * 2) / 100}}>
                                  <View
                                    style={{
                                      width: (mobileW * 67) / 100,
                                      alignSelf: 'center',
                                      justifyContent: 'space-between',
                                    }}>
                                    <Text
                                      style={{
                                        fontSize: (mobileW * 3.7) / 100,
                                        fontFamily: Font.OutfitMedium,
                                        color: Colors.black_color,
                                      }}>
                                      {item.item_name}
                                    </Text>
                                  </View>

                                  <View
                                    style={{
                                      width: (mobileW * 67) / 100,
                                      flexDirection: 'row',
                                      alignSelf: 'center',
                                      justifyContent: 'flex-start',
                                      paddingVertical: (mobileW * 1) / 100,
                                    }}>
                                    <Text
                                      style={{
                                        fontSize: (mobileW * 3) / 100,
                                        fontFamily: Font.Fontregular,
                                        color: Colors.textgrey,
                                      }}>
                                      {item.description}
                                    </Text>
                                  </View>

                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      justifyContent: 'flex-start',
                                      width: (mobileW * 67) / 100,
                                      paddingVertical: (mobileW * 1) / 100,
                                    }}>
                                    {localimag.fireicon && (
                                      <Image
                                        borderRadius={4}
                                        style={{
                                          width: (mobileW * 3.5) / 100,
                                          height: (mobileW * 3.5) / 100,
                                        }}
                                        resizeMode="contain"
                                        source={localimag.fireicon}></Image>
                                    )}
                                    <Text
                                      style={{
                                        fontSize: (mobileW * 3.2) / 100,
                                        fontFamily: Font.Fontregular,
                                        color: Colors.removecolor,
                                        paddingLeft: (mobileW * 1) / 100,
                                      }}>
                                      {Lang_chg.Calories[config.language]}

                                      {item.calories}
                                    </Text>
                                  </View>

                                  <View
                                    style={{
                                      width: (mobileW * 66) / 100,
                                      flexDirection: 'row',
                                      alignSelf: 'center',
                                      justifyContent: 'flex-start',
                                    }}>
                                    <Text
                                      style={{
                                        fontSize: (mobileW * 3) / 100,
                                        fontFamily: Font.Fontregular,
                                        color: Colors.textgrey,
                                      }}>
                                      {Lang_chg.qty[config.language]}

                                      {item.no_of_quantity}
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            </View>
                          );
                        }}
                      />
                    </View>
                  )}

                  {this.state.user_type == 2 &&
                    this.state.order_arr.order_status != 0 && (
                      <View
                        style={{
                          width: '100%',
                          alignSelf: 'center',
                          paddingVertical: (mobileW * 2) / 100,
                          backgroundColor: '#F7F7F7',
                          marginTop: (mobileW * 1) / 100,
                        }}>
                        {/* //-------Accept & Delivery-----// */}
                        <View>
                          <View
                            style={{
                              width: (mobileW * 96) / 100,
                              alignSelf: 'center',
                              paddingVertical: (mobileW * 1) / 100,
                              backgroundColor: '#EFEFEF',
                              borderRadius: (mobileW * 2) / 100,
                              paddingBottom: (mobileW * 3) / 100,
                            }}>
                            <View
                              style={{
                                width: (mobileW * 90) / 100,
                                flexDirection: 'row',
                                alignSelf: 'center',
                                justifyContent: 'flex-start',
                                paddingVertical: (mobileW * 2) / 100,
                              }}>
                              <Text
                                style={{
                                  fontSize: (mobileW * 4) / 100,
                                  fontFamily: Font.Semibold,
                                  color: Colors.black,
                                }}>
                                {Lang_chg.customerdetails[config.language]}
                              </Text>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                width: (mobileW * 95.2) / 100,
                                alignSelf: 'center',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              {localimag.img_placeholder && (
                                <Image
                                  style={{
                                    alignSelf: 'center',
                                    width: (mobileW * 9) / 100,
                                    height: (mobileW * 9) / 100,
                                    borderRadius: (mobileW * 5) / 100,
                                    borderColor: Colors.light_grey,
                                    borderWidth: 1.5,
                                  }}
                                  source={
                                    this.state.order_arr.customer_image == null
                                      ? localimag.img_placeholder
                                      : {
                                          uri:
                                            config.img_url +
                                            this.state.order_arr.customer_image,
                                        }
                                  }></Image>
                              )}

                              <View style={{paddingLeft: (mobileW * 2) / 100}}>
                                <View
                                  style={{
                                    width: (mobileW * 79) / 100,
                                    alignSelf: 'center',
                                    justifyContent: 'flex-start',
                                  }}>
                                  <Text
                                    style={{
                                      fontSize: (mobileW * 3.6) / 100,
                                      fontFamily: Font.Semibold,
                                      color: Colors.violet,
                                    }}>
                                    {this.state.order_arr.customer_name}
                                  </Text>
                                </View>

                                <View
                                  style={{
                                    width: (mobileW * 79) / 100,
                                    flexDirection: 'row',
                                    alignSelf: 'center',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                  }}>
                                  <View
                                    style={{
                                      width: (mobileW * 63) / 100,
                                      flexDirection: 'row',
                                      flex: 1,
                                    }}>
                                    <Text
                                      style={{
                                        fontSize: (mobileW * 3.3) / 100,
                                        fontFamily: Font.Fontregular,
                                        color: Colors.textgrey,
                                      }}>
                                      {Lang_chg.universityname[config.language]}
                                    </Text>
                                    <Text
                                      style={{
                                        fontSize: (mobileW * 3.3) / 100,
                                        fontFamily: Font.Fontregular,
                                        color: Colors.textgrey,
                                      }}>
                                      {this.state.order_arr.university_name}
                                    </Text>
                                  </View>
                                  <View
                                    style={{
                                      width: (mobileW * 18) / 100,
                                      flexDirection: 'row',
                                      justifyContent: 'flex-end',
                                      flex: 1,
                                    }}>
                                    <TouchableOpacity
                                      onPress={() =>
                                        this.OnUserBookingClick(
                                          this.state.order_arr,
                                        )
                                      }>
                                      {localimag.bluemassage && (
                                        <Image
                                          style={{
                                            alignSelf: 'center',
                                            width: (mobileW * 8) / 100,
                                            height: (mobileW * 8) / 100,
                                            marginHorizontal: 5,
                                          }}
                                          source={localimag.bluemassage}
                                        />
                                      )}
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      onPress={() =>
                                        Linking.openURL(
                                          `tel:${this.state.order_arr.customer_mobile}`,
                                        )
                                      }>
                                      {localimag.bluecall && (
                                        <Image
                                          style={{
                                            alignSelf: 'center',
                                            width: (mobileW * 8) / 100,
                                            height: (mobileW * 8) / 100,
                                            paddingLeft: (mobileW * 2) / 100,
                                          }}
                                          source={localimag.bluecall}
                                        />
                                      )}
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </View>
                            </View>
                          </View>
                        </View>

                        {/* //---------------------------- only for cancel------------------------------// */}
                        {this.state.status == 3 && (
                          <View style={{paddingVertical: (mobileW * 1) / 100}}>
                            <View
                              style={{
                                width: (mobileW * 93) / 100,
                                flexDirection: 'row',
                                alignSelf: 'center',
                                justifyContent: 'flex-start',
                              }}>
                              <Text
                                style={{
                                  fontSize: (mobileW * 3.8) / 100,
                                  fontFamily: Font.OutfitMedium,
                                  color: Colors.red,
                                }}>
                                {Lang_chg.Cancelresone[config.language]}
                              </Text>
                            </View>
                            <View
                              style={{
                                width: (mobileW * 93) / 100,
                                flexDirection: 'row',
                                alignSelf: 'center',
                                justifyContent: 'flex-start',
                              }}>
                              <Text
                                style={{
                                  fontSize: (mobileW * 3.5) / 100,
                                  fontFamily: Font.OutfitMedium,
                                  color: Colors.textgrey,
                                }}>
                                {Lang_chg.Sorry[config.language]}
                              </Text>
                            </View>
                          </View>
                        )}

                        {/* //---------------------------- only for Deliver------------------------------// */}
                        {this.state.status == 2 && (
                          <View style={{marginTop: (mobileW * 2) / 100}}>
                            <ImageBackground
                              source={localimag.driverboyblur}
                              resizeMode="cover"
                              style={{
                                width: (mobileW * 93) / 100,
                                height: (mobileH * 24) / 100,
                                alignSelf: 'center',
                              }}
                              imageStyle={{
                                borderRadius: 10,
                                alignSelf: 'center',
                                justifyContent: 'center',
                              }}>
                              {localimag.playbut && (
                                <Image
                                  style={{
                                    height: (mobileW * 12) / 100,
                                    width: (mobileW * 12) / 100,
                                    resizeMode: 'contain',
                                    alignSelf: 'center',
                                    marginTop: (mobileW * 16) / 100,
                                  }}
                                  source={localimag.playbut}
                                />
                              )}
                            </ImageBackground>
                          </View>
                        )}

                        {/* /---------END DELIVER---------/ */}

                        {/* //------------ only in accept-----------// */}

                        {this.state.status == 0 && (
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignSelf: 'center',
                              width: (mobileW * 90) / 100,
                              marginTop: (mobileW * 9) / 100,
                            }}>
                            <TouchableOpacity
                              onPress={() => this.setState({status: 1})}
                              style={{
                                width: (mobileW * 41) / 100,
                                marginBottom: (mobileW * 10) / 100,
                              }}>
                              <View
                                style={{
                                  width: (mobileW * 41) / 100,
                                  alignSelf: 'center',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  borderRadius: (mobileW * 1) / 100,
                                  padding: (mobileW * 3) / 100,
                                  backgroundColor: Colors.violet,
                                }}>
                                <Text
                                  style={{
                                    fontSize: (mobileW * 4.3) / 100,
                                    color: Colors.white_color,
                                    fontFamily: Font.OutfitMedium,
                                    textAlign: 'center',
                                    paddingLeft: 3.5,
                                  }}>
                                  Pick up
                                </Text>
                              </View>
                            </TouchableOpacity>
                            {/* } */}

                            <TouchableOpacity
                              style={{
                                width: (mobileW * 41) / 100,
                                marginBottom: (mobileW * 10) / 100,
                              }}
                              onPress={() => {
                                this.props.navigation.navigate(
                                  'Driver_Cancelorder',
                                  {navi_status: 0},
                                );
                              }}>
                              <View
                                style={{
                                  width: (mobileW * 41) / 100,
                                  alignSelf: 'center',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  borderRadius: (mobileW * 1) / 100,
                                  padding: (mobileW * 3) / 100,
                                  backgroundColor: Colors.red,
                                }}>
                                <Text
                                  style={{
                                    fontSize: (mobileW * 4.3) / 100,
                                    color: Colors.white_color,
                                    fontFamily: Font.OutfitMedium,
                                    textAlign: 'center',
                                    paddingLeft: 3.5,
                                  }}>
                                  {Lang_chg.CancelOrder[config.language]}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    )}

                  <View
                    style={{
                      width: '100%',
                      alignSelf: 'center',
                      paddingVertical: (mobileW * 2) / 100,
                      backgroundColor: '#F7F7F7',
                    }}>
                    {/* //-------Accept & Delivery-----// */}
                    {this.state.order_arr.order_status != 0 &&
                      this.state.user_type == 1 && (
                        <View>
                          <View
                            style={{
                              width: (mobileW * 95) / 100,
                              alignSelf: 'center',
                              marginTop: (mobileW * 2) / 100,
                              paddingVertical: (mobileW * 1) / 100,
                              backgroundColor: '#EFEFEF',
                              borderRadius: (mobileW * 2) / 100,
                              paddingBottom: (mobileW * 3) / 100,
                            }}>
                            <View
                              style={{
                                width: (mobileW * 90) / 100,
                                flexDirection: 'row',
                                alignSelf: 'center',
                                justifyContent: 'flex-start',
                                paddingVertical: (mobileW * 1) / 100,
                              }}>
                              <Text
                                style={{
                                  fontSize: (mobileW * 4) / 100,
                                  fontFamily: Font.Semibold,
                                  color: Colors.black,
                                }}>
                                {Lang_chg.Udliverer_detail[config.language]}
                              </Text>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                width: (mobileW * 95) / 100,
                                alignSelf: 'center',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: (mobileW * 1) / 100,
                              }}>
                              {localimag.img_placeholder && (
                                <Image
                                  style={{
                                    alignSelf: 'center',
                                    width: (mobileW * 9.5) / 100,
                                    height: (mobileW * 9.5) / 100,
                                    borderRadius: (mobileW * 5) / 100,
                                    borderColor: Colors.light_grey,
                                    borderWidth: 1.5,
                                    marginTop: (mobileW * -1.7) / 100,
                                  }}
                                  source={
                                    this.state.order_arr.driver_image == null
                                      ? localimag.img_placeholder
                                      : {
                                          uri:
                                            config.img_url +
                                            this.state.order_arr.driver_image,
                                        }
                                  }></Image>
                              )}

                              <View style={{paddingLeft: (mobileW * 1) / 100}}>
                                <View
                                  style={{
                                    width: (mobileW * 78) / 100,
                                    alignSelf: 'center',
                                    justifyContent: 'flex-start',
                                  }}>
                                  <Text
                                    style={{
                                      fontSize: (mobileW * 3.6) / 100,
                                      fontFamily: Font.Semibold,
                                      color: Colors.violet,
                                    }}>
                                    {this.state.order_arr.driver_name}
                                  </Text>
                                </View>

                                <View
                                  style={{
                                    width: (mobileW * 78) / 100,
                                    flexDirection: 'row',
                                    alignSelf: 'center',
                                    justifyContent: 'space-between',
                                    marginLeft: (mobileW * 1) / 100,
                                  }}>
                                  <View
                                    style={{
                                      alignItems: 'center',
                                      width: (mobileW * 60) / 100,
                                      flexDirection: 'row',
                                      alignSelf: 'center',
                                      justifyContent: 'flex-start',
                                    }}>
                                    <Text
                                      style={{
                                        fontSize: (mobileW * 3.3) / 100,
                                        fontFamily: Font.OutfitMedium,
                                        color: Colors.black,
                                      }}>
                                      {this.state.order_arr.driver_rating.toFixed(
                                        1,
                                      )}
                                    </Text>

                                    <View
                                      style={{
                                        paddingHorizontal: (mobileW * 1) / 100,
                                      }}>
                                      <StarRating
                                        halfStarEnabled
                                        starSize={(mobileW * 4) / 100}
                                        emptyStar={localimag.stargrey}
                                        fullStar={localimag.star}
                                        disabled={false}
                                        maxStars={5}
                                        rating={parseInt(
                                          this.state.order_arr.driver_rating,
                                        )}
                                      />
                                    </View>

                                    <Text
                                      style={{
                                        fontSize: (mobileW * 3.1) / 100,
                                        fontFamily: Font.OutfitMedium,
                                        color: Colors.black,
                                      }}>
                                      ({this.state.order_arr.driver_reviews})
                                    </Text>
                                  </View>

                                  <View
                                    style={{
                                      width: (mobileW * 18) / 100,
                                      flexDirection: 'row',
                                      alignSelf: 'center',
                                      justifyContent: 'space-between',
                                    }}>
                                    <TouchableOpacity
                                      onPress={() =>
                                        this.OnUserBookingClickDriver(
                                          this.state.order_arr,
                                        )
                                      }>
                                      {localimag.bluemassage && (
                                        <Image
                                          style={{
                                            alignSelf: 'center',
                                            width: (mobileW * 8) / 100,
                                            height: (mobileW * 8) / 100,
                                          }}
                                          source={localimag.bluemassage}
                                        />
                                      )}
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      onPress={() =>
                                        Linking.openURL(
                                          `tel:${this.state.order_arr.driver_mobile}`,
                                        )
                                      }>
                                      {localimag.bluecall && (
                                        <Image
                                          style={{
                                            alignSelf: 'center',
                                            width: (mobileW * 8) / 100,
                                            height: (mobileW * 8) / 100,
                                            paddingLeft: (mobileW * 2) / 100,
                                          }}
                                          source={localimag.bluecall}
                                        />
                                      )}
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </View>
                            </View>
                          </View>
                        </View>
                      )}

                    {/* //----------contine with page-----------// */}

                    <View
                      style={{
                        flexDirection: 'row',
                        width: (mobileW * 93) / 100,
                        alignSelf: 'center',
                        justifyContent: 'space-between',
                        paddingVertical: (mobileW * 1) / 100,
                      }}>
                      <Text
                        style={{
                          fontSize: (mobileW * 3.8) / 100,
                          fontFamily: Font.OutfitMedium,
                          color: Colors.grey,
                        }}>
                        {Lang_chg.orderID[config.language]}
                      </Text>
                      <Text
                        style={{
                          fontSize: (mobileW * 3.8) / 100,
                          fontFamily: Font.OutfitMedium,
                          color: '#8A8A8A',
                        }}>
                        #{this.state.order_arr.order_no}
                      </Text>
                    </View>

                    <View
                      style={{
                        width: (mobileW * 93) / 100,
                        alignSelf: 'center',
                      }}>
                      <DashedLine
                        style={{
                          marginTop: (mobileH * 0.8) / 100,
                          marginBottom: (mobileH * 1) / 100,
                          paddingHorizontal: (mobileW * 0.5) / 100,
                          width: (mobileW * 92) / 100,
                        }}
                        dashColor={'#DADADA'}
                        gap={7}
                        dashThickness={0.5}
                        dashLength={7}
                      />
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        width: (mobileW * 93) / 100,
                        alignSelf: 'center',
                        justifyContent: 'space-between',
                        marginTop: (mobileW * 2) / 100,
                      }}>
                      <Text
                        style={{
                          fontSize: (mobileW * 3.8) / 100,
                          fontFamily: Font.OutfitMedium,
                          color: Colors.grey,
                        }}>
                        {Lang_chg.Ordercreted[config.language]}
                      </Text>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        {localimag.calender && (
                          <Image
                            style={{
                              height: (mobileW * 3.3) / 100,
                              width: (mobileW * 3.3) / 100,
                              resizeMode: 'contain',
                              alignSelf: 'center',
                              justifyContent: 'center',
                              marginRight: (mobileW * 1) / 100,
                            }}
                            source={localimag.calender}></Image>
                        )}
                        <Text
                          style={{
                            fontSize: (mobileW * 3.5) / 100,
                            fontFamily: Font.OutfitMedium,
                            color: '#8A8A8A',
                            textAlign: 'center',
                          }}>
                          {this.state.order_arr.createtime}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        width: (mobileW * 93) / 100,
                        alignSelf: 'center',
                        paddingBottom: 10,
                      }}>
                      <DashedLine
                        style={{
                          marginTop: (mobileH * 0.8) / 100,
                          marginBottom: (mobileH * 1) / 100,
                          paddingHorizontal: (mobileW * 0.5) / 100,
                          width: (mobileW * 92) / 100,
                          borderRadius: 10,
                        }}
                        dashColor={'#DADADA'}
                        gap={7}
                        dashThickness={0.5}
                        dashLength={7}
                      />
                    </View>

                    <View
                      style={{
                        width: (mobileW * 93) / 100,
                        flexDirection: 'row',
                        alignSelf: 'center',
                        justifyContent: 'flex-start',
                      }}>
                      <Text
                        style={{
                          fontSize: (mobileW * 3.8) / 100,
                          fontFamily: Font.OutfitMedium,
                          color: Colors.grey,
                        }}>
                        {Lang_chg.Location[config.language]}
                      </Text>
                    </View>

                    <View
                      style={{
                        width: (mobileW * 93) / 100,
                        flexDirection: 'row',
                        alignSelf: 'center',
                        justifyContent: 'flex-start',
                        paddingVertical: (mobileW * 1) / 100,
                      }}>
                      <Text
                        onPress={() => {
                          Linking.openURL(
                            'http://maps.google.com/?q=' +
                              this.state.order_arr.location,
                          );
                        }}
                        style={{
                          fontSize: (mobileW * 3.5) / 100,
                          fontFamily: Font.Semibold,
                          color: '#8A8A8A',
                        }}>
                        {this.state.order_arr.location}
                      </Text>
                    </View>

                    <View
                      style={{
                        width: (mobileW * 93) / 100,
                        flexDirection: 'row',
                        alignSelf: 'center',
                        justifyContent: 'flex-start',
                      }}></View>

                    <View
                      style={{
                        width: (mobileW * 93) / 100,
                        alignSelf: 'center',
                        paddingBottom: 10,
                      }}>
                      <DashedLine
                        style={{
                          marginTop: (mobileH * 0.8) / 100,
                          marginBottom: (mobileH * 1) / 100,
                          paddingHorizontal: (mobileW * 0.5) / 100,
                          width: (mobileW * 92) / 100,
                          borderRadius: 10,
                        }}
                        dashColor={'#DADADA'}
                        gap={7}
                        dashThickness={0.5}
                        dashLength={7}
                      />
                    </View>

                    {this.state.user_type == 1 && (
                      <>
                        <View
                          style={{
                            flexDirection: 'row',
                            width: (mobileW * 93) / 100,
                            alignSelf: 'center',
                            justifyContent: 'space-between',
                            paddingVertical: (mobileW * 1) / 100,
                          }}>
                          <Text
                            style={{
                              fontSize: (mobileW * 3.8) / 100,
                              fontFamily: Font.OutfitMedium,
                              color: Colors.grey,
                            }}>
                            {Lang_chg.TransactionID[config.language]}
                          </Text>
                          <Text
                            style={{
                              fontSize: (mobileW * 3.5) / 100,
                              fontFamily: Font.OutfitMedium,
                              color: '#8A8A8A',
                            }}>
                            {this.state.order_arr.transaction_id}
                          </Text>
                        </View>

                        <View
                          style={{
                            width: (mobileW * 93) / 100,
                            alignSelf: 'center',
                            paddingBottom: 10,
                          }}>
                          <DashedLine
                            style={{
                              marginTop: (mobileH * 0.8) / 100,
                              marginBottom: (mobileH * 1) / 100,
                              paddingHorizontal: (mobileW * 0.5) / 100,
                              width: (mobileW * 92) / 100,
                              borderRadius: 10,
                            }}
                            dashColor={'#DADADA'}
                            gap={7}
                            dashThickness={0.5}
                            dashLength={7}
                          />
                        </View>
                      </>
                    )}

                    {/* DeliveryFee start */}

                    <View
                      style={{
                        flexDirection: 'row',
                        width: (mobileW * 93) / 100,
                        alignSelf: 'center',
                        justifyContent: 'space-between',
                        paddingVertical: (mobileW * 1) / 100,
                      }}>
                      <Text
                        style={{
                          fontSize: (mobileW * 3.8) / 100,
                          fontFamily: Font.OutfitMedium,
                          color: Colors.grey,
                        }}>
                        {this.state.user_type == 1
                          ? 'Delivery fee paid to Udliverer'
                          : 'Delivery fee paid to you'}
                      </Text>
                      <Text
                        style={{
                          fontSize: (mobileW * 3.5) / 100,
                          fontFamily: Font.OutfitMedium,
                          color: '#8A8A8A',
                        }}>
                        $
                        {parseFloat(
                          this.state.order_arr.driver_earning,
                        ).toFixed(2)}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        width: (mobileW * 93) / 100,
                        alignSelf: 'center',
                        justifyContent: 'space-between',
                        paddingVertical: (mobileW * 1) / 100,
                      }}>
                      <Text
                        style={{
                          fontSize: (mobileW * 3.8) / 100,
                          fontFamily: Font.OutfitMedium,
                          color: Colors.grey,
                        }}>
                        {this.state.user_type == 1
                          ? Lang_chg.riderTipamount[config.language]
                          : Lang_chg.tipamount[config.language]}
                      </Text>
                      <Text
                        style={{
                          fontSize: (mobileW * 3.5) / 100,
                          fontFamily: Font.OutfitMedium,
                          color: '#8A8A8A',
                        }}>
                        ${this.state.order_arr.tip_amount}
                      </Text>
                    </View>

                    {this.state.user_type == 1 && (
                      <>
                        <View
                          style={{
                            flexDirection: 'row',
                            width: (mobileW * 93) / 100,
                            alignSelf: 'center',
                            justifyContent: 'space-between',
                            paddingVertical: (mobileW * 1) / 100,
                          }}>
                          <Text
                            style={{
                              fontSize: (mobileW * 3.8) / 100,
                              fontFamily: Font.OutfitMedium,
                              color: Colors.grey,
                            }}>
                            {Lang_chg.Estimatetaxtext[config.language]}
                          </Text>
                          <Text
                            style={{
                              fontSize: (mobileW * 3.5) / 100,
                              fontFamily: Font.OutfitMedium,
                              color: '#8A8A8A',
                            }}>
                            ${this.state.order_arr.estimated_tax_amount}
                          </Text>
                        </View>

                        <View
                          style={{
                            flexDirection: 'row',
                            width: (mobileW * 93) / 100,
                            alignSelf: 'center',
                            justifyContent: 'space-between',
                            paddingVertical: (mobileW * 1) / 100,
                          }}>
                          <Text
                            style={{
                              fontSize: (mobileW * 3.8) / 100,
                              fontFamily: Font.OutfitMedium,
                              color: Colors.grey,
                            }}>
                            {Lang_chg.serviceFeeTextNew[config.language]}
                          </Text>
                          <Text
                            style={{
                              fontSize: (mobileW * 3.5) / 100,
                              fontFamily: Font.OutfitMedium,
                              color: '#8A8A8A',
                            }}>
                            $
                            {parseFloat(
                              this.state.order_arr.service_fee,
                            ).toFixed(2)}
                          </Text>
                        </View>
                      </>
                    )}

                    <View
                      style={{
                        width: (mobileW * 93) / 100,
                        alignSelf: 'center',
                        paddingBottom: 10,
                      }}>
                      <DashedLine
                        style={{
                          marginTop: (mobileH * 0.8) / 100,
                          marginBottom: (mobileH * 1) / 100,
                          paddingHorizontal: (mobileW * 0.5) / 100,
                          width: (mobileW * 92) / 100,
                          borderRadius: 10,
                        }}
                        dashColor={'#DADADA'}
                        gap={7}
                        dashThickness={0.5}
                        dashLength={7}
                      />
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        width: (mobileW * 93) / 100,
                        alignSelf: 'center',
                        justifyContent: 'space-between',
                        paddingVertical: (mobileW * 1) / 100,
                      }}>
                      <Text
                        style={{
                          fontSize: (mobileW * 3.8) / 100,
                          fontFamily: Font.Semibold,
                          color: Colors.black,
                        }}>
                        {Lang_chg.totalamount[config.language]}
                      </Text>
                      <Text
                        style={{
                          fontSize: (mobileW * 3.5) / 100,
                          fontFamily: Font.Semibold,
                          color: Colors.violet,
                        }}>
                        $
                        {parseFloat(this.state.order_arr.total_amount).toFixed(
                          2,
                        )}
                      </Text>
                    </View>

                    <View
                      style={{
                        width: (mobileW * 93) / 100,
                        alignSelf: 'center',
                      }}>
                      <DashedLine
                        style={{
                          marginTop: (mobileH * 0.8) / 100,
                          marginBottom: (mobileH * 1) / 100,
                          paddingHorizontal: (mobileW * 0.5) / 100,
                          width: (mobileW * 92) / 100,
                        }}
                        dashColor={'#DADADA'}
                        gap={7}
                        dashThickness={0.4}
                        dashLength={7}
                      />
                    </View>

                    {/* //---------------------------- only for cancel------------------------------// */}
                    {this.state.order_arr.order_status == 4 && (
                      <View style={{paddingVertical: (mobileW * 1) / 100}}>
                        <View
                          style={{
                            width: (mobileW * 93) / 100,
                            flexDirection: 'row',
                            alignSelf: 'center',
                            justifyContent: 'flex-start',
                          }}>
                          <Text
                            style={{
                              fontSize: (mobileW * 3.8) / 100,
                              fontFamily: Font.OutfitMedium,
                              color: Colors.red,
                            }}>
                            {Lang_chg.Cancelresone[config.language]}
                          </Text>
                        </View>
                        <View
                          style={{
                            width: (mobileW * 93) / 100,
                            flexDirection: 'row',
                            alignSelf: 'center',
                            justifyContent: 'flex-start',
                          }}>
                          <Text
                            style={{
                              fontSize: (mobileW * 3.5) / 100,
                              fontFamily: Font.OutfitMedium,
                              color: Colors.textgrey,
                            }}>
                            {this.state.order_arr.cancellation_reason}
                          </Text>
                        </View>
                      </View>
                    )}

                    {/* //----------------------------Deliver------------------------------// */}

                    {this.state.order_arr.video_thumb != null && (
                      <View>
                        <ImageBackground
                          source={{
                            uri:
                              config.img_url + this.state.order_arr.video_thumb,
                          }}
                          resizeMode="cover"
                          style={{
                            width: (mobileW * 93) / 100,
                            height: (mobileH * 24) / 100,
                            alignSelf: 'center',
                            marginTop: (mobileW * 3) / 100,
                          }}
                          imageStyle={{
                            borderRadius: 10,
                            alignSelf: 'center',
                            justifyContent: 'center',
                          }}>
                          <TouchableOpacity
                            onPress={() => {
                              this.props.navigation.navigate('Video_show', {
                                post_image: this.state.order_arr.video_thumb,
                                vediosrc: this.state.order_arr.video,
                              });
                            }}>
                            {localimag.playbut && (
                              <Image
                                style={{
                                  height: (mobileW * 12) / 100,
                                  width: (mobileW * 12) / 100,
                                  resizeMode: 'contain',
                                  alignSelf: 'center',
                                  marginTop: (mobileW * 16) / 100,
                                }}
                                source={localimag.playbut}
                              />
                            )}
                          </TouchableOpacity>
                        </ImageBackground>
                      </View>
                    )}

                    {/* /---------END DELIVER---------/ */}
                    {1 == 5 && (
                      <View>
                        <View
                          style={{
                            width: (mobileW * 100) / 100,
                            flex: 1,
                            paddingVertical: 2,
                            backgroundColor: '#EEEEEE',
                            bottomborder: mobileW * 1,
                            borderColor: Colors.bottomborder,
                            marginVertical: (mobileW * 3) / 100,
                            alignSelf: 'center',
                          }}
                        />

                        <View
                          style={{
                            width: (mobileW * 95) / 100,
                            alignSelf: 'center',
                            marginTop: (mobileW * 1) / 100,
                            paddingVertical: (mobileW * 1) / 100,
                            backgroundColor: Colors.white1,
                            paddingBottom: (mobileW * 13) / 100,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              width: (mobileW * 95) / 100,
                              alignSelf: 'center',
                              justifyContent: 'center',
                              alignItems: 'center',
                              marginTop: (mobileW * 1) / 100,
                            }}>
                            <View style={{marginTop: (mobileW * -9) / 100}}>
                              {localimag.protwo && (
                                <Image
                                  style={{
                                    alignSelf: 'center',
                                    width: (mobileW * 9.5) / 100,
                                    height: (mobileW * 9.5) / 100,
                                    borderRadius: (mobileW * 5) / 100,
                                    borderColor: Colors.light_grey,
                                    borderWidth: 1.5,
                                    marginTop: (mobileW * -1.7) / 100,
                                  }}
                                  source={localimag.protwo}></Image>
                              )}
                            </View>
                            <View style={{paddingLeft: (mobileW * 1) / 100}}>
                              <View
                                style={{
                                  width: (mobileW * 78) / 100,
                                  flexDirection: 'row',
                                  alignSelf: 'center',
                                  justifyContent: 'space-between',
                                  marginLeft: (mobileW * 1) / 100,
                                }}>
                                <Text
                                  style={{
                                    fontSize: (mobileW * 4) / 100,
                                    fontFamily: Font.Semibold,
                                    color: Colors.violet,
                                  }}>
                                  {Lang_chg.benjamin[config.language]}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: (mobileW * 3.6) / 100,
                                    fontFamily: Font.OutfitMedium,
                                    color: Colors.textgrey,
                                  }}>
                                  20 min ago
                                </Text>
                              </View>

                              <View
                                style={{
                                  width: (mobileW * 78) / 100,
                                  flexDirection: 'row',
                                  alignSelf: 'center',
                                  justifyContent: 'space-between',
                                  marginLeft: (mobileW * 1) / 100,
                                }}>
                                <View
                                  style={{
                                    width: (mobileW * 60) / 100,
                                    flexDirection: 'row',
                                    alignSelf: 'center',
                                    justifyContent: 'flex-start',
                                    paddingVertical: (mobileW * 1) / 100,
                                  }}>
                                  {localimag.star && (
                                    <Image
                                      style={{
                                        alignSelf: 'center',
                                        width: (mobileW * 2.6) / 100,
                                        height: (mobileW * 2.6) / 100,
                                        borderRadius: (mobileW * 5) / 100,
                                      }}
                                      source={localimag.star}
                                    />
                                  )}
                                  {localimag.star && (
                                    <Image
                                      style={{
                                        alignSelf: 'center',
                                        width: (mobileW * 2.6) / 100,
                                        height: (mobileW * 2.6) / 100,
                                        borderRadius: (mobileW * 5) / 100,
                                      }}
                                      source={localimag.star}
                                    />
                                  )}
                                  {localimag.star && (
                                    <Image
                                      style={{
                                        alignSelf: 'center',
                                        width: (mobileW * 2.6) / 100,
                                        height: (mobileW * 2.6) / 100,
                                        borderRadius: (mobileW * 5) / 100,
                                      }}
                                      source={localimag.star}
                                    />
                                  )}
                                  {localimag.star && (
                                    <Image
                                      style={{
                                        alignSelf: 'center',
                                        width: (mobileW * 2.6) / 100,
                                        height: (mobileW * 2.6) / 100,
                                        borderRadius: (mobileW * 5) / 100,
                                      }}
                                      source={localimag.star}
                                    />
                                  )}
                                  {localimag.stargrey && (
                                    <Image
                                      style={{
                                        alignSelf: 'center',
                                        width: (mobileW * 2.6) / 100,
                                        height: (mobileW * 2.6) / 100,
                                        borderRadius: (mobileW * 5) / 100,
                                      }}
                                      source={localimag.stargrey}
                                    />
                                  )}
                                </View>
                              </View>
                              <View
                                style={{
                                  width: (mobileW * 77) / 100,
                                  flexDirection: 'row',
                                  alignSelf: 'center',
                                  justifyContent: 'flex-start',
                                  paddingVertical: (mobileW * 1) / 100,
                                }}>
                                <Text
                                  style={{
                                    fontSize: (mobileW * 3.8) / 100,
                                    fontFamily: Font.OutfitMedium,
                                    color: Colors.grey,
                                  }}>
                                  {Lang_chg.Orderid[config.language]}
                                </Text>
                              </View>

                              <View
                                style={{
                                  width: (mobileW * 76) / 100,
                                  flexDirection: 'row',
                                  alignSelf: 'center',
                                  justifyContent: 'flex-start',
                                }}>
                                <Text
                                  style={{
                                    fontSize: (mobileW * 3.8) / 100,
                                    fontFamily: Font.OutfitMedium,
                                    color: Colors.mediumgrey,
                                  }}>
                                  Lorem Ipsum enriching it with html elements
                                  that define its structure.
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>
                    )}
                  </View>

                  {this.state.order_arr.order_status == 0 &&
                    this.state.user_type == 2 && (
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '95%',
                          alignSelf: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <TouchableOpacity
                          style={{
                            width: '48%',
                            alignSelf: 'center',
                            justifyContent: 'center',
                            marginBottom: (mobileW * 10) / 100,
                            marginTop: (mobileW * 10) / 100,
                          }}
                          onPress={() => {
                            this.accept_alert(this.state.order_arr);
                          }}>
                          <View
                            style={{
                              width: '100%',
                              alignSelf: 'center',
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderRadius: (mobileW * 1) / 100,
                              padding: (mobileW * 3) / 100,
                              backgroundColor: Colors.theamColor,
                            }}>
                            <Text
                              style={{
                                fontSize: (mobileW * 4) / 100,
                                color: Colors.white_color,
                                fontFamily: Font.fontmedium,
                                textAlign: 'center',
                                paddingLeft: 3.5,
                              }}>
                              {Lang_chg.accept_text[config.language]}
                            </Text>
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={{
                            width: '48%',
                            alignSelf: 'center',
                            justifyContent: 'center',
                            marginBottom: (mobileW * 10) / 100,
                            marginTop: (mobileW * 10) / 100,
                          }}
                          onPress={() => {
                            this.reject_alert(this.state.order_arr);
                          }}>
                          <View
                            style={{
                              width: '100%',
                              alignSelf: 'center',
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderRadius: (mobileW * 1) / 100,
                              padding: (mobileW * 3) / 100,
                              backgroundColor: Colors.theamColor,

                              backgroundColor: Colors.red,
                            }}>
                            <Text
                              style={{
                                fontSize: (mobileW * 4) / 100,
                                color: Colors.white_color,
                                fontFamily: Font.fontmedium,
                                textAlign: 'center',
                                paddingLeft: 3.5,
                              }}>
                              {Lang_chg.reject_text[config.language]}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    )}

                  {/* //------------ only in accept-----------// */}

                  {this.state.order_arr.order_status == 1 &&
                    this.state.user_type == 2 && (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignSelf: 'center',
                          width: (mobileW * 90) / 100,
                          marginTop: (mobileW * 9) / 100,
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            this.order_pickup();
                          }}
                          style={{
                            width: (mobileW * 41) / 100,
                            marginBottom: (mobileW * 10) / 100,
                          }}>
                          <View
                            style={{
                              width: (mobileW * 41) / 100,
                              alignSelf: 'center',
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderRadius: (mobileW * 1) / 100,
                              padding: (mobileW * 3) / 100,
                              backgroundColor: Colors.violet,
                            }}>
                            <Text
                              style={{
                                fontSize: (mobileW * 4.3) / 100,
                                color: Colors.white_color,
                                fontFamily: Font.OutfitMedium,
                                textAlign: 'center',
                                paddingLeft: 3.5,
                              }}>
                              Pick up
                            </Text>
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={{
                            width: (mobileW * 41) / 100,
                            marginBottom: (mobileW * 10) / 100,
                          }}
                          onPress={() => {
                            this.props.navigation.navigate(
                              'Driver_Cancelorder',
                              {
                                user_id: this.state.user_id,
                                order_id: this.state.order_arr.order_id,
                              },
                            );
                          }}>
                          <View
                            style={{
                              width: (mobileW * 41) / 100,
                              alignSelf: 'center',
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderRadius: (mobileW * 1) / 100,
                              padding: (mobileW * 3) / 100,
                              backgroundColor: Colors.red,
                            }}>
                            <Text
                              style={{
                                fontSize: (mobileW * 4.3) / 100,
                                color: Colors.white_color,
                                fontFamily: Font.OutfitMedium,
                                textAlign: 'center',
                                paddingLeft: 3.5,
                              }}>
                              {Lang_chg.CancelOrder[config.language]}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    )}

                  {this.state.order_arr.order_status == 2 &&
                    this.state.user_type == 2 && (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignSelf: 'center',
                          width: (mobileW * 90) / 100,
                          marginTop: (mobileW * 5) / 100,
                        }}>
                        <TouchableOpacity
                          style={{
                            width: (mobileW * 90) / 100,
                            marginBottom: (mobileW * 2) / 100,
                          }}
                          onPress={() => {
                            Linking.openURL(
                              'http://maps.google.com/?q=' +
                                this.state.order_arr.location,
                            );
                          }}>
                          <View
                            style={{
                              width: (mobileW * 90) / 100,
                              alignSelf: 'center',
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderRadius: (mobileW * 1) / 100,
                              padding: (mobileW * 3) / 100,
                              backgroundColor: Colors.red,
                            }}>
                            <Text
                              style={{
                                fontSize: (mobileW * 4.3) / 100,
                                color: Colors.white_color,
                                fontFamily: Font.OutfitMedium,
                                textAlign: 'center',
                                paddingLeft: 3.5,
                              }}>
                              {Lang_chg.HeadToDestination[config.language]}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    )}

                  {this.state.order_arr.order_status == 2 &&
                    this.state.user_type == 2 && (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignSelf: 'center',
                          width: (mobileW * 90) / 100,
                          marginTop: (mobileW * 5) / 100,
                        }}>
                        {
                          <TouchableOpacity
                            onPress={() => {
                              this.confirmationForDropOffOrder();
                            }}
                            style={{width: (mobileW * 90) / 100}}>
                            <View
                              style={{
                                width: (mobileW * 90) / 100,
                                marginBottom: (mobileH * 5) / 100,
                                alignSelf: 'center',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: (mobileW * 1) / 100,
                                padding: (mobileW * 3) / 100,
                                backgroundColor: Colors.violet,
                              }}>
                              <Text
                                style={{
                                  fontSize: (mobileW * 4.3) / 100,
                                  color: Colors.white_color,
                                  fontFamily: Font.OutfitMedium,
                                  textAlign: 'center',
                                  paddingLeft: 3.5,
                                }}>
                                {Lang_chg.Dropoff[config.language]}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        }
                      </View>
                    )}

                  {this.state.order_arr.order_status == 3 &&
                    this.state.user_type == 1 &&
                    (this.state.order_arr.rating_arr == 'NA' ? (
                      <TouchableOpacity
                        onPress={() => {
                          this.props.navigation.navigate('Ratenow', {
                            order_id: this.state.order_arr.order_id,
                            driver_id: this.state.order_arr.driver_id,
                            customer_id: this.state.order_arr.customer_id,
                            driver_name: this.state.order_arr.driver_name,
                            driver_image: this.state.order_arr.driver_image,
                          });
                        }}
                        style={{
                          marginTop: (mobileW * 18) / 100,
                          flexDirection: 'row',
                          width: (mobileW * 93) / 100,
                          alignSelf: 'center',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: (mobileW * 2) / 100,
                          padding: (mobileW * 4) / 100,
                          backgroundColor: Colors.removecolor,
                        }}>
                        <Text
                          style={{
                            fontSize: (mobileW * 4.3) / 100,
                            color: Colors.white_color,
                            fontFamily: Font.OutfitMedium,
                            textAlign: 'center',
                            paddingLeft: 3.5,
                          }}>
                          {Lang_chg.ratenow[config.language]}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <View>
                        <View
                          style={{
                            width: (mobileW * 100) / 100,
                            flex: 1,
                            paddingVertical: 2,
                            backgroundColor: '#EEEEEE',
                            bottomborder: mobileW * 1,
                            borderColor: Colors.bottomborder,
                            marginVertical: (mobileW * 3) / 100,
                            alignSelf: 'center',
                          }}
                        />

                        <View
                          style={{
                            width: (mobileW * 95) / 100,
                            alignSelf: 'center',
                            marginTop: (mobileW * 1) / 100,
                            paddingVertical: (mobileW * 1) / 100,
                            backgroundColor: Colors.white1,
                            paddingBottom: (mobileW * 5) / 100,
                          }}>
                          <View
                            style={{
                              paddingTop: 10,
                              flexDirection: 'row',
                              width: (mobileW * 95) / 100,
                              alignSelf: 'center',
                              justifyContent: 'center',
                              alignItems: 'center',
                              marginTop: (mobileW * 1) / 100,
                            }}>
                            <View style={{marginTop: (mobileW * -9) / 100}}>
                              {localimag.img_placeholder && (
                                <Image
                                  style={{
                                    alignSelf: 'center',
                                    width: (mobileW * 9.5) / 100,
                                    height: (mobileW * 9.5) / 100,
                                    borderRadius: (mobileW * 5) / 100,
                                    borderColor: Colors.light_grey,
                                    borderWidth: 1.5,
                                    marginTop: (mobileW * -1.7) / 100,
                                  }}
                                  source={
                                    this.state.order_arr.rating_arr
                                      .customer_image == null
                                      ? localimag.img_placeholder
                                      : {
                                          uri:
                                            config.img_url +
                                            this.state.order_arr.rating_arr
                                              .customer_image,
                                        }
                                  }></Image>
                              )}
                            </View>

                            <View style={{paddingLeft: (mobileW * 1) / 100}}>
                              <View
                                style={{
                                  width: (mobileW * 78) / 100,
                                  flexDirection: 'row',
                                  alignSelf: 'center',
                                  justifyContent: 'space-between',
                                  marginLeft: (mobileW * 1) / 100,
                                }}>
                                <Text
                                  style={{
                                    fontSize: (mobileW * 4) / 100,
                                    fontFamily: Font.Semibold,
                                    color: Colors.violet,
                                  }}>
                                  {
                                    this.state.order_arr.rating_arr
                                      .customer_name
                                  }
                                </Text>
                                <Text
                                  style={{
                                    fontSize: (mobileW * 3.6) / 100,
                                    fontFamily: Font.OutfitMedium,
                                    color: Colors.textgrey,
                                  }}>
                                  {this.state.order_arr.rating_arr.createtime}
                                </Text>
                              </View>

                              <View
                                style={{
                                  width: (mobileW * 78) / 100,
                                  flexDirection: 'row',
                                  alignSelf: 'center',
                                  justifyContent: 'space-between',
                                  marginLeft: (mobileW * 1) / 100,
                                }}>
                                <View
                                  style={{
                                    width: (mobileW * 60) / 100,
                                    flexDirection: 'row',
                                    alignSelf: 'center',
                                    justifyContent: 'flex-start',
                                    paddingVertical: (mobileW * 1) / 100,
                                  }}>
                                  <StarRating
                                    halfStarEnabled
                                    starSize={(mobileW * 4) / 100}
                                    emptyStar={localimag.stargrey}
                                    fullStar={localimag.star}
                                    disabled={false}
                                    maxStars={5}
                                    rating={parseInt(
                                      this.state.order_arr.rating_arr.rating,
                                    )}
                                  />
                                </View>
                              </View>
                              <View
                                style={{
                                  width: (mobileW * 77) / 100,
                                  flexDirection: 'row',
                                  alignSelf: 'center',
                                  justifyContent: 'flex-start',
                                  paddingVertical: (mobileW * 1) / 100,
                                }}>
                                <Text
                                  style={{
                                    fontSize: (mobileW * 3.8) / 100,
                                    fontFamily: Font.OutfitMedium,
                                    color: Colors.grey,
                                  }}>
                                  {Lang_chg.Order_id[config.language]}#
                                  {this.state.order_arr.order_no}
                                </Text>
                              </View>

                              <View
                                style={{
                                  width: (mobileW * 77) / 100,
                                  flexDirection: 'row',
                                  alignSelf: 'center',
                                  justifyContent: 'flex-start',
                                }}>
                                <Text
                                  style={{
                                    fontSize: (mobileW * 3.8) / 100,
                                    fontFamily: Font.OutfitMedium,
                                    color: Colors.mediumgrey,
                                  }}>
                                  {this.state.order_arr.rating_arr.review}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>
                    ))}
                </TouchableOpacity>
              </ScrollView>
            </>
          )}
        </TouchableOpacity>

        {/* video modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.newcameramodal}
          onRequestClose={() => {
            this.setState({newcameramodal: false});
          }}>
          <View style={styles.container}>
            <SafeAreaView
              style={{flex: 0, backgroundColor: Colors.statusbar_color}}
            />
            {this.renderCamera()}
          </View>
        </Modal>

        <Cameragallery
          mediamodal={this.state.mediamodal}
          Camerapopen={() => {
            this.Camerapopen();
          }}
          Galleryopen={() => {
            this.Galleryopen();
          }}
          Canclemedia={() => {
            this.setState({mediamodal: false});
          }}
        />

        <Modal
          animationType={'slide'}
          transparent={true}
          visible={this.state.modalVisible2}
          onRequestClose={() => {
            this.setState({modalVisible: false});
          }}>
          <View style={{backgroundColor: '#00000070', flex: 1}}>
            <View
              style={{
                borderRadius: 20,
                position: 'absolute',
                bottom: 10,
                borderWidth: 0.3,
                width: (mobileW * 90) / 100,
                alignSelf: 'center',
              }}>
              <View
                style={{
                  width: (mobileW * 90) / 100,
                  alignSelf: 'center',
                  borderRadius: 15,
                  backgroundColor: 'white',
                  paddingVertical: (mobileW * 1) / 100,
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    paddingVertical: (mobileW * 2) / 100,
                    borderBottomWidth: 2,
                    borderBottomColor: Colors.popupborder,
                  }}>
                  <View style={{justifyContent: 'center'}}>
                    <Text
                      style={{
                        fontSize: (mobileW * 3.5) / 100,
                        color: '#6e6b6b',
                        fontFamily: Font.fontregular,
                        textAlign: 'center',
                      }}>
                      {Lang_chg.Select_Option[config.language]}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    paddingVertical: (mobileW * 3) / 100,
                    borderBottomWidth: 2,
                    borderBottomColor: Colors.popupborder,
                    color: Colors.black_color,
                    fontFamily: Font.fontbold,
                  }}>
                  <TouchableOpacity
                    style={{justifyContent: 'center'}}
                    onPress={() => {
                      this.setState({modalVisible: false}),
                        setTimeout(() => {
                          this.Cameravideopopen();
                        }, 800);
                    }}>
                    <Text
                      style={{
                        fontSize: (mobileW * 4) / 100,
                        color: Colors.allpopuptext,
                        textAlign: 'center',
                      }}>
                      {/* //video= */}
                      Camera
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    paddingVertical: (mobileW * 3) / 100,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({modalVisible: false});
                      setTimeout(() => {
                        this.Galleryvideoopen();
                      }, 800);
                    }}
                    style={{justifyContent: 'center'}}>
                    <Text
                      style={{
                        fontSize: (mobileW * 4) / 100,
                        color: Colors.allpopuptext,
                        fontFamily: Font.fontregular,
                        textAlign: 'center',
                      }}>
                      {/* video= */}
                      Gallery
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  justifyContent: 'center',
                  paddingVertical: (mobileW * 3.5) / 100,
                  borderBottomWidth: 0.3,
                  marginTop: 10,
                  width: (mobileW * 90) / 100,
                  borderRadius: 13,
                  alignSelf: 'center',
                  backgroundColor: 'white',
                }}>
                <TouchableOpacity
                  style={{justifyContent: 'center'}}
                  onPress={() => this.setState({modalVisible: false})}>
                  <Text
                    style={{
                      fontSize: (mobileW * 5) / 100,
                      color: 'red',
                      fontFamily: Font.fontbold,
                      textAlign: 'center',
                    }}>
                    {/* VIDEO= */}
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

//video=
const styles = StyleSheet.create({
  header_view: {
    width: (mobileW * 100) / 100,
    flexDirection: 'row',
    paddingHorizontal: 6,
    backgroundColor: '#fff',
    alignItems: 'center',
    height: (mobileH * 8) / 100,
    shadowColor: Colors.border_color,
    shadowOffset: {width: 1, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 4,
  },
  backIcon: {
    width: '10%',
  },
  headerText: {
    width: '80%',
    alignItems: 'center',
  },
  buttonView1: {
    alignSelf: 'center',
  },
  OrderHistoryTitle: {
    color: '#fff',

    fontSize: 15,
    letterSpacing: 0.5,
  },

  flipButton: {
    flex: 0.3,
    height: 40,
    marginHorizontal: 2,
    marginBottom: 50,
    marginTop: 10,
    borderRadius: 8,
    borderColor: 'white',
    borderWidth: 1,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipButton45: {
    height: 40,
    margin: 1,
    borderColor: 'white',
    borderWidth: 1,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  autoFocusBox: {
    position: 'absolute',
    height: 64,
    width: 64,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'white',
    opacity: 0.4,
  },
  flipText: {
    color: Colors.whiteColor,
    fontSize: 15,
  },
  zoomText: {
    position: 'absolute',
    bottom: 70,
    zIndex: 2,
    left: 2,
  },
  picButton: {
    backgroundColor: 'darkseagreen',
  },
  facesContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
  },
  face: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    position: 'absolute',
    borderColor: '#FFD700',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  landmark: {
    width: landmarkSize,
    height: landmarkSize,
    position: 'absolute',
    backgroundColor: 'red',
  },
  faceText: {
    color: '#FFD700',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    backgroundColor: 'transparent',
  },
  text: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    position: 'absolute',
    borderColor: '#F00',
    justifyContent: 'center',
  },

  textBlock: {
    color: '#F00',
    position: 'absolute',
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: '8%',
  },
  mediaPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
  },
  ViewText: {
    flexDirection: 'row',
    width: (mobileW * 87) / 100,
    alignSelf: 'center',
    marginTop: (mobileW * 4) / 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: (mobileW * 2.5) / 100,
    padding: (mobileW * 0.5) / 100,
    backgroundColor: '#fff',
    shadowColor: Colors.border_color,
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 4,
  },
  textInputView: {
    width: '90%',
    backgroundColor: Colors.whiteColor,
    justifyContent: 'center',

    alignSelf: 'center',
    fontSize: (mobileW * 4) / 100,
    borderRadius: (mobileW * 2) / 100,
    fontFamily: Font.fontregular,
    paddingVertical: (mobileW * 2) / 100,
    color: Colors.textColors,
  },
});
