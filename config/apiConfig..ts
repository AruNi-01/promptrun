const API_URL = process.env.API_URL || "http://localhost:8080";

const API = {
  passport: {
    login: API_URL + "/api/v1/passport/login",
    register: API_URL + "/api/v1/passport/register",
    logout: API_URL + "/api/v1/passport/logout",
  },

  user: {
    getUserInfo: API_URL + "/api/v1/user/userInfo",
  },
};

export default API;
