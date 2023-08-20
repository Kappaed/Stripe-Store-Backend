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

// require("dotenv").config({ path: path.resolve(__dirname, "./.env") });
console.log(process.env.PORT);
const app = express();

app.use(cors());

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
app.listen(process.env.PORT, "0.0.0.0", () =>
  console.log("server is listening on port ", process.env.PORT)
);
