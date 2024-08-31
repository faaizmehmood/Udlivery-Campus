import {
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
  TextInput,
  Alert,
} from 'react-native';
import React, {Component} from 'react';
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
} from './Provider/utilslib/Utils';
import {color} from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';
import {Nodata_foundimage} from './Provider/Nodata_foundimage';

export default class Details extends Component {
  constructor(props) {
    super(props);
    {
      this.state = {
        dining_halls_id: this.props.route.params.dining_halls_id,
        active_food_category: 0,
        dining_arr: 'NA',
        user_id: 0,
        food_category_arr: 'NA',
        product_arr: '',
        send_data: '',
        add_to_cart_arr: 'NA',
        total_added_item: 0,
        refresh: true,
      };
    }
  }

  componentDidMount() {
    consolepro.consolelog('I am in one time purchase page.... 21');
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('focus', () => {
      consolepro.consolelog('I am in one time purchase page.... 22');

      this.getUserDetail();
    });

    this.getUserDetail();
  }

  getUserDetail = async () => {
    let userdata = await localStorage.getItemObject('user_arr');
    consolepro.consolelog('userdata', userdata);
    this.setState({
      user_id: userdata.user_id,
    });

    this.getOneTimePurchase(0);
    this.setCartCount();
  };

  //----------function for get one time purchase data list data --------//

  getOneTimePurchase = async var1 => {
    let url =
      config.baseURL +
      'get_dining_details_by_id.php?user_id=' +
      this.state.user_id +
      '&dining_halls_id=' +
      this.state.dining_halls_id;
    consolepro.consolelog('url', url);

    var var2 = 0;
    if (var1 == 1) {
      var2 = 1;
    }

    var2 = 0;

    apifuntion
      .getApi(url, var2)
      .then(obj => {
        consolepro.consolelog(obj);

        if (obj.success == 'true') {
          consolepro.consolelog('one_time_purchase_arr', obj);
          var food_category_arr = obj.food_category_arr;

          var product_arr = obj.food_category_arr[0].items_arr;

          var dining_arr = obj.dining_arr;

          if (food_category_arr != 'NA') {
            this.setState({
              food_category_arr: food_category_arr,
              refresh: false,
            });
          } else {
            this.setState({food_category_arr: 'NA', refresh: false});
          }
          if (product_arr != 'NA') {
            this.setState({product_arr: product_arr, refresh: false});

            setTimeout(() => {
              this.CheckAddedItems();
            }, 500);
          } else {
            this.setState({product_arr: 'NA', refresh: false});
          }
          if (dining_arr != 'NA') {
            this.setState({dining_arr: dining_arr, refresh: false});
          } else {
            this.setState({dining_arr: 'NA', refresh: false});
          }
        } else {
          if (obj.account_active_status == 0) {
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
  //---------for pull to refresh ------//

  _onRefresh = () => {
    this.setState({refresh: true});
    this.getOneTimePurchase(1);
  };

  click_category = (category_id, category_name) => {
    consolepro.consolelog('I am in click of category');
    consolepro.consolelog({category_id, category_name});
    this.props.navigation.navigate('VegListByCategory', {
      category_id: category_id,
      category_name: category_name,
    });
  };

  ///--------function for add item------//
  AddItem = (item, index) => {
    consolepro.consolelog('I am in add to cart function');
  };

  //-------go to cart-----//
  Checkuser = async () => {
    this.props.navigation.navigate('OneTimePurchaseCart');
  };

  //-------check which item is already added to cart---------//
  CheckAddedItems = async () => {
    let jsonValue = await localStorage.getItemObject('add_to_cart');

    jsonValue = jsonValue != null ? JSON.parse(jsonValue) : [];

    this.setState({
      add_to_cart_arr: jsonValue,
    });

    let product_arr = this.state.product_arr;
    let add_to_cart_arr = jsonValue;

    consolepro.consolelog({product_arr, add_to_cart_arr});
    var data1 = product_arr;
    var data2 = add_to_cart_arr;
    var length1 = data1.length;
    var length2 = data2.length;
    if (add_to_cart_arr != 'NA') {
      consolepro.consolelog({length1, length2});
      for (let i = 0; i < length1; i++) {
        for (let j = 0; j < length2; j++) {
          if (data1[i].item_id == data2[j].item_id) {
            data1[i].status = true;
            data1[i].quantity = 1;
          }
        }
      }
    }

    this.setState({
      product_arr: data1,
    });
  };

  //----------function for count the item and manage it -------//
  setCartCount = async () => {
    consolepro.consolelog('i am setCartCount');
    // ========= Now Check Cart Value is empty
    var add_to_cart = await localStorage.getItemObject('add_to_cart');
    consolepro.consolelog('add_to_cart=', add_to_cart);
    var add_to_cart_json_length = 0;
    var total_item_price = 0;
    var add_to_cart_arr = 'NA';

    if (add_to_cart != null) {
      var add_to_cart_json = JSON.parse(add_to_cart);
      consolepro.consolelog('add_to_cart_json=', add_to_cart_json);
      add_to_cart_arr = add_to_cart_json;
      // now check length
      add_to_cart_json_length = add_to_cart_json.length;
      for (let i = 0; i < add_to_cart_json_length; i++) {
        total_item_price +=
          add_to_cart_json[i].quantity * add_to_cart_json[i].product_price;
      }
    }

    consolepro.consolelog(
      'setCartCount add_to_cart_json_length=',
      add_to_cart_json_length,
    );
    consolepro.consolelog('total_price', total_item_price);
    consolepro.consolelog('add_to_cart_arr', add_to_cart_arr);
    this.setState({
      total_added_item: add_to_cart_json_length,
      total_item_price: total_item_price,
      add_to_cart_arr: add_to_cart_arr,
    });
  };

  //-------function for add item to cart in local storage-----------//

  add_to_cart = async (item, index) => {
    consolepro.consolelog(item, index);

    var dining_halls_id_tmp = await localStorage.getItemString(
      'dining_halls_id',
    );

    consolepro.consolelog('dining_halls_id_tmp add item', dining_halls_id_tmp);
    if (dining_halls_id_tmp == null) {
      consolepro.consolelog('dining_halls_id_tmp null condition add item');
      // dining_halls_id_tmp == this.state.dining_arr.dining_halls_id.toString()
      await localStorage.setItemString(
        'dining_halls_id',
        this.state.dining_arr.dining_halls_id.toString(),
      );
      // await localStorage.setItemString('dining_halls_id', dining_halls_id_tmp)
    } else {
      if (dining_halls_id_tmp != this.state.dining_halls_id) {
        Alert.alert(
          // 'Hold on!', 'Do you really want to exit app?', [
          // 'Hold on!', 'Do you want to clear old cart?', [
          'Information Message',
          'Clear the first add item for any other dining.',
          [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            {
              text: 'YES',
              onPress: () => {
                localStorage.removeItem('dining_halls_id');
                localStorage.removeItem('add_to_cart');
              },
              // localStorage.setItemString('dining_halls_id', null)
            },
          ],
        );
        return false;
      }
    }

    //--------------------------------------------
    consolepro.consolelog('outside if else');

    var add_to_cart = await localStorage.getItemObject('add_to_cart');
    consolepro.consolelog('added', {add_to_cart});

    if (add_to_cart != null) {
      consolepro.consolelog(add_to_cart);
      // {
      //     let data1 = this.state.product_arr;
      //     data1[index].status = true;
      //     consolepro.consolelog('data1', data1)
      //     this.setState({
      //         product_arr: data1,
      //     })
      // }

      var add_to_cart_json = JSON.parse(add_to_cart);
      consolepro.consolelog('add_to_cart_json=', add_to_cart_json);
      // ======== Now Find product Already Added

      var index1 = add_to_cart_json.findIndex(x => x.item_id == item.item_id);
      consolepro.consolelog('index=', index1);
      if (index1 >= 0) {
        // now set array

        consolepro.consolelog('Already exist');
        let data1 = this.state.product_arr;
        data1[index].status = false;
        data1[index].quantity = 0;
        consolepro.consolelog('data1', data1);
        this.setState({
          product_arr: data1,
        });

        var add_to_cart_json_length = add_to_cart_json.length;
        consolepro.consolelog(
          'add_to_cart_json_length=',
          add_to_cart_json_length,
        );

        if (add_to_cart_json_length == 1) {
          consolepro.consolelog('i am length 1');
          localStorage.removeItem('add_to_cart');
        } else {
          add_to_cart_json.splice(index1, 1);
          localStorage.setItemObject(
            'add_to_cart',
            JSON.stringify(add_to_cart_json),
          );
        }

        //localStorage.setItemObject('add_to_cart', JSON.stringify(add_to_cart_json));
      } else {
        consolepro.consolelog('add_to_cart is not null now ');
        let data1 = this.state.product_arr;
        data1[index].status = true;
        data1[index].quantity = 1;
        consolepro.consolelog('data1', data1);
        this.setState({
          product_arr: data1,
        });

        // var product_id = item.product_id;
        // var product_name = item.product_name;
        // var product_price = item.product_price;
        // var display_price = item.display_price;
        // var product_variant = item.product_variant;
        // var quantity = item.quantity;
        // var status = item.status;
        // var image = item.image;
        // var add_to_cart_object = {
        //     'product_id': product_id,
        //     'product_name': product_name,
        //     'product_price': product_price,
        //     'display_price': display_price,
        //     'product_variant': product_variant,
        //     'quantity': quantity,
        //     'status': status,
        //     'image': image,
        // }

        // add_to_cart_json.push(add_to_cart_object);
        add_to_cart_json.push(item);
        localStorage.setItemObject(
          'add_to_cart',
          JSON.stringify(add_to_cart_json),
        );
      }
    } else {
      consolepro.consolelog('add_to_cart is null');
      let data1 = this.state.product_arr;
      data1[index].status = true;
      data1[index].quantity = 1;
      consolepro.consolelog('data1', data1);
      this.setState({
        product_arr: data1,
      });
      // var product_id = item.product_id;
      // var product_name = item.product_name;
      // var product_price = item.product_price;
      // var display_price = item.display_price;
      // var product_variant = item.product_variant;
      // var quantity = item.quantity;
      // var status = item.status;
      // var image = item.image;

      // var add_to_cart_object = {
      //     'product_id': product_id,
      //     'product_name': product_name,
      //     'product_price': product_price,
      //     'display_price': display_price,
      //     'product_variant': product_variant,
      //     'quantity': quantity,
      //     'status': status,
      //     'image': image,
      // }

      var add_to_cart_object_push = [];
      // add_to_cart_object_push.push(add_to_cart_object);
      add_to_cart_object_push.push(item);
      localStorage.setItemObject(
        'add_to_cart',
        JSON.stringify(add_to_cart_object_push),
      );
    }
    this.setCartCount();
  };

  //----------go to veggies details----------//

  go_to_veggies_details = (item, index) => {
    consolepro.consolelog('I am in go to veggies page...');
    consolepro.consolelog({item, index});
    var category_id = item.category_id;
    var category_name = item.category_name;
    consolepro.consolelog({category_id, category_name});
    this.props.navigation.navigate('VeggieDetails', {
      item: item,
      category_id: category_id,
      category_name: category_name,
      index: index,
    });
  };

  //radhekrishan 25-07-22
  view_cart = async () => {
    let jsonValue = await localStorage.getItemObject('add_to_cart');

    consolepro.consolelog('cart values before in jsonValue', jsonValue);
    // jsonValue= jsonValue != null ? JSON.parse(jsonValue) : null;
    consolepro.consolelog('cart value in jsonValue', jsonValue);

    this.setState({
      // cart_arr: data,
      cart_arr: jsonValue,
      // num_arr: jsonValue,
    });

    this.props.navigation.navigate('Viewcart', {
      dining_halls_id: this.state.dining_halls_id,
    });
  };

  changeCategory = async index => {
    var add_to_cart = await localStorage.getItemObject('add_to_cart');

    let data = [];
    if (add_to_cart != null) {
      data = JSON.parse(add_to_cart);
    }

    let ids = [];

    for (let i = 0; i < data.length; i++) {
      ids.push(data[i].item_id);
    }

    console.log('ids', ids);
    console.log('data', data);

    let product_arr = 'NA';
    if (this.state.food_category_arr[index].items_arr != 'NA') {
      product_arr = this.state.food_category_arr[index].items_arr;
    }

    console.log('product_arr', product_arr);
    for (let i = 0; i < product_arr.length; i++) {
      product_arr[i].status = false;
    }
    if (data.length > 0 && product_arr != 'NA') {
      for (let j = 0; j < ids.length; j++) {
        for (let i = 0; i < product_arr.length; i++) {
          if (ids[j] == product_arr[i].item_id) {
            product_arr[i].status = true;
          }
        }
      }
    }

    console.log('product_arr', product_arr);
    this.setState({
      active_food_category: index,
      product_arr: product_arr,
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
          <View
            style={{
              paddingLeft: mobileW * 0.02,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              width: (mobileW * 100) / 100,
              alignItems: 'center',
              backgroundColor: Colors.theamColor,
            }}>
            <TouchableOpacity
              style={{width: (mobileW * 12) / 100}}
              onPress={() => this.props.navigation.goBack('')}>
              <Image
                style={{
                  height: (mobileW * 6.5) / 100,
                  width: (mobileW * 6.5) / 100,
                  resizeMode: 'contain',
                }}
                source={localimag.BackW}
              />
            </TouchableOpacity>
            <View
              style={{
                width: (mobileW * 76) / 100,
                paddingVertical: (mobileW * 3) / 100,
                alignItems: 'center',
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  fontSize: (mobileW * 5) / 100,
                  color: Colors.white_color,
                  fontFamily: Font.OutfitMedium,
                }}>
                {Lang_chg.Detail[config.language]}
              </Text>
            </View>
            <View style={{width: (mobileW * 12) / 100}}></View>
          </View>

          <ScrollView
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}>
            <TouchableOpacity
              style={{flex: 1, paddingBottom: (mobileW * 4) / 100}}
              activeOpacity={1}>
              <View
                style={{
                  shadowColor: Colors.shadowbuy,
                  shadowOffset: {width: 1, height: 1},
                  shadowOpacity: 0.5,
                  shadowRadius: 2,
                  elevation: 2,
                  width: (mobileW * 100) / 100,
                  alignSelf: 'center',
                  backgroundColor: '#fff',
                  borderRadius: (mobileW * 1) / 100,
                }}>
                <ImageBackground
                  imageStyle={{
                    borderBottomLeftRadius: (mobileW * 3) / 100,
                    borderBottomRightRadius: (mobileW * 3) / 100,
                    resizeMode: 'cover',
                  }}
                  style={{
                    alignSelf: 'center',
                    width: (mobileW * 100) / 100,
                    height: (mobileW * 65) / 100,
                    justifyContent: 'center',
                  }}
                  source={{
                    uri: config.img_url + this.state.dining_arr.image,
                  }}></ImageBackground>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                    alignSelf: 'center',
                    paddingVertical: (mobileW * 2) / 100,
                  }}>
                  <View style={{width: '90%', alignItems: 'center'}}>
                    <View style={{width: '93%'}}>
                      <Text
                        style={{
                          fontSize: (mobileW * 3.9) / 100,
                          fontFamily: Font.OutfitMedium,
                          color: Colors.neavyblue,
                        }}>
                        {this.state.dining_arr.name}
                      </Text>
                    </View>

                    <Text
                      style={{
                        width: '93%',
                        fontSize: (mobileW * 3) / 100,
                        fontFamily: Font.Fontregular,
                        color: Colors.detailspring,
                        paddingVertical: (mobileW * 1) / 100,
                      }}>
                      {this.state.dining_arr.description}
                    </Text>
                    <View
                      style={{
                        width: '93%',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Image
                        style={{
                          height: (mobileW * 3.8) / 100,
                          width: (mobileW * 3.8) / 100,
                          resizeMode: 'contain',
                        }}
                        source={localimag.breakfastimg}
                      />
                      <Text
                        style={{
                          fontSize: (mobileW * 2.8) / 100,
                          color: Colors.detailspring,
                          fontFamily: Font.Fontregular,
                          marginLeft: mobileW * 0.01,
                          paddingVertical: 2,
                          marginTop: (mobileW * 0.6) / 100,
                        }}>
                        {this.state.dining_arr.category_name}
                      </Text>
                    </View>
                    <View style={{width: '92%', alignItems: 'flex-start'}}>
                      {this.state.dining_arr.status == 1 && (
                        <Text
                          style={{
                            fontSize: (mobileW * 3.7) / 100,
                            color: Colors.opengreen,
                            paddingVertical: 2,
                            fontFamily: Font.OutfitMedium,
                          }}>
                          {Lang_chg.opened_txt[config.language]}
                        </Text>
                      )}
                      {this.state.dining_arr.status == 0 && (
                        <Text
                          style={{
                            fontSize: (mobileW * 3.7) / 100,
                            color: Colors.red,
                            paddingVertical: 2,
                            fontFamily: Font.OutfitMedium,
                          }}>
                          {Lang_chg.closed_txt[config.language]}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              </View>

              <View
                style={{
                  shadowColor: Colors.shadowbuy,
                  shadowOffset: {width: 1, height: 1},
                  shadowOpacity: 0.5,
                  shadowRadius: 2,
                  elevation: 2,
                  width: (mobileW * 100) / 100,
                  alignSelf: 'center',
                  paddingVertical: (mobileW * 2) / 100,
                  backgroundColor: '#fff',
                  borderRadius: (mobileW * 1) / 100,
                  marginTop: (mobileW * 2) / 100,
                }}>
                <View style={{width: '37%', alignItems: 'center'}}>
                  <Text
                    style={{
                      fontSize: (mobileW * 3.9) / 100,
                      color: Colors.neavyblue,
                      paddingVertical: 2,
                      fontFamily: Font.Semibold,
                    }}>
                    {Lang_chg.foodcategorie[config.language]}
                  </Text>
                </View>

                {this.state.food_category_arr != 'NA' && (
                  <View style={{width: '93%', marginLeft: (mobileW * 1) / 100}}>
                    <FlatList
                      data={this.state.food_category_arr}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      renderItem={({item, index}) => {
                        return (
                          <View
                            style={{
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              paddingLeft: (mobileW * 3) / 100,
                              paddingVertical: (mobileW * 2) / 100,
                            }}>
                            {this.state.active_food_category != index && (
                              <TouchableOpacity
                                onPress={() => {
                                  this.changeCategory(index);
                                }}
                                style={{
                                  flexDirection: 'row',
                                  backgroundColor: '#fff',
                                  borderRadius: (mobileW * 4) / 100,
                                  height: (mobileW * 8) / 100,
                                  alignItems: 'center',
                                  borderWidth: 2,
                                  borderColor: '#EEEEEE',
                                }}>
                                <View
                                  style={{
                                    height: (mobileW * 8) / 100,
                                    borderRadius: (mobileW * 4) / 100,
                                    backgroundColor: Colors.lightpurple,
                                    width: (mobileW * 8) / 100,
                                    alignItems: 'center',
                                  }}>
                                  <Image
                                    style={{
                                      backgroundColor: Colors.lightpurple,
                                      width: (mobileW * 6) / 100,
                                      height: (mobileW * 6) / 100,
                                      borderRadius: (mobileW * 25) / 100,
                                      marginTop: (mobileW * 1) / 100,
                                    }}
                                    resizeMode="contain"
                                    source={{
                                      uri:
                                        config.img_url +
                                        item.food_category_image,
                                    }}></Image>
                                </View>
                                <Text
                                  style={{
                                    fontSize: (mobileW * 3.4) / 100,
                                    fontFamily: Font.OutfitMedium,
                                    color: Colors.foodcolor,
                                    textAlign: 'center',
                                    paddingHorizontal: (mobileW * 2) / 100,
                                  }}>
                                  {item.food_category_name}
                                </Text>
                              </TouchableOpacity>
                            )}
                            {/* <================== Switch Button With No Purpose =============> */}

                            {/* {this.state.active_food_category == index && (
                              <TouchableOpacity
                                style={{
                                  flexDirection: 'row',
                                  backgroundColor: '#fff',
                                  borderRadius: (mobileW * 4) / 100,
                                  height: (mobileW * 8) / 100,
                                  alignItems: 'center',
                                  borderWidth: 2,
                                  borderColor: Colors.violet,
                                  borderWidth: 1,
                                }}>
                                <View
                                  style={{
                                    height: (mobileW * 7.6) / 100,
                                    borderRadius: (mobileW * 4) / 100,
                                    backgroundColor: Colors.lightpurple,
                                    borderRadius: (mobileW * 20) / 100,
                                    width: (mobileW * 8) / 100,
                                    alignItems: 'center',
                                  }}>
                                  <Image
                                    style={{
                                      backgroundColor: Colors.lightpurple,
                                      width: (mobileW * 6) / 100,
                                      height: (mobileW * 6) / 100,
                                      borderRadius: (mobileW * 25) / 100,
                                      marginTop: (mobileW * 1) / 100,
                                    }}
                                    resizeMode="contain"
                                    source={{
                                      uri:
                                        config.img_url +
                                        item.food_category_image,
                                    }}></Image>
                                </View>
                                <Text
                                  style={{
                                    fontSize: (mobileW * 3.4) / 100,
                                    fontFamily: Font.OutfitMedium,
                                    color: Colors.foodcolor,
                                    textAlign: 'center',
                                    paddingHorizontal: (mobileW * 2) / 100,
                                  }}>
                                  {item.food_category_name}
                                </Text>
                              </TouchableOpacity>
                            )} */}
                          </View>
                        );
                      }}
                    />
                  </View>
                )}
                {this.state.product_arr != 'NA' ? (
                  <View>
                    <FlatList
                      data={this.state.product_arr}
                      contentContainerStyle={{
                        paddingBottom: (mobileW * 2) / 100,
                      }}
                      renderItem={({item, index}) => {
                        return (
                          <View
                            style={{
                              borderWidth: 2,
                              borderColor: '#EEEEEE',
                              width: (mobileW * 93) / 100,
                              alignSelf: 'center',
                              paddingVertical: (mobileW * 2) / 100,
                              backgroundColor: '#fff',
                              borderRadius: (mobileW * 3) / 100,
                              marginTop: (mobileW * 2) / 100,
                            }}>
                            <View
                              style={{
                                paddingVertical: (mobileW * 1) / 100,
                                flexDirection: 'row',
                                width: (mobileW * 95) / 100,
                                alignSelf: 'center',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
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
                              <View style={{paddingLeft: (mobileW * 2) / 100}}>
                                <View
                                  style={{
                                    width: (mobileW * 64) / 100,
                                    alignSelf: 'center',
                                    justifyContent: 'space-between',
                                  }}>
                                  <Text
                                    style={{
                                      fontSize: (mobileW * 3.7) / 100,
                                      fontFamily: Font.Semibold,
                                      color: Colors.black_color,
                                    }}>
                                    {item.item_name}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    width: (mobileW * 64) / 100,
                                    flexDirection: 'row',
                                    alignSelf: 'center',
                                    justifyContent: 'flex-start',
                                    paddingVertical: (mobileW * 1) / 100,
                                  }}>
                                  <Text
                                    style={{
                                      fontSize: (mobileW * 3) / 100,
                                      fontFamily: Font.Fontregular,
                                      color: Colors.squaretext,
                                    }}>
                                    {item.description}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    width: (mobileW * 64) / 100,
                                    alignSelf: 'center',
                                    marginTop: (mobileW * 2.0) / 100,
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                  }}>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}>
                                    <Image
                                      borderRadius={4}
                                      style={{
                                        width: (mobileW * 3.5) / 100,
                                        height: (mobileW * 3.5) / 100,
                                      }}
                                      resizeMode="contain"
                                      source={localimag.fireicon}></Image>
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
                                  {item.status == true ? (
                                    <TouchableOpacity
                                      onPress={() => {
                                        if (this.state.dining_arr.status == 1) {
                                          this.add_to_cart(item, index);
                                        } else {
                                          msgProvider.toast(
                                            msgText.addToCardValidation[
                                              config.language
                                            ],
                                            'center',
                                          );
                                          return false;
                                        }
                                      }}
                                      style={{
                                        width: (mobileW * 14) / 100,
                                        backgroundColor: Colors.removecolor,
                                        borderColor: Colors.white1,
                                        borderRadius: (mobileW * 4) / 100,
                                        borderWidth: 2,
                                        paddingVertical: (mobileW * 0.6) / 100,
                                      }}>
                                      <Text
                                        style={{
                                          fontSize: (mobileW * 2.8) / 100,
                                          fontFamily: Font.Fontregular,
                                          color: Colors.white_color,
                                          textAlign: 'center',
                                        }}>
                                        {Lang_chg.Remove[config.language]}
                                      </Text>
                                    </TouchableOpacity>
                                  ) : (
                                    <TouchableOpacity
                                      onPress={() => {
                                        if (this.state.dining_arr.status == 1) {
                                          this.add_to_cart(item, index);
                                        } else {
                                          msgProvider.toast(
                                            msgText.addToCardValidation[
                                              config.language
                                            ],
                                            'center',
                                          );
                                          return false;
                                        }
                                      }}
                                      style={{
                                        width: (mobileW * 13) / 100,
                                        backgroundColor: Colors.white_color,
                                        borderColor: Colors.removecolor,
                                        borderRadius: (mobileW * 4) / 100,
                                        borderWidth: 1.5,
                                        paddingVertical: (mobileW * 0.6) / 100,
                                      }}>
                                      <Text
                                        style={{
                                          fontSize: (mobileW * 2.5) / 100,
                                          fontFamily: Font.Fontregular,
                                          color: Colors.removecolor,
                                          textAlign: 'center',
                                        }}>
                                        {Lang_chg.Add[config.language]}{' '}
                                      </Text>
                                    </TouchableOpacity>
                                  )}
                                </View>
                              </View>
                            </View>
                          </View>
                        );
                      }}
                    />
                  </View>
                ) : (
                  <Nodata_foundimage />
                )}
              </View>
            </TouchableOpacity>
          </ScrollView>

          {/* View Cart Btn  */}
          {this.state.dining_arr.status == 1 && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                this.view_cart();
              }}
              style={{
                position: 'absolute',
                bottom: 9,
                flexDirection: 'row',
                width: (mobileW * 83) / 100,
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
                }}>
                {Lang_chg.Viewcart[config.language]}
              </Text>
            </TouchableOpacity>
          )}
          {/* View Cart Btn  */}
        </TouchableOpacity>
      </View>
    );
  }
}
