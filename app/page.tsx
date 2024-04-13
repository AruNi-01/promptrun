"use client";
import { checkIsLogin } from "@/api/passport";
import Accordion from "@/components/home-page/Accordion";
import ImgGallery from "@/components/home-page/ImgGallery";
import NavCard from "@/components/home-page/NavCard";
import { UnderlineIcon } from "@/components/icons";
import AnimateArrow from "@/components/ui/AnimateArrow";
import Tip from "@/components/ui/Tip";
import { useLoginUserStore } from "@/state_stores/loginUserStore";
import { checkIsLogin as loginCheck } from "@/utils/common";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { Divider } from "@nextui-org/react";
import { useEffect } from "react";

export default function Home() {
  const { removeLoginUser } = useLoginUserStore();
  useEffect(() => {
    checkIsLogin().then((res) => {
      if (!loginCheck(res.errCode)) {
        removeLoginUser();
      }
    });
  }, []);

  return (
    <section className="flex flex-col justify-around w-full items-center gap-10 relative z-10">
      <h1 className="text-7xl font-bold cursor-default">
        Prompt
        <div className="inline-block text-primary bg-primary-100/40 rounded-xl ml-1">
          <span className="mx-2">Run</span>
        </div>
      </h1>
      <div className="text-2xl -mt-4 cursor-default">
        <p className="text-pink-400/80 mb-1">Prompts 交易平台</p>
        <UnderlineIcon className="fill-[#E14AA8]" />
      </div>
      <p className="text-4xl cursor-default">
        让您使用
        <span className="rounded-3xl mx-1 bg-gradient-to-r from-purple-500 to-pink-500"> LLMs </span>
        更容易、更高效、更符合预期
      </p>
      <p className="text-2xl cursor-default bg-gradient-to-r from-pink-600 via-purple-500 to-blue-600 bg-clip-text text-transparent">
        GPT, Claude 3, Midjourney, DALL·E, Stable Diffusion ···
      </p>
      <div className="flex gap-10 mt-5">
        <Button
          as={Link}
          href="/market"
          size="lg"
          variant="shadow"
          radius="sm"
          className="bg-gradient-to-tr from-pink-500 to-blue-500 text-white animate-scale-5000"
        >
          <AnimateArrow text="购买 Prompts" size={24} />
        </Button>
        <Button as={Link} href="/seller/dashboard" size="lg" color="secondary" variant="ghost" radius="sm">
          成为卖家
        </Button>
      </div>
      <div className="w-4/6 mt-10 flex flex-col">
        <div className="self-start flex gap-2">
          <p className="text-2xl cursor-default text-default-600">AI 绘画，如此简单</p>
          <div className="mt-[6px]">
            <Tip tipContent="以下绘画由 Midjourney | Stable Diffusion 生成" className="mt-1" />
          </div>
        </div>
        <Divider className="mb-4 mt-1" />
        <ImgGallery />
      </div>
      <div className="flex gap-16 w-4/6 mt-8">
        <div className="flex flex-col gap-2 w-5/12 my-auto">
          <p className="cursor-default text-3xl font-bold bg-gradient-to-r from-default-900 to-default-100 bg-clip-text text-transparent">
            Frequently Asked Questions
          </p>
          <p className="cursor-default text-default-500 text-medium">了解更多关于 Prompt 的问题和解答</p>
        </div>
        <Accordion />
      </div>
      <NavCard className="w-4/6 h-[300px] overflow-hidden" />

      <div className="absolute top-8 left-[34%] w-72 h-72 bg-blue-900 rounded-full mix-blend-multiply blur-2xl opacity-30 z-0 filter animate-blob-tr-7000"></div>
      <div className="absolute top-8 left-[46%] w-72 h-72 bg-purple-900 rounded-full mix-blend-multiply blur-2xl opacity-30 z-0 filter animate-blob-tr-7000 animation-delay-2000"></div>
      <div className="absolute top-24 left-[41%] w-72 h-72 bg-pink-900/50 rounded-full mix-blend-multiply blur-2xl opacity-30 z-0 filter animate-blob-tr-7000 animation-delay-4000"></div>

      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-950 rounded-full mix-blend-multiply blur-2xl opacity-30 -z-50 filter animate-blob-lb-7000"></div>
    </section>
  );
}
