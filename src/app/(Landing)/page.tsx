'use client'

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import ContactSection from "./components/ContactSection";
import ExamsSection from "./components/ExamsSection";
import FeaturesSection from "./components/FeaturesSection";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import PricingSection from "./components/PricingSection";
import TestimonialsSection from "./components/TestimonialsSection";
import { Box } from "@mui/material";
import Loading from "../loading";
import { useRouter } from "next/navigation";
// import "./landing.css";


export default function Home() {
  const router=useRouter()
  const [isLoading,setIsLoading]=useState(true)
 const {isSignedIn,isLoaded}=useUser()

useEffect(() => {
  if (!isLoaded) return; // Wait until Clerk has finished loading
 
  setIsLoading(false);

  if (isSignedIn) {
    fetch("/api/Save-User/", { method: "POST" });
// router.push("/dashboard")

  }
}, [isSignedIn, isLoaded]);

if(isLoading){
  return <Loading />
}

  return (
  <Box 
      sx={{ 
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary'
      }}
    >
      <Navbar />
      <Box component="main">
        <HeroSection />
        <FeaturesSection />
        <ExamsSection />
        <PricingSection />
        <TestimonialsSection />
        <ContactSection />
      </Box>
      <Footer />
    </Box>
  );
}
