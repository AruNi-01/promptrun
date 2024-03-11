import { Divider } from "@nextui-org/react";
import { cn } from "@nextui-org/system";

export const Footer = ({ className }: { className?: string }) => {
  return (
    <>
      <Divider className="mx-auto w-9/12 mt-10" />
      <div className={cn("mx-auto mb-3 text-medium text-[#71717A]", className)}>
        <p className="font-normal mx-auto">Copyright © {new Date().getFullYear()} PromptRun. All Rights Reserved</p>
      </div>
    </>
  );
};
