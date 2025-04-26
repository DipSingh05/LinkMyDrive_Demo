import { FILE_TYPE_ICONS } from '@/lib/constants';
import type { FileType } from '@/lib/types';

interface FileIconProps {
  fileType: FileType;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function FileIcon({ fileType, className = '', size = 'md' }: FileIconProps) {
  const iconConfig = FILE_TYPE_ICONS[fileType] || FILE_TYPE_ICONS.other;
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };
  
  return (
    <div className={`file-icon ${iconConfig.color} ${sizeClasses[size]} flex items-center justify-center rounded-md ${className}`}>
      <i className={`${iconConfig.icon} text-xl`}></i>
    </div>
  );
}
