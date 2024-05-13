import { Model } from "./model";
import { Paginate } from "./paginate";
import { Prompt } from "./prompt";
import { PromptDetail } from "./prompt_detail";
import { PromptImg } from "./prompt_img";
import { User } from "./user";

export interface ChartsRsp {
  sellMoneyEveryMonth: SellMoneyVo[];
  sellCountEveryMonth: SellCountVo[];
  sellModelRatio: SellModelRatioVo[];

  publishPromptCount: number;
  sellPromptCount: number;
  earnMoney: number;
  becomeSellerDay: number;
}
export interface SellMoneyVo {
  month: string;
  sellMoney: number;
}
export interface SellCountVo {
  month: string;
  sellCount: number;
}
export interface SellModelRatioVo {
  name: string;
  sellCount: number;
}

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

export interface OrderListAttachPromptDetailRsp {
  order: Order;
  prompt: Prompt;
  promptDetail: PromptDetail;
}
