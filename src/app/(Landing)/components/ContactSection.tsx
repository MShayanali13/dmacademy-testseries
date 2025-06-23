"use client";


import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Grid,
} from "@mui/material";
import {
  LocationOn,
  Phone,
  Email,
  AccessTime,
  Send,
} from "@mui/icons-material";

// Define form schema
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  feedback: z.string().min(10, "Feedback must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const companyInfo = {
  address: "123 Education Street, Learning Hub, Tech City 12345",
  email: "contact@DM Academy.academy",
  phone: "+1 (555) 123-4567",
  hours: "Mon-Fri: 9:00 AM - 6:00 PM",
};

export default function ContactSection() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, formState: { errors }, reset } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      feedback: "",
    }
  });

  function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true);
    setTimeout(() => {
      console.log("Form submitted:", data);
      reset();
      setFormSubmitted(true);
      setIsSubmitting(false);
    }, 1000);
  }

  return (
    <section id="contact" className="py-8 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <Typography variant="h4" component="h2" className="font-bold text-gray-900 mb-2">
            Get In Touch
          </Typography>
          <Typography variant="body1" className="text-gray-600 max-w-7xl mx-auto">
            Have questions about our programs? Reach out to our support team.
          </Typography>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Left Column: Contact Info & Map */}
  <div className="space-y-4">
    {/* Contact Info Card */}
    <Card className="bg-white p-4 rounded-2 shadow-md">
      <CardContent className="p-0">
        <Typography variant="h5" className="font-bold mb-3 text-gray-900">
          Contact Information
        </Typography>

        <Box className="flex items-start gap-3 mb-3">
          <LocationOn className="text-blue-500 mt-1" />
          <div>
            <Typography variant="subtitle1" className="font-medium text-gray-800">
              Address
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              1234 Main Street, Bangalore, India
            </Typography>
          </div>
        </Box>

        <Box className="flex items-start gap-3 mb-3">
          <Phone className="text-blue-500 mt-1" />
          <div>
            <Typography variant="subtitle1" className="font-medium text-gray-800">
              Phone
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              +91 98765 43210
            </Typography>
          </div>
        </Box>

        <Box className="flex items-start gap-3 mb-3">
          <Email className="text-blue-500 mt-1" />
          <div>
            <Typography variant="subtitle1" className="font-medium text-gray-800">
              Email
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              support@example.com
            </Typography>
          </div>
        </Box>

        <Box className="flex items-start gap-3">
          <AccessTime className="text-blue-500 mt-1" />
          <div>
            <Typography variant="subtitle1" className="font-medium text-gray-800">
              Office Hours
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Mon - Fri: 9 AM - 6 PM
            </Typography>
          </div>
        </Box>
      </CardContent>
    </Card>

    {/* Google Map */}
    <div className="rounded-2 overflow-hidden shadow-md h-64 w-full">
      <iframe
        title="Our Location"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.255660887441!2d77.5946!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x7d0bcd8395d0c5c7!2sBangalore!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin"
        width="100%"
        height="100%"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  </div>

  {/* Right Column: Contact Form */}
  <div>
            <Card className="bg-white p-4 rounded-2 shadow-md">
              <CardContent className="p-0">
                <Typography variant="h5" className="font-bold mb-3 text-gray-900">
                  Send us your feedback
                </Typography>

                {formSubmitted ? (
                  <Alert 
                    severity="success" 
                    className="p-3 rounded-2 mb-2"
                  >
                    <Typography variant="subtitle1" className="font-medium mb-1">
                      Thank You!
                    </Typography>
                    <Typography variant="body2" className="mb-2">
                      Your feedback has been received. We appreciate your input.
                    </Typography>
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={() => setFormSubmitted(false)}
                      className="mt-1"
                    >
                      Send Another Message
                    </Button>
                  </Alert>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Your Name"
                          placeholder="Enter your full name"
                          fullWidth
                          margin="normal"
                          error={!!errors.name}
                          helperText={errors.name?.message}
                        />
                      )}
                    />
                    
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Your Email"
                          placeholder="Enter your email address"
                          fullWidth
                          margin="normal"
                          error={!!errors.email}
                          helperText={errors.email?.message}
                        />
                      )}
                    />
                    
                    <Controller
                      name="feedback"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Your Feedback"
                          placeholder="Please share your thoughts with us"
                          fullWidth
                          multiline
                          rows={4}
                          margin="normal"
                          error={!!errors.feedback}
                          helperText={errors.feedback?.message}
                        />
                      )}
                    />

                    <Button 
                      type="submit" 
                      variant="contained" 
                      color="primary"
                      disabled={isSubmitting}
                      fullWidth
                      size="large"
                      className="mt-4"
                      endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Send />}
                    >
                      {isSubmitting ? "Sending..." : "Send Feedback"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}





// import { useState } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import {
//   Card,
//   CardContent,
//   TextField,
//   Button,
//   Typography,
//   Box,
//   Alert,
//   CircularProgress
// } from "@mui/material";
// import {
//   LocationOn,
//   Phone,
//   Email,
//   AccessTime,
//   Send
// } from "@mui/icons-material";

// // Define form schema
// const contactFormSchema = z.object({
//   name: z.string().min(2, "Name must be at least 2 characters"),
//   email: z.string().email("Please enter a valid email address"),
//   subject: z.string().min(3, "Subject must be at least 3 characters"),
//   message: z.string().min(10, "Message must be at least 10 characters")
// });

// type ContactFormValues = z.infer<typeof contactFormSchema>;

// export default function ContactSection() {
//   const [formSubmitted, setFormSubmitted] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const { control, handleSubmit, formState: { errors }, reset } = useForm<ContactFormValues>({
//     resolver: zodResolver(contactFormSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       subject: "",
//       message: ""
//     }
//   });

//   function onSubmit(data: ContactFormValues) {
//     setIsSubmitting(true);

//     // Simulate form submission with timeout
//     setTimeout(() => {
//       console.log("Form submitted:", data);
//       reset();
//       setFormSubmitted(true);
//       setIsSubmitting(false);
//     }, 1000);
//   }

//   return (
//     <section id="contact" className="py-8 bg-gray-100">
//       <div className="container mx-auto px-4">
//         {/* Section Header */}
//         <div className="text-center mb-6">
//           <Typography variant="h4" component="h2" className="font-bold text-gray-900 mb-2">
//             Get In Touch
//           </Typography>
//           <Typography variant="body1" className="text-gray-600 max-w-7xl mx-auto">
//             Have questions about our programs? Reach out to our support team.
//           </Typography>
//         </div>

//         {/* Content Area */}
//         <div className="flex flex-col lg:flex-row gap-4">
//           {/* Contact Form Column */}
//           <div className="flex-1">
//             <Card className="bg-white p-4 rounded-2 shadow-md">
//               <CardContent className="p-0">
//                 <Typography variant="h5" className="font-bold mb-3 text-gray-900">
//                   Send us a message
//                 </Typography>

//                 {formSubmitted ? (
//                   <Alert 
//                     severity="success" 
//                     className="p-3 rounded-2 mb-2"
//                   >
//                     <Typography variant="subtitle1" className="font-medium mb-1">
//                       Thank You!
//                     </Typography>
//                     <Typography variant="body2" className="mb-2">
//                       Your message has been received. We'll get back to you shortly.
//                     </Typography>
//                     <Button 
//                       variant="contained" 
//                       color="primary"
//                       onClick={() => setFormSubmitted(false)}
//                       className="mt-1"
//                     >
//                       Send Another Message
//                     </Button>
//                   </Alert>
//                 ) : (
//                   <form onSubmit={handleSubmit(onSubmit)}>
//                     {/* Form fields remain largely unchanged, only sx props are removed */}
//                     <Controller
//                       name="name"
//                       control={control}
//                       render={({ field }) => (
//                         <TextField
//                           {...field}
//                           label="Your Name"
//                           placeholder="Enter your full name"
//                           fullWidth
//                           margin="normal"
//                           error={!!errors.name}
//                           helperText={errors.name?.message}
//                         />
//                       )}
//                     />
//                     {/* ...other form fields... */}
//                     <Button 
//                       type="submit" 
//                       variant="contained" 
//                       color="primary"
//                       disabled={isSubmitting}
//                       fullWidth
//                       size="large"
//                       className="mt-2 py-1.5"
//                       endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Send />}
//                     >
//                       {isSubmitting ? "Sending..." : "Send Message"}
//                     </Button>
//                   </form>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* Contact Info Column (styling largely untouched for brevity) */}
//           {/* ... */}
//         </div>
//       </div>
//     </section>
//   );
// }