"use client";
import { Card, CardBody, CardFooter, Typography } from "@material-tailwind/react";
import { Button } from "@nextui-org/button";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { useRouter } from "next/navigation";
import AnimateArrow from "../ui/AnimateArrow";
import { cn } from "@nextui-org/system";

const DarkMouseShadowColors = ["#291645"];

export default function NavCard({ className }: { className?: string }) {
  const router = useRouter();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const darkRandomColor = DarkMouseShadowColors[Math.floor(Math.random() * DarkMouseShadowColors.length)];

  return (
    <Card
      onMouseMove={(e) => {
        const { left, top } = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
      }}
      className={cn("group/motion border border-neutral-900 bg-default-100/5 cursor-default", className)}
    >
      <CardBody className="z-50">
        <Typography variant="h1" color="blue-gray" className="mb-8 text-default-600 mt-10">
          准备好在 Prompt<span className="text-primary">Run</span> 上出售了吗？
        </Typography>
      </CardBody>
      <CardFooter className="pt-0 z-50">
        <Button
          onClick={() => router.push("/seller/dashboard")}
          size="lg"
          radius="md"
          variant="shadow"
          color="primary"
          className="flex gap-2 dark:text-neutral-200"
        >
          <AnimateArrow text="立刻开始" textSize="text-2xl" size={24} />
        </Button>
      </CardFooter>
      <motion.div
        className="z-10 pointer-events-none absolute -inset-px blur-lg opacity-0 transition group-hover/motion:duration-500 group-hover/motion:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              350px circle at ${mouseX}px ${mouseY}px,
              ${darkRandomColor},
              transparent 80%
            )
          `,
        }}
      />
    </Card>
  );
}
