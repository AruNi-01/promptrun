import { Result } from "@/types/api/result";

export const baseFetch = async (url: string, method: string, data?: any): Promise<Result> => {
  try {
    const options: RequestInit = {
      credentials: "include", // 允许跨域携带 cookie 等凭证
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("An error occurred.");
  }
};
