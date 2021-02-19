import axios from "axios";
let authApi = process.env.VUE_APP_AUTH_API;
class ApiService {
  getCars() {
    return axios.get(authApi + "/cars");
  }
}

export default new ApiService();
