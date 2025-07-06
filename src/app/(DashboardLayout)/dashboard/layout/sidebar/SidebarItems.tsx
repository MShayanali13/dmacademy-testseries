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

  interface SidebarItemsProps {
  toggleMobileSidebar: () => void;
}

const SidebarItems = ({ toggleMobileSidebar }: SidebarItemsProps) => {
  const pathname = usePathname();
  const pathDirect = pathname;
  const [userData, setUserData] = useState<UserData | null>(null);
const [isLoading,setIsLoading]=useState(true)


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
        {menuItems.map((item,i) => {
          if (item.subheader) {
            return <NavGroup item={item} key={i} />;
          }

          return (
            <NavItem
              item={item}
              key={i}
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
