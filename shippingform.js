import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-auth.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-database.js";

const cart = JSON.parse(localStorage.getItem("cart")) || [];
if (cart.length === 0) {
  alert("Your cart is empty. Please add items before checking out.");
  window.location.href = "/cart"; // Adjust to your actual cart URL
}

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
    const emailInput = document.getElementById("emailAddress");
    const signInStatus = document.getElementById("signInStatus");
    const submitBtn = document.getElementById("submitFormBtn");
    const signInBox = document.getElementById("signInBox");
  
    if (user) {
      emailInput.value = user.email;
      emailInput.readOnly = true;
      submitBtn.disabled = false;
  
      signInStatus.classList.remove("text-danger");
      signInStatus.classList.add("text-muted");
      signInStatus.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-check text-muted me-1" viewBox="0 0 16 16">
        <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
        <path d="M8.256 14a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z"/>
      </svg>
      <span class="text-muted">Signed in as ${user.email}</span>
    `;
  
      if (signInBox) signInBox.remove(); // Hide entire sign-in section
    } else {
      submitBtn.disabled = true;
  
      signInStatus.classList.remove("text-success");
      signInStatus.classList.add("text-danger");
      signInStatus.textContent = "❌ Please sign in to continue";
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
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            localStorage.removeItem("cart");
            alert("Order Placed Successfully!");
            window.location.href = "https://priceslashstore.com/myorders";
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
    document.getElementById("submitFormBtn").addEventListener("click", function (e) {
      e.preventDefault();
    
      grecaptcha.enterprise.ready(async () => {
        try {
          const token = await grecaptcha.enterprise.execute('6LconSwrAAAAALCmI5mbLwDiSuOiX4A5t7Ur-dU9', {
            action: 'submit'
          });
    
          // Add token to hidden input for server-side validation (optional)
          const form = document.getElementById('shippingForm');
          let hiddenInput = document.querySelector('input[name="g-recaptcha-response"]');
          if (!hiddenInput) {
            hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = 'g-recaptcha-response';
            form.appendChild(hiddenInput);
          }
          hiddenInput.value = token;
    
          // Now call your form validation and submission
          validateAndSubmit(e);
        } catch (err) {
          console.error('reCAPTCHA failed:', err);
          alert("reCAPTCHA verification failed. Please try again.");
        }
      });
    });  };