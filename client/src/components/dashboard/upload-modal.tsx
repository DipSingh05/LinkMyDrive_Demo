import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { FileIcon } from './file-icon';
import type { DriveInfo, FileType } from '@/lib/types';
import { format } from 'date-fns';

// Define demo preset files
const DEMO_FILES = [
  { name: 'Annual Report.pdf', type: 'pdf' as FileType, size: 2048 }, // 2MB
  { name: 'Product Mockup.png', type: 'image' as FileType, size: 4096 }, // 4MB
  { name: 'Project Presentation.pptx', type: 'presentation' as FileType, size: 8192 }, // 8MB
  { name: 'Financial Summary.xlsx', type: 'spreadsheet' as FileType, size: 1024 }, // 1MB
  { name: 'Company Video.mp4', type: 'video' as FileType, size: 20480 }, // 20MB
  { name: 'Meeting Notes.docx', type: 'doc' as FileType, size: 512 }, // 0.5MB
  { name: 'Brand Assets.zip', type: 'archive' as FileType, size: 10240 }, // 10MB
  { name: 'Company Podcast.mp3', type: 'audio' as FileType, size: 15360 }, // 15MB
];

interface UploadModalProps {
  drives: DriveInfo[];
  isOpen: boolean;
  onClose: () => void;
}

export function UploadModal({ drives, isOpen, onClose }: UploadModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [selectedDrive, setSelectedDrive] = useState<DriveInfo | null>(drives[0] || null);
  const [selectedTab, setSelectedTab] = useState<'upload' | 'preset'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<(typeof DEMO_FILES)[0] | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  
  const uploadMutation = useMutation({
    mutationFn: async (data: { 
      driveId: number, 
      file: File | { name: string, type: string, size: number } 
    }) => {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 200);
      
      // Simulate API call to upload file
      const res = await apiRequest('POST', '/api/files', {
        driveId: data.driveId,
        userId: 1, // Using default demo user ID
        name: data.file.name,
        type: getFileType(data.file.name),
        size: data.file.size,
        path: `/${data.file.name}`,
        lastModified: format(new Date(), 'MMM d, yyyy')
      });
      
      // Complete progress once request is done
      clearInterval(interval);
      setUploadProgress(100);
      
      return res.json();
    },
    onSuccess: () => {
      // Invalidate files query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/files'] });
      
      // Close modal after short delay to see the complete status
      setTimeout(() => {
        resetForm();
        onClose();
      }, 1000);
    }
  });
  
  const getFileType = (filename: string): FileType => {
    const extension = filename.split('.').pop()?.toLowerCase() || '';
    
    const typeMap: {[key: string]: FileType} = {
      pdf: 'pdf',
      doc: 'doc', docx: 'doc',
      xls: 'spreadsheet', xlsx: 'spreadsheet',
      ppt: 'presentation', pptx: 'presentation',
      jpg: 'image', jpeg: 'image', png: 'image', gif: 'image', svg: 'image',
      mp4: 'video', mov: 'video', avi: 'video', mkv: 'video',
      mp3: 'audio', wav: 'audio', ogg: 'audio',
      zip: 'archive', rar: 'archive', '7z': 'archive',
      txt: 'text'
    };
    
    return typeMap[extension] || 'other';
  };
  
  const resetForm = () => {
    setSelectedFile(null);
    setSelectedPreset(null);
    setUploadProgress(0);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size limit (50MB)
      if (file.size > 50 * 1024 * 1024) {
        alert('File size exceeds the limit of 50MB. Please select a smaller file.');
        return;
      }
      
      setSelectedFile(file);
    }
  };
  
  const handlePresetSelect = (preset: typeof DEMO_FILES[0]) => {
    setSelectedPreset(preset);
  };
  
  const handleUpload = () => {
    if (!selectedDrive) {
      alert('Please select a drive');
      return;
    }
    
    if (selectedTab === 'upload' && selectedFile) {
      uploadMutation.mutate({ driveId: selectedDrive.id, file: selectedFile });
    } else if (selectedTab === 'preset' && selectedPreset) {
      uploadMutation.mutate({ driveId: selectedDrive.id, file: selectedPreset });
    } else {
      alert('Please select a file to upload');
    }
  };
  
  // Handle ESC key press and click outside
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !uploadMutation.isPending) {
        onClose();
      }
    };
    
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node) && !uploadMutation.isPending) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    document.addEventListener('mousedown', handleOutsideClick);
    
    // Prevent body scrolling
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('mousedown', handleOutsideClick);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose, uploadMutation.isPending]);
  
  // Format file size for display
  const formatFileSize = (sizeInKB: number) => {
    if (sizeInKB < 1024) return `${sizeInKB} KB`;
    return `${(sizeInKB / 1024).toFixed(1)} MB`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
          <motion.div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          <motion.div 
            ref={modalRef}
            className="relative bg-white dark:bg-dark-surface rounded-lg shadow-xl w-full max-w-xl mx-4 overflow-hidden"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-medium">Upload File</h3>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
                disabled={uploadMutation.isPending}
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {/* Drive Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Select Destination Drive</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {drives.map(drive => (
                    <button
                      key={drive.id}
                      className={`p-2 border rounded-lg flex flex-col items-center transition-colors ${
                        selectedDrive?.id === drive.id 
                          ? 'border-primary bg-primary/10' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedDrive(drive)}
                    >
                      <i className={`${
                        drive.type === 'google' ? 'ri-google-drive-fill text-blue-500' :
                        drive.type === 'onedrive' ? 'ri-microsoft-fill text-blue-400' :
                        drive.type === 'dropbox' ? 'ri-dropbox-fill text-blue-600' :
                        'ri-cloud-fill text-blue-400'
                      } text-2xl mb-1`}></i>
                      <span className="text-xs text-center truncate w-full">{drive.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Type Tabs */}
              <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                <button
                  className={`py-2 px-4 font-medium text-sm -mb-px ${
                    selectedTab === 'upload' 
                      ? 'border-b-2 border-primary text-primary' 
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  onClick={() => setSelectedTab('upload')}
                >
                  Upload New File
                </button>
                <button
                  className={`py-2 px-4 font-medium text-sm -mb-px ${
                    selectedTab === 'preset' 
                      ? 'border-b-2 border-primary text-primary' 
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  onClick={() => setSelectedTab('preset')}
                >
                  Use Demo File
                </button>
              </div>

              {selectedTab === 'upload' ? (
                <div>
                  <div 
                    className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {selectedFile ? (
                      <div className="flex flex-col items-center">
                        <FileIcon fileType={getFileType(selectedFile.name)} size="lg" className="mb-3" />
                        <div className="font-medium mb-1">{selectedFile.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {formatFileSize(Math.round(selectedFile.size / 1024))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <i className="ri-upload-cloud-2-line text-4xl text-gray-400 mb-3"></i>
                        <p className="mb-1">Drag and drop a file here or click to browse</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Max file size: 50MB</p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="grid grid-cols-2 gap-3">
                    {DEMO_FILES.map((demoFile, index) => (
                      <div 
                        key={index}
                        className={`border rounded-lg p-3 flex flex-col items-center cursor-pointer transition-colors ${
                          selectedPreset?.name === demoFile.name 
                            ? 'border-primary bg-primary/10' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                        }`}
                        onClick={() => handlePresetSelect(demoFile)}
                      >
                        <FileIcon fileType={demoFile.type} className="mb-2" />
                        <div className="text-center">
                          <div className="text-sm font-medium mb-1 line-clamp-1">{demoFile.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {formatFileSize(demoFile.size)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Progress */}
              {uploadMutation.isPending && (
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={uploadMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={
                  uploadMutation.isPending || 
                  (selectedTab === 'upload' && !selectedFile) || 
                  (selectedTab === 'preset' && !selectedPreset) ||
                  !selectedDrive
                }
              >
                {uploadMutation.isPending ? (
                  <span className="flex items-center">
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                    Uploading...
                  </span>
                ) : 'Upload'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}