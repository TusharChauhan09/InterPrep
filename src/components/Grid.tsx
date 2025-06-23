"use client";

import { cn } from "@/lib/utils";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { useThemeMode } from "@/hooks/useThemeMode";
import dark from "../../Public/dark.png";
import light from "../../Public/light.png";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { Github } from "lucide-react";

export function Grid() {
  const theme = useThemeMode();
  return (
    <div className="relative flex min-h-110 w-full items-center justify-center overflow-hidden rounded-lg  p-20">
      {/* <p className="z-10 whitespace-pre-wrap text-center text-5xl font-medium tracking-tighter text-black dark:text-white">
      </p> */}
      <div className="relavtive flex flex-col items-center"> 
        <div className="">
          {theme === "dark" && (
            <Image src={dark} alt={"dark logo"} className="size-120" />
          )}
          {theme === "light" && (
            <Image src={light} alt={"light logo"} className="size-120" />
          )}
        </div>
        <div className=" absolute bottom-50 flex space-x-5 ">
          <Button className=" text-md p-5  font-bold rounded-2xl border-2 " >Get Started</Button>
          <Link href={'https://github.com/TusharChauhan09/InterPrep'}>
          <Button className=" text-md p-5 font-bold rounded-2xl hover: cursor-pointer " >Repository 
            <Github  className=" size-[10] "/>
          </Button>
          </Link>
        </div>
      </div>
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
        )}
      />
    </div>
  );
}
