import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { TEAM_MEMBERS } from "@/lib/constants";

export default function About() {
  const [activeSection, setActiveSection] = useState(0);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  
  const iconVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { scale: 1, rotate: 0, transition: { type: "spring", stiffness: 260, damping: 20 } },
    hover: { scale: 1.1, rotate: 5, transition: { duration: 0.2 } }
  };
  
  const policySections = [
    { title: "What We Collect", id: 1 },
    { title: "Why We Collect It", id: 2 },
    { title: "Demo Disclaimer", id: 3 },
    { title: "Data Security", id: 4 },
    { title: "Your Rights", id: 5 },
    { title: "Policy Updates", id: 6 }
  ];
  
  const handleSectionClick = (index) => {
    setActiveSection(index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800" ref={containerRef}>
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-500/5 dark:bg-blue-500/10"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-purple-500/5 dark:bg-purple-500/10"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div 
          className="absolute top-3/4 right-1/3 w-40 h-40 rounded-full bg-emerald-500/5 dark:bg-emerald-500/10"
          animate={{
            x: [0, 20, 0],
            y: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>
      
      <motion.div 
        style={{ opacity, scale }}
        className="container mx-auto px-4 py-16 relative z-10"
      >
        {/* Hero Section with animated background */}
        <motion.div
          className="text-center max-w-4xl mx-auto mb-20 relative"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <motion.div 
            className="absolute -z-10 w-full h-full top-0 left-0 rounded-3xl opacity-20 dark:opacity-30"
            style={{
              background: "radial-gradient(circle, rgba(99,102,241,0.5) 0%, rgba(99,102,241,0) 70%)",
            }}
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full">
              <motion.div
                animate={{ 
                  rotate: [0, 10, 0, -10, 0],
                }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Privacy Policy
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            LinkMyDrives is committed to protecting your personal information. This privacy policy outlines how we collect, use, and protect the data you share during your interaction with our demo version.
          </motion.p>
        </motion.div>

        {/* Navigation Pills */}
        <motion.div 
          className="max-w-4xl mx-auto mb-12 overflow-x-auto py-4 scrollbar-hide"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex space-x-3 md:justify-center min-w-max px-2">
            {policySections.map((section, index) => (
              <motion.button
                key={section.id}
                variants={itemVariants}
                onClick={() => handleSectionClick(index)}
                className={`px-4 py-2 rounded-full text-sm md:text-base font-medium transition-all duration-300 ${
                  activeSection === index 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-300 dark:shadow-indigo-900/30" 
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span 
                  animate={activeSection === index ? { 
                    opacity: [0.6, 1, 0.6],
                  } : {}}
                  transition={activeSection === index ? { 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  } : {}}
                >
                  {section.id}. {section.title}
                </motion.span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Privacy Policy Content with Animations */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            {activeSection === 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2"></div>
                <div className="p-8">
                  <div className="flex items-start mb-6">
                    <motion.div 
                      className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-xl mr-4"
                      variants={iconVariants}
                      initial="initial"
                      animate="animate"
                      whileHover="hover"
                    >
                      <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </motion.div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">1. What We Collect</h2>
                  </div>
                  
                  <motion.p 
                    className="text-gray-700 dark:text-gray-300 mb-4 pl-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    By submitting information through our pre-registration form and review page, we may collect:
                  </motion.p>
                  
                  <motion.ul 
                    className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-12 mb-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {["Full Name", "Email Address", "Country", "Job Title / Designation", "Feedback and Comments", "Date & Time of Submission"].map((item, i) => (
                      <motion.li 
                        key={i}
                        variants={itemVariants}
                        className="flex items-center bg-gray-50 dark:bg-gray-700/50 px-4 py-3 rounded-lg"
                      >
                        <div className="bg-indigo-100 dark:bg-indigo-800/30 p-1.5 rounded-full mr-3">
                          <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">{item}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>
              </div>
            )}

            {activeSection === 1 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 h-2"></div>
                <div className="p-8">
                  <div className="flex items-start mb-6">
                    <motion.div 
                      className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl mr-4"
                      variants={iconVariants}
                      initial="initial"
                      animate="animate"
                      whileHover="hover"
                    >
                      <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </motion.div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">2. Why We Collect It</h2>
                  </div>
                  
                  <motion.p 
                    className="text-gray-700 dark:text-gray-300 mb-4 pl-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    We use this information to:
                  </motion.p>
                  
                  <motion.div 
                    className="space-y-4 pl-12 mb-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {[
                      "Send early access and updates regarding LinkMyDrives",
                      "Understand our user base and collect valuable feedback",
                      "Evaluate traction and engagement during our early testing phase",
                      "Refine the product experience based on real-world insights"
                    ].map((item, i) => (
                      <motion.div 
                        key={i}
                        variants={itemVariants}
                        className="flex items-start p-4 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-l-4 border-blue-500"
                      >
                        <div className="mr-4 mt-1">
                          <div className="bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-200 rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm">
                            {i + 1}
                          </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{item}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>
            )}

            {activeSection === 2 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-2"></div>
                <div className="p-8">
                  <div className="flex items-start mb-6">
                    <motion.div 
                      className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-xl mr-4"
                      variants={iconVariants}
                      initial="initial"
                      animate="animate"
                      whileHover="hover"
                    >
                      <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </motion.div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">3. Demo Disclaimer</h2>
                  </div>
                  
                  <motion.p 
                    className="text-gray-700 dark:text-gray-300 mb-4 pl-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    This is a demo version intended solely for:
                  </motion.p>
                  
                  <motion.div 
                    className="flex flex-wrap gap-4 pl-12 mb-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {["Collecting user feedback", "Measuring early traction"].map((item, i) => (
                      <motion.div 
                        key={i}
                        variants={itemVariants}
                        className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 rounded-lg px-5 py-3 inline-flex items-center"
                      >
                        <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{item}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                  
                  <motion.div 
                    className="bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 p-5 rounded-r-lg mb-6 ml-12"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <p className="text-gray-700 dark:text-gray-300 mb-2 font-medium">Please note:</p>
                    <p className="text-gray-700 dark:text-gray-300">
                      The final product may differ significantly in terms of UI/UX, features, and pricing from what is currently available in the demo.
                    </p>
                  </motion.div>
                </div>
              </div>
            )}

            {activeSection === 3 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-green-500 h-2"></div>
                <div className="p-8">
                  <div className="flex items-start mb-6">
                    <motion.div 
                      className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-xl mr-4"
                      variants={iconVariants}
                      initial="initial"
                      animate="animate"
                      whileHover="hover"
                    >
                      <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </motion.div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">4. Data Security</h2>
                  </div>
                  
                  <motion.div 
                    className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 pl-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.div
                      className="absolute -right-8 -bottom-8 w-32 h-32 opacity-10"
                      animate={{ 
                        rotate: [0, 360],
                      }}
                      transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    >
                      <svg className="w-full h-full text-emerald-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                    
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      We take reasonable technical and organizational measures to secure your personal data. Your information is only accessible to authorized team members and is never sold or shared with third parties.
                    </p>
                  </motion.div>
                </div>
              </div>
            )}

            {activeSection === 5 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2"></div>
                <div className="p-8">
                  <div className="flex items-start mb-6">
                    <motion.div 
                      className="bg-cyan-100 dark:bg-cyan-900/30 p-3 rounded-xl mr-4"
                      variants={iconVariants}
                      initial="initial"
                      animate="animate"
                      whileHover="hover"
                    >
                      <svg className="w-6 h-6 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </motion.div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">6. Policy Updates</h2>
                  </div>
                  
                  <motion.div 
                    className="pl-12 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="relative p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-gradient-to-b from-white to-cyan-50 dark:from-gray-800 dark:to-cyan-900/10">
                      <motion.div
                        className="absolute -right-2 -top-2 w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center"
                        animate={{ 
                          rotate: [0, -10, 0, 10, 0],
                        }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <svg className="w-6 h-6 text-cyan-600 dark:text-cyan-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </motion.div>
                      
                      <p className="text-gray-700 dark:text-gray-300 mb-6">
                        We may revise this policy as the product develops. All updates will be posted on this page with the revised date.
                      </p>
                      
                      <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg border-l-4 border-cyan-500">
                        <p className="text-gray-700 dark:text-gray-300 mb-2">
                          By using the demo site and submitting your information, you agree to the terms outlined in this privacy policy.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 font-medium">
                          Thank you so much for your time and support.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 italic">
                          Your feedback today can help shape the future of limitless and simplified cloud storage tomorrow!
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            )}
            
            {activeSection === 4 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-pink-500 h-2"></div>
                <div className="p-8">
                  <div className="flex items-start mb-6">
                    <motion.div 
                      className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl mr-4"
                      variants={iconVariants}
                      initial="initial"
                      animate="animate"
                      whileHover="hover"
                    >
                      <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </motion.div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">5. Your Rights</h2>
                  </div>
                  
                                      <motion.p 
                    className="text-gray-700 dark:text-gray-300 mb-4 pl-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    You have the right to:
                  </motion.p>
                  
                  <motion.div 
                    className="space-y-3 pl-12 mb-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {[
                      "Request access to your personal data",
                      "Request correction or deletion of your data",
                      "Opt out of further communications"
                    ].map((item, i) => (
                      <motion.div 
                        key={i}
                        variants={itemVariants}
                        className="flex items-center"
                      >
                        <motion.div 
                          className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3"
                          whileHover={{ rotate: 15 }}
                        >
                          <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </motion.div>
                        <span className="text-gray-700 dark:text-gray-300">{item}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                  
                  <motion.div
                    className="pl-12 mb-6 p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg border-l-4 border-purple-500"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <p className="text-gray-700 dark:text-gray-300 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      To make a request, please contact us at: 
                      <span className="font-medium ml-1 text-purple-700 dark:text-purple-400">diptomansingh.personal@gmail.com</span>
                    </p>
                  </motion.div>
                </div>
              
              </div>
            )}
            </motion.div>
            </AnimatePresence>
      </motion.div>
      </div>
  )}