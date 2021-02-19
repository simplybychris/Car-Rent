import axios from "axios";

const API_URL = process.env.VUE_APP_AUTH_API + "/users/";

class AuthService {
  login(user) {
    return axios.post(
      API_URL + "login",
      {
        email: user.email,
        password: user.password,
      },
      {
        withCredentials: true,
      }
    );
  }

  cars(id) {
    return axios.get(process.env.VUE_APP_SALON_API + "/cars/" + id);
  }

  checkRole() {
    return axios.get(API_URL + "roles", {
      withCredentials: true,
    });
  }

  logout() {
    sessionStorage.clear();
    return axios.post(API_URL + "logout", {}, { withCredentials: true });
  }

  register(user) {
    return axios.post(API_URL + "register", {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password: user.password,
      address: user.address,
      pesel: user.pesel,
    });
  }
}

export default new AuthService();
