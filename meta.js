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

    var link = document.createElement('meta');
      link.setAttribute('property', 'og:url');
        link.content = "https://priceslashstore.com/productDetails?"+data.productID;
          document.getElementsByTagName('head')[0].appendChild(link);

          var title = document.createElement('meta');
          title.setAttribute('property', 'og:title');
            title.content = data.productName;
              document.getElementsByTagName('head')[0].appendChild(title);

   // $("meta[property='og:title']").attr("content", data.productName);
   // $("meta[property='og:url']").attr("content", "https://priceslashstore.com/productDetails?"+data.productID);
   // $("meta[property='og:image']").attr("content", "https://priceslashstore.com/productImages/"+allImages[0]);
   // $("meta[property='og:description']").attr("content", data.productDescription.replace(/<>/g,"<br>"));
});