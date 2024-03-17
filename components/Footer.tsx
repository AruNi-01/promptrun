import { Divider } from "@nextui-org/react";
import { cn } from "@nextui-org/system";

export const Footer = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex flex-col gap-3 mb-3", className)}>
      <Divider className="mx-auto w-9/12" />
      <div className={cn("mx-auto text-medium text-[#71717A]")}>
        <p className="font-normal">Copyright © {new Date().getFullYear()} PromptRun. All Rights Reserved</p>
      </div>
    </div>
  );
};
