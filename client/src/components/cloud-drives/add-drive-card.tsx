import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiRequest } from '@/lib/queryClient';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from "@/hooks/use-toast";
import { DriveInfo } from '@/lib/types';

export function AddDriveCard() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [driveType, setDriveType] = useState<string>('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  // Fetch current drives
  const { data: drives = [] } = useQuery<DriveInfo[]>({
    queryKey: ['/api/drives'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/drives');
      return res.json();
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!driveType || !email) return;

    // Max 8 drives check
    if (drives.length >= 5) {
      toast({
        title: 'Limit Reached',
        description: 'You can only connect up to 8 drives.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);

      toast({
        title: 'Success',
        description: "Connecting the drive successfully.\n note:-This is demo feature for demo purpose.",
        variant: 'default',
      });

      setDriveType('');
      setEmail('');
      setDialogOpen(false);
    } catch (error) {
      console.error('Error adding drive:', error);
      toast({
        title: 'Error',
        description: 'There was a problem connecting the drive.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div
        className="bg-white dark:bg-dark-surface rounded-lg shadow p-4 flex flex-col items-center justify-center text-center transition-all connect-button cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-bg animatedCard"
        onClick={() => {
          if (drives.length >= 5) {
            toast({
              title: 'Limit Reached',
              description: 'You can only connect up to 8 drives.',
              variant: 'destructive',
            });
            return;
          }
          setDialogOpen(true);
        }}
      >
        <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center mb-2">
          <i className="ri-add-line text-xl text-gray-400"></i>
        </div>
        <h3 className="font-medium">Connect New Drive</h3>
        <p className="text-xs text-gray-500 mt-1 truncate max-w-[180px] overflow-hidden whitespace-nowrap">
          Add another account
        </p>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Connect New Cloud Drive</DialogTitle>
            <DialogDescription>
              Add another cloud storage account to unify all your files in one place.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="drive-type">Drive Type</Label>
              <Select value={driveType} onValueChange={setDriveType}>
                <SelectTrigger id="drive-type" className="w-full">
                  <SelectValue placeholder="Select cloud service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google">
                    <div className="flex items-center">
                      <i className="ri-google-drive-fill text-red-600 mr-2"></i>
                      Google Drive
                    </div>
                  </SelectItem>
                  <SelectItem value="onedrive">
                    <div className="flex items-center">
                      <i className="ri-microsoft-fill text-blue-600 mr-2"></i>
                      OneDrive
                    </div>
                  </SelectItem>
                  <SelectItem value="dropbox">
                    <div className="flex items-center">
                      <i className="ri-dropbox-fill text-blue-600 mr-2"></i>
                      Dropbox
                    </div>
                  </SelectItem>
                  <SelectItem value="icloud">
                    <div className="flex items-center">
                      <i className="ri-cloud-fill text-gray-600 mr-2"></i>
                      iCloud
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Account Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full max-w-full truncate"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !driveType || !email}>
                {isSubmitting ? (
                  <span className="flex items-center">
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                    Connecting...
                  </span>
                ) : (
                  'Connect Drive'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
