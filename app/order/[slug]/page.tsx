"use client";

import { findOrderListAttachPromptDetailById } from "@/api/order";
import { Order } from "@/types/api/order";
import { Prompt } from "@/types/api/prompt";
import { PromptDetail } from "@/types/api/prompt_detail";
import { toastErrorMsg } from "@/utils/messageToast";
import { Divider } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function OrderPage({ params }: { params: { slug: number } }) {
  const { slug: orderId } = params;

  const [order, setOrder] = useState<Order>();
  const [prompt, setPrompt] = useState<Prompt>();
  const [promptDetail, setPromptDetail] = useState<PromptDetail>();

  useEffect(() => {
    findOrderListAttachPromptDetailById(orderId)
      .then((res) => {
        setOrder(res.data.order);
        setPrompt(res.data.prompt);
        setPromptDetail(res.data.promptDetail);
      })
      .catch((error) => {
        toastErrorMsg("获取订单、提示器内容失败，请稍后刷新重试！");
      });
  }, [orderId]);

  return (
    <section className="flex flex-col gap-5 w-4/6 mt-8">
      <h1 className="text-3xl">订单详情</h1>
      <Divider />

      <h1 className="text-3xl">Prompt 内容</h1>
      <Divider />
    </section>
  );
}
