import { Result } from "@/types/_api/result";
import { userBecomeSellerReq, UserUpdateReq } from "@/types/_api/user";
import { baseFetch, httpMethod } from "./base";
import API from "@/config/apiConfig.";

export const findUserById = async (id: number): Promise<Result> => {
  try {
    return await baseFetch(API.user.findById(id), httpMethod.GET);
  } catch (error) {
    throw new Error("An error occurred during find user profile.");
  }
};

export const userUpdate = async (formData: UserUpdateReq): Promise<Result> => {
  try {
    return await baseFetch(API.user.update, httpMethod.POST, formData);
  } catch (error) {
    throw new Error("An error occurred during update user profile.");
  }
};

export const userBecomeSeller = async (reqData: userBecomeSellerReq): Promise<Result> => {
  try {
    return await baseFetch(API.user.becomeSeller, httpMethod.POST, reqData);
  } catch (error) {
    throw new Error("An error occurred during become seller.");
  }
};
