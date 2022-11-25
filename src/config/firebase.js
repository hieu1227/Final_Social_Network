// import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
// import "firebase/performance";
// import "firebase/messaging";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAPnBRA7gwYeXIRIBVmi20vScq8MN070GY",
  authDomain: "project---social.firebaseapp.com",
  projectId: "project---social",
  storageBucket: "project---social.appspot.com",
  messagingSenderId: "472378424038",
  appId: "1:472378424038:web:0f2bf0bb58e106ac511927",
  measurementId: "G-QD1CJYDFEF",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
// firebase
//   .firestore()
//   .enablePersistence({ synchronizeTabs: !0 })
//   .catch(() => {
//     console.warn("DB offline support not available");
//   });

export default {
  // firestore: firebase.firestore(),
  auth,
  // firebase: firebase,
  //   notificationSupported: firebase.messaging.isSupported(),
  //   messaging: firebase.messaging.isSupported() ? firebase.messaging() : null,
};
