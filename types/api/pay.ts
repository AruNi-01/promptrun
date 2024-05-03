/*
 * @Descripttion:
 * @Author: AruNi_Lu
 * @Date: 2024-04-21 00:11:13
 */
export interface LantuWxPayReq {
  promptId: number;
  promptTitle: string;
  sellerId: number;
  sellerUserId: number;
  buyerId: number;
  price: number;
}

export interface LantuWxPayRsp {
  orderId: bigint;
  qrCodeUrl: string;
}

export interface LantuWxPayQueryOrderResp {
  isPay: boolean;
  orderId: bigint;
  payTime: string;
  attach: LantuWxPayReq; // 附加数据，在支付接口中填写的数据
}
