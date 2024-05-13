import { login, logout, register, updatePassword } from "@/_api/passport";
import { useLoginUserStore } from "@/state_stores/loginUserStore";
import { LoginReq, RegisterReq, UpdatePasswordReq } from "@/types/_api/passport";
import { toastErrorMsg, toastSuccessMsg } from "@/utils/messageToast";
import { Button } from "@nextui-org/button";
import {
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tab,
  Tabs,
  useDisclosure,
  User,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Key, useEffect, useState } from "react";
import { LockIcon, LogoutIcon, MailIcon, SellerIcon, SettingIcon, XIcon } from "../icons";
import { checkIsLogin } from "@/utils/common";
import { HiCurrencyYen } from "react-icons/hi";

export default function Login() {
  const iconClasses = "text-xl pointer-events-none flex-shrink-0";

  const router = useRouter();

  const {
    isOpen: isLogoutModalOpen,
    onOpen: onLogoutModalOpen,
    onClose: onLogoutModalClose,
    onOpenChange: onLogoutModalOpenChange,
  } = useDisclosure();

  const {
    isOpen: isUpdatePasswordModalOpen,
    onOpen: onUpdatePasswordModalOpen,
    onClose: onUpdatePasswordModalClose,
    onOpenChange: onUpdatePasswordModalChange,
  } = useDisclosure();

  const [isModalOpen, setModalOpen] = useState(false);
  const [tabsSelected, setTabsSelected] = useState<string | number>("login");

  const [loginForm, setLoginForm] = useState<LoginReq>({
    email: "",
    password: "",
  });
  const [registerForm, setRegisterForm] = useState<RegisterReq>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrorMsg, setFormErrorMsg] = useState("");

  const { loginUser, setLoginUser, removeLoginUser } = useLoginUserStore((state) => ({
    loginUser: state.loginUser,
    setLoginUser: state.setLoginUser,
    removeLoginUser: state.removeLoginUser,
  }));
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    if (loginUser !== null) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [JSON.stringify(loginUser)]);

  const handlePressLoginBtn = () => {
    setModalOpen(true);
    setTabsSelected("login");
  };
  const handlePressSignBtn = () => {
    setModalOpen(true);
    setTabsSelected("sign-up");
  };

  const handleLogin = async (e: { preventDefault: () => void }, fromRegister?: boolean) => {
    e.preventDefault();
    try {
      const rsp = await login(loginForm);
      if (rsp.errCode !== 0) {
        setFormErrorMsg(rsp.errMsg);
      } else {
        setLoginUser({
          id: rsp.data.id,
          email: rsp.data.email,
          password: rsp.data.password,
          nickname: rsp.data.nickname,
          headerUrl: rsp.data.header_url,
          type: rsp.data.type,
          createTime: rsp.data.create_time,
        });
        setModalOpen(false);
        setFormErrorMsg("");
        setLoginForm({ email: "", password: "" });

        fromRegister ? "" : toastSuccessMsg("登录成功，欢迎来到 Prompt Run!");
      }
    } catch (error) {
      console.error("Error:", error);
      toastErrorMsg("登录失败，服务器开小差了，请稍后重试！");
    }
  };
  const handleRegister = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const rsp = await register(registerForm);
      if (rsp.errCode !== 0) {
        setFormErrorMsg(rsp.errMsg);
      } else {
        loginForm.email = registerForm.email;
        loginForm.password = registerForm.password;
        setRegisterForm({ email: "", password: "", confirmPassword: "" });
        setFormErrorMsg("");
        handleLogin(e, true);

        toastSuccessMsg("注册成功，欢迎来到 Prompt Run!");
      }
    } catch (error) {
      console.error("Error:", error);
      toastErrorMsg("注册失败，服务器开小差了，请稍后重试！");
    }
  };
  const handleLogout = async () => {
    try {
      const rsp = await logout();
      if (!checkIsLogin(rsp.errCode)) {
        removeLoginUser();
        router.refresh();
        toastErrorMsg("您未登录，请登录后再操作！");
      } else if (rsp.errCode !== Number(0)) {
        console.error("Error:", rsp.errMsg);
        toastErrorMsg("退出登录失败，服务器开小差了，请稍后重试！");
      } else {
        removeLoginUser();
        router.refresh();
        toastSuccessMsg("退出登录成功！");
      }
    } catch (error) {
      console.error("Error:", error);
      toastErrorMsg("退出登录失败，服务器开小差了，请稍后重试！");
    }

    onLogoutModalClose();
  };
  const handleUpdatePassword = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const rsp = await updatePassword(updatePasswordForm);
      if (rsp.errCode !== 0) {
        setFormErrorMsg(rsp.errMsg);
        return;
      } else {
        setUpdatePasswordForm({ userId: loginUser?.id || 0, oldPassword: "", newPassword: "", confirmNewPassword: "" });
        setFormErrorMsg("");
        await logout();
        removeLoginUser();
        router.push("/");
        toastSuccessMsg("密码修改成功，请重新登录 Prompt Run!");
      }
    } catch (error) {
      console.error("Error:", error);
      toastErrorMsg("密码修改失败，服务器开小差了，请稍后重试！");
    }
    onUpdatePasswordModalClose();
  };

  const [updatePasswordForm, setUpdatePasswordForm] = useState<UpdatePasswordReq>({
    userId: loginUser?.id || 0,
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    setUpdatePasswordForm({ userId: loginUser?.id || 0, oldPassword: "", newPassword: "", confirmNewPassword: "" });
  }, [loginUser]);

  const handleProfileDropdownMenu = async (key: Key) => {
    if (key === "logout") {
      onLogoutModalOpen();
    } else if (key === "seller") {
      router.push("/seller/dashboard");
    } else if (key === "profile") {
      router.push("/profile");
    } else if (key === "update_password") {
      onUpdatePasswordModalOpen();
    } else if (key === "wallet") {
      router.push("/wallet");
    }
  };

  return (
    <>
      {/* 未登录状态 */}
      <div className={`${isLogin ? "hidden" : ""} flex gap-2`}>
        <Button onPress={handlePressLoginBtn} className="text-md" color="primary" variant="light">
          登录
        </Button>
        <Button onPress={handlePressSignBtn} className="text-md" color="primary" variant="shadow">
          注册
        </Button>
      </div>
      {/* 登录注册弹窗 */}
      <Modal
        isOpen={isModalOpen}
        closeButton={
          <Button
            isIconOnly
            onPress={() => {
              setModalOpen(false);
              setLoginForm({ email: "", password: "" });
              setRegisterForm({ email: "", password: "", confirmPassword: "" });
              setFormErrorMsg("");
            }}
            size="sm"
            variant="light"
          >
            <XIcon />
          </Button>
        }
        backdrop="opaque"
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          },
        }}
      >
        <ModalContent className="bg-gradient-to-b from-default-50 to-[#21132E]">
          {(onClose) => (
            <>
              <ModalHeader className="flex">
                欢迎来到 Prompt
                <span className="text-primary">Run</span>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col w-full">
                  <Card className="h-[400px]">
                    <CardBody className="overflow-hidden">
                      <Tabs
                        fullWidth
                        size="md"
                        selectedKey={tabsSelected}
                        onSelectionChange={(key) => {
                          setTabsSelected(key);
                          setFormErrorMsg("");
                        }}
                      >
                        <Tab key="login" title="登录">
                          <form onSubmit={handleLogin} className="flex flex-col gap-4">
                            <Input
                              isRequired
                              variant="bordered"
                              value={loginForm.email}
                              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                              label="邮箱"
                              placeholder="请输入您的邮箱"
                              type="email"
                              endContent={
                                <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                              }
                            />
                            <Input
                              isRequired
                              variant="bordered"
                              value={loginForm.password}
                              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                              label="密码"
                              placeholder="请输入您的密码"
                              type="password"
                              endContent={
                                <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                              }
                            />
                            <p className="text-center text-small mt-[72px] text-default-500">
                              <span className="cursor-default">没有账号？</span>
                              <Link size="sm" onPress={() => setTabsSelected("sign-up")} className="cursor-pointer">
                                去注册
                              </Link>
                            </p>
                            <div className="flex flex-col gap-2 justify-end">
                              <span hidden={!formErrorMsg} className="text-danger text-[14px] self-center">
                                登录错误：{formErrorMsg}
                              </span>
                              <Button type="submit" fullWidth color="primary">
                                登录
                              </Button>
                            </div>
                          </form>
                        </Tab>
                        <Tab key="sign-up" title="注册">
                          <form onSubmit={handleRegister} className="flex flex-col gap-4 h-[300px]">
                            <Input
                              isRequired
                              variant="bordered"
                              value={registerForm.email}
                              onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                              label="邮箱"
                              placeholder="请输入您的邮箱"
                              type="email"
                              endContent={
                                <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                              }
                            />
                            <Input
                              isRequired
                              variant="bordered"
                              value={registerForm.password}
                              onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                              label="密码"
                              placeholder="请输入您的密码"
                              type="password"
                              endContent={
                                <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                              }
                            />
                            <Input
                              isRequired
                              variant="bordered"
                              value={registerForm.confirmPassword}
                              onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                              label="确认密码"
                              placeholder="请再次输入您的密码"
                              type="password"
                              endContent={
                                <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                              }
                            />
                            <p className="text-center text-small text-default-500">
                              <span className="cursor-default">已有账号？</span>
                              <Link size="sm" onPress={() => setTabsSelected("login")} className="cursor-pointer">
                                去登录
                              </Link>
                            </p>
                            <div className="flex flex-col gap-2 justify-end">
                              <span hidden={!formErrorMsg} className="text-danger text-[14px] self-center">
                                注册错误：{formErrorMsg}
                              </span>
                              <Button type="submit" fullWidth color="primary">
                                注册
                              </Button>
                            </div>
                          </form>
                        </Tab>
                      </Tabs>
                    </CardBody>
                  </Card>
                </div>
              </ModalBody>
              <ModalFooter />
            </>
          )}
        </ModalContent>
      </Modal>

      {/* 已登录状态 */}
      <Dropdown placement="bottom-start">
        <DropdownTrigger>
          <User
            as="button"
            avatarProps={{
              src: loginUser?.headerUrl,
            }}
            className={`${isLogin ? "" : "hidden"} transition-transform`}
            description={loginUser?.email}
            name={loginUser?.nickname}
          />
        </DropdownTrigger>
        <DropdownMenu
          variant="flat"
          onAction={(key) => {
            handleProfileDropdownMenu(key);
          }}
        >
          <DropdownItem key="profile" startContent={<SettingIcon className={iconClasses} />}>
            个人主页
          </DropdownItem>
          <DropdownItem key="wallet" startContent={<HiCurrencyYen className={iconClasses} />}>
            我的钱包
          </DropdownItem>
          <DropdownItem key="seller" showDivider startContent={<SellerIcon className={iconClasses} />}>
            卖家页面
          </DropdownItem>
          <DropdownItem key="update_password" color="primary" startContent={<LockIcon className={iconClasses} />}>
            修改密码
          </DropdownItem>
          <DropdownItem key="logout" color="danger" startContent={<LogoutIcon className={iconClasses} />}>
            退出登录
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Modal isOpen={isUpdatePasswordModalOpen} onOpenChange={onUpdatePasswordModalChange} backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">修改密码</ModalHeader>
              <ModalBody>
                <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4 mb-2">
                  <Input
                    isRequired
                    variant="bordered"
                    value={updatePasswordForm.oldPassword}
                    onChange={(e) => setUpdatePasswordForm({ ...updatePasswordForm, oldPassword: e.target.value })}
                    label="原密码"
                    placeholder="请输入您的原密码"
                    type="password"
                    endContent={<LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                  />
                  <Input
                    isRequired
                    variant="bordered"
                    value={updatePasswordForm.newPassword}
                    onChange={(e) => setUpdatePasswordForm({ ...updatePasswordForm, newPassword: e.target.value })}
                    label="新密码"
                    placeholder="请输入您的新密码"
                    type="password"
                    endContent={<LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                  />
                  <Input
                    isRequired
                    variant="bordered"
                    value={updatePasswordForm.confirmNewPassword}
                    onChange={(e) =>
                      setUpdatePasswordForm({ ...updatePasswordForm, confirmNewPassword: e.target.value })
                    }
                    label="确认新密码"
                    placeholder="请再次输入您的新密码"
                    type="password"
                    endContent={<LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                  />
                  <div className="flex flex-col gap-2 justify-end">
                    <span hidden={!formErrorMsg} className="text-danger text-[14px] self-center">
                      修改错误：{formErrorMsg}
                    </span>
                    <Button type="submit" fullWidth color="primary">
                      修改密码
                    </Button>
                  </div>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

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
    </>
  );
}
