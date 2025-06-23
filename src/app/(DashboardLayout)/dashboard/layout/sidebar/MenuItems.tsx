import {
  IconAperture,
  IconCopy,
  IconLayoutDashboard,
  IconLogin,
  IconMoodHappy,
  IconReportAnalytics,
  IconTypography,
  IconUserPlus,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "Home",
  },

  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/",
  },
  {
    navlabel: true,
    subheader: "Student",
  },
  {
    id: uniqueId(),
    title: "All Test Records",
    icon : IconReportAnalytics,
    
    href: "/student/all_results",
  },
  {
    id: uniqueId(),
    title: "Take A New Test",
 
    icon: IconCopy,
    href: "/student/select-test",
  },
  {
    navlabel: true,
    subheader: "Admin",
  },
  {
    id: uniqueId(),
    title: "Manage Question Bank",
    icon: IconAperture,
    href: "/admin/manage-questionBank",
  },
  {
    id: uniqueId(),
    title: "Set Question Bank",
    icon: IconUserPlus,
    href: "/admin/set-question-bank",
  },
  // {
  //   navlabel: true,
  //   subheader: "Extra",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Icons",
  //   icon: IconMoodHappy,
  //   href: "/icons",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Sample Page",
  //   icon: IconAperture,
  //   href: "/sample-page",
  // },
];

export default Menuitems;
