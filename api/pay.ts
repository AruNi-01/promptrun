import { Result } from "@/types/api/result";
import { baseFetch, httpMethod } from "./base";
import API from "@/config/apiConfig.";
import { LantuWxPayReq, LantuWxPayRsp } from "@/types/api/pay";

export const lantuWxPay = async (reqData: LantuWxPayReq): Promise<Result<LantuWxPayRsp>> => {
  try {
    return await baseFetch(API.pay.lantuWxPay, httpMethod.POST, reqData);
  } catch (error) {
    throw new Error("An error occurred while get lantu wx pay qrcode.");
  }
};
