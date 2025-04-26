import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileIcon } from './file-icon';
import { FilePreviewModal } from './file-preview-modal';
import { UploadModal } from './upload-modal';
import { TrashBin } from './trash-bin';
import { SORT_OPTIONS, DRIVE_COLORS } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { FileInfo, SortOption, FileType, DriveInfo } from '@/lib/types';
import { ReactNode } from 'react';

export function FilesTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>(SORT_OPTIONS[4]); // Default to newest first
  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);
  const [selectedFileType, setSelectedFileType] = useState<FileType | 'all'>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isTrashBinOpen, setIsTrashBinOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch files data
  const { data: files, isLoading } = useQuery<FileInfo[]>({
    queryKey: ['/api/files'],
  });

  // Fetch drives data for drive names and icons
  const { data: drives } = useQuery<DriveInfo[]>({
    queryKey: ['/api/drives'],
  });
  
  // Delete file mutation
  const deleteMutation = useMutation({
    mutationFn: async (fileId: number) => {
      return apiRequest('DELETE', `/api/files/${fileId}`);
    },
    onSuccess: () => {
      // Refresh files list
      queryClient.invalidateQueries({ queryKey: ['/api/files'] });
      queryClient.invalidateQueries({ queryKey: ['/api/files/deleted'] });
      
      toast({
        title: "File moved to trash",
        description: "The file has been moved to the trash bin",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete the file: " + (error as Error).message,
        variant: "destructive",
      });
    }
  });

  // Filter files based on search term and selected file type
  const filteredFiles = files?.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        file.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedFileType === 'all' || file.type === selectedFileType;
    return matchesSearch && matchesType;
  }) || [];

  // Sort files based on selected option
  const sortedFiles = [...filteredFiles].sort((a, b) => {
    if (sortOption.field === 'name') {
      return sortOption.direction === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    
    if (sortOption.field === 'size') {
      return sortOption.direction === 'asc'
        ? a.size - b.size
        : b.size - a.size;
    }
    
    // lastModified
    const dateA = new Date(a.lastModified).getTime();
    const dateB = new Date(b.lastModified).getTime();
    return sortOption.direction === 'asc'
      ? dateA - dateB
      : dateB - dateA;
  });

  // Get unique file types for filter tabs
  const availableFileTypes = files 
    ? Array.from(new Set(files.map(file => file.type)))
    : [];

  // Count files by type for the tabs
  const getFileTypeCount = (type: FileType | 'all') => {
    if (type === 'all') return files?.length || 0;
    return files?.filter(file => file.type === type).length || 0;
  };

  const openFilePreview = (file: FileInfo) => {
    setSelectedFile(file);
  };

  const closeFilePreview = () => {
    setSelectedFile(null);
  };

  const handleUploadClick = () => {
    setIsUploadModalOpen(true);
  };

  const openTrashBin = () => {
    setIsTrashBinOpen(true);
  };

  const getDriveName = (driveId: number): string => {
    if (!drives || !Array.isArray(drives)) return 'Unknown Drive';
    const drive = drives.find(d => d.id === driveId);
    return drive?.name || 'Unknown Drive';
  };

  const getDriveIcon = (driveId: number): { icon: string; className: string } => {
    if (!drives || !Array.isArray(drives)) {
      return { icon: 'ri-question-line', className: 'text-gray-600' };
    }
    
    const drive = drives.find(d => d.id === driveId);
    if (!drive) return { icon: 'ri-question-line', className: 'text-gray-600' };
    
    const driveType = drive.type as keyof typeof DRIVE_COLORS;
    const colors = DRIVE_COLORS[driveType];
    return { icon: colors.icon, className: colors.text };
  };

  const formatFileSize = (sizeInKB: number) => {
    if (sizeInKB < 1024) return `${sizeInKB} KB`;
    return `${(sizeInKB / 1024).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-dark-surface rounded-lg shadow overflow-hidden animate-pulse">
        <div className="h-16 border-b border-gray-200 dark:border-gray-700 flex items-center px-6"></div>
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">All Files</h2>
          <button 
            onClick={openTrashBin} 
            className="outline outline-red-500 outline-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 px-2 py-1 flex items-center rounded-md hover:bg-red-100 dark:hover:bg-red-100"
            title="Trash Bin"
          >
            <i className="ri-delete-bin-line text-lg mr-1"></i>
            <span>Trash</span>
          </button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Bar */}
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search files..." 
              className="w-full md:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <i className="ri-search-line"></i>
            </div>
          </div>
          
          {/* Sort Dropdown */}
          <div className="relative">
            <select 
              className="appearance-none w-full bg-white dark:bg-dark-bg pl-4 pr-8 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
              value={`${sortOption.field}-${sortOption.direction}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split('-');
                const newSortOption = SORT_OPTIONS.find(
                  option => option.field === field && option.direction === direction
                );
                if (newSortOption) {
                  setSortOption(newSortOption);
                }
              }}
            >
              {SORT_OPTIONS.map((option, index) => (
                <option 
                  key={index} 
                  value={`${option.field}-${option.direction}`}
                >
                  Sort by: {option.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-2.5 text-gray-500 pointer-events-none">
              <i className="ri-arrow-down-s-line"></i>
            </div>
          </div>
          
          {/* Upload Button */}
          <button 
            onClick={handleUploadClick}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
          >
            <i className="ri-upload-2-line"></i>
            <span>Upload</span>
          </button>
        </div>
      </div>
      
      {/* File Type Tabs */}
      <div className="flex overflow-x-auto pb-2 mb-4 scrollbar-thin">
        <button
          onClick={() => setSelectedFileType('all')}
          className={`px-4 py-2 rounded-full whitespace-nowrap flex items-center mr-2 ${
            selectedFileType === 'all'
              ? 'bg-primary text-white'
              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <i className="ri-folder-line mr-2"></i>
          All Files
          <span className="ml-2 bg-white bg-opacity-20 text-xs py-0.5 px-1.5 rounded-full">
            {getFileTypeCount('all')}
          </span>
        </button>
        
        {(() => {
  if (!files) return null;

  const types = Array.from(new Set(files.map(file => file.type)));
  const FileTypeIndex = types.indexOf("video");
  if (FileTypeIndex !== -1) {
    types.splice(FileTypeIndex, 1);
    const insertPosition = Math.max(types.length - 2, 0);
    types.splice(insertPosition, 0, "video"); // insert at 3rd from end
  }

  return types.map((fileType) => (
    <button
      key={fileType}
      onClick={() => setSelectedFileType(fileType)}
      className={`px-4 py-2 rounded-full whitespace-nowrap flex items-center mr-2 ${
        selectedFileType === fileType
          ? 'bg-primary text-white'
          : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      <FileIcon fileType={fileType} className="mr-2" size="sm" />
      {fileType.charAt(0).toUpperCase() + fileType.slice(1)}
      <span className="ml-2 bg-white bg-opacity-20 text-xs py-0.5 px-1.5 rounded-full">
        {getFileTypeCount(fileType)}
      </span>
    </button>
  ));
})()}



      </div>
      
      {/* Files Table */}
      <div className="bg-white dark:bg-dark-surface rounded-lg shadow overflow-hidden">
        <div className="overflow-auto h-[31rem] scrollbar-thin">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-dark-bg">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">File Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Drive</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Size</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Modified</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedFiles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center">
                      <i className="ri-file-search-line text-4xl mb-2"></i>
                      <p>No files found{searchTerm ? ` matching "${searchTerm}"` : ''}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedFiles.map((file) => {
                  const driveIcon = getDriveIcon(file.driveId);
                  
                  return (
                    <tr 
                      key={file.id} 
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                      onClick={() => openFilePreview(file)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileIcon fileType={file.type} className="mr-3" />
                          <div>
                            <div className="font-medium">{file.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {file.type.charAt(0).toUpperCase() + file.type.slice(1)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <i className={`${driveIcon.icon} ${driveIcon.className} mr-2`}></i>
                          <span>{getDriveName(file.driveId)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{formatFileSize(file.size)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(file.lastModified)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                          <button className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" title="Download">
                            <i className="ri-download-line"></i>
                          </button>
                          <button className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" title="Share">
                            <i className="ri-share-line"></i>
                          </button>
                          <button 
                            className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30" 
                            title="Delete"
                            onClick={() => {
                              deleteMutation.mutate(file.id);
                            }}
                            disabled={deleteMutation.isPending}
                          >
                            <i className={`ri-delete-bin-line text-red-600 dark:text-red-500 ${deleteMutation.isPending && deleteMutation.variables === file.id ? 'opacity-50' : ''}`}></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* File Preview Modal */}
      {selectedFile && (
        <FilePreviewModal file={selectedFile} onClose={closeFilePreview} />
      )}
      
      {/* Upload Modal */}
      {drives && Array.isArray(drives) && (
        <UploadModal 
          drives={drives} 
          isOpen={isUploadModalOpen} 
          onClose={() => setIsUploadModalOpen(false)} 
        />
      )}
      
      {/* Trash Bin Modal */}
      <TrashBin 
        isOpen={isTrashBinOpen} 
        onClose={() => setIsTrashBinOpen(false)} 
      />
    </section>
  );
}
