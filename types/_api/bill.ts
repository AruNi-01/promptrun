import { Paginate } from "@/types/_api/paginate";

export interface Bill {
  id: number;
  user_id: number;
  type: number;
  amount: number;
  channel: number;
  remark: string;
  create_time: string;
}

export interface BillListByUserIdReq {
  paginate: Paginate;
  userId: number | undefined;
}

export interface BillListRsp {
  billList: Bill[];
  rows: number;
}
