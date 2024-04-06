"use client";
import { cn } from "@nextui-org/system";
import { Area, AreaChart as ReAreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function AreaChart({ className }: { className?: string }) {
  const data = [
    { name: "一月", uv: 400, pv: 250 },
    { name: "二月", uv: 300, pv: 139 },
    { name: "三月", uv: 200, pv: 980 },
    { name: "四月", uv: 278, pv: 398 },
    { name: "五月", uv: 189, pv: 400 },
    { name: "六月", uv: 239, pv: 800 },
    { name: "一月", uv: 349, pv: 430 },
    { name: "一月", uv: 400, pv: 250 },
    { name: "一月", uv: 300, pv: 139 },
    { name: "一月", uv: 200, pv: 980 },
    { name: "一月", uv: 278, pv: 398 },
    { name: "一月", uv: 189, pv: 400 },
  ];

  return (
    <div className={cn("border rounded-lg shadow bg-gray-800 border-gray-700 flex flex-col gap-3 py-2", className)}>
      <div className="flex justify-between mx-4">
        <p className="text-default-700 text-md">月售出总量</p>
        <p className="text-default-700 text-sm">数量/个</p>
      </div>
      <div className="w-full h-60 pr-8">
        <ResponsiveContainer>
          <ReAreaChart data={data}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis tick={{ fill: "#9CA3AF" }} dataKey="name" />
            <YAxis tick={{ fill: "#9CA3AF" }} />
            <Tooltip contentStyle={{ background: "#111827", borderColor: "#121757", borderRadius: "10px" }} />
            <Area
              type="monotone"
              dataKey="uv"
              dot={{ strokeWidth: 1 }}
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorUv)"
            />
          </ReAreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
