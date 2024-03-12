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
  User,
} from "@nextui-org/react";
import { useState } from "react";
import { LockIcon, LogoutIcon, MailIcon, SellerIcon, SettingIcon, UserIcon, XIcon } from "../icons";

export default function Login() {
  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

  const [isModalOpen, setModalOpen] = useState(false);
  const [tabsSelected, setTabsSelected] = useState<string | number>("login");

  const handlePressLoginBtn = () => {
    setModalOpen(true);
    setTabsSelected("login");
  };
  const handlePressSignBtn = () => {
    setModalOpen(true);
    setTabsSelected("sign-up");
  };

  const handleLogin = () => {
    // TODO: 请求登录接口
    setModalOpen(false);
    console.log("login");
  };
  const handleRegister = () => {
    // TODO: 请求注册接口
    setModalOpen(false);
    console.log("register");
  };

  return (
    <>
      {/* 未登录状态 */}
      <div className="flex gap-2 hidden">
        <Button onPress={handlePressLoginBtn} className="text-md" color="primary" variant="light">
          登录
        </Button>
        <Button onPress={handlePressSignBtn} className="text-md" color="primary" variant="flat">
          注册
        </Button>
      </div>
      {/* 登录注册弹窗 */}
      <Modal
        isOpen={isModalOpen}
        closeButton={
          <Button isIconOnly onPress={() => setModalOpen(false)} size="sm" variant="light">
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
                        aria-label="Tabs form"
                        selectedKey={tabsSelected}
                        onSelectionChange={setTabsSelected}
                      >
                        <Tab key="login" title="登录">
                          <form className="flex flex-col gap-4">
                            <Input
                              isRequired
                              label="Email"
                              placeholder="Enter your email"
                              type="email"
                              endContent={
                                <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                              }
                            />
                            <Input
                              isRequired
                              label="Password"
                              placeholder="Enter your password"
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
                            <div className="flex gap-2 justify-end">
                              <Button fullWidth color="primary" onClick={handleLogin}>
                                登录
                              </Button>
                            </div>
                          </form>
                        </Tab>
                        <Tab key="sign-up" title="注册">
                          <form className="flex flex-col gap-4 h-[300px]">
                            <Input
                              isRequired
                              label="Name"
                              placeholder="Enter your name"
                              type="password"
                              endContent={
                                <UserIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                              }
                            />
                            <Input
                              isRequired
                              label="Email"
                              placeholder="Enter your email"
                              type="email"
                              endContent={
                                <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                              }
                            />
                            <Input
                              isRequired
                              label="Password"
                              placeholder="Enter your password"
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
                            <div className="flex gap-2 justify-end">
                              <Button fullWidth color="primary" onClick={handleRegister}>
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
            avatarProps={{}}
            className="transition-transform"
            description="hello@0x3f4.run"
            name="AarynLu"
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="User Actions" variant="flat">
          <DropdownItem key="settings" startContent={<SettingIcon className={iconClasses} />}>
            个人设置
          </DropdownItem>
          <DropdownItem key="seller" showDivider startContent={<SellerIcon className={iconClasses} />}>
            卖家页面
          </DropdownItem>
          <DropdownItem key="logout" color="danger" startContent={<LogoutIcon className={iconClasses} />}>
            退出登录
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
}
