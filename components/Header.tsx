"use client";
import { Button, Image, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/react";
import { usePathname } from "next/navigation";
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
          <Image src="/nav_logo.png" width="120px" height="120px" alt="logo" className="mt-1" />
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4 bg-default-50 rounded-full h-12 " justify="center">
        <NavbarItem isActive={navItemIsActive("/market")} className="ml-1">
          <Button
            as={Link}
            variant={navItemIsActive("/market") ? "shadow" : "light"}
            radius="full"
            color={navItemIsActive("/market") ? "primary" : "default"}
            href="/market"
          >
            交易市场
          </Button>
        </NavbarItem>
        <NavbarItem isActive={navItemIsActive("/seller")}>
          <Button
            as={Link}
            variant={navItemIsActive("/seller/") ? "shadow" : "light"}
            radius="full"
            color={navItemIsActive("/seller/") ? "primary" : "default"}
            href="/seller/dashboard"
          >
            出售 Prompt
          </Button>
        </NavbarItem>
        <NavbarItem isActive={navItemIsActive("/about")} className="mr-1">
          <Button
            as={Link}
            variant={navItemIsActive("/about") ? "shadow" : "light"}
            radius="full"
            color={navItemIsActive("/about") ? "primary" : "default"}
            href="/about"
          >
            关于我们
          </Button>
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
