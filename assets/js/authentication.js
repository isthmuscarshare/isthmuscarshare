// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";

import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyC5-8UqIJlChLK2Og69R8k0RxQX0z09oT0",
    authDomain: "carshare-53955.firebaseapp.com",
    projectId: "carshare-53955",
    storageBucket: "carshare-53955.appspot.com",
    messagingSenderId: "48005601757",
    appId: "1:48005601757:web:58ab51762f64d0a750fe34",
    measurementId: "G-4PWFKPYKJV"
};


// Initialize Firebase

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const trySignIn = () => {
    const auth = getAuth(app);
    const email = document.getElementById("email-input").value
    const password = document.getElementById("password-input").value
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredentials) => {
            const user = userCredentials.user
            console.log(`Email: ${user.email}`);
            console.log(`Other: ${user.uid}`);
        })
        .catch((error) => {
            console.error(error);
        })
}

const submitButton = document.getElementById("submit-button")
submitButton.onclick = trySignIn
