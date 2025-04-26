import { LoginForm } from "@/components/auth/login-form";
import { DEMO_WARNING } from "@/lib/constants";
import { motion } from "framer-motion";

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-primary text-5xl mb-3">
            <i className="ri-cloud-line"></i>
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to Linkmydrives</h1>
          <p className="text-gray-600 dark:text-gray-400">Unified cloud storage management</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <LoginForm />
          
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p className="mb-1">{DEMO_WARNING}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
