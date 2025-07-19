"use client";
import { styled, Container, Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "./layout/header/Header";
import Sidebar from "./layout/sidebar/Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Loading from "./loading";


const MainWrapper = styled("div")(() => ({
  display: "flex",
  minHeight: "100vh",
  width: "100%",
}));

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  paddingBottom: "60px",
  flexDirection: "column",
  zIndex: 1,
  backgroundColor: "transparent",
}));

interface Props {
  children: React.ReactNode;
}



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router=useRouter()
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pathname = usePathname(); // 👈 Get current URL
const [isLoading,setIsLoading]=useState(true)

const [isTestPage,setIsTestPage]=useState(false)

  // Pages where sidebar should be hidden
  const hideSidebarPaths = [
    "/dashboard/student/test",
  ]  

  const shouldHideSidebar = hideSidebarPaths.includes(pathname);
 const {isSignedIn,isLoaded}=useUser()
useEffect(() => {
  if (!isLoaded) return; // Wait until Clerk has finished loading

  if (isSignedIn) {
    fetch("/api/Save-User/", { method: "POST" });
    setIsLoading(false);
  } else{
    router.push("/");
  }
}, [isSignedIn, isLoaded]);

useEffect(()=>{
if (typeof window !== 'undefined') {
  setIsTestPage(window?.location.pathname.includes("/student/test"))
}
},[])
// useEffect(()=>{
// if(isSignIn&&isTestPage){
//   setIsLoading(false)
// }
// },[isSignIn,isTestPage])



if(isLoading){
  return <Loading />
}
  return (
    <MainWrapper className="mainwrapper">
      {/* ------------------------------------------- */}
      {/* Sidebar */}
      {/* ------------------------------------------- */}
      {!shouldHideSidebar && (  <Sidebar
        isSidebarOpen={isSidebarOpen}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onSidebarClose={() => setMobileSidebarOpen(false)}
      />
      )}
      {/* ------------------------------------------- */}
      {/* Main Wrapper */}
      {/* ------------------------------------------- */}
      <PageWrapper className={`page-wrapper ${!isTestPage&&"custom-lg-xl:max-w-[calc(100vw-277px)]"}`}>
        {/* ------------------------------------------- */}
        {/* Header */}
        {/* ------------------------------------------- */}
        <Header toggleMobileSidebar={() => setMobileSidebarOpen(true)}  />
        {/* ------------------------------------------- */}
        {/* PageContent */}
        {/* ------------------------------------------- */}
        <Container
          sx={{
            paddingTop: "20px",
            maxWidth: "100vw",
            overflowX:"hidden"
          }}
        >
          {/* ------------------------------------------- */}
          {/* Page Route */}
          {/* ------------------------------------------- */}
          <Box sx={{ minHeight: "calc(100vh - 170px)" }}>{children}</Box>
          {/* ------------------------------------------- */}
          {/* End Page */}
          {/* ------------------------------------------- */}
        </Container>
      </PageWrapper>
    </MainWrapper>
  );
}
