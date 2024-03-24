import { Result } from "@/types/api/result";
import { baseFetch, httpMethod } from "./base";
import API from "@/config/apiConfig.";

export const findModelList = async (): Promise<Result> => {
  try {
    return await baseFetch(API.model.list, httpMethod.GET);
  } catch (error) {
    throw new Error("An error occurred while querying the model list.");
  }
};

export const findModelById = async (id: number): Promise<Result> => {
  try {
    return await baseFetch(API.model.findById(id), httpMethod.GET);
  } catch (error) {
    throw new Error("An error occurred while querying the model.");
  }
};
