"use client";

import Link from "next/link";
import * as React from "react";
import { usePathname } from "next/navigation";

import {
  IconLogs,
  IconDashboard,
  IconHelp,
  IconUsers,
  IconSettings,
  IconTextScan2,
  IconKey,
} from "@tabler/icons-react";

import { VizevalIcon } from "@/components/icons/vizaval-icon";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Alexandre",
    email: "alexandre@akiraenem.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: IconDashboard,
    },
    {
      title: "Requests",
      url: "/requests",
      icon: IconLogs,
    },
    {
      title: "Evaluators",
      url: "/evaluators",
      icon: IconUsers,
    },
    {
      title: "Prompts",
      url: "/prompts",
      icon: IconTextScan2,
    },
    {
      title: "API Keys",
      url: "/api-keys",
      icon: IconKey,
    },
  ],

  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "/help",
      icon: IconHelp,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <VizevalIcon className="!size-5" />
                <span className="text-lg font-semibold font-serif tracking-wide">
                  Vizeval
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} currentPath={pathname} />
        <NavSecondary
          items={data.navSecondary}
          currentPath={pathname}
          className="mt-auto"
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
