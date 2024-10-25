import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-database.js";

const functions = require("firebase-functions");
const { submitShippingForm } = require("./shippingform");

exports.submitShippingForm = submitShippingForm;

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
//if(document.URL == "https://priceslashstore.com/"){
//recentlyAdded();}
//For HomePage priceslashstore.com/products
//For Products Page
if(document.URL.indexOf("priceslashstore.com/products")>0){

//Test Code for auto load
$(window).scroll(function () {
  if ($(window).scrollTop() + $(window).height() > $(document).height() - 200) {
    $("#loadMore").click();
  }
});
//Test Code for auto load

let start=0;
let end = 8;

document.getElementById("sortPrice").addEventListener("change", function() {
  // Clear the existing products
  document.getElementById("listOfProducts").innerHTML = '';
  
  // Reset the start and end variables for paging
  start = 0;
  end = 8;
  $( "#loadMore" ).attr("disabled", false);
  $("#loadMore").show();
  // Call the function to reload products based on the new sort option
  myfunc(start, end);
});
myfunc(start,end);

$( "#loadMore" ).click(function() {
  start=start+8;
   end=end+8;
 myfunc(start,end);
  });
function myfunc(starts,ends){
   onValue(productsRef, (snapshot)=>{
    const data1 = snapshot.val();
    const data = [];

//Needs Optimization    
for(var i=0; i<1; i++){
data1.forEach(function(item, index, object){
  if (item.productStatus == "OutOfStock") {
    
  }
  else{
data.push(item);
  }
});}
$("#noOfProducts").text(data.length + " results");
 const dataLowToHigh = data.slice().sort((a, b) => a.productPrice - b.productPrice);
  const dataHighToLow = data.slice().sort((a, b) => b.productPrice - a.productPrice);
 const sortOption = document.getElementById("sortPrice").value;
 const sortedData = (sortOption === "lowToHigh") ? dataLowToHigh : dataHighToLow;


    for (let i =starts; i < ends; i++) {
      
if(i==data.length){
  $( "#loadMore" ).attr("disabled", true);
  $( "#loadMore" ).hide();
  return
}
if (i >= sortedData.length) {
  break; // Exit the loop if we've processed all available items
}

else{
 
    var images = sortedData[i].productImages;
    var thumbnail = images.split(',');
    var name = sortedData[i].productName;
    var price = sortedData[i].productPrice;
    $("#listOfProducts").append('<div class="col-md-3">'
    +'<div class="text-center" style="padding-top:20px;">'
    +'<a href="productDetails/'+sortedData[i].productID+'/'+sortedData[i].productName.replace(/\s*-\s*/g, '-').replace(/\s+/g, '-')+'"><img src="https://priceslashstore.com/cdn-cgi/image/width=auto,format=auto,quality=auto/https://priceslashstore.com/productImages/'+thumbnail[0]+'"class="img-fluid"></a>'
    +'<p class="text-center text-muted" style="padding-top: 25px;">'+name+'</p>'
    +'<p class="text-center text-muted">$'+price+'</p>'
    +'<a role="button" class="btn btn-outline-dark" href="productDetails?'+sortedData[i].productID+'">Buy Now</a>'
    +'</div>'
    +'</div>');
  }
  
    }
    if (ends >= sortedData.length) {
      $( "#loadMore" ).attr("disabled", true);
      $("#loadMore").hide();  // Hide if all products are loaded
    } else {
      $( "#loadMore" ).attr("disabled", false);
      $("#loadMore").show();  // Show if more products are available
    }
  });
}}
else{
  recentlyAdded();
}

//Function for HomePage
function recentlyAdded(){
  
  onValue(productsRef, (snapshot)=>{
    const data = snapshot.val();
//Needs Optimization    
//data.forEach(function(item, index, object){
 // if (item.productStatus == "OutOfStock") {
 //   object.splice(index, 1);
 // }
//});

    for (let i =data.length -4; i < data.length; i++) {
    var images = data[i].productImages;
    var thumbnail = images.split(',');
    var name = data[i].productName;
    var price = data[i].productPrice;
    $("#recentlyAdded").append('<div class="col-md-3">'
    +'<div class="text-center" style="padding-top:20px;">'
    +'<a href="productDetails/'+data[i].productID+'/'+data[i].productName.replace(/\s*-\s*/g, '-').replace(/\s+/g, '-')+'"><img src="https://priceslashstore.com/cdn-cgi/image/width=auto,format=auto,quality=auto/https://priceslashstore.com/productImages/'+thumbnail[0]+'"class="img-fluid"></a>'
    +'<p class="text-center text-muted" style="padding-top: 25px;">'+name+'</p>'
    +'<p class="text-center text-muted">$'+price+'</p>'
    +'</div>'
    +'</div>');
    }
    var productNumbers = [290,276,13,236];
    for (let j =0; j < 4; j++) {
      var images = data[productNumbers[j]].productImages;
      var thumbnail = images.split(',');
      var name = data[productNumbers[j]].productName;
      var price = data[productNumbers[j]].productPrice;
    
      $("#bestSellers").append('<div class="col-md-3">'
      +'<div class="text-center" style="padding-top:20px;">'
      +'<a href="productDetails/'+data[productNumbers[j]].productID+'/'+data[productNumbers[j]].productName.replace(/\s*-\s*/g, '-').replace(/\s+/g, '-')+'"><img src="https://priceslashstore.com/cdn-cgi/image/width=auto,format=auto,quality=auto/https://priceslashstore.com/productImages/'+thumbnail[0]+'"class="img-fluid"></a>'
      +'<p class="text-center text-muted" style="padding-top: 25px;">'+name+'</p>'
      +'<p class="text-center text-muted">$'+price+'</p>'
      +'</div>'
      +'</div>');
      }

  });
}

