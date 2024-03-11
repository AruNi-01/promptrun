"use client";
import Accordion from "@/components/home-page/Accordion";
import { UnderlineIcon } from "@/components/icons";
import AnimateArrow from "@/components/ui/AnimateArrow";
import { Button } from "@nextui-org/button";

export default function Home() {
  return (
    <section className="flex flex-col justify-around w-full items-center gap-10">
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
      <p className="text-2xl cursor-default bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
        GPT, Claude 3, Midjourney, DALL·E, Stable Diffusion ···
      </p>
      <div className="flex gap-10 mt-5">
        <Button
          size="lg"
          variant="shadow"
          radius="sm"
          className="bg-gradient-to-tr from-pink-500 to-blue-500 text-white animate-scale-5000"
        >
          <AnimateArrow text="购买 Prompts" size={24} />
        </Button>
        <Button size="lg" color="secondary" variant="ghost" radius="sm">
          成为卖家
        </Button>
      </div>
      <div className="flex flex-col gap-3 w-3/5 mt-8">
        <h2 className="self-center cursor-default text-2xl font-bold text-default-600">了解更多</h2>
        <Accordion />
      </div>
    </section>
  );
}
