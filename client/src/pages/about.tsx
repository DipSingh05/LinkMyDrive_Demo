import { motion } from "framer-motion";
import { TEAM_MEMBERS } from "@/lib/constants";

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <motion.div
        className="text-center max-w-3xl mx-auto mb-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-4">About Linkmydrives</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
        We’re on a mission to solve the storage limit problems by unify your cloud storage and give you true control over your digital world — simple, powerful, and frustration-free.
        </p>
      </motion.div>

      {/* What We Are Section */}
      <motion.section
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="bg-white dark:bg-dark-surface rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">What We Are</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
              LinkMyDrives is a unified cloud storage platform that connects all your cloud accounts into a single, seamless drive. We believe managing your files should be effortless — no matter how many platforms you use.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
              Founded in 2025, our team of cloud storage enthusiasts and engineers shared a simple vision:
              to eliminate the chaos of juggling multiple cloud drives and create a smarter, unified storage experience.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
              Our platform is built to be intuitive, powerful, and secure — giving you full control of your digital assets while ensuring the privacy and protection you expect from modern cloud technology.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-video">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-600">
                  <i className="ri-cloud-line text-4xl"></i>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center text-purple-600">
                  <i className="ri-link-m text-4xl"></i>
                </div>
                <div className="bg-gradient-to-r from-primary/90 to-blue-700/90 w-full h-full rounded-xl flex items-center justify-center px-6 text-white text-xl font-medium text-center">
                  Connecting Your Digital World
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* What We Solve Section */}
      <motion.section
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="bg-white dark:bg-dark-surface rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">What We Solve</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "ri-folder-5-line",
                title: "File Fragmentation",
                description:
                  "No more wondering which service has which files. Access everything in one place.",
              },
              {
                icon: "ri-time-line",
                title: "Time Waste",
                description:
                  "Stop switching between multiple apps and tabs to find your files.",
              },
              {
                icon: "ri-search-eye-line",
                title: "Search Frustration",
                description:
                  "Search across all your cloud storage services simultaneously.",
              },
              {
                icon: "ri-shield-check-line",
                title: "Security Concerns",
                description:
                  "Manage access to your files while maintaining end-to-end encryption.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <div className="text-primary text-3xl mb-4">
                  <i className={item.icon}></i>
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="bg-white dark:bg-dark-surface rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {[
              {
                icon: "ri-link-m",
                title: "Multiple Service Integration",
                description:
                  "Connect Google Drive, OneDrive, Dropbox, iCloud and more in one dashboard.",
              },
              {
                icon: "ri-search-line",
                title: "Universal Search",
                description:
                  "Find files across all your cloud storage services with one search.",
              },
              {
                icon: "ri-upload-cloud-2-line",
                title: "Smart Uploads",
                description:
                  "Upload files to any connected service directly from our interface.",
              },
              {
                icon: "ri-file-search-line",
                title: "File Preview",
                description:
                  "Preview documents, images, videos, and more without downloading.",
              },
              {
                icon: "ri-pie-chart-line",
                title: "Storage Analytics",
                description:
                  "See detailed breakdowns of your storage usage across all services.",
              },
              {
                icon: "ri-share-line",
                title: "Easy File Sharing",
                description:
                  "Share files from any service with customizable access controls.",
              },
            ].map((feature, index) => (
              <div key={index} className="flex">
                <div className="text-primary text-2xl mr-4 mt-1">
                  <i className={feature.icon}></i>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        className="mb-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Meet Our Team</h2>
        <div className="m-6 text-center text-xs text-gray-500 dark:text-gray-500">
          <p>
            This is a demo version intended for collecting feedback and
            measuring early traction.
          </p>
          <p><b>
            No person is real in this images. Those are all AI generated
            images..
          </b></p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {TEAM_MEMBERS.map((member, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-dark-surface rounded-lg shadow-md overflow-hidden"
              variants={itemVariants}
            >
              <img
                src={member.avatar}
                alt={member.name}
                className="w-full h-52 object-cover object-center"
              />
              <div className="p-4 text-center">
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {member.role}
                </p>
                <div className="mt-3 flex justify-center space-x-3">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <i className="ri-linkedin-fill"></i>
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <i className="ri-twitter-fill"></i>
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <i className="ri-mail-line"></i>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        className="bg-gradient-to-r from-primary to-blue-700 rounded-xl p-8 text-white text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <h2 className="text-2xl font-bold mb-4">
          Ready to Simplify Your Cloud Storage?
        </h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Join thousands of users who have transformed how they manage their
          files across multiple cloud services.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/login"
            className="bg-white text-primary hover:bg-gray-100 px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Get Started Free
          </a>
          <a
            href="/pricing"
            className="bg-transparent border border-white hover:bg-white/10 px-6 py-2 rounded-lg font-medium transition-colors"
          >
            View Pricing
          </a>
        </div>
      </motion.section>
    </div>
  );
}
