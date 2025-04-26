import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DriveCard } from "./drive-card";
import { AddDriveCard } from "./add-drive-card";
import { apiRequest } from "@/lib/queryClient";
import type { DriveInfo } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { RiDeleteBinLine } from "react-icons/ri";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export default function DriveDashboard() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: drives = [], isLoading } = useQuery<DriveInfo[]>({
    queryKey: ["/api/drives"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/drives");
      return res.json(); // ✅ This returns a Promise<DriveInfo[]>
    },
  });

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start w-full h-full">
      {/* Left section with scrollable cards */}
      <div className="w-full p-2 pr-4 h-[23rem] overflow-y-auto grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <p>Loading drives...</p>
        ) : (
          drives.map((drive) => (
            <div key={drive.id}>
              <DriveCard drive={drive} />
            </div>
          ))
        )}
      </div>

      {/* Right section with Add & Delete */}
      <div className="w-full sm:w-1/4 flex flex-row sm:flex-col justify-center gap-4">
        <AddDriveCard />

        <div
          className="bg-red-50 dark:bg-dark-surface rounded-lg shadow p-4 flex flex-col items-center justify-center text-center transition-all connect-button cursor-pointer hover:bg-red-50 dark:hover:bg-red-bg animatedCard"
          onClick={() => setDialogOpen(true)}
        >
          <div className="w-10 h-10 rounded-full border-2 border-dashed border-red-300 dark:border-red-600 flex items-center justify-center mb-2">
            <RiDeleteBinLine />
          </div>
          <h3 className="font-medium">Delete All Drives</h3>
          <p className="text-xs text-gray-500 mt-1 truncate max-w-[180px] overflow-hidden whitespace-nowrap">
            Remove all accounts
          </p>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete all drives?
            </DialogTitle>
            <DialogDescription>
              It will remove all cloud storage accounts.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button
              className="animatedCard"
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="animatedCard"
              variant="destructive"
              onClick={async () => {
                try {
                  await apiRequest("DELETE", "/api/drives");
                  await queryClient.invalidateQueries({
                    queryKey: ["/api/drives"],
                  });
                  setDialogOpen(false);
                } catch (error) {
                  console.error("Error deleting drives:", error);
                  toast({
                    title: "Error",
                    description: "Failed to delete drives. Try again.",
                    variant: "destructive",
                  });
                }
              }}
            >
              Delete All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
