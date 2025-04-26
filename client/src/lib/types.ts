// Common types used in the app

export interface FeedbackFormData {
  fullName: string;
  designation: string;
  understandGoal: number;
  solvesProblem: number;
  designAndUX: number;
  pricingStructure: number;
  features: number;
  goalFeedback?: string;
  problemFeedback?: string;
  designFeedback?: string;
  pricingFeedback?: string;
  featuresFeedback?: string;
}

export interface RegistrationData {
  email: string;
  timestamp: string;
  preregistered: boolean;
  feedback?: FeedbackFormData;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface DriveInfo {
  id: number;
  userId: number;
  name: string;
  type: 'google' | 'onedrive' | 'dropbox' | 'icloud';
  email: string;
  totalSpace: number; // in MB
  usedSpace: number; // in MB
  isConnected: boolean;
  createdAt: string;
}

export interface FileInfo {
  id: number;
  driveId: number;
  userId: number;
  name: string;
  path: string;
  type: FileType;
  size: number; // in KB
  lastModified: string;
  createdAt: string;
}

export interface UploadStats {
  id: number;
  userId: number;
  driveId: number;
  fileId: number;
  fileName: string;
  fileSize: number; // in KB
  uploadTime: number; // in seconds
  uploadDate: string;
  fileType: string;
}

export type FileType = 'pdf' | 'doc' | 'image' | 'video' | 'audio' | 'spreadsheet' | 'archive' | 'presentation' | 'text' | 'other';

export interface FilePreviewProps {
  file: FileInfo;
  onClose: () => void;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SearchResult {
  files: FileInfo[];
}

export interface ReviewFormData {
  rating: number;
  feedback?: string;
  topic: string;
}

export interface PricingPlan {
  name: string;
  price: string | number;
  yearly?: string | number;
  payg?: string | number;
  description: string;
  features: string[];
  highlighted?: boolean;
  buttonText: string;
}

export type SortDirection = 'asc' | 'desc';
export type SortField = 'name' | 'size' | 'lastModified';

export interface SortOption {
  field: SortField;
  direction: SortDirection;
  label: string;
}

export interface TeamMember {
  name: string;
  role: string;
  avatar: string;
}

export interface DownloadOption {
  platform: string;
  icon: string;
  downloadUrl: string;
  supportedVersions: string;
}

export interface GraphPoint {
  x: number; // file size in MB
  y: number; // upload time in seconds
  driveId: number;
  driveName: string;
  fileName: string;
  fileSize: string;
  uploadTime: string;
  fileType: string;
  uploadDate: string;
}
