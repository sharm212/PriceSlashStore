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
    loadCart(productDB);
  }
}, {
  onlyOnce: true
});

// Step 2: Use productDB when loading cart
function loadCart(productDB) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartList = document.getElementById("cartList");
  const emptyCart = document.getElementById("emptyCart");

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
    cartList.innerHTML += `
    <div class="row justify-content-center mb-4" style="padding-left:0px;padding-right:0px;margin-left:0px;margin-right:0px;">
    <div class="col-12 col-md-10 col-lg-8">
        <div class="card shadow-sm">
          <div class="row g-0 align-items-center">
            <div class="col-4">
            
              <img src="/productImages/IMG_${item.productID}_1.PNG" class="img-fluid rounded-start" alt="${item.productName}">
            </div>
            <div class="col-8">
              <div class="card-body">
                <h5 class="card-title mb-1">${item.productName}</h5>
                <p class="card-text text-muted small mb-1">SKU: ${sku}</p>
                <div class="d-flex justify-content-between align-items-center">
                <span>Qty: 1</span>
                <div class="d-flex align-items-center gap-2">
                  <strong>$${item.productPrice}</strong>
                  <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart('${sku}')">Remove</button>
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