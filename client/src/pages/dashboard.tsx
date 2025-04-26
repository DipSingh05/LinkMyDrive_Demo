import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { DriveCard } from "@/components/cloud-drives/drive-card";
import { AddDriveCard } from "@/components/cloud-drives/add-drive-card";
import { AnimatedStatistics } from "@/components/dashboard/animated-statistics";
import { FilesTable } from "@/components/dashboard/files-table";
import { DriveInfo } from "@/lib/types";
import { motion } from "framer-motion";
import { ArrowUpRight, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import DriveDashboard from "@/components/cloud-drives/drive-dashboard";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);

  const [totalStorage, setTotalStorage] = useState(0);
  const [totalUsed, setTotalUsed] = useState(0);
  const [usagePercent, setUsagePercent] = useState(0);

  // Fetch connected drives
  const { data: drives, isLoading: drivesLoading } = useQuery<DriveInfo[]>({
    queryKey: ["/api/drives"],
  });

  useEffect(() => {
    // Auth check
    const token = localStorage.getItem('token');
    const isAuthenticated = !!token;

    if (!isAuthenticated && process.env.NODE_ENV !== "development") {
      setLocation("/login");
    } else {
      setTimeout(() => setIsLoaded(true), 100);
    }
  }, [setLocation]);

  // Storage calculation runs only when drives is fetched
  useEffect(() => {
    if (!drives) return;

    const totalStorage = drives.reduce(
      (acc, drive) => acc + drive.totalSpace,
      0,
    );
    const totalUsed = drives.reduce((acc, drive) => acc + drive.usedSpace, 0);
    const usagePercent = totalStorage ? (totalUsed / totalStorage) * 100 : 0;

    setTotalStorage(totalStorage);
    setTotalUsed(totalUsed);
    setUsagePercent(usagePercent);
  }, [drives]);

  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemAnimation = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  if (!isLoaded) {
    return <div className="container mx-auto px-4 py-6 min-h-screen"></div>;
  }

  return (
    <motion.div
      className="container mx-auto px-4 py-6"
      variants={containerAnimation}
      initial="hidden"
      animate="show"
    >
      <motion.h1 className="text-2xl font-bold mb-6" variants={itemAnimation}>
        Dashboard
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Main Content Area - spans 2 columns on desktop */}
        <div className="md:col-span-3 space-y-6">
          {/* Connected Drives Section */}
          <motion.section className="mb-8" variants={itemAnimation}>
            <h2 className="text-lg font-semibold mb-4">Connected Drives</h2>
            <div className="">
              {drivesLoading ? (
                Array(4)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-dark-surface rounded-lg shadow p-4 animate-pulse"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                        <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      </div>
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-1"></div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1"></div>
                      </div>
                    </div>
                  ))
              ) : (
                <>
                  <DriveDashboard />
                </>
              )}
            </div>
          </motion.section>

          {/* Files Management Section */}
          <motion.div variants={itemAnimation}>
            <FilesTable />
          </motion.div>
        </div>

        {/* Sidebar - 1 column on desktop */}
        <div className="space-y-6 animate-fade-in animation-delay-500">
          {/* Usage Stats */}
          <div className="w-full bg-white p-5 rounded-lg shadow-md dashboard-card">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <span className="material-icons text-primary mr-2 text-lg">
                insights
              </span>
              Quick Stats
            </h2>
            <div className="space-y-4">
              {/* Storage Usage */}
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Storage Usage</span>
                  <span className="font-medium">
                    {(totalUsed / 1024).toFixed(1)} GB /{" "}
                    {(totalStorage / 1024).toFixed(1)} GB
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 rounded-full animate-pulse-slow"
                    style={{ width: `${usagePercent.toFixed(1)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Connected Services</span>
                  <span className="font-medium">4/5</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full animate-pulse-slow"
                    style={{ width: "80%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Files Synced</span>
                  <span className="font-medium">100%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full animate-pulse-slow animation-delay-200"
                    style={{ width: "100%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Sync</span>
                  <span className="font-medium text-green-600 flex items-center">
                    <span className="material-icons text-green-500 mr-1 text-sm">
                      check_circle
                    </span>
                    Just Now
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Info */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-lg shadow-md border border-blue-100 hover:shadow-lg transition-all dashboard-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <span className="material-icons text-blue-600 mr-2 text-lg">
                  workspace_premium
                </span>
                Free Plan
              </h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full animate-pulse-slow">
                Active
              </span>
            </div>

            <ul className="space-y-3 mb-5">
              <li className="flex items-center text-sm animation-delay-200 animate-fade-in">
                <span className="material-icons text-green-500 text-base mr-2">
                  check_circle
                </span>
                <span>Connect 6 cloud services</span>
              </li>
              <li className="flex items-center text-sm animation-delay-300 animate-fade-in">
                <span className="material-icons text-green-500 text-base mr-2">
                  check_circle
                </span>
                <span>Basic file management</span>
              </li>
              <li className="flex items-center text-sm opacity-50 animation-delay-400 animate-fade-in">
                <span className="material-icons text-gray-400 text-base mr-2">
                  remove_circle
                </span>
                <span>Advanced search & filters</span>
              </li>
              <li className="flex items-center text-sm opacity-50 animation-delay-500 animate-fade-in">
                <span className="material-icons text-gray-400 text-base mr-2">
                  remove_circle
                </span>
                <span>File version history</span>
              </li>
            </ul>

            <Button className="w-full bg-[#4285F4] hover:bg-[#4285F4]/90 group btn-hover-effect">
              <a
                className="w-full flex justify-center items-center"
                href={"/pricing"}
              >
                <span>Upgrade to Pro</span>
                <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </Button>
          </div>

          {/* Upload Stats Graph - Responsive Flex */}
          <motion.div variants={itemAnimation}>
            <AnimatedStatistics />
          </motion.div>

          {/* Help & Support */}
          <div className="bg-white p-5 rounded-lg shadow-md dashboard-card overflow-hidden relative">
            <div className="absolute -right-12 -top-12 h-28 w-28 bg-blue-50 rounded-full opacity-70"></div>
            <div className="absolute right-8 bottom-10 h-14 w-14 bg-indigo-50 rounded-full opacity-70 animate-float"></div>
            <div className="relative">
              <h2 className="text-lg font-semibold mb-3 flex items-center">
                <span className="material-icons text-primary mr-2 text-lg">
                  support_agent
                </span>
                Need Help?
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Having trouble with LinkMyDrive? Our support team is here to
                help.
              </p>
              <Button
                className="outline w-full group btn-hover-effect"
                onClick={() => {
                  toast({
                    title: "Contact Demo Button",
                    description:
                      "This is a Demo feature button that may be included in the production (Beta) version.",
                  });
                }}
              >
                <LifeBuoy className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                <span>Contact Support</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
