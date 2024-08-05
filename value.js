import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAgRICQruGb93BYcJOqrBmdLpoJXMFK5sg",
  authDomain: "tradein-2f1b7.firebaseapp.com",
  databaseURL: "https://tradein-2f1b7-default-rtdb.firebaseio.com",
  projectId: "tradein-2f1b7",
  storageBucket: "tradein-2f1b7.appspot.com",
  messagingSenderId: "1073389146931",
  appId: "1:1073389146931:web:fce19db8455ab19feb2446",
  measurementId: "G-MV8L74C0KY"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();
const productsRef = ref(db, 'products/');


onValue(productsRef, (snapshot)=>{
    const data = snapshot.val();
    console.log(data);
    new TomSelect('#select-tools',{
        maxItems: 1,
        valueField: 'productID',
        labelField: 'productName',
        searchField: 'productName',
        options:data,
        create: false,
        render: {
            option: function(data, escape) {
                return '<div>' +
                        '<span class="title align-items-start">' + escape(data.productName) + '</span>' +
                        ' - $'+'<span class="url text-end">' + escape(data.productPrice) + '</span>' +
                    '</div>';
            },
            item: function(data, escape) {
                return '<div title="' + '">'+ escape(data.productName)+ " - $"+ escape(data.productPrice) + '</div>';
                        }
        }
    });
})

