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

//For HomePage
if(document.URL == "https://priceslashstore.com/"){
recentlyAdded();}
//For HomePage

//For Products Page
if(document.URL == "https://priceslashstore.com/products"){
let start=0;
let end = 4;
myfunc(start,end);

$( "#loadMore" ).click(function() {
  start=start+4;
   end=end+4;
 myfunc(start,end);
  });
function myfunc(starts,ends){
  
  onValue(productsRef, (snapshot)=>{
    const data = snapshot.val();
//Needs Optimization    
data.forEach(function(item, index, object){
  if (item.productStatus == "OutOfStock") {
    object.splice(index, 1);
  }
});

    for (let i =starts; i < ends; i++) {
if(i==data.length){
  $( "#loadMore" ).remove();
  return
}

else{
    var images = data[i].productImages;
    var thumbnail = images.split(',');
    var name = data[i].productName;
    var price = data[i].productPrice;
    $("#listOfProducts").append('<div class="col-md-3">'
    +'<div class="text-center" style="padding-top:20px;">'
    +'<a href="productDetails?'+data[i].productID+'"><img src="productImages/'+thumbnail[0]+'"class="img-fluid"></a>'
    +'<p class="text-center text-muted" style="padding-top: 25px;">'+name+'</p>'
    +'<p class="text-center text-muted">$'+price+'</p>'
    +'<a role="button" class="btn btn-outline-dark" href="productDetails?'+data[i].productID+'">Buy Now</a>'
    +'</div>'
    +'</div>');}
    }
    if(ends==data.length){
      $( "#loadMore" ).remove();
      return
    }
  });
}}

//Function for HomePage
function recentlyAdded(){
  
  onValue(productsRef, (snapshot)=>{
    const data = snapshot.val();
//Needs Optimization    
data.forEach(function(item, index, object){
  if (item.productStatus == "OutOfStock") {
    object.splice(index, 1);
  }
});

    for (let i =data.length -4; i < data.length; i++) {
    var images = data[i].productImages;
    var thumbnail = images.split(',');
    var name = data[i].productName;
    var price = data[i].productPrice;
    $("#recentlyAdded").append('<div class="col-md-3">'
    +'<div class="text-center" style="padding-top:20px;">'
    +'<a href="productDetails?'+data[i].productID+'"><img src="productImages/'+thumbnail[0]+'"class="img-fluid"></a>'
    +'<p class="text-center text-muted" style="padding-top: 25px;">'+name+'</p>'
    +'<p class="text-center text-muted">$'+price+'</p>'
    +'</div>'
    +'</div>');
    }
    var productNumbers = [0,4,13,5];
    for (let j =0; j < 4; j++) {
      var images = data[productNumbers[j]].productImages;
      var thumbnail = images.split(',');
      var name = data[productNumbers[j]].productName;
      var price = data[productNumbers[j]].productPrice;
    
      $("#bestSellers").append('<div class="col-md-3">'
      +'<div class="text-center" style="padding-top:20px;">'
      +'<a href="productDetails?'+data[productNumbers[j]].productID+'"><img src="productImages/'+thumbnail[0]+'"class="img-fluid"></a>'
      +'<p class="text-center text-muted" style="padding-top: 25px;">'+name+'</p>'
      +'<p class="text-center text-muted">$'+price+'</p>'
      +'</div>'
      +'</div>');
      }

  });
}

