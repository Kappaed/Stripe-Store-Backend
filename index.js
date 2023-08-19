const express = require("express");
const path = require("path");
const cors = require("cors");

const createCheckoutSession = require("./api/checkout");
const webhook = require("./api/webhook");
const paymentIntent = require("./api/paymentIntent");
const decodeJWT = require("./auth/decodeJWT");
const setupIntent = require("./api/setupIntent");
const validateUser = require("./auth/validateUser");
const getCards = require("./api/getPaymentMethod");
const updatePaymentIntent = require("./api/updatePaymentIntent");

require("dotenv").config({ path: path.resolve(__dirname, "./.env") });

const app = express();
const port = 8080;

// const corsOptions = {
//   origin: "*",
//   credentials: true, //access-control-allow-credentials:true
//   optionSuccessStatus: 200,
// };

app.options("*", cors());

app.use(cors());

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://superlative-crostata-89b75d.netlify.app/"
  );

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

app.use(
  express.json({
    verify: (req, res, buffer) => (req["rawBody"] = buffer),
  })
);

app.use(decodeJWT);

app.post("/save-payment-method", validateUser, setupIntent);
app.post("/webhook", webhook);
app.post("/create-payment-intent", paymentIntent);
app.post("/create-checkout-session", createCheckoutSession);
app.put("/update-payment-intent", updatePaymentIntent);
app.get("/get-payment-methods", validateUser, getCards);
app.get("/", (req, res) => res.send("hello world"));
app.listen(port, () => console.log("server is listening on port ", port));
