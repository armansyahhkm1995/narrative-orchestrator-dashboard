
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Folder, Edit } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { CampaignFolder } from '@/types/data';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(3, { message: 'Folder name must be at least 3 characters' }),
  description: z.string().min(5, { message: 'Description must be at least 5 characters' }),
});

type FormValues = z.infer<typeof formSchema>;

interface EditFolderDialogProps {
  folder: CampaignFolder;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditFolderDialog = ({ folder, open, onOpenChange }: EditFolderDialogProps) => {
  const { updateCampaignFolder } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: folder.name,
      description: folder.description,
    },
  });
  
  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      updateCampaignFolder({
        ...folder,
        name: data.name,
        description: data.description,
      });
      
      onOpenChange(false);
      toast.success('Campaign folder updated successfully');
    } catch (error) {
      toast.error('Failed to update campaign folder');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-purple-600" />
            Edit Campaign Folder
          </DialogTitle>
          <DialogDescription>
            Update the details of this campaign folder
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Folder Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditFolderDialog;
