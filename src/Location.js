
import React, { Component } from 'react'
import {
    Text, View, StyleSheet, Dimensions, ImageBackground, TouchableOpacity,
    Image, TextInput, Modal, FlatList, SafeAreaView, StatusBar, BackHandler
} from 'react-native';
import { Colors, mediaprovider, config, localStorage, localimag, Currentltlg, Lang_chg, mobileW } from '../src/Provider/utilslib/Utils';
import Icon2 from 'react-native-vector-icons/Entypo';
import MapView, { Marker, PROVIDER_GOOGLE, } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
//import CSSstyle from './Provider/css'
// import LinearGradient from 'react-native-linear-gradient'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { Fontsize, Font } from '../src/Provider/Colorsfont';
import { color } from 'react-native-reanimated';
export default class Location extends Component {
    _didFocusSubscription;
    _willBlurSubscription;
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            modalVisible1: false,
            latitude: config.latitude,
            longitude: config.longitude,
            latdelta: '0.0922',
            longdelta: '0.0421',
            isConnected: true,
            addressbar: false,
            addressbar2: false,
            addressselected: 'Search',
            makermove: 0,
            username: '',
            address: '',
            mapDetails: '',
            order_type: this.props.route.params.order_type
        }
        // this.getcurrentlatlogn();
        //this part will stop the loader in map
        this._didFocusSubscription = props.navigation.addListener('focus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
        );
    }
    async componentDidMount() {

        this._willBlurSubscription = this.props.navigation.addListener('blur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
        );

        // this.getcurrentlatlogn();
    }
    handleBackPress = () => {

        this.props.navigation.goBack()
        return true;
    }
    getcurrentlatlogn = async () => {
        let data = await Currentltlg.requestLocation()
        //Currentltlg is where global loader is defined............
        let latitude = data.coords.latitude;
        let longitude = data.coords.longitude;
        if (this.props.address_arr != 'NA') {
            this.setState({ latitude: latitude, longitude: longitude })
        }
        else {
            this.setState({ latitude: latitude, longitude: longitude })
        }

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

    //Update Version Code
    getadddressfromlatlong = (event) => {
        const newRegion = {
            latitude: event.latitude,
            longitude: event.longitude,
            latitudeDelta: event.latitudeDelta,
            longitudeDelta: event.longitudeDelta,
        };

        if (this.state.makermove !== 0) {
            this.map.animateToRegion(newRegion); // Update the map region to the new location
            this.setState({ makermove: 0 });

            fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + event.latitude + ',' + event.longitude + '&key=' + config.mapkey + '&language=' + config.maplanguage)
                .then((response) => response.json())
                .then((resp) => {
                    // ... (your existing code to process the address data)
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
                    // let data2 = { 'latitude': details.geometry.location.lat, 'longitude': details.geometry.location.lng, 'address': details.formatted_address, 'city': city, 'administrative_area_level_1': administrative_area_level_1 }
                    this.GooglePlacesRef && this.GooglePlacesRef.setAddressText(details.formatted_address)
                    this.setState({ latdelta: event.latitudeDelta, longdelta: event.longitudeDelta, latitude: event.latitude, longitude: event.longitude, addressselected: details.formatted_address })
                    //console.log('TaDa:  ', this.state);
                    // return this.props.locationget(data2);
                });
        }
        else {
            this.setState({ makermove: 1 })
        }
    };


    // getadddressfromlatlong = (event) => {
    //     if (this.state.makermove != 0) {
    //         fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + event.latitude + ',' + event.longitude + '&key=' + config.mapkey + '&language=' + config.maplanguage)

    //             .then((response) => response.json())
    //             .then((resp) => {

    //             })

    //     }
    //     else {
    //         this.setState({ makermove: 1 })
    //     }

    // } //Previous Code

    setGoogleMapLocation = () => {

    }

    render() {

        return (

            // <Modal
            //     animationType="slide"
            //     transparent={true}
            //     visible={this.props.mapmodal}
            //     onRequestClose={() => {
            //         this.setState({ makermove: 0 })
            //         this.props.navigation.goBack();
            //     }}>
            <View style={styles.container}>
                {/* <View style={{ width: '100%', alignSelf: 'center', flexDirection: 'row', paddingTop: 10, }}>
            <TouchableOpacity style={{ paddingVertical: 15, width: '20%', alignSelf: 'center' }} onPress={() => { this.setState({ makermove: 0 }); this.props.canclemap() }}>
              <View style={{ width: '100%', alignSelf: 'center' }}>
                <Image source={localimag.arrowld} style={{ alignSelf: 'center', width: 20, height: 20, resizeMode: 'contain' }} />
              </View>
            </TouchableOpacity>
            <View style={{ paddingVertical: 15, width: '60%' }}>
              <Text style={{ color: 'black', fontFamily: 'Nunito-Light', fontSize: 17, textAlign: 'center' }}>{Lang_chg.titlesearchlocation[config.language]}</Text>
            </View>
            <TouchableOpacity style={{ paddingVertical: 15, width: '20%', alignSelf: 'center' }} onPress={() => { this.state.profile == 'location' ? this.locationupdatebtn() : this.props.navigation.goBack() }}>
              <View style={{ width: '100%', alignSelf: 'center' }} >
                <Text style={{ color: Colors.buttoncolor, fontFamily: 'Nunito-Light', fontSize: 13, textAlign: 'center' }}></Text>
              </View>
            </TouchableOpacity>

          </View> */}
                {/* head title  */}
                <View style={styles.view1}>
                    <SafeAreaView style={{ flex: 0, backgroundColor: Colors.themecolor }} />
                    {/* <StatusBar barStyle='dark-content' backgroundColor={Colors.themecolor} hidden={false} translucent={false}
                        networkActivityIndicatorVisible={true} /> */}

                    {/* 25-07-22 */}
                    {/* Header-------------------------------------- */}
                    <View style={{
                        width: mobileW * 100 / 100, alignItems: 'center', backgroundColor: Colors.theamColor,
                    }} >
                        <View style={{ width: mobileW * 95 / 100, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center', paddingVertical: mobileW * 3 / 100 }}>
                            <TouchableOpacity style={{ width: mobileW * 12 / 100 }} onPress={() => this.props.navigation.goBack()} >
                                <Image style={{ height: mobileW * 6 / 100, width: mobileW * 6 / 100, resizeMode: 'contain' }} source={localimag.goback} />
                            </TouchableOpacity>
                            <View style={{ width: mobileW * 71 / 100, alignItems: 'center', alignSelf: 'center' }}>
                                <Text style={{ fontSize: mobileW * 5 / 100, color: Colors.white_color, fontFamily: Font.OutfitMedium }}>{Lang_chg.location_One[config.language]}</Text>
                            </View>
                            <View style={{ width: mobileW * 12 / 100, alignItems: 'flex-end' }}>
                                {/* <Image style={{ height: mobileW * 5 / 100, width: mobileW * 5 / 100, resizeMode: 'contain' }} source={localimag.whitedot} /> */}
                            </View>
                        </View>
                    </View>
                </View>

                <View style={{ flex: 1 }}>

                    <MapView
                        followsUserLocation={true}
                        style={{ flex: 1 }}
                        region={
                            this.getCoordinates(this)
                        }
                        zoomEnabled={true}
                        provider={PROVIDER_GOOGLE}
                        minZoomLevel={2}
                        maxZoomLevel={20}
                        rotateEnabled={true}
                        pitchEnabled={true}
                        // showsUserLocation={true}
                        userLocationPriority='high'
                        moveOnMarkerPress={true}
                        showsMyLocationButton={true}
                        showsScale={true} // also this is not working
                        showsCompass={true} // and this is not working
                        showsPointsOfInterest={true} // this is not working either
                        showsBuildings={true} // and finally, this isn't working either
                        onMapReady={this.onMapReady}
                        onRegionChangeComplete={(event) => { this.getadddressfromlatlong(event) }}
                        draggable
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
                            onDragEnd={(e) => { console.log("dragEnd", (e.nativeEvent.coordinate)) }}
                            draggable
                            title={this.state.username != null ? this.state.username : 'Guest user'}
                            description={'Your are here location'}

                        >
                            {/* <Image source={localimag.maplocation} style={{ height: 30, width: 30, resizeMode: 'contain', }} /> */}
                        </Marker.Animated>
                    </MapView>
                    <View style={{
                        backgroundColor: 'white', position: 'absolute',
                        width: '100%',
                        alignSelf: 'center',
                        justifyContent: "center",
                        // elevation: 1, shadowColor: '#000',
                        // shadowOpacity: 0.1,
                        // shadowOffset: { width:0, },
                        // shadowColor: '#000',
                        // shadowOpacity: 0.1, shadowOpacity: 0.3, shadowOffset: { width: 1, height: 1 },
                        // shadowRadius: 2, shadowColor: '#000',
                        //  marginTop: mobileW * 0.08
                    }}>
                        <View style={{ flex: 1, /*paddingHorizontal:windowWidth*6/100,paddingVertical:windowHeight*1/100*/ }}>

                            <GooglePlacesAutocomplete
                                placeholder={"Search"}
                                minLength={1} // minimum length of text to search
                                autoFocus={false}
                                returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                                listViewDisplayed='auto' // true/false/undefined
                                fetchDetails={true}
                                ref={(instance) => { this.GooglePlacesRef = instance }}
                                renderDescription={row => row.description} // custom description render
                                onPress={(data, details = null) => {
                                    let responseJson = details
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
                                    this.setState({ 'latitude': details.geometry.location.lat, 'longitude': details.geometry.location.lng, 'address': details.formatted_address, })

                                    let data2 = { 'latitude': details.geometry.location.lat, 'longitude': details.geometry.location.lng, 'address': details.formatted_address, 'city': city, 'administrative_area_level_1': administrative_area_level_1 }

                                    // return this.props.locationget(data2);

                                }}
                                // getDefaultValue={() => {
                                //   return  mapaddress!='NA'?mapaddress.address:'' // text input default value
                                // }}
                                query={{
                                    // available options: https://developers.google.com/places/web-service/autocomplete
                                    key: 'AIzaSyBI-EVEqoWesbt7_BxohFw-Alq1wI0XHJU',
                                    language: 'en', // language of the results
                                    //   types: '(cities)',  default: 'geocode'
                                }}
                                // to change place holder text color................
                                textInputProps={{
                                    placeholderTextColor: Colors.black_color,
                                    returnKeyType: "search"
                                }}
                                styles={{
                                    textInputContainer: {
                                        //backgroundColor: Colors.whiteColor,
                                        //marginTop: 10,
                                        alignSelf: 'center',
                                        justifyContent: "center",
                                        // borderRadius: windowWidth * 2 / 100,
                                        paddingLeft: windowWidth * 1.5 / 100,
                                        //     elevation: 2,
                                        //     shadowColor: '#000',
                                        //     shadowOpacity: 0.1,
                                        //    shadowOffset: { width:0, },
                                        //     shadowColor: '#000',
                                        //     shadowOpacity: 0.1,
                                        //paddingTop: windowHeight * 0.005,
                                        // backgroundColor:"green"
                                    },
                                    textInput: {
                                        marginLeft: 2,
                                        marginRight: 10,
                                        textAlign: 'left',
                                        fontFamily: Font.FontMedium,
                                        //color: '#5d5d5d',
                                        fontSize: windowWidth * 3.8 / 100,
                                        color: Colors.black_color
                                    },
                                    predefinedPlacesDescription: {
                                        color: Colors.statusbarcolor,
                                    },
                                    description: {
                                        fontFamily: Font.FontMedium,
                                    },
                                    container: {
                                        borderRadius: 10
                                    },
                                    poweredContainer: {
                                        backgroundColor: Colors.whiteColor,
                                        borderRadius: 15,
                                        color: '#FFFFFF'
                                    },
                                    listView: {
                                        backgroundColor: '#FFFFFF',
                                        // marginTop: 30,
                                        borderRadius: 15,
                                    }
                                }}
                                currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
                                currentLocationLabel="Current location"
                                nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                                GoogleReverseGeocodingQuery={{
                                    // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                                }}
                                GooglePlacesSearchQuery={{
                                    // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                                    rankby: 'distance',
                                    types: 'food',
                                }}
                                filterReverseGeocodingByTypes={[
                                    'locality',
                                    'administrative_area_level_3',
                                    'postal_code',
                                    'sublocality',
                                    'country']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                                //   predefinedPlaces={[homePlace, workPlace]}
                                debounce={100}
                                renderLeftButton={() =>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image resizeMode='contain' source={localimag.search} style={{
                                            width: windowWidth * 6 / 100, height: windowWidth * 6 / 100, alignSelf: 'center', paddingRight: 10, marginLeft: windowWidth * 3 / 100,
                                            bottom: 1.5,
                                        }}
                                        />
                                        <View style={{ borderRightWidth: 2, borderColor: Colors.border_color, height: 35, marginLeft: mobileW * 2 / 100 }}></View>
                                    </View>



                                    // renderRightButton={() => (<TouchableOpacity style={{ alignSelf: 'center', paddingRight: 10 }} onPress={() => { this.GooglePlacesRef.setAddressText(""); this.setState({ addressselected: 'search' }) }}>
                                    //     <Icon2 name='circle-with-cross' size={25} color='#c2cfc4' style={{ alignSelf: 'center' }} />
                                    //</TouchableOpacity>)}
                                }
                            //   <Image source={require('./icons/location.png')} style={{alignContent:'center',alignSelf:'center',resizeMode:'contain',width:20,height:20,marginLeft:10}}/>}
                            />
                        </View>
                    </View>
                </View>

                <HideWithKeyboard>
                    <TouchableOpacity
                        onPress={() => {
                            // this.setState({modalVisible1:false})
                            //console.log("address--->", this.state.addressselected);
                            //console.log("latitude--->", this.state.latitude);
                            //console.log("longitude--->", this.state.longitude);
                            {
                                this.state.order_type == 0 ?
                                    this.props.navigation.navigate('Viewcart', {
                                        address: this.state.address || this.state.addressselected,
                                        latitude: this.state.latitude,
                                        longitude: this.state.longitude,
                                    })
                                    :
                                    this.props.navigation.navigate('Details_Restaurants', {
                                        address: this.state.address || this.state.addressselected,
                                        latitude: this.state.latitude,
                                        longitude: this.state.longitude,
                                    })
                            }
                        }}
                        style={{
                            flexDirection: 'row', width: mobileW * 90 / 100,
                            alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                            borderRadius: mobileW * 1 / 100, bottom: 0, position: 'absolute',
                            // marginBottom: mobileW * 0.2,
                            marginBottom: mobileW * 0.1,
                            padding: mobileW * 4 / 100, backgroundColor: Colors.removecolor
                        }}>
                        <Text style={{
                            fontSize: mobileW * 3.8 / 100, color: Colors.white_color,
                            fontFamily: Font.OutfitMedium, textAlign: 'center', paddingLeft: 3.5
                        }}>
                            {Lang_chg.Step_1_B[config.language]}
                        </Text>
                    </TouchableOpacity>
                </HideWithKeyboard>
            </View>
            //  </Modal> 

        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.themecolor
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
        //     elevation: 10,
        //     shadowColor: '#000',
        //     shadowOpacity: 0.1,
        //  shadowOffset: { width:0, },
        //     shadowColor: '#000',
        //     shadowOpacity: 0.1,
        //     borderRadius: 15,
        //     alignSelf: 'center',
        // shadowOffset: {
        //     height: 7,
        //     width: 0
        // },
        // shadowColor: "rgba(0,0,0,1)",
        // shadowOpacity: 0.49,
        // shadowRadius: 5,

    },
    defautlButtonView:
    {
        backgroundColor: Colors.themecolor
        , paddingVertical: windowHeight * 2 / 100,
        marginHorizontal: windowWidth * 5.5 / 100,
        borderRadius: windowWidth * 3 / 100,
        marginTop: windowWidth * 5.5 / 100
    },
    defaultButtomTxt:
    {
        textAlign: 'center',
        fontFamily: Font.fontsemibold,
        color: Colors.whiteColor,
        fontSize: windowWidth * 4 / 100,
        textAlignVertical: 'center'
    },
    Headertitle: {

        backgroundColor: Colors.theam_color,
        alignItems: 'center',
        paddingHorizontal: windowWidth * 5 / 100,
        flexDirection: 'row',
        width: windowWidth,
        paddingVertical: windowHeight * 1 / 100,

    },
    title_head: {
        color: Colors.black_color,
        fontFamily: Font.FontBold,
        fontSize: windowWidth * 5.5 / 100,

    },
})