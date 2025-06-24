import { Card, CardContent } from "@mui/material";
import { Star } from "lucide-react";

interface TestimonialProps {
  content: string;
  name: string;
  position: string;
  imageUrl: string;
  rating: number;
}

function Testimonial({ content, name, position, imageUrl, rating }: TestimonialProps) {
  return (
    <Card className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-0">
        <div className="flex items-center mb-4">
          <div className="text-yellow-400 flex">
            {[...Array(rating)].map((_, i) => (
              <Star key={i} className="w-5 h-5" fill="currentColor" />
            ))}
          </div>
        </div>
        <p className="text-gray-600 mb-4">{content}</p>
        <div className="flex items-center">
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-12 h-12 rounded-full object-cover mr-4"
          />
          <div>
            <h4 className="font-semibold text-[#212121]">{name}</h4>
            <p className="text-sm text-gray-500">{position}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TestimonialsSection() {
  const testimonials = [
    {
      content: "The JEE preparation at DM Academy completely transformed my approach to problem-solving. Their practice questions are exactly what you face in the actual exam. I secured AIR 256 and got into IIT Bombay!",
      name: "Rahul Sharma",
      position: "JEE Advanced AIR 256",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80",
      rating: 5
    },
    {
      content: "The biology coaching at DM Academy is exceptional. Their detailed NCERT explanations and daily quizzes helped me master the concepts. I got into AIIMS Delhi with a NEET rank of 47!",
      name: "Priya Patel",
      position: "NEET Rank 47",
      imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80",
      rating: 5
    },
    {
      content: "The Karnataka CET preparation at DM Academy was spot on! Their state-specific question banks and mock tests were exactly like the real exam. I got into RVCE Bangalore with a CET rank of 120!",
      name: "Arjun Reddy",
      position: "Karnataka CET Rank 120",
      imageUrl: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80",
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#212121] mb-4 font-roboto">Student Success Stories</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Hear from our students who achieved their dream college admissions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              content={testimonial.content}
              name={testimonial.name}
              position={testimonial.position}
              imageUrl={testimonial.imageUrl}
              rating={testimonial.rating}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
