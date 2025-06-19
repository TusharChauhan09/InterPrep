"use client";

import { useTheme } from "next-themes";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import {
  SignedIn,
  SignedOut,
  SignIn,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import DashboardBtn from "./DashboardBtn";
import dark from "../../Public/dark.png";
import light from "../../Public/light.png";
import Image from "next/image";
import Link from "next/link";

const NavBar = () => {
  const { theme } = useTheme();
  return (
    <nav className=" mx-4 my-2 border-2 rounded-xl  ">
      <div className="flex h-15 justify-between item-center px-4 conatiner mx-auto">
        {/* left : LOGO */}
        <div className=" flex justify-center items-center ">
          <Link href={"./"}>
            {theme === "dark" && (
              <Image src={dark} alt={"dark logo"} className="size-25" />
            )}
            {theme === "light" && (
              <Image src={light} alt={"light logo"} className="size-25" />
            )}
          </Link>
        </div>

        {/* right : functions */}
        <div className="flex items-center gap-5">
          <SignedIn>
            <div className=" flex items-center gap-4 ">
              <DashboardBtn />
              <UserButton />
            </div>
          </SignedIn>
          <SignedOut>
            <Button>
              <SignInButton>Sign in</SignInButton>
            </Button>
          </SignedOut>
          <div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
