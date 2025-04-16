
import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { Campaign } from '@/types/data';
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

interface DeleteCampaignDialogProps {
  campaign: Campaign;
  folderId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeleteCampaignDialog = ({ campaign, folderId, open, onOpenChange }: DeleteCampaignDialogProps) => {
  const { deleteCampaign } = useData();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = () => {
    setIsDeleting(true);
    
    try {
      deleteCampaign(folderId, campaign.id);
      onOpenChange(false);
      toast.success('Campaign deleted successfully');
    } catch (error) {
      toast.error('Failed to delete campaign');
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
            Delete Campaign
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the campaign "{campaign.name}"? This action will remove all 
            posts made by the bots in this campaign and cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Deleting...' : 'Delete Campaign'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCampaignDialog;
