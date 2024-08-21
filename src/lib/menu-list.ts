import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon,
  LandPlot,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "GlobeCenter",
          active: pathname.includes("/dashboard"),
          icon: LandPlot,
          submenus: []
        },
        {
          href: "/details", // Add route for Details component
          label: "Details",
          active: pathname.includes("/details"),
          icon: Bookmark, // Use an appropriate icon for Details
          submenus: []
        }
      ]
    }
  ];
}
