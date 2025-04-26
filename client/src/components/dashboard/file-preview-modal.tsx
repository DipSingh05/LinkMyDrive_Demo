import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { FileIcon } from './file-icon';
import type { FileInfo, FilePreviewProps, DriveInfo } from '@/lib/types';
import { DRIVE_COLORS } from '@/lib/constants';
import { Button } from '@/components/ui/button';

export function FilePreviewModal({ file, onClose }: FilePreviewProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640); // Tailwind's "sm" breakpoint (640px)
    };
  
    handleResize(); // Run once on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const [currentFile, setCurrentFile] = useState<FileInfo>(file);
  
  // Fetch drives data for the file info
  const { data: drives } = useQuery({
    queryKey: ['/api/drives'],
  });
  
  // Fetch all files for navigation
  const { data: files } = useQuery<FileInfo[]>({
    queryKey: ['/api/files'],
  });
  
  // Get filtered files of the same type for navigation
  const filesOfSameType = files?.filter(f => f.type === currentFile.type) || [];
  const currentIndex = filesOfSameType.findIndex(f => f.id === currentFile.id);
  
  // Navigation functions
  const goToPreviousFile = () => {
    if (currentIndex > 0) {
      setCurrentFile(filesOfSameType[currentIndex - 1]);
    }
  };
  
  const goToNextFile = () => {
    if (currentIndex < filesOfSameType.length - 1) {
      setCurrentFile(filesOfSameType[currentIndex + 1]);
    }
  };
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPreviousFile();
      } else if (e.key === 'ArrowRight') {
        goToNextFile();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, filesOfSameType]);
  
  // Close modal when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    
    // Close modal with Escape key
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscapeKey);
    
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  const getDrive = () => {
    return drives && Array.isArray(drives) ? drives.find((d: DriveInfo) => d.id === currentFile.driveId) : undefined;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatFileSize = (sizeInKB: number) => {
    if (sizeInKB < 1024) return `${sizeInKB} KB`;
    return `${(sizeInKB / 1024).toFixed(1)} MB`;
  };
  
  // Handle file download
  const handleDownload = () => {
    // In a real app, this would trigger a download of the actual file
    alert(`Downloading ${currentFile.name}`);
  };

  const getPreviewContent = () => {
    switch (currentFile.type) {
      case 'pdf':
        return (
          <div id="pdf-preview" className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 h-96 overflow-auto">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-2xl font-bold mb-4">Project Proposal: Cloud Storage Integration</h1>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                This document outlines the proposed strategy for integrating multiple cloud storage services
                into a single unified platform, enhancing productivity and simplifying file management for users.
              </p>
              <h2 className="text-xl font-semibold mb-2">Executive Summary</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                In today's digital landscape, users commonly utilize multiple cloud storage services for different
                purposes. This fragmentation leads to inefficiency, confusion, and wasted time switching between platforms.
                Linkmydrives provides a solution by creating a unified interface where users can access and manage
                all their cloud storage accounts in one place.
              </p>
              <h2 className="text-xl font-semibold mb-2">Project Scope</h2>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
                <li>Integration with major cloud storage providers: Google Drive, Microsoft OneDrive, Dropbox, and iCloud</li>
                <li>Unified file browsing, searching, and management</li>
                <li>Secure OAuth authentication for all connected services</li>
                <li>Cross-platform compatibility (Web, Desktop, Mobile)</li>
                <li>Enterprise-grade security and privacy</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-400 italic text-sm">
                Document continues on next page...
              </p>
            </div>
          </div>
        );
        
      case 'image':
        return (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-center h-96">
            <img 
              src="https://placehold.co/800x500/e2e8f0/1e293b?text=Product+Mockup" 
              alt={currentFile.name} 
              className="max-h-full max-w-full object-contain rounded"
            />
          </div>
        );
        
      case 'video':
        return (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-center h-96">
            <div className="w-full max-w-3xl aspect-video bg-black rounded flex items-center justify-center text-white">
              <div className="text-center">
                <i className="ri-video-line text-5xl mb-2"></i>
                <p>Video Player - {currentFile.name}</p>
                <button className="mt-4 bg-white text-black py-2 px-4 rounded-full flex items-center mx-auto">
                  <i className="ri-play-fill mr-1"></i> Play
                </button>
              </div>
            </div>
          </div>
        );
        
      case 'doc':
        return (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 h-96 overflow-auto">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-xl font-bold mb-4">Meeting Notes: Product Strategy</h1>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                <strong>Date:</strong> May 8, 2023<br />
                <strong>Attendees:</strong> Sarah, Michael, David, Jennifer, Robert
              </p>
              <h2 className="text-lg font-semibold mb-2">Agenda Items</h2>
              <ol className="list-decimal pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
                <li>Q2 Product Roadmap Review</li>
                <li>Feature Prioritization</li>
                <li>Development Timeline</li>
                <li>Marketing Strategy</li>
              </ol>
              <h2 className="text-lg font-semibold mb-2">Discussion Points</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                The team reviewed the current product roadmap and made adjustments based on recent user feedback.
                The cloud storage integration feature was moved up in priority due to high demand from enterprise customers.
                Michael raised concerns about the timeline, suggesting we might need to add another developer to the team.
              </p>
              <h2 className="text-lg font-semibold mb-2">Action Items</h2>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
                <li>Sarah: Finalize Q2 roadmap by end of week</li>
                <li>David: Create technical specifications for the storage integration</li>
                <li>Jennifer: Update the project timeline</li>
                <li>Robert: Coordinate with marketing team on messaging</li>
              </ul>
            </div>
          </div>
        );
        
      case 'spreadsheet':
        return (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 h-96 overflow-auto">
            <div className="w-full overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-dark-surface border border-gray-300 dark:border-gray-700">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700">
                    <th className="py-2 px-4 border border-gray-300 dark:border-gray-600">Category</th>
                    <th className="py-2 px-4 border border-gray-300 dark:border-gray-600">Q1</th>
                    <th className="py-2 px-4 border border-gray-300 dark:border-gray-600">Q2</th>
                    <th className="py-2 px-4 border border-gray-300 dark:border-gray-600">Q3</th>
                    <th className="py-2 px-4 border border-gray-300 dark:border-gray-600">Q4</th>
                    <th className="py-2 px-4 border border-gray-300 dark:border-gray-600">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border border-gray-300 dark:border-gray-600 font-medium">Development</td>
                    <td className="py-2 px-4 border border-gray-300 dark:border-gray-600">$45,000</td>
                    <td className="py-2 px-4 border border-gray-300 dark:border-gray-600">$50,000</td>
                    <td className="py-2 px-4 border border-gray-300 dark:border-gray-600">$55,000</td>
                    <td className="py-2 px-4 border border-gray-300 dark:border-gray-600">$55,000</td>
                    <td className="py-2 px-4 border border-gray-300 dark:border-gray-600 font-medium">$205,000</td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <td className="py-2 px-4 border border-gray-300 dark:border-gray-600 font-medium">Marketing</td>
                    <td className="py-2 px-4 border border-gray-300 dark:border-gray-600">$30,000</td>
                    <td className="py-2 px-4 border border-gray-300 dark:border-gray-600">$35,000</td>
                    <td className="py-2 px-4 border border-gray-300 dark:border-gray-600">$40,000</td>
                    <td className="py-2 px-4 border border-gray-300 dark:border-gray-600">$45,000</td>
                    <td className="py-2 px-4 border border-gray-300 dark:border-gray-600 font-medium">$150,000</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border border-gray-300 dark:border-gray-600 font-medium">Operations</td>
                    <td className="py-2 px-4 border border-gray-300 dark:border-gray-600">$25,000</td>
                    <td className="py-2 px-4 border border-gray-300 dark:border-gray-600">$25,000</td>
                    <td className="py-2 px-4 border border-gray-300 dark:border-gray-600">$28,000</td>
                    <td className="py-2 px-4 border border-gray-300 dark:border-gray-600">$28,000</td>
                    <td className="py-2 px-4 border border-gray-300 dark:border-gray-600 font-medium">$106,000</td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <td className="py-2 px-4 border border-gray-300 dark:border-gray-600 font-medium">Infrastructure</td>
                    <td className="py-2 px-4 border border-gray-300 dark:border-gray-600">$15,000</td>
                    <td className="py-2 px-4 border border-gray-300 dark:border-gray-600">$18,000</td>
                    <td className="py-2 px-4 border border-gray-300 dark:border-gray-600">$20,000</td>
                    <td className="py-2 px-4 border border-gray-300 dark:border-gray-600">$22,000</td>
                    <td className="py-2 px-4 border border-gray-300 dark:border-gray-600 font-medium">$75,000</td>
                  </tr>
                  <tr className="bg-gray-200 dark:bg-gray-700 font-semibold">
                    <td className="py-2 px-4 border border-gray-300 dark:border-gray-600">Total</td>
                    <td className="py-2 px-4 border border-gray-300 dark:border-gray-600">$115,000</td>
                    <td className="py-2 px-4 border border-gray-300 dark:border-gray-600">$128,000</td>
                    <td className="py-2 px-4 border border-gray-300 dark:border-gray-600">$143,000</td>
                    <td className="py-2 px-4 border border-gray-300 dark:border-gray-600">$150,000</td>
                    <td className="py-2 px-4 border border-gray-300 dark:border-gray-600">$536,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 h-96 flex items-center justify-center">
            <div className="text-center">
              <FileIcon fileType={currentFile.type} size="lg" className="mx-auto mb-4" />
              <p className="text-lg font-medium">{currentFile.name}</p>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Preview not available for this file type</p>
              <button className="mt-4 bg-primary hover:bg-blue-600 text-white py-2 px-4 rounded-full flex items-center mx-auto">
                <i className="ri-download-line mr-1"></i> Download to view
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
        <motion.div
          ref={modalRef}
          className="relative top-1/2 left-1/2 w-full max-w-4xl bg-white dark:bg-dark-surface rounded-lg shadow-2xl overflow-hidden"
          initial={{ opacity: 0, x: '-50%', y: isMobile ? '-37%' : '-45%' }}
          animate={{ opacity: 1, x: '-50%', y: isMobile ? '-37%' : '-50%' }}
          exit={{ opacity: 0, y: isMobile ? '-37%' : '-45%' }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >

          <div className="flex flex-col sm:flex-row sm:justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-2 sm:mb-0">
              {currentFile.name}
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                {currentIndex + 1} of {filesOfSameType.length} {currentFile.type} files
              </span>
            </h3>
            <div className="flex items-center gap-2 justify-between">
              <div className='flex items-center gap-2'>
              <button 
                onClick={handleDownload} 
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center" 
                title="Download"
              >
                <i className="ri-download-line mr-1"></i>
                <span className="text-sm hidden xs:inline">Download</span>
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center" title="Share">
                <i className="ri-share-line mr-1"></i>
                <span className="text-sm hidden xs:inline">Share</span>
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center" title="Delete">
                <i className="ri-delete-bin-line text-red-500 mr-1"></i>
                <span className="text-sm hidden xs:inline">Delete</span>
              </button>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center" title="Close">
                <i className="ri-close-line mr-1"></i>
                <span className="text-sm hidden xs:inline">Close</span>
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {/* File Preview Content */}
            <div className="relative">
              {/* Navigation Arrows */}
              {currentIndex > 0 && (
                <button 
                  onClick={goToPreviousFile} 
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-10"
                  title="Previous file"
                >
                  <i className="ri-arrow-left-line"></i>
                </button>
              )}
              
              {currentIndex < filesOfSameType.length - 1 && (
                <button 
                  onClick={goToNextFile} 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-10"
                  title="Next file"
                >
                  <i className="ri-arrow-right-line"></i>
                </button>
              )}
              
              {getPreviewContent()}
            </div>
            
            {/* File Info */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium mb-1">File Details</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="block"><strong>Size:</strong> {formatFileSize(currentFile.size)}</span>
                  <span className="block"><strong>Type:</strong> {currentFile.type.charAt(0).toUpperCase() + currentFile.type.slice(1)}</span>
                  <span className="block"><strong>Created:</strong> {formatDate(currentFile.createdAt)}</span>
                  <span className="block"><strong>Modified:</strong> {formatDate(currentFile.lastModified)}</span>
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium mb-1">Storage Location</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="flex items-center">
                    {getDrive() && (
                      <>
                        <i className={`${DRIVE_COLORS[getDrive()!.type as keyof typeof DRIVE_COLORS]?.icon} ${DRIVE_COLORS[getDrive()!.type as keyof typeof DRIVE_COLORS]?.text} mr-2`}></i>
                        {getDrive()!.name}
                      </>
                    )}
                  </span>
                  <span className="block mt-1"><strong>Path:</strong> {currentFile.path}</span>
                  <span className="block"><strong>Account:</strong> {getDrive()?.email}</span>
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium mb-1">Sharing</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="block"><strong>Status:</strong> Private</span>
                  <button className="mt-2 text-primary hover:text-blue-700 dark:hover:text-blue-400 flex items-center">
                    <i className="ri-share-line mr-1"></i> Share File
                  </button>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
