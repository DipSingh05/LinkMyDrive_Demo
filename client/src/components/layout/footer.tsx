import { Link } from 'wouter';

export function Footer() {
  return (
    <footer className="bg-white dark:bg-dark-surface border-t border-light-border dark:border-dark-border py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <i className="ri-cloud-line text-primary text-xl mr-2"></i>
              <span className="font-bold text-lg">Linkmydrives</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Connect all your cloud storage accounts into one unified drive. Simplify uploads, downloads, and file management across multiple platforms — effortlessly.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                <i className="ri-twitter-fill text-lg"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                <i className="ri-facebook-fill text-lg"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                <i className="ri-linkedin-fill text-lg"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                <i className="ri-github-fill text-lg"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">Dashboard</Link></li>
              <li><Link href="/pricing" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="/download" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">Download</Link></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">Security</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">Enterprise</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">About</Link></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">Blog</a></li>
              <li><Link href="/reviews" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">Feedbacks</Link></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">API Reference</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">Status</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">System Updates</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-light-border dark:border-dark-border mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Linkmydrives. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">Cookies</a>
          </div>
        </div>
        
        <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-500">
          <p>This is a demo version intended for collecting feedback and measuring early traction.</p>
          <p>The final product may differ significantly in terms of UI/UX, features, and pricing.</p>
        </div>
      </div>
    </footer>
  );
}
