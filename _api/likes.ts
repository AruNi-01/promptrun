import { Result } from "@/types/_api/result";
import { baseFetch, httpMethod } from "./base";
import API from "@/config/apiConfig.";
import { LikeReq } from "@/types/_api/likes";

export const LikeErrCode = {
  LikeIntervalTooShort: 40007,
};

export const isLike = async (queryParamsObj: {}): Promise<Result<boolean>> => {
  try {
    return await baseFetch(API.likes.isLike, httpMethod.GET, undefined, queryParamsObj);
  } catch (error) {
    throw new Error("An error occurred while querying user is like prompt.");
  }
};

export const like = async (data: LikeReq): Promise<Result> => {
  try {
    return await baseFetch(API.likes.like, httpMethod.POST, data);
  } catch (error) {
    throw new Error("An error occurred while like.");
  }
};
