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
var queryString = location.search.substring(1);
const productsRef = ref(db, 'products/'+(parseInt(queryString)-1));
onValue(productsRef, (snapshot)=>{
  const data = snapshot.val();
  var images = data.productImages;
    var allImages = images.split(',');

    $("meta[property='og:title']").attr("content", data.productName);
    $("meta[property='og:url']").attr("content", "https://priceslashstore.com/productDetails?"+data.productID);
    $("meta[property='og:image']").attr("content", "https://priceslashstore.com/productImages/"+allImages[0]);
    $("meta[property='og:description']").attr("content", data.productDescription.replace(/<>/g,"<br>"));
    

  if(data!=null){
  $("#mainImage").append(
    '<img src="productImages/'+allImages[0]+'" class="d-block w-100">'
    );
    allImages.forEach((element,index) => {
      if (index === 0) return;
  $("#productImagesCarousel").append(
    '<div class="carousel-item">'
    +'<img src="productImages/'+element+'" class="d-block w-100">'
   +'</div>'
    );

});
    }

$("#productTitle").text(data.productName);
$("#titleProductName").text(data.productName + " | Price Slash");
$("#productPrice").text("$"+data.productPrice+ " CAD");
$("#productPriceModal").text("$"+data.productPrice+ " CAD");
$("#SKU").text("SKU: "+data.productID);
var description = data.productDescription.replace(/<>/g,"<br>");
$("#productShareLink").attr("href","https://priceslashstore.com/productDetails?"+data.productID);
//$("#productDescription").text(description);
$("#descriptionDynamic").append('<p class="text-start text-muted" id="productDescription">'+description+'</p>');

//New Feature
if(data.productStatus == "OutOfStock"){
$("#BuyNowButton").text("Out of Stock");
$("#BuyNowButton").removeAttr('href')
$("#BuyNowButton").attr("disabled","true");
$("#BuyNowButton").attr("data-bs-toggle","");
$("#BuyNowButton").attr("data-bs-target","");
$("#BuyNowButton").off('click');
}

if(data==null){
    $("#errorPage").text("Error: Page Does Not Exist");
}

});