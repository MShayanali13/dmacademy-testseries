import { Card, CardContent, CardHeader } from "@mui/material";
import { Button } from "@mui/material";
import { CheckCircle, X } from "lucide-react";

interface PricingFeature {
  name: string;
  included: boolean;
}

interface PricingPlanProps {
  name: string;
  description: string;
  price: string;
  features: PricingFeature[];
  popular?: boolean;
  headerBgColor?: string;
  pricingButtonStyle: "primary" | "outline";
}

function PricingPlan({ 
  name, 
  description, 
  price, 
  features, 
  popular = false,
  headerBgColor = "bg-gray-50",
  pricingButtonStyle = "primary"
}: PricingPlanProps) {
  return (
    <Card 
      className={`bg-white rounded-lg shadow-md overflow-hidden w-full lg:w-1/3 
      ${popular ? "border-2 border-blue-600 transform lg:scale-105" : "border border-gray-200"} 
      flex flex-col relative`}
    >
      {popular && (
        <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-sm font-semibold">
          POPULAR
        </div>
      )}
      {/* <CardHeader className={`p-8 ${headerBgColor} border-b border-gray-200`}>
        <h3 className="text-2xl font-bold text-[#212121] mb-2">{name}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex items-baseline">
          <span className="text-4xl font-bold text-[#212121]">{price}</span>
          <span className="text-gray-500 ml-2">/Subject</span>
        </div>
      </CardHeader> */}
      <CardHeader className={`p-8 ${headerBgColor} border-b border-gray-200`}
  title={
    <h3 className="text-2xl font-bold text-[#212121] mb-2">{name}</h3>
  }
  subheader={
    <>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex items-baseline">
        <span className="text-4xl font-bold text-[#212121]">{price}</span>
        <span className="text-gray-500 ml-2">/month</span>
      </div>
    </>
  }
/>

      <CardContent className="p-8 flex-grow">
        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              {feature.included ? (
                <>
                  <CheckCircle className="w-5 h-5 text-primary mt-1 mr-2" />
                  <span className="text-gray-800">{feature.name}</span>
                </>
              ) : (
                <>
                  <X className="w-5 h-5 text-gray-400 mt-1 mr-2" />
                  <span className="text-gray-400">{feature.name}</span>
                </>
              )}
            </li>
          ))}
        </ul>
    
      
        <Button 
        color="primary"
           variant={pricingButtonStyle === "primary" ? "contained" : "outlined"}
          className={`w-full py-6 ${
            pricingButtonStyle === "primary" 
              ? "bg-primary text-white hover:bg-blue-700" 
              : "border-primary text-primary hover:bg-blue-50"
          }`}
        >
          Get Started
        </Button>
        </CardContent>
    </Card>
  );
}

export default function PricingSection() {
  const pricingPlans = [
    {
      name: "Basic",
      description: "Essential preparation resources",
      price: "₹1,499",
      features: [
        { name: "Video lectures for all subjects", included: true },
        { name: "Basic practice questions", included: true },
        { name: "5 mock tests", included: true },
        { name: "Live doubt clearing sessions", included: false },
        { name: "Performance analytics", included: false }
      ],
      popular: false,
      headerBgColor: "bg-gray-50",
      pricingButtonStyle: "outline" as const
    },
    {
      name: "Premium",
      description: "Complete preparation solution",
      price: "₹2,999",
      features: [
        { name: "All Basic plan features", included: true },
        { name: "Advanced practice questions", included: true },
        { name: "15 mock tests with analysis", included: true },
        { name: "Weekly live doubt clearing", included: true },
        { name: "Detailed performance analytics", included: true }
      ],
      popular: true,
      headerBgColor: "bg-blue-50",
      pricingButtonStyle: "primary" as const
    },
    {
      name: "Ultimate",
      description: "Personalized coaching experience",
      price: "₹4,999",
      features: [
        { name: "All Premium plan features", included: true },
        { name: "1-on-1 mentorship sessions", included: true },
        { name: "Unlimited mock tests", included: true },
        { name: "Daily live doubt clearing", included: true },
        { name: "Personalized study plan", included: true }
      ],
      popular: false,
      headerBgColor: "bg-gray-50",
      pricingButtonStyle: "outline" as const
    }
  ];

  return (
    <section id="pricing" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#212121] mb-4 font-roboto">Affordable Pricing Plans</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Choose the right plan that fits your preparation needs and budget.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8 justify-center">
          {pricingPlans.map((plan, index) => (
            <PricingPlan
              key={index}
              name={plan.name}
              description={plan.description}
              price={plan.price}
              features={plan.features}
              popular={plan.popular}
              headerBgColor={plan.headerBgColor}
              pricingButtonStyle={plan.pricingButtonStyle}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
