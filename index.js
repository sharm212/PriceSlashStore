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
const db = getDatabase();
const productsRef = ref(db, 'products/');
onValue(productsRef, (snapshot)=>{
  const data = snapshot.val();
  data.forEach(element => {
    var images = element.productImages;
    var thumbnail = images.split(',');
    var name = element.productName;
    var price = element.productPrice;
    $("#listOfProducts").append('<div class="col-sm-4">'
    +'<div class="classWithPad text-center">'
    +'<img src="/productImages/'+thumbnail[0]+'"class="img-fluid">'
    +'<p class="text-center text-muted" style="padding-top: 25px;">'+name+'</p>'
    +'<p class="text-center text-muted">$'+price+'</p>'
    +'<a role="button" class="btn btn-light btn-lg" href="productDetails.html?'+element.productID+'">Buy Now</a>'
    +'</div>'
    +'</div>');
    
  });
});
