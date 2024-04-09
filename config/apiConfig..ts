const API_URL = process.env.API_URL || "http://localhost:8080";

const API = {
  passport: {
    login: API_URL + "/api/v1/passport/login",
    register: API_URL + "/api/v1/passport/register",
    updatePassword: API_URL + "/api/v1/passport/updatePassword",
    logout: API_URL + "/api/v1/passport/logout",
  },

  prompt: {
    list: API_URL + "/api/v1/prompt/list",
    listByBuyerId: API_URL + "/api/v1/prompt/listByBuyerId",
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
    findById: (id: number): string => {
      return API_URL + `/api/v1/user/findById/${id}`;
    },
    update: API_URL + "/api/v1/user/update",
  },

  seller: {
    findByUserId: (userId: number): string => {
      return API_URL + `/api/v1/seller/findByUserId/${userId}`;
    },
    update: API_URL + "/api/v1/seller/update",
  },

  order: {
    listAttachFullInfoBySellerUserId: API_URL + "/api/v1/order/listAttachFullInfoBySellerUserId",
    findChartsFullInfoBySellerUserId: (sellerUserId: number): string => {
      return API_URL + `/api/v1/order/findChartsFullInfoBySellerUserId/${sellerUserId}`;
    },
  },

  likes: {
    isLike: API_URL + "/api/v1/likes/isLike",
    like: API_URL + "/api/v1/likes/like",
  },
};

export default API;
