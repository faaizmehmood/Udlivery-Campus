import React, { Component } from 'react'
import { Modal, Text, View, StyleSheet, TextInput, StatusBar, PermissionsAndroid, Platform, TouchableOpacity, Image, SafeAreaView, Dimensions } from 'react-native'
import { Colors, mediaprovider, Font, config, localStorage, localimag, Currentltlg, Lang_chg, mobileW, mobileH } from './utilslib/Utils';
import Geolocation from '@react-native-community/geolocation';
import MapView, { Marker, PROVIDER_GOOGLE, } from 'react-native-maps';
const MobileW = Dimensions.get('window').width;
const MobileH = Dimensions.get('window').height;


export default class Mapprovider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      modalVisible1: false,
      latitude: config.latitude,
      longitude: config.longitude,
      latdelta: '0.0421',
      longdelta: '0.0444',
      isConnected: true,
      addressbar: false,
      addressbar2: false,
      addressselected: 'Search',
      makermove: 0,
      username: '',
      address: '',
      address_map: '',
      continue_btn: false,
    };
    this.getlatlong();
  }
  callLocation = async (that) => {
    this.setState({ loading: true })
    localStorage.getItemObject('position').then((position) => {
      //console.log('position', position)
      if (position != null) {
        var pointcheck1 = 0
        this.getalldata(position)
        Geolocation.getCurrentPosition(
          //Will give you the current location
          (position) => {

            localStorage.setItemObject('position', position)
            this.getalldata(position);
            pointcheck1 = 1
          },
          (error) => {
            let position = { 'coords': { 'latitude': config.latitude, 'longitude': config.longitude } }

            this.getalldata(position)
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 1000 }
        );
        that.watchID = Geolocation.watchPosition((position) => {
          //Will give you the location on location change
          //console.log('data', position);

          if (pointcheck1 != 1) {
            localStorage.setItemObject('position', position)
            this.getalldata(position)
          }

        });

      }
      else {
        //console.log('helo gkjodi')
        var pointcheck = 0
        Geolocation.getCurrentPosition(
          //Will give you the current location
          (position) => {

            localStorage.setItemObject('position', position)

            this.getalldata(position)
            pointcheck = 1
          },
          (error) => {
            let position = { 'coords': { 'latitude': config.latitude, 'longitude': config.longitude } }

            this.getalldata(position)
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 1000 }
        );
        that.watchID = Geolocation.watchPosition((position) => {
          //Will give you the location on location change
          //console.log('data', position);

          if (pointcheck != 1) {

            localStorage.setItemObject('position', position)
            this.getalldata(position)
          }

        });
      }
    })
  }
  getlatlong = async () => {

    let permission = await localStorage.getItemString('permission')
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
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
              'title': 'Location Access Required',
              'message': 'This App needs to Access your location'
            }
            )
            console.log('granted', PermissionsAndroid.RESULTS.GRANTED)
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              that.callLocation(that);
            } else {
              let position = { 'coords': { 'latitude': that.state.latitude, 'longitude': that.state.longitude } }
              localStorage.setItemString('permission', 'denied')
              that.getalldata(position)
            }
          } catch (err) { console.warn(err) }
        }
        requestLocationPermission();
      }
    } else {
      let position = { 'coords': { 'latitude': config.latitude, 'longitude': config.longitude } }
      this.getalldata(position)
    }
  }
  getalldata = (position) => {
    let longitude = position.coords.longitude
    let latitude = position.coords.latitude
    //console.log('positionlatitude', latitude)
    //console.log('positionlongitude', longitude)
    this.setState({ latitude: latitude, longitude: longitude, loading: false })


  }

  setMapRef = (map) => {
    this.map = map;
  }
  getCoordinates = (region) => {
    return ({
      latitude: parseFloat(this.state.latitude),
      longitude: parseFloat(this.state.longitude),
      latitudeDelta: parseFloat(this.state.latdelta),
      longitudeDelta: parseFloat(this.state.longdelta),
    }
    );
  }

  getadddressfromlatlong = (event) => {
    if (this.state.makermove != 0) {
      fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + event.latitude + ',' + event.longitude + '&key=' + config.mapkey + '&language=' + config.maplanguage)

        .then((response) => response.json())
        .then((resp) => {
          let responseJson = resp.results[0]
          let city = '';
          let administrative_area_level_1 = '';
          for (let i = 0; i < responseJson.address_components.length; i++) {
            if (responseJson.address_components[i].types[0] == "locality") {
              city = responseJson.address_components[i].long_name
              break;
            }
            else if (responseJson.address_components[i].types[0] == "administrative_area_level_2") {
              city = responseJson.address_components[i].long_name
            }

          }
          for (let j = 0; j < responseJson.address_components.length; j++) {
            if (responseJson.address_components[j].types[0] == "administrative_area_level_1") {
              administrative_area_level_1 = responseJson.address_components[j].long_name
            }

          }
          let details = responseJson
          let data2 = { 'latitude': details.geometry.location.lat, 'longitude': details.geometry.location.lng, 'address': details.formatted_address, 'city': city, 'administrative_area_level_1': administrative_area_level_1 }
          this.GooglePlacesRef && this.GooglePlacesRef.setAddressText(details.formatted_address)
          this.setState({ latdelta: event.latitudeDelta, longdelta: event.longitudeDelta, latitude: event.latitude, longitude: event.longitude, addressselected: details.formatted_address })
          return this.props.locationget(data2);
        })

    }
    else {
      this.setState({ makermove: 1 })
    }

  }

  editfun = () => {

    // consolepro.consolelog('I am in otp verification otp click...')
    // Keyboard.dismiss()
    this.setState({ mod: false })
    this.props.navigation.navigate('Verify')

  }

  render() {
    return (

      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.mapmodal}
        onRequestClose={() => {
          this.setState({ makermove: 0 })
          this.props.canclemap();
        }}>

        <StatusBar
          backgroundColor={Colors.Red1}
          hidden={false}
          barStyle={'light-content'}
          // backgroundColor={Colors.back_color}
          translucent={false}
          networkActivityIndicatorVisible={true}
        />
        <View style={{ flex: 1, }}>
          <SafeAreaView style={{ flex: 0 }}>
          </SafeAreaView>
          {/* -------------------Header Section------------------------ */}
          <View style={{
            width: mobileW, height: mobileW * 15 / 100,
            flexDirection: 'row', backgroundColor: Colors.Red1,
          }}>
            <TouchableOpacity
              //onPress={() => { this.props.navigation.navigate('Signup')}}
              style={{
                width: mobileW * 15 / 100, justifyContent: 'center',
                alignItems: 'center'
              }}>
              <Image source={localimag.line3} resizeMode='contain'

                style={{ height: mobileH * 6 / 100, width: mobileW * 6 / 100 }}></Image>
            </TouchableOpacity>
            {/* second image---------------- */}
            <View style={{
              width: mobileW * 70 / 100, justifyContent: 'center',
              alignItems: 'center', justifyContent: 'center'
            }}>
              <Image source={localimag.redlogo} resizeMode='contain'

                style={{ height: mobileH * 15 / 100, width: mobileW * 78 / 100 }}></Image>
            </View>
            {/* thired image----------- */}
            <TouchableOpacity
              onPress={() => { this.props.notification() }}
              style={{
                width: mobileW * 15 / 100, justifyContent: 'center',
                alignItems: 'center', justifyContent: 'center'
              }}>
              <Image source={localimag.notidot} resizeMode='contain'

                style={{ height: mobileH * 5 / 100, width: mobileW * 5 / 100 }}></Image>
            </TouchableOpacity>

          </View>

          {/* -------------------close Header------------------ */}


          {this.state.latitude != 'NA' &&
            <View style={{ flex: 1 }}>
              <MapView
                followsUserLocation={true}
                // onUserLocationChange={event =>this.getCoordinates(this)}

                style={{ flex: 1 }}
                region={
                  this.getCoordinates(this)
                }
                //  region={this.getCoordinates(this)}
                zoomEnabled={true}
                provider={PROVIDER_GOOGLE}
                minZoomLevel={2}
                maxZoomLevel={20}
                rotateEnabled={true}
                pitchEnabled={true}
                showsUserLocation={false}
                userLocationPriority='high'
                moveOnMarkerPress={true}
                // showsMyLocationButton={true}
                showsScale={false} // also this is not working
                // showsCompass={false} // and this is not working
                showsPointsOfInterest={true} // this is not working either
                showsBuildings={true} // and finally, this isn't working either

                onMapReady={this.onMapReady}
                //onRegionChangeComplete={(event)=>{this.getadddressfromlatlong(event)}}
                // draggable

                //  customMapStyle={mapStyle}
                ref={this.setMapRef}
              >

                <Marker.Animated
                  coordinate={{
                    latitude: parseFloat(this.state.latitude),
                    longitude: parseFloat(this.state.longitude),
                    latitudeDelta: parseFloat(this.state.latdelta),
                    longitudeDelta: parseFloat(this.state.longdelta),
                  }}
                  isPreselected={true}

                  // onDragEnd={(e) => {console.log("dragEnd",(e.nativeEvent.coordinate))}}
                  //draggable


                  title={this.state.username != null ? this.state.username : 'Guest user'}
                  description={'Your are here location'}

                >
                  <Image source={localimag.pin} style={{ height: 30, width: 30, resizeMode: 'contain', }} />
                </Marker.Animated>
              </MapView>
              <View style={{ position: 'absolute', width: '100%', top: 20 }}>
                <View style={{ flex: 1, paddingHorizontal: 20, alignItems: 'center' }}>


                  {/* --------------------Search Bar------------------------------- */}

                  <View style={{
                    flexDirection: 'row',
                    backgroundColor: 'white',
                    borderRadius: MobileH * 1 / 100,
                    shadowOpacity: 0.2,
                    elevation: 2, shadowOffset: { width: 0, },
                    shadowColor: '#000',
                    width: mobileW * 90 / 100,
                    marginVertical: mobileH * 2 / 100,
                    alignSelf: 'center'
                  }}>
                    <View style={{ width: mobileW * 78 / 100, backgroundColor: '', marginLeft: mobileW * 2 / 100 }}>


                      <TextInput maxLength={50} placeholder='Search ' placeholderTextColor={'#e2e2e2'} style={{ paddingVertical: mobileH * 1.5 / 100, color: Colors.black, fontSize: mobileW * 3.5 / 100, backgroundColor: Colors.theme_color1, width: '100%', alignSelf: 'center' }}></TextInput>


                    </View>
                    <View colors={[Colors.theme1, Colors.theme2]}
                      style={{
                        justifyContent: 'center', width: mobileW * 12 / 100,
                        backgroundColor: Colors.theme1
                      }}>
                      <Image
                        source={localimag.search_white}
                        resizeMode='contain'
                        style={{ height: mobileW * 6 / 100, width: mobileW * 6 / 100, marginLeft: mobileW * 3 / 100 }}
                      />
                    </View>
                  </View>

                </View>




              </View>
            </View>}



          {/* -----------continue button---------------------------- */}

          <TouchableOpacity
            //onPress={() => { this.props.navigation.navigate('ForgotPassword') }}

            style={{
              width: mobileW * 60 / 100, paddingVertical: mobileH * 2 / 100, marginTop: mobileH * 5 / 100,
              alignSelf: 'center', justifyContent: 'center', position: 'absolute', bottom: mobileH * 5 / 100,
              borderRadius: mobileW * 7 / 100, backgroundColor: Colors.Red1,

              flexDirection: 'row',
            }}>
            <Text style={{
              fontSize: mobileW * 4 / 100,
              fontFamily: Font.italic, color: Colors.white1
            }}>
              Continue</Text>
          </TouchableOpacity>





        </View>
      </Modal>

    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  button: {
    backgroundColor: '#00a1e4',
    width: 180,
    borderRadius: 45,
    paddingVertical: 10
  },
  searchbutton: {
    backgroundColor: '#00a1e4',

    borderRadius: 45,
    paddingVertical: 11,
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
    color: '#FFFFFF',
    position: "absolute", bottom: 10, width: '80%',
    alignSelf: 'center'
  },
  searchbar: {
    flexDirection: "row",
    width: '80%',
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    marginRight: 10,
    elevation: 10,
    borderRadius: 15,
    alignSelf: 'center',
    shadowOffset: {
      height: 7,
      width: 0
    },
    shadowColor: "rgba(0,0,0,1)",
    shadowOpacity: 0.49,
    shadowRadius: 5,

  }
})
