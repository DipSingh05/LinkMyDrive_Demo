import type { 
  DriveInfo, 
  FileInfo, 
  SortOption, 
  PricingPlan, 
  TeamMember, 
  DownloadOption,
  UploadStats,
  GraphPoint
} from "./types";

export const DEFAULT_EMAIL = "demo@linkmydrives.com";
export const DEFAULT_PASSWORD = "demo123";

export const DEMO_WARNING = "This is a demo version of the product intended for collecting feedback and measuring early traction. The final product may differ significantly in terms of UI/UX, features, and pricing. Everything presented here is subject to change based on user feedback and development progress.";

export const SORT_OPTIONS: SortOption[] = [
  { field: 'name', direction: 'asc', label: 'Name (A-Z)' },
  { field: 'name', direction: 'desc', label: 'Name (Z-A)' },
  { field: 'size', direction: 'desc', label: 'Size (Largest)' },
  { field: 'size', direction: 'asc', label: 'Size (Smallest)' },
  { field: 'lastModified', direction: 'desc', label: 'Date (Newest)' },
  { field: 'lastModified', direction: 'asc', label: 'Date (Oldest)' }
];

export const DRIVE_COLORS = {
  google: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/20',
    text: 'text-yellow-600',
    accent: 'bg-yellow-500',
    icon: 'ri-drive-fill'
  },
  onedrive: {
    bg: 'bg-blue-100 dark:bg-blue-900/20',
    text: 'text-blue-600',
    accent: 'bg-blue-500',
    icon: 'ri-microsoft-fill'
  },
  dropbox: {
    bg: 'bg-blue-100 dark:bg-blue-900/20',
    text: 'text-blue-600',
    accent: 'bg-blue-500',
    icon: 'ri-dropbox-fill'
  },
  icloud: {
    bg: 'bg-gray-100 dark:bg-gray-700',
    text: 'text-gray-600 dark:text-gray-400',
    accent: 'bg-gray-500',
    icon: 'ri-cloud-fill'
  }
};

export const FILE_TYPE_ICONS = {
  pdf: { icon: 'ri-file-pdf-line', color: 'bg-red-100 dark:bg-red-900/20 text-red-600' },
  doc: { icon: 'ri-file-word-line', color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600' },
  image: { icon: 'ri-image-line', color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600' },
  video: { icon: 'ri-video-line', color: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600' },
  audio: { icon: 'ri-music-line', color: 'bg-pink-100 dark:bg-pink-900/20 text-pink-600' },
  spreadsheet: { icon: 'ri-file-excel-line', color: 'bg-green-100 dark:bg-green-900/20 text-green-600' },
  archive: { icon: 'ri-file-zip-line', color: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600' },
  presentation: { icon: 'ri-file-ppt-line', color: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600' },
  text: { icon: 'ri-file-text-line', color: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400' },
  other: { icon: 'ri-file-line', color: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400' }
};

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: 'Free',
    price: 0,
    description: 'Basic storage needs for personal use',
    features: [
      'Connect up to 2 cloud storage accounts',
      '5 GB of total storage',
      'Basic file management',
      'Web access only'
    ],
    buttonText: 'Sign Up Free'
  },
  {
    name: 'Basic',
    price: 49,
    yearly: (49*10),
    payg: '0.005/GB',
    description: 'For individuals with multiple cloud accounts',
    features: [
      'Connect up to 5 cloud storage accounts',
      '50 GB of total storage',
      'Advanced search capabilities',
      'Web and desktop access'
    ],
    buttonText: 'Get Started'
  },
  {
    name: 'Standard',
    price: 99,
    yearly: (99*8),
    payg: '0.004/GB',
    description: 'Perfect for professionals and small teams',
    features: [
      'Connect unlimited cloud storage accounts',
      '200 GB of total storage',
      'Priority support',
      'Web, desktop, and mobile access',
      'Advanced file analytics'
    ],
    highlighted: true,
    buttonText: 'Choose Plan'
  },
  {
    name: 'Premium',
    price: 149,
    yearly: (149*10),
    payg: '₹10/GB',
    description: 'For businesses with advanced needs',
    features: [
      'Connect unlimited cloud storage accounts',
      '1 TB of total storage',
      '24/7 priority support',
      'Web, desktop, and mobile access',
      'Advanced file analytics',
      'Team collaboration features',
      'Admin dashboard'
    ],
    buttonText: 'Choose Plan'
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Sarah Johnson',
    role: 'CEO & Founder',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
  },
  {
    name: 'Michael Chen',
    role: 'CTO',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
  },
  {
    name: 'Jessica Williams',
    role: 'Head of Product',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg'
  },
  {
    name: 'David Rodriguez',
    role: 'Lead Developer',
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg'
  },
  {
    name: 'Emily Thompson',
    role: 'UX Designer',
    avatar: 'https://randomuser.me/api/portraits/women/5.jpg'
  },
  {
    name: 'Robert Jackson',
    role: 'Marketing Director',
    avatar: 'https://randomuser.me/api/portraits/men/6.jpg'
  }
];

export const DOWNLOAD_OPTIONS: DownloadOption[] = [
  {
    platform: 'Windows',
    icon: 'ri-windows-fill',
    downloadUrl: '#windows-download',
    supportedVersions: 'Windows 10 & 11'
  },
  {
    platform: 'macOS',
    icon: 'ri-apple-fill',
    downloadUrl: '#macos-download',
    supportedVersions: 'macOS 10.14+'
  },
  {
    platform: 'Linux',
    icon: 'ri-ubuntu-fill',
    downloadUrl: '#linux-download',
    supportedVersions: 'Ubuntu 20.04+, Fedora 32+'
  },
  {
    platform: 'Android',
    icon: 'ri-android-fill',
    downloadUrl: '#android-download',
    supportedVersions: 'Android 8.0+'
  },
  {
    platform: 'iOS',
    icon: 'ri-apple-fill',
    downloadUrl: '#ios-download',
    supportedVersions: 'iOS 13+'
  }
];

export const REVIEW_TOPICS = [
  'Ease of Use',
  'Feature Completeness',
  'Design & UI',
  'Performance & Speed',
  'Value for Money'
];
