"use client";

import { useState, useEffect } from "react";
import { Button } from "@mui/material"; // Updated import
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";

type ExamType = "jee" | "neet" | "cet";

interface SlideContent {
  title: string;
  titleHighlight: string;
  description: string;
  primaryButtonText: string;
  primaryButtonColor: string;
  secondaryButtonText: string;
  secondaryButtonColor: string;
  secondaryButtonBorder: string;
  secondaryButtonHover: string;
  benefit: string;
  imageUrl: string;
  imageAlt: string;
}

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const examTypes: ExamType[] = ["jee", "neet", "cet"];

  const slideContent: Record<ExamType, SlideContent> = {
    jee: {
      title: "Ace Your",
      titleHighlight: "JEE",
      description: "Comprehensive preparation for JEE Main & Advanced with expert-led courses, practice tests, and personalized feedback.",
      primaryButtonText: "Start JEE Prep",
      primaryButtonColor: "bg-primary hover:bg-blue-700",
      secondaryButtonText: "Learn More",
      secondaryButtonColor: "text-primary",
      secondaryButtonBorder: "border-primary",
      secondaryButtonHover: "hover:bg-blue-50",
      benefit: "90+ percentile guarantee",
      imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&h=600",
      imageAlt: "Students preparing for JEE exam"
    },
    neet: {
      title: "Prepare for",
      titleHighlight: "NEET",
      description: "Master Biology, Physics, and Chemistry with our specialized NEET preparation courses designed by medical professionals.",
      primaryButtonText: "Start NEET Prep",
      primaryButtonColor: "bg-[#2E7D32] hover:bg-green-800",
      secondaryButtonText: "Learn More",
      secondaryButtonColor: "text-[#2E7D32]",
      secondaryButtonBorder: "border-[#2E7D32]",
      secondaryButtonHover: "hover:bg-green-50",
      benefit: "Complete NCERT coverage",
      imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&h=600",
      imageAlt: "Medical students preparing for NEET"
    },
    cet: {
      title: "Conquer",
      titleHighlight: "CET",
      description: "State-specific Common Entrance Test preparation with focused strategies and extensive mock tests for top college admissions.",
      primaryButtonText: "Start CET Prep",
      primaryButtonColor: "bg-[#F50057] hover:bg-pink-700",
      secondaryButtonText: "Learn More",
      secondaryButtonColor: "text-[#F50057]",
      secondaryButtonBorder: "border-[#F50057]",
      secondaryButtonHover: "hover:bg-pink-50",
      benefit: "State-specific question banks",
      imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&h=600",
      imageAlt: "Students studying for CET exam"
    }
  };

  const getCurrentExamType = (): ExamType => {
    return examTypes[currentSlide];
  };

  const getCurrentSlide = (): SlideContent => {
    return slideContent[getCurrentExamType()];
  };

  // Auto rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % examTypes.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-white py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col-reverse md:flex-row items-center">
          {/* Text Content */}
          <div className="w-full md:w-1/2 pt-10 md:pt-0 md:pr-8">
            <div className="relative overflow-hidden h-[350px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={getCurrentExamType()}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="absolute w-full"
                >
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#212121] mb-4 font-roboto">
                    {getCurrentSlide().title}{" "}
                    <span className={`text-${getCurrentExamType() === "jee" ? "primary" : getCurrentExamType() === "neet" ? "[#2E7D32]" : "[#F50057]"}`}>
                      {getCurrentSlide().titleHighlight}
                    </span>{" "}
                    Exam
                  </h1>
                  <p className="text-lg text-gray-700 mb-6">
                    {getCurrentSlide().description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      className={`px-6 py-6 ${getCurrentSlide().primaryButtonColor} text-white rounded-lg`}
                    >
                      {getCurrentSlide().primaryButtonText}
                    </Button>
                    <Button
                      variant="outlined" // Added outlined variant for consistency
                      className={`px-6 py-6 border ${getCurrentSlide().secondaryButtonBorder} ${getCurrentSlide().secondaryButtonColor} rounded-lg ${getCurrentSlide().secondaryButtonHover}`}
                    >
                      {getCurrentSlide().secondaryButtonText}
                    </Button>
                  </div>
                  <div className="mt-8">
                    <div className="flex items-center">
                      <div className={`${
                        getCurrentExamType() === "jee" ? "bg-green-100 text-[#2E7D32]" : 
                        getCurrentExamType() === "neet" ? "bg-green-100 text-[#2E7D32]" : 
                        "bg-pink-100 text-[#F50057]"
                      } p-2 rounded-full`}>
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <span className="ml-2 text-gray-700">{getCurrentSlide().benefit}</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slider Navigation */}
            <div className="flex justify-center mt-6 space-x-2">
              {examTypes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full bg-gray-300 transition-all duration-300 ${
                    index === currentSlide ? "w-8 bg-primary" : "w-4"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative h-64 md:h-96 w-full">
              <AnimatePresence>
                {examTypes.map((type, index) => (
                  currentSlide === index && (
                    <motion.img
                      key={type}
                      src={slideContent[type].imageUrl}
                      alt={slideContent[type].imageAlt}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-lg"
                    />
                  )
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}