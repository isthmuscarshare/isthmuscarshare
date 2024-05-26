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
const analytics = getAnalytics(app)
export const auth = getAuth(app);

export const trySignIn = () => {
    const email = document.getElementById("email-input").value
    const password = document.getElementById("password-input").value
    signInWithEmailAndPassword(auth, email, password)
        .then((_userCredentials) => {
            //Navigate back to home page
            window.location = "/index.html"
        })
        .catch((error) => {
            console.error(error);
        })
}

/**
 * A function that takes a callback to call when the auth state changes.
 * Specifically, if a user signs in, then we call the callback with the signed in
 * user's name, or their email if that is not available, If the user signs out,
 * we call the callback with null
 **/
export const updateName = (nameChangeCallback) => {
    var name = null
    auth.onAuthStateChanged((user) => {
        if(user != null){
            const info = user.providerData
                .filter(x => x.providerId === "password")
            if(info.length > 0 && info[0].displayName){
                name = info[0].displayName
            }
            else{
                name = user.email
            }
        }
        else{
            name = null;
        }
        nameChangeCallback(name)
    })
}

export const signOut = async () => {
    await auth.signOut()
}
