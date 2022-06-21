import firebase from "firebase/compat/app"
import "firebase/compat/storage";
import "firebase/compat/auth";
import "firebase/compat/firestore";

firebase.initializeApp({
    apiKey: "AIzaSyCiX7J3nvakpYZYGMWWfc5tJMjGfDx3GBM",
    authDomain: "gofreelance-20ebc.firebaseapp.com",
    projectId: "gofreelance-20ebc",
    storageBucket: "gofreelance-20ebc.appspot.com",
    messagingSenderId: "760513600919",
    appId: "1:760513600919:web:34b43345e16462189178d2"
  });
 
  export const auth = firebase.auth();
  export const storage = firebase.storage();
  export const firestore = firebase.firestore()