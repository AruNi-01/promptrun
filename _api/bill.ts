import { Result } from "@/types/_api/result";
import { baseFetch, httpMethod } from "@/_api/base";
import API from "@/config/apiConfig.";
import { BillListByUserIdReq, BillListRsp } from "@/types/_api/bill";

export const findBillListByUserId = async (reqData: BillListByUserIdReq): Promise<Result<BillListRsp>> => {
  try {
    return await baseFetch(API.bill.listByUserId, httpMethod.POST, reqData);
  } catch (error) {
    throw new Error("An error occurred while querying the bill list.");
  }
};
