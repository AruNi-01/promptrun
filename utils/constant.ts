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
