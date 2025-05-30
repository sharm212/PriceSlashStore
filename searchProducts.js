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

var vars = {};
var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
    vars[key] = value;    
});

var search = vars.search.replace(/\+/g," ");
//search = search.toLowerCase();
//const searchedTitle = search.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
$("#searchTitle").text("Product Results for: "+search);
$("#productSearchLink").attr("href","https://priceslashstore.com/searchProducts.html?search="+vars.search);

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
    const data1 = snapshot.val();
    const data = [];
//Needs Optimization    
//Misses Some Items - Needs Fixing

data1.forEach(function(item, index, object){
  if (item.productStatus == "OutOfStock") {
  }
  else{
    data.push(item);
      }
});
var arr = search.split(" ").map(function(item) {
  return item.trim();
});
for(var ind=0; ind<arr.length; ind++){
for(var i=0; i<10; i++){
data.forEach(function(item, index, object){
    if (item.productName.toLowerCase().includes(arr[ind].toLowerCase(),0)==false) {
        object.splice(index, 1);
    } 
  });
}}
    //If Statement to check if no results are found
     if(data.length==0){
         $("#searchTitle").text("No Results Found for: "+search);
     }

    for (let i =starts; i < ends; i++) {
if(i==data.length){
  $( "#loadMore" ).remove();
  return
}

else{
  if(data[i].productStatus == "InStock"){
    var images = data[i].productImages;
    var thumbnail = images.split(',');
    var name = data[i].productName;
    var price = data[i].productPrice;
    $("#listOfProducts").append('<div class="col-md-3">'
    +'<div class="text-center" style="padding-top:20px;">'
    +'<a href="productDetails/'+data[i].productID+'/'+data[i].productName.replace(/\s*-\s*/g, '-').replace(/\s+/g, '-')+'"><img src="https://priceslashstore.com/cdn-cgi/image/width=auto,format=auto,quality=auto/https://priceslashstore.com/productImages/'+thumbnail[0]+'"class="img-fluid"></a>'    +'<p class="text-center text-muted" style="padding-top: 25px;">'+name+'</p>'
    +'<p class="text-center text-muted">$'+price+'</p>'
    +'<a role="button" class="btn btn-outline-dark" href="productDetails?'+data[i].productID+'">Buy Now</a>'
    +'</div>'
    +'</div>');}
}
    }
    if(ends==data.length){
      $( "#loadMore" ).remove();
      return
    }

  });
  
}

