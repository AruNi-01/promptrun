"use client";
import AreaChart from "@/components/seller/dashboard/AreaChart";
import AreaChartMutilArea from "@/components/seller/dashboard/AreaChartMutilArea";
import PieChart from "@/components/seller/dashboard/PieChart";

export default function SellerDashboardPage() {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex gap-3 justify-around">
        <div className="border rounded-lg shadow bg-gray-800 border-gray-700 h-28 w-1/4 flex items-center">
          <div className="flex flex-col items-start gap-1 pl-4">
            <p className="text-default-500 text-xl">已上架 Prompt</p>
            <div className="flex items-end gap-1">
              <p className="text-default-800 text-4xl font-bold">208</p>
              <p className="text-default-500 text-xl">个</p>
            </div>
          </div>
        </div>
        <div className="border rounded-lg shadow bg-gray-800 border-gray-700 h-28 w-1/4 flex items-center">
          <div className="flex flex-col items-start gap-1 pl-4">
            <p className="text-default-500 text-xl">总售出 Prompt</p>
            <div className="flex items-end gap-1">
              <p className="text-default-800 text-4xl font-bold">581</p>
              <p className="text-default-500 text-xl">个</p>
            </div>
          </div>
        </div>
        <div className="border rounded-lg shadow bg-gray-800 border-gray-700 h-28 w-1/4 flex items-center">
          <div className="flex flex-col items-start gap-1 pl-4">
            <p className="text-default-500 text-xl">在 PromptRun 赚了</p>
            <div className="flex items-end gap-1">
              <p className="text-default-800 text-4xl font-bold">￥782</p>
              <p className="text-default-500 text-xl">元</p>
            </div>
          </div>
        </div>
        <div className="border rounded-lg shadow bg-gray-800 border-gray-700 h-28 w-1/4 flex items-center">
          <div className="flex flex-col items-start gap-1 pl-4">
            <p className="text-default-500 text-xl">已成为卖家</p>
            <div className="flex items-end gap-1">
              <p className="text-default-800 text-4xl font-bold">71</p>
              <p className="text-default-500 text-xl">天</p>
            </div>
          </div>
        </div>
      </div>
      <AreaChart />
      <div className="flex gap-3">
        <PieChart className="w-1/3" />
        <AreaChartMutilArea className="w-2/3" />
      </div>
    </section>
  );
}
