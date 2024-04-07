"use client";
import { Checkbox, Divider } from "@nextui-org/react";
import { useState } from "react";

export default function SellerNoticePage() {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <section className="flex flex-col gap-3 mt-8 items-start">
      <h2 className="text-3xl">消息列表</h2>
      <Divider />

      <div className="border rounded-lg shadow bg-gray-800 border-gray-700 flex flex-col items-start w-3/4 h-[600px] overflow-y-scroll">
        {Array.from({ length: 10 }).map((_, index) => (
          <div className="flex items-start gap-2.5 mx-3 my-3">
            <img className="w-8 h-8 rounded-full" src="/logo.png" alt="Jese image" />
            <div className="flex flex-col gap-1 w-3/4">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-sm font-semibold text-white">PromptRun 官方</span>
                <span className="text-sm font-normal text-gray-400">2024-04-08 11:46</span>
              </div>
              <div className="flex gap-2">
                <div
                  className={`flex leading-1.5 p-4 border-gray-200 rounded-e-xl rounded-es-xl ${
                    isSelected ? "bg-gray-700/50 text-gray-400" : "bg-gray-700 text-white"
                  }`}
                >
                  <p className="text-sm font-normal text-start">
                    {" "}
                    That's awesome. I think our users will really appreciate the improvements.
                  </p>
                </div>
                <Checkbox
                  color="success"
                  isSelected={isSelected}
                  onValueChange={setIsSelected}
                  isDisabled={isSelected}
                  className="self-center"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
