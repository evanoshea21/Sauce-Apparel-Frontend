"use strict";

var ApiContracts = require("authorizenet").APIContracts;
var ApiControllers = require("authorizenet").APIControllers;
var SDKConstants = require("authorizenet").Constants;
// var utils = require('../utils.js');
// var constants = require('../constants.js');

interface CartItem {
  sku: string;
  name: string;
  description: string;
  quantity: string;
  unitPrice: string;
}
interface Address1 {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface ChargeCardData {
  creditCard: {
    cardNumber: string;
    expDate: string;
    cvv: string;
  };
  invoiceNum: string;
  description: string;
  amount: string;
  billTo: Address1;
  ordered_items: CartItem[];
}

function chargeCreditCard(data: ChargeCardData, callback: (res: any) => any) {
  var merchantAuthenticationType =
    new ApiContracts.MerchantAuthenticationType();
  merchantAuthenticationType.setName(process.env.AUTHORIZENET_API_LOGIN_ID);
  merchantAuthenticationType.setTransactionKey(
    process.env.AUTHORIZENET_TRANSACTION_KEY
  );

  var creditCard = new ApiContracts.CreditCardType();
  creditCard.setCardNumber(data.creditCard.cardNumber);
  creditCard.setExpirationDate(data.creditCard.expDate);
  creditCard.setCardCode(data.creditCard.cvv);

  var paymentType = new ApiContracts.PaymentType();
  paymentType.setCreditCard(creditCard);

  var orderDetails = new ApiContracts.OrderType();
  orderDetails.setInvoiceNumber(data.invoiceNum);
  orderDetails.setDescription(data.description);

  // var tax = new ApiContracts.ExtendedAmountType();
  // tax.setAmount("4.26");
  // tax.setName("level2 tax name");
  // tax.setDescription("level2 tax");

  // var duty = new ApiContracts.ExtendedAmountType();
  // duty.setAmount("8.55");
  // duty.setName("duty name");
  // duty.setDescription("duty description");

  // var shipping = new ApiContracts.ExtendedAmountType();
  // shipping.setAmount("8.55");
  // shipping.setName("shipping name");
  // shipping.setDescription("shipping description");

  var billTo = new ApiContracts.CustomerAddressType();
  billTo.setFirstName(data.billTo.firstName);
  billTo.setLastName(data.billTo.lastName);
  // billTo.setCompany(data.billTo);
  billTo.setAddress(data.billTo.address);
  billTo.setCity(data.billTo.city);
  billTo.setState(data.billTo.state);
  billTo.setZip(data.billTo.zip);
  billTo.setCountry("US");

  // var shipTo = new ApiContracts.CustomerAddressType();
  // shipTo.setFirstName("China");
  // shipTo.setLastName("Bayles");
  // shipTo.setCompany("Thyme for Tea");
  // shipTo.setAddress("12 Main Street");
  // shipTo.setCity("Pecan Springs");
  // shipTo.setState("TX");
  // shipTo.setZip("44628");
  // shipTo.setCountry("USA");

  var lineItemList: any[] = [];
  data.ordered_items.forEach((item) => {
    var lineItem = new ApiContracts.LineItemType();
    lineItem.setItemId(item.sku);
    lineItem.setName(item.name);
    lineItem.setDescription(item.description);
    lineItem.setQuantity(item.quantity);
    lineItem.setUnitPrice(item.unitPrice);

    lineItemList.push(lineItem);
  });

  // var lineItem_id1 = new ApiContracts.LineItemType();
  // lineItem_id1.setItemId("1");
  // lineItem_id1.setName("vase");
  // lineItem_id1.setDescription("cannes logo");
  // lineItem_id1.setQuantity("18");
  // lineItem_id1.setUnitPrice(45.0);

  // var lineItem_id2 = new ApiContracts.LineItemType();
  // lineItem_id2.setItemId("2");
  // lineItem_id2.setName("vase2");
  // lineItem_id2.setDescription("cannes logo2");
  // lineItem_id2.setQuantity("28");
  // lineItem_id2.setUnitPrice("25.00");

  // var lineItemList = [];
  // lineItemList.push(lineItem_id1);
  // lineItemList.push(lineItem_id2);

  var lineItems = new ApiContracts.ArrayOfLineItem();
  lineItems.setLineItem(lineItemList);

  // var userField_a = new ApiContracts.UserField();
  // userField_a.setName("A");
  // userField_a.setValue("Aval");

  // var userField_b = new ApiContracts.UserField();
  // userField_b.setName("B");
  // userField_b.setValue("Bval");

  // var userFieldList = [];
  // userFieldList.push(userField_a);
  // userFieldList.push(userField_b);

  // var userFields = new ApiContracts.TransactionRequestType.UserFields();
  // userFields.setUserField(userFieldList);

  // var transactionSetting1 = new ApiContracts.SettingType();
  // transactionSetting1.setSettingName("duplicateWindow");
  // transactionSetting1.setSettingValue("120");

  // var transactionSetting2 = new ApiContracts.SettingType();
  // transactionSetting2.setSettingName("recurringBilling");
  // transactionSetting2.setSettingValue("false");

  // var transactionSettingList = [];
  // transactionSettingList.push(transactionSetting1);
  // transactionSettingList.push(transactionSetting2);

  // var transactionSettings = new ApiContracts.ArrayOfSetting();
  // transactionSettings.setSetting(transactionSettingList);

  var transactionRequestType = new ApiContracts.TransactionRequestType();
  transactionRequestType.setTransactionType(
    ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION
  );
  transactionRequestType.setPayment(paymentType);
  transactionRequestType.setAmount(data.amount); //IMPORTANT
  transactionRequestType.setLineItems(lineItems);
  // transactionRequestType.setUserFields(userFields);
  transactionRequestType.setOrder(orderDetails);
  // transactionRequestType.setTax(tax);
  // transactionRequestType.setDuty(duty);
  // transactionRequestType.setShipping(shipping);
  transactionRequestType.setBillTo(billTo);
  // transactionRequestType.setShipTo(shipTo);
  // transactionRequestType.setTransactionSettings(transactionSettings);

  var createRequest = new ApiContracts.CreateTransactionRequest();
  createRequest.setMerchantAuthentication(merchantAuthenticationType);
  createRequest.setTransactionRequest(transactionRequestType);

  //pretty print request
  console.log(JSON.stringify(createRequest.getJSON(), null, 2));

  var ctrl = new ApiControllers.CreateTransactionController(
    createRequest.getJSON()
  );
  //Defaults to sandbox
  //ctrl.setEnvironment(SDKConstants.endpoint.production);

  ctrl.execute(function () {
    var apiResponse = ctrl.getResponse();

    var response = new ApiContracts.CreateTransactionResponse(apiResponse);

    //pretty print response
    console.log(JSON.stringify(response, null, 2));

    if (response != null) {
      if (
        response.getMessages().getResultCode() ==
        ApiContracts.MessageTypeEnum.OK
      ) {
        if (response.getTransactionResponse().getMessages() != null) {
          console.log(
            "Successfully created transaction with Transaction ID: " +
              response.getTransactionResponse().getTransId()
          );
          console.log(
            "Response Code: " +
              response.getTransactionResponse().getResponseCode()
          );
          console.log(
            "Message Code: " +
              response
                .getTransactionResponse()
                .getMessages()
                .getMessage()[0]
                .getCode()
          );
          console.log(
            "Description: " +
              response
                .getTransactionResponse()
                .getMessages()
                .getMessage()[0]
                .getDescription()
          );
        } else {
          console.log("Failed Transaction.");
          if (response.getTransactionResponse().getErrors() != null) {
            console.log(
              "Error Code: " +
                response
                  .getTransactionResponse()
                  .getErrors()
                  .getError()[0]
                  .getErrorCode()
            );
            console.log(
              "Error message: " +
                response
                  .getTransactionResponse()
                  .getErrors()
                  .getError()[0]
                  .getErrorText()
            );
          }
        }
      } else {
        console.log("Failed Transaction. ");
        if (
          response.getTransactionResponse() != null &&
          response.getTransactionResponse().getErrors() != null
        ) {
          console.log(
            "Error Code: " +
              response
                .getTransactionResponse()
                .getErrors()
                .getError()[0]
                .getErrorCode()
          );
          console.log(
            "Error message: " +
              response
                .getTransactionResponse()
                .getErrors()
                .getError()[0]
                .getErrorText()
          );
        } else {
          console.log(
            "Error Code: " + response.getMessages().getMessage()[0].getCode()
          );
          console.log(
            "Error message: " + response.getMessages().getMessage()[0].getText()
          );
        }
      }
    } else {
      console.log("Null Response.");
    }

    callback(response);
  });
}

module.exports = chargeCreditCard;
