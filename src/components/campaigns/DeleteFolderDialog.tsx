
import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { CampaignFolder } from '@/types/data';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface DeleteFolderDialogProps {
  folder: CampaignFolder;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeleteFolderDialog = ({ folder, open, onOpenChange }: DeleteFolderDialogProps) => {
  const { deleteCampaignFolder } = useData();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = () => {
    setIsDeleting(true);
    
    try {
      deleteCampaignFolder(folder.id);
      onOpenChange(false);
      toast.success('Campaign folder deleted successfully');
    } catch (error) {
      toast.error('Failed to delete campaign folder');
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Delete Campaign Folder
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the folder "{folder.name}"? This action will also delete
            all campaigns within this folder and cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Deleting...' : 'Delete Folder'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteFolderDialog;
