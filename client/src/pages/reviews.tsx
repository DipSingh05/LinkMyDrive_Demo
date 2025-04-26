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
import StatsSection, { fetchStats } from "@/components/review/StatsSection";

export default function PreregisterForm() {
  // State for preregistration form
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    designation: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState({
    email: "",
    fullName: "",
    designation: "",
  });

  // State for feedback form
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [overallRating, setOverallRating] = useState(0);
  const formRef = useRef(null);

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

  // Feedback form steps
  const feedbackSteps = [
    {
      id: "understandGoal",
      title: "Do you get our goal?",
      fields: ["rating", "feedback"],
    },
    {
      id: "canSolve",
      title: "Do you think it can solve your problems?",
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
    const newErrors = { email: "", fullName: "", designation: "" };

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

    setError(newErrors);
    return isValid;
  };

  // Handle preregistration form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    setIsSubmitting(false);
    setShowFeedbackForm(true);
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
    const newRatings = Object.values(feedbackData).map((d) => d.rating);
    const registerRating = 2;
    const response = await fetchStats();
    const previousOverallRating = response?.overallRating ?? 0;
    const previousCount = response?.feedbacks ?? 0;

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
          overallRating: rating,
          datetime: new Date().toUTCString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit preregistration");
      }

      await fetchStats();

      // Simulate API response
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsSubscribed(true);
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
          overallRating: rating,
          datetime: new Date().toUTCString(),
          feedback: feedbackData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit feedback");
      }
      await fetchStats();

      // Simulate API response
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setFormSubmitted(true);
      // Close dialog after showing success message
      setTimeout(() => {
        setShowFeedbackForm(false);
      }, 2000);
      setIsSubscribed(true);
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
  return (
    <>
      <motion.section
        className="py-20 bg-gradient-to-b from-primary/10 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <StatsSection rating={overallRating} />
      </motion.section>
      {/* Preregister Form Section */}
      <motion.section
        className="py-20 bg-gradient-to-b from-primary/10 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-2xl mx-auto text-center mb-10"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Be the First to Experience Linkmydrives
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Join our waitlist and get early access when we launch. We'll
              notify you as soon as we're ready!
            </p>
          </motion.div>

          <motion.div
            className="max-w-md mx-auto bg-white dark:bg-dark-surface rounded-xl shadow-xl p-6 md:p-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {isSubscribed ? (
              <motion.div
                className="text-center py-6"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-4">
                  <i className="ri-check-line text-3xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-2">You're on the list!</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Thanks for your interest in Linkmydrives. We'll notify you
                  when we launch.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <h3 className="text-xl font-bold mb-4">
                  Preregister for Early Access
                </h3>

                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium mb-1"
                  >
                    Full Name *
                  </label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Your full name"
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    required
                    className={`w-full ${error.fullName ? "border-red-500" : ""}`}
                  />
                  {error.fullName && (
                    <p className="text-red-500 text-sm mt-1">
                      {error.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="designation"
                    className="block text-sm font-medium mb-1"
                  >
                    Designation *
                  </label>
                  <Input
                    id="designation"
                    type="text"
                    placeholder="e.g., Professor, Developer, Student"
                    value={formData.designation}
                    onChange={(e) =>
                      handleInputChange("designation", e.target.value)
                    }
                    required
                    className={`w-full ${error.designation ? "border-red-500" : ""}`}
                  />
                  {error.designation && (
                    <p className="text-red-500 text-sm mt-1">
                      {error.designation}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1"
                  >
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className={`w-full ${error.email ? "border-red-500" : ""}`}
                  />
                  {error.email && (
                    <p className="text-red-500 text-sm mt-1">{error.email}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full py-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      Processing...
                    </span>
                  ) : (
                    "Get Early Access"
                  )}
                </Button>

                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                  By signing up, you agree to our Terms of Service and Privacy
                  Policy.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* Feedback Form Dialog */}
      <Dialog
        open={showFeedbackForm}
        onOpenChange={(open) => {
          if (!open && !formSubmitted) {
            handleCloseFeedbackSubmit();
            console.log("close");
          }
          setShowFeedbackForm(open);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {formSubmitted ? "Thank You!" : "Help Us Improve Linkmydrives"}
            </DialogTitle>
          </DialogHeader>

          {formSubmitted ? (
            <motion.div
              className="text-center py-10"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-500 mb-6">
                <i className="ri-check-line text-4xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">
                Feedback Submitted Successfully
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Thank you for taking the time to provide your valuable feedback.
                It will help us make Linkmydrives even better!
              </p>
            </motion.div>
          ) : (
            <div className="py-4">
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your feedback is valuable to us. Please take a moment to share
                your thoughts.
              </p>

              {error.email && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-md">
                  {error.email}
                </div>
              )}

              <div className="relative" ref={formRef}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="min-h-[300px]"
                  >
                    <div className="mb-8">
                      <h3 className="text-xl font-bold mb-2">
                        {feedbackSteps[currentStep].title}
                      </h3>
                      {feedbackSteps[currentStep].description && (
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          {feedbackSteps[currentStep].description}
                        </p>
                      )}

                      <div className="space-y-4">
                        <div className="mb-4">
                          <label className="block text-sm font-medium mb-2">
                            Your Rating
                          </label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() =>
                                  handleRatingChange(
                                    feedbackSteps[currentStep].id,
                                    star,
                                  )
                                }
                                className="text-2xl focus:outline-none transition-colors"
                              >
                                <i
                                  className={`${star <= feedbackData[feedbackSteps[currentStep].id].rating ? "text-yellow-400" : "text-gray-300 hover:text-yellow-200"} ri-star-fill`}
                                ></i>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Your Comments (Optional)
                          </label>
                          <Textarea
                            placeholder="Share your thoughts with us..."
                            className="w-full p-3 min-h-[120px]"
                            value={
                              feedbackData[feedbackSteps[currentStep].id]
                                .feedback
                            }
                            onChange={(e) =>
                              handleFeedbackChange(
                                feedbackSteps[currentStep].id,
                                "feedback",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="flex justify-between mt-6">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 0 || isSubmitting}
                  >
                    Previous
                  </Button>

                  {currentStep < feedbackSteps.length - 1 ? (
                    <Button
                      onClick={handleNext}
                      disabled={
                        isSubmitting ||
                        feedbackData[feedbackSteps[currentStep].id].rating === 0
                      }
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      onClick={async () => {
                        await handleFeedbackSubmit();
                        console.log("close by feedback submit");
                        setShowFeedbackForm(false);
                      }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <i className="ri-loader-4-line animate-spin mr-2"></i>
                          Submitting...
                        </span>
                      ) : (
                        "Submit Feedback"
                      )}
                    </Button>
                  )}
                </div>

                <div className="flex justify-center mt-8 gap-2">
                  {feedbackSteps.map((step, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${currentStep === index ? "bg-primary" : "bg-gray-300 dark:bg-gray-700"}`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
