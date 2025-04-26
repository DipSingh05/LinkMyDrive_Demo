import { useState } from 'react';
import * as RechartsPrimitive from 'recharts';
import { format } from 'date-fns';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { DRIVE_COLORS } from '@/lib/constants';

const getTimeInterval = (unit: 'hours' | 'days' | 'months') => {
  switch (unit) {
    case 'hours': return 60 * 60 * 1000;
    case 'days': return 24 * 60 * 60 * 1000;
    case 'months': return 30 * 24 * 60 * 60 * 1000;
    default: return 24 * 60 * 60 * 1000;
  }
};

const generateChartData = (uploads: any[], files: any[], points: number, unit: 'hours' | 'days' | 'months') => {
  const data = [];
  const now = new Date();
  const drives = ['google', 'onedrive', 'dropbox', 'icloud'];

  for (let i = points - 1; i >= 0; i--) {
    const date = new Date();
    if (unit === 'hours') date.setHours(date.getHours() - i);
    else if (unit === 'days') date.setDate(date.getDate() - i);
    else date.setMonth(date.getMonth() - i);

    const periodData: any = {
      timestamp: date.toISOString(),
      activities: []
    };

    // Initialize data for each drive
    drives.forEach(drive => {
      periodData[`${drive}Upload`] = 0;
      periodData[`${drive}Download`] = 0;
      periodData[`${drive}Delete`] = 0;
      periodData[`${drive}Share`] = 0;
    });

    // Process uploads
    uploads.forEach(upload => {
      const uploadDate = new Date(upload.uploadDate);
      if (uploadDate >= date && uploadDate <= new Date(date.getTime() + getTimeInterval(unit))) {
        const driveType = upload.driveId === 1 ? 'google' : 
                         upload.driveId === 2 ? 'onedrive' :
                         upload.driveId === 3 ? 'dropbox' : 'icloud';

        periodData[`${driveType}Upload`] += upload.fileSize;
        periodData.activities.push({
          name: upload.fileName,
          type: upload.fileType,
          size: upload.fileSize,
          source: driveType,
          operation: 'Upload',
          time: upload.uploadDate,
          path: upload.path || '/'
        });
      }
    });

    // Process file operations (deletions, downloads, shares)
    files.forEach(file => {
      const fileDate = new Date(file.lastModified);
      if (fileDate >= date && fileDate <= new Date(date.getTime() + getTimeInterval(unit))) {
        const driveType = file.driveId === 1 ? 'google' : 
                         file.driveId === 2 ? 'onedrive' :
                         file.driveId === 3 ? 'dropbox' : 'icloud';

        if (file.deletedAt) {
          periodData[`${driveType}Delete`] += file.size;
          periodData.activities.push({
            name: file.name,
            type: file.type,
            size: file.size,
            source: driveType,
            operation: 'Delete',
            time: file.deletedAt,
            path: file.path
          });
        }

        // Add download and share data if available
        if (file.downloads) {
          periodData[`${driveType}Download`] += file.size;
        }
        if (file.shares) {
          periodData[`${driveType}Share`] += file.size;
        }
      }
    });

    data.push(periodData);
  }
  return data;
};

const formatBytes = (bytes: number) => {
  const kb = bytes;
  if (kb < 1024) return `${kb} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(1)} GB`;
};

export function UploadStatistics() {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const [selectedDrive, setSelectedDrive] = useState<string | null>(null);

  // Generate demo data while loading
  const generateDemoData = () => {
    const demoUploads = [];
    const demoFiles = [];
    const now = new Date();
    
    for(let i = 0; i < 50; i++) {
      const date = new Date(now.getTime() - (i * 3600000)); // Past hours
      const drives = [1, 2, 3, 4];
      const sizes = [2048, 15360, 25600, 40960];
      
      demoUploads.push({
        userId: 1,
        driveId: drives[i % 4],
        fileId: i,
        fileName: `demo_file_${i}.pdf`,
        fileSize: sizes[i % 4],
        uploadTime: Math.random() * 10,
        uploadDate: date.toISOString(),
        fileType: 'pdf'
      });
    }
    
    return { uploads: demoUploads, files: demoFiles };
  };

  const demoData = generateDemoData();
  
  const { data: uploads = demoData.uploads } = useQuery<any[]>({
    queryKey: ['/api/uploads'],
    staleTime: 5 * 60 * 1000,
    initialData: demoData.uploads,
  });

  const { data: files = demoData.files } = useQuery<any[]>({
    queryKey: ['/api/files'],
    staleTime: 5 * 60 * 1000,
    initialData: demoData.files,
  });

  const chartData = {
    day: generateChartData(uploads, files, 24, 'hours'),
    week: generateChartData(uploads, files, 7, 'days'),
    month: generateChartData(uploads, files, 30, 'days'),
    year: generateChartData(uploads, files, 12, 'months')
  };

  if (!uploads?.length && !files?.length) {
    return (
      <Card className="w-full h-[600px] md:h-[500px] p-6">
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Loading upload statistics...</p>
        </div>
      </Card>
    );
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    switch (timeRange) {
      case 'day': return format(date, 'HH:mm');
      case 'week':
      case 'month': return format(date, 'MMM dd');
      case 'year': return format(date, 'MMM yyyy');
    }
  };

  const getDriveColor = (drive: string, operation: string) => {
    const colors = DRIVE_COLORS[drive as keyof typeof DRIVE_COLORS];
    return colors ? colors.text : '#666';
  };

  const getLineOpacity = (drive: string) => {
    return selectedDrive === null || selectedDrive === drive ? 1 : 0.2;
  };

  return (
    <Card className="w-full h-[600px] md:h-[500px] p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Storage Activity</h2>
        <div className="flex gap-4">
          <Select defaultValue="google" value={selectedDrive || 'google'} onValueChange={(value) => setSelectedDrive(value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Drive" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Drives</SelectItem>
              <SelectItem value="google">Google Drive</SelectItem>
              <SelectItem value="onedrive">OneDrive</SelectItem>
              <SelectItem value="dropbox">Dropbox</SelectItem>
              <SelectItem value="icloud">iCloud</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Past Day</SelectItem>
              <SelectItem value="week">Past Week</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
              <SelectItem value="year">Past Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="h-full max-w-screen-xl mx-auto">
        <ChartContainer 
          className="h-full" 
          config={{
            google: { color: '#4285F4' },
            onedrive: { color: '#0078D4' },
            dropbox: { color: '#0061FF' },
            icloud: { color: '#157EFB' }
          }}
        >
          <RechartsPrimitive.ResponsiveContainer width="100%" height={400}>
            <RechartsPrimitive.LineChart
              data={chartData[timeRange]}
              margin={{ top: 30, right: 30, bottom: 30, left: 50 }}
            >
              <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <RechartsPrimitive.XAxis 
                dataKey="timestamp"
                tickFormatter={formatTimestamp}
                dy={10}
                stroke="#666"
              />
              <RechartsPrimitive.YAxis 
                tickFormatter={formatBytes}
                dx={-10}
                stroke="#666"
              />
              {['google', 'onedrive', 'dropbox', 'icloud'].map(drive => (
                ['Upload', 'Download', 'Delete', 'Share'].map(operation => (
                  <RechartsPrimitive.Line
                    key={`${drive}${operation}`}
                    type="monotone"
                    dataKey={`${drive}${operation}`}
                    name={`${drive} ${operation}`}
                    stroke={getDriveColor(drive, operation)}
                    strokeWidth={2}
                    opacity={getLineOpacity(drive)}
                    dot={{ r: 3, strokeWidth: 2, fill: "#fff" }}
                    activeDot={{ r: 6, strokeWidth: 2, fill: "#fff" }}
                    connectNulls={true}
                  />
                ))
              ))}
              <RechartsPrimitive.Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;

                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-md">
                      <div className="font-medium">
                        {formatTimestamp(data.timestamp)}
                      </div>
                      {data.activities.map((activity: any, i: number) => (
                        <div key={i} className="mt-2 border-t pt-2">
                          <div className="font-medium">{activity.name}</div>
                          <div className="text-muted-foreground text-sm">
                            Operation: {activity.operation}<br />
                            Type: {activity.type.toUpperCase()}<br />
                            Size: {formatBytes(activity.size)}<br />
                            Drive: {activity.source}<br />
                            Path: {activity.path}<br />
                            Time: {format(new Date(activity.time), 'PPp')}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                }}
              />
            </RechartsPrimitive.LineChart>
          </RechartsPrimitive.ResponsiveContainer>
        </ChartContainer>
      </div>
    </Card>
  );
}