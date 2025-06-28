"use client";
import { baselightTheme } from "@/utils/theme/DefaultColors";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
//   const router=useRouter()
//   const isLoad=useUser().isLoaded
//   const isSignIn=useUser().isSignedIn
// const [isLoading,setIsLoading]=useState(true)



// useEffect(() => {
//   if (!isLoad) return; // Wait until Clerk has finish loading

//   if (isSignIn) {
//     fetch("/api/Save-User", { method: "POST" });
//     setIsLoading(false);
//   } else {
//     router.push("/");
//   }
// }, [isSignIn, isLoad]);

// if(isLoading){
//   return <Loading />
// }

  return (
    <ClerkProvider>
      
          <html lang="en">
      <body >
        <ThemeProvider theme={baselightTheme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>

  );
}
