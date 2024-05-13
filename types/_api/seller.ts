export interface Seller {
  id: number;
  user_id: number;
  rating: number;
  status: number;
  intro: string;
  sell_amount: number;
  like_amount: number;
  create_time: string;
}

export interface SellerUpdateReq {
  userId: number;
  nickname: string;
  email: string;
  headerImgBase64: string | undefined;

  intro: string;
}
