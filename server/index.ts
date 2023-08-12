// RUN WITH ts-node (built into nodemon) -> "npx nodemon server/index.ts"
const express = require("express");
//express dependencies
require("dotenv").config();
const morgan = require("morgan"); //logs incoming requests + status
const bodyParser = require("body-parser"); //parses json
const cors = require("cors"); // sets CORS headers

//UTILS imported (functions to charge credit card)
const createProfile = require("./CreateProfile");
const getProfile = require("./GetProfile");
const addCard = require("./AddCard");
const chargeProfile = require("./ChargeProfile");
const refundProfile = require("./RefundProfile");
const deleteProfile = require("./DeleteProfile");
const getPaymentProfile = require("./GetPaymentProfile");

const app = express(); // init express server

//Middleware for incoming requests
// json, urlencoded, cors policy, morgan, dotenv
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // true means it accepts js objects (in addition to strings and arrays)
app.use(morgan("dev"));
app.use(cors());

//ROUTES

app.get("/test", (req: any, res: any) => {
  // create customer profile
  console.log("server hit [test]");
  res.send("pong [server test]");
});

app.post("/createprofile", (req: any, res: any) => {
  // create customer profile
  createProfile(req.body, function (response: any) {
    console.log(
      "createCustomerProfile RESPONSE\n==================================",
      response
    );

    if (response.messages.resultCode === "Error") {
      res.status(500).send(response);
    } else {
      res.send(response);
    }
  });
});
app.post("/getprofile", (req: any, res: any) => {
  // create customer profile
  let customerId: string = req.body.id;
  // let customerId: string = req.body.id.slice(0, -3) + "921";
  getProfile(customerId, function (response: any) {
    console.log(
      "getProfile RESPONSE\n==================================",
      response.messages.message[0].text
    );
    if (response.messages.resultCode === "Ok") {
      res.send(response);
    } else if (
      response.messages.message[0].text === "The record cannot be found."
    ) {
      res.status(500).send("user DNE");
    } else {
      res.status(500).send(response);
    }
  });
  // res.send("server pong");
});
app.post("/chargeProfile", (req: any, res: any) => {
  // create customer profile
  chargeProfile(req.body, function (response: any) {
    if (response.messages.resultCode === "Error") {
      res.status(500).send(response);
    } else {
      res.send(response);
    }
  });
});

app.post("/refundProfile", (req: any, res: any) => {
  // create customer profile

  refundProfile(req.body, function (response: any) {
    if (response.messages.resultCode === "Error") {
      res.status(500).send(response);
    } else {
      res.send(response);
    }
  });
});

app.post("/addCard", (req: any, res: any) => {
  console.log("req.body ADD CARD: ", req.body);
  // create customer profile
  addCard(req.body, function (response: any) {
    console.log(
      "addCard RESPONSE\n==================================",
      response.messages
    );
    if (response.messages.resultCode === "Error") {
      res.status(500).send(response);
    } else {
      res.send(response);
    }
  });
});

app.delete("/deleteprofile", (req: any, res: any) => {
  console.log("======delete profile BODY: ", req.body);
  let { customerId } = req.body;
  // create customer profile
  deleteProfile(customerId, function (response: any) {
    console.log(
      "deleteProfile RESPONSE\n==================================",
      response
    );
    res.send(response);
  });
});

app.get("/getpaymentprofile", (req: any, res: any) => {
  // create customer profile
  getPaymentProfile("512824681", "519647191", function (response: any) {
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
