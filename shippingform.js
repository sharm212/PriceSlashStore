import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-auth.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDHLtzB6wRgh1iBH44Iwn-uEehRruAdZ8A",
  authDomain: "price-slash-3dad0.firebaseapp.com",
  projectId: "price-slash-3dad0",
  storageBucket: "price-slash-3dad0.appspot.com",
  messagingSenderId: "532707340418",
  appId: "1:532707340418:web:7deb612dda4aac3735849b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getDatabase(app);
const productsRef = ref(db, 'products/');

document.getElementById("googleSignIn").addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      document.getElementById("emailAddress").value = user.email;  // Only email
      console.log("Signed in:", user.email);
    })
    .catch((error) => {
      console.error("Sign-in error:", error);
    });
});

// Maintain session on reload (only autofill email)
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("emailAddress").value = user.email;
  }
});


// Function to prefill form fields from URL query parameters
function prefillFields() {
    const params = new URLSearchParams(window.location.search);
    const fullName = params.get('fullName');
    const email = params.get('email');
  
    if (fullName) {
        document.getElementById('fullName').value = fullName;
    }
    if (email) {
        document.getElementById('emailAddress').value = email;
    }
}

// Validation function to check if all fields are filled and then submit the form
async function validateAndSubmit(event) {
    event.preventDefault();  // Prevent default form submission

    // Get field values
    const fullName = document.getElementById("fullName").value;
    const email = document.getElementById("emailAddress").value;
    const address = document.getElementById("address").value;
    const city = document.getElementById("city").value;
    const postalCode = document.getElementById("zipcode").value;
    const province = document.getElementById("province").value;
    const phone = document.getElementById("phone").value;

    // Check if all required fields are non-empty
    if (fullName === "" || email === "" || address === "" || city === "" || postalCode === "" || province === "" || phone === "") {
        alert("Please fill in all required fields before submitting.");
        return; // Stop execution if validation fails
    }

    const cartSKUs = JSON.parse(localStorage.getItem("cart")) || [];
    if (cartSKUs.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    // If validation passes, proceed with the submission
    try {
        const snapshot = await new Promise((resolve, reject) => {
            onValue(productsRef, resolve, { onlyOnce: true });
          });

          const productDB = snapshot.val();
          const cartItems = [];
      
          cartSKUs.forEach(sku => {
            const product = productDB[sku];
            if (product) {
              cartItems.push({
                sku,
                productID: product.productID,
                productName: product.productName,
                productPrice: product.productPrice,
                productDescription: product.productDescription || "",
                productStatus: product.productStatus || "",
              });
            }
          });
      
          if (cartItems.length === 0) {
            alert("Cart items could not be loaded. Please try again.");
            return;
          }
      
          const payload = {
            fullName,
            email,
            address,
            city,
            postalCode,
            province,
            phone,
            cartItems
          };

        const response = await fetch("https://us-central1-price-slash-3dad0.cloudfunctions.net/submitShippingForm", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({payload}),
        });

        if (response.ok) {
            alert("Order Placed Successfully!");
            window.location.href = "https://priceslashstore.com";
        } else {
            alert("Failed to submit information.");
        }
    } catch (error) {
        console.error("Error submitting order:", error);
        alert("An error occurred while submitting your order.");
    }
}

// Initialize on window load
window.onload = function() {
    prefillFields(); // Prefill fields from URL
    document.getElementById("submitFormBtn").addEventListener("click", validateAndSubmit);
  };