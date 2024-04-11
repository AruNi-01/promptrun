import { Seller, SellerUpdateReq } from "@/types/api/seller";
import { baseFetch, httpMethod } from "./base";
import API from "@/config/apiConfig.";
import { Result } from "@/types/api/result";

export const findSellerByUserId = async (userId: number): Promise<Result<Seller>> => {
  try {
    return await baseFetch(API.seller.findByUserId(userId), httpMethod.GET);
  } catch (error) {
    throw new Error("An error occurred during find seller profile.");
  }
};

export const sellerUpdate = async (formData: SellerUpdateReq): Promise<Result> => {
  try {
    return await baseFetch(API.seller.update, httpMethod.POST, formData);
  } catch (error) {
    throw new Error("An error occurred during update seller profile.");
  }
};

export const findSellerById = async (id: number): Promise<Result<Seller>> => {
  try {
    return await baseFetch(API.seller.findById(id), httpMethod.GET);
  } catch (error) {
    throw new Error("An error occurred during find seller profile.");
  }
};
