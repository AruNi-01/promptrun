import { Divider } from "@nextui-org/react";
import { cn } from "@nextui-org/system";
import Link from "./ui/Link";

export const Footer = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex flex-col gap-3 mb-3", className)}>
      <Divider className="mx-auto w-9/12" />
      <div className={cn("mx-auto text-medium text-[#71717A]", "flex gap-2")}>
        <div className="flex">
          <p className="font-normal mr-1">Copyright © {new Date().getFullYear()} </p>
          <Link href="https://github.com/aruni-01/promptrun">PromptRun</Link>.
        </div>
        <div className="flex gap-1">
          <p>Made By</p>
          <Link href="https://0x3f4.run">AarynLu</Link>
        </div>
      </div>
    </div>
  );
};
