"use client";
import {
  Avatar,
  AvatarIcon,
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  cn,
} from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { ChevronDownIcon } from "./icons";
import AnimateArrow from "./ui/AnimateArrow";
import Login from "./login/Login";

export default function App() {
  const pathname = usePathname();
  const navItemIsActive = (path: string): boolean => {
    return path !== "/" ? pathname.startsWith(path) : false;
  };

  return (
    <Navbar height={"80px"} isBordered>
      <NavbarBrand>
        <Link href="/" color="foreground">
          <p className="font-bold text-2xl">
            Prompt
            <span className="text-primary">Run</span>
          </p>
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <Dropdown placement="bottom-start">
          <NavbarItem isActive={navItemIsActive("/market")}>
            <DropdownTrigger>
              <Button
                disableRipple
                className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                endContent={navItemIsActive("/market") ? <ChevronDownIcon color="#0070F0" /> : <ChevronDownIcon />}
              >
                <p className={cn("text-medium", navItemIsActive("/market") ? "text-primary" : "text-foreground")}>
                  交易市场
                </p>
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu
            color="default"
            variant="flat"
            className="w-[240px]"
            itemClasses={{
              base: "gap-4",
            }}
          >
            <DropdownItem
              key="autoscaling"
              // startContent={icons.cloud}
              endContent={<AnimateArrow size={18} />}
              href="market/gpt"
            >
              GPT
            </DropdownItem>
            <DropdownItem
              key="autoscaling"
              // startContent={icons.cloud}
              endContent={<AnimateArrow size={18} />}
              href="market/dall-e"
              showDivider={true}
            >
              DALL·E
            </DropdownItem>
            <DropdownItem
              key="autoscaling"
              // startContent={icons.cloud}
              endContent={<AnimateArrow size={18} />}
              color="primary"
              href="market/all"
            >
              所有模型
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <NavbarItem isActive={navItemIsActive("/sell")}>
          <Link color={navItemIsActive("/sell") ? "primary" : "foreground"} href="/sell">
            出售 Prompt
          </Link>
        </NavbarItem>
        <NavbarItem isActive={navItemIsActive("/about")}>
          <Link color={navItemIsActive("/about") ? "primary" : "foreground"} href="/about">
            关于我们
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Login />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
