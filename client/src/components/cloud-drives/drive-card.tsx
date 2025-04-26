import { useState } from 'react';
import { DRIVE_COLORS } from '@/lib/constants';
import type { DriveInfo } from '@/lib/types';
import { apiRequest } from '@/lib/queryClient';
import { useQueryClient } from '@tanstack/react-query';
import { RiDeleteBinFill } from "react-icons/ri";


interface DriveCardProps {
  drive: DriveInfo;
}

export function DriveCard({ drive }: DriveCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();

  const { name, type, email, totalSpace, usedSpace, isConnected, id } = drive;
  const usedPercentage = Math.round((usedSpace / totalSpace) * 100);
  const driveStyle = DRIVE_COLORS[type as keyof typeof DRIVE_COLORS] || DRIVE_COLORS.icloud;

  const deleteDrive = async (id: number) => {
    try {
      await apiRequest('DELETE', `/api/drives/${id}`);
      queryClient.invalidateQueries({ queryKey: ['/api/drives'] });
    } catch (error) {
      console.error('Failed to delete drive:', error);
    }
  };

  const toggleConnection = async () => {
    try {
      setIsUpdating(true);
      await apiRequest('PATCH', `/api/drives/${id}/toggle`, { isConnected: !isConnected });
      queryClient.invalidateQueries({ queryKey: ['/api/drives'] });
    } catch (error) {
      console.error('Error toggling drive connection:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      className={`animatedCard bg-white dark:bg-dark-surface rounded-lg shadow p-4 transition-all ${
        isUpdating ? 'opacity-70' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className={`w-10 h-10 rounded-lg ${driveStyle.bg} flex items-center justify-center ${driveStyle.text}`}>
          <i className={`${driveStyle.icon} text-xl`}></i>
        </div>

        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isConnected}
            onChange={toggleConnection}
            disabled={isUpdating}
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
        </label>
      </div>

      <div className='flex justify-between items-center'>
      <h3 className="font-medium">{name}</h3>
      <button
                onClick={() => deleteDrive(drive.id) }
                className="rounded"
              >
                <RiDeleteBinFill />
              </button>
      </div>

      <p
        className="text-sm text-gray-600 dark:text-gray-400 mb-2 truncate max-w-full overflow-hidden whitespace-nowrap"
        title={email}
      >
        {email}
      </p>

      <div className="text-xs text-gray-500 dark:text-gray-500">
        <span>
          {(usedSpace / 1024).toFixed(1)} GB / {(totalSpace / 1024).toFixed(1)} GB
        </span>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
          <div
            className={`${driveStyle.accent} h-1.5 rounded-full`}
            style={{ width: `${usedPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
