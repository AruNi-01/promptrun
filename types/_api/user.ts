export interface UserUpdateReq {
  userId: number;
  nickname: string;
  email: string;
  headerImgBase64: string | undefined;
}

export interface User {
  id: number;
  email: string;
  password: string;
  nickname: string;
  header_url: string;
  type: number;
  create_time: string;
}

export interface userBecomeSellerReq {
  userId: number;
  nickname: string;
  email: string;
  intro: string;
}
