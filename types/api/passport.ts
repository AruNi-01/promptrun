export interface LoginReq {
  email: string;
  password: string;
}

export interface RegisterReq extends LoginReq {
  confirmPassword: string;
}

