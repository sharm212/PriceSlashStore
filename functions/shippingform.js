const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

exports.submitShippingForm = functions.https.onRequest(async (req, res) => {
  try {
    const { fullName, email, address, city, postalCode, province } = req.body;
    
    // Log received data
    console.log("Received data:", { fullName, email, address, city, postalCode, province });

    // Attempt to write to Firestore
    await db.collection("shippingForms").doc(email).set({
      fullName,
      email,
      address,
      city,
      postalCode,
      province,
    });

    console.log("Data written successfully to Firestore for email:", email);
    res.status(200).send("Shipping form submitted successfully");
  } catch (error) {
    console.error("Error writing to Firestore:", error.message);
    res.status(500).send("Error submitting form: " + error.message);
  }
});