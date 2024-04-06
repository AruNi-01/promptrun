"use client";
import { cn } from "@nextui-org/system";
import { Cell, Pie, PieChart as RePieChart, ResponsiveContainer, Tooltip } from "recharts";

export default function PieChart({ data, dataKey, className }: { data: any[]; dataKey: string; className?: string }) {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#3f2542"];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    fill,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    index: number;
    fill: string;
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Label line end coordinates
    const labelLineEndX = cx + (outerRadius + 25) * Math.cos(-midAngle * RADIAN);
    const labelLineEndY = cy + (outerRadius + 25) * Math.sin(-midAngle * RADIAN);

    return (
      <g>
        {/* Label text */}
        <text
          x={labelLineEndX}
          y={labelLineEndY}
          fill="white"
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
        {/* Label line */}
        <polyline points="x, y, labelLineEndX, labelLineEndY" stroke={fill} fill="none" />
      </g>
    );
  };

  console.log(
    "data: " +
      data.forEach((element) => {
        console.log(element);
      }),
    "dataKey: " + dataKey
  );

  return (
    <div className={cn("border rounded-lg shadow bg-gray-800 border-gray-700 flex flex-col gap-3 py-2", className)}>
      <p className="text-default-700 text-md">售出模型占比</p>
      <div className="w-full h-60">
        <ResponsiveContainer>
          <RePieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey={dataKey}
              label={renderCustomizedLabel}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#fffe",
                borderColor: "#fff3",
                borderRadius: "10px",
              }}
            />
          </RePieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
