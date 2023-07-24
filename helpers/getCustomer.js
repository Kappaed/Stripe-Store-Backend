const stripeAPI = require("../stripe");
const firebase = require("../firebase");

const createCustomer = async (userId) => {
  const userSnapshot = await firebase.db.collection("users").doc(userId).get();
  const { email } = userSnapshot.data();
  const customer = await stripeAPI.customers.create({
    email,
    metadata: { firebaseUID: userId },
  });

  await userSnapshot.ref.update({ stripeCustomerID: customer.id });
  return customer;
};

const getCustomer = async (userId) => {
  const userSnapshot = await firebase.db.collection("users").doc(userId).get();
  const { stripeCustomerID } = userSnapshot.data();
  if (!stripeCustomerID) {
    return createCustomer(userId);
  }
  customer = await stripeAPI.customers.retrieve(stripeCustomerID);
  return customer;
};

module.exports = getCustomer;
