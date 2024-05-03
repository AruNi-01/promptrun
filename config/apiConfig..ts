/*
 * @Descripttion: 
 * @Author: AruNi_Lu
 * @Date: 2024-03-14 11:22:06
 */
const API_URL = process.env.API_URL || "http://localhost:8080";

const API = {
  passport: {
    login: API_URL + "/api/v1/passport/login",
    register: API_URL + "/api/v1/passport/register",
    updatePassword: API_URL + "/api/v1/passport/updatePassword",
    logout: API_URL + "/api/v1/passport/logout",
    checkIsLogin: API_URL + "/api/v1/passport/checkIsLogin",
  },

  prompt: {
    list: API_URL + "/api/v1/prompt/list",
    listByBuyerId: API_URL + "/api/v1/prompt/listByBuyerId",
    listBySellerId: API_URL + "/api/v1/prompt/listBySellerId",
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
    publish: API_URL + "/api/v1/prompt/publish",
    updatePublishStatusById: API_URL + "/api/v1/prompt/updatePublishStatusById",
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
    becomeSeller: API_URL + "/api/v1/user/becomeSeller",
  },

  seller: {
    findByUserId: (userId: number): string => {
      return API_URL + `/api/v1/seller/findByUserId/${userId}`;
    },
    update: API_URL + "/api/v1/seller/update",
    findById: (id: number): string => {
      return API_URL + `/api/v1/seller/findById/${id}`;
    },
  },

  order: {
    listAttachFullInfoBySellerUserId: API_URL + "/api/v1/order/listAttachFullInfoBySellerUserId",
    findChartsFullInfoBySellerUserId: (sellerUserId: number): string => {
      return API_URL + `/api/v1/order/findChartsFullInfoBySellerUserId/${sellerUserId}`;
    },
    listAttachPromptDetailById: (orderId: bigint): string => {
      return API_URL + `/api/v1/order/listAttachPromptDetailById/${orderId}`;
    },
    ratingById: API_URL + "/api/v1/order/ratingById",
    findById: (orderId: bigint): string => {
      return API_URL + `/api/v1/order/findById/${orderId}`;
    },
  },

  likes: {
    isLike: API_URL + "/api/v1/likes/isLike",
    like: API_URL + "/api/v1/likes/like",
  },

  pay: {
    lantuWxPay: API_URL + "/api/v1/pay/lantuWxPay",
    lantuWxPayQueryOrder: API_URL + "/api/v1/pay/lantuWxPayQueryOrder",
  },

  wallet: {
    findByUserId: (userId: number): string => {
      return API_URL + `/api/v1/wallet/findByUserId/${userId}`
    }
  }
};

export default API;
