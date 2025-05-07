import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-database.js";

window.prerenderReady = false;
const DELAY_TIME = 30000;
console.log('Prerender Ready flag set to false');

const firebaseConfig = {
  apiKey: "AIzaSyDHLtzB6wRgh1iBH44Iwn-uEehRruAdZ8A",
  authDomain: "price-slash-3dad0.firebaseapp.com",
  databaseURL: "https://price-slash-3dad0-default-rtdb.firebaseio.com",
  projectId: "price-slash-3dad0",
  storageBucket: "price-slash-3dad0.appspot.com",
  messagingSenderId: "532707340418",
  appId: "1:532707340418:web:7deb612dda4aac3735849b"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const productsRef = ref(db, 'products/');

$("#cartSKUS").text("SKU: "+JSON.parse(localStorage.getItem("cart")) || []);
// Step 1: Get product data from Firebase
onValue(productsRef, (snapshot) => {
  const productDB = snapshot.val();
  if (productDB) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Filter out-of-stock items
    const filteredCart = cart.filter(sku => {
      const item = productDB[sku];
      return item && item.productStatus === "InStock";
    });

    // Update localStorage if any items were removed
    if (filteredCart.length !== cart.length) {
      localStorage.setItem("cart", JSON.stringify(filteredCart));
    }

    // Proceed to load the cart with updated data
    loadCart(productDB);
  }
}, { onlyOnce: true });

// Step 2: Use productDB when loading cart
function loadCart(productDB) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartList = document.getElementById("cartList");
  const emptyCart = document.getElementById("emptyCart");

  const checkoutBtn = document.getElementById("checkoutBtn");
  if (cart.length > 0) {
    checkoutBtn.style.display = "block";
  } else {
    checkoutBtn.style.display = "none";
  }

  if (cart.length === 0) {
    emptyCart.style.display = "block";
    cartList.innerHTML = "";
    return;
  }

  emptyCart.style.display = "none";
  cartList.innerHTML = "";
  var totalCartValue=0;
  cart.forEach(sku => {
    const item = productDB[sku];
    if (!item) return;
totalCartValue += item.productPrice;

const imageString = item.productImages; // fallback to empty string if undefined
const firstImage = imageString.includes(",")
  ? imageString.split(",")[0].trim()
  : imageString.trim();

    cartList.innerHTML += `
    <div class="row justify-content-center mb-4" style="padding-left:0px;padding-right:0px;margin-left:0px;margin-right:0px;">
    <div class="col-12 col-md-10 col-lg-8">
        <div class="card shadow-sm">
          <div class="row g-0 align-items-center">
            <div class="col-4">
            
              <img src="/productImages/${firstImage}" class="img-fluid rounded-start" alt="${item.productName}">
            </div>
            <div class="col-8">
              <div class="card-body">
                <h5 class="card-title mb-1">${item.productName}</h5>
                <p class="card-text text-muted small mb-1">SKU: ${sku}</p>
                <div class="d-flex justify-content-between align-items-center">
                <span>Qty: 1</span>
                <div class="d-flex align-items-center gap-2">
                  <strong>$${item.productPrice}</strong>
                  <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart('${sku}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                </svg></button>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>`;
  });
  $("#productPriceModal").text("$"+totalCartValue);
}
window.removeFromCart = function(sku) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = cart.filter(item => item.toString() !== sku.toString());
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    location.reload();
  };