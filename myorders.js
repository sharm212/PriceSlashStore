import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-auth.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDHLtzB6wRgh1iBH44Iwn-uEehRruAdZ8A",
    authDomain: "price-slash-3dad0.firebaseapp.com",
    projectId: "price-slash-3dad0",
    storageBucket: "price-slash-3dad0.appspot.com",
    messagingSenderId: "532707340418",
    appId: "1:532707340418:web:7deb612dda4aac3735849b"
  };
  
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const db = getDatabase(app);
  const productsRef = ref(db, 'products/');

  document.getElementById("googleSignIn").addEventListener("click", () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log("Signed in:", user.email);
      })
      .catch((error) => {
        console.error("Sign-in error:", error);
      });
  });

// Maintain session on reload (only autofill email)
onAuthStateChanged(auth, (user) => {
    const emailInput = document.getElementById("emailAddress");
    const signInStatus = document.getElementById("signInStatus");
    const submitBtn = document.getElementById("submitFormBtn");
    const signInBox = document.getElementById("signInBox");
  
    if (user) {
      signInStatus.classList.remove("text-danger");
      signInStatus.classList.add("text-muted");
      signInStatus.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-check text-muted me-1" viewBox="0 0 16 16">
        <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
        <path d="M8.256 14a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z"/>
      </svg>
      <span class="text-muted">Signed in as ${user.email}</span>
    `;
  
      if (signInBox) signInBox.remove(); fetchOrders(user.email);// Hide entire sign-in section
    } else {
      submitBtn.disabled = true;
  
      signInStatus.classList.remove("text-success");
      signInStatus.classList.add("text-danger");
      signInStatus.textContent = "❌ Please sign in to continue";
    }
  });

  import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";

const firestore = getFirestore(app);

async function fetchOrders(email) {
  try {
    const ordersRef = collection(firestore, "orders");
    const q = query(ordersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      document.querySelector(".form-container").innerHTML += `<p>No orders found.</p>`;
      return;
    }

    querySnapshot.forEach((doc) => {
      const order = doc.data();
      const orderElement = document.createElement("div");
      orderElement.className = "mb-4 text-start";
      const total = order.items.reduce((sum, item) => sum + (item.productPrice || 0), 0).toFixed(2);
      orderElement.innerHTML = `
        <div class="card shadow-sm p-3">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span><strong>Order ID:</strong> ${order.orderId}</span>
            <span><strong>Total:</strong> $${total}</span>
          </div>
          <div class="text-end">
            <a href="/orderDetails.html?id=${order.orderId}" class="btn btn-sm btn-dark">View Order</a>
          </div>
        </div>
      `;
      document.querySelector(".form-container").appendChild(orderElement);
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    document.querySelector(".form-container").innerHTML += `<p class="text-danger">Failed to load orders.</p>`;
  }
}