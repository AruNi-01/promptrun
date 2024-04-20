"use client";
import { cn } from "@nextui-org/system";
import { Area, AreaChart as ReAreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function AreaChart({
  data,
  xDataKey,
  areaDataKey,
  areaColor,
  gradientColorId,
  title,
  unitDesc,
  className,
}: {
  data: any[];
  xDataKey: string;
  areaDataKey: string;
  areaColor: string;
  gradientColorId: string;
  title?: string;
  unitDesc?: string;
  className?: string;
}) {
  return (
    <div className={cn("border rounded-lg shadow bg-gray-800 border-gray-700 flex flex-col gap-3 py-2", className)}>
      <div className="flex justify-between mx-4">
        <p className="text-default-700 text-md">{title}</p>
        <p className="text-default-700 text-sm">{unitDesc}</p>
      </div>
      <div className="w-full h-60 pr-8">
        <ResponsiveContainer>
          <ReAreaChart data={data}>
            <defs>
              <linearGradient id={gradientColorId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={areaColor} stopOpacity={0.8} />
                <stop offset="95%" stopColor={areaColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis tick={{ fill: "#9CA3AF" }} dataKey={xDataKey} />
            <YAxis tick={{ fill: "#9CA3AF" }} />
            <Tooltip contentStyle={{ background: "#111827", borderColor: "#121757", borderRadius: "10px" }} />
            <Area
              type="monotone"
              dataKey={areaDataKey}
              // dot={{ strokeWidth: 1 }}
              stroke={areaColor}
              fillOpacity={1}
              fill={`url(#${gradientColorId})`}
            />
          </ReAreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
