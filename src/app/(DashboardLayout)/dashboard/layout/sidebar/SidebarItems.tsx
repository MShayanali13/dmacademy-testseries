import React, { useEffect, useState } from "react";
import {
  CollegeMenuitems,
  TeacherMenuitems,
  AdminMenuitems,
  StudentMenuitems,
} from "./MenuItems";
import { usePathname } from "next/navigation";
import { Box, List } from "@mui/material";
import NavItem from "./NavItem";
import NavGroup from "./NavGroup/NavGroup";
import { UserData } from "@/types/UserType";

type MenuItemType = {
  id?: string;
  title?: string;
  href?: string;
  icon?: any;
  navlabel?: boolean;
  subheader?: string;
};

const SidebarItems = ({ toggleMobileSidebar }: { toggleMobileSidebar: () => void }) => {
  const pathname = usePathname();
  const pathDirect = pathname;
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/Get-Current-User");
      const data = await res.json();
      if (res.ok) {
        setUserData(data.user);
      }
    }

    fetchData();
  }, []);

  const menuItems: MenuItemType[] =
    (userData?.role === "admin" && AdminMenuitems) ||
    (userData?.role === "college" && CollegeMenuitems) ||
    (userData?.role === "student" && StudentMenuitems) ||
    (userData?.role === "teacher" && TeacherMenuitems) ||
    [];

  return (
    <Box sx={{ px: 3 ,borderTop:"1px solid #dcdcdc"}}>
      <List sx={{ pt: 3, }} className="sidebarNav" component="div">
        {menuItems.map((item) => {
          if (item.subheader) {
            return <NavGroup item={item} key={item.id} />;
          }

          return (
            <NavItem
              item={item}
              key={item.id}
              pathDirect={pathDirect}
              onClick={toggleMobileSidebar}
            />
          );
        })}
      </List>
    </Box>
  );
};

export default SidebarItems;
