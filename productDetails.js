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
console.log(queryString);
const productsRef = ref(db, 'products/'+(parseInt(queryString)-1));
onValue(productsRef, (snapshot)=>{
  const data = snapshot.val();
  if(data!=null){
  $("#productImagesCarousel").append(
    '<img src="'+data.productImages+'" class="d-block w-100">'
    );
$("#productTitle").text(data.productName);
$("#productPrice").text("$"+data.productPrice);
$("#productDescription").text(data.productDescription);
}
if(data==null){
    $("#errorPage").text("Error: Page Does Not Exist");
}
});
