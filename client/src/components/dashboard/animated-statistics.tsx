import { useState, useEffect } from "react";
import * as RechartsPrimitive from "recharts";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Demo data generator
const generateDemoData = (days: number) => {
  const data = [];
  const now = new Date();
  const driveTypes = ["google", "onedrive", "dropbox", "icloud"];
  const fileTypes = ["pdf", "doc", "img", "video"];
  const locations = ["/documents", "/images", "/videos", "/downloads"];

  for (let i = 0; i < days; i++) {
    const dayData: any = {
      date: new Date(now.getTime() - i * 24 * 60 * 60 * 1000).toISOString(),
      uploads: [],
      totalSize: 0,
    };

    const uploadsCount = Math.floor(Math.random() * 4) + 1;
    for (let j = 0; j < uploadsCount; j++) {
      const driveType =
        driveTypes[Math.floor(Math.random() * driveTypes.length)];
      const fileType = fileTypes[Math.floor(Math.random() * fileTypes.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];

      const fileSize = Math.floor(Math.random() * 1000) + 100;

      dayData.uploads.push({
        driveType,
        fileName: `file_${i}_${j}.${fileType}`,
        fileType,
        fileSize,
        uploadTime: format(new Date(dayData.date), "HH:mm"),
        location,
      });

      dayData.totalSize += fileSize;
    }

    data.push(dayData);
  }

  return data.reverse();
};

export function AnimatedStatistics() {
  const [timeRange, setTimeRange] = useState<"week" | "month">("week");
  const [data, setData] = useState(generateDemoData(7));

  useEffect(() => {
    setData(generateDemoData(timeRange === "week" ? 7 : 30));
  }, [timeRange]);

  const driveColors = {
    google: "#4285F4",
    onedrive: "#0078D4",
    dropbox: "#0061FF",
    icloud: "#157EFB",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full p-4 overflow-hidden shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Upload Activity</h2>
          <Select
            value={timeRange}
            onValueChange={(value: "week" | "month") => setTimeRange(value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Past Week</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="h-48 w-full overflow-x-auto">
          <ChartContainer
            className="h-full"
            config={{
              google: { color: driveColors.google },
              onedrive: { color: driveColors.onedrive },
              dropbox: { color: driveColors.dropbox },
              icloud: { color: driveColors.icloud },
            }}
          >
            <RechartsPrimitive.ResponsiveContainer width="100%" height="100%">
              <RechartsPrimitive.LineChart
                data={data}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <RechartsPrimitive.CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#ccc"
                />
                <RechartsPrimitive.XAxis
                  dataKey="date"
                  tickFormatter={(date) => format(new Date(date), "MMM dd")}
                  stroke="#666"
                />
                <RechartsPrimitive.YAxis
                  tickFormatter={(size) => `${size} MB`}
                  stroke="#666"
                />
                <RechartsPrimitive.Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    const day = payload[0].payload;

                    return (
                      <div className="bg-background border rounded-lg p-3 shadow-lg max-w-xs">
                        <p className="font-medium">
                          {format(new Date(label), "MMM dd, yyyy")}
                        </p>
                        <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                          {day.uploads.map((upload: any, index: number) => (
                            <div key={index} className="border-t pt-2">
                              <p className="font-medium">{upload.fileName}</p>
                              <p className="text-sm text-muted-foreground">
                                Drive: {upload.driveType}
                                <br />
                                Size: {upload.fileSize} MB
                                <br />
                                Time: {upload.uploadTime}
                                <br />
                                Location: {upload.location}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }}
                />
                <RechartsPrimitive.Line
                  type="monotone"
                  dataKey="totalSize"
                  stroke="#4285F4"
                  strokeWidth={2.5}
                  dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                  activeDot={{ r: 6, strokeWidth: 2, fill: "#fff" }}
                  animationDuration={1500}
                  connectNulls
                />
              </RechartsPrimitive.LineChart>
            </RechartsPrimitive.ResponsiveContainer>
          </ChartContainer>
        </div>
      </Card>
    </motion.div>
  );
}
