import { Model } from "./model";
import { Paginate } from "./paginate";
import { PromptImg } from "./prompt_img";
import { Seller } from "./seller";
import { User } from "./user";

export interface PromptListReq {
  paginate: Paginate;
  modelId?: number;
  categoryTypes?: number[];
  sortBy?: string;
  limit?: number;

  publishStatus?: number[];
  AuditStatus?: number[];

  searchInput?: string;

  userId?: number; // // 用户 ID，用于获取某个用户（seller）发布的提示词
}

export interface PromptListByBuyerIdReq {
  paginate: Paginate;
  buyerId: number | undefined;
}

export interface PromptListBySellerIdReq {
  paginate: Paginate;
  sellerId: number | undefined;
}

export interface Prompt {
  id: number;
  seller_id: number;
  model_id: number;
  category_type: number;
  title: string;
  intro: string;
  input_example: string;
  output_example: string;
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
  sellerUser: User;
  model: Model;
  promptImgList: PromptImg[];
}

export interface PromptAttachOrderIdListResp {
  promptAttachOrderIdList: PromptAttachOrderId[];
  rows: number;
}

export interface PromptAttachOrderId {
  prompt: Prompt;
  orderId: bigint;
}

export interface PromptPublishReq {
  userId: number;
  promptTitle: string;
  promptModelId: number;
  promptCategoryType: number;
  promptIntro: string;
  promptContent: string;
  useSuggestion: string;
  inputExample: string;
  outputExample: string;
  masterImgBase64: string | undefined;
  imgBase64List: string[] | undefined;
  promptPrice: number;
}
