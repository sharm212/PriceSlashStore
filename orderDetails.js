// orderDetails.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDHLtzB6wRgh1iBH44Iwn-uEehRruAdZ8A",
  authDomain: "price-slash-3dad0.firebaseapp.com",
  projectId: "price-slash-3dad0",
  storageBucket: "price-slash-3dad0.appspot.com",
  messagingSenderId: "532707340418",
  appId: "1:532707340418:web:7deb612dda4aac3735849b"
};

const container = document.getElementById("ordersContainer");
const signInBox = document.getElementById("signInBox");
const signInStatus = document.getElementById("signInStatus");
const googleBtn = document.getElementById("googleSignIn");
const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get("orderId");

document.title = "Order Details | " + orderId;

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

googleBtn.addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      signInStatus.innerHTML = `<span class='text-muted'>Signed in as ${user.email}</span>`;
      if (signInBox) signInBox.remove();
      loadOrderDetails(user.email);
    })
    .catch((error) => console.error("Sign-in error:", error));
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    signInStatus.innerHTML = `<span class='text-muted'>Signed in as ${user.email}</span>`;
    if (signInBox) signInBox.remove();
    loadOrderDetails(user.email);
  }
});

async function loadOrderDetails(email) {
  if (!orderId) {
    container.innerHTML = `<p class='text-danger'>Missing order ID.</p>`;
    return;
  }

  try {
    const orderRef = doc(db, "orders", orderId);
    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists()) {
      container.innerHTML = `<p class='text-danger'>Order not found.</p>`;
      return;
    }

    const order = orderSnap.data();
    if (order.email !== email) {
      container.innerHTML = `<p class='text-danger'>You do not have permission to view this order.</p>`;
      return;
    }

    const orderDate = order.placedAt?.toDate().toLocaleString();

    // Order Info Card
    container.innerHTML += `
      <div class="card mb-4 shadow-sm">
        <div class="card-body">
          <h4 style="padding-bottom:15px;" class="card-title">Order Information</h4>
          <p><strong>Order ID:</strong> ${order.orderId}</p>
          <p><strong>Status:</strong> ${order.status}</p>
          <p><strong>Date Placed:</strong> ${orderDate}</p>
        </div>
      </div>
    `;

    // Shipping Info Card
    container.innerHTML += `
      <div class="card mb-4 shadow-sm">
        <div class="card-body">
          <h4 style="padding-bottom:15px;" class="card-title">Shipping Details</h4>
          <p><strong>Name:</strong> ${order.fullName}</p>
          <p><strong>Address:</strong> ${order.address}, ${order.city}, ${order.province} - ${order.postalCode}</p>
          <p><strong>Phone:</strong> ${order.phone}</p>
        </div>
      </div>
    `;

    const totalAmount = order.items.reduce((sum, item) => sum + item.productPrice, 0);

    // Ordered Items Card
// Ordered Items Card
const itemsHTML = order.items.map(item => {
  const imageString = item.productImages; // fallback to empty string if undefined
  console.log("Imagestring: "+imageString);
  const firstImage = imageString.includes(",")
    ? imageString.split(",")[0].trim()
    : imageString.trim();
    console.log("firstImage: "+firstImage);

  return `
    <div class="d-flex justify-content-between align-items-center border rounded p-3 mb-3">
      <img src="https://priceslashstore.com/productImages/${firstImage}" width="80" class="me-3 rounded" alt="${item.productName}">
      <div class="flex-grow-1">
        <p class="mb-1 fw-bold">${item.productName}</p>
        <p class="mb-1">SKU: ${item.sku}</p>
        <div class="d-flex justify-content-between">
          <span>Qty: ${item.quantity || 1}</span>
          <span><strong>$${item.productPrice.toFixed(2)}</strong></span>
        </div>
      </div>
    </div>
  `;
}).join("");

    container.innerHTML += `
    <div class="card mb-4 shadow-sm">
      <div class="card-body">
        <h4 style="padding-bottom:15px;" class="card-title">Ordered Items</h4>
        ${itemsHTML}
        <p class="text-end"><strong>Total: $${totalAmount.toFixed(2)}</strong></p>
        ${order.status === "Pending Payment" ? `<a id="BuyNowButton" role="button" href="" data-bs-toggle="modal" data-bs-target="#exampleModal" class="btn btn-dark btn-lg" style="margin-top:20px; margin-bottom:20px; border-radius: 0 !important; width:100%;">Make Payment</a> <!--pointer-events: none; cursor: default;-->` : ""}
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header text-center">
              <h5 class="modal-title w-100" id="exampleModalLabel">CHECKOUT WITH E-TRANSFER</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p>YOUR E-TRANSFER TOTAL IS:</p>
              <p>$${totalAmount.toFixed(2)}</p>
              <p><em>Price is inclusive of Shipping, Handling and Taxes.</em></p>
              <br>
              <p>To pay with e-transfer, send your payment to:</p>
              <p>info@priceslashstore.com</p>
              <br>
              <p><strong>Please include the following information when sending your payment as a message or comment, so our team can contact you for shipping details once your payment is confirmed:</strong></p>
              <p>Order ID: ${order.orderId}</p>
            </div>
           
          </div>
        </div>
      </div>
        </div>
    </div>
  `;
  } catch (err) {
    console.error("Error loading order:", err);
    container.innerHTML = `<p class='text-danger'>Error loading order details.</p>`;
  }
}