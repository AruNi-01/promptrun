const API_URL = process.env.API_URL || "http://localhost:8080";

const API = {
  passport: {
    login: API_URL + "/api/v1/passport/login",
    register: API_URL + "/api/v1/passport/register",
    logout: API_URL + "/api/v1/passport/logout",
  },

  prompt: {
    list: API_URL + "/api/v1/prompt/list",
    findById: (id: number): string => {
      return API_URL + `/api/v1/prompt/findById/${id}`;
    },
    findFullInfoById: (id: number): string => {
      return API_URL + `/api/v1/prompt/findFullInfoById/${id}`;
    },

    findImgListByPromptId: (promptId: number): string => {
      return API_URL + `/api/v1/prompt/findImgListByPromptId/${promptId}`;
    },
    findMasterImgByPromptId: (promptId: number): string => {
      return API_URL + `/api/v1/prompt/findMasterImgByPromptId/${promptId}`;
    },
    findMasterImgListByPromptIds: API_URL + "/api/v1/prompt/findMasterImgListByPromptIds",
  },

  model: {
    list: API_URL + "/api/v1/model/list",
    findById: (id: number): string => {
      return API_URL + `/api/v1/model/findById/${id}`;
    },
  },

  user: {
    getUserInfo: API_URL + "/api/v1/user/userInfo",
  },
};

export default API;
