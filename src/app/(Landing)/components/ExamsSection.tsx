import { Card, CardContent, CardHeader } from "@mui/material"
import { Button } from "@mui/material";
import { CheckCircle } from "lucide-react";

interface ExamCardProps {
  name: string;
  img: string;
  fullName: string;
  description: string;
  features: string[];
  color: string;
  bgColor: string;
  buttonColor: "primary" | "success" | "error";
 
}

function ExamCard({ name,img, fullName, description, features, color, bgColor, buttonColor }: ExamCardProps) {
  return (
    <Card className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className={`p-0 h-48 ${bgColor} flex items-center justify-center`}>
        {/* <h3 className={`text-4xl font-bold ${color}`}>{name}</h3> */}
        <img src={`./images/${img}`} style={{width:"100%",height:"192px"}} alt="" />
      </div>
      <CardContent className="p-6">
        <h4 className="text-xl font-semibold mb-3">{fullName}</h4>
        <p className="text-gray-600 mb-4">{description}</p>
        <ul className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <CheckCircle className={`w-5 h-5 ${color} mr-2`} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <Button 
          color={buttonColor}
          variant="contained"
          className={`w-full  text-white rounded-md transition-colors`}
        >
          Explore {name} Courses
        </Button>
      </CardContent>
    </Card>
  );
}

export default function ExamsSection() {
  const exams: ExamCardProps[] = [
    {
      name: "JEE",
      img:"jee.png",
      fullName: "Joint Entrance Examination",
      description: "Preparation for JEE Main & Advanced to secure admission in top engineering institutes like IITs.",
      features: [
        "Physics, Chemistry, Mathematics",
        "Previous Year Papers Analysis",
        "Topic-wise Practice Tests"
      ],
      color: "text-white",
      bgColor: " bg-blue-400",
      buttonColor: "primary",
      
    },
    {
      name: "NEET",
      img:"neet.jpg",
      fullName: "National Eligibility cum Entrance Test",
      description: "Comprehensive preparation for medical entrance exam to secure seats in top medical colleges.",
      features: [
        "Biology, Physics, Chemistry",
        "NCERT-focused Content",
        "Medical Case Studies"
      ],
      color: "text-white",
      bgColor: "bg-[#2E7D32] bg-opacity-10",
      buttonColor: "success",
     
    },
    {
      name: "CET",
      img:"cet.jpg",
      fullName: "Common Entrance Test",
      description: "State-specific entrance exams for engineering, medical, and other professional courses.",
      features: [
        "State-specific Syllabus",
        "Regional Language Support",
        "College Predictor Tools"
      ],
      color: "text-white",
      bgColor: "bg-[#F50057] bg-opacity-10",
      buttonColor: "error",
     
    }
  ];

  return (
    <section id="exams" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#212121] mb-4 font-roboto">Exams We Cover</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive preparation resources for all major competitive examinations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {exams.map((exam, index) => (
            <ExamCard
              key={index}
              name={exam.name}
              img={exam.img}
              fullName={exam.fullName}
              description={exam.description}
              features={exam.features}
              color={exam.color}
              bgColor={exam.bgColor}
              buttonColor={exam.buttonColor}
             
            />
          ))}
        </div>
      </div>
    </section>
  );
}
