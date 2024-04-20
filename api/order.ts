import API from "@/config/apiConfig.";
import {
  ChartsRsp,
  Order,
  OrderListAttachFullInfoBySellerUserIdReq,
  OrderListAttachFullInfoRsp,
  OrderListAttachPromptDetailRsp,
} from "@/types/api/order";
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

export const findChartsFullInfoBySellerUserId = async (sellerUserId: number): Promise<Result<ChartsRsp>> => {
  try {
    return await baseFetch(API.order.findChartsFullInfoBySellerUserId(sellerUserId), httpMethod.GET);
  } catch (error) {
    throw new Error("An error occurred while querying the charts full info.");
  }
};

export const findOrderListAttachPromptDetailById = async (
  orderId: number
): Promise<Result<OrderListAttachPromptDetailRsp>> => {
  try {
    return await baseFetch(API.order.listAttachPromptDetailById(orderId), httpMethod.GET);
  } catch (error) {
    throw new Error("An error occurred while querying the order list.");
  }
};

export const orderRatingById = async (queryParamObj: { orderId: number; rating: number }): Promise<Result> => {
  try {
    return await baseFetch(API.order.ratingById, httpMethod.POST, undefined, queryParamObj);
  } catch (error) {
    throw new Error("An error occurred while rating the order.");
  }
};

export const findOrderById = async (orderId: number): Promise<Result<Order>> => {
  try {
    return await baseFetch(API.order.findById(orderId), httpMethod.GET);
  } catch (error) {
    throw new Error("An error occurred while querying the order.");
  }
};
