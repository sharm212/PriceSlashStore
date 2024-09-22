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

document.addEventListener("DOMContentLoaded", function() {
  const path = window.location.pathname;
  
  // Check if the URL has the SEO-friendly format
  if (path.startsWith('/productDetails/')) {
      const urlParts = path.split('/');
      
      // Assuming URL structure is /productDetails/{id}/{slug}, extract the ID
      const productID = urlParts[2]; // '405' in this case

      if (productID) {
          // Redirect to productDetails.html with the correct query parameter
          window.location.href = `/productDetails?${productID}`;
      }
  }
});





//var queryString = location.search.substring(1);
//This removes any characters and extracts the number
//queryString = queryString.replace(/^\D+/g, '');

//Testing new method

// Example usage with a URL that might come with extra query parameters
const currentURL = window.location.href; // This would typically be the current page's URL
const productID = getProductIDFromURL(currentURL);

function getProductIDFromURL(url) {
  // Get the pathname from the URL (this will exclude any query parameters or fragments)
  const pathname = new URL(url).pathname;
  
  // Split the path by slashes
  const parts = pathname.split('/');
  
  // Find the part after 'productDetails'
  const productDetailsIndex = parts.indexOf('productDetails');
  
  // Return the next part (the product ID)
  return parts[productDetailsIndex + 1]; // This should be the product ID
}
//Testing new method
console.log("*******");
console.log(productID);
const productsRef = ref(db, 'products/'+(parseInt(productID)-1));
onValue(productsRef, (snapshot)=>{
  const data = snapshot.val();
  var images = data.productImages;
    var allImages = images.split(',');

    $("meta[property='og:title']").attr("content", data.productName);
    $("meta[property='og:url']").attr("content", "https://priceslashstore.com/productDetails?"+data.productID);
    $("meta[property='og:image']").attr("content", "https://priceslashstore.com/productImages/"+allImages[0]);
    var prodDesc = data.productDescription.replace(/<><>/g, "\n");
    $("meta[property='og:description']").attr("content", prodDesc.replace(/<>/g, "\n"));
    
//This is a try for adding rich content
/////////////////////////////////////////////////////////////////////
// Example of dynamically loading product data and injecting JSON-LD

// Assuming you have some dynamic way of getting product data (e.g., from an API or database)
const productData = {
  name: data.productName,
  image: "https://priceslashstore.com/productImages/"+allImages[0],
  description: data.productDescription.replace(/<><>/g, " | ").replace(/<>/g, " | "),
  sku: data.productID,
  price: data.productPrice,
  currency: "CAD",
  availability: data.productStatus,
  url: "https://priceslashstore.com/productDetails?"+data.productID,
  condition: "NewCondition"
};

// Function to inject the JSON-LD structured data into the page
function injectStructuredData(product) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.image,
    "description": product.description,
    "sku": product.sku,
    "offers": {
      "@type": "Offer",
      "priceCurrency": product.currency,
      "price": product.price,
      "availability": `https://schema.org/${product.availability}`,
      "url": product.url,
      "itemCondition": `https://schema.org/${product.condition}`,
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "CA"  // Shipping only to Canada
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 2,
            "unitCode": "DAY"  // Dispatch time: 1-2 days
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 10,
            "unitCode": "DAY"  // Delivery time: 1-10 days
          }
        },
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0.00",  // Free shipping
          "currency": product.currency
        },
        "shippingLabel": "Free Standard Shipping"
      }
    }
  };

  // Convert the structured data to JSON-LD format
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(structuredData);
  
  // Append the JSON-LD script to the head of the page
  document.head.appendChild(script);
}

// Inject the structured data when the product page is dynamically generated
injectStructuredData(productData);


/////////////////////////////////////////////////////////////////////
//

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