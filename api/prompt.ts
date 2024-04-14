import API from "@/config/apiConfig.";
import { baseFetch, httpMethod } from "./base";
import { Result } from "@/types/api/result";
import {
  PromptFullInfo,
  PromptListByBuyerIdReq,
  PromptListBySellerIdReq,
  PromptListReq,
  PromptPublishReq,
} from "@/types/api/prompt";

export const findPromptList = async (reqData: PromptListReq): Promise<Result> => {
  try {
    return await baseFetch(API.prompt.list, httpMethod.POST, reqData);
  } catch (error) {
    throw new Error("An error occurred while querying the prompt list.");
  }
};

export const findPromptListByBuyerId = async (reqData: PromptListByBuyerIdReq): Promise<Result> => {
  try {
    return await baseFetch(API.prompt.listByBuyerId, httpMethod.POST, reqData);
  } catch (error) {
    throw new Error("An error occurred while querying the prompt list by buyer.");
  }
};

export const findPromptById = async (id: number): Promise<Result> => {
  try {
    return await baseFetch(API.prompt.findById(id), httpMethod.GET);
  } catch (error) {
    throw new Error("An error occurred while querying the prompt.");
  }
};

export const findPromptFullInfoById = async (id: number): Promise<Result<PromptFullInfo>> => {
  try {
    return await baseFetch(API.prompt.findFullInfoById(id), httpMethod.GET);
  } catch (error) {
    throw new Error("An error occurred while querying the prompt.");
  }
};

export const findPromptMasterImgByPromptId = async (promptId: number): Promise<Result> => {
  try {
    return await baseFetch(API.prompt.findMasterImgByPromptId(promptId), httpMethod.GET);
  } catch (error) {
    throw new Error("An error occurred while querying the prompt.");
  }
};

export const findPromptImgListByPromptId = async (promptId: number): Promise<Result> => {
  try {
    return await baseFetch(API.prompt.findImgListByPromptId(promptId), httpMethod.GET);
  } catch (error) {
    throw new Error("An error occurred while querying the prompt.");
  }
};

export const findPromptMasterImgListByPromptIds = async (promptIds: number[]): Promise<Result> => {
  try {
    return await baseFetch(API.prompt.findMasterImgListByPromptIds, httpMethod.POST, { promptIds: promptIds });
  } catch (error) {
    throw new Error("An error occurred while querying the prompt.");
  }
};

export const findPromptListBySellerId = async (reqData: PromptListBySellerIdReq): Promise<Result> => {
  try {
    return await baseFetch(API.prompt.listBySellerId, httpMethod.POST, reqData);
  } catch (error) {
    throw new Error("An error occurred while querying the prompt list by seller.");
  }
};

export const promptPublish = async (reqData: PromptPublishReq): Promise<Result> => {
  try {
    return await baseFetch(API.prompt.publish, httpMethod.POST, reqData);
  } catch (error) {
    throw new Error("An error occurred while publishing the prompt.");
  }
};
