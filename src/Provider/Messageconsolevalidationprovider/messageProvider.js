import { Alert, ToastAndroid, Platform } from "react-native";
import Toast from 'react-native-simple-toast';
//--------------------------- Message Provider Start -----------------------
class messageFunctionsProviders {
	toast(message, position) {
		if (position == 'center') {
			Toast.showWithGravity(message, Toast.SHORT, Toast.CENTER);
		}
		else if (position == 'top') {
			Toast.showWithGravity(message, Toast.SHORT, Toast.TOP);
		}
		else if (position == 'bottom') {
			Toast.showWithGravity(message, Toast.SHORT, Toast.BOTTOM);

		}
		else if (position == 'long') {
			Toast.showWithGravity(message, Toast.LONG, Toast.CENTER);
		}

	}

	alert(title, message, callback) {
		if (callback === false) {
			Alert.alert(
				title,
				message,
				[
					{
						text: msgTitle.ok[0],
					},
				],
				{ cancelable: false },
			);
		} else {
			Alert.alert(
				title,
				message,
				[
					{
						text: msgTitle.ok[0],
						onPress: () => callback,
					},
				],
				{ cancelable: false },
			);
		}

	}

	confirm(title, message, callbackOk, callbackCancel) {
		if (callbackCancel === false) {
			Alert.alert(
				title,
				message,
				[
					{
						text: msgTitle.cancel[0],
					},
					{
						text: msgTitle.ok[0],
						onPress: () => this.btnPageLoginCall(),
					},
				],
				{ cancelable: false },
			);
		} else {
			Alert.alert(
				title,
				message,
				[
					{
						text: msgTitle.cancel[0],
						onPress: () => callbackCancel,
					},
					{
						text: msgTitle.ok[0],
						onPress: () => callbackOk,
					},
				],
				{ cancelable: false },
			);
		}

	}

	later(title, message, callbackOk, callbackCancel, callbackLater) {
		Alert.alert(
			title,
			message,
			[
				{
					text: 'Ask me later',
					onPress: () => msgTitle.later[0],
				},
				{
					text: 'Cancel',
					onPress: () => msgTitle.cancel[0],
				},
				{
					text: 'OK',
					onPress: () => msgTitle.ok[0],
				},
			],
			{ cancelable: false },
		);
	}


}

//--------------------------- Title Provider Start -----------------------

class messageTitleProvider {
	//----------------- message buttons
	ok = ['Ok', 'Okay', 'Está bem'];
	cancel = ['Cancel', 'Cancelar', 'Cancelar'];
	later = ['Later', 'Más tarde', 'Mais tarde'];

	//--------------- message title 
	information = ['Information Message', 'Mensaje informativo', 'Mensagem Informativa'];
	alert = ['Alert', 'Alerta', 'Alerta'];
	confirm = ['Information Message', 'Mensaje informativo', 'Mensagem Informativa'];
	validation = ['Information Message', 'Mensaje informativo', 'Mensagem Informativa'];
	success = ['Information Message', 'Mensaje informativo', 'Mensagem Informativa'];
	error = ['Information Message', 'Mensaje informativo', 'Mensagem Informativa'];
	response = ['Response', 'Respuesta', 'Resposta'];
	server = ['Connection Error', 'Error de conexión', 'Erro de conexão'];
	internet = ['Connection Error', 'Error de conexión', 'Erro de conexão']
	deactivate_msg = ['Account deactived']
	deactivate = [0,]
	usernotexit = ["User id does not exist"]
	account_deactivate_title = ['your account deactivated please try again']
}

//--------------------------- Message Provider Start -----------------------

class messageTextProvider {

	loginFirst = ['Please login first', 'التحقق من صحة'];
	emptyContactResion = ['Please select contact reason', 'التحقق من صحة'];
	emptyContactMessage = ['Please Enter Message', ''];
	networkconnection = ['Unable to connect. Please check that you are connected to the Internet and try again.', 'Unable to connect. Please check that you are connected to the Internet and try again.'];
	servermessage = ['An Unexpected error occured , Please try again .If the problem continues , Please do contact us', 'An Unexpected error occured , Please try again .If the problem continues , Please do contact us'];


	//-----------------veggies subscription app -------------------
	emptyFirstName = ['Please Enter  First Name']
	firstNameMinLength = ['First Name Is Too Short']
	firstNameMaxLength = ['First Name Is Too Long']
	validFirstName = ['Spaces Not Allowed In First Name']


	emptyLastName = ['Please Enter  Last Name']
	lastNameMinLength = ['Last Name Is Too Short']
	lastNameMaxLength = ['Last Name Is Too Long']
	validLastName = ['Spaces Not Allowed In Last Name']

	emptyFullName = ['Please Enter  Full Name']
	fullNameMinLength = ['Full Name Is Too Short']
	fullNameMaxLength = ['Full Name Is Too Long']
	validFullName = ['Spaces Not Allowed In Full Name']

	emptyEmail = ['Please Enter Email']
	emailMaxLength = ['Email Is Too Long']
	validEmail = ['Please Enter Valid Email']

	emptyMobile = ['Please enter a mobile number']
	mobileMaxLength = ['Please Enter Valid Mobile Number']
	mobileMinLength = ['Mobile number can not be less then 7 characters']

	validMobile = ['Enter a valid mobile number']

	emptyAddress = ['Please Enter Addrees']
	addressMinLength = [' Addrees Is Too Short']
	addressMaxLength = [' Addrees Is Too Long']
	validAddress = ['Spaces Not Allowed In Addrees']

	emptyPincode = ['Please Enter Pincode']
	pincodeMinLength = ['Pincode Is Too Short']
	pincodeMaxLength = ['Pincode Is Too Long']
	validPincode = ['Spaces And Special Characters Not Allowed In Pin Code']

	emptyOldPassword = ['Please Enter Old Password']
	oldPasswordMaxLength = ['Old Password Too Long']
	oldPasswordMinLength = [' Old Password Should Be Atleast 6 Digit']
	validOldPassword = ['Spaces Not Allowed In Old Password']


	emptyNewPassword = ['Please Enter New Password']
	newPasswordMaxLength = [' New Password Too Long']
	newPasswordMinLength = [' New Password Should Be Atleast 6 Digit']
	validNewPassword = ['Spaces Not Allowed In New Password']

	emptyPassword = ['Please Enter Password']
	passwordMaxLength = ['Password Too Long']
	passwordMinLength = ['Password Should Be Atleast 6 Digit']
	validPassword = ['Spaces Not Allowed In Password']

	emptyConfirmPassword = ['Please Enter Confirm Password']
	confirmPasswordMaxLength = [' Confirm Password Too Long']
	confirmPasswordMinLength = [' Confirm Password Should Be Atleast 6 Digit']
	validConfirmPassword = ['Spaces Not Allowed In Confirm Password']
	passwordNotMatch = ['Password And Confirm Password Should Be Match']

	acceptTerms = ['Please Accept Terms & Conditions And Privacy Policy']
	emptyOtp = ['Please Enter OTP']
	otpMinLength = ['OTP Should Be Atleast 4 Digit']


	//-------------------------contact us ---------------------
	emptyFullName = ['Please Enter Full Name']
	fullNameMinLength = ['Full Name Is Too Short']
	fullNameMaxLength = ['Full Name Is Too Long']
	validName = ['Spaces Not Allowed In Full Name']
	messageSend = ['Message Sent Successfully ']
	validMessage = ['Spaces Not Allowed In Message']

	//--------------------add review-------------
	emptyDishName = ['Please Enter Name Of Dish']
	dishNameMinLength = ['Name Of Dish Is Too Short']
	dishNameMaxLength = ['Name Of Dish Is Too Long']
	validDishName = ['Spaces Not Allowed In Name Of Dish']

	emptyComment = ['Please Enter Comments']
	validComment = ['Spaces Not Allowed In Comment']

	emptyReviewImage = ['Please Select or Capture Review Image']
	emptyDishCategory = ['Please Select Dish Category']
	emptyDishSubCategory = ['Please Select Sub Category']

	//-----------------add report----------------
	emptyReportMessage = ['Please Enter Report Message']
	validReportMessage = ['Please Enter Valid Report Message']


	//----------------select slot ---------
	emptyDate = ['Please Select Date']
	emptyTime = ['Please Select Time']
	emptyPeople = ['Please Select No of People']
	restaurant_close = ['Restaurant Close On That Day']
	emptySlot = ['Please Select Slot']
	selectAnotherSlot = ['Please Select Another Slot']
	slotTimeOver = ['Slot Time Is Over']

	//----------reservation history------------//
	already_checkin = ['You Already Check-In']
	checkin_first = ['Please Check-In First']

	//----------------home filter -----------//
	emptyRestauCategory = ['Please Select Restaurant Category']
	emptyReviewType = ['Please Select Review Type']
	emptyFilterOption = ['Please Select Filter Option']


	//radhekrishan
	PleaseSelectUniversity = ['Please select university']


	enterfullname = ['Please enter your name'];
	fullnameminimumcharacter = ['Please enter minimum 3 characters'];

	entermobile = ['Please enter mobile number'];
	mobileminimumcharacter = ['Please enter valid mobile number'];

	enter_firstname = ['Please enter first name'];
	firstname_minimumcharacter = ['Please enter minimum 3 characters'];
	cardCvv_minimumcharacter = ['Please enter minimum 3 characters'];
	stripe_Account_ID_Check = ['Please enter correct stripe account Id'];
	cardNumber_minimumcharacter = ['Please enter minimum 15 or 16 characters'];

	enter_lastname = ['Please enter last name'];
	lastname_minimumcharacter = ['Please enter minimum 3 characters'];

	enteremail = ['Please enter email address'];
	emailminimumcharacter = ['Please enter minimum 3 characters'];

	enterenterpassword = ['Please enter your password'];
	passwordminimumcharacter = ['Password cannot be less then 6 characters'];

	addToCardValidation = ['Please try again later'];

	// Change Password
	enterenter_oldpassword = ['Please enter current password'];
	Old_passwordminimumcharacter = ['Current password cannot be less then 6 characters'];
	enterenter_newpassword = ['Please enter new password'];
	newpasswordminimumcharacter = ['Password cannot be less then 6 characters'];
	Pleaseenterconfirmpassword = ['Please enter confirm password'];
	Confirm_new_passwordminimumcharacter = ['Password cannot be less then 6 characters'];
	Confirm_password_is_required_to_proceed_further = ['New password and confirm password fields must be equal'];
	// Change Password

	Passwordnotmatched = ['Password and confirm new password fields must be equal'];

	enter_ordernumber = ['Please enter order number'];
	ordernumber_minimumcharacter = ['Please enter minimum 3 characters'];


	//bank details
	enter_mobilenumber = ['Please enter mobile number'];
	Mobilenumber_minimumcharacter = ['Mobile number cannot be less then 10 characters'];


	enter_banknamename = ['Please enter bank name or credit union'];
	bank_nameminimumcharacter = ['Please enter minimum 3 characters'];

	enter_bank_addressline1 = ['Please enter bank address'];
	enter_your_addressline1 = ['Please enter your address'];
	bank_addressline1_minimumcharacter = ['Please enter minimum 3 characters'];

	enter_bank_addressline2 = ['Please enter bank address line 2'];
	bank_addressline2_minimumcharacter = ['Please enter minimum 3 characters'];

	entercity = ['Please enter city'];
	Cityminimumcharacter = ['Please enter minimum 3 characters'];

	enterstate = ['Please enter state'];
	State_minimumcharacter = ['State should have minimum 2 character'];

	enterZipcode = ['Please enter zipcode'];
	enterValidZipCode = ['Please enter valid zipcode'];

	enter_bank_account = ['Please enter bank account'];
	bank_account_minimumcharacter = ['Bank account should have minimum 6 character'];


	enter_bank_account_no = ['Please enter bank account no.'];
	bank_account_minimumcharacter_no = ['Bank account no. should have minimum 6 character'];

	enterMinimum3Character = ['Please enter minimum 3 characters']

	enter_routing_no = ['Please enter routing_no'];
	routing_no_minimumcharacter = ['Please enter minimum 3 characters'];

	entertax_id = ['Please enter tax_id'];
	enterValid_tax_id = ['Please enter valid tax_id'];

	PleaseSelect_photo_id_front_photo = ['Please Select photo id front photo'];
	PleaseSelect_photo_id_back_photo = ['Please Select photo id back photo'];
	PleaseSelect_additional_document_id_address_proof = ['Please Select additional document id address proof'];


	entervalidemail = ['Email address is not correct , please enter a valid email address'];
	entervalidpaypalId = ['Paypal Id is not correct , please enter a valid Paypal Id'];

	empty4OtpMsg = ['Please enter OTP'];
	invalidOtp = ['OTP cannot be less than 4 digits'];

	enterDescription = ['Please enter description'];

	enter_reason = ['Please enter reason'];
	Descriptionminimumcharacter = ['Please enter minimum 3 characters'];
	enterreason = ['Please enter reason'];
	Reasonminimumcharacter = ['Please enter minimum 3 characters'];
	entermessage = ['Please enter message'];
	Messageminimumcharacter = ['Please enter minimum 3 characters'];

	enterreview = ['Please enter review'];
	reviewminimumcharacter = ['Please enter minimum 3 characters'];


	enterDeliveryAddress2 = ['Please select address'];

	Please_upload_ID_front_photo = ['Please upload ID front photo'];
	Please_upload_ID_back_photo = ['Please upload ID back photo'];
	Please_upload_ID_Address_Proof = ['Please upload ID ,Address, Proof'];
	Please_upload_Order_Ticket = ['Please upload Order Ticket'];

	select_date_of_birth = ['Please select date of birth'];
	select_card_Expirey_Date = ['Please select card expirey date'];
	Tip_amount_must = ['Tip amount must be greater than 0'];

	Please_select_star = ['Please select star'];
	//23-08
	Please_upload_order_ticket = ['Please upload order ticket'];
	minimum_characters_Message = ['Please enter minimum 3 characters',]


	//--------for chat start----------------//
	emptyReportMessage = ['Please enter report reason',]
	emptyMessage = ['Please enter message',]
	validReportMessage = ['Please enter valid report reason',]
	minimumReportMessage = ['Please enter minimum 3 characters',]
	//--------for chat end----------------//



}

export const msgText = new messageTextProvider();
export const msgTitle = new messageTitleProvider();
export const msgProvider = new messageFunctionsProviders();
//--------------------------- Message Provider End -----------------------