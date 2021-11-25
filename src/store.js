import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

const state = {
  sidebarShow: "responsive",
  sidebarMinimize: false,
  asideShow: false,
  darkMode: false,
  idToken: null,
  idTokenLoading: false,
  currentUserEmail: "Loading...",
};

const getters = {
  getIdToken: (state) => {
    return state.idToken;
  },
  getIdTokenLoading: (state) => {
    return state.idTokenLoading;
  },
};

const mutations = {
  toggleSidebarDesktop(state) {
    const sidebarOpened = [true, "responsive"].includes(state.sidebarShow);
    state.sidebarShow = sidebarOpened ? false : "responsive";
  },
  toggleSidebarMobile(state) {
    const sidebarClosed = [false, "responsive"].includes(state.sidebarShow);
    state.sidebarShow = sidebarClosed ? true : "responsive";
  },
  set(state, [variable, value]) {
    state[variable] = value;
  },
  toggle(state, variable) {
    state[variable] = !state[variable];
  },
  setIdToken(state, token) {
    // console.log("store: setIdToken = " + token);
    state["idToken"] = token;
  },
  setIdTokenLoading(state, isLoading) {
    // console.log("store: setIdTokenLoading -> " + isLoading);
    state["idTokenLoading"] = isLoading;
  },
  setCurrentUserEmail(state, email) {
    state["currentUserEmail"] = email;
  },
};

export default new Vuex.Store({
  state,
  mutations,
  getters,
});
