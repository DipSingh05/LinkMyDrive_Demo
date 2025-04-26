import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileIcon } from './file-icon';
import { DRIVE_COLORS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { apiRequest } from '@/lib/queryClient';
import type { FileInfo, DriveInfo } from '@/lib/types';

interface TrashBinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TrashBin({ isOpen, onClose }: TrashBinModalProps) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]); // Added state for selected files
  const queryClient = useQueryClient();

  // Fetch deleted files (we'll simulate this with a special endpoint for deleted files)
  const { data: deletedFiles, isLoading } = useQuery<FileInfo[]>({
    queryKey: ['/api/files/deleted'],
    enabled: isOpen,
    // In a real app, we'd have an actual API endpoint for deleted files
    // For now, we'll just use the regular files endpoint and pretend some are deleted
    queryFn: async () => {
      try {
        const res = await fetch('/api/files/deleted');
        const files = await res.json();
        return files;
      } catch (error) {
        console.error('Error fetching deleted files:', error);
        return [];
      }
    }
  });

  // Fetch drives for reference
  const { data: drives } = useQuery({
    queryKey: ['/api/drives'],
    enabled: isOpen
  });

  // Permanently delete file mutation
  const permanentDeleteMutation = useMutation({
    mutationFn: async (fileId: number) => {
      return apiRequest('DELETE', `/api/files/${fileId}/permanent`);
    },
    onSuccess: () => {
      setConfirmDeleteId(null);
      // Refresh deleted files list
      queryClient.invalidateQueries({ queryKey: ['/api/files/deleted'] });
    }
  });

  // Restore file mutation
  const restoreMutation = useMutation({
    mutationFn: async (fileId: number) => {
      return apiRequest('PATCH', `/api/files/${fileId}/restore`);
    },
    onSuccess: () => {
      // Refresh both regular files and deleted files
      queryClient.invalidateQueries({ queryKey: ['/api/files'] });
      queryClient.invalidateQueries({ queryKey: ['/api/files/deleted'] });
    }
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatFileSize = (sizeInKB: number) => {
    if (sizeInKB < 1024) return `${sizeInKB} KB`;
    return `${(sizeInKB / 1024).toFixed(1)} MB`;
  };

  const getDriveName = (driveId: number) => {
    const drive = drives && Array.isArray(drives) ? drives.find((d: DriveInfo) => d.id === driveId) : undefined;
    return drive?.name || 'Unknown Drive';
  };

  const getDriveIcon = (driveId: number) => {
    const drive = drives && Array.isArray(drives) ? drives.find((d: DriveInfo) => d.id === driveId) : undefined;
    if (!drive) return { icon: 'ri-question-line', className: 'text-gray-600' };

    const driveType = drive.type as keyof typeof DRIVE_COLORS;
    const colors = DRIVE_COLORS[driveType];
    return { icon: colors.icon, className: colors.text };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-dark-surface rounded-xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <i className="ri-delete-bin-2-line text-xl text-red-500"></i>
            <h2 className="text-xl font-semibold">Trash Bin</h2>
          </div>
          <button 
            className="p-2  rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={onClose}
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : deletedFiles?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <i className="ri-delete-bin-line text-5xl mb-4"></i>
              <p className="text-lg">Your trash bin is empty</p>
              <p className="text-sm mt-2">Deleted files will appear here for 30 days</p>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Files in trash will be automatically deleted after 30 days
                </p>
                <Button variant="outline" size="sm" disabled={deletedFiles?.length === 0}>
                  <i className="ri-delete-bin-line mr-1"></i> Empty Trash
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-dark-bg">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                          checked={selectedFiles.length === deletedFiles?.length && deletedFiles.length > 0}
                          onChange={(e) => {
                            if (e.target.checked && deletedFiles) {
                              setSelectedFiles(deletedFiles.map(f => f.id));
                            } else {
                              setSelectedFiles([]);
                            }
                          }}
                        />
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">File Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Drive</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Size</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Deleted</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-dark-surface divide-y divide-gray-200 dark:divide-gray-700">
                    {deletedFiles?.map((file) => {
                      const driveIcon = getDriveIcon(file.driveId);

                      return (
                        <tr key={file.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                              checked={selectedFiles.includes(file.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedFiles([...selectedFiles, file.id]);
                                } else {
                                  setSelectedFiles(selectedFiles.filter(id => id !== file.id));
                                }
                              }}
                            />
                          </td>
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {/* @ts-ignore - deletedAt is a simulation */}
                            {formatDate(file.deletedAt || new Date().toISOString())}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <button 
                                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                                onClick={() => restoreMutation.mutate(file.id)}
                                disabled={restoreMutation.isPending}
                              >
                                {restoreMutation.isPending && restoreMutation.variables === file.id ? (
                                  <span className="flex items-center">
                                    <i className="ri-loader-4-line animate-spin mr-1"></i>
                                    Restoring...
                                  </span>
                                ) : "Restore"}
                              </button>
                              <span className="text-gray-300">|</span>
                              <button 
                                className="text-sm text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400 font-medium"
                                onClick={() => setConfirmDeleteId(file.id)}
                              >
                                Delete Forever
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>

      {/* Confirm Delete Dialog */}
      <AlertDialog open={confirmDeleteId !== null} onOpenChange={() => setConfirmDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Permanently Delete File?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The file will be permanently deleted from your drive and cannot be recovered.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (confirmDeleteId !== null) {
                  permanentDeleteMutation.mutate(confirmDeleteId);
                }
              }}
            >
              {permanentDeleteMutation.isPending ? (
                <span className="flex items-center">
                  <i className="ri-loader-4-line animate-spin mr-1"></i>
                  Deleting...
                </span>
              ) : "Delete Forever"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}