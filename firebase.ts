import firebase from "firebase/compat/app"
import "firebase/compat/storage";
import "firebase/compat/auth";
import "firebase/compat/firestore";

firebase.initializeApp({
    // secret
  });
 
  export const auth = firebase.auth();
  export const storage = firebase.storage();
  export const firestore = firebase.firestore()