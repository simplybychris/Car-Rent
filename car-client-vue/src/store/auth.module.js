import AuthService from "../services/auth.service";
import axios from "axios";
const API_URL = process.env.VUE_APP_AUTH_API + "/users/";

const fetch = () => {
  return axios.get(API_URL + "roles", { withCredentials: true });
};
// const initializeData = (id) =>
//   axios.get(process.env.VUE_APP_SALON_API + "/cars/" + id).then(
//     (user) => {
//       return user.data;
//     },
//     (error) => {
//       console.log(error);
//       return;
//     }
//   );

function initialState(user) {
  return user
    ? { status: { loggedIn: true }, user }
    : { status: { loggedIn: false }, user: null };
}

export const auth = {
  namespaced: true,
  state: initialState(),
  actions: {
    async init({ commit }) {
      return fetch().then(
        (user) => {
          let userData = user.data;
          console.log("fetchowanie jesli login: ", user.data);
          commit("SET_STATE", userData);
          return Promise.resolve(user);
        },
        (error) => {
          console.log(error);
          return Promise.reject(error);
        }
      );
    },
    async setCarsDate({ commit }, id) {
      return AuthService.cars(id).then(
        (cars) => {
          let carsDate = cars.data;
          commit("setCarsDate", carsDate);
          return Promise.resolve(cars);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
    login({ commit }, user) {
      return AuthService.login(user).then(
        (user) => {
          let userData = user.data;
          console.log("logowanie: ", user.data.role);
          commit("loginSuccess", userData);
          return Promise.resolve(user);
        },
        (error) => {
          commit("loginFailure");
          return Promise.reject(error);
        }
      );
    },
    logout({ commit }) {
      AuthService.logout();
      commit("logout");
    },
    register({ commit }, user) {
      return AuthService.register(user).then(
        (response) => {
          commit("registerSuccess");
          return Promise.resolve(response.data);
        },
        (error) => {
          commit("registerFailure");
          return Promise.reject(error);
        }
      );
    },
  },
  mutations: {
    SET_STATE(user) {
      initialState(user);
    },
    setCarsDate(state, payload) {
      state.carsDate = payload;
    },
    loginSuccess(state, user) {
      state.status.loggedIn = true;
      state.user = user;
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    logout(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    registerSuccess(state) {
      state.status.loggedIn = false;
    },
    registerFailure(state) {
      state.status.loggedIn = false;
    },
  },
};
