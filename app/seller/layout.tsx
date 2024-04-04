"use client";
import { useLoginUserStore } from "@/state_stores/loginUserStore";
import { Divider, User } from "@nextui-org/react";
import { Badge, Sidebar } from "flowbite-react";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import {
  HiChartPie,
  HiFire,
  HiLockClosed,
  HiShoppingBag,
  HiSpeakerphone,
  HiUserCircle,
  HiViewBoards,
  HiLogin,
} from "react-icons/hi";

export default function SellerLayout({ children }: { children: ReactNode }) {
  const { loginUser, setLoginUser, removeLoginUser } = useLoginUserStore((state) => ({
    loginUser: state.loginUser,
    setLoginUser: state.setLoginUser,
    removeLoginUser: state.removeLoginUser,
  }));

  const route = useRouter();

  const pathname = usePathname();
  const sideItemActiveCN = (path: string): string => {
    return path !== "/" ? (pathname.startsWith(path) ? "bg-[#374151]" : "") : "";
  };

  return (
    <section className="flex gap-10 w-9/12 mt-8">
      <Sidebar className="w-[25%] h-screen flex text-start rounded-2xl">
        <User
          as="button"
          avatarProps={{
            src: loginUser?.headerUrl,
          }}
          name={"Hello, " + loginUser?.nickname}
          classNames={{
            name: "ml-1 text-xl text-default-800 font-bold",
            base: "ml-2 mb-3",
          }}
          onClick={() => {
            route.push("/seller/dashboard");
          }}
        />
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <div className="cursor-pointer flex flex-col gap-2">
              <Sidebar.Item
                onClick={() => {
                  route.push("/seller/dashboard");
                }}
                icon={HiChartPie}
                className={sideItemActiveCN("/seller/dashboard")}
                label="图表"
                labelColor="blue"
              >
                整体看板
              </Sidebar.Item>
              <Sidebar.Item
                onClick={() => {
                  route.push("/seller/goods");
                }}
                icon={HiViewBoards}
                className={sideItemActiveCN("/seller/goods")}
                label="发布"
                labelColor="dark"
              >
                上架商品
              </Sidebar.Item>
              <Sidebar.Item
                onClick={() => {
                  route.push("/seller/order");
                }}
                icon={HiShoppingBag}
                className={sideItemActiveCN("/seller/order")}
                label="卖出"
                labelColor="dark"
              >
                我的订单
              </Sidebar.Item>
              <Sidebar.Item
                onClick={() => {
                  route.push("/seller/notice");
                }}
                icon={HiSpeakerphone}
                className={sideItemActiveCN("/seller/notice")}
                label={"0 未读"}
                labelColor="green"
              >
                消息通知
              </Sidebar.Item>
              <Divider />
              <Sidebar.Item
                onClick={() => {
                  route.push("/seller/profile");
                }}
                icon={HiUserCircle}
                className={sideItemActiveCN("/seller/profile")}
              >
                个人信息
              </Sidebar.Item>
              <Sidebar.Item
                onClick={() => {
                  route.push("/seller/update_password");
                }}
                icon={HiLockClosed}
                className={sideItemActiveCN("/seller/update_password")}
              >
                修改密码
              </Sidebar.Item>
              <Sidebar.Item
                onClick={() => {
                  route.push("/seller/logout");
                }}
                icon={HiLogin}
                className={sideItemActiveCN("/seller/logout")}
              >
                退出登录
              </Sidebar.Item>
            </div>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
        <Sidebar.CTA className="mt-[calc(100vh-38rem)]">
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
      <div className="w-[75%]">{children}</div>
    </section>
  );
}
