import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-database.js";

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

const urlParams = new URLSearchParams(window.location.search);
const brandParam = (urlParams.get("brand") || urlParams.get("name") || "").toLowerCase();

if (!brandParam) {
  document.getElementById("listOfProducts").innerHTML = "<p class='text-center'>No brand selected.</p>";

  const canonicalLink = document.querySelector("link[rel='canonical']");
  if (canonicalLink) {
    canonicalLink.setAttribute("href", `https://priceslashstore.com/brand?name=${encodeURIComponent(brandParam)}`);
  } else {
    const newCanonical = document.createElement("link");
    newCanonical.setAttribute("rel", "canonical");
    newCanonical.setAttribute("href", `https://priceslashstore.com/brand?name=${encodeURIComponent(brandParam)}`);
    document.head.appendChild(newCanonical);
  }

} else {
  document.title = `${brandParam.charAt(0).toUpperCase() + brandParam.slice(1)} | Price Slash`;
  loadProducts(0, 8);
}

let start = 0;
let end = 8;

document.getElementById("sortPrice").addEventListener("change", () => {
  document.getElementById("listOfProducts").innerHTML = '';
  start = 0;
  end = 8;
  $("#loadMore").attr("disabled", false).show();
  loadProducts(start, end);
});

$("#loadMore").click(() => {
  start += 8;
  end += 8;
  loadProducts(start, end);
});

function loadProducts(starts, ends) {
  onValue(productsRef, (snapshot) => {
    const rawData = snapshot.val();
    const dataArray = Object.values(rawData || {});

    const filtered = dataArray.filter(item =>
      item.brand && item.brand.toLowerCase() === brandParam &&
      item.productStatus !== "OutOfStock"
    );

    $("#noOfProducts").text(`${filtered.length} results`);

    const sortOption = document.getElementById("sortPrice").value;
    const sorted = sortOption === "lowToHigh"
      ? filtered.slice().sort((a, b) => a.productPrice - b.productPrice)
      : filtered.slice().sort((a, b) => b.productPrice - a.productPrice);

    for (let i = starts; i < ends && i < sorted.length; i++) {
      const item = sorted[i];
      const thumbnail = (item.productImages || "").split(',')[0];
      const linkSlug = item.productName.replace(/\s*-\s*/g, '-').replace(/\s+/g, '-');

      $("#listOfProducts").append(`
        <div class="col-md-3">
          <div class="text-center" style="padding-top:20px;">
            <a href="productDetails/${item.productID}/${linkSlug}">
              <img src="https://priceslashstore.com/cdn-cgi/image/width=auto,format=auto,quality=auto/https://priceslashstore.com/productImages/${thumbnail}" class="img-fluid">
            </a>
            <p class="text-center text-muted" style="padding-top: 25px;">${item.productName}</p>
            <p class="text-center text-muted">$${item.productPrice}</p>
            <a role="button" class="btn btn-outline-dark" href="productDetails?${item.productID}">Buy Now</a>
          </div>
        </div>
      `);
    }

    if (ends >= sorted.length) {
      $("#loadMore").attr("disabled", true).hide();
    }
  });
}