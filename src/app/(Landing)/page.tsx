'use client'

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import ContactSection from "./components/ContactSection";
import ExamsSection from "./components/ExamsSection";
import FeaturesSection from "./components/FeaturesSection";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import PricingSection from "./components/PricingSection";
import TestimonialsSection from "./components/TestimonialsSection";
import { Box } from "@mui/material";
// import "./landing.css";


export default function Home() {
  const { isSignedIn } = useUser();

useEffect(() => {
  if (isSignedIn) {
    fetch("/api/Save-User/", { method: "POST" });
  }
}, [isSignedIn]);
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
