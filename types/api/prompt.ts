import { Model } from "./model";
import { Paginate } from "./paginate";
import { PromptImg } from "./prompt_img";
import { Seller } from "./seller";

export interface PromptListReq {
  paginate: Paginate;
  modelId?: number;
  categoryTypes?: number[];
  sortBy?: string;
}

export interface PromptListByBuyerIdReq {
  paginate: Paginate;
  buyerId: number | undefined;
}

export interface Prompt {
  id: number;
  seller_id: number;
  model_id: number;
  category_type: number;
  title: string;
  intro: string;
  price: number;
  rating: number;
  score: number;
  sell_amount: number;
  browse_amount: number;
  like_amount: number;
  publish_status: number;
  audit_status: number;
  create_time: string;
}

export interface PromptFullInfo {
  prompt: Prompt;
  seller: Seller;
  model: Model;
  promptImgList: PromptImg[];
}
