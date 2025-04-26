import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DOWNLOAD_OPTIONS } from '@/lib/constants';

export default function Download() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div 
        className="text-center max-w-3xl mx-auto mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-4">Download Linkmydrives</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Access your unified cloud storage from any device with our native applications
        </p>
      </motion.div>

      {/* Platforms Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {DOWNLOAD_OPTIONS.map((option, index) => (
          <motion.div 
            key={index}
            className="bg-white dark:bg-dark-surface rounded-lg shadow-md p-6 text-center"
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-5xl mb-4 text-gray-700 dark:text-gray-300">
              <i className={option.icon}></i>
            </div>
            <h2 className="text-xl font-semibold mb-2">{option.platform}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {option.supportedVersions}
            </p>
            <Button asChild className="w-full">
              <a href={option.downloadUrl}>
                <i className="ri-download-line mr-1"></i> Download
              </a>
            </Button>
          </motion.div>
        ))}
      </motion.div>

      {/* Requirements Section */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="bg-white dark:bg-dark-surface rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">System Requirements</h2>
          
          <Tabs defaultValue="windows" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="windows">Windows</TabsTrigger>
              <TabsTrigger value="macos">macOS</TabsTrigger>
              <TabsTrigger value="linux">Linux</TabsTrigger>
              <TabsTrigger value="android">Android</TabsTrigger>
              <TabsTrigger value="ios">iOS</TabsTrigger>
            </TabsList>
            
            <TabsContent value="windows" className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Minimum Requirements</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>Windows 10 (64-bit) or newer</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>4GB RAM</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>1.5 GHz dual-core processor</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>200 MB available storage</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>Internet connection</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Recommended</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>Windows 11 (64-bit)</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>8GB RAM</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>2.5 GHz quad-core processor</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>500 MB available storage</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>Broadband Internet connection</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="macos" className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Minimum Requirements</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>macOS 10.14 (Mojave) or newer</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>4GB RAM</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>Intel Core i5 or Apple M1</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>200 MB available storage</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>Internet connection</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Recommended</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>macOS 12 (Monterey) or newer</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>8GB RAM</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>Apple M1 or newer</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>500 MB available storage</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>Broadband Internet connection</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="linux" className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Minimum Requirements</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>Ubuntu 20.04, Fedora 32 or equivalent</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>4GB RAM</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>1.5 GHz dual-core processor</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>200 MB available storage</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>Internet connection</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Recommended</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>Ubuntu 22.04, Fedora 36 or newer</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>8GB RAM</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>2.5 GHz quad-core processor</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>500 MB available storage</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>Broadband Internet connection</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="android" className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Minimum Requirements</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>Android 8.0 (Oreo) or newer</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>2GB RAM</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>Quad-core processor</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>100 MB available storage</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>Internet connection</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Recommended</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>Android 11 or newer</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>4GB RAM</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>Octa-core processor</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>200 MB available storage</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>Wi-Fi or 4G/5G connection</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="ios" className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Minimum Requirements</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>iOS 13 or newer</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>iPhone 8 or newer, iPad (6th gen) or newer</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>100 MB available storage</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>Internet connection</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Recommended</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>iOS 15 or newer</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>iPhone 12 or newer, iPad Air (4th gen) or newer</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>200 MB available storage</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-checkbox-circle-fill text-green-500 mt-1 mr-2"></i>
                      <span>Wi-Fi or 4G/5G connection</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </motion.section>

      {/* Release Notes Section */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="bg-white dark:bg-dark-surface rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Latest Release</h2>
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Version 1.2.0</h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">Released: May 18, 2023</span>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <h4 className="font-medium mb-2">New Features:</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Added support for iCloud integration</li>
                  <li>New upload statistics dashboard</li>
                  <li>File preview for videos and audio files</li>
                  <li>Improved search capabilities with file content indexing</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Improvements:</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>50% faster synchronization with cloud services</li>
                  <li>Enhanced dark mode support</li>
                  <li>Better handling of large file uploads</li>
                  <li>Improved offline mode functionality</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Bug Fixes:</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Fixed an issue with OneDrive authentication</li>
                  <li>Resolved folder navigation issues on some devices</li>
                  <li>Fixed file sorting in list view</li>
                  <li>Addressed memory issues when handling very large folders</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Button variant="outline">
              <i className="ri-history-line mr-1"></i> View All Release Notes
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        className="bg-gradient-to-r from-primary to-blue-700 rounded-xl p-8 text-white text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-2xl font-bold mb-4">Take Your Files Anywhere</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Download Linkmydrives now and access all your cloud storage services from any device, anytime.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {DOWNLOAD_OPTIONS.slice(0, 3).map((option, index) => (
            <Button key={index} size="lg" className="bg-white text-primary hover:bg-gray-100">
              <i className={`${option.icon} mr-2`}></i> Download for {option.platform}
            </Button>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
