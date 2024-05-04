import { Result } from "@/types/api/result";
import { baseFetch, httpMethod } from "./base";
import API from "@/config/apiConfig.";
import { BalancePayReq, BalancePayRsp, LantuWxPayQueryOrderResp, LantuWxPayReq, LantuWxPayRsp } from "@/types/api/pay";

export const lantuWxPay = async (reqData: LantuWxPayReq): Promise<Result<LantuWxPayRsp>> => {
  try {
    return await baseFetch(API.pay.lantuWxPay, httpMethod.POST, reqData);
  } catch (error) {
    throw new Error("An error occurred while get lantu wx pay qrcode.");
  }
};

export const balancePay = async (reqData: BalancePayReq): Promise<Result<BalancePayRsp>> => {
  try {
    return await baseFetch(API.pay.balancePay, httpMethod.POST, reqData);
  } catch (error) {
    throw new Error("An error occurred while balance pay.");
  }
};

export const lantuWxPayQueryOrder = async (reqData: { orderId: bigint }): Promise<Result<LantuWxPayQueryOrderResp>> => {
  try {
    return await baseFetch(API.pay.lantuWxPayQueryOrder, httpMethod.POST, reqData);
  } catch (error) {
    throw new Error("An error occurred while query lantu wx pay order.");
  }
};
