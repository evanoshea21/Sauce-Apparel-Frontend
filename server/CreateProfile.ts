"use strict";
//working

interface CreateProfileData {
  creditCard: {
    card_number: string;
    expDate: string;
  };
  billTo: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    phone: string;
  };
  merchantCustomerId?: string;
  description?: string;
  email: string;

  // respond with customerProfileId --> response.getCustomerProfileId()
}

var ApiContracts = require("authorizenet").APIContracts;
var ApiControllers = require("authorizenet").APIControllers;
var utils = require("../scripts/utils.js");
// var constants = require('../constants.js');
require("dotenv").config();

function createCustomerProfile(data: CreateProfileData, callback: any) {
  var merchantAuthenticationType =
    new ApiContracts.MerchantAuthenticationType();
  merchantAuthenticationType.setName(process.env.AUTHORIZENET_API_LOGIN_ID);
  merchantAuthenticationType.setTransactionKey(
    process.env.AUTHORIZENET_TRANSACTION_KEY
  );

  var creditCard = new ApiContracts.CreditCardType();
  creditCard.setCardNumber(data.creditCard.card_number);
  creditCard.setExpirationDate(data.creditCard.expDate);

  var paymentType = new ApiContracts.PaymentType();
  paymentType.setCreditCard(creditCard);

  var customerAddress = new ApiContracts.CustomerAddressType();
  customerAddress.setFirstName(data.billTo.firstName);
  customerAddress.setLastName(data.billTo.lastName);
  customerAddress.setAddress(data.billTo.address);
  customerAddress.setCity(data.billTo.city);
  customerAddress.setState(data.billTo.state);
  customerAddress.setZip(data.billTo.zip_code);
  customerAddress.setCountry("US");
  customerAddress.setPhoneNumber(data.billTo.phone);

  var customerPaymentProfileType =
    new ApiContracts.CustomerPaymentProfileType();
  customerPaymentProfileType.setCustomerType(
    ApiContracts.CustomerTypeEnum.INDIVIDUAL
  );
  customerPaymentProfileType.setPayment(paymentType);
  customerPaymentProfileType.setBillTo(customerAddress);

  var paymentProfilesList = [];
  paymentProfilesList.push(customerPaymentProfileType);

  var customerProfileType = new ApiContracts.CustomerProfileType();
  customerProfileType.setMerchantCustomerId(
    "M_" + data.merchantCustomerId ?? "1234"
  );
  customerProfileType.setDescription(
    data.description ?? "Profile created on ECig Website."
  );
  customerProfileType.setEmail(data.email);
  customerProfileType.setPaymentProfiles(paymentProfilesList);

  var createRequest = new ApiContracts.CreateCustomerProfileRequest();
  createRequest.setProfile(customerProfileType);
  createRequest.setValidationMode(ApiContracts.ValidationModeEnum.TESTMODE);
  createRequest.setMerchantAuthentication(merchantAuthenticationType);

  //pretty print request
  //console.log(JSON.stringify(createRequest.getJSON(), null, 2));

  var ctrl = new ApiControllers.CreateCustomerProfileController(
    createRequest.getJSON()
  );

  ctrl.execute(function () {
    var apiResponse = ctrl.getResponse();

    var response = new ApiContracts.CreateCustomerProfileResponse(apiResponse);

    //pretty print response
    //console.log(JSON.stringify(response, null, 2));

    if (response != null) {
      if (
        response.getMessages().getResultCode() ==
        ApiContracts.MessageTypeEnum.OK
      ) {
        console.log(
          "Successfully created a customer profile with id: " +
            response.getCustomerProfileId()
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
} // CREATE CUSTOMER PROFILE

// if (require.main === module) {
//   createCustomerProfile(function () {
//     console.log("createCustomerProfile call complete.");
//   });
// }

module.exports = createCustomerProfile;
