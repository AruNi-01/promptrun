import {
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

export default function App() {
  const pathname = usePathname();
  const navItemIsActive = (path: string): boolean => {
    return path !== "/" ? pathname.startsWith(path) : false;
  };

  return (
    <Navbar height={"80px"}>
      <NavbarBrand>
        <Link href="/" color="foreground">
          <p className="font-bold text-lg">
            Prompt
            <span className="text-primary">Run</span>
          </p>
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <Dropdown>
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
              endContent={<AnimateArrow arrowColor="text-primary" size={18} />}
              color="primary"
              href="market/all"
            >
              <p className="text-primary">所有模型</p>
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
          <Button as={Link} color="primary" href="/login" variant="flat">
            <AnimateArrow text="登录" size={18} />
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
