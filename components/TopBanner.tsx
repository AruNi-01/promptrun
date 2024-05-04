"use client";
import { useLoginUserStore, UserTypes } from "@/state_stores/loginUserStore";
import { Chip } from "@nextui-org/react";
import RotateBgButton from "@/components/ui/RotateBgButton";
import { useEffect, useState } from "react";
import { HiArrowDown } from "react-icons/hi";

export default function TopBanner() {
  const { loginUser } = useLoginUserStore();

  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    setIsLogin(loginUser !== null);
  }, [JSON.stringify(loginUser)]);

  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!shouldRender) {
    return null;
  }

  return (
    <>
      {!isLogin && (
        <section className="top-0 flex w-full bg-gradient-to-r from-blue-950/30 to-purple-950/20 items-center justify-center border-b border-default-100 h-[48px]">
          <Chip variant="light" className="text-sm">
            🎉 现在注册立即赠送 ￥10.00 余额，可直接在交易市场用于购买 Prompt
          </Chip>
          <Chip variant="faded" color="success" size="sm" className="text-[12px]" endContent={<HiArrowDown />}>
            点击下方注册按钮，立即注册
          </Chip>
        </section>
      )}

      {isLogin && loginUser?.type === UserTypes.COMMON_USER && (
        <section className="top-0 flex w-full items-center bg-gradient-to-r from-blue-950/30 to-purple-950/20 justify-center border-b border-default-100 h-[48px]">
          <Chip variant="light" className="text-sm">
            🥳 成为卖家，在 PromptRun 上发布 Prompt，开始赚取收益
          </Chip>
          <RotateBgButton
            text="立即成为卖家"
            href="/seller_become"
            isExternal={true}
            className="text-[12px] h-[30px] w-[95px]"
          />
        </section>
      )}
    </>
  );
}
