"use client";
import { Badge, FooterDivider, Sidebar } from "flowbite-react";
import { ReactNode } from "react";
import {
  HiChartPie,
  HiFire,
  HiLockClosed,
  HiShoppingBag,
  HiSpeakerphone,
  HiUserCircle,
  HiViewBoards,
} from "react-icons/hi";

export default function SellerLayout({ children }: { children: ReactNode }) {
  return (
    <section className="flex gap-10 w-9/12 mt-8">
      <Sidebar className="w-[30%] h-screen flex text-start rounded-2xl">
        <Sidebar.Logo href="#" img="/logo.png" imgAlt="logo" className="text-center">
          AarynLu 晚上好！
        </Sidebar.Logo>
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Sidebar.Item href="#" icon={HiChartPie}>
              整体看板
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={HiViewBoards}>
              上架商品
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={HiShoppingBag}>
              我的订单
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={HiSpeakerphone} label="3" labelColor="green">
              消息通知
            </Sidebar.Item>
            <FooterDivider />
            <Sidebar.Item href="#" icon={HiUserCircle}>
              个人信息
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={HiLockClosed}>
              修改密码
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
        <Sidebar.CTA className="mt-[calc(100vh-35rem)]">
          <div className="mb-2 flex justify-between">
            <HiFire className="h-[22px] w-[22px] text-green-300" />
            <Badge color="success">卖家须知</Badge>
          </div>
          <div className="mb-3 text-sm text-cyan-900 dark:text-gray-400">
            Preview the new Flowbite dashboard navigation! You can turn the new navigation off for a limited time in
            your profile.
          </div>
          <a
            className="text-sm text-cyan-900 underline hover:text-cyan-800 dark:text-gray-400 dark:hover:text-gray-300"
            href="#"
          >
            Turn new navigation off
          </a>
        </Sidebar.CTA>
      </Sidebar>
      {children}
    </section>
  );
}
