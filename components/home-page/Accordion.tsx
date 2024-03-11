import React from "react";
import { Accordion as AccordionUI, AccordionItem, cn } from "@nextui-org/react";
import { QuestionIcon } from "../icons";

export default function Accordion({ className }: { className?: string }) {
  const defaultContent = "defaultContent";

  return (
    <div className={cn("border border-[#262626] rounded-t-xl", className)}>
      <AccordionUI
        variant="light"
        itemClasses={{
          base: "py-0 w-full",
          trigger: "px-2 h-14",
          content: "ml-3 mb-2",
        }}
      >
        <AccordionItem key="1" title="Prompt 是什么？" startContent={<QuestionIcon fill="#9CA3AF" />}>
          {defaultContent}
        </AccordionItem>
        <AccordionItem key="2" title="为什么需要 Prompt？" startContent={<QuestionIcon fill="#9CA3AF" />}>
          {defaultContent}
        </AccordionItem>
        <AccordionItem key="3" title="使用 PromptRun 有哪些优势？" startContent={<QuestionIcon fill="#9CA3AF" />}>
          {defaultContent}
        </AccordionItem>
      </AccordionUI>
    </div>
  );
}
