// import { useState, useRef, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Input } from "@/components/ui/input";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import StatsSection, { fetchStats } from "@/components/review/StatsSection";

// export default function PreregisterForm() {
//   // State for preregistration form
//   const [formData, setFormData] = useState({
//     email: "",
//     fullName: "",
//     designation: "",
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isSubscribed, setIsSubscribed] = useState(false);
//   const [error, setError] = useState({
//     email: "",
//     fullName: "",
//     designation: "",
//   });

//   // State for feedback form
//   const [showFeedbackForm, setShowFeedbackForm] = useState(false);
//   const [currentStep, setCurrentStep] = useState(0);
//   const [formSubmitted, setFormSubmitted] = useState(false);
//   const [overallRating, setOverallRating] = useState(0);
//   const formRef = useRef(null);

//   // Feedback form data
//   const [feedbackData, setFeedbackData] = useState({
//     understandGoal: {
//       rating: 0,
//       feedback: "",
//     },
//     canSolve: {
//       rating: 0,
//       feedback: "",
//     },
//     designAndUX: {
//       rating: 0,
//       feedback: "",
//     },
//     pricingStructure: {
//       rating: 0,
//       feedback: "",
//     },
//     features: {
//       rating: 0,
//       feedback: "",
//     },
//   });

//   // Feedback form steps
//   const feedbackSteps = [
//     {
//       id: "understandGoal",
//       title: "Do you get our goal?",
//       description:
//         "LinkMyDrives is a unified cloud storage platform that connects all your cloud accounts into a single, seamless drive.",
//       fields: ["rating", "feedback"],
//     },
//     {
//       id: "canSolve",
//       title: "Do you think it can solve your problems?",
//       description:
//         "Instead of managing multiple drives and folders separately, our platform becomes your new digital storage home — simplifying uploads, downloads, and file organization effortlessly.",
//       fields: ["rating", "feedback"],
//     },
//     {
//       id: "designAndUX",
//       title: "About the design, UI, and user experience",
//       fields: ["rating", "feedback"],
//     },
//     {
//       id: "pricingStructure",
//       title: "About the pricing structure",
//       description:
//         "Will you pay that value when you want to subscribe to our plans in the future?",
//       fields: ["rating", "feedback"],
//     },
//     {
//       id: "features",
//       title: "About the features",
//       fields: ["rating", "feedback"],
//     },
//   ];

//   // Handle input change for preregistration form
//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//     setError((prev) => ({
//       ...prev,
//       [field]: "",
//     }));
//   };

//   // Validate form
//   const validateForm = () => {
//     let isValid = true;
//     const newErrors = { email: "", fullName: "", designation: "" };

//     if (!formData.email || !formData.email.includes("@")) {
//       newErrors.email = "Please enter a valid email address";
//       isValid = false;
//     }

//     if (!formData.fullName.trim()) {
//       newErrors.fullName = "Please enter your full name";
//       isValid = false;
//     }

//     if (!formData.designation.trim()) {
//       newErrors.designation = "Please enter your designation";
//       isValid = false;
//     }

//     setError(newErrors);
//     return isValid;
//   };

//   // Handle preregistration form submission
//   const handleFormSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }
//     setIsSubmitting(false);
//     setShowFeedbackForm(true);
//   };

//   // Handle feedback form input changes
//   const handleFeedbackChange = (field, subfield, value) => {
//     setFeedbackData((prev) => ({
//       ...prev,
//       [field]: {
//         ...prev[field],
//         [subfield]: value,
//       },
//     }));
//   };

//   // Handle star rating click
//   const handleRatingChange = (field, rating) => {
//     setFeedbackData((prev) => ({
//       ...prev,
//       [field]: {
//         ...prev[field],
//         rating: rating,
//       },
//     }));
//   };

//   // Handle form navigation
//   const handleNext = () => {
//     const currentFields = feedbackSteps[currentStep].fields;

//     // For rating steps, ensure rating is provided
//     if (currentFields.includes("rating")) {
//       const fieldId = feedbackSteps[currentStep].id;
//       if (feedbackData[fieldId].rating === 0) return;
//     }

//     if (currentStep < feedbackSteps.length - 1) {
//       setCurrentStep(currentStep + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentStep > 0) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   const handleOverallRatingChange = async () => {
//     // Calculate overall rating based on individual ratings
//     const newRatings = Object.values(feedbackData).map((d) => d.rating === 0 ? 4 : d.rating);
//     const registerRating = 3;
//     const response = await fetchStats();
//     const previousOverallRating = response?.overallRating ?? 4.3;
//     const previousCount = response?.feedbacks ?? 5;
    
//     const allNewRatings = [...newRatings, registerRating];
//     const newTotal = allNewRatings.reduce((sum, val) => sum + val, 0);
    
//     const combinedTotal = previousOverallRating * previousCount + newTotal;
//     const combinedCount = previousCount + allNewRatings.length;
    
//     const average = combinedTotal / combinedCount;
//     const rounded = Math.round(average * 2) / 2;
    
//     setOverallRating(rounded);
//     return rounded;
    
//   };

//   const handleCloseFeedbackSubmit = async () => {
//     try {
//       setIsSubscribed(true);

//       const rating = await handleOverallRatingChange();
//       // Submit preregistration data to API
//       // For now we're just simulating a successful API call
//       // In production, uncomment the actual API call below

//       const response = await fetch("/api/preregister", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           preregister: true,
//           email: formData.email,
//           useremail: formData.email,
//           fullName: formData.fullName,
//           designation: formData.designation,
//           overallRating: rating,
//           datetime: new Date().toUTCString(),
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Failed to submit preregistration");
//       }

//     } catch (error) {
//       console.error("Error submitting form:", error);
//       setError((prev) => ({
//         ...prev,
//         email: error.message || "Failed to submit. Please try again.",
//       }));
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Submit feedback form
//   const handleFeedbackSubmit = async () => {
//     setIsSubmitting(true);
//     try {
//       // Submit complete data to API
//       // For now we're just simulating a successful API call
//       // In production, uncomment the actual API call below

//       setFormSubmitted(true);
//       // Close dialog after showing success message
//       setTimeout(() => {
//         setShowFeedbackForm(false);
//       }, 2000);
//       setIsSubscribed(true);

//       const rating = await handleOverallRatingChange();

//       const response = await fetch("/api/preregister", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           preregister: true,
//           email: formData.email,
//           useremail: formData.email,
//           fullName: formData.fullName,
//           designation: formData.designation,
//           overallRating: rating,
//           datetime: new Date().toUTCString(),
//           feedback: feedbackData,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Failed to submit feedback");
//       }

//     } catch (error) {
//       console.error("Error submitting feedback:", error);
//       setError((prev) => ({
//         ...prev,
//         email: error.message || "Failed to submit feedback. Please try again.",
//       }));
//     } finally {
//       setIsSubmitting(true);
//     }
//   };
//   return (
//     <>
//       <motion.section
//         className="py-20 bg-gradient-to-b from-primary/10 to-transparent"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.6 }}
//       >
//         <StatsSection rating={overallRating} />
//       </motion.section>
//       {/* Preregister Form Section */}
//       <motion.section
//         className="py-20 bg-gradient-to-b from-primary/10 to-transparent"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.6 }}
//       >
//         <div className="container mx-auto px-4">
//           <motion.div
//             className="max-w-2xl mx-auto text-center mb-10"
//             initial={{ y: 20, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ delay: 0.2, duration: 0.5 }}
//           >
//             <h2 className="text-3xl md:text-4xl font-bold mb-4">
//               Be the First to Experience Linkmydrives
//             </h2>
//             <p className="text-lg text-gray-600 dark:text-gray-400">
//               Join our waitlist and get early access when we launch. We'll
//               notify you as soon as we're ready!
//             </p>
//           </motion.div>

//           <motion.div
//             className="max-w-md mx-auto bg-white dark:bg-dark-surface rounded-xl shadow-xl p-6 md:p-8"
//             initial={{ y: 30, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ delay: 0.4, duration: 0.5 }}
//           >
//             {isSubscribed ? (
//               <motion.div
//                 className="text-center py-6"
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-4">
//                   <i className="ri-check-line text-3xl"></i>
//                 </div>
//                 <h3 className="text-xl font-bold mb-2">You're on the list!</h3>
//                 <p className="text-gray-600 dark:text-gray-400 mb-4">
//                   Thanks for your interest in Linkmydrives. We'll notify you
//                   when we launch.
//                 </p>
//               </motion.div>
//             ) : (
//               <form onSubmit={handleFormSubmit} className="space-y-4">
//                 <h3 className="text-xl font-bold mb-4">
//                   Preregister for Early Access
//                 </h3>

//                 <div>
//                   <label
//                     htmlFor="fullName"
//                     className="block text-sm font-medium mb-1"
//                   >
//                     Full Name *
//                   </label>
//                   <Input
//                     id="fullName"
//                     type="text"
//                     placeholder="Your full name"
//                     value={formData.fullName}
//                     onChange={(e) =>
//                       handleInputChange("fullName", e.target.value)
//                     }
//                     required
//                     className={`w-full ${error.fullName ? "border-red-500" : ""}`}
//                   />
//                   {error.fullName && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {error.fullName}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="designation"
//                     className="block text-sm font-medium mb-1"
//                   >
//                     Designation *
//                   </label>
//                   <Input
//                     id="designation"
//                     type="text"
//                     placeholder="e.g., Professor, Developer, Student"
//                     value={formData.designation}
//                     onChange={(e) =>
//                       handleInputChange("designation", e.target.value)
//                     }
//                     required
//                     className={`w-full ${error.designation ? "border-red-500" : ""}`}
//                   />
//                   {error.designation && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {error.designation}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="email"
//                     className="block text-sm font-medium mb-1"
//                   >
//                     Email Address *
//                   </label>
//                   <Input
//                     id="email"
//                     type="email"
//                     placeholder="your@email.com"
//                     value={formData.email}
//                     onChange={(e) => handleInputChange("email", e.target.value)}
//                     required
//                     className={`w-full ${error.email ? "border-red-500" : ""}`}
//                   />
//                   {error.email && (
//                     <p className="text-red-500 text-sm mt-1">{error.email}</p>
//                   )}
//                 </div>

//                 <Button
//                   type="submit"
//                   className="w-full py-2"
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? (
//                     <span className="flex items-center justify-center">
//                       <i className="ri-loader-4-line animate-spin mr-2"></i>
//                       Processing...
//                     </span>
//                   ) : (
//                     "Get Early Access"
//                   )}
//                 </Button>

//                 <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
//                   By signing up, you agree to our Terms of Service and Privacy
//                   Policy.
//                 </p>
//               </form>
//             )}
//           </motion.div>
//         </div>
//       </motion.section>

//       {/* Feedback Form Dialog */}
//       <Dialog
//         open={showFeedbackForm}
//         onOpenChange={(open) => {
//           if (!open && !formSubmitted) {
//             handleCloseFeedbackSubmit();
//             console.log("close");
//           }
//           setShowFeedbackForm(open);
//         }}
//       >
//         <DialogContent className="max-w-2xl">
//           <DialogHeader>
//             <DialogTitle className="text-2xl font-bold">
//               {formSubmitted ? "Thank You!" : "Help Us Improve Linkmydrives"}
//             </DialogTitle>
//           </DialogHeader>

//           {formSubmitted ? (
//             <motion.div
//               className="text-center py-10"
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               transition={{ duration: 0.3 }}
//             >
//               <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-500 mb-6">
//                 <i className="ri-check-line text-4xl"></i>
//               </div>
//               <h3 className="text-xl font-bold mb-3">
//                 Feedback Submitted Successfully
//               </h3>
//               <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
//                 Thank you for taking the time to provide your valuable feedback.
//                 It will help us make Linkmydrives even better!
//               </p>
//             </motion.div>
//           ) : (
//             <div className="py-4">
//               <p className="text-gray-600 dark:text-gray-400 mb-6">
//                 Your feedback is valuable to us. Please take a moment to share
//                 your thoughts.
//               </p>

//               {error.email && (
//                 <div className="mb-4 p-3 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-md">
//                   {error.email}
//                 </div>
//               )}

//               <div className="relative" ref={formRef}>
//                 <AnimatePresence mode="wait">
//                   <motion.div
//                     key={currentStep}
//                     initial={{ x: 20, opacity: 0 }}
//                     animate={{ x: 0, opacity: 1 }}
//                     exit={{ x: -20, opacity: 0 }}
//                     transition={{ duration: 0.3 }}
//                     className="min-h-[300px]"
//                   >
//                     <div className="mb-8">
//                       <h3 className="text-xl font-bold mb-2">
//                         {feedbackSteps[currentStep].title}
//                       </h3>
//                       {feedbackSteps[currentStep].description && (
//                         <p className="text-gray-600 dark:text-gray-400 mb-4">
//                           {feedbackSteps[currentStep].description}
//                         </p>
//                       )}

//                       <div className="space-y-4">
//                         <div className="mb-4">
//                           <label className="block text-sm font-medium mb-2">
//                             Your Rating
//                           </label>
//                           <div className="flex gap-2">
//                             {[1, 2, 3, 4, 5].map((star) => (
//                               <button
//                                 key={star}
//                                 type="button"
//                                 onClick={() =>
//                                   handleRatingChange(
//                                     feedbackSteps[currentStep].id,
//                                     star,
//                                   )
//                                 }
//                                 className="text-2xl focus:outline-none transition-colors"
//                               >
//                                 <i
//                                   className={`${star <= feedbackData[feedbackSteps[currentStep].id].rating ? "text-yellow-400" : "text-gray-300 hover:text-yellow-200"} ri-star-fill`}
//                                 ></i>
//                               </button>
//                             ))}
//                           </div>
//                         </div>

//                         <div>
//                           <label className="block text-sm font-medium mb-2">
//                             Your Comments (Optional)
//                           </label>
//                           <Textarea
//                             placeholder="Share your thoughts with us..."
//                             className="w-full p-3 min-h-[120px]"
//                             value={
//                               feedbackData[feedbackSteps[currentStep].id]
//                                 .feedback
//                             }
//                             onChange={(e) =>
//                               handleFeedbackChange(
//                                 feedbackSteps[currentStep].id,
//                                 "feedback",
//                                 e.target.value,
//                               )
//                             }
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </motion.div>
//                 </AnimatePresence>

//                 <div className="flex justify-between mt-6">
//                   <Button
//                     variant="outline"
//                     onClick={handlePrevious}
//                     disabled={currentStep === 0 || isSubmitting}
//                   >
//                     Previous
//                   </Button>

//                   {currentStep < feedbackSteps.length - 1 ? (
//                     <Button
//                       onClick={handleNext}
//                       disabled={
//                         isSubmitting ||
//                         feedbackData[feedbackSteps[currentStep].id].rating === 0
//                       }
//                     >
//                       Next
//                     </Button>
//                   ) : (
//                     <Button
//                       onClick={async () => {
//                         await handleFeedbackSubmit();
//                         console.log("close by feedback submit");
//                         setShowFeedbackForm(false);
//                       }}
//                       disabled={isSubmitting}
//                     >
//                       {isSubmitting ? (
//                         <span className="flex items-center justify-center">
//                           <i className="ri-loader-4-line animate-spin mr-2"></i>
//                           Submitting...
//                         </span>
//                       ) : (
//                         "Submit Feedback"
//                       )}
//                     </Button>
//                   )}
//                 </div>

//                 <div className="flex justify-center mt-8 gap-2">
//                   {feedbackSteps.map((step, index) => (
//                     <div
//                       key={index}
//                       className={`w-2 h-2 rounded-full ${currentStep === index ? "bg-primary" : "bg-gray-300 dark:bg-gray-700"}`}
//                     ></div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }


import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StatsSection, { fetchStats } from "@/components/review/StatsSection";

export default function PreregisterForm() {
  // State for preregistration form
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    designation: "",
    country: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState({
    email: "",
    fullName: "",
    designation: "",
    country: "",
  });

  // State for feedback form
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [overallRating, setOverallRating] = useState(0);
  const formRef = useRef(null);
  
  // Refs and state for animation
  const formSectionRef = useRef(null);
  const [isPageBlocked, setIsPageBlocked] = useState(true);
  const [showBorderAnimation, setShowBorderAnimation] = useState(false);

  // Animation states
  const [heroAnimationComplete, setHeroAnimationComplete] = useState(false);
  const [showStars, setShowStars] = useState(false);

  // Feedback form data
  const [feedbackData, setFeedbackData] = useState({
    understandGoal: {
      rating: 0,
      feedback: "",
    },
    canSolve: {
      rating: 0,
      feedback: "",
    },
    designAndUX: {
      rating: 0,
      feedback: "",
    },
    pricingStructure: {
      rating: 0,
      feedback: "",
    },
    features: {
      rating: 0,
      feedback: "",
    },
  });

  // Countries list
  const countries = [
    "United States", "United Kingdom", "Canada", "Australia", "Germany", 
    "France", "Spain", "Italy", "Japan", "China", "India", "Brazil", 
    "Mexico", "South Africa", "Nigeria", "Egypt", "Saudi Arabia", 
    "United Arab Emirates", "Singapore", "South Korea"
  ];

  // Auto scroll to preregister form after page load
  useEffect(() => {
    // Create overlay to block user interaction
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'transparent';
    overlay.style.zIndex = '9999';
    overlay.style.cursor = 'not-allowed';
    document.body.appendChild(overlay);
    
    // Delayed scroll to form section
    const scrollTimer = setTimeout(() => {
      if (formSectionRef.current) {
        formSectionRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
        
        // Show border animation after scrolling completes
        setTimeout(() => {
          setShowBorderAnimation(true);
          
          // Remove border animation after 2 seconds
          setTimeout(() => {
            setShowBorderAnimation(false);
            setIsPageBlocked(false);
            document.body.removeChild(overlay);
          }, 2000);
        }, 600); // Small delay after scroll completes
      }
    }, 1500); // Increased to 1.5s for better visual flow
    
    // Init animations
    setTimeout(() => {
      setHeroAnimationComplete(true);
    }, 500);
    
    setTimeout(() => {
      setShowStars(true);
    }, 2500);
    
    return () => {
      clearTimeout(scrollTimer);
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
      }
    };
  }, []);

  // Handle input change for preregistration form
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  // Validate form
  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", fullName: "", designation: "", country: "" };

    if (!formData.email || !formData.email.includes("@")) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Please enter your full name";
      isValid = false;
    }

    if (!formData.designation.trim()) {
      newErrors.designation = "Please enter your designation";
      isValid = false;
    }
    
    if (!formData.country) {
      newErrors.country = "Please select your country";
      isValid = false;
    }

    setError(newErrors);
    return isValid;
  };

  // Handle preregistration form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    
    // Simulate loading state
    setTimeout(() => {
      setIsSubmitting(false);
      setShowFeedbackForm(true);
    }, 1000);
  };

  // Handle feedback form input changes
  const handleFeedbackChange = (field, subfield, value) => {
    setFeedbackData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [subfield]: value,
      },
    }));
  };

  // Handle star rating click
  const handleRatingChange = (field, rating) => {
    setFeedbackData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        rating: rating,
      },
    }));
  };

  // Handle form navigation
  const handleNext = () => {
    const currentFields = feedbackSteps[currentStep].fields;

    // For rating steps, ensure rating is provided
    if (currentFields.includes("rating")) {
      const fieldId = feedbackSteps[currentStep].id;
      if (feedbackData[fieldId].rating === 0) return;
    }

    if (currentStep < feedbackSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleOverallRatingChange = async () => {
    // Calculate overall rating based on individual ratings
    const newRatings = Object.values(feedbackData).map((d) => d.rating === 0 ? 4 : d.rating);
    const registerRating = 3;
    const response = await fetchStats();
    const previousOverallRating = response?.overallRating ?? 4.3;
    const previousCount = response?.feedbacks ?? 5;
    
    const allNewRatings = [...newRatings, registerRating];
    const newTotal = allNewRatings.reduce((sum, val) => sum + val, 0);
    
    const combinedTotal = previousOverallRating * previousCount + newTotal;
    const combinedCount = previousCount + allNewRatings.length;
    
    const average = combinedTotal / combinedCount;
    const rounded = Math.round(average * 2) / 2;
    
    setOverallRating(rounded);
    return rounded;
  };

  const handleCloseFeedbackSubmit = async () => {
    try {
      setIsSubscribed(true);

      const rating = await handleOverallRatingChange();
      // Submit preregistration data to API
      // For now we're just simulating a successful API call
      // In production, uncomment the actual API call below

      const response = await fetch("/api/preregister", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          preregister: true,
          email: formData.email,
          useremail: formData.email,
          fullName: formData.fullName,
          designation: formData.designation,
          country: formData.country,
          overallRating: rating,
          datetime: new Date().toUTCString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit preregistration");
      }

    } catch (error) {
      console.error("Error submitting form:", error);
      setError((prev) => ({
        ...prev,
        email: error.message || "Failed to submit. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit feedback form
  const handleFeedbackSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Submit complete data to API
      // For now we're just simulating a successful API call
      // In production, uncomment the actual API call below

      setFormSubmitted(true);
      // Close dialog after showing success message
      setTimeout(() => {
        setShowFeedbackForm(false);
      }, 2000);
      setIsSubscribed(true);

      const rating = await handleOverallRatingChange();

      const response = await fetch("/api/preregister", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          preregister: true,
          email: formData.email,
          useremail: formData.email,
          fullName: formData.fullName,
          designation: formData.designation,
          country: formData.country,
          overallRating: rating,
          datetime: new Date().toUTCString(),
          feedback: feedbackData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit feedback");
      }

    } catch (error) {
      console.error("Error submitting feedback:", error);
      setError((prev) => ({
        ...prev,
        email: error.message || "Failed to submit feedback. Please try again.",
      }));
    } finally {
      setIsSubmitting(true);
    }
  };

  // Feedback form steps
  const feedbackSteps = [
    {
      id: "understandGoal",
      title: "Do you get our goal?",
      description:
        "LinkMyDrives is a unified cloud storage platform that connects all your cloud accounts into a single, seamless drive.",
      fields: ["rating", "feedback"],
    },
    {
      id: "canSolve",
      title: "Do you think it can solve your problems?",
      description:
        "Instead of managing multiple drives and folders separately, our platform becomes your new digital storage home — simplifying uploads, downloads, and file organization effortlessly.",
      fields: ["rating", "feedback"],
    },
    {
      id: "designAndUX",
      title: "About the design, UI, and user experience",
      fields: ["rating", "feedback"],
    },
    {
      id: "pricingStructure",
      title: "About the pricing structure",
      description:
        "Will you pay that value when you want to subscribe to our plans in the future?",
      fields: ["rating", "feedback"],
    },
    {
      id: "features",
      title: "About the features",
      fields: ["rating", "feedback"],
    },
  ];

  // Border animation variants
  const borderVariants = {
    animate: {
      pathLength: [0, 1],
      pathOffset: [0, 1],
      transition: {
        duration: 2,
        ease: "easeInOut",
        repeat: 0,
      }
    }
  };
  
  // Star animation
  const renderStars = () => {
    if (!showStars) return null;
    
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => {
          const size = Math.random() * 8 + 3;
          const left = `${Math.random() * 100}%`;
          const top = `${Math.random() * 100}%`;
          const delay = Math.random() * 5;
          const duration = Math.random() * 3 + 2;
          
          return (
            <motion.div
              key={i}
              className="absolute bg-yellow-300 rounded-full"
              style={{ 
                width: size, 
                height: size, 
                left, 
                top,
                opacity: 0.6,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1, 0], 
                opacity: [0, 0.8, 0]
              }}
              transition={{ 
                delay, 
                duration, 
                repeat: Infinity,
                repeatDelay: Math.random() * 5
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <>
      <motion.section
        className="py-20 bg-gradient-to-b from-primary/10 to-transparent relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Floating elements */}
        <motion.div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full blur-3xl opacity-20"
          animate={{ 
            x: [0, 20, 0], 
            y: [0, -20, 0] 
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
        
        <motion.div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full blur-3xl opacity-20"
          animate={{ 
            x: [0, -30, 0], 
            y: [0, 20, 0] 
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1 
          }}
        />
        
        <StatsSection rating={overallRating} />
      </motion.section>
      
      {/* Preregister Form Section */}
      <motion.section
        ref={formSectionRef}
        className="py-20 bg-gradient-to-b from-primary/10 to-transparent relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        id="preregister-form"
      >
        {renderStars()}
        
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-2xl mx-auto text-center mb-10"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <motion.div
              className="mb-6 inline-block"
              initial={{ scale: 0 }}
              animate={{ 
                scale: heroAnimationComplete ? 1 : 0,
                rotateY: heroAnimationComplete ? [0, 360, 0] : 0
              }}
              transition={{ 
                delay: 0.8, 
                duration: 1.5,
                ease: "easeOut" 
              }}
            >
              <div className="relative inline-block">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
                  <i className="ri-link text-white text-4xl"></i>
                </div>
                <motion.div 
                  className="absolute inset-0 rounded-full border-2 border-white opacity-30"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0, 0.3]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                />
              </div>
            </motion.div>
            
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Be the First to Experience Linkmydrives
            </motion.h2>
            
            <motion.p 
              className="text-lg text-gray-600 dark:text-gray-400"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <p>Join our waitlist and get early access when we launch. We'll
              notify you as soon as we're ready! Check out our exciting <a href="/" className="text-green-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">Demo</a> or take a look at our <a href="/policy" className="text-green-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">privacy policy</a>.</p>
            </motion.p>
          </motion.div>

          <motion.div
            className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 md:p-8 relative backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90"
            initial={{ y: 40, opacity: 0 }}
            animate={{ 
              y: 0, 
              opacity: 1,
              scale: showBorderAnimation ? 1.05 : 1,
            }}
            transition={{ 
              delay: 0.8, 
              duration: 0.6,
              scale: {
                duration: 0.3,
                ease: "easeInOut"
              }
            }}
          >
            {/* Form background decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-r from-pink-200 to-indigo-200 dark:from-pink-900 dark:to-indigo-900 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl opacity-30 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-900 dark:to-purple-900 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl opacity-30 pointer-events-none"></div>
            
            {/* Colorful border animation */}
            {showBorderAnimation && (
              <svg
                className="absolute inset-0 w-full h-full"
                style={{ 
                  pointerEvents: 'none', 
                  zIndex: 10 
                }}
              >
                <motion.rect
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  fill="none"
                  strokeWidth="3"
                  stroke="url(#gradient)"
                  rx="12"
                  ry="12"
                  variants={borderVariants}
                  animate="animate"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="25%" stopColor="#6366F1" />
                    <stop offset="50%" stopColor="#EC4899" /> 
                    <stop offset="75%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                </defs>
              </svg>
            )}

            {isSubscribed ? (
              <motion.div
                className="text-center py-6"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div 
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, 10, 0] }}
                  transition={{ 
                    scale: { duration: 0.5, ease: "backOut" },
                    rotate: { duration: 0.6, ease: "easeOut", delay: 0.3 }
                  }}
                >
                  <i className="ri-check-line text-4xl"></i>
                </motion.div>
                
                <motion.h3 
                  className="text-2xl font-bold mb-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  You're on the list!
                </motion.h3>
                
                <motion.p 
                  className="text-gray-600 dark:text-gray-400 mb-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                >
                  Thanks for your interest in Linkmydrives. We'll notify you
                  when we launch.
                </motion.p>
                
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.5, ease: "backOut" }}
                >
                  <div className="inline-block relative">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-8 h-8 mx-auto"
                        initial={{ scale: 0 }}
                        animate={{ 
                          scale: [0, 1.2, 0],
                          x: (i - 2) * 40,
                          y: [0, -30, 0] 
                        }}
                        transition={{ 
                          delay: 0.8 + i * 0.1,
                          duration: 0.8,
                          repeat: 0,
                          ease: "easeOut"
                        }}
                      >
                        <div className="w-full h-full rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs">
                          <i className="ri-heart-fill"></i>
                        </div>
                      </motion.div>
                    ))}
                    <div className="h-8">&nbsp;</div>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4 relative z-10">
                <motion.h3 
                  className="text-xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Preregister & Get Early Access
                </motion.h3>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium mb-1"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <i className="ri-user-3-line"></i>
                    </span>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Your full name"
                      value={formData.fullName}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                      required
                      className={`w-full pl-9 ${error.fullName ? "border-red-500" : ""}`}
                    />
                  </div>
                  {error.fullName && (
                    <p className="text-red-500 text-sm mt-1">
                      {error.fullName}
                    </p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <label
                    htmlFor="designation"
                    className="block text-sm font-medium mb-1"
                  >
                    Designation <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <i className="ri-briefcase-line"></i>
                    </span>
                    <Input
                      id="designation"
                      type="text"
                      placeholder="e.g., Professor, Developer, Student"
                      value={formData.designation}
                      onChange={(e) =>
                        handleInputChange("designation", e.target.value)
                      }
                      required
                      className={`w-full pl-9 ${error.designation ? "border-red-500" : ""}`}
                    />
                  </div>
                  {error.designation && (
                    <p className="text-red-500 text-sm mt-1">
                      {error.designation}
                    </p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium mb-1"
                  >
                    Country <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
                      <i className="ri-map-pin-line"></i>
                    </span>
                    <Select
                      value={formData.country}
                      onValueChange={(value) => handleInputChange("country", value)}
                    >
                      <SelectTrigger 
                        className={`w-full pl-9 ${error.country ? "border-red-500" : ""}`}
                      >
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {error.country && (
                    <p className="text-red-500 text-sm mt-1">
                      {error.country}
                    </p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <i className="ri-mail-line"></i>
                    </span>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      className={`w-full pl-9 ${error.email ? "border-red-500" : ""}`}
                    />
                  </div>
                  {error.email && (
                    <p className="text-red-500 text-sm mt-1">{error.email}</p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <Button
                    type="submit"
                    className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg shadow-lg flex items-center justify-center group transition-all duration-300 transform hover:scale-[1.02] focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <motion.div
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          initial={{ rotate: 0 }}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        </motion.div>
                        Processing...
                      </div>
                    ) : (
                      <>
                        <span>Join Waitlist</span>
                        <motion.span
                          className="ml-2"
                          initial={{ x: 0 }}
                          animate={{ x: [0, 5, 0] }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            repeatDelay: 1.5,
                          }}
                        >
                          <i className="ri-arrow-right-line"></i>
                        </motion.span>
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* Feedback Form Dialog */}
      <Dialog open={showFeedbackForm} onOpenChange={setShowFeedbackForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              {formSubmitted
                ? "Thank You For Your Feedback!"
                : feedbackSteps[currentStep].title}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            {formSubmitted ? (
              <motion.div
                className="text-center py-6"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="mx-auto flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, 10, 0] }}
                  transition={{
                    scale: { duration: 0.5, ease: "backOut" },
                    rotate: { duration: 0.6, ease: "easeOut", delay: 0.3 },
                  }}
                >
                  <i className="ri-check-line text-4xl"></i>
                </motion.div>

                <motion.p
                  className="text-gray-600 dark:text-gray-400 mb-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  Your feedback has been submitted successfully. We appreciate your input!
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <p className="text-sm text-gray-500">
                    This dialog will close automatically...
                  </p>
                </motion.div>
              </motion.div>
            ) : (
              <div>
                {feedbackSteps[currentStep].description && (
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {feedbackSteps[currentStep].description}
                  </p>
                )}

                <div className="space-y-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                    >
                      {feedbackSteps[currentStep].fields.includes("rating") && (
                        <div className="mb-6">
                          <label className="block text-sm font-medium mb-2">
                            Your Rating
                          </label>
                          <div className="flex items-center justify-center space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <motion.button
                                key={star}
                                type="button"
                                className="flex items-center justify-center w-12 h-12 rounded-full focus:outline-none"
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() =>
                                  handleRatingChange(
                                    feedbackSteps[currentStep].id,
                                    star
                                  )
                                }
                              >
                                <motion.span
                                  animate={{
                                    scale:
                                      feedbackData[feedbackSteps[currentStep].id]
                                        .rating >= star
                                        ? [1, 1.2, 1]
                                        : 1,
                                  }}
                                  transition={{
                                    duration: 0.3,
                                    ease: "easeInOut",
                                  }}
                                >
                                  {feedbackData[feedbackSteps[currentStep].id]
                                    .rating >= star ? (
                                    <i className="ri-star-fill text-2xl text-yellow-400"></i>
                                  ) : (
                                    <i className="ri-star-line text-2xl text-gray-400"></i>
                                  )}
                                </motion.span>
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      )}

                      {feedbackSteps[currentStep].fields.includes(
                        "feedback"
                      ) && (
                        <div>
                          <label
                            htmlFor={`feedback-${feedbackSteps[currentStep].id}`}
                            className="block text-sm font-medium mb-2"
                          >
                            Your Feedback (Optional)
                          </label>
                          <Textarea
                            id={`feedback-${feedbackSteps[currentStep].id}`}
                            placeholder="Share your thoughts with us..."
                            rows={4}
                            value={
                              feedbackData[feedbackSteps[currentStep].id]
                                .feedback
                            }
                            onChange={(e) =>
                              handleFeedbackChange(
                                feedbackSteps[currentStep].id,
                                "feedback",
                                e.target.value
                              )
                            }
                            className="w-full"
                          />
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="flex justify-between mt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={currentStep === 0 ? handleCloseFeedbackSubmit : handlePrevious}
                    className="px-4 py-2"
                  >
                    {currentStep === 0 ? "Skip" : "Back"}
                  </Button>
                  
                  <Button
                    type="button"
                    onClick={
                      currentStep === feedbackSteps.length - 1
                        ? handleFeedbackSubmit
                        : handleNext
                    }
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                    disabled={
                      feedbackSteps[currentStep].fields.includes("rating") &&
                      feedbackData[feedbackSteps[currentStep].id].rating === 0
                    }
                  >
                    {currentStep === feedbackSteps.length - 1 ? (
                      isSubmitting ? (
                        <div className="flex items-center">
                          <motion.div
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            initial={{ rotate: 0 }}
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                          </motion.div>
                          Submitting...
                        </div>
                      ) : (
                        "Submit Feedback"
                      )
                    ) : (
                      "Next"
                    )}
                  </Button>
                </div>

                {/* Progress Indicator */}
                <div className="mt-8">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs text-gray-500">
                      Step {currentStep + 1} of {feedbackSteps.length}
                    </span>
                    <span className="text-xs text-gray-500">
                      {Math.round(
                        ((currentStep + 1) / feedbackSteps.length) * 100
                      )}
                      % Complete
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                    <motion.div
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 h-1.5 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{
                        width: `${
                          ((currentStep + 1) / feedbackSteps.length) * 100
                        }%`,
                      }}
                      transition={{ duration: 0.3 }}
                    ></motion.div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}