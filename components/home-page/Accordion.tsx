import React from "react";
import { Accordion as AccordionUI, AccordionItem, cn } from "@nextui-org/react";
import { QuestionIcon } from "../icons";

export default function Accordion({ className }: { className?: string }) {
  return (
    <div className={cn("w-full", className)}>
      <AccordionUI
        itemClasses={{
          base: "py-0 w-full",
          trigger: "px-2 h-14",
          content: "ml-3 mb-2",
        }}
      >
        <AccordionItem key="1" title="Prompt 是什么？" startContent={<QuestionIcon fill="#9CA3AF" />}>
          Prompt 是在人工智能领域中，向预训练语言模型提供的文本或指令，用于引导模型生成特定的输出。Prompt
          可以是一段文字， 也可以是一组向量，它可以帮助模型理解用户的问题，或者改造下游任务为模型期望的样子。
        </AccordionItem>
        <AccordionItem key="2" title="为什么需要 Prompt？" startContent={<QuestionIcon fill="#9CA3AF" />}>
          Prompt 可以作为输入的引导，帮助模型理解用户的意图和任务要求。通过提供明确的指示和问题，可以引导模型
          生成更准确和相关的回答。通过设计合适的 Prompt，可以约束模型的输出，使其更符合用户的期望。例如，在创作
          故事或生成文本时，Prompt 可以规定特定的情节、 角色或设置，以确保生成的文本与期望的主题一致。
        </AccordionItem>
        <AccordionItem key="3" title="使用 PromptRun 有哪些优势？" startContent={<QuestionIcon fill="#9CA3AF" />}>
          PromptRun 提供了一个庞大的 Prompt 市场，拥有超过 100,000 个经过测试的 AI Prompt。这意味着你可以在
          各种领域和主题中找到适合你需求的 Prompt，无论是艺术和插图、标志和图标、产品设计、营销和商业、摄影还是
          游戏开发等。
        </AccordionItem>
        <AccordionItem key="4" title="想在 PromptRun 中获得高额的收入？" startContent={<QuestionIcon fill="#9CA3AF" />}>
          PromptRun 不仅提供了丰富的优质 Prompt，还为创作者提供了一个平台，让他们可以将自己的 Prompt 上架并出售，
          赚取高额的收入。如果你是一个有创意的人，善于设计 Prompt，那么你可以在 PromptRun 中找到很多机会。
        </AccordionItem>
      </AccordionUI>
    </div>
  );
}
