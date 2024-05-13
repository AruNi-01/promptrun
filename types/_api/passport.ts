export interface LoginReq {
  email: string;
  password: string;
}

export interface RegisterReq extends LoginReq {
  confirmPassword: string;
}

export interface UpdatePasswordReq {
  userId: number;
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
