import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import CountUp from "react-countup";
import { FiUsers, FiUserPlus, FiMessageCircle } from "react-icons/fi";

export type Stats = {
  visits: number;
  registrations: number;
  feedbacks: number;
  lastUpdated: string;
  overallRating: number;
};

const StatCard = ({
  title,
  value,
  icon,
  delay,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className="w-full"
  >
    <Card className="p-6 relative overflow-hidden group hover:shadow-lg transition-all duration-300 dark:bg-gray-800 bg-gradient-to-br from-white to-primary/5">
      <motion.div
        className="absolute -right-8 -top-8 w-24 h-24 bg-primary/10 rounded-full backdrop-blur-sm"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <motion.div
        className="absolute -left-12 -bottom-12 w-32 h-32 bg-primary/5 rounded-full blur-x"
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [90, 0, 90],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl text-primary">{icon}</div>
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full"
        ></motion.div>
      </div>
      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
        {title}
      </h3>
      <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
        <CountUp end={value} duration={2.5} separator="," />
      </div>
      <motion.div
        className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-green-400"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </Card>
  </motion.div>
);

// Exported fetchStats function
export const fetchStats = async (): Promise<Stats | null> => {
  try {
    const response = await fetch("/api/stats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log("Fetched stats:", data);
    return data;
  } catch (error) {
    console.error("Error fetching stats:", error);
    return null;
  }
};

const StatsSection = ({ rating }: { rating?: number }) => {
  console.log("rating...", rating);
  const [stats, setStats] = useState<Stats>({
    visits: 0,
    registrations: 0,
    feedbacks: 0,
    lastUpdated: "",
    overallRating: rating ?? 0,
  });

  useEffect(() => {
    const updateStats = async () => {
      const latestStats = await fetchStats();
      if (latestStats) {
        setStats(latestStats);
      }
    };

    updateStats();
    const interval = setInterval(updateStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // NEW: Watch for rating prop changes
  useEffect(() => {
    if (rating !== undefined) {
      setStats((prev) => ({
        ...prev,
        overallRating: rating,
      }));
      fetchStats();
    }
  }, [rating]);

  const statsConfig = [
    {
      title: "Total Visits",
      value: stats.visits,
      icon: <FiUsers className="w-6 h-6" />,
      delay: 0,
    },
    {
      title: "Registrations",
      value: stats.registrations,
      icon: <FiUserPlus className="w-6 h-6" />,
      delay: 0.2,
    },
    {
      title: "Feedback Received",
      value: stats.feedbacks,
      icon: <FiMessageCircle className="w-6 h-6" />,
      delay: 0.4,
    },
  ];

  return (
    <AnimatePresence>
      <div className="w-full px-4 py-8 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Live Statistics
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Real-time updates every 30 seconds
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {statsConfig.map((stat, index) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        {stats.lastUpdated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400"
          >
            Last updated: {new Date(stats.lastUpdated).toLocaleString()}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Card className="max-w-md mx-auto p-6 bg-gradient-to-r from-primary/5 to-primary/10 backdrop-blur-sm border border-primary/20 shadow-xl hover:shadow-primary/20 transition-all duration-300">
            <h3 className="text-xl font-semibold mb-4">Overall Rating</h3>
            {typeof stats.overallRating === "number" && (
              <>
                <div className="flex justify-center items-center gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFull = star <= Math.floor(stats.overallRating);
                    const isHalf =
                      star === Math.ceil(stats.overallRating) &&
                      stats.overallRating % 1 >= 0.5;

                    return (
                      <i
                        key={star}
                        className={`text-2xl ${
                          isFull
                            ? "ri-star-fill text-yellow-400"
                            : isHalf
                              ? "ri-star-half-line text-yellow-400"
                              : "ri-star-line text-gray-300"
                        }`}
                      ></i>
                    );
                  })}
                </div>

                <div className="text-3xl font-bold text-primary">
                  {stats.overallRating.toFixed(1)}/5.0
                </div>
              </>
            )}
            <p className="text-sm text-gray-600 mt-2">Based on user feedback</p>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default StatsSection;
