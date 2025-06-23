import { Card, CardContent } from "@mui/material"
import {
  BookOpen,
  FileSpreadsheet,
  PieChart,
  Clock,
  BookMarked,
  TestTube
} from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconBgColor: string;
  iconColor: string;
}

function FeatureCard({ icon, title, description, iconBgColor, iconColor }: FeatureCardProps) {
  return (
    <Card className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className={`w-14 h-14 ${iconBgColor} rounded-full flex items-center justify-center mb-4`}>
          <div className={`${iconColor}`}>{icon}</div>
        </div>
        <h3 className="text-xl font-bold mb-3 text-[#212121]">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function FeaturesSection() {
  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Expert Faculty",
      description: "Get Question Bank from top educators with years of experience in JEE, NEET, and CET coaching who understand exam patterns.",
      iconBgColor: "bg-blue-100",
      iconColor: "text-primary"
    },
    {
      icon: <FileSpreadsheet className="w-8 h-8" />,
      title: "Adaptive Practice",
      description: "Our AI-powered system adapts to your strengths and weaknesses, providing personalized practice questions.",
      iconBgColor: "bg-green-100",
      iconColor: "text-[#2E7D32]"
    },
    {
      icon: <PieChart className="w-8 h-8" />,
      title: "Performance Analytics",
      description: "Track your progress with detailed analytics that highlight improvement areas and predict your exam score.",
      iconBgColor: "bg-pink-100",
      iconColor: "text-[#F50057]"
    },
    // {
    //   icon: <Clock className="w-8 h-8" />,
    //   title: "Live Sessions",
    //   description: "Participate in live doubt-clearing sessions with top educators to resolve complex concepts and questions.",
    //   iconBgColor: "bg-purple-100",
    //   iconColor: "text-purple-600"
    // },
    // {
    //   icon: <BookMarked className="w-8 h-8" />,
    //   title: "Comprehensive Study Material",
    //   description: "Access detailed notes, video lectures, and e-books covering the entire syllabus with exam-focused content.",
    //   iconBgColor: "bg-yellow-100",
    //   iconColor: "text-yellow-600"
    // },
    {
      icon: <TestTube className="w-8 h-8" />,
      title: "Chapter Wise Test",
      description: "Practice with full-length chapter wise tests that simulate actual exam conditions and provide detailed performance analysis.",
      iconBgColor: "bg-indigo-100",
      iconColor: "text-indigo-600"
    }
  ];

  return (
    <section id="features" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#212121] mb-4 font-roboto">Why Choose DM Academy</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our comprehensive approach to test preparation gives you the edge you need to succeed in competitive exams.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              iconBgColor={feature.iconBgColor}
              iconColor={feature.iconColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
