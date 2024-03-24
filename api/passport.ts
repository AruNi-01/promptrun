import API from "@/config/apiConfig.";
import { LoginReq, RegisterReq } from "@/types/api/passport";
import { Result } from "@/types/api/result";
import { baseFetch, httpMethod } from "./base";

export const login = async (formData: LoginReq): Promise<Result> => {
  try {
    return await baseFetch(API.passport.login, httpMethod.POST, formData);
  } catch (error) {
    throw new Error("An error occurred during login.");
  }
};

export const register = async (formData: RegisterReq): Promise<Result> => {
  try {
    return await baseFetch(API.passport.register, httpMethod.POST, formData);
  } catch (error) {
    throw new Error("An error occurred during registration.");
  }
};

export const logout = async (): Promise<Result> => {
  try {
    return await baseFetch(API.passport.logout, httpMethod.GET);
  } catch (error) {
    throw new Error("An error occurred during logout.");
  }
};
