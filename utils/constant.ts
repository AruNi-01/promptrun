export const sortByOptions = [
  {
    key: "time",
    value: "time",
    label: "时间",
  },
  {
    key: "hot",
    value: "hot",
    label: "热度",
  },
  {
    key: "sell_amount",
    value: "sell_amount",
    label: "销量",
  },
];

export const categoryOptions = [
  {
    type: 1,
    value: "anime",
    label: "动漫",
  },
  {
    type: 2,
    value: "advertise",
    label: "广告",
  },
  {
    type: 3,
    value: "animal",
    label: "动物",
  },
];

export const publishStatusOptions = [
  {
    type: "1",
    label: "已发布",
  },
  {
    type: "0",
    label: "未发布",
  },
];

export const publishStatus = {
  PublishOff: 0,
  PublishOn: 1,
};

export const auditStatusOptions = [
  {
    type: "2",
    label: "审核通过",
  },
  {
    type: "1",
    label: "审核中",
  },
  {
    type: "0",
    label: "审核失败",
  },
];

export const auditStatus = {
  AuditFail: 0,
  Auditing: 1,
  AuditPass: 2,
};

export const modelMediaType = {
  Text: 1,
  Image: 2,
  Video: 3,
};

export const categoryTypeMap = new Map<number, string>(
  categoryOptions.map((category) => [category.type, category.label])
);

export const sellerOrderTableColumns = [
  { key: "prompt_title", label: "Prompt 标题", defaultVisible: true, disabledKey: true },
  { key: "prompt_model", label: "Prompt 模型", defaultVisible: true },
  { key: "prompt_category", label: "Prompt 分类", defaultVisible: true },
  { key: "buyer", label: "买家", defaultVisible: true, disabledKey: true },
  { key: "rating", label: "评分" },
  { key: "price", label: "价格", defaultVisible: true, disabledKey: true, sortable: true },
  { key: "create_time", label: "时间", defaultVisible: true, sortable: true },
];

export const SellerOrderTableColumnsEnum = {
  prompt_title: "prompt_title",
  prompt_model: "prompt_model",
  prompt_category: "prompt_category",
  buyer: "buyer",
  rating: "rating",
  price: "price",
  create_time: "create_time",
};
