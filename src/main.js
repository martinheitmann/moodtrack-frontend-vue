import Vue from "vue";
import CoreuiVue from "@coreui/vue";
import App from "./App";
import router from "./router/index";
import { iconsSet as icons } from "./assets/icons/icons.js";
import store from "./store";
import VueApollo from "vue-apollo";
import { ApolloClient } from "apollo-client";
import { from, ApolloLink, fromPromise } from "apollo-link";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";
import "regenerator-runtime";

import firebase from "firebase/app";
import "firebase/auth";

// Define the config for the connected Firebase project.
// Read the config props from the .env file.
const firebaseConfig = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_APP_ID,
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const asyncAuthLink = new ApolloLink((operation, forward) => {
  return fromPromise(
    new Promise((p) => p()).then(async () => {
      return await getCurrentUserIdToken();
    })
  )
    .filter((value) => Boolean(value))
    .flatMap((token) => {
      operation.setContext(({ headers = {} }) => ({
        headers: {
          ...headers,
          authorization: token,
        },
      }));
      return forward(operation);
    });
});

async function getCurrentUserIdToken() {
  return await firebase.auth().currentUser.getIdToken();
}

// Gets the current user from Firebase auth.
// Registers the onAuthStateChanged and unsubscribes on
// the first value.
firebase.getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

let serverUri = process.env.VUE_APP_SERVER_URI;

const uploadLink = createUploadLink({
  uri: serverUri,
});

// For authorization headers and graphql upload.
const additiveLink = from([asyncAuthLink, uploadLink]);

// Cache implementation, not really neccessary for this app
const cache = new InMemoryCache();

// Create the apollo client
const apolloClient = new ApolloClient({
  //link: httpLink,
  link: additiveLink,
  cache,
});

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

import Multiselect from "vue-multiselect";
import Pagination from "vue-pagination-2";

// register globally
Vue.component("multiselect", Multiselect);
Vue.component("pagination", Pagination);

Vue.use(VueApollo);
Vue.use(CoreuiVue);
Vue.prototype.$log = console.log.bind(console);

console.log("Server running in '" + process.env.NODE_ENV + "' mode");
new Vue({
  el: "#app",
  apolloProvider,
  router,
  store,
  //CIcon component documentation: https://coreui.io/vue/docs/components/icon
  icons,
  template: "<App/>",
  components: {
    App,
  },
});
