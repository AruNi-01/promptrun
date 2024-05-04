"use client";
import { useLoginUserStore, UserTypes } from "@/state_stores/loginUserStore";
import { Wallet } from "@/types/api/wallet";
import { Chip, Divider } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { findWaletByUserId } from "@/api/wallet";
import { toastErrorMsg } from "@/utils/messageToast";
import { HiCurrencyYen } from "react-icons/hi";
import Link from "@/components/ui/Link";
import BillTable from "@/components/bill/BillTable";

export default function WalletPage() {
  const { loginUser, removeLoginUser } = useLoginUserStore();
  const [wallet, setWallet] = useState<Wallet>();

  useEffect(() => {
    if (!loginUser) return;
    const fetchWallet = async () => {
      try {
        const rsp = await findWaletByUserId(loginUser?.id);
        if (rsp.errCode !== 0) {
          toastErrorMsg("获取用户钱包失败，请稍后刷新重试！");
          return;
        }
        setWallet(rsp.data);
      } catch (error) {
        toastErrorMsg("获取用户钱包失败，请稍后刷新重试！");
      }
    }
    fetchWallet()
  }, [JSON.stringify(loginUser)]);
  
  if (!loginUser) return;

  return (
    <section className="mt-8 flex w-4/6 flex-col gap-5">
      <title>我的钱包 | PromptRun</title>
      <div className="flex flex-col items-start gap-5">
        <h2 className="text-4xl">我的钱包</h2>
        <Divider className="-mt-2" />
        <div className="flex gap-1">
          <span className="self-center">余额：</span>
          <Chip variant={"faded"} startContent={<HiCurrencyYen className="h-[18px] w-[18px]" />} size={"md"}
                color={"primary"}>
            {wallet?.balance.toFixed(2)}
          </Chip>
          <span className="ml-5 self-center text-sm text-default-400">余额可用于在交易市场购买 Prompt</span>
        </div>
        <div className="flex gap-1">
          <span>在 PromptRun 上的总收入：</span>
          {
            loginUser?.type === UserTypes.SELLER_USER 
              ? <Chip variant={"faded"} startContent={<HiCurrencyYen className="h-[18px] w-[18px]" />} size={"md"}
                                                             color={"success"}>
                  {wallet?.wallet_income.toFixed(2)}
                </Chip> 
              : <Link href={"/seller_become"}>立即成为卖家，在 PromptRun 上获取收入</Link>
          }
        </div>
        <div className="flex gap-1">
          <span>在 PromptRun 上的总支出：</span>
          <Chip variant={"faded"} startContent={<HiCurrencyYen className="h-[18px] w-[18px]" />} size={"md"}
                color={"danger"}>
            {wallet?.wallet_outcome.toFixed(2)}
          </Chip>
        </div>
      </div>
      <div className="mt-10 flex flex-col items-start gap-1">
        <h2 className="text-4xl">交易账单</h2>
        <BillTable />
      </div>
    </section>
  );
}
