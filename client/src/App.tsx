import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SplashScreen } from "@/components/intro/splash-screen";
import { useState, useEffect } from "react";

// Pages
import Dashboard from "@/pages/dashboard";
import Login from "@/pages/login";
import IntroScreen from "@/components/intro/intro-screen";
import Pricing from "@/pages/pricing";
import About from "@/pages/about";
import Download from "@/pages/download";
import Reviews from "@/pages/reviews";
import NotFound from "@/pages/not-found";
import Policy from "@/pages/policy"

function Router() {
  return (
    <Switch>
      {/* If authenticated, go to dashboard. Otherwise, go to login */}
      <Route path="/" component={Dashboard} />
      <Route path="/login" component={Login} />
      
      {/* Public pages */}
      <Route path="/pricing" component={Pricing} />
      <Route path="/about" component={About} />
      <Route path="/policy" component={Policy} />
      <Route path="/download" component={Download} />
      <Route path="/reviews" component={Reviews} />
      <Route path="/feedback" component={Reviews} />
      <Route path="/demo" component={Reviews} />
      

      {/* Catch-all for 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [splashComplete, setSplashComplete] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [showIntro, setShowIntro] = useState(false);
  const [location, setLocation] = useLocation();

  // Check if user has seen intro before
  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('hasSeenIntro');
    if (!hasSeenIntro && splashComplete) {
      setShowIntro(true);
    }
  }, [splashComplete]);

  const handleSplashComplete = () => {
    setSplashComplete(true);
    setTimeout(() => setInitialLoad(false), 100);
  };

  const handleIntroComplete = () => {
    localStorage.setItem('hasSeenIntro', 'true');
    setShowIntro(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {initialLoad ? (
          <SplashScreen onComplete={handleSplashComplete} />
        ) : showIntro ? (
          <IntroScreen onComplete={handleIntroComplete} />
        ) : (
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Router />
            </main>
            <Footer />
          </div>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
