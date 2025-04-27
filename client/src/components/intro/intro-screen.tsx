import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { DEMO_WARNING } from "@/lib/constants";
import {
  FiCloud,
  FiFolder,
  FiShield,
  FiInfo,
  FiSearch,
  FiRefreshCw,
  FiEye,
  FiUploadCloud,
  FiArrowLeft,
  FiArrowRight,
} from "react-icons/fi";
import { LuBrainCircuit } from "react-icons/lu";
import { FaLaptopFile } from "react-icons/fa6";
import { SiGoogledrive, SiDropbox, SiApple } from "react-icons/si";
import { fetchStats } from "@/components/review/StatsSection";

export default function IntroScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    // Show hint after 5 seconds on the first step
    if (currentStep === 0) {
      const timer = setTimeout(() => setShowHint(true), 5000);
      return () => clearTimeout(timer);
    } else {
      setShowHint(false);
    }
  }, [currentStep]);

  const recordVisit = async () => {
    try {
      await fetch("/api/visit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "visit" }),
      });

      console.log("Visit recorded");
      fetchStats();
    } catch (error) {
      console.error("Error recording visit:", error);
    }
  };

  const steps = [
    {
      title: "Welcome to Linkmydrives",
      description:
        "One Platform to connect, combine, and manage all your cloud drives with ease and a seamless modern UI/UX.",
      icon: <FiCloud className="w-10 h-10" />,
      visual: (
        <div className="flex items-center justify-center gap-4 ">
          {/* Cloud service icons */}
          <motion.div
            key="google"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.1,
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="w-12 h-12 flex items-center justify-center text-3xl text-gray-700 dark:text-gray-300"
          >
            <SiGoogledrive />
          </motion.div>
          <motion.div
            key="onedrive"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.3,
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="w-12 h-12 flex items-center justify-center text-3xl text-gray-700 dark:text-gray-300"
          >
            <FiCloud />
          </motion.div>
          <motion.div
            key="dropbox"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.5,
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="w-12 h-12 flex items-center justify-center text-3xl text-gray-700 dark:text-gray-300"
          >
            <SiDropbox />
          </motion.div>
          <motion.div
            key="apple"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.7,
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="w-12 h-12 flex items-center justify-center text-3xl text-gray-700 dark:text-gray-300"
          >
            <SiApple />
          </motion.div>
        </div>
      ),
    },
    {
      title: "Our Solution",
      description:
        "Managing files across different cloud accounts shouldn't feel like a full-time job. We bring all your storage spaces together into one unified drive, We go beyond just managing cloud drives.",
      icon: <FiFolder className="w-10 h-10" />,
      visual: (
        <div className="flex flex-col items-center ">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-80 h-fit bg-gray-100 dark:bg-gray-800 rounded-lg mb-3 p-4 flex flex-col"
          >
            <div className="text-xs text-gray-500 mb-2">One Interface</div>
            <div className="flex-1 flex items-center justify-center text-center">
              <div className="text-sm">
                No more switching between multiple apps, we merge them so you can upload, access, downloads, and manage your files happens effortlessly without worrying about individual limits. <br />— without worrying where they’re stored.
              </div>
            </div>
          </motion.div>
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.2 + 0.5 }}
                className="w-3 h-3 rounded-full bg-primary"
              />
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Key Benefits",
      description:
        "Manage, upload, and download across all your cloud storages — as if they were one giant drive. No switching apps. No searching folders. Just pure simplicity.",
      icon: <FiShield className="w-10 h-10" />,
      visual: (
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mx-auto">
          {[
            { icon: <FiSearch />, text: "Search and transfer across drives" },
            { icon: <FiRefreshCw />, text: "Smart uploads" },
            { icon: <FiEye />, text: "Enhanced file preview" },
            { icon: <FiUploadCloud />, text: "Unified Storage" },
            { icon: <FaLaptopFile />, text: "Advance File Management" },
            { icon: <LuBrainCircuit />, text: "A.I Assistant" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 + 0.3 }}
              className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="text-primary text-xl mb-2">{item.icon}</div>
              <div className="text-xs text-center">{item.text}</div>
            </motion.div>
          ))}
        </div>
      ),
    },
    {
      title: "Demo Version",
      description: DEMO_WARNING,
      icon: <FiInfo className="w-10 h-10" />,
      visual: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4 max-w-md"
        >
          <div className="text-amber-800 dark:text-amber-300 text-sm">
            <p className="mb-2 font-medium">Demo Limitations:</p>
            <ul className="h-24 list-disc list-inside space-y-1 overflow-hidden overflow-y-auto pe-4">
              <li>Connections to cloud services are simulated</li>
              <li>Limited functionality compared to the final product</li>
              <li>File transfers and uploads are demonstrative</li>
              <li>Data is not persistent between sessions</li>
            </ul>
          </div>
        </motion.div>
      ),
    },
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onComplete();
      recordVisit();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Variant for smooth transitions between steps
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  // Track swipe direction
  const [direction, setDirection] = useState(1);
  const paginate = (newDirection: number) => {
    if (newDirection > 0 && currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    } else if (newDirection < 0 && currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-dark-bg flex flex-col">
      {/* Progress Indicator */}
      <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5">
        <motion.div
          className="bg-primary h-1.5 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: (currentStep + 1) / steps.length }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      <div className=" flex-1 flex flex-col items-center justify-center px-6 py-4 max-w-4xl mx-auto w-full overflow-hidden overflow-y-auto">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="text-center flex flex-col items-center justify-center w-full"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={(_, info) => {
              if (Math.abs(info.offset.x) > 100) {
                paginate(info.offset.x < 0 ? 1 : -1);
              }
            }}
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 text-primary">
              {steps[currentStep].icon}
            </div>

            <h1 className="text-3xl font-bold mb-4">
              {steps[currentStep].title}
            </h1>

            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto">
              {steps[currentStep].description}
            </p>

            {/* Visual element specific to each step */}
            {steps[currentStep].visual}
          </motion.div>
        </AnimatePresence>

        {/* Swipe hint animation */}
        {showHint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            className="absolute bottom-40 text-gray-400 dark:text-gray-500 text-sm flex items-center gap-2"
          >
            <FiArrowLeft /> click to navigate <FiArrowRight />
          </motion.div>
        )}
      </div>

      {/* Step indicators */}
      <div className="flex justify-center item-center m-2 space-x-2">
        <div>
          {steps.map((_, index) => (
            <button
              key={index}
              className={`w-2.5 h-2.5 m-1 rounded-full transition-all ${
                index === currentStep
                  ? "bg-primary w-8"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
              onClick={() => {
                setDirection(index > currentStep ? 1 : -1);
                setCurrentStep(index);
              }}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
          className="gap-2"
        >
          <FiArrowLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        <Button onClick={nextStep} className="gap-2">
          <span>{currentStep < steps.length - 1 ? "Next" : "Get Started"}</span>
          {currentStep < steps.length - 1 ? (
            <FiArrowRight className="h-4 w-4" />
          ) : null}
        </Button>
      </div>
    </div>
  );
}
