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

const AdminMenuitems = [
  
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/dashboard/",
  },
  {
    navlabel: true,
    subheader: "Student",
  },
  {
    id: uniqueId(),
    title: "All Test Records",
    icon : IconReportAnalytics,
    
    href: "/dashboard/student/all_results",
  },
  {
    id: uniqueId(),
    title: "Take A New Test",
 
    icon: IconCopy,
    href: "/dashboard/student/select-test",
  },
  {
    navlabel: true,
    subheader: "Admin",
  },
  {
    id: uniqueId(),
    title: "Manage Users",
    icon: IconAperture,
    href: "/dashboard/admin/manage-users",
  },
  // { 
  //   id:uniqueId(),
  //   title:"Manage Chapters",
  //   icon:IconAperture,
  //   herf:"/dashboard/admin/manage-subjectWithChapter"
  // },
  {
    id: uniqueId(),
    title: "Manage Chapters",
    icon: IconAperture,
    href: "/dashboard/admin/manage-subjectWithChapter",
  },
   {
    id: uniqueId(),
    title: "Manage Question Bank",
    icon: IconAperture,
    href: "/dashboard/admin/manage-questionBank",
  },
  {
    id: uniqueId(),
    title: "Generate Question Paper",
    icon: IconAperture,
    href: "/dashboard/admin/generate-question-paper",
  },
  {
    id: uniqueId(),
    title: "Set Question Bank",
    icon: IconUserPlus,
    href: "/dashboard/admin/set-question-bank",
  },
 
];


const StudentMenuitems = [
  
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/dashboard/",
  },
  
  {
    id: uniqueId(),
    title: "All Test Records",
    icon : IconReportAnalytics,
    
    href: "/dashboard/student/all_results",
  },
  {
    id: uniqueId(),
    title: "Take A New Test",
 
    icon: IconCopy,
    href: "/dashboard/student/select-test",
  },
  
 
];


const TeacherMenuitems = [
  
 
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/dashboard/",
  },
  {
    id: uniqueId(),
    title: "Manage Question Bank",
    icon: IconAperture,
    href: "/dashboard/admin/manage-questionBank",
  },
  {
    id: uniqueId(),
    title: "Set Question Bank",
    icon: IconUserPlus,
    href: "/dashboard/admin/set-question-bank",
  },
 
];



const CollegeMenuitems = [
  
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/dashboard/",
  },
  {
    navlabel: true,
    subheader: "Student",
  },
  {
    id: uniqueId(),
    title: "All Test Records",
    icon : IconReportAnalytics,
    
    href: "/dashboard/student/all_results",
  },
  {
    id: uniqueId(),
    title: "Take A New Test",
 
    icon: IconCopy,
    href: "/dashboard/student/select-test",
  },
  {
    navlabel: true,
    subheader: "Admin",
  },
  {
    id: uniqueId(),
    title: "Manage Question Bank",
    icon: IconAperture,
    href: "/dashboard/admin/manage-questionBank",
  },
  {
    id: uniqueId(),
    title: "Set Question Bank",
    icon: IconUserPlus,
    href: "/dashboard/admin/set-question-bank",
  },
 
];

export {CollegeMenuitems,TeacherMenuitems,AdminMenuitems,StudentMenuitems};


const Menuitems = [
  
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/dashboard/",
  },
  {
    navlabel: true,
    subheader: "Student",
  },
  {
    id: uniqueId(),
    title: "All Test Records",
    icon : IconReportAnalytics,
    
    href: "/dashboard/student/all_results",
  },
  {
    id: uniqueId(),
    title: "Take A New Test",
 
    icon: IconCopy,
    href: "/dashboard/student/select-test",
  },
  {
    navlabel: true,
    subheader: "Admin",
  },
  {
    id: uniqueId(),
    title: "Manage Question Bank",
    icon: IconAperture,
    href: "/dashboard/admin/manage-questionBank",
  },
  {
    id: uniqueId(),
    title: "Set Question Bank",
    icon: IconUserPlus,
    href: "/dashboard/admin/set-question-bank",
  },
 
];

export default Menuitems;