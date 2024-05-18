"use client";
import { findMessageNotReadCountByUserId } from "@/_api/message";
import { checkIsLogin as checkIsLoginApi, logout } from "@/_api/passport";
import { useLoginUserStore, UserTypes } from "@/state_stores/loginUserStore";
import { useMessageNotReadCountState } from "@/state_stores/messageStore";
import { checkIsLogin } from "@/utils/common";
import { toastErrorMsg, toastInfoMsg, toastSuccessMsg } from "@/utils/messageToast";
import {
  Button,
  cn,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  User,
} from "@nextui-org/react";
import { Badge, Sidebar } from "flowbite-react";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import {
  HiChartPie,
  HiCurrencyYen,
  HiFire,
  HiLockClosed,
  HiLogin,
  HiShoppingBag,
  HiSpeakerphone,
  HiUserCircle,
  HiViewBoards,
} from "react-icons/hi";
import { useWebSocket } from "ahooks";
import apiConfig from "@/config/apiConfig.";

export default function SellerLayout({ children }: { children: ReactNode }) {
  const route = useRouter();
  const pathname = usePathname();

  const { loginUser, setLoginUser, removeLoginUser } = useLoginUserStore((state) => ({
    loginUser: state.loginUser,
    setLoginUser: state.setLoginUser,
    removeLoginUser: state.removeLoginUser,
  }));

  const { messageNotReadCount, setMessageNotReadCount } = useMessageNotReadCountState();
  const findMessageNotReadCount = async (userId: number) => {
    findMessageNotReadCountByUserId(userId)
      .then((rsp) => {
        if (rsp.errCode !== 0) {
          toastInfoMsg("获取未读消息失败，请稍后重试！");
        } else {
          setMessageNotReadCount(rsp.data);
        }
      })
      .catch(() => {
        toastInfoMsg("获取未读消息失败，请稍后重试！");
      });
  };

  useEffect(() => {
    const check = async () => {
      try {
        const rsp = await checkIsLoginApi();
        if (!checkIsLogin(rsp.errCode)) {
          removeLoginUser();
          toastInfoMsg("您未登录，请先登录后在操作！");
          route.push("/");
        } else if (rsp.errCode === Number(0)) {
          if (!loginUser) {
            // localStorage 还未加载，等待下一次 render
            return;
          }
          if (loginUser?.type !== UserTypes.SELLER_USER) {
            toastInfoMsg("您还不是卖家，快去申请成为卖家吧！");
            route.push("/seller_become");
          } else {
            findMessageNotReadCount(loginUser.id);
          }
        } else {
          toastErrorMsg("服务器开小差了，请稍后重试！");
        }
      } catch (e) {
        toastErrorMsg("服务器开小差了，请稍后重试！");
      }
    };
    check();
  }, [JSON.stringify(loginUser)]);

  useWebSocket(apiConfig.websocket.messageNotReadCountByUserId(loginUser ? loginUser.id : 0), {
    onMessage: (msg) => {
      console.log("websocket.messageNotReadCountByUserId msg", msg);
      // const data = JSON.parse(msg.data);
      setMessageNotReadCount(1 + messageNotReadCount);
    },
    reconnectLimit: 2,
    reconnectInterval: 3000,
  });

  const sideItemActiveCN = (path: string): string => {
    return path !== "/" ? (pathname.startsWith(path) ? "bg-[#374151]" : "") : "";
  };

  const {
    isOpen: isLogoutModalOpen,
    onOpen: onLogoutModalOpen,
    onClose: onLogoutModalClose,
    onOpenChange: onLogoutModalOpenChange,
  } = useDisclosure();

  const handleLogout = async () => {
    try {
      const rsp = await logout();
      if (!checkIsLogin(rsp.errCode)) {
        removeLoginUser();
        route.refresh();
        toastInfoMsg("您未登录，请登录后再操作！");
      } else if (rsp.errCode !== Number(0)) {
        console.error("Error:", rsp.errMsg);
        toastErrorMsg("退出登录失败，服务器开小差了，请稍后重试！");
      } else {
        removeLoginUser();
        route.refresh();
        toastSuccessMsg("退出登录成功！");
      }
    } catch (error) {
      console.error("Error:", error);
      toastErrorMsg("退出登录失败，服务器开小差了，请稍后重试！");
    }

    onLogoutModalClose();
  };

  return (
    <>
      {loginUser?.type === UserTypes.SELLER_USER && pathname !== "/seller/become" && (
        <section className="flex gap-10 w-9/12 mt-8">
          <title>商家页 | PromptRun</title>
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
                    // label="图表"
                    // labelColor="blue"
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
                    labelColor="green"
                  >
                    上架商品
                  </Sidebar.Item>
                  <Sidebar.Item
                    onClick={() => {
                      route.push("/seller/order");
                    }}
                    icon={HiShoppingBag}
                    className={sideItemActiveCN("/seller/order")}
                    // label="卖出"
                    // labelColor="dark"
                  >
                    我的订单
                  </Sidebar.Item>
                  <Sidebar.Item
                    onClick={() => {
                      route.push("/seller/notice");
                    }}
                    icon={HiSpeakerphone}
                    className={cn(
                      sideItemActiveCN("/seller/notice"),
                      `${messageNotReadCount !== 0 ? "animate-scale-small-7000" : ""}`,
                    )}
                    label={messageNotReadCount !== 0 ? `${messageNotReadCount} 未读` : ""}
                    labelColor="blue"
                  >
                    消息通知
                  </Sidebar.Item>
                  <Sidebar.Item
                    onClick={() => {
                      route.push("/seller/wallet");
                    }}
                    icon={HiCurrencyYen}
                    className={sideItemActiveCN("/seller/wallet")}
                    label={"账单"}
                    labelColor="purple"
                  >
                    我的钱包
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
                      onLogoutModalOpen();
                    }}
                    icon={HiLogin}
                    className={sideItemActiveCN("/seller/logout")}
                  >
                    退出登录
                  </Sidebar.Item>
                </div>
              </Sidebar.ItemGroup>
            </Sidebar.Items>
            <Sidebar.CTA className="mt-[calc(100vh-40rem)]">
              <div className="mb-2 flex justify-between">
                <HiFire className="h-[22px] w-[22px] text-[#FECACA]" />
                <Badge color="red">卖家须知</Badge>
              </div>
              <div className="mb-2 text-sm text-cyan-900 dark:text-gray-400">
                所有交易均需通过 PromptRun 平台完成，确保交易安全可靠。 遵守平台的交易
                <a
                  className="text-sm text-cyan-900 underline hover:text-cyan-800 dark:text-gray-400 dark:hover:text-gray-300"
                  href="#"
                >
                  规则与政策
                </a>
                ，不得从事任何违规行为，包括欺诈、虚假宣传或误导消费者等。
              </div>
            </Sidebar.CTA>
          </Sidebar>
          <div className="w-[75%]">{children}</div>

          <Modal isOpen={isLogoutModalOpen} onOpenChange={onLogoutModalOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">退出登录</ModalHeader>
                  <ModalBody>
                    <p>您确定要退出登录吗？退出登录后，您将无法继续进行卖家相关操作或购买 Prompt，直到重新登录。</p>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="success" variant="flat" onPress={onClose}>
                      取消
                    </Button>
                    <Button
                      color="danger"
                      variant="light"
                      onPress={() => {
                        handleLogout();
                      }}
                    >
                      确定
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </section>
      )}
    </>
  );
}
