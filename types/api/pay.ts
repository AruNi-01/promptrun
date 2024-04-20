export interface LantuWxPayReq {
  promptId: number;
  promptTitle: string;
  sellerId: number;
  buyerId: number;
  price: number;
}

export interface LantuWxPayRsp {
  orderId: number;
  qrCodeUrl: string;
}
