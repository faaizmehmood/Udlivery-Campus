import { Alert, ToastAndroid, I18nManager, Platform } from 'react-native';
import { localStorage } from './localStorageProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from './configProvider';

global.language_key = 1;
class Language_provider {
  language_get = async () => {
    var item = await AsyncStorage.getItem('language');
    //console.log('check launguage option', item)
    if (item != null) {
      //console.log('kya bat h vikas bhai', config.language)
      config.language = item;
    }
    //console.log('language_key123', config.language)
  };

  language_set = value => {
    config.language = value;
    localStorage.setItemObject('language', value);
  };

  // txt_logout=['Logout']
  // txt_terms_and_condition=['Terms & Condition']

  // Udlivery app----------------------------------------------------------------

  // Welcome Screen------------------------------------------------------------

  txt_welcome = ['Welcome'];
  txt_1 = ['Join our community of orderers and '];
  txt_2 = ['Udliverers'];
  txt_button = ['Next'];

  // Setp_1-------------------------------------------------------------------

  Step_txt = ['Step 1 of 3'];
  Find_txt = ['Find Your University'];
  By_txt = ['By continuing you accept our'];
  And_txt = ['and'];
  Term_txt = ['Terms & Conditions'];
  Privacy_txt = ['Privacy Policy'];
  Step_1_B = ['Continue'];

  // Setp_2-------------------------------------------------------------------

  Step2_txt = ['Step 2 of 3'];
  Use_txt = ['What is your main purpose of use ?'];
  Order_txt = ['ORDER'];
  Deliver_txt = ['DELIVER'];

  // Login page------------------------------------------------------------------

  Login_txt = ['Login your Account'];
  Login = ['Login'];

  //Signup Page-------------------------------------------------------------
  Step3_txt = ['Step 3 of 3'];
  Creat_txt = ['Create your Account '];
  Name_txt = ['Full Name'];
  FirstName = ['First Name'];
  LastName = ['Last Name'];
  Mobile_txt = ['Mobile Number'];
  Birth_txt = ['Date of Birth'];
  Expiry_txt = ['Expiry Date'];
  Expiry_txt_CreditCard = ['Expiry Date (MM / YYYY)'];
  Email_txt = ['Email'];
  Password_txt = ['Password'];
  Confirm_txt = ['Confirm New Password'];
  Credit_txt = ['Bank Name or Credit Union'];
  Bankaddress_txt = ['Enter Bank Address'];
  Address_txt = ['Enter Your Address'];
  Bankaddresstwo_txt = ['Enter Bank Address Line 2'];
  City_txt = ['City'];
  State_txt = ['State'];
  Zip_txt = ['Zip Code'];
  Bankaccount_txt = ['Bank Account No.'];
  Routing_txt = ['Routing No.'];
  SSN_txt = ['SSN, EIN or Tax ID'];
  Photofront_txt = ['Photo ID Front Photo'];
  StudentIDCardFront = ['Student ID Card (Front)'];
  StudentIDCardBack = ['Student ID Card (Back)'];
  Photoback_txt = ['Photo ID Back Photo'];
  Additional_txt = ['Additional Document (ID,Address Proof)'];
  AdditionalText = ['Upload front only (license, State Id, etc )'];
  Addbank_txt = ['Add Bank'];
  Update_bank_txt = ['Update'];
  // txt_pick=['Pickup From']
  // txt_add=['934 Colin gateway Suite 973']
  // txt_code=['+54']
  // txt_home=['Home']
  // Editprofile=['Edit Profile']
  // settings=['Settings']
  // inbox=['Inbox']
  // wallet=['My Wallet']
  // booking=['My Bookings']

  //----orderHistory name--\\
  Orderhistory = ['Order History'];
  Backyard = ['Backyard Bowls'];
  Chop = ['Chop & Hops'];
  eatmore = ['Eatmore Fried Food'];
  richtable = ['Rich Table'];
  food = ['Food Dots'];
  breaklunch = ['Break,Lunch'];
  Freshrestau = ['Fresh Restau'];
  Delivery = ['Delivered'];
  accepted = ['Accepted'];
  Dining = ['Dining Hall'];
  Diningf = ['Dining Facility'];
  Dining_2 = [' (Dining Hall)'];
  Diningf_2 = [' (Dining Facility)'];
  Orderid = ['Order ID : #7687589978'];
  Order_id = ['Order ID: '];
  Transactionid = ['Transaction ID: '];
  search = ['Search'];
  Ordercreted = ['Order Created'];
  Edit_bank = ['Edit Bank Details'];

  //-------Home -----//
  Home = ['Home'];
  breakfast = ['Breakfast'];
  lunch = ['Lunch,Dinner'];
  open = ['Opened'];
  closed = ['Closed'];
  Hometext = ['UNIVERSITY OF'];
  Hometexttwo = ['DELAWARE DINING'];
  Homesearch = ['Search Dining/Facility'];
  Dininghall = ['Dining Halls'];
  View = ['View all'];
  // Diningfacility = ['Dining Facillities']
  Diningfacility = ['Dining Facilities'];
  Blazingbean = ['Blazing Bean'];
  Eggslut = ['Egg Slut'];

  //-----Notification---/
  Anna = ['Anna Lain have taken your parcel'];
  your = ['Your parcel is successfully delivered'];
  Caleb = ['Caleb Klein Commented on your answer'];
  benjamin = ['Benjamin Smith'];
  william = ['William Deo'];
  Calebklein = ['Caleb Klein'];
  Drake = ['Drake Sawn'];
  Cherry = ['Cherry Hall'];
  Bikky = ['Bikky Roi'];
  Notification = ['Notifications'];
  clear = ['Clear'];

  //------Detail----
  Detail = ['Details'];
  all = ['All'];
  fastfood = ['Fast food'];
  chinesefood = ['Chinese food'];
  Mulberry = ['Mulberry Pizzas by Josh'];
  veg = ['Veg Chawmein'];
  Rasberry = ['Rasberry And White Chocolate'];
  Remove = ['Remove'];
  Add = ['Add'];
  foodcategorie = ['Food Categories'];
  Viewcart = ['View Cart'];
  paytip = ['Pay tip amount'];
  TipAmountText = ['Tip'];
  serviceFeeTextNew = ['Service Fee'];
  serviceFeeText = ['Service Fees'];
  Deliverytaxtext = ['Delivery tax'];
  Estimatetaxtext = ['Estimated Tax'];
  Deliveryfeetext = ['Delivery Fee'];
  Deliveryfee = ['Delivery fee will be applied'];
  estimated_tax_amount = ['Estimated tax amount '];
  estimated_tax_percent_1 = ['Estimated tax ('];
  estimated_tax_percent_2 = ['%) '];
  total_Payable_amount = ['Total Payable Amount'];
  choosetip = ['Choose tip amount'];
  custom = ['Custom tip'];
  // location = ['Choose Delivery Location']
  // paynow = ['Pay Now ($4.7)']
  paynow = ['Pay Now ($ '];
  close_bracket = [')'];
  Dessert = ['Dessert'];

  //-----PAY nOW--
  Thanks = ['Thank You'];
  // Succefully = ['You Successfully paid your delivery']
  Succefully = ['You successfully paid your delivery'];
  feed = ['fee amount'];
  ok = ['Ok'];

  //-----Profile---
  profile = ['Profile'];
  charlotte = ['Charlotte Smith'];
  charlottemail = ['charlottesmith@gmail.com'];
  Harvar = ['Harvard University'];
  Editprofile = ['Edit Profile'];
  Becomeudelivery = ['Become a Udliverer'];
  Diningfacilities = ['Dining Facilities & Halls '];

  //----pending----
  orderID = ['Order ID'];
  ID = ['#978987676765'];
  Location = ['Location'];
  newyork = ['1 E 29th St #29b,New York, NY 10016,'];
  Unitedstates = ['United States'];
  deliveryfee = ['Delivery Fee'];
  tipamount = ['Tip paid to Udliverer'];
  totalamount = ['Total  Payable Amount'];
  report = ['Report'];
  Select_Option = ['Select Option'];
  cancel = ['Cancel'];
  gallary = ['Gallery'];
  camera = ['Camera'];

  Udliverydetail = ['Udlivery Details'];
  ratenow = ['Rate Now'];
  Billinginformation = ['Billing Information'];
  Take_taxt = ['Yes'];
  Manual_taxt = ['No'];

  //----------Indox---------/
  Inbox = ['Inbox'];
  sedut = ['Sed ut perspiciatis ende omnis iste natus ohave good'];
  sitvalut = ['sit valuptatem...'];
  Mildred = ['Mildred Welch'];
  Thomas = ['Thomas Hansen'];

  //--------------Chat------//
  Chat = ['Chat'];
  clear_chat = ['Clear Chat'];
  say_something = ['Say Something...'];

  //-------Repot----/
  enterdescription = ['Enter Description'];
  Submit = ['Submit'];

  //---------rateNow-----/
  ratenow = ['Rate Now'];
  review = ['Review'];
  send = ['Send'];

  date = ['03-Feb-2022, 6:30PM'];
  dateone = ['03-Feb-2022, 8:24PM'];
  datetwo = ['07-Feb-2022, 1:24AM'];
  datethree = ['12-Mar-2022, 2:54PM'];
  datefour = ['17-Mar-2022, 9:24AM'];

  // Setting Page(5-4-22) -------------------------------------------------------------

  Setting_txt = ['Settings'];
  txt_notifications = ['Push Notifications'];
  txt_edit = ['Edit Profile'];
  txt_change_password = ['Change Password'];
  txt_aboutUs = ['About Us'];
  txt_terms_condition = ['Terms & Conditions'];
  termsOfService = ['Terms of service'];
  txt_privacy_policy = ['Privacy Policy'];
  txt_contact_us = ['Contact Us'];
  txt_share_app = ['Share App'];
  txt_rate_app = ['Rate App'];
  Delete_txt = ['Delete Account'];
  txt_logout = ['Logout'];

  txt_Update = ['Update'];
  txt_University = ['University Name'];
  txt_Old = ['Old Password'];
  txt_New = ['New Password'];
  txt_CNew = ['Confirm New Password'];
  txt_msg = ['Message Here'];
  txt_reason = ['Reason'];
  txt_done = ['Done'];

  //Detalis_One (6-4-22)-------------------------------------------------------------
  Details_txt = ['Details'];
  Backyard = ['Backyard Bowls'];
  open = ['Open'];
  breakfast = ['Breakfast'];
  Availabity_text = ['Availability'];
  Dining_Facility = ['Dining Facility Restaurants'];
  closed = ['Close'];
  Monday = ['Mon - Fri'];
  Sunday = ['Sat - Sun'];
  Time = ['10:20 AM - 11:00 PM'];

  //Dining_Restaurants (6-4-22)-------------------------------------------------------------
  Order_info = [' Order Information'];
  Take_taxt = ['Take Photo'];
  Manual_taxt = ['Manual Order'];
  Order_No = ['Order Number'];
  deliveryfee = ['Delivery Fee will be applied'];
  choosetip = ['Choose tip amount'];
  custom = ['Custom tip'];
  location = ['Choose Delivery Location'];
  // paynow = ['Pay Now ($4.7)']
  location_One = ['Location'];

  //Driver_Home (6-4-22)-------------------------------------------------------------

  Driver_Home = ['Home'];
  Offline = ['You are offline'];
  New_Order = ['New Orders'];

  Orderhistory = ['Order History'];
  Backyard = ['Backyard Bowls'];
  Chop = ['Chop & Hops'];
  eatmore = ['Eatmore Fried Food'];
  richtable = ['Rich Table'];
  food = ['Food Dots'];
  breaklunch = ['Break,Lunch'];
  Freshrestau = ['Fresh Restau'];
  pending = ['Pending'];
  // Delivery = ['Delivery']
  Orderid = ['Order ID : #7687589978'];
  search = ['Search'];
  Home = ['Home'];
  breakfast = ['Breakfast'];
  lunch = ['Lunch,Dinner'];
  // open = ['Open']

  Hometext = ['UNIVERSITY OF'];
  Hometexttwo = ['DELAWARE DINING'];
  Homesearch = ['Search Dining/Facility'];
  View = ['View all'];
  Blazingbean = ['Blazing Bean'];
  Eggslut = ['Egg Slut'];

  orderID = ['Order ID'];
  ID = ['#978987676765'];
  Location = ['Location'];
  newyork = ['1 E 29th St #29b,New York, NY 10016,'];
  Unitedstates = ['United States'];

  tipamount = ['Tip amount paid to you'];
  totalamount = ['Total  Payable Amount'];
  report = ['Report'];
  Select_Option = ['Select Option'];
  cancel = ['Cancel'];

  Udliverydetail = ['Udlivery Details'];
  Udliverer_detail = ['Udliverer Details'];
  ratenow = ['Rate Now'];
  Billinginformation = ['Billing Information'];

  //----------become udelivery----------
  doyou = ['Do you have an unlimited meal plan?'];
  mealplan = ['meal plan?'];
  youwillneed = [
    'You will need to use the card with your unlimited meal plan to deliver Dining Hall orders',
  ];
  howwoulyoulike = ['How would you like to get paid ?'];
  youneedunlimited = [
    'You  need  an unlimited meal plan to deliver Dining Hall orders. You will only be able to deliver Dining Facility Orders',
  ];
  youwillonly = [' Dining Hall orders. You will only be able'];
  todeliver = ['to deliver Dining Facility Orders'];
  unlimited = ['unlimited meal plan to deliver'];
  diningorder = ['Dining Hall order'];
  Continue = ['Continue'];
  Venmo = ['Venmo'];
  Paypal = ['Paypal'];
  DebitCard = ['Debit Card'];
  BankAccount = ['Bank Account'];
  Upload = ['Upload ID Front Photo'];
  Upload1 = ['Upload ID Back Photo'];
  Upload2 = ['Upload ID ,Address, Proof'];

  //------------add bank detail--------
  addbankdetail = ['Add Bank Details'];
  No = ['No'];
  yes = ['Yes'];

  // -------------Order------
  Order = ['Orders'];
  pickup = ['Picked up'];
  cancelled = ['Cancelled'];
  customerdetails = ['Customer Details'];
  universityname = ['University Name : '];
  universitynameO = ['University Name'];
  harvarduniversity = ['Harvard University'];
  // Dropoff = ['Drop off']
  Dropoff = ['Drop off'];
  Navigate = ['Navigate'];
  HeadToDestination = ['Head to Destination'];

  //==========Driver pending======//
  CancelOrder = ['Cancel Order'];
  Cancelresone = ['Cancellation Reason'];
  Sorry = ['Sorry! I am not present at this moment'];

  //Driver_Home (8-4-22)-------------------------------------------------------------

  Driver_Home = ['Home'];
  Offline = ['You are offline'];
  New_Order = ['New Orders'];
  customer_details_text = ['Customer Details'];
  reject_text = ['REJECT'];
  accept_text = ['ACCEPT'];
  accept = ['Accept'];
  University_text = ['University Name'];

  My_Earnings = ['My Earnings'];

  Orderhistory = ['Order History'];
  Backyard = ['Backyard Bowls'];
  Chop = ['Chop & Hops'];
  eatmore = ['Eatmore Fried Food'];
  richtable = ['Rich Table'];
  food = ['Food Dots'];
  breaklunch = ['Break,Lunch'];
  Freshrestau = ['Fresh Restau'];
  // Delivery = ['Delivery']
  Orderid = ['Order ID : #7687589978'];
  search = ['Search'];
  Home = ['Home'];
  breakfast = ['Breakfast'];
  lunch = ['Lunch,Dinner'];
  // open = ['Open']

  Hometext = ['UNIVERSITY OF'];
  Hometexttwo = ['DELAWARE DINING'];
  Homesearch = ['Search Dining/Facility'];
  View = ['View all'];
  Blazingbean = ['Blazing Bean'];
  Eggslut = ['Egg Slut'];

  orderID = ['Order ID'];
  ID = ['#978987676765'];
  Location = ['Location'];
  newyork = ['1 E 29th St #29b,New York, NY 10016,'];
  Unitedstates = ['United States'];

  riderTipamount = ['Tip paid to Udliverer'];

  tipamount = ['Tip paid to you'];

  TransactionID = ['Transaction Id'];
  totalamount = ['Total  Payable Amount'];
  report = ['Report'];
  Select_Option = ['Select Option'];
  cancel = ['Cancel'];
  ratenow = ['Rate Now'];
  Billinginformation = ['Billing Information'];

  //Driver_Home (9-4-22)-------------------------------------------------------------
  Drivre_Profile = ['Profile'];
  charlotte = ['Charlotte Semith'];
  charlottemail = ['charlottsemith@gmail.com'];
  University = ['Harvard University'];
  Edit_Payment_Details = ['Edit Payment Details'];
  Place_txt = ['Place an order'];
  Succefullydelete = ['You have successfully deleted'];
  youraccount = ['your account'];
  success = ['Success!'];
  alreadyou = ['Already have an account?'];

  delivery_fee = ['Delivery Fee'];
  tip_amount = ['Tip amount'];
  remeber = ['Remember me'];

  close_txt = ['Close'];
  done_txt = ['Done'];

  // Media option ///////////////////
  MediaCamera = ['Camera', ''];
  Mediagallery = ['Gallery', ''];
  cancelmedia = ['Cancel', ''];

  //18-07-22
  Open = ['Opened', ''];
  Close = ['Closed', ''];

  //19-07-22
  opened_txt = ['Opened', ''];
  closed_txt = ['Closed', ''];

  //29-07-22
  payment_processing_txt = ['Payment Processing'];
  payment_warning_txt = ['Please don’t exit until the payment is complete'];
  // Please don’t exit until the payment is complete
  //30-07-22
  qty = ['Qty: ', ''];
  // No_driver_available = ['No driver available', ''];
  No_driver_available = ['No udliverer available', ''];
  Calories = ['Calories: ', ''];
  cartEmpty = ['Your cart is empty', ''];
  // No_order_available_for_delivery = ['No orders available for delivery', ''];
  No_order_available_for_delivery = ['Looking for Orders nearby', ''];
  Delivered = ['Delivered: ', ''];
  Delivered_txt = ['Delivered ', ''];

  //--for chat start --------

  online_txt = ['Online'];
  offline_txt = ['Offline'];
  type_something_txt = ['Type Something'];

  //-----------------------chat page-------------------------------//
  chattextinputmessage = ['Message', ''];
  chataction = ['Action', 'Action', ''];
  chatreport = ['Report User', ''];
  chatclear = ['Clear Chat', ''];
  chatcancel = ['Cancel', ''];
  reportmessagepopup = ['Are your sure you want to ? report', ''];
  chatclearpopup = ['Are your sure you to ? clear chat', ''];
  ChooseMedia = ['Choose', ''];
  Confirm = ['Confirm', ''];
  block_permission = ['Are you sure? you want to block this user', ''];
  unblock_permission = ['Are you sure? you want to unblock this user', ''];
  select_option_txt = ['Select Option', ''];
  report_txt = ['Report', ''];
  chats_txt = ['Chats', ''];
  block_txt = ['Block', ''];
  unblock_txt = ['Unblock', ''];
  cancel_txt = ['Cancel', ''];
  submit_txt = ['Submit', ''];
  reason_txt = ['Reason', ''];
  search_here_txt = ['Search here'];
  you_blocked_this_user = ['You Block this person'];
  no_txt = ['No', 'No'];
  yes_txt = ['Yes', 'Yes'];
  //--for chat end --------
}
export const Lang_chg = new Language_provider();
