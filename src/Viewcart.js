import {
  View,
  Image,
  StatusBar,
  Text,
  FlatList,
  Modal,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Keyboard,
  StyleSheet,
  TextInput,
} from 'react-native';
import React, {Component, useRef} from 'react';
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
  Currentltlg,
  notification,
} from './Provider/utilslib/Utils';
import DashedLine from 'react-native-dashed-line';
import {WebView} from 'react-native-webview';
// const tipRef = useRef();
export default class Viewcart extends Component {
  constructor(props) {
    super(props);
    {
      this.state = {
        modalVisible: false,
        modalVisible2: false,
        num_arr: [
          {
            id: 1,
            image: localimag.dishtwo,
            title: Lang_chg.Mulberry[config.language],
            Staus: 0,
            diet: 'Calories : 324',
            time: 'Cook : 30min',
            text: Lang_chg.Remove[config.language],
            title1: Lang_chg.fastfood[config.language],
          },
          {
            id: 2,
            image: localimag.dishfour,
            title: Lang_chg.veg[config.language],
            Staus: 1,
            diet: 'Calories : 235',
            time: 'Cook : 45min',
            text: Lang_chg.Add[config.language],
            title1: Lang_chg.Dessert[config.language],
          },
          {
            id: 3,
            image: localimag.dishfive,
            title: Lang_chg.Rasberry[config.language],
            Staus: 1,
            diet: 'Calories : 567',
            time: 'Cook : 24min',
            text: Lang_chg.Add[config.language],
            title1: Lang_chg.fastfood[config.language],
          },
        ],
        num_arr: '',
        cart_arr: '',
        food_arr: [
          {id: 0, image: localimag.foodcatone, text: 0.0, status: false},
          {id: 1, image: localimag.foodcatone, text: 1, status: true},
          {id: 2, image: localimag.foodcattwo, text: 1.5, status: false},
          {id: 3, image: localimag.foodcatthree, text: 2, status: false},
          {id: 4, image: localimag.foodcatfour, text: 3, status: false},
          {id: 5, image: localimag.foodcatthree, text: 5, status: false},
        ],

        // For Getting Current Date Time only
        date_Time: '',

        tipAmountShow: '0.0',

        tip_amount_selected: 0,
        address: '',
        tip_amount: '',
        // tip_amount: 10,
        //25-07-22------------------------
        add_to_cart_arr: 'NA',
        amountVisible: 0,
        tip_amount_plus_fee: 0,

        // address: '',
        //26-07-22------------------------
        user_id: '',
        university_id: '',
        // dining_halls_id: this.props.route.params.dining_halls_id,
        dining_halls_id: '',
        dining_facility_id: '',
        webviewshow: false,
        // webviewshow:true,
        to_pay: 0,
        // txn_id: 0,
        txn_id: 123456,
        latitude: 0,
        longitude: 0,
        driver_status: false,
        // driver_status: '',
        blank: true,
        estimated_tax_amount: 10,
        estimated_tax_per: 0,
        total: 0,

        serviceFee: 0,
        percentageAmount: 0,
        total_customer_amount: 0,
        payment_status: 0,
      };
    }
  }
  componentDidMount = () => {
    // Format date as "YYYY-MM-DD"

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    // Format time as "HH:mm:ss"
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    const dateTime = formattedDate + ' ' + formattedTime;

    console.log('Date time:', dateTime);

    this.setState({date_Time: dateTime});

    if (this.props.route.params.address != undefined) {
      let address = this.props.route.params.address;
      let latitude = this.props.route.params.latitude;
      let longitude = this.props.route.params.longitude;
      this.setState({
        latitude: latitude,
        longitude: longitude,
        address: address,
      });
    }

    if (this.props.route.params.dining_halls_id != undefined) {
      let dining_halls_id = this.props.route.params.dining_halls_id;
      this.setState({
        dining_halls_id: dining_halls_id,
      });
    }
    this.getUserDetail();

    this.props.navigation.addListener('focus', () => {
      this.setState({
        txn_id: Math.floor(1000000000 + Math.random() * 9000000000),
      });
      // this.getUserDetail();
      if (this.props.route.params != undefined) {
        let address = this.props.route.params.address;
        let latitude = this.props.route.params.latitude;
        let longitude = this.props.route.params.longitude;
        this.setState({
          latitude: latitude,
          longitude: longitude,
          address: address,
        });
      }
    });
  };

  //--------------------------------getcurrentlatlogn
  getcurrentlatlogn = async () => {
    let data = await Currentltlg.requestLocation();

    let latitude = data.coords.latitude;

    let longitude = data.coords.longitude;

    this.setState({latitude: latitude, longitude: longitude});
  };

  // getUserIdDetail = async () => {
  getUserDetail = async () => {
    let userdata = await localStorage.getItemObject('user_arr');
    consolepro.consolelog('userdata', userdata);
    this.setState({
      user_id: userdata.user_id,
      university_id: userdata.university_id,
    });

    let jsonValue = await localStorage.getItemObject('add_to_cart');

    //   jsonValue= jsonValue != null ? JSON.parse(jsonValue) : null;
    // jsonValue= jsonValue != null ? JSON.parse(jsonValue) : [];
    jsonValue = jsonValue != null ? JSON.parse(jsonValue) : 'NA';
    consolepro.consolelog('jsonValue', jsonValue);
    this.setState({
      // num_arr:jsonValue,
      //   cart_arr:jsonValue,
      add_to_cart_arr: jsonValue,
    });
    consolepro.consolelog('this.state.cart_arr', this.state.cart_arr);

    this.get_amountVisible();
  };

  getUserDetail_Old = async () => {
    //   let jsonValue = await localStorage.getItemObject('cart_arr');
    let jsonValue = await localStorage.getItemObject('add_to_cart');

    //   jsonValue= jsonValue != null ? JSON.parse(jsonValue) : null;
    jsonValue = jsonValue != null ? JSON.parse(jsonValue) : [];
    consolepro.consolelog('jsonValue', jsonValue);
    this.setState({
      // num_arr:jsonValue,
      //   cart_arr:jsonValue,
      add_to_cart_arr: jsonValue,
    });
    consolepro.consolelog('this.state.cart_arr', this.state.cart_arr);
  };

  remove_item = async (item, index) => {
    consolepro.consolelog('this.state.cart_arr 1', this.state.cart_arr);
    consolepro.consolelog(item);

    // let data2 = this.state.num_arr;

    // data2[index].status = false;

    this.setState({
      cart_arr: this.state.cart_arr.filter(cart_arr => cart_arr !== item),
      // num_arr: data2,
    });

    const jsonValue = JSON.stringify(this.state.cart_arr);
    await localStorage.setItemObject('add_to_cart', jsonValue);
    consolepro.consolelog('this.state.cart_arr 2', this.state.cart_arr);
  };

  add_to_cart = async (item, index) => {
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

  //25-07-2022---------------------------------------------------------

  //----------delete product item--------
  deleteProductItem = (item, index) => {
    consolepro.consolelog('I am in delete product item');
    consolepro.consolelog({item, index});
    //-------------------remove item---------------------
    var add_to_cart_arr = this.state.add_to_cart_arr;
    consolepro.consolelog('now in cart item remove');

    var add_to_cart_arr_length = add_to_cart_arr.length;
    consolepro.consolelog('add_to_cart_arr_length=', add_to_cart_arr_length);

    if (add_to_cart_arr_length == 1) {
      consolepro.consolelog('i am length 1');
      localStorage.removeItem('add_to_cart');
      this.setState({
        add_to_cart_arr: 'NA',
      });
    } else {
      add_to_cart_arr.splice(index, 1);
      localStorage.setItemObject(
        'add_to_cart',
        JSON.stringify(add_to_cart_arr),
      );
      this.setState({add_to_cart_arr: add_to_cart_arr});
    }
    // this.setTotalCount();
  };

  //--------function for edit(Set) product quantity-------//
  setProductQuantity = async (item, index, quantity) => {
    consolepro.consolelog('I am in set product quantity');
    consolepro.consolelog({item, index, quantity});
    if (quantity > 0) {
      let data1 = this.state.add_to_cart_arr;
      data1[index].quantity = quantity;
      consolepro.consolelog('data1', data1);
      this.setState({
        add_to_cart_arr: data1,
      });
      await localStorage.setItemObject(
        'add_to_cart',
        JSON.stringify(this.state.add_to_cart_arr),
      );
    } else {
      msgProvider.toast(msgText.quantityMsg[config.language], 'center');
    }
    // this.setTotalCount()
  };

  //-----------------------commission view cart
  get_amountVisible = async () => {
    let order_type = 0;
    let url =
      config.baseURL +
      'get_commission_for_order.php?user_id=' +
      this.state.user_id +
      '&university_id=' +
      this.state.university_id +
      '&order_type=' +
      order_type;
    consolepro.consolelog('url', url);
    apifuntion
      .getApi(url, 0)
      .then(obj => {
        consolepro.consolelog('obj', obj);
        if (obj.success == 'true') {
          this.setState({payment_status: obj.payment_status});

          // let amountVisible = obj.amountVisible;
          // let estimated_tax_per = obj.estimated_tax_per;
          // let estimated_tax_amount = amountVisible * estimated_tax_per / 100;
          // let total = (amountVisible + estimated_tax_amount);
          // let percentage_amount = obj.percentageAmount;

          // this.setState({
          //     percentageAmount:percentage_amount
          // })

          // if (this.state.tip_amount_selected == 'NA') {
          //     var to_pay = total;
          // }
          // else {
          //     var to_pay = (total + this.state.food_arr[this.state.tip_amount_selected].text);
          //     // consolepro.consolelog('this.state.food_arr', this.state.food_arr[this.state.tip_amount_selected].text)
          // }

          // amountVisible = (Math.round(amountVisible * 100) / 100).toFixed(2);
          // estimated_tax_amount = (Math.round(estimated_tax_amount * 100) / 100).toFixed(2);

          // // consolepro.consolelog({ total })
          // // consolepro.consolelog({ to_pay })

          // total = (Math.round(total * 100) / 100).toFixed(2);
          // to_pay = (Math.round(to_pay * 100) / 100).toFixed(2);

          // let serviceFee = (((to_pay*2.9)/100)+0.30).toFixed(2);
          //console.log("percentage_amount",percentage_amount);
          // serviceFee = (parseFloat(serviceFee) + parseFloat(percentage_amount)).toFixed(2);
          // // serviceFee = serviceFee.toFixed(2);
          //console.log("total Service fee ",serviceFee);

          // total = (parseFloat(to_pay) +  parseFloat(serviceFee)).toFixed(2);
          // to_pay = (parseFloat(to_pay) +  parseFloat(serviceFee)).toFixed(2);

          //console.log("serviceFee",serviceFee);
          // this.setState({serviceFee:serviceFee})
          //console.log("to_pay--->",to_pay);

          // consolepro.consolelog({ estimated_tax_amount })
          // consolepro.consolelog({ total })

          // this.setState({
          //     amountVisible: amountVisible,
          //     tip_amount_plus_fee: amountVisible,
          //     driver_status: obj.driver_status,
          //     estimated_tax_amount: estimated_tax_amount,
          //     estimated_tax_per: estimated_tax_per,
          //     total: total,
          //     to_pay: to_pay,
          //     blank: false
          // });

          let amountVisible = obj.amountVisible;

          let estimated_tax_per = obj.estimated_tax_per;

          let estimated_tax_amount = (amountVisible * estimated_tax_per) / 100;

          let total = amountVisible + estimated_tax_amount;

          //console.log("total----->",total);

          let percentage_amount = obj.percentageAmount;

          this.setState({
            total_customer_amount: total,
            percentageAmount: percentage_amount,
          });

          if (this.state.tip_amount_selected == 'NA') {
            var to_pay = parseFloat(total).toFixed(2);
            //console.log('to_pay',to_pay);
          } else {
            var to_pay = parseFloat(
              total +
                parseInt(
                  this.state.food_arr[this.state.tip_amount_selected].text,
                ),
            ).toFixed(2);
            //console.log('total + tip ammount',to_pay);
          }

          amountVisible = (Math.round(amountVisible * 100) / 100).toFixed(2);
          estimated_tax_amount = (
            Math.round(estimated_tax_amount * 100) / 100
          ).toFixed(2);

          total = (Math.round(total * 100) / 100).toFixed(2);
          to_pay = (Math.round(to_pay * 100) / 100).toFixed(2);

          //console.log("to_pay",to_pay);

          let serviceFee = ((to_pay * 2.9) / 100 + 0.3).toFixed(2);

          //console.log("first serviceFee",serviceFee);
          //console.log("percentage_amount", parseFloat(percentage_amount).toFixed(2));
          serviceFee = (
            parseFloat(serviceFee) + parseFloat(percentage_amount)
          ).toFixed(2);

          this.setState({serviceFee: serviceFee});

          total = (parseFloat(to_pay) + parseFloat(serviceFee)).toFixed(2);

          to_pay = (parseFloat(to_pay) + parseFloat(serviceFee)).toFixed(2);

          //console.log("final to pay value ",to_pay);

          this.setState({
            amountVisible: amountVisible,
            tip_amount_plus_fee: amountVisible,
            driver_status: obj.driver_status,
            estimated_tax_amount: estimated_tax_amount,
            estimated_tax_per: estimated_tax_per,
            total: total,
            to_pay: to_pay,
            blank: false,
          });
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
        consolepro.consolelog('-------- error ------- ' + error);

        msgProvider.alert(
          msgTitle.internet[config.language],
          msgText.networkconnection[config.language],
          false,
        );
      });
  };

  CreateOrder = async () => {
    let url = config.baseURL + 'order_submit.php';
    consolepro.consolelog('url', url);

    var data = new FormData();

    data.append('user_id', this.state.user_id);
    data.append('university_id', this.state.university_id);
    data.append('dining_hall_id', this.state.dining_halls_id);
    data.append('transaction_datetime', this.state.date_Time);
    data.append('createtime', this.state.date_Time);
    data.append('updatetime', this.state.date_Time);
    data.append('dining_facility_id', this.state.dining_facility_id);
    data.append('location', this.state.address);
    this.state.tip_amount_selected == 'NA'
      ? data.append('tip_amount', this.state.tip_amount)
      : data.append(
          'tip_amount',
          this.state.food_arr[this.state.tip_amount_selected].text,
        );

    data.append('order_type', 0);
    data.append('estimated_tax_amount', this.state.estimated_tax_amount);

    data.append('latitude', this.state.latitude);
    data.append('longitude', this.state.longitude);
    data.append('transaction_id', this.state.txn_id);

    data.append('cart_arr', JSON.stringify(this.state.add_to_cart_arr));

    consolepro.consolelog('data', data);
    // return false;
    apifuntion
      .postApi(url, data)
      .then(obj => {
        consolepro.consolelog('obj', obj);
        if (obj.success == 'true') {
          consolepro.consolelog('obj.success', obj);

          var notification_arr = obj.notification_arr;
          consolepro.consolelog({notification_arr});
          consolepro.consolelog({notification_arr});
          if (notification_arr != 'NA') {
            consolepro.consolelog({notification_arr});
            notification.notification_arr(notification_arr);
          }

          localStorage.removeItem('add_to_cart');
          this.setState({
            add_to_cart_arr: 'NA',
          });

          //   localStorage.setItemString({'dining_halls_id':''});
          localStorage.removeItem('dining_halls_id');
          //   let tmp = localStorage.getItemObject('dining_halls_id');
          //   consolepro.consolelog(tmp);
          this.props.navigation.navigate('Paynow', {txn_id: this.state.txn_id});
          //   this.props.navigation.navigate('Paynow')
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
        consolepro.consolelog('-------- error ------- ' + error);

        msgProvider.alert(
          msgTitle.internet[config.language],
          msgText.networkconnection[config.language],
          false,
        );
      });
  };

  //--------------on navigation state change function ------------//
  _onNavigationStateChange(webViewState) {
    webViewState.canGoBack = false;
    if (webViewState.loading == false) {
      //console.log('webViewState', webViewState);
      //console.log(webViewState.url)
      var t = webViewState.url.split('/').pop().split('?')[0];
      if (typeof t != null) {
        var p = webViewState.url.split('?').pop().split('&');
        //console.log('file name', t);
        if (t == 'payment_success_final.php') {
          //console.log('parameter', p);
          var payment_id = 0;

          //console.log('p.length', p.length);
          for (var i = 0; i < p.length; i++) {
            var val = p[i].split('=');
            //console.log('val', val);
            // if (val[0] == 'order_id') {
            if (val[0] == 'payment_id') {
              payment_id = val[1];
            }
            this.setState({txn_id: payment_id});
          }
          //console.log('tax id will be ', this.state.txn_id);
          this.setState({webviewshow: false});
          setTimeout(() => {
            // this.add_money()
            this.CreateOrder();
          }, 300);
        } else if (t == 'payment_failed.php') {
          msgProvider.toast(Lang_chg.payment_failed[config.language], 'center');
          this.setState({webviewshow: false});
          return false;
        }
      }
    }
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: Colors.white_color}}>
        {/* //----------strip modal */}
        <Modal
          animationType="slide"
          // transparent
          visible={this.state.webviewshow}
          // visible={true}
          onRequestClose={() => {
            this.setState({webviewshow: false});
          }}>
          <SafeAreaView
            style={{flex: 0, backgroundColor: Colors.theme_color}}
          />
          <View
            style={{
              width: mobileW,
              // backgroundColor: Colors.theme_color,
              // backgroundColor: 'red',
              backgroundColor: Colors.theamColor,
              alignItems: 'center',
            }}>
            <View
              style={{
                backgroundColor: Colors.theme_color,
                height: (mobileH * 8) / 100,
                flexDirection: 'row',
                alignItems: 'center',
                width: '98%',
                justifyContent: 'space-between',
                // backgroundColor:'yellow',
              }}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  this.setState({webviewshow: false});
                }}
                style={{
                  width: (mobileW * 7) / 100,
                  height: (mobileW * 7) / 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: (mobileW * 4.5) / 100,
                }}>
                <Image
                  resizeMode="contain"
                  style={{
                    tintColor: '#fff',
                    // backgroundColor: 'red',
                    width: (mobileW * 8) / 100,
                    height: (mobileW * 8) / 100,
                    // transform: [config.textalign == 'right' ? {
                    //     scaleX: -1
                    // } : {
                    //     scaleX: 1
                    // }]
                  }}
                  source={localimag.back2}></Image>
              </TouchableOpacity>
              <View style={{alignItems: 'center', alignSelf: 'center'}}>
                <Text
                  style={{
                    fontSize: (mobileW * 5) / 100,
                    fontFamily: Font.FontRegular,
                    color: Colors.white_color,
                  }}>
                  {Lang_chg.payment_processing_txt[config.language]}
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  width: (mobileW * 7) / 100,
                  height: (mobileW * 7) / 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: (mobileW * 4.5) / 100,
                }}></TouchableOpacity>
            </View>
          </View>
          <View style={{flex: 1, backgroundColor: 'white'}}>
            <Text
              style={{
                alignSelf: 'center',
                color: 'red',
                textAlign: 'center',
                fontFamily: Font.FontBold,
                marginTop: 15,
                fontSize: (mobileW * 3) / 100,
              }}>
              {Lang_chg.payment_warning_txt[config.language]}
            </Text>
            {this.state.webviewshow == true && (
              <WebView
                source={{
                  uri:
                    config.baseURL +
                    'stripe_payment/payment_url.php?user_id=' +
                    this.state.user_id +
                    '&amount=' +
                    this.state.to_pay,
                }}
                onNavigationStateChange={this._onNavigationStateChange.bind(
                  this,
                )}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={false}
                containerStyle={{marginTop: 20, flex: 1}}
                textZoom={100}
              />
            )}
          </View>
        </Modal>

        <TouchableOpacity
          activeOpacity={1}
          style={{flex: 1}}
          onPress={() => {
            Keyboard.dismiss();
          }}>
          <SafeAreaView style={{backgroundColor: Colors.theamColor, flex: 0}} />
          {/* <StatusBar barStyle='light-content' backgroundColor={Colors.theamColor} hidden={false} translucent={false} /> */}

          {/* //==================================== Custom tip -----------------// */}

          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              this.setState({modalVisible: false});
            }}>
            <View
              style={{
                backgroundColor: '#00000080',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 20,
                marginTop: -50,
              }}>
              <View
                style={{
                  borderRadius: 20,
                  width: (mobileW * 80) / 100,
                  position: 'absolute',
                  alignSelf: 'center',
                }}>
                <View
                  style={{
                    backgroundColor: Colors.white_color,
                    borderRadius: (mobileW * 4) / 100,
                    width: '100%',
                    paddingVertical: (mobileW * 2) / 100,
                    paddingBottom: (mobileW * 7) / 100,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({modalVisible: false});
                    }}
                    style={{
                      alignSelf: 'flex-end',
                      width: '15%',
                      justifyContent: 'flex-end',
                    }}>
                    <Image
                      style={{
                        height: (mobileW * 8) / 100,
                        width: (mobileW * 8) / 100,
                        resizeMode: 'contain',
                      }}
                      source={localimag.wrong}></Image>
                  </TouchableOpacity>

                  <View
                    style={{
                      width: (mobileW * 80) / 100,
                      marginTop: (mobileW * -2) / 100,
                    }}>
                    <Image
                      style={{
                        height: (mobileW * 17) / 100,
                        width: (mobileW * 17) / 100,
                        resizeMode: 'contain',
                        alignSelf: 'center',
                      }}
                      source={localimag.modaldoller}></Image>
                  </View>
                  <View
                    style={{
                      alignItems: 'center',
                      flexDirection: 'row',
                      width: (mobileW * 70) / 100,
                      alignSelf: 'center',
                      marginBottom: (mobileW * 4) / 100,
                      borderBottomColor: Colors.bottomborder,
                      borderBottomWidth: 1,
                      paddingVertical: (mobileW * 2) / 100,
                    }}>
                    <Text
                      style={{
                        fontSize: (mobileW * 5) / 100,
                        color: Colors.textgrey,
                        textAlign: 'center',
                      }}>
                      $
                    </Text>

                    <TextInput
                      autoFocus={true}
                      selectionColor={Colors.textInputSelectionColor1}
                      onChangeText={txt => {
                        this.setState({tip_amount: txt, tipAmountShow: txt});
                      }}
                      value={this.state.tip_amount}
                      keyboardType="number-pad"
                      placeholderTextColor={Colors.white1}
                      maxLength={100}
                      style={{
                        width: '95%',
                        fontSize: (mobileW * 5) / 100,
                        color: Colors.textgrey,
                        fontFamily: Font.OutfitMedium,
                        textAlignVertical: 'center',
                      }}></TextInput>
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      let tip_amount = parseFloat(
                        this.state.tip_amount,
                      ).toFixed(2);

                      if (tip_amount.length <= 0) {
                        msgProvider.toast(
                          'Please enter tip ammount.',
                          'center',
                        );
                        return false;
                      }

                      if (tip_amount < 0) {
                        msgProvider.toast(
                          msgText.Tip_amount_must[config.language],
                          'center',
                        );
                        return false;
                      }

                      // let tmp = this.state.tip_amount
                      // // let tmp2 = this.state.amountVisible

                      // //23-08-22
                      // // let tmp4 = this.state.estimated_tax_amount
                      // let tmp2 = this.state.total

                      // // let tmp3 = parseInt(tmp) + parseInt(tmp2) + parseInt(tmp4)
                      // let tmp3 = parseInt(tmp) + parseInt(tmp2)

                      // tmp3 = (Math.round(tmp3 * 100) / 100).toFixed(2);

                      // consolepro.consolelog(tmp3)

                      // let to_pay = tmp3;
                      // let serviceFee = (((to_pay*2.9)/100)+0.30).toFixed(2);
                      //console.log("serviceFee",serviceFee);
                      // serviceFee = parseFloat(serviceFee)  + parseFloat(this.state.percentageAmount);
                      //console.log("serviceFee",serviceFee);
                      // serviceFee = serviceFee.toFixed(2);

                      // this.setState({serviceFee:serviceFee})
                      // this.setState({
                      //     modalVisible: false, tip_amount_plus_fee: tmp3,
                      //     to_pay: tmp3
                      // });

                      //console.log("Click---->");
                      this.setState({tipAmountShow: tip_amount});

                      let to_pay = parseFloat(
                        this.state.total_customer_amount,
                      ).toFixed(2);
                      //console.log("intial to pay amount",to_pay);

                      to_pay = (
                        parseFloat(to_pay) + parseFloat(tip_amount)
                      ).toFixed(2);

                      //console.log("total + tip amount",to_pay);

                      let serviceFee = ((to_pay * 2.9) / 100 + 0.3).toFixed(2);

                      //console.log("first serviceFee",serviceFee);

                      serviceFee = (
                        parseFloat(serviceFee) +
                        parseFloat(this.state.percentageAmount)
                      ).toFixed(2);
                      //console.log("this.state.percentageAmount",this.state.percentageAmount);
                      //console.log("serviceFee + percentage amount ",serviceFee);

                      to_pay = (
                        parseFloat(to_pay) + parseFloat(serviceFee)
                      ).toFixed(2);

                      //console.log("serviceFee",serviceFee);

                      this.setState({serviceFee: serviceFee});

                      //console.log("to_pay--->",to_pay);
                      let amount = to_pay;
                      this.setState({
                        modalVisible: false,
                        // tip_amount_selected: item.id,
                        // tip_amount: 0,
                        tip_amount_plus_fee: this.state.amountVisible,
                        to_pay: amount,
                      });

                      // if (this.state.tip_amount.length <= 0) {
                      //     msgProvider.toast("Please enter tip ammount.", 'center');
                      //     return false;
                      // }

                      // if (this.state.tip_amount==0) {
                      //     msgProvider.toast(msgText.Tip_amount_must[config.language], 'center');
                      //     return false;
                      // }

                      // let tmp = this.state.tip_amount
                      // let tmp2 = this.state.total
                      // let tmp3 = parseInt(tmp) + parseInt(tmp2)
                      // tmp3 = (Math.round(tmp3 * 100) / 100).toFixed(2);

                      // let to_pay = tmp3;

                      // let serviceFee = (((to_pay*2.9)/100)+0.30).toFixed(2);
                      // serviceFee = parseFloat(serviceFee)  + parseFloat(this.state.percentageAmount);
                      //console.log("serviceFee",serviceFee);
                      // serviceFee = serviceFee.toFixed(2);
                      // this.setState({serviceFee:serviceFee})

                      // let amount = parseFloat(to_pay) + (((to_pay*2.9)/100)+0.30);
                      // amount = parseFloat(amount).toFixed(2);

                      //console.log("amount",amount);

                      // this.setState({ modalVisible: false, tip_amount_plus_fee: amount, to_pay: amount })
                    }}
                    style={{
                      marginTop: (mobileW * 5) / 100,
                      flexDirection: 'row',
                      width: (mobileW * 70) / 100,
                      alignSelf: 'center',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: (mobileW * 1) / 100,
                      padding: (mobileW * 4) / 100,
                      backgroundColor: Colors.removecolor,
                    }}>
                    <Text
                      style={{
                        fontSize: (mobileW * 3.8) / 100,
                        color: Colors.white_color,
                        fontFamily: Font.Fontregular,
                        textAlign: 'center',
                        paddingLeft: 3.5,
                      }}>
                      {Lang_chg.paytip[config.language]}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <View
            style={{
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
                  marginLeft: (mobileW * 3) / 100,
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

          {this.state.blank == false &&
            this.state.driver_status == false &&
            this.state.add_to_cart_arr.length != 0 && (
              <Text
                style={{
                  alignSelf: 'center',
                  color: 'red',
                  textAlign: 'center',
                  fontFamily: Font.FontBold,
                  marginTop: (mobileW * 30) / 100,
                  fontSize: (mobileW * 5.5) / 100,
                }}>
                {Lang_chg.No_driver_available[config.language]}
              </Text>
            )}

          {this.state.blank == false &&
            this.state.driver_status == true &&
            this.state.add_to_cart_arr == 'NA' && (
              <View>
                <Image
                  borderRadius={10}
                  style={{
                    alignSelf: 'center',
                    width: (mobileW * 18) / 100,
                    height: (mobileW * 18) / 100,
                    marginTop: (mobileW * 20) / 100,
                  }}
                  // source={item.image}
                  source={localimag.shopping_cart_empty}
                />
                <Text
                  style={{
                    alignSelf: 'center',
                    // color: 'red',
                    color: Colors.textgrey,
                    textAlign: 'center',
                    fontFamily: Font.FontBold,
                    marginTop: (mobileW * 13) / 100,
                    fontSize: (mobileW * 5.5) / 100,
                  }}>
                  {Lang_chg.cartEmpty[config.language]}
                </Text>
              </View>
            )}

          {/* {(this.state.blank == false&& this.state.driver_status == true && this.state.add_to_cart_arr.length != 0) && */}
          {this.state.blank == false &&
            this.state.driver_status == true &&
            this.state.add_to_cart_arr != 'NA' && (
              <ScrollView
                keyboardDismissMode="interactive"
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}>
                <TouchableOpacity style={{flex: 1}} activeOpacity={1}>
                  {this.state.add_to_cart_arr != 'NA' &&
                    this.state.add_to_cart_arr.length != 0 && (
                      <>
                        <View
                          style={{
                            marginTop: (mobileW * 2) / 100,
                            paddingBottom: (mobileW * 2) / 100,
                          }}>
                          <FlatList
                            data={this.state.add_to_cart_arr}
                            contentContainerStyle={{
                              paddingBottom: (mobileW * 3) / 100,
                            }}
                            renderItem={({item, index}) => {
                              return (
                                <View
                                  style={{
                                    shadowColor: Colors.shadow_color,
                                    shadowOffset: {width: 2, height: 2},
                                    shadowOpacity: 0.2,
                                    elevation: 2,
                                    backgroundColor: '#F9F9F9',
                                    width: (mobileW * 93) / 100,
                                    alignSelf: 'center',
                                    paddingVertical: (mobileW * 1) / 100,
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
                                        width: (mobileW * 18) / 100,
                                        height: (mobileW * 18) / 100,
                                      }}
                                      source={{
                                        uri: config.img_url + item.item_image,
                                      }}></Image>
                                    <View
                                      style={{
                                        paddingLeft: (mobileW * 3) / 100,
                                      }}>
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          width: (mobileW * 69) / 100,
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
                                        <TouchableOpacity
                                          onPress={() => {
                                            this.deleteProductItem(item, index);
                                          }}>
                                          <Image
                                            borderRadius={4}
                                            style={{
                                              alignSelf: 'center',
                                              width: (mobileW * 4) / 100,
                                              height: (mobileW * 4) / 100,
                                            }}
                                            resizeMode="contain"
                                            source={localimag.delete}></Image>
                                        </TouchableOpacity>
                                      </View>

                                      <View
                                        style={{
                                          width: (mobileW * 69) / 100,
                                          flexDirection: 'row',
                                          alignSelf: 'center',
                                          justifyContent: 'flex-start',
                                          paddingVertical: (mobileW * 1) / 100,
                                        }}>
                                        <Text
                                          style={{
                                            fontSize: (mobileW * 3) / 100,
                                            fontFamily: Font.Fontregular,
                                            color: Colors.mediumgrey,
                                          }}>
                                          {item.description}
                                        </Text>
                                      </View>

                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          width: (mobileW * 69) / 100,
                                          alignSelf: 'center',
                                          justifyContent: 'space-between',
                                          alignItems: 'center',
                                        }}>
                                        <View style={{flexDirection: 'row'}}>
                                          <Image
                                            borderRadius={4}
                                            style={{
                                              alignSelf: 'center',
                                              width: (mobileW * 3.5) / 100,
                                              height: (mobileW * 3.5) / 100,
                                            }}
                                            resizeMode="contain"
                                            source={localimag.fireicon}></Image>
                                          <Text
                                            style={{
                                              fontSize: (mobileW * 3.3) / 100,
                                              fontFamily: Font.fontsemibold,
                                              color: Colors.removecolor,
                                              paddingLeft: (mobileW * 1) / 100,
                                            }}>
                                            {Lang_chg.Calories[config.language]}

                                            {item.calories}
                                          </Text>
                                        </View>

                                        <View
                                          style={{
                                            width: (mobileW * 15.6) / 100,
                                            flexDirection: 'row',
                                            borderColor: '#E9E9E9',
                                            borderWidth: 0.5,
                                            borderRadius: (mobileW * 3) / 100,
                                          }}>
                                          <TouchableOpacity
                                            onPress={() => {
                                              //  if(item.quantity != undefined && item.quantity  == 1)
                                              //  if(item.quantity  == 1)
                                              //  {
                                              //     //  item.quantity  = 1
                                              //      this.deleteProductItem(item,index)
                                              //  }
                                              if (item.quantity == undefined) {
                                                this.deleteProductItem(
                                                  item,
                                                  index,
                                                );

                                                // item.quantity  = 1
                                              } else if (item.quantity == 1) {
                                                // this.setProductQuantity(item, index, (parseInt(item.quantity) - 1))
                                                this.deleteProductItem(
                                                  item,
                                                  index,
                                                );
                                              } else {
                                                this.setProductQuantity(
                                                  item,
                                                  index,
                                                  parseInt(item.quantity) - 1,
                                                );
                                              }

                                              // this.setProductQuantity(item, index, 2)
                                            }}
                                            style={{
                                              width: (mobileW * 6) / 100,
                                              justifyContent: 'center',
                                              alignItems: 'center',
                                              borderTopLeftRadius:
                                                (mobileW * 3) / 100,
                                              backgroundColor:
                                                Colors.removecolor,
                                              borderBottomLeftRadius:
                                                (mobileW * 3) / 100,
                                            }}>
                                            <Text
                                              style={{
                                                fontSize: (mobileW * 3.5) / 100,
                                                color: Colors.white_color,
                                                textAlign: 'center',
                                                backgroundColor:
                                                  Colors.removecolor,
                                              }}>
                                              -
                                            </Text>
                                          </TouchableOpacity>
                                          <Text
                                            style={{
                                              fontSize: (mobileW * 3) / 100,
                                              fontFamily: Font.fontsemibold,
                                              color: Colors.removecolor,
                                              textAlign: 'center',
                                              paddingHorizontal: mobileW * 0.01,
                                            }}>
                                            {item.quantity > 1
                                              ? item.quantity
                                              : 1}
                                            {/* 1 */}
                                          </Text>
                                          <TouchableOpacity
                                            onPress={() => {
                                              if (item.quantity == undefined) {
                                                item.quantity = 1;
                                              }
                                              this.setProductQuantity(
                                                item,
                                                index,
                                                parseInt(item.quantity) + 1,
                                              );

                                              // this.setProductQuantity(item, index, 2)
                                            }}
                                            style={{
                                              width: (mobileW * 6) / 100,
                                              justifyContent: 'center',
                                              alignItems: 'center',
                                              borderTopRightRadius:
                                                (mobileW * 3) / 100,
                                              backgroundColor:
                                                Colors.removecolor,
                                              borderBottomRightRadius:
                                                (mobileW * 3) / 100,
                                            }}>
                                            <Text
                                              style={{
                                                fontSize: (mobileW * 3) / 100,
                                                color: Colors.white_color,
                                                textAlign: 'center',
                                                backgroundColor:
                                                  Colors.removecolor,
                                              }}>
                                              +
                                            </Text>
                                          </TouchableOpacity>
                                        </View>
                                      </View>
                                    </View>
                                  </View>
                                </View>
                              );
                            }}
                          />
                        </View>

                        <View
                          style={{
                            width: '90%',
                            alignItems: 'center',
                            flexDirection: 'row',
                            backgroundColor: Colors.white_color,
                            marginTop: (mobileW * 3) / 100,
                            alignSelf: 'center',
                            justifyContent: 'space-between',
                            paddingVertical: (mobileW * 1) / 100,
                          }}>
                          <Text
                            style={{
                              fontSize: (mobileW * 3.9) / 100,
                              color: Colors.light_grey,
                              fontFamily: Font.OutfitMedium,
                              textAlign: 'center',
                            }}>
                            {Lang_chg.Deliveryfeetext[config.language]}
                          </Text>
                          <Text
                            style={{
                              fontSize: (mobileW * 4) / 100,
                              color: Colors.removecolor,
                              fontFamily: Font.Semibold,
                              textAlign: 'center',
                            }}>
                            ${this.state.amountVisible}
                          </Text>
                        </View>
                        <DashedLine
                          style={{
                            marginTop: (mobileW * 0.8) / 100,
                            marginBottom: (mobileH * 1) / 100,
                            paddingHorizontal: (mobileW * 0.5) / 100,
                            width: (mobileW * 92.4) / 100,
                            alignSelf: 'center',
                          }}
                          dashColor={Colors.bottomborder}
                          gap={8}
                          dashThickness={0.6}
                          dashLength={8}
                        />
                        <View
                          style={{
                            width: '90%',
                            alignItems: 'center',
                            flexDirection: 'row',
                            backgroundColor: Colors.white_color,
                            marginTop: (mobileW * 2) / 100,
                            alignSelf: 'center',
                            justifyContent: 'space-between',
                            paddingVertical: (mobileW * 1) / 100,
                          }}>
                          <Text
                            style={{
                              fontSize: (mobileW * 3.9) / 100,
                              color: Colors.light_grey,
                              fontFamily: Font.OutfitMedium,
                              textAlign: 'center',
                            }}>
                            {Lang_chg.Estimatetaxtext[config.language]}
                          </Text>
                          <Text
                            style={{
                              fontSize: (mobileW * 4) / 100,
                              color: Colors.removecolor,
                              fontFamily: Font.Semibold,
                              textAlign: 'center',
                            }}>
                            ${this.state.estimated_tax_amount}
                          </Text>
                        </View>
                        <DashedLine
                          style={{
                            marginTop: (mobileW * 0.5) / 100,
                            marginBottom: (mobileH * 1) / 100,
                            paddingHorizontal: (mobileW * 0.5) / 100,
                            width: (mobileW * 92.4) / 100,
                            alignSelf: 'center',
                          }}
                          dashColor={Colors.bottomborder}
                          gap={8}
                          dashThickness={0.6}
                          dashLength={8}
                        />

                        <View
                          style={{
                            width: '90%',
                            alignItems: 'flex-start',
                            backgroundColor: Colors.white_color,
                            alignSelf: 'center',
                            marginTop: (mobileW * 3) / 100,
                          }}>
                          <Text
                            style={{
                              fontSize: (mobileW * 3.9) / 100,
                              color: Colors.light_grey,
                              fontFamily: Font.OutfitMedium,
                              textAlign: 'center',
                            }}>
                            {Lang_chg.choosetip[config.language]}
                          </Text>
                        </View>

                        <FlatList
                          data={this.state.food_arr}
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          renderItem={({item, index}) => {
                            return (
                              <View
                                style={{
                                  marginTop: (mobileW * 1) / 100,
                                  paddingVertical: (mobileW * 2) / 100,
                                  width: (mobileW * 17) / 100,
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  paddingLeft: (mobileW * 2) / 100,
                                }}>
                                {this.state.tip_amount_selected != index ? (
                                  <TouchableOpacity
                                    onPress={() => {
                                      // this.setState({tipAmountShow:item.text})
                                      // let to_pay = parseFloat(this.state.total) + parseFloat(item.text);
                                      // to_pay = (Math.round(to_pay * 100) / 100).toFixed(2);

                                      // let serviceFee = (((to_pay*2.9)/100)+0.30).toFixed(2);
                                      // serviceFee = parseFloat(serviceFee)  + parseFloat(this.state.percentageAmount);
                                      //console.log("serviceFee",serviceFee);
                                      // serviceFee = serviceFee.toFixed(2);
                                      // this.setState({serviceFee:serviceFee})

                                      // let amount = parseFloat(to_pay) + (((to_pay*2.9)/100)+0.30);
                                      // amount = parseFloat(amount).toFixed(2);

                                      // this.setState({
                                      //     tip_amount_selected: item.id,
                                      //     tip_amount: 0,
                                      //     tip_amount_plus_fee: this.state.amountVisible,
                                      //     to_pay: amount
                                      // })

                                      //console.log("Click---->");
                                      this.setState({tipAmountShow: item.text});

                                      let to_pay = parseFloat(
                                        this.state.total_customer_amount,
                                      ).toFixed(2);
                                      //console.log("intial to pay amount",to_pay);

                                      let tip_amount = parseFloat(
                                        item.text,
                                      ).toFixed(2);

                                      to_pay = (
                                        parseFloat(to_pay) +
                                        parseFloat(tip_amount)
                                      ).toFixed(2);

                                      //console.log("total + tip amount",to_pay);

                                      let serviceFee = (
                                        (to_pay * 2.9) / 100 +
                                        0.3
                                      ).toFixed(2);

                                      //console.log("first serviceFee",serviceFee);

                                      serviceFee = (
                                        parseFloat(serviceFee) +
                                        parseFloat(this.state.percentageAmount)
                                      ).toFixed(2);
                                      //console.log("this.state.percentageAmount",this.state.percentageAmount);
                                      //console.log("serviceFee + percentage amount ",serviceFee);

                                      to_pay = (
                                        parseFloat(to_pay) +
                                        parseFloat(serviceFee)
                                      ).toFixed(2);

                                      //console.log("serviceFee",serviceFee);

                                      this.setState({serviceFee: serviceFee});

                                      //console.log("to_pay--->",to_pay);
                                      let amount = to_pay;
                                      this.setState({
                                        tip_amount_selected: item.id,
                                        tip_amount: 0,
                                        tip_amount_plus_fee:
                                          this.state.amountVisible,
                                        to_pay: amount,
                                      });
                                    }}
                                    style={{
                                      width: (mobileW * 10) / 100,
                                      backgroundColor: '#fff',
                                      borderRadius: (mobileW * 10) / 100,
                                      paddingVertical: (mobileW * 1) / 100,
                                      alignItems: 'center',
                                      shadowColor: Colors.shadowbuy,
                                      shadowOffset: {width: 1, height: 1},
                                      shadowOpacity: 0.5,
                                      shadowRadius: 2,
                                      elevation: 2,
                                    }}>
                                    <Text
                                      style={{
                                        fontSize: (mobileW * 3.4) / 100,
                                        fontFamily: Font.FontRegular,
                                        color: Colors.removecolor,
                                        textAlign: 'center',
                                      }}>
                                      {'$' + item.text}
                                    </Text>
                                  </TouchableOpacity>
                                ) : (
                                  <TouchableOpacity
                                    onPress={() => {
                                      //console.log("tip");

                                      let to_pay = parseFloat(
                                        this.state.total_customer_amount,
                                      ).toFixed(2);
                                      //console.log("intial to pay amount",to_pay);

                                      let tip_amount = 0;

                                      to_pay = (
                                        parseFloat(to_pay) +
                                        parseFloat(tip_amount)
                                      ).toFixed(2);

                                      //console.log("total + tip amount",to_pay);

                                      let serviceFee = (
                                        (to_pay * 2.9) / 100 +
                                        0.3
                                      ).toFixed(2);

                                      //console.log("first serviceFee",serviceFee);

                                      serviceFee = (
                                        parseFloat(serviceFee) +
                                        parseFloat(this.state.percentageAmount)
                                      ).toFixed(2);
                                      to_pay = (
                                        parseFloat(to_pay) +
                                        parseFloat(serviceFee)
                                      ).toFixed(2);
                                      //console.log("serviceFee",serviceFee);

                                      this.setState({serviceFee: serviceFee});

                                      this.setState({
                                        tip_amount_selected: 'NA',
                                        to_pay: this.state.total,
                                      });
                                    }}
                                    style={{
                                      width: (mobileW * 10) / 100,
                                      backgroundColor: Colors.removecolor,
                                      borderRadius: (mobileW * 10) / 100,
                                      paddingVertical: (mobileW * 1) / 100,
                                      alignItems: 'center',
                                      shadowColor: Colors.shadowbuy,
                                      shadowOffset: {width: 1, height: 1},
                                      shadowOpacity: 0.5,
                                      shadowRadius: 2,
                                      elevation: 2,
                                      borderColor: Colors.white1,
                                      borderWidth: 1,
                                    }}>
                                    <Text
                                      style={{
                                        fontSize: (mobileW * 3.4) / 100,
                                        fontFamily: Font.OutfitMedium,
                                        color: Colors.white_color,
                                        textAlign: 'center',
                                      }}>
                                      {'$' + item.text}
                                    </Text>
                                  </TouchableOpacity>
                                )}
                              </View>
                            );
                          }}
                        />

                        <TouchableOpacity
                          onPress={() => {
                            this.setState({
                              tip_amount_selected: 'NA',
                              modalVisible: true,
                            });
                          }}
                          style={{
                            width: (mobileW * 20) / 100,
                            backgroundColor:
                              this.state.tip_amount != 0
                                ? Colors.removecolor
                                : '#fff',
                            borderRadius: (mobileW * 10) / 100,
                            paddingVertical: (mobileW * 2) / 100,
                            alignItems: 'center',
                            marginLeft: (mobileW * 4) / 100,
                            shadowColor: Colors.shadowbuy,
                            shadowOffset: {width: 1, height: 1},
                            shadowOpacity: 0.5,
                            shadowRadius: 2,
                            elevation: 2,
                          }}>
                          <Text
                            style={{
                              fontSize: (mobileW * 3.4) / 100,
                              fontFamily: Font.OutfitMedium,
                              color:
                                this.state.tip_amount != 0
                                  ? Colors.white_color
                                  : Colors.removecolor,
                              textAlign: 'center',
                            }}>
                            {Lang_chg.custom[config.language]}
                          </Text>
                        </TouchableOpacity>

                        {/* <View style={{ width: '90%', alignItems: 'center', flexDirection: 'row', backgroundColor: Colors.white_color, marginTop: mobileW * 3 / 100, alignSelf: 'center', justifyContent: 'space-between', paddingVertical: mobileW * 1 / 100, }}>
                                            <Text style={{ fontSize: mobileW * 3.9 / 100, color: Colors.light_grey,
                                             fontFamily: Font.OutfitMedium, textAlign: 'center' }}>{Lang_chg.TipAmountText[config.language]}</Text>
                                            <Text style={{ fontSize: mobileW * 4 / 100, color: Colors.removecolor, fontFamily: Font.Semibold, textAlign: 'center' }}>
                                                ${this.state.tipAmountShow}
                                            </Text>
                                        </View> */}
                        <DashedLine
                          style={{
                            marginTop: (mobileW * 0.8) / 100,
                            marginBottom: (mobileH * 1) / 100,
                            paddingHorizontal: (mobileW * 0.5) / 100,
                            width: (mobileW * 92.4) / 100,
                            alignSelf: 'center',
                          }}
                          dashColor={Colors.bottomborder}
                          gap={8}
                          dashThickness={0.6}
                          dashLength={8}
                        />

                        <View
                          style={{
                            width: '90%',
                            alignItems: 'center',
                            flexDirection: 'row',
                            backgroundColor: Colors.white_color,
                            marginTop: (mobileW * 2) / 100,
                            alignSelf: 'center',
                            justifyContent: 'space-between',
                            paddingVertical: (mobileW * 1) / 100,
                          }}>
                          <Text
                            style={{
                              fontSize: (mobileW * 3.9) / 100,
                              color: Colors.light_grey,
                              fontFamily: Font.OutfitMedium,
                              textAlign: 'center',
                            }}>
                            {Lang_chg.serviceFeeText[config.language]}
                          </Text>
                          <Text
                            style={{
                              fontSize: (mobileW * 4) / 100,
                              color: Colors.removecolor,
                              fontFamily: Font.Semibold,
                              textAlign: 'center',
                            }}>
                            ${this.state.serviceFee}
                          </Text>
                        </View>
                        {/* <DashedLine style={{ marginTop: mobileH * 0.8 / 100, marginBottom: mobileH * 1 / 100, paddingHorizontal: mobileW * 0.5 / 100, width: mobileW * 92.4 / 100, alignSelf: 'center' }} dashColor={Colors.bottomborder} gap={8} dashThickness={0.6} dashLength={8} /> */}

                        {/* <View style={{ width: '90%', alignItems: 'center', flexDirection: 'row', backgroundColor: Colors.white_color, marginTop: mobileW * 3 / 100, alignSelf: 'center', justifyContent: 'space-between', paddingVertical: mobileW * 1 / 100, }}>
                                            <Text style={{ fontSize: mobileW * 3.9 / 100, color: Colors.light_grey, fontFamily: Font.OutfitMedium, textAlign: 'center' }}>{Lang_chg.total_Payable_amount[config.language]}</Text>
                                            <Text style={{ fontSize: mobileW * 4 / 100, color: Colors.removecolor, fontFamily: Font.Semibold, textAlign: 'center' }}>
                                                ${this.state.to_pay}
                                            </Text>
                                        </View> */}
                        <DashedLine
                          style={{
                            marginTop: (mobileW * 0.2) / 100,
                            marginBottom: (mobileH * 1) / 100,
                            paddingHorizontal: (mobileW * 0.5) / 100,
                            width: (mobileW * 92.4) / 100,
                            alignSelf: 'center',
                          }}
                          dashColor={Colors.bottomborder}
                          gap={8}
                          dashThickness={0.6}
                          dashLength={8}
                        />

                        <TouchableOpacity
                          onPress={() => {
                            this.props.navigation.navigate('Location', {
                              order_type: 0,
                            });
                          }}
                          style={{
                            flexDirection: 'row',
                            width: (mobileW * 92) / 100,
                            alignSelf: 'center',
                            justifyContent: 'center',
                            marginTop: (mobileW * 2) / 100,
                            borderBottomColor: Colors.bottomborder,
                            borderBottomWidth: 1,
                            paddingVertical: (mobileW * 2) / 100,
                          }}>
                          <Image
                            style={{
                              height: (mobileW * 4.9) / 100,
                              width: (mobileW * 4.9) / 100,
                              resizeMode: 'contain',
                              alignSelf: 'center',
                            }}
                            source={localimag.location}></Image>
                          <View
                            style={{
                              flexDirection: 'row',
                              width: (mobileW * 87) / 100,
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginLeft: (mobileW * 1) / 100,
                            }}>
                            <Text
                              style={{
                                fontSize: (mobileW * 3.8) / 100,
                                fontFamily: Font.OutfitMedium,
                                color: Colors.grey,
                                textAlign: 'center',
                              }}>
                              {this.state.address == '' ||
                              this.state.address == undefined
                                ? Lang_chg.location[config.language]
                                : this.state.address}
                            </Text>
                            <Image
                              style={{
                                height: (mobileW * 4) / 100,
                                width: (mobileW * 4) / 100,
                                resizeMode: 'contain',
                              }}
                              source={localimag.arrowleft}></Image>
                          </View>
                        </TouchableOpacity>

                        <Text
                          style={{
                            fontSize: (mobileW * 4) / 100,
                            marginTop: (mobileW * 6) / 100,
                            color: 'red',
                            fontFamily: Font.OutfitMedium,
                            textAlign: 'center',
                          }}>
                          The Udliverer will use their unlimited meal swipe to
                          pickup and delivery your order.
                        </Text>
                        {/* {
                                                        (this.state.payment_status==1) && */}
                        <TouchableOpacity
                          onPress={() => {
                            if (
                              this.state.address == '' ||
                              this.state.address == undefined
                            ) {
                              msgProvider.toast(
                                msgText.enterDeliveryAddress2[config.language],
                                'center',
                              );
                              return false;
                            }

                            if (this.state.payment_status == 1) {
                              //console.log(" inside if");
                              setTimeout(() => {
                                this.setState({webviewshow: true});
                              }, 300);
                            } else {
                              //console.log(" inside else");
                              this.CreateOrder();
                            }
                          }}
                          style={{
                            marginTop: (mobileW * 25) / 100,
                            flexDirection: 'row',
                            width: (mobileW * 90) / 100,
                            alignSelf: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: (mobileW * 1) / 100,
                            padding: (mobileW * 4) / 100,
                            backgroundColor: Colors.removecolor,
                          }}>
                          {this.state.payment_status == 1 ? (
                            <>
                              {this.state.tip_amount_selected == 'NA' ? (
                                <Text
                                  style={{
                                    fontSize: (mobileW * 4.3) / 100,
                                    color: Colors.white_color,
                                    fontFamily: Font.OutfitMedium,
                                    textAlign: 'center',
                                  }}>
                                  {Lang_chg.paynow[config.language]}
                                  {this.state.to_pay}
                                  {Lang_chg.close_bracket[config.language]}
                                </Text>
                              ) : (
                                <Text
                                  style={{
                                    fontSize: (mobileW * 4.3) / 100,
                                    color: Colors.white_color,
                                    fontFamily: Font.OutfitMedium,
                                    textAlign: 'center',
                                  }}>
                                  {Lang_chg.paynow[config.language]}
                                  {this.state.to_pay}
                                  {Lang_chg.close_bracket[config.language]}
                                </Text>
                              )}
                            </>
                          ) : (
                            <>
                              <Text
                                style={{
                                  fontSize: (mobileW * 4.3) / 100,
                                  color: Colors.white_color,
                                  fontFamily: Font.OutfitMedium,
                                  textAlign: 'center',
                                }}>
                                {Lang_chg.Continue[config.language]}
                              </Text>
                            </>
                          )}
                        </TouchableOpacity>
                        {/* } */}
                      </>
                    )}
                </TouchableOpacity>
              </ScrollView>
            )}
        </TouchableOpacity>
      </View>
    );
  }
}
