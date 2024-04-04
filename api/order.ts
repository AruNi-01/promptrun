import API from "@/config/apiConfig.";
import { OrderListAttachFullInfoBySellerUserIdReq, OrderListAttachFullInfoRsp } from "@/types/api/order";
import { Result } from "@/types/api/result";
import { baseFetch, httpMethod } from "./base";

export const findOrderListAttachFullInfoBySellerUserId = async (
  reqData: OrderListAttachFullInfoBySellerUserIdReq
): Promise<Result<OrderListAttachFullInfoRsp>> => {
  try {
    return await baseFetch(API.order.listAttachFullInfoBySellerUserId, httpMethod.POST, reqData);
  } catch (error) {
    throw new Error("An error occurred while querying the order list.");
  }
};
