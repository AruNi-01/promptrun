import { Result } from "@/types/api/result";
import { baseFetch, httpMethod } from "./base";
import API from "@/config/apiConfig.";
import { Message } from "@/types/api/message";

export const findMessageListByUserId = async (userId: number): Promise<Result<Message[]>> => {
  try {
    return await baseFetch(API.message.listByUserId(userId), httpMethod.GET);
  } catch (error) {
    throw new Error("An error occurred during find messages.");
  }
};

export const readAllMessage = async (userId: number): Promise<Result> => {
  try {
    return await baseFetch(API.message.readAll(userId), httpMethod.POST);
  } catch (error) {
    throw new Error("An error occurred during read all message.");
  }
};

export const findMessageNotReadCountByUserId = async (userId: number): Promise<Result<number>> => {
  try {
    return await baseFetch(API.message.notReadCountByUserId(userId), httpMethod.GET);
  } catch (error) {
    throw new Error("An error occurred during find not read message count.");
  }
};
