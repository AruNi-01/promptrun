import { Model } from "./model";
import { Paginate } from "./paginate";
import { Prompt } from "./prompt";
import { PromptImg } from "./prompt_img";
import { User } from "./user";

export interface OrderListAttachFullInfoBySellerUserIdReq {
  paginate: Paginate;
  sellerUserId: number | undefined;
}

export interface OrderListAttachFullInfoRsp {
  orderListAttachFullInfo: OrderListAttachFullInfo[];
  rows: number;
}

export interface OrderListAttachFullInfo {
  order: Order;
  buyer: User;
  prompt: Prompt;
  model: Model;
  promptImgList: PromptImg[];
}

export interface Order {
  id: number;
  prompt_id: number;
  seller_id: number;
  buyer_id: number;
  price: number;
  is_rating: number;
  rating: number;
  create_time: string;
}
