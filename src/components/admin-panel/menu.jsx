"use client";

import Link from "next/link";
import { LandPlot } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import SocialLinks from "@/components/SocialLinks"; // Import the SocialLinks component

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from "@/components/ui/tooltip";
import Details from "@/components/Details";

export function Menu({ isOpen, location }) {
  const pathname = usePathname();

  return (
    <ScrollArea className="[&>div>div[style]]:!block">
      <nav className="mt-8 pt-4 h-full w-full">
        <ul className="flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)] items-start space-y-1 px-2">
          <li className="w-full pt-5">
            <div className="w-full">
              <TooltipProvider disableHoverableContent>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={
                        pathname === "/dashboard" ? "secondary" : "ghost"
                      }
                      className={`w-full justify-start h-10 mb-1 rounded-md p-4 flex items-center 
    ${
      pathname === "/dashboard"
        ? ""
        : "bg-[#F9FAFB] bg-opacity-70 backdrop-blur-md border  border-gray-300"
    } 
      dark:bg-[#1F2937]  text-white`}
                      asChild
                    >
                      <Link
                        href="/dashboard"
                        className="flex items-center w-full"
                      >
                        <span className={cn(isOpen === false ? "" : " mr-4")}>
                          <LandPlot size={18} />
                        </span>
                        <p
                          className={cn(
                            "max-w-[200px] truncate text-lg font-medium",
                            isOpen === false
                              ? "-translate-x-96 opacity-0"
                              : "translate-x-0 opacity-100"
                          )}
                        >
                          GlobeCenter
                        </p>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  {isOpen === false && (
                    <TooltipContent side="right">Home</TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>
          </li>
          <Details location={location} />
          <SocialLinks />
        </ul>
      </nav>
    </ScrollArea>
  );
}
