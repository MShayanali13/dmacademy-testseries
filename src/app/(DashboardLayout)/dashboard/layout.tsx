// "use client";
// import { styled, Container, Box, Button } from "@mui/material";
// import React, { useEffect, useState } from "react";
// import Header from "./layout/header/Header";
// import Sidebar from "./layout/sidebar/Sidebar";
// import { usePathname, useRouter } from "next/navigation";
// import { useUser } from "@clerk/nextjs";
// import Loading from "./loading";


// const MainWrapper = styled("div")(() => ({
//   display: "flex",
//   minHeight: "100vh",
//   width: "100%",
// }));

// const PageWrapper = styled("div")(() => ({
//   display: "flex",
//   flexGrow: 1,
//   paddingBottom: "60px",
//   flexDirection: "column",
//   zIndex: 1,
//   backgroundColor: "transparent",
// }));

// interface Props {
//   children: React.ReactNode;
// }



// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router=useRouter()
//   const [isSidebarOpen, setSidebarOpen] = useState(true);
//   const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
//   const pathname = usePathname(); // 👈 Get current URL
// const [isLoading,setIsLoading]=useState(true)

// const [isTestPage,setIsTestPage]=useState(false)

//   // Pages where sidebar should be hidden
//   const hideSidebarPaths = [
//     "/dashboard/student/test",
//   ]  

//   const shouldHideSidebar = hideSidebarPaths.includes(pathname);
//  const {isSignedIn,isLoaded}=useUser()
// useEffect(() => {
//   if (!isLoaded) return; // Wait until Clerk has finished loading

//   if (isSignedIn) {
//     fetch("/api/Save-User/", { method: "POST" });
//     setIsLoading(false);
//   } else{
//     router.push("/");
//   }
// }, [isSignedIn, isLoaded]);

// useEffect(()=>{
// if (typeof window !== 'undefined' && window?.location.pathname) {
//   setIsTestPage(window?.location.pathname.includes("/student/test"))
//   // alert(isTestPage)
//   // alert(window?.location.pathname)
// }
// },[])

//  const { user } = useUser();

//   const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!isLoaded) return; // Wait until Clerk is ready

//     if (!isSignedIn) {
//       router.push("/"); // Redirect on client
//       return;
//     }

//     // Fetch role from backend
//     async function fetchUserData() {
//       try {
//         const res = await fetch("/api/Get-Current-User");
//         const data = await res.json();
//         if (res.ok && data.user?.isSubscribed) {
         
//           setIsSubscribed(data.user.isSubscribed)
//           console.log(isSubscribed)
//         }
//       } catch (error) {
//         console.error("Failed to fetch:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchUserData();
//   }, [isLoaded, isSignedIn]);

// // useEffect(()=>{
// // if(isSignIn&&isTestPage){
// //   setIsLoading(false)
// // }
// // },[isSignIn,isTestPage])



// if(isLoading){
//   return <Loading />
// }
//   return (
//     <MainWrapper className="mainwrapper bg-gray-50">
//       {/* ------------------------------------------- */}
//       {/* Sidebar */}
//       {/* ------------------------------------------- */}
//       {!shouldHideSidebar && isSubscribed && (  <Sidebar
//         isSidebarOpen={isSidebarOpen}
//         isMobileSidebarOpen={isMobileSidebarOpen}
//         onSidebarClose={() => setMobileSidebarOpen(false)}
//       />
//       )}
//       {/* ------------------------------------------- */}
//       {/* Main Wrapper */}
//       {/* ------------------------------------------- */}
//       <PageWrapper
//         className={`page-wrapper`}
//         // Use inline style so test pages can be full viewport width while other pages account for the sidebar
//         style={{
//           maxWidth:
//             isTestPage
//               ? "100vw"
//               : isSubscribed
//               ? window.innerWidth >= 1200 // lg breakpoint
//           ? "calc(100vw - 277px)"
//           : "100vw"
//               : "100vw",
//           marginLeft: 0,
//         }}
//             >
//         {/* ------------------------------------------- */}
//         {/* Header */}
//         {/* ------------------------------------------- */}
//         <Header hide={shouldHideSidebar||isSubscribed} toggleMobileSidebar={() => setMobileSidebarOpen(true)}  />
//         {/* ------------------------------------------- */}
//         {/* PageContent */}
//         {/* ------------------------------------------- */}
//         <Container
//           sx={{
//             paddingTop: "20px",
//             maxWidth: "100vw",
//             overflowX:"hidden"
//           }}
//         >
//           {/* ------------------------------------------- */}
//           {/* Page Route */}
//           {/* ------------------------------------------- */}
//           <Box sx={{ minHeight: "calc(100vh - 170px)" }}>{children}</Box>
//           {/* ------------------------------------------- */}
//           {/* End Page */}
//           {/* ------------------------------------------- */}
//         </Container>
//       </PageWrapper>
//     </MainWrapper>
//   );
// }


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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isSignedIn, isLoaded, user } = useUser();

  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  // ✅ track screen width properly
  const [screenWidth, setScreenWidth] = useState<number>(1200);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setScreenWidth(window.innerWidth);
      const handleResize = () => setScreenWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // hide sidebar paths
  const hideSidebarPaths = ["/dashboard/student/test"];
  const shouldHideSidebar = hideSidebarPaths.includes(pathname);
  const isTestPage = pathname.includes("/student/test");

  // Clerk auth + subscription
  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      fetch("/api/Save-User/", { method: "POST" });
      setIsLoading(false);
    } else {
      router.push("/");
    }
  }, [isSignedIn, isLoaded]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    async function fetchUserData() {
      try {
        const res = await fetch("/api/Get-Current-User");
        const data = await res.json();
        if (res.ok && data.user?.isSubscribed) {
          setIsSubscribed(data.user.isSubscribed);
        }
      } catch (error) {
        console.error("Failed to fetch:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, [isLoaded, isSignedIn]);

  if (isLoading) return <Loading />;

  // ✅ Width logic (NO flicker now)
  const maxWidth = isTestPage
    ? "100vw"
    : isSubscribed
    ? screenWidth >= 1200
      ? "calc(100vw - 277px)" // sidebar space
      : "100vw"
    : "100vw";

  return (
    <MainWrapper className="mainwrapper bg-gray-50">
      {/* Sidebar */}
      {!shouldHideSidebar && isSubscribed && (
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          isMobileSidebarOpen={isMobileSidebarOpen}
          onSidebarClose={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Main wrapper */}
      <PageWrapper
        className="page-wrapper"
        style={{
          maxWidth,
          marginLeft: 0,
        }}
      >
        <Header
          hide={shouldHideSidebar?true: !isSubscribed}
          toggleMobileSidebar={() => setMobileSidebarOpen(true)}
        />

        <Container
          sx={{
            paddingTop: "20px",
            maxWidth: "100vw",
            overflowX: "hidden",
          }}
        >
          <Box sx={{ minHeight: "calc(100vh - 170px)" }}>{children}</Box>
        </Container>
      </PageWrapper>
    </MainWrapper>
  );
}
