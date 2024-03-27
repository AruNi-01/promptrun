export interface UserUpdateReq {
  userId: number;
  nickname: string;
  email: string;
  headerImgBase64: string | undefined;
}
