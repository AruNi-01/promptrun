"use client";
import { findChartsFullInfoBySellerUserId } from "@/api/order";
import AreaChart from "@/components/seller/dashboard/AreaChart";
import PieChart from "@/components/seller/dashboard/PieChart";
import Tip from "@/components/ui/Tip";
import { useLoginUserStore } from "@/state_stores/loginUserStore";
import { ChartsRsp } from "@/types/api/order";
import { checkIsLogin } from "@/utils/common";
import { toastErrorMsg, toastInfoMsg } from "@/utils/messageToast";
import { useEffect, useState } from "react";

export default function SellerDashboardPage() {
  const { loginUser, removeLoginUser } = useLoginUserStore();

  const [chartsData, setChartsData] = useState<ChartsRsp>();
  useEffect(() => {
    if (!loginUser) return;

    findChartsFullInfoBySellerUserId(loginUser?.id)
      .then((res) => {
        if (!checkIsLogin(res.errCode)) {
          removeLoginUser();
          toastInfoMsg("您还未登录，请先登录在操作！");
        } else if (res.errCode !== 0) {
          toastErrorMsg(res.errMsg);
        } else {
          setChartsData(res.data);
        }
      })
      .catch(() => {
        toastErrorMsg("获取图标数据失败，请稍后再试！");
      });
  }, [JSON.stringify(loginUser)]);

  return (
    <section className="flex flex-col gap-3">
      <div className="flex gap-3 justify-around">
        <div className="border rounded-lg shadow bg-gray-800 border-gray-700 h-28 w-1/4 flex items-center">
          <div className="flex flex-col items-start gap-1 pl-4">
            <div className="flex gap-2">
              <p className="text-default-500 text-xl">已上架 Prompt</p>
              <div className="mt-[6px]">
                <Tip tipContent="只包含已经发布，并且审核通过的 Prompt 数量" className="mt-1" />
              </div>
            </div>
            <div className="flex items-end gap-1">
              <p className="text-default-800 text-4xl font-bold">{chartsData?.publishPromptCount}</p>
              <p className="text-default-500 text-xl">个</p>
            </div>
          </div>
        </div>
        <div className="border rounded-lg shadow bg-gray-800 border-gray-700 h-28 w-1/4 flex items-center">
          <div className="flex flex-col items-start gap-1 pl-4">
            <p className="text-default-500 text-xl">总售出 Prompt</p>
            <div className="flex items-end gap-1">
              <p className="text-default-800 text-4xl font-bold">{chartsData?.sellPromptCount}</p>
              <p className="text-default-500 text-xl">个</p>
            </div>
          </div>
        </div>
        <div className="border rounded-lg shadow bg-gray-800 border-gray-700 h-28 w-1/4 flex items-center">
          <div className="flex flex-col items-start gap-1 pl-4">
            <p className="text-default-500 text-xl">在 PromptRun 赚了</p>
            <div className="flex items-end gap-1">
              <p className="text-default-800 text-4xl font-bold">￥{chartsData?.earnMoney}</p>
              <p className="text-default-500 text-xl">元</p>
            </div>
          </div>
        </div>
        <div className="border rounded-lg shadow bg-gray-800 border-gray-700 h-28 w-1/4 flex items-center">
          <div className="flex flex-col items-start gap-1 pl-4">
            <p className="text-default-500 text-xl">已成为卖家</p>
            <div className="flex items-end gap-1">
              <p className="text-default-800 text-4xl font-bold">{chartsData?.becomeSellerDay}</p>
              <p className="text-default-500 text-xl">天</p>
            </div>
          </div>
        </div>
      </div>
      {chartsData && (
        <>
          <AreaChart
            data={chartsData?.sellCountEveryMonth || []}
            xDataKey="month"
            areaDataKey="sellCount"
            areaColor="#8884d8"
            gradientColorId="colorSellCount"
            title="月销售量"
            unitDesc="数量/个"
          />
          <div className="flex gap-3">
            <PieChart data={chartsData?.sellModelRatio || []} dataKey="sellCount" className="w-1/3" />
            <AreaChart
              data={chartsData?.sellMoneyEveryMonth || []}
              xDataKey="month"
              areaDataKey="sellMoney"
              areaColor="#82ca9d"
              gradientColorId="colorSellMoney"
              title="月销售额"
              unitDesc="金额/元"
              className="w-2/3"
            />
          </div>
        </>
      )}
    </section>
  );
}
