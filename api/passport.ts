import API from "@/config/apiConfig.";
import { LoginReq, RegisterReq } from "@/types/api/passport";

export const login = async (formData: LoginReq) => {
  try {
    const response = await fetch(`${API.passport.login}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("An error occurred during login.");
  }
};

export const register = async (formData: RegisterReq) => {
  try {
    const response = await fetch(`${API.passport.register}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("An error occurred during registration.");
  }
};
