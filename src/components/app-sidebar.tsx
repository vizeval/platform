"use client";

import * as React from "react";
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
      url: "#",
      icon: IconDashboard,
    },
    {
      title: "Requests",
      url: "#",
      icon: IconLogs,
    },
    {
      title: "Evaluators",
      url: "#",
      icon: IconUsers,
    },
    {
      title: "Prompts",
      url: "#",
      icon: IconTextScan2,
    },
    {
      title: "API Keys",
      url: "#",
      icon: IconKey,
    },
  ],

  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <VizevalIcon className="!size-5" />
                <span className="text-lg font-semibold font-serif tracking-wide">
                  Vizeval
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
