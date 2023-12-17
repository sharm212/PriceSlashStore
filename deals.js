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

  var productNumbers = [138,150,206,185,13,14,177,285,183,283,207,123,80,269,261,256,134,45,224,186,106,28,238,60];
  for (let j =0; j < 24; j++) {
    var images = data[productNumbers[j]].productImages;
    var thumbnail = images.split(',');
    var name = data[productNumbers[j]].productName;
    var price = data[productNumbers[j]].productPrice;
  
    $("#listOfDealProducts").append('<div class="col-md-3">'
    +'<div class="text-center" style="padding-top:20px;">'
    +'<a href="productDetails?'+data[productNumbers[j]].productID+'"><img src="productImages/'+thumbnail[0]+'"class="img-fluid"></a>'
    +'<p class="text-center text-muted" style="padding-top: 25px;">'+name+'</p>'
    +'<p class="text-center text-muted">$'+price+'</p>'
    +'<a role="button" class="btn btn-outline-dark" href="productDetails?'+data[productNumbers[j]].productID+'">Buy Now</a>'
    +'</div>'
    +'</div>');;
    }

});