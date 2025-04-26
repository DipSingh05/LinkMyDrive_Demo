// import { useTheme } from "@/components/ui/theme-provider";
// import { Sun, Moon } from "lucide-react";

// export default function ThemeToggleButton() {
//   const { theme, setTheme } = useTheme();
//   const isDark = theme === "dark";

//   const toggleTheme = () => {
//     const newTheme = isDark ? "light" : "dark";  // Toggle between light and dark theme
//     setTheme(newTheme);  // Update theme state

//     // Set theme directly in the document class and localStorage
//     const root = window.document.documentElement;
//     root.classList.remove("light", "dark");
//     root.classList.add(newTheme);  // Apply the selected theme class to <html>

//     localStorage.setItem("linkmydrives-theme", newTheme);  // Update localStorage immediately
//     console.log(`Theme changed to: ${newTheme}`);
//   };

//   return (
//     <button
//       onClick={toggleTheme}
//       className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-primary text-white shadow-lg hover:scale-105 transition-transform"
//       aria-label="Toggle Theme"
//     >
//       {isDark ? <Sun className="w-full h-full" /> : <Moon className="w-full h-full" />}
//     </button>
//   );
// }


import { useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ThemeToggleButton() {
  const [isDark, setIsDark] = useState(false); // false = show Moon, true = show Sun
  const { toast } = useToast(); // ✅ move this inside the component

  const toggleIcon = () => {
    setIsDark(!isDark);
    toast({
      title: "Theme toggle mode",
      description: "This is a demo feature, may include in future Beta Production version.",
    });
  };

  return (
    <button
      onClick={toggleIcon}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-primary text-white shadow-lg hover:scale-105 transition-transform"
      aria-label="Toggle Icon"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
