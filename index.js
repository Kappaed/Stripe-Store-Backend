const express = require("express");
const cors = require("cors");
const path = require("path");
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

app.use(
  express.json({
    verify: (req, res, buffer) => (req["rawBody"] = buffer),
  })
);

app.use(decodeJWT);

app.use(cors({ origin: true }));
app.post("/save-payment-method", validateUser, setupIntent);
app.post("/webhook", webhook);
app.post("/create-payment-intent", paymentIntent);
app.post("/create-checkout-session", createCheckoutSession);
app.put("/update-payment-intent", updatePaymentIntent);
app.get("/get-payment-methods", validateUser, getCards);
app.get("/", (req, res) => res.send("hello world"));
app.listen(port, () => console.log("server is listening on port ", port));
