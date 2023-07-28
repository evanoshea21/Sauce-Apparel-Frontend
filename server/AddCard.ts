"use strict";

var ApiContracts = require("authorizenet").APIContracts;
var ApiControllers = require("authorizenet").APIControllers;
// var constants = require('../constants.js');
require("dotenv").config();
var randomStreetNumber = Math.round(Math.random() * 1000);

interface Address {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}
interface AddCardData {
  customerProfileId: string;
  cardNumber: string;
  expDate: string;
  billTo: Address;
}

function createCustomerPaymentProfile(
  data: AddCardData,
  callback: (res: {}) => {}
) {
  var merchantAuthenticationType =
    new ApiContracts.MerchantAuthenticationType();
  merchantAuthenticationType.setName(process.env.AUTHORIZENET_API_LOGIN_ID);
  merchantAuthenticationType.setTransactionKey(
    process.env.AUTHORIZENET_TRANSACTION_KEY
  );

  var creditCard = new ApiContracts.CreditCardType();
  creditCard.setCardNumber(data.cardNumber);
  creditCard.setExpirationDate(data.expDate);

  var paymentType = new ApiContracts.PaymentType();
  paymentType.setCreditCard(creditCard);

  var customerAddress = new ApiContracts.CustomerAddressType();
  customerAddress.setFirstName(data.billTo.firstName);
  customerAddress.setLastName(data.billTo.lastName);
  customerAddress.setAddress(data.billTo.address);
  customerAddress.setCity(data.billTo.city);
  customerAddress.setState(data.billTo.state);
  customerAddress.setZip(data.billTo.zip);
  customerAddress.setCountry(data.billTo.country);
  customerAddress.setPhoneNumber(data.billTo.phone);

  var profile = new ApiContracts.CustomerPaymentProfileType();
  profile.setBillTo(customerAddress);
  profile.setPayment(paymentType);
  profile.setDefaultPaymentProfile(true);

  var createRequest = new ApiContracts.CreateCustomerPaymentProfileRequest();

  createRequest.setMerchantAuthentication(merchantAuthenticationType);
  createRequest.setCustomerProfileId(data.customerProfileId);
  createRequest.setPaymentProfile(profile);

  //pretty print request
  //console.log(JSON.stringify(createRequest.getJSON(), null, 2));

  var ctrl = new ApiControllers.CreateCustomerPaymentProfileController(
    createRequest.getJSON()
  );

  ctrl.execute(function () {
    var apiResponse = ctrl.getResponse();

    var response = new ApiContracts.CreateCustomerPaymentProfileResponse(
      apiResponse
    );

    //pretty print response
    //console.log(JSON.stringify(response, null, 2));

    if (response != null) {
      if (
        response.getMessages().getResultCode() ==
        ApiContracts.MessageTypeEnum.OK
      ) {
        console.log(
          "createCustomerPaymentProfile: Successfully created a customer payment profile with id: " +
            response.getCustomerPaymentProfileId()
        );
      } else {
        console.log("Result Code: " + response.getMessages().getResultCode());
        console.log(
          "Error Code: " + response.getMessages().getMessage()[0].getCode()
        );
        console.log(
          "Error message: " + response.getMessages().getMessage()[0].getText()
        );
      }
    } else {
      console.log("Null response received");
    }

    callback(response);
  });
}

// if (require.main === module) {
// 	createCustomerPaymentProfile('1929176981',function(){
// 		console.log('createCustomerPaymentProfile call complete.');
// 	});
// }

module.exports = createCustomerPaymentProfile;
