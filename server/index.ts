// RUN WITH ts-node (built into nodemon) -> "npx nodemon server/index.ts"
const express = require("express");
//express dependencies
require("dotenv").config();
const morgan = require("morgan"); //logs incoming requests + status
const bodyParser = require("body-parser"); //parses json
const cors = require("cors"); // sets CORS headers

//UTILS imported (functions to charge credit card)
const chargeCard = require("./ChargeCard");
const chargeProfile = require("./ChargeProfile");
const createProfile = require("./CreateProfile");
const addCard = require("./AddCard");
const getProfile = require("./GetProfile");
const getPaymentProfile = require("./GetPaymentProfile");

const app = express(); // init express server

//Middleware for incoming requests
// json, urlencoded, cors policy, morgan, dotenv
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // true means it accepts js objects (in addition to strings and arrays)
app.use(morgan("dev"));
app.use(cors());

//ROUTES
//

app.get("/chargeCard", (req: any, res: any) => {
  // charge credit card
  chargeCard(function (response: any) {
    console.log(
      "chargeCreditCard RESPONSE\n==================================",
      response
    );
    res.send("charged card ?");
  });
  // res.send("server pong");
});
app.get("/chargeProfile", (req: any, res: any) => {
  // create customer profile
  chargeProfile("512663510", "519371888", function (response: any) {
    console.log(
      "chargeProfile RESPONSE\n==================================",
      response
    );
    res.send(response);
  });
  // res.send("server pong");
});
app.get("/createprofile", (req: any, res: any) => {
  // create customer profile
  createProfile(function (response: any) {
    console.log(
      "createCustomerProfile RESPONSE\n==================================",
      response
    );
    res.send("created profile ?");
  });
  // res.send("server pong");
});
app.get("/addCard", (req: any, res: any) => {
  // create customer profile
  addCard("512663510", function (response: any) {
    console.log(
      "addCard RESPONSE\n==================================",
      response
    );
    res.send(response);
  });
});
app.get("/getprofile", (req: any, res: any) => {
  // create customer profile
  getProfile("512663510", function (response: any) {
    console.log(
      "getProfile RESPONSE\n==================================",
      response
    );
    res.send(response);
  });
  // res.send("server pong");
});
app.get("/getpaymentprofile", (req: any, res: any) => {
  // create customer profile
  getPaymentProfile("512663510", "519371888", function (response: any) {
    console.log(
      "getPaymentProfile RESPONSE\n==================================",
      response
    );
    res.send(response);
  });
  // res.send("server pong");
});

//UTILS
// import function for charge credit card

const PORT = process.env.PORT ?? 1200;

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
