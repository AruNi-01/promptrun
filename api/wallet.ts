import API from "@/config/apiConfig.";
import { baseFetch, httpMethod } from "./base";
import { Result } from "@/types/api/result";
import { Wallet } from "@/types/api/wallet";

export const findWaletByUserId = async (userId: number): Promise<Result<Wallet>> => {
  try {
    return await baseFetch(API.wallet.findByUserId(userId), httpMethod.GET);
  } catch (error) {
    throw new Error("An error occurred during find user wallet.");
  }
};