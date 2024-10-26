const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

admin.initializeApp();

const db = admin.firestore();

exports.submitShippingForm = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    try {
      const { fullName, email, address, city, postalCode, province } = req.body;
      await db.collection("shippingForms").doc(email).set({
        fullName,
        email,
        address,
        city,
        postalCode,
        province,
      });
      res.status(200).send("Shipping form submitted successfully");
    } catch (error) {
      res.status(500).send("Error submitting form: " + error.message);
    }
  });
});