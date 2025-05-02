import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useTheme } from '@/components/ui/theme-provider';
import ThemeToggleButton from '../ui/themeToggleButton';

export function Navbar() {
  const [location, setLocation] = useLocation();
  const { theme, setTheme } = useTheme();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLocation('/login'); // Redirect to login page
  };
  

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMenus = () => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header className="bg-white dark:bg-dark-surface border-b border-light-border dark:border-dark-border sticky top-0 z-10">
      <div>
        <ThemeToggleButton />
      </div>
      
      <div className="container mx-auto flex justify-between items-center px-4 h-16">
        {/* Logo and Navigation */}
        <div className="flex items-center space-x-8">
          <Link href="/" onClick={closeMenus} className="flex items-center">
            <i className="ri-cloud-line text-primary text-2xl mr-2"></i>
            <span className="font-bold text-xl">Linkmydrives</span>
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link 
              href="/" 
              onClick={closeMenus}
              className={`py-5 border-b-2 ${isActive('/') ? 'border-primary text-primary font-medium' : 'border-transparent hover:text-primary'} transition-colors`}>
              Dashboard
            </Link>
            <Link 
              href="/pricing" 
              onClick={closeMenus}
              className={`py-5 border-b-2 ${isActive('/pricing') ? 'border-primary text-primary font-medium' : 'border-transparent hover:text-primary'} transition-colors`}>
              Pricing
            </Link>
            <Link 
              href="/download" 
              onClick={closeMenus}
              className={`py-5 border-b-2 ${isActive('/download') ? 'border-primary text-primary font-medium' : 'border-transparent hover:text-primary'} transition-colors`}>
              Download
            </Link>
            <Link 
              href="/about" 
              onClick={closeMenus}
              className={`py-5 border-b-2 ${isActive('/about') ? 'border-primary text-primary font-medium' : 'border-transparent hover:text-primary'} transition-colors`}>
              About
            </Link>
            <Link 
              href="/reviews" 
              onClick={closeMenus}
              className={`py-5 border-b-2 ${isActive('/reviews') ? 'border-primary text-primary font-medium' : 'border-transparent hover:text-primary'} transition-colors`}>
              Pre-Register
            </Link>
          </nav>
        </div>
        
        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md focus:outline-none"
          onClick={toggleMobileMenu}
        >
          <i className={`ri-${mobileMenuOpen ? 'close' : 'menu'}-line text-xl`}></i>
        </button>
        
        {/* User Menu and Theme Toggle */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="relative">
            <button onClick={toggleUserMenu} className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <i className="ri-user-line"></i>
              </div>
              <span className="hidden md:inline">Demo User</span>
              <i className={`ri-arrow-${userMenuOpen ? 'up' : 'down'}-s-line`}></i>
            </button>
            
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-surface rounded-lg shadow-lg border border-light-border dark:border-dark-border z-20">
                <div className="p-3 border-b border-light-border dark:border-dark-border">
                  <p className="font-medium">Demo User</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">demo@linkmydrives.com</p>
                </div>
                <div className="py-1">
                  <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">Profile Settings</a>
                  <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">Account Settings</a>
                  <button onClick={handleLogout} className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800">Log Out</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-dark-surface border-b border-light-border dark:border-dark-border">
          <nav className="flex flex-col px-4 py-2">
            <Link 
              href="/" 
              onClick={closeMenus}
              className={`py-3 ${isActive('/') ? 'text-primary font-medium' : ''}`}>
              Dashboard
            </Link>
            <Link 
              href="/pricing" 
              onClick={closeMenus}
              className={`py-3 ${isActive('/pricing') ? 'text-primary font-medium' : ''}`}>
              Pricing
            </Link>
            <Link 
              href="/download" 
              onClick={closeMenus}
              className={`py-3 ${isActive('/download') ? 'text-primary font-medium' : ''}`}>
              Download
            </Link>
            <Link 
              href="/about" 
              onClick={closeMenus}
              className={`py-3 ${isActive('/about') ? 'text-primary font-medium' : ''}`}>
              About
            </Link>
            <Link 
              href="/reviews" 
              onClick={closeMenus}
              className={`py-3 ${isActive('/reviews') ? 'text-primary font-medium' : ''}`}>
              Reviews
            </Link>
            <div className="flex items-center justify-between py-3 border-t border-light-border dark:border-dark-border mt-2">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-2">
                  <i className="ri-user-line"></i>
                </div>
                <span>Demo User</span>
              </div>
              <div className="flex space-x-2">
                <Link href="/login" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-bg text-red-600">
                  <i className="ri-logout-box-line"></i>
                </Link>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
