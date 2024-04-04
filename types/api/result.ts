export type Result<T = any> = {
  errCode: number;
  errMsg: string;
  data: T;
};
