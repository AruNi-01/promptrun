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
        <NavbarItem isActive={navItemIsActive("/market")}>
          <Link color={navItemIsActive("/market") ? "primary" : "foreground"} href="/market">
            交易市场
          </Link>
        </NavbarItem>
        <NavbarItem isActive={navItemIsActive("/seller")}>
          <Link color={navItemIsActive("/seller") ? "primary" : "foreground"} href="/seller">
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
