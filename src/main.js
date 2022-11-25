import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import '@/assets/font-awesome/css/all.min.css';

// import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
// import "firebase/performance";
// import "firebase/messaging";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

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
const db = getFirestore(app)
const storage = getStorage(app);


export default {
  // firestore: firebase.firestore(),
  auth,
  db,
  storage,

  // firebase: firebase,
  //   notificationSupported: firebase.messaging.isSupported(),
  //   messaging: firebase.messaging.isSupported() ? firebase.messaging() : null,
};

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

Vue.config.productionTip = false


new Vue({
  router,
  store,
  
  render: h => h(App)
}).$mount('#app')
