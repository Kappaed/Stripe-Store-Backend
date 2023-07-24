const stripeAPI = require("../stripe");

const calculateOrderAmount = (cartItems) =>
  cartItems.reduce((agg, item) => agg + item.price * item.quantity * 100, 0);

const paymentIntent = async (req, res) => {
  const { cartItems, description, receipt_email, shipping } = req.body;
  let paymentIntent;

  try {
    paymentIntent = await stripeAPI.paymentIntents.create({
      amount: calculateOrderAmount(cartItems),
      currency: "usd",
      description,
      payment_method_types: ["card"],
      receipt_email,
      shipping,
    });
    res
      .status(200)
      .json({
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id,
      });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ error: "an error occurred, unable to create payment intent" });
  }
};

module.exports = paymentIntent;
